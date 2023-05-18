// //SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.9;

// import "./SpaceLP.sol";
// import "./SpaceCoin.sol";

// error InsufficientLiquidity();


// contract SpaceRouter {

//     SpaceLP public spaceLP;
//     SpaceCoin public spaceCoin;

//     constructor(SpaceLP _spaceLP, SpaceCoin _spaceCoin){
//         spaceLP =  _spaceLP;
//         spaceCoin = _spaceCoin;
       
//     }

//     /// @notice Provides ETH-SPC liquidity to LP contract
//     /// @param spc The desired amount of SPC to be deposited
//     /// @dev The desired amount of ETH to be deposited is indicated by 
//     //    msg.value
//     function addLiquidity(uint256 spc, uint amountSpcDesired) external payable {
//         (uint reserve1, uint reserve2) = spaceLP.getReserves();
//         uint amountSpc = reserve1 * reserve2 * spc;
//         uint amountEth = reserve1 * reserve2 * msg.value;
//         if(reserve1 == 0 && reserve2 == 0) {
//             spaceLP.transferFrom(msg.sender, address(this), amountSpc);
//             (bool success, ) = address(spaceLP).call{value: msg.value}("");   
//             spaceLP.deposit(msg.sender);
//         } else if (amountSpcDesired <= amountSpc) {
//             (bool success, ) = address(spaceLP).call{value: msg.value}("");
//             spaceLP.transferFrom(msg.sender, address(this), amountSpc);
//             spaceLP.deposit(msg.sender);     
        
//     }
//     }

//     /// @notice Removes ETH-SPC liquidity from LP contract
//     /// @param lpToken The amount of LP tokens being returned
//     function removeLiquidity(uint256 lpToken) external { 
//         (uint reserve1, uint reserve2) = spaceLP.getReserves();
//        if(lpToken >= spaceLP.balanceOf(msg.sender)) revert InsufficientLiquidity();
//         uint amount1 = lpToken / spaceLP.totalSupply() * reserve1;
//         uint amount2 = lpToken / spaceLP.totalSupply() * reserve2;
//         spaceLP.transferFrom(address(this), msg.sender, amount1);
//         (bool success, ) = msg.sender.call{value: amount2}("");
//         require(success, "Transfer failed.");
//         spaceLP.withdraw(msg.sender);
//     }

//     /// @notice Swaps ETH for SPC in LP contract
//     /// @param spcOutMin The minimum acceptable amout of SPC to be received
//     function swapETHForSPC(uint256 spcOutMin) external payable{ 
//         (uint reserve1, uint reserve2) = spaceLP.getReserves();
//         uint amountSpc = reserve1 * reserve2 * msg.value;
//         if(amountSpc < spcOutMin) revert InsufficientLiquidity();
//         (bool success, ) = address(spaceLP).call{value: msg.value}("");
//         spaceLP.swap(msg.sender, true);
//     }

//     /// @notice Swaps SPC for ETH in LP contract
//     /// @param spcIn The amount of inbound SPC to be swapped
//     /// @param ethOutMin The minimum acceptable amount of ETH to be received
//     function swapSPCForETH(uint256 spcIn, uint256 ethOutMin) { 
//         (uint reserve1, uint reserve2) = spaceLP.getReserves();
//         // old k value
//         uint amountETH = reserve1 * reserve2 
//         // new 
//         if(amountETH < ethOutMin) revert InsufficientLiquidity();
//         spaceLP.swap(msg.sender, false);
//     }

// }