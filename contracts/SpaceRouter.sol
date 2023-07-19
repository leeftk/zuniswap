//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "./SpaceLP.sol";
import "./SpaceCoin.sol";
import "hardhat/console.sol";

error InsufficientLiquidity();
error AmountLessThanDesired();
error SendMoreETH();


contract SpaceRouter {

    SpaceLP public spaceLP;
    SpaceCoin public spaceCoin;

    constructor(SpaceLP _spaceLP, SpaceCoin _spaceCoin) {
        spaceLP =  _spaceLP;
        spaceCoin = _spaceCoin;
       
    }

    event LiquidityAdded(address indexed from, uint256 amountEth,uint256 amountSpc);
    event LiquidityRemoved(address indexed from, uint256 amount);
    event swapSPC(uint spcOutMin);
    event swapETH(uint spcIn, uint ethOutMin);

    /// @notice Provides ETH-SPC liquidity to LP contract
    /// @param spc The desired amount of SPC to be deposited
    /// @dev The desired amount of ETH to be deposited is indicated by msg.value  
    function addLiquidity(uint256 spc) external payable {
        if(msg.value == 0) revert SendMoreETH();
        (uint spcPool, uint ethPool) = spaceLP.getReserves();
         uint amountSpc; 
    if(spaceLP.totalSupply() == 0){
        spaceCoin.transferFrom(msg.sender, address(spaceLP), spc);
        spaceLP.deposit{value: msg.value}(msg.sender);
    } else {
        uint amountEth = spc * ethPool / spcPool; 
        if(msg.value < amountEth){
           uint newValueSpc =  msg.value * spcPool / ethPool;  
           amountSpc = newValueSpc;
        } else if(msg.value > amountEth){
             uint ethReturn = msg.value - amountEth;
            (bool success, ) = msg.sender.call{value: ethReturn}("");
            if(!success) revert AmountLessThanDesired();
            amountSpc = spc;
        } else {
            amountSpc = spc;
        }
        spaceCoin.transferFrom(msg.sender, address(spaceLP), amountSpc);
        spaceLP.deposit{value: amountEth}(msg.sender);

    } 
            emit LiquidityAdded(msg.sender, amountSpc, msg.value);

       
    }
    

    /// @notice Removes ETH-SPC liquidity from LP contract
    /// @param lpToken The amount of LP tokens being returned
    function removeLiquidity(uint256 lpToken) external { 
      (uint spcPool, uint ethPool) = spaceLP.getReserves();
       if(spcPool == 0 || ethPool == 0) revert InsufficientLiquidity();
        spaceLP.transferFrom(msg.sender, address(spaceLP), lpToken);
        spaceLP.withdraw(msg.sender);
    }

    /// @notice Swaps ETH for SPC in LP contract
    /// @param spcOutMin The minimum acceptable amout of SPC to be received
    function swapETHForSPC(uint256 spcOutMin) external payable{ 
       if(msg.value == 0) revert SendMoreETH();
       uint spcAmount = spaceLP.swap{value: msg.value}(msg.sender, true);
       if(spcAmount <= spcOutMin) revert AmountLessThanDesired();
    }

    /// @notice Swaps SPC for ETH in LP contract
    /// @param spcIn The amount of inbound SPC to be swapped
    /// @param ethOutMin The minimum acceptable amount of ETH to be received
    function swapSPCForETH(uint256 spcIn, uint256 ethOutMin) external{ 
        spaceCoin.transferFrom(msg.sender, address(spaceLP), spcIn);
        uint actualAmtEthOut = spaceLP.swap(msg.sender, false);
        if(actualAmtEthOut < ethOutMin) revert AmountLessThanDesired();
        emit swapETH(spcIn, actualAmtEthOut);
    }

}