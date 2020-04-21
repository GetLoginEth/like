const LikeStorage = artifacts.require("LikeStorage");
const LikeLogic = artifacts.require("LikeLogic");
const Empty = artifacts.require("Empty");
const TestLogic = artifacts.require("TestLogic");

module.exports = function (deployer) {
    deployer.deploy(LikeStorage).then(data => {
        // todo how to pass and test GetLogin here?
        deployer.deploy(LikeLogic, data.address)
            .then(data => {

            });
    });

    deployer.deploy(Empty);
    deployer.deploy(TestLogic);
};
