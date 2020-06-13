const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

async function start() {
    console.log('Is only update logic: ', settings.isUpdateLogicOnly);
    const likeStoragePath = path.resolve(__dirname, '../', 'smart', 'contracts', 'LikeStorage.sol');
    const likeLogicPath = path.resolve(__dirname, '../', 'smart', 'contracts', 'LikeLogic.sol');
    const outAbiStoragePath = path.resolve(__dirname, '../', 'web', 'LikeStorageAbi.json');
    const outAbiLogicPath = path.resolve(__dirname, '../', 'web', 'LikeLogicAbi.json');
    const sourceLikeStorage = fs.readFileSync(likeStoragePath, 'utf8');
    const sourceLikeLogic = fs.readFileSync(likeLogicPath, 'utf8');
    const input = {
        language: 'Solidity',
        sources: {
            'LikeStorage.sol': {
                content: sourceLikeStorage
            },
            'LikeLogic.sol': {
                content: sourceLikeLogic
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };
    let data = solc.compile(JSON.stringify(input));
    //console.log(data);
    fs.writeFileSync(path.resolve(__dirname, 'out.json'), data);

    data = JSON.parse(data);
    const bytecodeStorage = data.contracts["LikeStorage.sol"]["LikeStorage"].evm.bytecode.object;
    const abiStorage = data.contracts["LikeStorage.sol"]["LikeStorage"].abi;
    const bytecodeLogic = data.contracts["LikeLogic.sol"]["LikeLogic"].evm.bytecode.object;
    const abiLogic = data.contracts["LikeLogic.sol"]["LikeLogic"].abi;

    //const web3 = new Web3(new Web3.providers.WebsocketProvider(settings.wsprovider));
    const web3 = new Web3(new HDWalletProvider(settings.privateKey, settings.httpsprovider));
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    let result = null;
    // todo set correct address after deploy (here only default address)
    let storageContract = new web3.eth.Contract(abiStorage, settings.likeStorageAddress);
    if (!settings.isUpdateLogicOnly) {
        console.log('Publish storage');
        result = await storageContract
            .deploy({data: '0x' + bytecodeStorage})
            .send({from: accounts[0]});
        storageContract.options.address = result.options.address;
        console.log('Storage contract deployed to', result.options.address);
        fs.writeFileSync(outAbiStoragePath, JSON.stringify({
            abi: abiStorage,
            address: result.options.address
        }));
    }

    const likeStorageParamAddress = settings.isUpdateLogicOnly ? settings.likeStorageAddress : result.options.address;
    console.log('Publish logic with storage address', likeStorageParamAddress);
    result = await new web3.eth.Contract(abiLogic)
        .deploy({
            data: '0x' + bytecodeLogic,
            arguments: [likeStorageParamAddress, settings.getLoginStorageAddress]
        })
        .send({from: accounts[0]});
    console.log('Logic contract deployed to', result.options.address);
    console.log('Set logic address to storage contract');
    await storageContract.methods.setLogicAddress(result.options.address).send({from: accounts[0]});
    fs.writeFileSync(outAbiLogicPath, JSON.stringify({
        abi: abiLogic,
        address: result.options.address
    }));
    console.log('Complete!');
}

const settings = JSON.parse(fs.readFileSync('../.rinkeby.json').toString());
start()
    .then(_ => {
        process.exit();
    })
    .catch(e => {
        console.log(e);
        process.exit();
    });
