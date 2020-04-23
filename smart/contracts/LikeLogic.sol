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

    constructor(LikeStorage _likeStorageAddress, GetLoginStorage _GLStorage) public {
        _setLikeStorage(_likeStorageAddress);
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
        bytes32 usernameHash = GetLoginLogic(GLStorage.logicAddress()).getUsernameByAddress(msg.sender);

    }

    function setLikeStorage(LikeStorage _storageAddress) onlyOwner public {
        _setLikeStorage(_storageAddress);
    }

    function setGLStorage(GetLoginStorage _storageAddress) onlyOwner public {
        _setGLStorage(_storageAddress);
    }

    function setOwner(address _address) onlyOwner public {
        _setOwner(_address);
    }

    function like(string memory url) public {
        // todo create/find resource by url
        //_like();

        //keccak256("raw_start_"+url+"_end")
    }

    function like(uint resourceTypeId, bytes32 resourceIdHash) public {
        LikeStorage.ResourceType memory resourceType = validateGetResourceType(resourceTypeId);

        // todo calc donations
        bytes32 resourceIdKey = keccak256(abi.encode("structured_start_", resourceTypeId, "_", resourceIdHash, "_end"));
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.resourceTypeId = resourceTypeId;
        resourceIdStatistics.reactions++;
        resourceIdStatistics.resourceIdHash = resourceIdHash;
        likeStorage.setResourceIdStatistics(resourceIdKey, resourceIdStatistics);

        resourceType.reactions++;
        likeStorage.setResourceType(resourceTypeId, resourceType);
    }

    function unlike() public {
        // todo check if user can unlike content
    }

    /* Validators */

    function validateGetResourceType(uint key) public view returns (LikeStorage.ResourceType memory) {
        LikeStorage.ResourceType memory data = likeStorage.getResourceType(key);
        require(data.isActive, "Resource type not found");

        return data;
    }
}
