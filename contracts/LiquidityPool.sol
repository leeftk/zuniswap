// //SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "./SpaceCoin.sol";

// error InsufficientBalance();

// contract SpaceLP is ERC20 {

//     SpaceCoin public spaceCoin;


//     constructor(SpaceCoin _spaceCoin) ERC20("Space LP", "SLP"){ 
//         spaceCoin = _spaceCoin;

//     }


//     uint public reserve1;
//     uint public reserve2;


//     mapping(address => uint) private balances;



//     /// @notice Adds ETH-SPC liquidity to LP contract
//     /// @param to The address that will receive the LP tokens
//     function deposit(address to) external payable  { 
//         ///mint is find out how many tokens actually got transfeered to the lp contract
//         uint balance1 = spaceCoin.balanceOf(address(this));
//         uint balance2 = address(this).balance;
//         //not super clear why this is bein done
//         uint amount1 = balance1 - reserve1;
//         uint amount2 = balance2 - reserve2;
//         uint liquidity = 0;
//         if (reserve1 == 0 && reserve2 == 0) {
//             liquidity = amount1 * amount2 / reserve1 * reserve2;   
//         } else {
//             uint amount1 = amount1 * totalSupply() / reserve1;
//             uint amount2 = amount2 * totalSupply() / reserve2;
//             reserve1 += amount1;
//             reserve2 += amount2;
//             liquidity = getMin(amount1, amount2);
//         }
//          _mint(to, liquidity);
//     }

//     /// @notice Returns ETH-SPC liquidity to liquidity provider
//     /// @param to The address that will receive the outbound token pair
//     function withdraw(address to) external {
//         if(balanceOf(msg.sender) == 0) revert InsufficientBalance();
//         uint amount1 = address(this).balance;
//         //finding the ratio of tokens to the total tokens in supply, multiplying that by the total amount of tokens in the contract
//         uint amount2 = spaceCoin.balanceOf(address(this));
//         uint amount1 =  amount1 * reserve1 / totalSupply();
//         uint amount2 =  amount2 * reserve2 / totalSupply();
//         _burn(msg.sender, balanceOf(msg.sender));

//      }

//     /// @notice Swaps ETH for SPC, or SPC for ETH
//     /// @param to The address that will receive the outbound SPC or ETH
//     /// @param isETHtoSPC Boolean indicating the direction of the trade
//     function swap(address to, bool isETHtoSPC) external payable{ 
//         if (isETHtoSPC) {
//             uint amount = address(this).balance;
//             payable(to).transfer(amount);
//             spaceCoin.transfer(to, amount);
//         } else {
//             uint amount = spaceCoin.balanceOf(address(this));
//             spaceCoin.transfer(to, amount);
//             payable(to).transfer(amount);
//         }
//     }

//     /// @notice Returns the minimum of two numbers
//     /// @param a The first number
//     /// @param b The second number
//     function getMin(uint a, uint b) public pure returns (uint) {
//         return min(a, b);

//     }
//     /// @notice Returns the minimum of two numbers
//     /// @param a The first number
//     /// @param b The second number
//     /// Interanl function to get the minimum of two numbers
//     function min(uint a, uint b) internal pure returns (uint) {
//         if (a < b) {
//             return a;
//         } else {
//             return b;
//         }
//     }
//     /// @notice Returns the reserves of ETH and SPC
//     /// @return The reserves of ETH and SPC
//     function getReserves() public view returns (uint, uint) {
//         return (reserve1, reserve2);
//     }

// }