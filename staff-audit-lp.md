https://github.com/0xMacro/student.leeftk/tree/9dc12917b4f864e5c4eb7b860c9ebdaa7365bb97/lp

Audited By: Melville


# General Comments

This is the most difficult project, and there are many subtle gotchas in how the Router & Pool should each work in order to both protect LP's and Traders. I think you understood the high level purpose of each of the functions in the Router + Pool, but the details need a revisit.

In particular, I think you were unclear on what the responsibilities of the Router were, and how those are distinct from the Pool. The Pool needs to handle everything pertaining to the ETH and SPC assets. It needs to check that the constant product formula is upheld in swap, and it needs to move all assets from the pool itself. The Router should not be updating any state, because all of its state should be immutable (`spaceCoin` + `spaceLP`). In `deposit` the Pool needs to ensure that the depositor received the correct amount of LP token, based on the ETH & SPC they deposited. In `withdraw` the Pool needs to ensure that the withdrawer receives the correct amount of ETH & SPC based on the amount of LP token they're burning. 

See my issues below, as they give more detail on each of the issues.

Let's schedule some time to go over the issues here and end with you feeling confident on fixing each of these issues.

When you fix this for one of your Project Corrections we can get all these issues fixed :)

# Design Exercise

1. Well said, you understand the primary tradeoffs of using staking & yield farming

2. OK, but we're looking for more detail here. In particular, what Solidity code would you use to implement features like:

a) keep track of each staker's cumulative rewards
b) handle cases where stakers who join later should receive fewer rewards than those who joined earlier
c) implement it efficiently (if any function requires iterating over all stakers, that's going to be inefficient and possibly a High Sev issue if there is not enough gas in a block to complete the transaction)

See the Staff Solution for one of the most important algorithms in DeFi (Synthetix's StakingRewards contract: https://learn.0xmacro.com/training/project-lp/p/2)


# Issues

## **[L-1]** `withdraw()` can be called before Open phase (1 point)

Your `withdraw` function in `Ico.sol` allows the owner to withdraw the funds at any time. In particular, they can withdraw the ether before the Open phase, so before contributors are able to claim any SPC. This introduces a trust assumption - contributors during the Seed and General phase need to trust the owner to advance the phase to Open, or else their contributions can be rugged by the creator.

Consider restricting the `withdraw` function so that it can only be successfully called during the Open phase.

## **[Technical-Mistake-1]** `SpaceLP.withdraw` is half implemented (2 points)

Your SpaceLP's `withdraw` does not transfer out any ETH or SPC after burning the caller's LP token, but it should. There is no incentive for anyone to ever call this function.

It also should update the reserves of ETH and SPC to reflect the assets that are transferred out.

Ah, I sorta see now how in `SpaceRouter.withdraw` you have some logic for doing the ETH & SPC transfer. This calculation is correct:

```solidity
uint amount1 = lpToken / spaceLP.totalSupply() * reserve1;
uint amount2 = lpToken / spaceLP.totalSupply() * reserve2;
```

The problem however is that this `removeLiquidity` function is removing liquidity **from the Router to the msg.sender**, but it should be **from the Pool to the msg.sender**. But this is strange, because the Router isn't supposed to be holding any ETH or SPC. If it holds anything of value, then it will be difficult to upgrade the Router in the event of a bugfix or feature-change. If the Router holds no coins, then it is a simple task of deploying a new Router and pointing any frontend dapps at the new Router.

I think you need to rethink and rewrite both `removeLiquidity` and `withdraw`. The Router should simply transfer the LP token that the user wants to burn from the `msg.sender` to the pool, and then the pool should calculate how many assets the user is due given the proportion of LP token they're burning. Please implement this, and test it for happy + sad paths.

## **[Technical-Mistake-2]** `SpaceLP.withdraw`'s calculation of how many ETH & SPC to send back to the user is incorrect (2 points)

In SpaceLP's `withdraw` you have the following calculation for the amount of ETH and SPC to send back to the user:

```solidity
uint amount1 =  balance1 * reserve1 / totalSupply();
uint amount2 =  balance2 * reserve2 / totalSupply();
```

This calculation is not correct for a couple reasons:

1) it doesn't take into account the amount of LP token that the user is burning. This needs to happen, or otherwise someone can burn a single wei of LP token and get an outsized amount of assets out
2) it takes the square of the balance (assuming balance1 == reserve1, which is going to be the case often) and divides by the totalSupply, but this doesn't have anything to do with the amount the user should be owed

`withdraw` should take see the amount of LP token the user transferred in, burn it, and then transfer out the amount of ETH & SPC **according to the proportion of LP token the user burned relative to the total supply of LP token**.

So if the user burns 20% of the total LP token, they should receive 20% of the pool's reserves of ETH & SPC.

It's similar to any sort of venture where shareholders own the company proportional to their shares. If a shareholder owns 51% of the total shares, then they own 51% of the total value of the venture.

