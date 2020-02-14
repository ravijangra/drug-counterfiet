'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * Defaults:
 *  User Name: MHRD_ADMIN
 *  User Organization: MHRD
 *  User Role: Admin
 *
 */

const fs = require('fs'); // FileSystem Library
const { FileSystemWallet, X509WalletMixin } = require('fabric-network'); // Wallet Library provided by Fabric
const path = require('path'); // Support library to build filesystem paths in NodeJs

const crypto_materials = path.resolve(__dirname, '../network/crypto-config'); // Directory where all Network artifacts are stored

// A wallet is a filesystem path that stores a collection of Identities
// const manufacturer_wallet = new FileSystemWallet('./identity/manufacturer');
// const wallet = new FileSystemWallet('./identity/transporter');
// const wallet = new FileSystemWallet('./identity/distributor');
// const wallet = new FileSystemWallet('./identity/retailer');
// const consumer_wallet = new FileSystemWallet('./identity/consumer');


async function main(certificatePath, privateKeyPath, identityLabel, msp, walletPath) {

  const wallet = new FileSystemWallet(walletPath);

	// Main try/catch block
	try {

		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const certificate = fs.readFileSync(certificatePath).toString();
		// IMPORTANT: Change the private key name to the key generated on your computer
		const privatekey = fs.readFileSync(privateKeyPath).toString();

		// Load credentials into wallet
		// const identityLabel = 'MHRD_ADMIN';
    //const identityLabel = 'MANUFACTURER_ADMIN';

		const identity = X509WalletMixin.createIdentity(msp, certificate, privatekey);

		await wallet.import(identityLabel, identity);

	} catch (error) {
		console.log(`Error adding to wallet. ${error}`);
		console.log(error.stack);
		throw new Error(error);
	}
}

// main('/home/upgrad/workspace/certification-network/network/crypto-config/peerOrganizations/mhrd.certification-network.com/users/Admin@mhrd.certification-network.com/msp/signcerts/Admin@mhrd.certification-network.com-cert.pem', '/home/upgrad/workspace/certification-network/network/crypto-config/peerOrganizations/mhrd.certification-network.com/users/Admin@mhrd.certification-network.com/msp/keystore/69e13659643b75e6c9e31c682b029db75bcba598eefe63b6dbd214dd1e7e79b6_sk').then(() => {
//   console.log('User identity added to wallet.');
// });

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/471a0694fc9a5a85a1c3365060ae5b9780e30f1b8d42d473103d8e64f5444f78_sk', 'MANUFACTURER_ADMIN', 'manufacturerMSP','./identity/manufacturer' ).then(() => {
  console.log('Manufacturer identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/5acc0e2f2a53d676fa06b42be90ce13be43854a45376043f617d5ca71b53b3b0_sk', 'DISTRIBUTOR_ADMIN', 'distributorMSP','./identity/distributor' ).then(() => {
  console.log('Distributor identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/c92de456d05a151903e43c0cf0caa9d71e25647dc8525ed4546ee64832ab9faf_sk', 'RETAILER_ADMIN', 'retailerMSP','./identity/retailer' ).then(() => {
  console.log('Retailer identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/728f7e646d419fa42e2bd070f877b40739a83b416bf83e350a7b2a48fa217272_sk', 'TRANSPORTER_ADMIN', 'transporterMSP','./identity/transporter' ).then(() => {
  console.log('Transporter identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/85e925d458fd11b093e9496cdb71d8abe73266a97d10bea94af330f60f0aa833_sk', 'CONSUMER_ADMIN', 'consumerMSP','./identity/consumer' ).then(() => {
  console.log('Consumer identity added to wallet.');
});

module.exports.execute = main;
