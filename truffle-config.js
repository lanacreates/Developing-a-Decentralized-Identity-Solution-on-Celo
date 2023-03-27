
const ContractKit = require("@celo/contractkit");
const Web3 = require("web3");

const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);

// Add your private key and MetaMask account address
const privateKey = "4d0d6371584217006e585fbf5c26d417fe144ee4773a63d86596a9c01e76e6e9";
const accountAddress = "0x76FF85179a333d057d855cE6a3B6690cF28EFFc2";

kit.addAccount(privateKey);

module.exports = {
    networks: {
        development: {host: "127.0.0.1",
port: 7545,
network_id: "*",
},
celo: {
provider: kit.connection.web3.currentProvider,
network_id: 44787,
from: accountAddress,
gas: 6721975,
gasPrice: 20000000000,
},
},
compilers: {
    solc: {
        version: "0.8.0",
    },
},
};