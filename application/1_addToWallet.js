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

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/2664e0c6c7d4faac52dbc232e48839323c3749a3e143fe93f83891ce519f68a5_sk', 'MANUFACTURER_ADMIN', 'manufacturerMSP','./identity/manufacturer' ).then(() => {
  console.log('Manufacturer identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/d871ac6828a7438b8e2c4bec92aec85dc4b7f3213dd9aa28a1c1aa79f57941e9_sk', 'DISTRIBUTOR_ADMIN', 'distributorMSP','./identity/distributor' ).then(() => {
  console.log('Distributor identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/c95f7fad1aacdf55f73d1d1c99a6836ed0515b99636f0df96d0b525b579eccfa_sk', 'RETAILER_ADMIN', 'retailerMSP','./identity/retailer' ).then(() => {
  console.log('Retailer identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/27f7a7ba0de3139ab3e621870579e00dc84b10766cd6bf5352f7983af4a5b29e_sk', 'TRANSPORTER_ADMIN', 'transporterMSP','./identity/transporter' ).then(() => {
  console.log('Transporter identity added to wallet.');
});

main('/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-net/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/43f9c65eb7ec7b464a7d8060610ee6f21b80135146860ec6af8c3fcf4cce0982_sk', 'CONSUMER_ADMIN', 'consumerMSP','./identity/consumer' ).then(() => {
  console.log('Consumer identity added to wallet.');
});

module.exports.execute = main;
