const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface,  bytecode } = require('./compile');
// ABI <=> interface
// infura api key => gktsmW0m7SSN8W8gRXF7
// metamask mnemonic => dust fragile solid basic mountain you chat chief lottery private oil blade
// metamask account1 address => 0x2cde3fceDe7639096Be5B1416352fBF996eB13d3
// Attempting to deploy from account ::  0x2cde3fceDe7639096Be5B1416352fBF996eB13d3
// Contract deployed to ::  0x728a9657774e16D3b755f3cc02f2C64a9dD0A1D9

const provider = new HDWalletProvider(
	'dust fragile solid basic mountain you chat chief lottery private oil blade',
	'https://rinkeby.infura.io/gktsmW0m7SSN8W8gRXF7'
);

const web3 = new Web3(provider);

const deploy = async () => {
	
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account :: ', accounts[0]);
	console.log('interface :: ',interface);

	try{
		const result = await new web3.eth.Contract(JSON.parse(interface))
			.deploy({
				data: bytecode
			})
			.send({
				gas: '4700000',
				from: accounts[0]
			});

		 console.log('Contract deployed to :: ', result.options.address);

		}catch(err){
			console.log("Error :: MetaMask is not sending Ether :: ",err);
		}

	

};

deploy();




/*

npm uninstall truffle-hdwallet-provider
npm install --save truffle-hdwallet-provider@0.0.3


*/