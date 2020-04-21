pragma solidity ^0.6.4;

contract LikeStorage {
    address public logicAddress;
    uint public newResourceId = 1;
    ResourceType[] public resources;
    // todo emit event when resource created (for fast find with web3)
    mapping(bytes32 => ResourceTypeStatistics) public resourceTypeStatistics;
    mapping(bytes32 => ResourceIdStatistics) public resourceIdStatistics;

    struct ResourceType {
        uint id;
        string title;
        string description;
        string url;
        bool isActive;
    }

    struct ResourceTypeStatistics {
        uint resourceTypeId;
        uint likes;
        uint donates;
        bool isActive;
    }

    struct ResourceIdStatistics {
        uint resourceTypeId;
        uint resourceId;
        uint likes;
        uint donates;
        bool isActive;
    }

    struct Like {
        uint resourceType;
        string resourceId;
        bytes32 usernameHash;
        uint8 typeId;
        string data;
        bool isActive;
    }

    constructor() public {

    }

    function setLogicAddress(address _logicAddress) public {
        logicAddress = _logicAddress;
    }
}
