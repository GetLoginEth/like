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

        //beforeEach(async () => {
        /*getLoginLogic = await GetLoginLogic.deployed();
        getLoginStorage = await GetLoginStorage.deployed();*/
        //});

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

        it("Like without donate", async () => {
            //await likeLogic.like();
        });
    });
});
