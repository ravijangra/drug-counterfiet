const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Import all function modules
// const addToWallet = require('./1_addToWallet');
const registerCompany = require('./2_registerCompany');
const addDrug = require('./3_addDrug');
const createShipment = require('./5_createShipment');
const viewHistory = require('./8_viewHistory');
const viewDrugCurrentState = require('./9_viewDrugCurrentState');


// const issueCertificate = require('./4_issueCertificate');
// const verifyCertificate = require('./5_verifyCertificate');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Drugs counterfiet App');

app.get('/', (req, res) => res.send('Your Drugs counterfiet App'));

app.post('/registerCompany', (req, res) => {
	registerCompany.execute(req.body.companyCRN, req.body.companyName, req.body.location, req.body.organisationRole)
			.then((company) => {
				console.log('New company registered');
				const result = {
					status: 'success',
					message: 'New company registered',
					company: company
				};
				res.json(result);
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Failed',
					error: e
				};
				res.status(500).send(result);
			});
});

app.post('/addDrug', (req, res) => {
	addDrug.execute(req.body.drugName, req.body.serialNo, req.body.mfgDate, req.body.expDate, req.body.companyCRN)
			.then((drug) => {
				console.log('New drug added');
				const result = {
					status: 'success',
					message: 'New drug added successfully',
					drug: drug
				};
				res.json(result);
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Failed',
					error: e
				};
				res.status(500).send(result);
			});
});

app.post('/createShipment', (req, res) => {
	createShipment.execute(req.body.buyerCRN, req.body.drugName, req.body.listOfAssets, req.body.transporterCRN)
			.then((shipment) => {
				console.log('New Shipment added');
				const result = {
					status: 'success',
					message: 'New shipment added successfully',
					shipment: shipment
				};
				res.json(result);
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Failed',
					error: e
				};
				res.status(500).send(result);
			});
});

app.post('/viewHistory', (req, res) => {
	viewHistory.execute(req.body.drugName, req.body.serialNo)
			.then((history) => {
				console.log('Drug history retrieved');
				const result = {
					status: 'success',
					message: 'Drug history retrieved successfully',
					drughistory: history
				};
				res.json(result);
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Failed',
					error: e
				};
				res.status(500).send(result);
			});
});

app.post('/viewDrugCurrentState', (req, res) => {
	viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo)
			.then((drug) => {
				console.log('Drug current state retrieved');
				const result = {
					status: 'success',
					message: 'Drug current state retrieved successfully',
					drug: drug
				};
				res.json(result);
			})
			.catch((e) => {
				const result = {
					status: 'error',
					message: 'Failed',
					error: e
				};
				res.status(500).send(result);
			});
});
app.listen(port, () => console.log(`Distributed Drug counterfiet App listening on port ${port}!`));
