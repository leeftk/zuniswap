/**
 * @title ICO Contract for SpaceCoin
 * @dev This contract is used for the initial coin offering (ICO) of SpaceCoin. The ICO has three phases: Seed, General, and Open. During each phase, participants can contribute ether in exchange for SpaceCoin tokens. The price of SpaceCoin increases with each phase. Once the Open phase is reached, participants can redeem their tokens for the contributed ether.
 * @author ChatGPT
 *
 * SPDX-License-Identifier: Unlicense
 */

pragma solidity 0.8.9;

import "./SpaceCoin.sol";
import "hardhat/console.sol";

error MaxSupplyReached();
error PhaseNotAdvanced();
error MustHaveContributed();
error MustBeGreaterThanZero();
error Paused();

contract ICO {
    
    uint256 constant maxSupply = 500_000 * 10**18;
    uint256 constant priceMultiplier = 5;
    address immutable owner;
    uint256 internal currentValue;
    SpaceCoin public spaceCoin;
    address public spaceCoinAddress;
    bool public pausedRedeem;
    bool public pausedContribute;

    mapping(address => bool) public allowList;
    mapping(address => uint256) public contributions;
    mapping(address => uint256) public spcDeposit;

    enum Phase {
        SEED,
        GENERAL,
        OPEN
    }

    Phase public currentPhase;

    event Redeemed(address indexed from, address indexed to, uint256 amount);
    event Contributed(address indexed from, uint256 _msgvalue, uint256 amount);
    event PhaseAdvanced(Phase phase);

    constructor(address _treasury, address[] memory _address) {
        spaceCoin = new SpaceCoin(_treasury, address(this));
        owner = msg.sender;
        currentPhase == Phase.SEED;
        addToAllowList(_address);
        spaceCoinAddress = address(spaceCoin);
    }

    /**
     * @dev Reverts if the caller is not the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    /**
     * @dev Compares and swaps the `currentValue` variable.
     * @param _currentValue The current value of `currentValue`.
     * @param _oldValue The expected value of `currentValue`.
     * @param newValue The new value to replace `currentValue`.
     * @return True if the value of `currentValue` was successfully swapped, false otherwise.
     */
    function compareAndSwap(
        uint256 _currentValue,
        uint256 _oldValue,
        uint256 newValue
    ) internal pure returns (bool) {
        // Compare and swap algo
        if (_currentValue == _oldValue) {
            _currentValue = newValue;
            return true;
        }
        return false;
    }

    /**
     * @dev Adds the given addresses to the allow list.
     * @param toAddAddresses An array of addresses to add to the allow list.
     */
    function addToAllowList(address[] memory toAddAddresses) internal {
        require(msg.sender == owner, "Only the owner can call this function");
        uint256 cachedLength = toAddAddresses.length;
        for (uint256 i; i < cachedLength; ) {
            allowList[toAddAddresses[i]] = true;
            unchecked {
                ++i;
            }
        }
    }
     /**
     * @dev Toggle the ability to redeem tokens.
     */
    function togglePauseRedeem() external onlyOwner {
        if (pausedRedeem == true) {
            pausedRedeem = false;
        } else {
            pausedRedeem = true;
        }
    }
     /**
     * @dev Toggle the ability to contribute.
     */
    function togglePauseContribute() external onlyOwner {
        if (pausedContribute == true) {
            pausedContribute = false;
        } else {
            pausedContribute = true;
        }
    }

    /**
     * @dev Advances the current phase of the ICO to the next phase.
     */
    function advancePhase() external onlyOwner {
        uint256 expectedValue = uint256(currentPhase);
        uint256 newValue = expectedValue + 1;
        require(
            compareAndSwap(uint256(currentPhase), expectedValue, newValue),
            "Phase not advanced"
        );
        currentPhase = Phase(newValue);
        emit PhaseAdvanced(currentPhase);
    }

    /**
     *   @dev Allows participants to contribute ether in exchange for SpaceCoin tokens.
     *   @dev The amount of tokens received is the `msg.value` multiplied by the `price
     *   @dev Reverts if `msg.value` is zero or if the maximum supply of tokens has been reached.
     *   @dev If the current phase is Seed, the caller must be on the allow list, and their contribution must not exceed 1500 ether.
     *   @dev If the current phase is General, their contribution must not exceed 1000 ether max limit 30_000 ether.
     *   @dev If the current phase is Open, max limit 30_000 ether.
     */
    function contributeEth() public payable {
        if (pausedContribute) revert Paused();
        if (msg.value == 0) revert MustBeGreaterThanZero();
        uint256 amount = msg.value * priceMultiplier;
        if (amount >= uint256(spaceCoin.totalSupply()))
            revert MaxSupplyReached();
        if (currentPhase == Phase.SEED) {
            require(
                contributions[msg.sender] + msg.value <= 1500 ether,
                "Max contribution amount reached"
            );
            require(
                address(this).balance + msg.value <= 15_000 ether,
                "Seed round has maxed out"
            );
            require(allowList[msg.sender] == true, "Must be on allow list");
            contributions[msg.sender] += amount;
            spcDeposit[msg.sender] += amount;
        } else if (currentPhase == Phase.GENERAL) {
            require(
                contributions[msg.sender] + msg.value <= 1_000 ether,
                "Max contribution amount reached"
            );
            require(
                address(this).balance + msg.value <= 30_000 ether,
                "Contract has maxed out"
            );
            contributions[msg.sender] += amount;
            spcDeposit[msg.sender] += amount;
        } else {
            require(
                address(this).balance + msg.value <= 30_000 ether,
                "Limit of 30_000 ETH reached"
            );
            contributions[msg.sender] += amount;
            spcDeposit[msg.sender] += amount;
        }
        emit Contributed(msg.sender, msg.value, amount);
    }

    function withdraw(address _to) external onlyOwner {
        payable(_to).transfer(address(this).balance);
    }

    /**
     * @dev Redeems the sender's SpaceCoin tokens for the contributed ether, but only if the current phase is Open and the sender has made a contribution.
     * @param _to The address to redeem the tokens to.
     */
    function redeem(address _to) external {
        if (pausedRedeem) revert Paused();
        if (currentPhase != Phase.OPEN) revert PhaseNotAdvanced();
        uint256 amount = spcDeposit[msg.sender];
        if (amount == 0) revert MustHaveContributed();
        spcDeposit[msg.sender] = 0;
        spaceCoin.transfer(_to, amount);
        emit Redeemed(msg.sender, _to, amount);
    }
}
