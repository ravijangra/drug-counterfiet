'use strict';

/**
 * This is a Node.JS application to add a new student on the network.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;

async function main(buyerCRN, drugName, listOfAssets, transporterCRN) {

	try {

		const pharmaContract = await getContractInstance();

		// Create a new student account
		console.log('.....Creating a a new shipment');
		const shipmentBuffer = await pharmaContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);

		// process response
		console.log('.....Processing create new shipment Transaction Response \n\n');
		let shipment = JSON.parse(shipmentBuffer.toString());
		console.log(shipment);
		console.log('\n\n.....Create Shipment Transaction Complete!');
		return shipment;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		console.log('.....Disconnecting from Fabric Gateway');
		gateway.disconnect();

	}
}

async function getContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	gateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('../identity/distributor');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'DISTRIBUTOR_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile-distributor.yaml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	console.log('.....Connecting to Fabric Gateway');
	await gateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	console.log('.....Connecting to channel - pharmachannel');
	const channel = await gateway.getNetwork('pharmachannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	console.log('.....Connecting to Pharmanet Smart Contract');
	return channel.getContract('pharmanet', 'org.pharma-network.com-manufacturer');
}

// main("D01", "Foracort","ForacortF03,ForacortF01,ForacortF02", "T01").then(() => {
// 	console.log('Shipment created Successfully');
// });

module.exports.execute = main;