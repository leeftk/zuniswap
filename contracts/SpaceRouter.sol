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

    constructor(SpaceLP _spaceLP, SpaceCoin _spaceCoin) payable{
        spaceLP =  _spaceLP;
        spaceCoin = _spaceCoin;
       
    }

    /// @notice Provides ETH-SPC liquidity to LP contract
    /// @param spc The desired amount of SPC to be deposited
    /// @dev The desired amount of ETH to be deposited is indicated by 
    //    msg.value
    function addLiquidity(uint256 spc, uint amountSpcDesired) external payable {
        if(msg.value == 0) revert SendMoreETH();
        (uint reserve1, uint reserve2) = spaceLP.getReserves();
        uint amountSpc;
        if(reserve1 == 0 || reserve2 == 0){
            amountSpc = spc;
        } else {
            amountSpc = reserve1 * reserve2 * spc;
        }
        uint amountEth = reserve1 * reserve2 * msg.value;
        if(reserve1 == 0 && reserve2 == 0) {
            spaceCoin.transferFrom(msg.sender, address(spaceLP), amountSpc);
            (bool success, ) = address(spaceLP).call{value: msg.value}("");   
            require(success, "Transfer failed.");
            spaceLP.deposit(msg.sender);

        } else if (amountSpcDesired <= amountSpc) {
            (bool success, ) = address(spaceLP).call{value: amountEth}("");
            require(success, "Transfer failed.");
            spaceCoin.transferFrom(msg.sender, address(spaceLP), amountSpc);
            spaceLP.deposit(msg.sender);     
        
    }
    }

    /// @notice Removes ETH-SPC liquidity from LP contract
    /// @param lpToken The amount of LP tokens being returned
    function removeLiquidity(uint256 lpToken) external { 
        (uint reserve1, uint reserve2) = spaceLP.getReserves();
       if(lpToken >= spaceLP.balanceOf(msg.sender)) revert InsufficientLiquidity();
       if(reserve1 == 0 || reserve2 == 0) revert InsufficientLiquidity();
        uint amount1 = lpToken / spaceLP.totalSupply() * reserve1;
        uint amount2 = lpToken / spaceLP.totalSupply() * reserve2;
        spaceLP.transferFrom(address(this), msg.sender, amount1);
        (bool success, ) = msg.sender.call{value: amount2}("");
        require(success, "Transfer failed.");
        spaceLP.withdraw(msg.sender);
    }

    /// @notice Swaps ETH for SPC in LP contract
    /// @param spcOutMin The minimum acceptable amout of SPC to be received
    function swapETHForSPC(uint256 spcOutMin) external payable{ 
        (uint reserve1, uint reserve2) = spaceLP.getReserves();
        uint k = reserve1 * reserve2;
        uint newReserve2 = reserve1 + msg.value;
        uint newReserve1 = k / newReserve2;
        uint amountSpc = reserve1 - newReserve1; 
        if(amountSpc < spcOutMin) revert AmountLessThanDesired();
        reserve1 = newReserve1;
        reserve2 = newReserve2;
        spaceLP.swap(msg.sender, true, amountSpc);
    }

    /// @notice Swaps SPC for ETH in LP contract
    /// @param spcIn The amount of inbound SPC to be swapped
    /// @param ethOutMin The minimum acceptable amount of ETH to be received
    function swapSPCForETH(uint256 spcIn, uint256 ethOutMin) external payable{ 
        (uint reserve1, uint reserve2) = spaceLP.getReserves();
        uint k = reserve1 * reserve2;
        uint newReserve1 = reserve1 + spcIn;
        uint newReserve2 = k / newReserve1;
        uint amountETH = reserve2 - newReserve2; 
        if(amountETH < ethOutMin) revert AmountLessThanDesired();
        reserve1 = newReserve1;
        reserve2 = newReserve2;
        spaceLP.swap(msg.sender, false, amountETH);
    }

}