pragma solidity ^0.6.4;

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
    }

    function like(uint resourceTypeId, uint resourceId, string memory url) public {
        // todo if resourceTypeId||resourceId is 0 - create new one or use default
    }
}