## **[Technical-Mistake-3]** `SpaceRouter.addLiquidity` transfers far more ETH & SPC from the user than it should (2 points)

In line 35 and 37 of `addLiquidity` you have the line:

`amountSpc = reserve1 * reserve2 * spc;`

`uint amountEth = reserve1 * reserve2 * msg.value;`

respectively. These amounts are needlessly increased from the amounts that the user actually wants to deposit into the pool (i.e. `spc` and `msg.value`).

I _think_ you were trying to use the x * y = k formula to get the ratios of ETH and SPC to align with the ratio of the reserves, but that's not what is going to happen here.

Instead, you should have some code that looks at the current ratio of the reserves, and determines which of `spc` or `msg.value` needs to be reduced in order to get the amounts of `spc` and `msg.value` in the same ratio as the reserves.

## **[Technical-Mistake-4]** `SpaceRouter.swapSpcForEth` doesn't account for feeOnTransfer tokens such as SPC (2 points)

In your Router's `swapSpcForEth` function you do not correctly handle the case where the 2% SPC transfer tax is turned on, and it will cause all calls to your Router's swap function to revert. Consider the following snippet of code:

```solidity
function swapSpcForEth(uint amountSpcIn, uint amountEthMin, address to) external {
    (bool spcTransferSuccess) = spaceCoin.transferFrom(to, address(pool), amountSpcIn);
    require(spcTransferSuccess, "Router: SPC_TRANSFER_FAILED");

    (uint spcReserves, uint ethReserves) = pool.getReserves();
    uint amountEthOut = getMaxAmountOut(amountSpcIn, spcReserves, ethReserves);
    require(amountEthOut >= amountEthMin, "Router: ETH_OUT_BELOW_MIN");

    pool.swap(to, 0, amountEthOut);
}
```

When the 2% tax is turned on, the Router uses `transferFrom` to send `amountSpcIn` to the Pool, but only `98 * amountSpcIn / 100` is actually received by the pool. However, in `getMaxAmountOut` the Router calculates how much ETH should be withdrawable **as if the full amount of `amountSpcIn` had been received by the Pool**. Now, in `pool.swap`, this will result in the `newK >= oldK` constant product formula check to fail. It fails because only 98% of `amountSpcIn` was sent to the Pool, when actually the full `amountSpcIn` value must be sent to the pool in order to withdraw `amountEthOut`.

Consider using the actual amount of SPC received by the Pool when calculating the amount of ETH the `to` address should receive.

One way to do this is to first read the Pool's SPC balance, then send the SPC to the pool, then measure the different between the previous balance and the new balance:

```solidity
uint256 balanceBefore = spaceCoin.balanceOf(address(pool));
(bool spcTransferSuccess) = spaceCoin.transferFrom(to, address(pool), amountSpcIn);
require(spcTransferSuccess, "Router: SPC_TRANSFER_FAILED");
uint256 actualSpcIn = spaceCoin.balanceOf(address(pool)) - balanceBefore;
// rest of swap code...
```

## **[Technical-Mistake-5]** `SpaceRouter.swapETHForSPC` & `SpaceRouter.swapSPCForETH` are incorrectly implemented  (3 points)

There are several parts of these functions that are incorrectly implemented and going to lead to problems.

1. In line 72 you have `reserve1 + msg.value`, but in line 87 you have `reserve1 + spcIn`. How can you add 2 different units (`msg.value` which is in units of ETH, and `spcIn`, which is in units of SPC) to `reserve1`? Based on your implementation of `SpaceLP.deposit` `reserve1` is in units of SPC, so you need to use `reserve2` for line 72.
2. The Router doesn't transfer any ETH or SPC to the pool, and so no swaps can actually be performed. You need to transfer the ETH (for `swapETHForSPC`) or SPC (for `swapSPCForETH`) into the pool, and then do the constant product formula calculation in the pool
3. In lines 91 and 92 you update `reserve1` and `reserve2`, however this is a no-op because those variables were read via `getReserves`, and so they're just local variables that will go away once the function ends

See Technical-Mistake-5 for further issues

## **[Technical-Mistake-6]** `SpaceLP.swap` is not swapping correctly (2 points)

There's several issues with this function

1. It doesn't check that the constant product formula (x * y = k) holds after the swap has been performed, so the LP's can be defrauded by users who swap funds and decrease the total value held in the pool. This can be done in line 75 and 76 where some amount X of SPC is transferred from `msg.sender` to the pool, and that same amount X of ETH is transfer out of the pool. If the value of SPC is less than the value of ETH (which is likely true), then this can be used to maliciously drain the pool
2. Line 69 is a no-op, because it's sending funds from the pool to itself. You need to change the `payable(address(this)).call{value: msg.value}("");` to `payable(to).call{value: msg.value}("");`, and you shouldn't send out the same value passed in
3. There's no calculation to see when X ETH or Y SPC was passed in, what is the correct amount of SPC or ETH to send out. This should use the constant product formula to do this calculation

