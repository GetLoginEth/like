const LikeStorage = artifacts.require("LikeStorage");
const LikeLogic = artifacts.require("LikeLogic");
const Empty = artifacts.require("Empty");
const TestLogic = artifacts.require("TestLogic");
const GetLoginLogic = artifacts.require("GetLoginLogic");
const GetLoginStorage = artifacts.require("GetLoginStorage");

module.exports = function (deployer) {
    let getLoginStorageAddress = null;
    let getLoginStorage = null;
    let getLoginLogicAddress = null;
    deployer.deploy(GetLoginStorage)
        .then(data => {
            getLoginStorage = data;
            getLoginStorageAddress = data.address;
            return data;
        })
        .then(data => deployer.deploy(GetLoginLogic, getLoginStorageAddress))
        .then(data => {
            getLoginLogicAddress = data.address;

            return getLoginLogicAddress;
        })
        .then(getLoginLogicAddress => getLoginStorage.setLogicAddress(getLoginLogicAddress))
        .then(_ => deployer.deploy(LikeStorage))
        .then(data => deployer.deploy(LikeLogic, data.address, getLoginStorageAddress));

    deployer.deploy(Empty);
    deployer.deploy(TestLogic);
};
