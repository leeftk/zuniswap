//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SpaceCoin.sol";

error InsufficientBalance();

contract SpaceLP is ERC20 {

    SpaceCoin public spaceCoin;


    constructor(SpaceCoin _spaceCoin) ERC20("Space LP", "SLP"){ 
        spaceCoin = _spaceCoin;

    }


    uint public reserve1;
    uint public reserve2;


    mapping(address => uint) private balances;



    /// @notice Adds ETH-SPC liquidity to LP contract
    /// @param to The address that will receive the LP tokens
    function deposit(address to) external payable  { 
        ///mint is find out how many tokens actually got transfeered to the lp contract
        uint balance1 = spaceCoin.balanceOf(address(this));
        uint balance2 = address(this).balance;
        //not super clear why this is bein done
        uint liquidity;
        uint amount1 = balance1 - reserve1;
        uint amount2 = balance2 - reserve2;
        if (totalSupply() == 0) {
            reserve1 = amount1;
            reserve2 = amount2;
           liquidity = getMin(amount1, amount2);
        } else {
            uint amount1 = amount1 * totalSupply() / reserve1;
            uint amount2 = amount2 * totalSupply() / reserve2;
            liquidity = getMin(amount1, amount2);
        }
        reserve1 = spaceCoin.balanceOf(address(this));
        reserve2 = address(this).balance;
         _mint(to, liquidity);
    }

    /// @notice Returns ETH-SPC liquidity to liquidity provider
    /// @param to The address that will receive the outbound token pair
    function withdraw(address to) external {
        uint balance1 = address(this).balance;
        uint balance2 = spaceCoin.balanceOf(address(this));
        uint amount1 =  balance1 * reserve1 / totalSupply();
        uint amount2 =  balance2 * reserve2 / totalSupply();
        _burn(msg.sender, balanceOf(msg.sender));

     }

    /// @notice Swaps ETH for SPC, or SPC for ETH
    /// @param to The address that will receive the outbound SPC or ETH
    /// @param isETHtoSPC Boolean indicating the direction of the trade
    function swap(address to, bool isETHtoSPC, uint amount) external payable{ 
        if (isETHtoSPC) {
            //send lp conttract the msg.value
            (bool success, ) = payable(address(this)).call{value: msg.value}("");
            if (!success) revert InsufficientBalance();
            spaceCoin.transfer(to, amount);

        } else {
            //send lp contract spacecoin from msg.sender
            spaceCoin.transferFrom(msg.sender, address(this), amount);
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) revert InsufficientBalance();
        }
    }

    /// @notice Returns the minimum of two numbers
    /// @param a The first number
    /// @param b The second number
    function getMin(uint a, uint b) public pure returns (uint) {
        return min(a, b);

    }
    /// @notice Returns the minimum of two numbers
    /// @param a The first number
    /// @param b The second number
    /// Interanl function to get the minimum of two numbers
    function min(uint a, uint b) internal pure returns (uint) {
        if (a < b) {
            return a;
        } else {
            return b;
        }
    }
    /// @notice Returns the reserves of ETH and SPC
    /// @return The reserves of ETH and SPC
    function getReserves() public view returns (uint, uint) {
        return (reserve1, reserve2);
    }
    receive() external payable {}
}
