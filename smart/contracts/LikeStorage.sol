pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

// SPDX-License-Identifier: UNLICENSED
contract LikeStorage {
    address public owner;
    address public logicAddress;
    uint public newResourceId = 1;
    mapping(uint => ResourceType) public resources;
    //mapping(bytes32 => ResourceTypeStatistics) public resourceTypeStatistics;
    mapping(bytes32 => ResourceIdStatistics) public resourceIdStatistics;
    mapping(bytes32 => bool) public userLike;

    event EventLikeUrl(bytes32 indexed urlHash);
    // todo resourceType replace to resourceTypeId?
    event EventLikeResource(uint indexed resourceType, bytes32 indexed resourceIdHash);
    event EventResourceTypeCreated(uint indexed resourceType, bytes32 indexed usernameHash);

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
        // only for likes with resource_type_id and resource_id
        uint resourceTypeId;
        // only for likes with resource_type_id and resource_id
        bytes32 resourceIdHash;
        // only for likes with url
        bytes32 urlHash;
        uint reactions;
        uint donates;
        bool isActive;
    }

    /*struct Like {
        uint resourceType;
        bytes32 resourceIdHash;
        bytes32 usernameHash;
        uint8 typeId;
        string data;
        bool isActive;
    }*/

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

    function setUserLike(bytes32 key, bool value) onlyLogicAddress public {
        userLike[key] = value;
    }

    function getUserLike(bytes32 key) public view returns (bool) {
        return userLike[key];
    }

    function incrementResourceId() onlyLogicAddress public {
        newResourceId++;
    }

    function decrementResourceId() onlyLogicAddress public {
        newResourceId--;
    }

    function emitEventLikeUrl(bytes32 urlHash) onlyLogicAddress public {
        emit EventLikeUrl(urlHash);
    }

    function emitEventLikeResource(uint resourceType, bytes32 resourceIdHash) onlyLogicAddress public {
        emit EventLikeResource(resourceType, resourceIdHash);
    }

    function emitEventResourceTypeCreated(uint resourceType, bytes32 usernameHash) onlyLogicAddress public {
        emit EventResourceTypeCreated(resourceType, usernameHash);
    }
}
