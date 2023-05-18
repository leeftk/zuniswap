//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

error TransferTaxAlreadyActive();
error NotOwner();
error NoChangeInTax();

contract SpaceCoin is ERC20 {
    address public owner;
    bool public taxOn;
    address public treasury;
    address public icoContract;

    event isTaxOn(bool taxOn);

    constructor(address _treasury, address _icoContract)
        ERC20("SpaceCoin", "SPC")
    {
        owner = msg.sender;
        treasury = _treasury;
        _mint(_icoContract, 150_000 * 10**18);
        _mint(_treasury, 350_000 * 10**18);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        uint256 transferTax = (amount * 2) / 100;
        uint256 transferAmount = amount - transferTax;
        if (taxOn) {
            super._transfer(sender, treasury, transferTax);
            super._transfer(sender, recipient, transferAmount);
        } else {
            super._transfer(sender, recipient, amount);
        }
    }

    function changeTaxStatus(bool _taxOn) external {
        if (msg.sender != owner) revert NotOwner();
        if (taxOn == _taxOn) revert NoChangeInTax();
        taxOn = _taxOn;
        emit isTaxOn(_taxOn);
    }
}