Please fix these issues

## **[Technical-Mistake-7]** Router’s `addLiquidity` function does not account for feeOnTransfer tokens such as SPC (1 point)

Your `Router.addLiquidity` function does not handle feeOnTransfer tokens like SPC, and so when the Router transfers in X ETH and Y SPC in the correct ratio (according to the reserve ratio), this is going to be reduced to `0.98 * Y` SPC that actually  makes it to the pool, and then in this snippet in `SpaceLP.deposit`:

```solidity
uint amount1 = amount1 * totalSupply() / reserve1;
uint amount2 = amount2 * totalSupply() / reserve2;
liquidity = getMin(amount1, amount2);
```

the `amount1` (the SPC amount) is going to be less, and thus `liquidity` is going to be 98% of what it should be. That other 2% is going to be donated to the pool. This hurts the individual LP that's depositing funds.

Consider checking in your Router if the tax is turned on, and if it is then reduce the ETH amount you send to the pool by 98% so that equal ratios of SPC and ETH get sent, and the LP doesn't get harmed. That remaining 2% ETH should be sent back to the user.

## **[Insufficient-Testing]** Testing is barebones (2 points)

There's not enough tests here to feel confident this contract is going to do what it's supposed to do.

I say that because there is only 1 happy-path test for each Router function, and 1 sad-path test for each Router function (and most of the sad-path tests do not test interesting failure cases). What happened here, I'm guessing you ran out of time?

We want to see more in-depth testing, in particular there should be test cases for:

1) testing that the slippage parameter works as expected
2) turning on the tax and making sure that every function works correctly
3) testing cases where the reserves of the pool have changed in between a transaction function call to `addLiquidity` or `swapETHForSPC` being signed, and it being included in a block
4) making sure that that the swap fees are increasing correctly
5) adding liquidity more than once should work as expected

The LP project (and most complicated smart contract projects you're going to work on) have the bulk of the time spent writing them in writing tests. So don't be surprised if writing the tests takes longer than writing the contracts themselves!

## **[Unfinished-Feature-1]** Frontend missing functionality (1 point)

Your frontend doesn't call any of the router functions.

It also assumes a fixed ratio of 1 ETH: 5 SPC, which is not going to be the case for the LP project.

## **[Unfinished-Feature-2]** deploy script & Etherscan verification missing from contracts (1 point)

All of your deployed contracts' verification are missing! But this was asked for in the spec.

We want you to get experience verifying the contracts you deploy, because even if you have the most useful contract in the world, nobody with any sense is going to trust it if its source code is unverified.

Also, I'm not sure how you deployed them, but you there's no deploy script in your project. Did you just copy these to Remix or some other dapp? 

Checkout the Hardhat docs for the easiest and most robust way to verify the contracts you deploy in your deploy script

https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#using-programmatically

remember that after you deploy a contract, you should call `.wait` so that the Etherscan will have enough time to index the block that the deployment transaction is in, otherwise when you go to verify the contract you'll get an error saying something like "this contract doesn't exist"

```ts
const tx = await deployMyContract(arg1, arg2);
await tx.wait()
```


## **[Q-1]** Enable solidity compiler optimizer

Solidity opcode-based optimizer applies a set of simplification rules to the bytecode of the contracts to reduce gas cost on function calls. For more info check this link: https://hardhat.org/hardhat-runner/docs/guides/compile-contracts#configuring-the-compiler

Consider enabling solidity optimizer with at least a low level of runs:

``` javascript
solidity: { 
  version: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 20_000,
    },
  },
}
```

## **[Q-2]** Router functions marked `payable` despite not needing to accept ETH

Your SpaceRouter's `constructor` and `swapSPCForETH` functions accept ETH, but have no need to do so. Especially for the constructor this is confusing because the Router should never hold ETH if it's used honestly.

Consider removing the `payable` keyword from those functions.

## **[Q-3]** Needless `.call` send of ETH in SpaceRouter.addLiquidity

In line 40 of SpaceRouter you have the following 3 lines of code:

```solidity
(bool success, ) = address(spaceLP).call{value: msg.value}("");   
require(success, "Transfer failed.");
spaceLP.deposit(msg.sender);
```

That first and second line are not needed, because `deposit` is marked `payable`, so you can simply do:

`spaceLP.deposit{value: msg.value}(msg.sender);`

## **[Q-4]** There are no events emitted in your functions

In both SpaceRouter and SpaceLP, none of the state-changing functions emit events. This means your offchain clients (such as the dapp built by your frontend team) will have very little information on what is happening on your contract.

Consider declaring events for each of your state-changing functions, and `emit` those in your functions

# Score

| Reason | Score |
|-|-|
| Late                       | 3 |
| Unfinished features        | 2 |
| Extra features             | - |
| Vulnerability              | 1 |
| Unanswered design exercise | - |
| Insufficient tests         | 2 |
| Technical mistake          | 14 |

Total: 23

