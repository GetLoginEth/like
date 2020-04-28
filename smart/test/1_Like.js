const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const LikeLogic = artifacts.require("./LikeLogic.sol");
const LikeStorage = artifacts.require("./LikeStorage.sol");
//const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage, likeLogic, likeStorage;

contract("Like", async accounts => {
    describe('User', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();
            likeLogic = await LikeLogic.deployed();
            likeStorage = await LikeStorage.deployed();

            await likeStorage.setLogicAddress(likeLogic.address);
            //await getLoginLogic.init();

        });

        /*beforeEach(async () => {
        getLoginLogic = await GetLoginLogic.deployed();
        getLoginStorage = await GetLoginStorage.deployed();
        });*/

        it("Create resource type", async () => {
            const resource = {
                title: "YouTube",
                description: "YouTube description here",
                url: "https://youtube.com",
            };
            await likeLogic.createResourceType(resource.title, resource.description, resource.url);

            const data = await likeStorage.getResourceType(1);
            assert.equal(data.id, 1, "Incorrect id");
            assert.equal(data.title, resource.title, "Incorrect title");
            assert.equal(data.description, resource.description, "Incorrect description");
            assert.equal(data.url, resource.url, "Incorrect url");
        });

        it("Like by resource without donate", async () => {
            // https://www.youtube.com/watch?v=GBkf5arRZIQ
            const videoId = "GBkf5arRZIQ";
            const videoIdHash = web3.utils.keccak256(videoId);
            const oldLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(oldLikeInfo.resourceTypeId, 0, "Incorrect resourceTypeId");
            assert.equal(oldLikeInfo.resourceIdHash, '0x0000000000000000000000000000000000000000000000000000000000000000', "Incorrect resourceIdHash");
            assert.equal(oldLikeInfo.reactions, '0', "Incorrect reactions");
            assert.equal(oldLikeInfo.isActive, false, "Incorrect isActive");

            await likeLogic.like(1, videoIdHash, "0x0000000000000000000000000000000000000000");
            const newLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(newLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(newLikeInfo.resourceIdHash, videoIdHash, "Incorrect resourceIdHash");
            assert.equal(newLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(newLikeInfo.isActive, true, "Incorrect isActive");
        });

        it("Unlike", async () => {
            // https://www.youtube.com/watch?v=Y-65T0YBOm4
            const videoId = "65T0YBOm4";
            const videoIdHash = web3.utils.keccak256(videoId);
            const oneLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(oneLikeInfo.resourceTypeId, 0, "Incorrect resourceTypeId");
            assert.equal(oneLikeInfo.resourceIdHash, '0x0000000000000000000000000000000000000000000000000000000000000000', "Incorrect resourceIdHash");
            assert.equal(oneLikeInfo.reactions, '0', "Incorrect reactions");
            assert.equal(oneLikeInfo.isActive, false, "Incorrect isActive");

            await likeLogic.like(1, videoIdHash, "0x0000000000000000000000000000000000000000");
            const twoLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(twoLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(twoLikeInfo.resourceIdHash, videoIdHash, "Incorrect resourceIdHash");
            assert.equal(twoLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(twoLikeInfo.isActive, true, "Incorrect isActive");

            await likeLogic.unlike(1, videoIdHash);
            const threeLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(threeLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(threeLikeInfo.resourceIdHash, videoIdHash, "Incorrect resourceIdHash");
            assert.equal(threeLikeInfo.reactions, 0, "Incorrect reactions");
            assert.equal(threeLikeInfo.isActive, true, "Incorrect isActive");
        });
    });
});
