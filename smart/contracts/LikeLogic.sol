pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

import './LikeStorage.sol';

abstract contract GetLoginLogic {
    function getUsernameByAddress(address wallet) public virtual view returns (bytes32);
}

abstract contract GetLoginStorage {
    function logicAddress() public virtual view returns (address);
}

// SPDX-License-Identifier: UNLICENSED
contract LikeLogic {
    LikeStorage public likeStorage;
    GetLoginStorage public GLStorage;
    address public owner;

    struct UserStatistics {
        LikeStorage.ResourceIdStatistics resourceStatistics;
        bytes32 usernameHash;
        bool isLiked;
    }

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

    /*function _like(uint resourceTypeId, uint resourceId) private {
        //bytes32 usernameHash = getGLUsernameHash(msg.sender);
    }*/

    function _incrementResourceType(uint resourceTypeId, uint donates) private {
        LikeStorage.ResourceType memory resourceType = validateGetResourceType(resourceTypeId);
        resourceType.donates += donates;
        resourceType.reactions++;
        likeStorage.setResourceType(resourceTypeId, resourceType);
    }

    function _incrementResourceId(uint resourceTypeId, bytes32 resourceIdHash, uint donate) private {
        bytes32 resourceIdKey = getResourceIdKey(resourceTypeId, resourceIdHash);
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.resourceTypeId = resourceTypeId;
        resourceIdStatistics.reactions++;
        resourceIdStatistics.donates += donate;
        resourceIdStatistics.resourceIdHash = resourceIdHash;
        resourceIdStatistics.isActive = true;
        likeStorage.setResourceIdStatistics(resourceIdKey, resourceIdStatistics);
    }

    function _incrementResourceUrl(bytes32 urlHash, uint donate) private {
        bytes32 resourceIdKey = getUrlHashKey(urlHash);
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.reactions++;
        resourceIdStatistics.donates += donate;
        resourceIdStatistics.urlHash = urlHash;
        resourceIdStatistics.isActive = true;
        likeStorage.setResourceIdStatistics(resourceIdKey, resourceIdStatistics);
    }

    function _preventDoubleLikeUrl(bytes32 usernameHash, bytes32 urlHash, bool result) private {
        bytes32 userLikeKey = getUserLikeUrlKey(usernameHash, urlHash);
        require(likeStorage.getUserLike(userLikeKey) == false, "Already liked");
        likeStorage.setUserLike(userLikeKey, result);
    }

    function _sendDonation(uint sum, address payable _address) private {
        if (sum > 0 && _address != address(0)) {
            _address.transfer(msg.value);
        }
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
        bytes32 usernameHash = getGLUsernameHash(msg.sender);
        bytes32 userLikeKey = getUserLikeResourceKey(usernameHash, resourceTypeId, resourceIdHash);
        require(likeStorage.getUserLike(userLikeKey) == false, "Already liked");
        likeStorage.setUserLike(userLikeKey, true);

        _incrementResourceType(resourceTypeId, msg.value);
        _incrementResourceId(resourceTypeId, resourceIdHash, msg.value);
        _sendDonation(msg.value, donateAddress);
    }

    function likeUrl(bytes32 urlHash, address payable donateAddress) payable public {
        bytes32 usernameHash = getGLUsernameHash(msg.sender);

        bytes32 key = getUserLikeUrlKey(usernameHash, urlHash);
        require(likeStorage.getUserLike(key) == false, "Already liked");
        likeStorage.setUserLike(key, true);
        _incrementResourceUrl(urlHash, msg.value);
        _sendDonation(msg.value, donateAddress);
    }

    function unlike(uint resourceTypeId, bytes32 resourceIdHash) public {
        LikeStorage.ResourceType memory resourceType = validateGetResourceType(resourceTypeId);
        bytes32 usernameHash = getGLUsernameHash(msg.sender);

        bytes32 resourceIdKey = getResourceIdKey(resourceTypeId, resourceIdHash);
        bytes32 userLikeKey = getUserLikeResourceKey(usernameHash, resourceTypeId, resourceIdHash);
        require(likeStorage.getUserLike(userLikeKey), "User not liked this content");
        likeStorage.setUserLike(userLikeKey, false);

        // todo move to incrementMethod and rename it
        LikeStorage.ResourceIdStatistics memory resourceIdStatistics = likeStorage.getResourceIdStatistics(resourceIdKey);
        resourceIdStatistics.resourceTypeId = resourceTypeId;
        resourceIdStatistics.reactions--;
        resourceIdStatistics.resourceIdHash = resourceIdHash;
        resourceIdStatistics.isActive = true;
        likeStorage.setResourceIdStatistics(resourceIdKey, resourceIdStatistics);
    }

    /* Getters */

    function getUserLikeResourceKey(bytes32 usernameHash, uint resourceTypeId, bytes32 resourceIdHash) public view returns (bytes32){
        return keccak256(abi.encode("user_like_resource_", usernameHash, "_", resourceTypeId, "_", resourceIdHash, "_end"));
    }

    function getUserLikeUrlKey(bytes32 usernameHash, bytes32 urlHash) public view returns (bytes32){
        return keccak256(abi.encode("user_like_url_", usernameHash, "_", urlHash, "_end"));
    }

    function getResourceIdKey(uint resourceTypeId, bytes32 resourceIdHash) public view returns (bytes32){
        return keccak256(abi.encode("resource_id_", resourceTypeId, "_", resourceIdHash, "_end"));
    }

    function getUrlHashKey(bytes32 urlHash) public view returns (bytes32){
        return keccak256(abi.encode("url_hash_", urlHash, "_end"));
    }

    function getGLUsernameHash(address _address) public view returns (bytes32){
        return GetLoginLogic(GLStorage.logicAddress()).getUsernameByAddress(_address);
    }

    function getResourceIdStatistics(uint resourceTypeId, bytes32 resourceIdHash) public view returns (LikeStorage.ResourceIdStatistics memory){
        bytes32 key = getResourceIdKey(resourceTypeId, resourceIdHash);

        return likeStorage.getResourceIdStatistics(key);
    }

    /**
    Get like statistics by any keccak256(url) hash
    **/
    function getResourceIdStatisticsUrl(bytes32 urlHash) public view returns (LikeStorage.ResourceIdStatistics memory){
        bytes32 key = getUrlHashKey(urlHash);

        return likeStorage.getResourceIdStatistics(key);
    }

    /**
    Get like + user statistics by any keccak256(url) hash
    **/
    function getUserStatisticsUrl(bytes32 usernameHash, bytes32 urlHash) public view returns (UserStatistics memory){
        return UserStatistics({
            resourceStatistics : getResourceIdStatisticsUrl(urlHash),
            usernameHash : usernameHash,
            isLiked : likeStorage.getUserLike(getUserLikeUrlKey(usernameHash, urlHash))
            });
    }

    /* Validators */

    function validateGetResourceType(uint key) public view returns (LikeStorage.ResourceType memory) {
        LikeStorage.ResourceType memory data = likeStorage.getResourceType(key);
        require(data.isActive, "Resource type not found");

        return data;
    }
}
