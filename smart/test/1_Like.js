const GetLoginLogic = artifacts.require("./GetLoginLogic.sol");
const GetLoginStorage = artifacts.require("./GetLoginStorage.sol");
const LikeLogic = artifacts.require("./LikeLogic.sol");
const LikeStorage = artifacts.require("./LikeStorage.sol");
const willFail = require("./exceptions.js").willFail;
let getLoginLogic, getLoginStorage, likeLogic, likeStorage;
const adminHash = web3.utils.keccak256("admin");
const igorHash = web3.utils.keccak256("igor");

contract("Like", async accounts => {
    describe('User', async () => {
        before(async () => {
            getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();
            likeLogic = await LikeLogic.deployed();
            likeStorage = await LikeStorage.deployed();

            await likeStorage.setLogicAddress(likeLogic.address);
            //await getLoginLogic.init();
            await getLoginLogic.setAddressUsername(accounts[0], adminHash);
            await getLoginLogic.setAddressUsername(accounts[1], igorHash);
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

        it("Like by resource", async () => {
            // https://www.youtube.com/watch?v=GBkf5arRZIQ
            const videoId = "GBkf5arRZIQ";
            const videoId2 = "GBkf5arRZIZ";
            const videoIdHash = web3.utils.keccak256(videoId);
            const videoIdHash2 = web3.utils.keccak256(videoId2);

            // get initial state
            const oldLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(oldLikeInfo.resourceTypeId, 0, "Incorrect resourceTypeId");
            assert.equal(oldLikeInfo.resourceIdHash, '0x0000000000000000000000000000000000000000000000000000000000000000', "Incorrect resourceIdHash");
            assert.equal(oldLikeInfo.urlHash, '0x0000000000000000000000000000000000000000000000000000000000000000', "Incorrect urlHash");
            assert.equal(oldLikeInfo.reactions, '0', "Incorrect reactions");
            assert.equal(oldLikeInfo.isActive, false, "Incorrect isActive");

            // like resource without donate
            await likeLogic.like(1, videoIdHash, "0x0000000000000000000000000000000000000000");
            const newLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(newLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(newLikeInfo.resourceIdHash, videoIdHash, "Incorrect resourceIdHash");
            assert.equal(newLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(newLikeInfo.isActive, true, "Incorrect isActive");

            // check double like
            await willFail(likeLogic.like(1, videoIdHash, "0x0000000000000000000000000000000000000000"), 'Already liked');

            // like from not registered user
            await willFail(likeLogic.like(1, videoIdHash, "0x0000000000000000000000000000000000000000", {from: accounts[9]}), 'User with this address not found');

            // like with donate
            const destinationAddress = accounts[8];
            let balance = await web3.eth.getBalance(destinationAddress);
            assert.equal(web3.utils.fromWei(balance, "ether"), "100", "Incorrect initial balance");
            await likeLogic.like(1, videoIdHash2, destinationAddress, {
                from: accounts[0],
                value: web3.utils.toWei("0.111", "ether")
            });
            balance = await web3.eth.getBalance(destinationAddress);
            assert.equal(web3.utils.fromWei(balance, "ether"), "100.111", "Incorrect balance");

            // check donate counter after donate
            const afterDonateLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash2);
            assert.equal(afterDonateLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(afterDonateLikeInfo.resourceIdHash, videoIdHash2, "Incorrect resourceIdHash");
            assert.equal(afterDonateLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(afterDonateLikeInfo.isActive, true, "Incorrect isActive");
            assert.equal(web3.utils.fromWei(afterDonateLikeInfo.donates, "ether"), "0.111", "Incorrect isActive");
        });

        it("Like by URL", async () => {
            // https://www.youtube.com/watch?v=GBkf5arRZIQ
            const url1 = "https://www.youtube.com/watch?v=GBkf5arRZIQ";
            const url2 = "https://www.youtube.com/watch?v=GBkf5arRZIZ";
            const url1Hash = web3.utils.keccak256(url1);
            const url2Hash = web3.utils.keccak256(url2);

            // get initial state
            const oldLikeInfo = await likeLogic.getResourceIdStatisticsUrl(url1Hash);
            assert.equal(oldLikeInfo.resourceTypeId, 0, "Incorrect resourceTypeId");
            assert.equal(oldLikeInfo.resourceIdHash, '0x0000000000000000000000000000000000000000000000000000000000000000', "Incorrect resourceIdHash");
            assert.equal(oldLikeInfo.urlHash, '0x0000000000000000000000000000000000000000000000000000000000000000', "Incorrect urlHash");
            assert.equal(oldLikeInfo.reactions, '0', "Incorrect reactions");
            assert.equal(oldLikeInfo.isActive, false, "Incorrect isActive");

            // like resource without donate
            await likeLogic.likeUrl(url1Hash, "0x0000000000000000000000000000000000000000");
            const newLikeInfo = await likeLogic.getResourceIdStatisticsUrl(url1Hash);
            assert.equal(newLikeInfo.resourceTypeId, 0, "Incorrect resourceTypeId");
            assert.equal(newLikeInfo.urlHash, url1Hash, "Incorrect resourceIdHash");
            assert.equal(newLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(newLikeInfo.isActive, true, "Incorrect isActive");

            // check double like
            await willFail(likeLogic.likeUrl(url1Hash, "0x0000000000000000000000000000000000000000"), 'Already liked');

            // like from not registered user
            await willFail(likeLogic.likeUrl(url1Hash, "0x0000000000000000000000000000000000000000", {from: accounts[9]}), 'User with this address not found');

            // like with donate
            const destinationAddress = accounts[6];
            let balance = await web3.eth.getBalance(destinationAddress);
            assert.equal(web3.utils.fromWei(balance, "ether"), "100", "Incorrect initial balance");
            await likeLogic.likeUrl(url2Hash, destinationAddress, {
                from: accounts[0],
                value: web3.utils.toWei("0.111", "ether")
            });
            balance = await web3.eth.getBalance(destinationAddress);
            assert.equal(web3.utils.fromWei(balance, "ether"), "100.111", "Incorrect balance");

            // check donate counter after donate
            const afterDonateLikeInfo = await likeLogic.getResourceIdStatisticsUrl(url2Hash);
            assert.equal(afterDonateLikeInfo.resourceTypeId, 0, "Incorrect resourceTypeId");
            assert.equal(afterDonateLikeInfo.urlHash, url2Hash, "Incorrect resourceIdHash");
            assert.equal(afterDonateLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(afterDonateLikeInfo.isActive, true, "Incorrect isActive");
            assert.equal(web3.utils.fromWei(afterDonateLikeInfo.donates, "ether"), "0.111", "Incorrect isActive");

            // check like info with user like
            const userLikeInfo = await likeLogic.getUserStatisticsUrl(adminHash, url2Hash);
            assert.equal(userLikeInfo.resourceStatistics.urlHash, url2Hash, "Incorrect urlHash");
            assert.equal(userLikeInfo.usernameHash, adminHash, "Incorrect usernameHash");
            assert.equal(userLikeInfo.isLiked, true, "Incorrect isLiked");
        });

        it("Unlike", async () => {
            // https://www.youtube.com/watch?v=Y-65T0YBOm4
            const videoId = "65T0YBOm4";
            const videoId2 = "65T0YBOm5";
            const videoIdHash = web3.utils.keccak256(videoId);
            const videoIdHash2 = web3.utils.keccak256(videoId2);
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

            // unlike from not registered account
            await willFail(likeLogic.unlike(1, videoIdHash, {
                from: accounts[9],
                //value: web3.utils.toWei("0", "ether")
            }), 'User with this address not found');

            // unlike from registered account, but not liked this content
            await willFail(likeLogic.unlike(1, videoIdHash, {
                from: accounts[1],
                //value: web3.utils.toWei("0", "ether")
            }), 'User not liked this content');

            // unlike from registered account never liked content
            await willFail(likeLogic.unlike(1, videoIdHash2, {
                from: accounts[0],
                //value: web3.utils.toWei("0", "ether")
            }), 'User not liked this content');

            await likeLogic.unlike(1, videoIdHash);
            const threeLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(threeLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(threeLikeInfo.resourceIdHash, videoIdHash, "Incorrect resourceIdHash");
            assert.equal(threeLikeInfo.reactions, 0, "Incorrect reactions");
            assert.equal(threeLikeInfo.isActive, true, "Incorrect isActive");
            assert.equal(threeLikeInfo.donates, 0, "Incorrect isActive");

            // like with donate after unlike
            const destinationAddress = accounts[7];
            let balance = await web3.eth.getBalance(destinationAddress);
            assert.equal(web3.utils.fromWei(balance, "ether"), "100", "Incorrect balance");

            await likeLogic.like(1, videoIdHash, destinationAddress, {
                value: web3.utils.toWei("0.123", "ether")
            });
            balance = await web3.eth.getBalance(destinationAddress);
            assert.equal(web3.utils.fromWei(balance, "ether"), "100.123", "Incorrect balance");

            // check donate counter after donate
            const afterDonateLikeInfo = await likeLogic.getResourceIdStatistics(1, videoIdHash);
            assert.equal(afterDonateLikeInfo.resourceTypeId, 1, "Incorrect resourceTypeId");
            assert.equal(afterDonateLikeInfo.resourceIdHash, videoIdHash, "Incorrect resourceIdHash");
            assert.equal(afterDonateLikeInfo.reactions, 1, "Incorrect reactions");
            assert.equal(afterDonateLikeInfo.isActive, true, "Incorrect isActive");
            assert.equal(web3.utils.fromWei(afterDonateLikeInfo.donates, "ether"), "0.123", "Incorrect isActive");
        });
    });
});
