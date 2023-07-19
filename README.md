# LP Project

## Setup

See [README-Setup.md](./README-Setup.md)

## Technical Spec

Router Contract

        - AddLiquidity

        - RemoveLiquidity

Lp Contract

        - Swap

        - Mint(deposit)

        - Burn(withdraw)

## Code Coverage Report

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |     57.8 |    21.11 |       56 |    53.06 |                |
  Ico.sol           |        0 |        0 |        0 |        0 |... 192,193,194 |
  LiquidityPool.sol |      100 |      100 |      100 |      100 |                |
  Router.sol        |      100 |      100 |      100 |      100 |                |
  SpaceCoin.sol     |    54.55 |    16.67 |    66.67 |    57.14 |... 44,45,46,47 |
  SpaceLP.sol       |    92.31 |       70 |      100 |    90.91 |       43,44,45 |
  SpaceRouter.sol   |    86.84 |    42.31 |      100 |    88.89 | 35,45,46,47,48 |
--------------------|----------|----------|----------|----------|----------------|
All files           |     57.8 |    21.11 |       56 |    53.06 |                |
--------------------|----------|----------|----------|----------|----------------|

## Design Exercise Answer

<!-- Answer the Design Exercise. -->
<!-- In your answer: (1) Consider the tradeoffs of your design, and (2) provide some pseudocode, or a diagram, to illustrate how one would get started. -->

> 1. Many liquidity pools incentivize liquidity providers by offering additional rewards for staking their LP tokens - What are the tradeoffs of staking? Consider the tradeoffs for the LPs and for the protocols themselves.

- Providing LP tokens in order to get staking rewards could be a great way to make some extra income or it could be a great way to get Rekt as well. By depositing your LP tokens in a staking contract you not only are exposing yourself to Impermenant Loss but you are doing it to receive an exchange token in return. Some times these tokens don't have much liquidity and so they can be relatively valueless depending on their use case (governance token, utility token etc etc). These tokens tend to get dumped on the market a lot since traders are tryin got hedge against IL thus leading to a lot of sell pressure and a somewhat depress token price. This isn't always the best situation for trader though in some cases (like YFI) it can pay off big if the token price increaes in demand. This helps the protocol though because it provides liqudity for the token and incetives traders to hold LP tokens thus giving the token itself some liquidity.

> 2. Describe (using pseudocode) how you could add staking functionality to your LP.
- MasterChef does a great example of this.
- Build a contract similar to a bank that holds the LP tokens and tracks balances of users.
- This contract will also hold the reward token, lets call it SUSHI token in this example.
- Sushi will be distributed to stakers on a fixed amount per block based on how much they are staking.
- Once users unstake they will get access to their reward tokens and can trade them but will ultimately stop receiving rewards.

## Testnet Deploy Information

| Contract  | Address Etherscan Link |
| --------- | ---------------------- |
| SpaceCoin | `https://sepolia.etherscan.io/address/0x27c8c02700951A3de9a122f5662AfFC4F4c64d43`           |
| ICO       | `https://sepolia.etherscan.io/address/0xF3a7c9424aD604f8A5d8a0Ab463A1E6F09C8C729`           |
| Router    | `https://sepolia.etherscan.io/address/0x5C847c7b98218a5B68829e9D1908860b8dDb1236`           |
| Pool      | `https://sepolia.etherscan.io/address/0x618B406D090e8271d7f994eC404b84353B77fD98`           |
