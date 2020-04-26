pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract GetLoginLogic {
    address public storageAddress;
    mapping(address => bytes32) public addresses;

    constructor(address _address) public {
        storageAddress = _address;
    }

    function setAddressUsername(address wallet, bytes32 usernameHash) public {
        addresses[wallet] = usernameHash;
    }

    /* GetLoginLogic methods */
    function getUsernameByAddress(address wallet) public view returns (bytes32){
        return addresses[wallet];
    }
}
