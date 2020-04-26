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

            /*await getLoginStorage.setLogicAddress(getLoginLogic.address);
            await getLoginLogic.init();(/

        });

        beforeEach(async () => {
            /*getLoginLogic = await GetLoginLogic.deployed();
            getLoginStorage = await GetLoginStorage.deployed();*/
        });

        it("Like without donate", async () => {
            //await likeLogic.like();
        });

        it("Like without donate", async () => {
            //await likeLogic.like();
        });
    });
});
