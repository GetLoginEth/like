const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3();

const settings = JSON.parse(fs.readFileSync('../.rinkeby.json').toString());
console.log(settings);
// todo deploy like storage
// todo deploy like logic with storage address and getLoginStorage address
// todo log logic and storage addresses for like
