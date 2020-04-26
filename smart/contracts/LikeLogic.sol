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

        //keccak256("raw_start_"+url+"_end")
    }

    function createResourceType(LikeStorage.ResourceType memory resource) public {
        uint id = likeStorage.newResourceId();
        likeStorage.setResourceType(id, resource);
    }

    function like(uint resourceTypeId, bytes32 resourceIdHash, address payable donateAddress) payable public {
        LikeStorage.ResourceType memory resourceType = validateGetResourceType(resourceTypeId);

        // set resource id stata
        bytes32 resourceIdKey = keccak256(abi.encode("structured_start_", resourceTypeId, "_", resourceIdHash, "_end"));
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.resourceTypeId = resourceTypeId;
        resourceIdStatistics.reactions++;
        resourceIdStatistics.donates += msg.value;
        resourceIdStatistics.resourceIdHash = resourceIdHash;
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
