'use strict';

const {Contract} = require('fabric-contract-api');

class ManufacturerContract extends Contract {

	constructor() {
		super('org.pharma-network.com-manufacturer');
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Pharma Smart Contract ver 1.1 Instantiated');

	}

  /**
   * REGISTER A NEW COMPANY ON THE NETWORK
   * @param ctx - The transaction context object
   * @param companyCRN - Company Registration Number of the company
   * @param companyName - Name of the company
   * @param Location - Location of the company
   * @param organisationRole - Role of the company in the fabric network.
   * @returns - Company Object
   */
   async registerCompany (ctx, companyCRN, companyName, location, organisationRole) {
     let allowedIdentities = ["manufacturer.pharma-network.com", "distributor.pharma-network.com", "retailer.pharma-network.com", "transporter.pharma-network.com"];
     this.isInitiatorAllowed(ctx, allowedIdentities);

     const companyKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.companies', [companyCRN]);
		 const companyNameKey = companyCRN + "-" + companyName;
     let newCompanyObject = {
       companyID:  companyNameKey,
       name: companyName,
       location: location,
       organisationRole: organisationRole,
     };

     if(organisationRole === "Manufacturer"){
       newCompanyObject.hierarchyKey = 1;
     }
     else if(organisationRole === "Distributor"){
       newCompanyObject.hierarchyKey = 2;
     }
     else if(organisationRole === "Retailer"){
       newCompanyObject.hierarchyKey = 3;
     }

     let dataBuffer = Buffer.from(JSON.stringify(newCompanyObject));
     await ctx.stub.putState(companyKey, dataBuffer);
     return newCompanyObject;
   }


   /**
    * ADD A NEW DRUG ON THE NETWROK
    * @param ctx - The transaction context object
    * @param drugName - Name of the drug
    * @param serialNo - Serial No of the drug
    * @param mfgDate - Manufacturing date of the drug
    * @param expDate - Expiry date of the drug
    * @param companyCRN - Company Registration Number of the Manufacturer of the drug
    * @returns - Drug Object
    */

   async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {

		// const allowedIdentities = ["manufacturer.pharma-network.com", "distributor.pharma-network.com", "retailer.pharma-network.com", "transporter.pharma-network.com"];
  	const allowedIdentities = ["manufacturer.pharma-network.com"];
    this.isInitiatorAllowed(ctx, allowedIdentities);
    const drugKeyName = drugName + "" + serialNo;
    const drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [drugKeyName]);

    // Create a new drug object to be stored in blockchain
    let newDrugObject = {
      productID: drugKey,
      name: drugName,
      manufacturer: companyCRN,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      owner: companyCRN,
    };

