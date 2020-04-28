pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

import './LikeStorage.sol';

abstract contract GetLoginLogic {
    function getUsernameByAddress(address wallet) public virtual view returns (bytes32);
}

abstract contract GetLoginStorage {
    function logicAddress() public virtual view returns (address);
}

contract LikeLogic {
    LikeStorage public likeStorage;
    GetLoginStorage public GLStorage;
    address public owner;

    constructor(LikeStorage _likeStorage, GetLoginStorage _GLStorage) public {
        _setLikeStorage(_likeStorage);
        _setOwner(msg.sender);
        _setGLStorage(_GLStorage);
        // todo init storage if needed
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function _setOwner(address _address) private {
        owner = _address;
    }

    function _setLikeStorage(LikeStorage _storageAddress) private {
        likeStorage = _storageAddress;
    }

    function _setGLStorage(GetLoginStorage _storageAddress) private {
        GLStorage = _storageAddress;
    }

    function _like(uint resourceTypeId, uint resourceId) private {
        //bytes32 usernameHash = getGLUsernameHash(msg.sender);
    }

    /* Public methods */

    function setLikeStorage(LikeStorage _storageAddress) onlyOwner public {
        _setLikeStorage(_storageAddress);
    }

    function setGLStorage(GetLoginStorage _storageAddress) onlyOwner public {
        _setGLStorage(_storageAddress);
    }

    function setOwner(address _address) onlyOwner public {
        _setOwner(_address);
    }

    function like(string memory url, address payable donateAddress) payable public {
        // todo create/find resource by url
        //_like();

        /*if(msg.value > 0 && donateAddress != address(0)) {
            donateAddress.send(msg.value);
        }*/
        //keccak256("raw_start_"+url+"_end")

    }

    function createResourceType(string memory title, string memory description, string memory url) public {
        bytes32 ownerUsernameHash = getGLUsernameHash(msg.sender);
        uint id = likeStorage.newResourceId();
        LikeStorage.ResourceType memory resource = LikeStorage.ResourceType({
            id : id,
            title : title,
            description : description,
            url : url,
            reactions : 0,
            donates : 0,
            ownerUsernameHash : ownerUsernameHash,
            isActive : true
            });

        likeStorage.setResourceType(id, resource);
        likeStorage.incrementResourceId();
    }

    function like(uint resourceTypeId, bytes32 resourceIdHash, address payable donateAddress) payable public {
        LikeStorage.ResourceType memory resourceType = validateGetResourceType(resourceTypeId);

        // set resource id stata
        bytes32 resourceIdKey = getResourceIdKey(resourceTypeId, resourceIdHash);
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.resourceTypeId = resourceTypeId;
        resourceIdStatistics.reactions++;
        resourceIdStatistics.donates += msg.value;
        resourceIdStatistics.resourceIdHash = resourceIdHash;
        resourceIdStatistics.isActive = true;
        likeStorage.setResourceIdStatistics(resourceIdKey, resourceIdStatistics);

        // set resource stata
        resourceType.donates += msg.value;
        resourceType.reactions++;
        likeStorage.setResourceType(resourceTypeId, resourceType);

        // send donation
        if (msg.value > 0 && donateAddress != address(0)) {
            donateAddress.transfer(msg.value);
        }
    }

    function unlike(uint resourceTypeId, bytes32 resourceIdHash) public {
        // todo check if user can unlike content
        bytes32 resourceIdKey = getResourceIdKey(resourceTypeId, resourceIdHash);
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.resourceTypeId = resourceTypeId;
        resourceIdStatistics.reactions--;
        resourceIdStatistics.resourceIdHash = resourceIdHash;
        resourceIdStatistics.isActive = true;
        likeStorage.setResourceIdStatistics(resourceIdKey, resourceIdStatistics);
    }

    /* Getters */

    function getResourceIdKey(uint resourceTypeId, bytes32 resourceIdHash) public view returns (bytes32){
        return keccak256(abi.encode("structured_start_", resourceTypeId, "_", resourceIdHash, "_end"));
    }

    function getGLUsernameHash(address _address) public view returns (bytes32){
        return GetLoginLogic(GLStorage.logicAddress()).getUsernameByAddress(_address);
    }

    function getResourceIdStatistics(uint resourceTypeId, bytes32 resourceIdHash) public view returns (LikeStorage.ResourceIdStatistics memory){
        bytes32 key = getResourceIdKey(resourceTypeId, resourceIdHash);

        return likeStorage.getResourceIdStatistics(key);
    }

    /* Validators */

    function validateGetResourceType(uint key) public view returns (LikeStorage.ResourceType memory) {
        LikeStorage.ResourceType memory data = likeStorage.getResourceType(key);
        require(data.isActive, "Resource type not found");

        return data;
    }
}
