pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract GetLoginStorage {
    address public logicAddress;

    function setLogicAddress(address _address) public {
        logicAddress = _address;
    }
}