    let dataBuffer = Buffer.from(JSON.stringify(newDrugObject));
    await ctx.stub.putState(drugKey, dataBuffer);
    return newDrugObject;
  }


  /**
   * Create a new Purchase Order on the network
   * @param ctx - The transaction context object
   * @param drugName - Name of the drug
   * @param quantity - Quantity of the drug to be purchased
   * @param sellerCRN - Company Registration Number of the seller of the drug
   * @param buyerCRN - Company Registration Number of the buyer of the drug
   * @returns - PO Object
   */

   async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity) {

		// const allowedIdentities = ["manufacturer.pharma-network.com", "distributor.pharma-network.com", "retailer.pharma-network.com", "transporter.pharma-network.com"];
    const allowedIdentities = ["distributor.pharma-network.com", "retailer.pharma-network.com"];
    this.isInitiatorAllowed(ctx, allowedIdentities);
    const poKeyName = buyerCRN + "" + drugName;
    const poKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.pos', [poKeyName]);
    const buyerKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.companies', [buyerCRN]);
		const sellerKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.companies', [sellerCRN]);

		let buyerDataBuffer= await ctx.stub
		 .getState(buyerKey)
		 .catch(err => console.log(err));
		let buyer = JSON.parse(buyerDataBuffer.toString());

    let sellerDataBuffer =  await ctx.stub
    .getState(sellerKey)
    .catch(err => console.log(err));
    let seller = JSON.parse(sellerDataBuffer.toString());

    if(buyer.hierarchyKey > seller.hierarchyKey && seller.hierarchyKey === buyer.hierarchyKey - 1){
      let newPOObject = {
        poID: poKey,
        drugName: drugName,
        quantity: quantity,
        buyer: buyerCRN,
        seller: sellerCRN,
    	};

    let dataBuffer = Buffer.from(JSON.stringify(newPOObject));
    await ctx.stub.putState(poKey, dataBuffer);
    return newPOObject;
    }
    else {
      throw new Error('Buyer and Seller are not in the desired hierarchical order for this PO to be raised... ');
    }
  }

  /**
   * CREATE A NEW SHIPMENT ON THE NETWORK
   * @param ctx - The transaction context object
   * @param drugName - Name of the drug
   * @param listOfAssets - List of drug keys to be packed in the shipment
   * @param transporterCRN - Company Registration Number of the transporter picking up the shipment.
   * @param buyerCRN - Company Registration Number of the buyer of the drug
   * @returns - Shipment Object
   */

 async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN) {
	// const allowedIdentities = ["manufacturer.pharma-network.com", "distributor.pharma-network.com", "retailer.pharma-network.com", "transporter.pharma-network.com"];
  const allowedIdentities = ["distributor.pharma-network.com", "manufacturer.pharma-network.com"];
  this.isInitiatorAllowed(ctx, allowedIdentities);
  const shipmentKeyName = buyerCRN + "-" + drugName;
  const shipmentKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.shipments', [shipmentKeyName]);
  let drugOwner;

	listOfAssets = listOfAssets.split(',');
  if(listOfAssets.length !==0){
    const drugKeyName = listOfAssets[0];
		let drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [drugKeyName]);
    let drugKeyDataBuffer =  await ctx.stub
		.getState(drugKey)
		.catch(err => console.log(err));
    drugOwner = JSON.parse(drugKeyDataBuffer.toString()).owner;
  }
  else {
    throw new Error("No items in the drug list");
  }

  let newShipmentObject = {
    shipmentID: shipmentKey,
    creator : drugOwner, // TODO - This has to be sellers ID.
    assets: listOfAssets,
    transporter: transporterCRN,
    status: "in-transit",
  };

  let dataBuffer = Buffer.from(JSON.stringify(newShipmentObject));
  await ctx.stub.putState(shipmentKey, dataBuffer);

  // Update the owner of each drug in the assetlist.

  let drugKeyDataBuffer, drugKey, drugObject;

	for (let index=0 ; index < listOfAssets.length ; index++){

	  drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [listOfAssets[index]]);
		drugKeyDataBuffer =  await ctx.stub
		.getState(drugKey)
		.catch(err => console.log(err));

		if(drugKeyDataBuffer.length === 0){
			throw new Error("Drug -  " + listOfAssets[index] + " does not exit");
		}

		drugObject = JSON.parse(drugKeyDataBuffer.toString());
		drugObject.owner = transporterCRN;

		drugKeyDataBuffer = Buffer.from(JSON.stringify(drugObject));
		ctx.stub.putState(drugKey, drugKeyDataBuffer);

	};

  return newShipmentObject;
}



/**
 * UPDATE THE SHIPMENT ON THE NETWORK
 * @param ctx - The transaction context object
 * @param drugName - Name of the drug
 * @param transporterCRN - Company Registration Number of the transporter picking up the shipment.
 * @param buyerCRN - Company Registration Number of the buyer of the drug
 * @returns - Shipment Object
 */

async updateShipment(ctx, buyerCRN, drugName, transporterCRN){

	 // const allowedIdentities = ["manufacturer.pharma-network.com", "distributor.pharma-network.com", "retailer.pharma-network.com", "transporter.pharma-network.com"];
   const allowedIdentities = ["transporter.pharma-network.com"];
   this.isInitiatorAllowed(ctx, allowedIdentities);
	 const shipmentKeyName = buyerCRN + "-" + drugName;
	 const shipmentKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.shipments', [shipmentKeyName]);

  let shipmentDataBuffer = await ctx.stub
      .getState(shipmentKey)
      .catch(err => console.log(err));

  if(shipmentDataBuffer.length === 0){
    throw new Error("Shipment for drug name " + drugName + " for the buyer " + buyerCRN+ " does not exit");
  }

  let shipment = JSON.parse(shipmentDataBuffer.toString());

  if(shipment.transporter !== transporterCRN) {
    throw new Error('Shipment - ' + shipment.shipmentID + " is not carried by transpoter - " + transporterCRN);

  }
  shipment.status = "delivered";

	let dataBuffer = Buffer.from(JSON.stringify(shipment));
  await ctx.stub.putState(shipmentKey, dataBuffer);

  let drugKeyDataBuffer, drugKey, drugObject, drugKeyName, index;

	console.log("Items in shipment :: " + shipment.assets.length);
	for(index = 0; index < shipment.assets.length ; index++ ) {
		drugKeyName = shipment.assets[index];
		drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [drugKeyName]);
		drugKeyDataBuffer =  await ctx.stub
		.getState(drugKey)
		.catch(err => console.log(err));

		if(drugKeyDataBuffer.length === 0){
			throw new Error("One of the drugs in drug list does not exit");
		}

		drugObject = JSON.parse(drugKeyDataBuffer.toString());
		drugObject.owner = buyerCRN;
		drugObject.shipment = shipmentKey;

		drugKeyDataBuffer = Buffer.from(JSON.stringify(drugObject));
		ctx.stub.putState(drugKey, drugKeyDataBuffer);
	}

  return shipment;

}

