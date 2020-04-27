pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract LikeStorage {
    address public owner;
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
        bytes32 ownerUsernameHash;
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
        owner = msg.sender;
    }

    modifier onlyLogicAddress() {
        require(msg.sender == logicAddress, "Caller is not the logic address");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function setOwner(address _address) onlyOwner public {
        owner = _address;
    }

    function setLogicAddress(address _logicAddress) onlyOwner public {
        logicAddress = _logicAddress;
    }

    function setResourceIdStatistics(bytes32 key, ResourceIdStatistics memory value) onlyLogicAddress public {
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

    function setResourceType(uint key, ResourceType memory value) onlyLogicAddress public {
        resources[key] = value;
    }

    function getResourceType(uint key) public view returns (ResourceType memory) {
        return resources[key];
    }

    function incrementResourceId() onlyLogicAddress public {
        newResourceId++;
    }

    function decrementResourceId() onlyLogicAddress public {
        newResourceId--;
    }
}
