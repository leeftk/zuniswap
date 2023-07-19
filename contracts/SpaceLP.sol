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


    uint public spcPool;
    uint public ethPool;

    event  Withdraw(address indexed to, uint spcOut, uint ethOut);
    event  Swap(address indexed to, uint spcOut, bool ethOut);


    mapping(address => uint) private balances;



    /// @notice Adds ETH-SPC liquidity to LP contract
    /// @param to The address that will receive the LP tokens
    function deposit(address to) external payable  { 
        uint balanceSpc = spaceCoin.balanceOf(address(this));
        uint balanceEth = address(this).balance;
        uint liquidity;
        uint amountEthIn = balanceEth - ethPool;
        uint amountSpcIn = balanceSpc - spcPool;
        if (totalSupply() == 0) {
            liquidity = getMin(amountEthIn, amountSpcIn);
        } else {
            uint amountSpc =   amountEthIn * ethPool / totalSupply();
            uint amountETH = amountSpcIn * spcPool / totalSupply();
            liquidity = getMin(amountSpc, amountETH);
        }
        spcPool = spaceCoin.balanceOf(address(this));
        ethPool = address(this).balance;
         _mint(to, liquidity);
    }

    /// @notice Returns ETH-SPC liquidity to liquidity provider
    /// @param to The address that will receive the outbound token pair
    function withdraw(address to) external {
        uint lpTokenBalance = balanceOf(address(this));
        // what perfectage of total supply am I burning
        uint spcOut = lpTokenBalance * spcPool / totalSupply();
        uint ethOut = lpTokenBalance * ethPool / totalSupply();
        _burn(address(this), lpTokenBalance);
        spcPool = spaceCoin.balanceOf(address(this)) - spcOut;
        spaceCoin.transfer(to, spcOut);
        ethPool = address(this).balance - ethOut;
        (bool success, ) = payable(to).call{value: ethOut}("");
        if (!success) revert InsufficientBalance();
        emit Withdraw(to, spcOut, ethOut);
     }

    /// @notice Swaps ETH for SPC, or SPC for ETH
    /// @param to The address that will receive the outbound SPC or ETH
    /// @param isETHtoSPC Boolean indicating the direction of the trade
    function swap(address to, bool isETHtoSPC) external payable  returns(uint amountOut) { 
        uint amountOut;
        if (isETHtoSPC) {
            uint k = ethPool * spcPool;    
            uint spacePool = k / address(this).balance;   
            uint spaceOut = spcPool - spacePool;
            ethPool = address(this).balance;
            amountOut = spaceOut;
            spaceCoin.transfer(to, spaceOut);
            spcPool = spaceCoin.balanceOf(address(this));
        } else {
            uint amountSpaceIn = spaceCoin.balanceOf(address(this));
            uint k = ethPool * spcPool; 
            uint newEthReserve = k / spaceCoin.balanceOf(address(this));
            uint ethOut = ethPool - newEthReserve;
            spcPool = spaceCoin.balanceOf(address(this));
            ethPool = address(this).balance - ethOut;
            amountOut = ethOut;
            (bool success, ) = payable(to).call{value: ethOut}("");
            if (!success) revert InsufficientBalance();   
        }
            emit Swap(to, amountOut, isETHtoSPC);
            return amountOut;
             
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
        return (spcPool, ethPool);
    }
    receive() external payable {}
}