/**
 * PURCHASE OF DRUG BY CONSUMER DIRECTLY
 * @param ctx - The transaction context object
 * @param drugName - Name of the drug
 * @param serialNo - Serial no of the drug
 * @param retailerCRN - Company Registration Number of the retailer buying the drug.
 * @param aadhar - Aadhar Number of the buyer of the drug
 * @returns - DRUG Object
 */

async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar){

	// const allowedIdentities = ["manufacturer.pharma-network.com", "distributor.pharma-network.com", "retailer.pharma-network.com", "transporter.pharma-network.com"];
  const allowedIdentities = ["retailer.pharma-network.com"];
  this.isInitiatorAllowed(ctx, allowedIdentities);
  const drugKeyName = drugName + "" + serialNo;
  const drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [drugKeyName]);

  let drugKeyDataBuffer = await ctx.stub
  .getState(drugKey)
  .catch(err => console.log(err));

  if(drugKeyDataBuffer.length === 0){
    throw new Error("Drug with drug name " + drugName + " and serial no " + serialNo + " does not exist");
  }

  let drugObject =  JSON.parse(drugKeyDataBuffer.toString());
  if(drugObject.owner === retailerCRN) {
    drugObject.owner = customerAadhar;

    drugKeyDataBuffer = Buffer.from(JSON.stringify(drugObject));
    await ctx.stub.putState(drugKey, drugKeyDataBuffer);
    return drugObject;
  }
  else
  throw new Error("Retailer with CRN no - " + retailerCRN + "does not own the prescribed drug and hence can not sell it!!");


}

/**
 * View the current state of the drug on the Network.
 * @param ctx - The transaction context object
 * @param drugName - Name of the drug
 * @param serialNo - Serial no of the drug
 * @returns - Drug Object
 */

async viewDrugCurrentState(ctx, drugName, serialNo){

	const drugKeyName = drugName + "" + serialNo;
	const drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [drugKeyName]);


  let drugKeyDataBuffer = await ctx.stub
  .getState(drugKey)
  .catch(err => console.log(err));

  if(drugKeyDataBuffer.length === 0){
    throw new Error("Drug with drug name " + drugName + " and serial no " + serialNo + " does not exist");
  }

  return JSON.parse(drugKeyDataBuffer.toString());
}

/**
 * View the history of the drug on the Network.
 * @param ctx - The transaction context object
 * @param drugName - Name of the drug
 * @param serialNo - Serial no of the drug
 * @returns - History
 */

async viewHistory(ctx, drugName, serialNo){

	const drugKeyName = drugName + "" + serialNo;
	const drugKey = ctx.stub.createCompositeKey('org.drug-counterfiet.pharma-network.drugs', [drugKeyName]);

	let iterator = await ctx.stub.getHistoryForKey(drugKey).catch(err => console.log(err));;
    let result = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value) {
        console.info(`Found state update with value: ${res.value.value.toString('utf8')}`);
        const obj = JSON.parse(res.value.value.toString('utf8'));
        result.push(obj);
      }
      res = await iterator.next();
    }
    await iterator.close();
    return result;


  // return JSON.parse(drugKeyDataBuffer.toString());
}

/**
 * Utility function to check whether the user who invoked the function is entitled to invoke that function or not.
 * @param ctx - The transaction context object
 * @param initiator - An array of roles to be checked against the user who invoked this function.
 * @param serialNo - Serial no of the drug
 * @returns - boolean
 */

isInitiatorAllowed(ctx, initiator)
	{
		const initiatorID = ctx.clientIdentity.getX509Certificate();

    let isAllowed = false;

    for (let i=0; i< initiator.length && !isAllowed ; i++) {
      if(initiatorID.issuer.organizationName.trim() === initiator[i]){
        isAllowed = true;
        return isAllowed;
      }

    }

		if(!isAllowed)
		{
				throw new Error(initiatorID.issuer.organizationName + 'is not authorized to initiate this transaction');
		}
	 }

}

module.exports = ManufacturerContract;
