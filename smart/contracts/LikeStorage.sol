pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract LikeStorage {
    address public logicAddress;
    uint public newResourceId = 1;
    mapping(uint => ResourceType) public resources;
    // todo emit event when resource created (for fast find with web3)
    //mapping(bytes32 => ResourceTypeStatistics) public resourceTypeStatistics;
    mapping(bytes32 => ResourceIdStatistics) public resourceIdStatistics;

    struct ResourceType {
        uint id;
        string title;
        string description;
        string url;
        uint reactions;
        uint donates;
        bool isActive;
    }

    struct ResourceIdStatistics {
        uint resourceTypeId;
        bytes32 resourceIdHash;
        uint reactions;
        uint donates;
        bool isActive;
    }

    struct Like {
        uint resourceType;
        bytes32 resourceIdHash;
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

    function setResourceIdStatistics(bytes32 key, ResourceIdStatistics memory value) public {
        resourceIdStatistics[key] = value;
    }

    function getResourceIdStatistics(bytes32 key) public view returns (ResourceIdStatistics memory) {
        return resourceIdStatistics[key];
    }

    /*function setResourceTypeStatistics(bytes32 key, ResourceTypeStatistics memory value) public {
        resourceTypeStatistics[key] = value;
    }

    function getResourceTypeStatistics(bytes32 key) public view returns (ResourceTypeStatistics memory) {
        return resourceTypeStatistics[key];
    }*/

    function setResourceType(uint key, ResourceType memory value) public {
        resources[key] = value;
    }

    function getResourceType(uint key) public view returns (ResourceType memory) {
        return resources[key];
    }
}
