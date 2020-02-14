const express = require('express');
const app = express();
const cors = require('cors');
const port = 3003;

// Import all function modules
const registerCompany = require('./2_registerCompany');
const createPO = require('./4_createPO');
const retailDrug = require('./7_retailDrug');
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

app.post('/createPO', (req, res) => {
	createPO.execute(req.body.buyerCRN, req.body.sellerCRN, req.body.drugName, req.body.quantity)
			.then((purchaseorder) => {
				console.log('Purchase Order added');
				const result = {
					status: 'success',
					message: 'New PO created successfully',
					purchaseorder: purchaseorder
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


app.post('/retailDrug', (req, res) => {
	retailDrug.execute(req.body.drugName, req.body.serialNo, req.body.retailerCRN, req.body.customerAadhar)
			.then((drug) => {
				console.log('Drug purchaded by consumer');
				const result = {
					status: 'success',
					message: 'Drug purchased successfully',
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
