const express = require('express');
const router = express.Router();
const {
    getContract,
    exerciseChoice, deployContract, fetchContract
} = require('../ledger/LedgerComms');
const moment = require('moment-timezone')
module.exports.router = router;

let dummyUsers = require('../handlers/DummyUsers.json');


router.post('/createContract', (req, res) => {
    let random = (Math.floor(100000 + Math.random() * 900000)).toString()
    let str = "ASX"
    let txnID = str + random

    let sellerBroker = dummyUsers[req.body.seller_email].profile.exchangeProfile.brokers[0];
    let buyerBroker = dummyUsers[req.body.buyer_email].profile.exchangeProfile.brokers[0];

    var num = Math.floor(Math.random() * 90000) + 10000;
    let id = Date.now();
    var omtID = "OMT" + id;
    var asxID = "ASX" + id;
    let ledgerTime = moment.utc().format('YYYY-MM-DD')
    
    try {
        let payload = {
            "omtId": omtID,
            "operator": "BROADRIDGE",       //maintainer
            "initiator": req.body.seller_accountRegistrationName.trim().split(' ').join('').toUpperCase(),  // TODO DEVNOTE : converting names into entity IDS
            "counterparty": req.body.buyer_accountRegistrationName.trim().split(' ').join('').toUpperCase(), // TODO DEVNOTE : converting names into entity IDS
            "brokerForInitiator": sellerBroker,
            "brokerForCounterparty" : buyerBroker,
            "buy": {
                "sponsor": req.body.buyer_accountRegistrationName.trim().split(' ').join('').toUpperCase(),
                "id": (req.body.buyer_pid) ? req.body.buyer_pid : ' ',   //NEED TO ASK WHAT IS THIS
                "name": req.body.buyer_accountRegistrationName,
                "designation": (req.body.buyer_accountDesignation) ? req.body.buyer_accountDesignation : null,
                "srn": req.body.buyer_srn_hinNumber,
                "address": [req.body.buyer_registeredAddress],
                "state": req.body.buyer_state,
                "postcode": req.body.buyer_postCode,
                "country": req.body.buyer_country,
                "mobilePhone": req.body.buyer_mobilePhone,
                "homePhone": req.body.buyer_homePhone,
                "email": req.body.buyer_email,
                "tradingAccount": req.body.buyer_tradingAccountNumber

            },
            "sell": {
                "sponsor": req.body.seller_accountRegistrationName.trim().split(' ').join('').toUpperCase(),
                "id": (req.body.seller_pid) ? req.body.seller_pid  : ' ',   //NEED TO ASK WHAT IS THIS
                "name": req.body.seller_accountRegistrationName,
                "designation": (req.body.seller_accountDesignation) ? req.body.seller_accountDesignation : null ,
                "srn": req.body.seller_srn_hinNumber,
                "address": [req.body.seller_registeredAddress],
                "state": req.body.seller_state,
                "postcode": req.body.seller_postCode,
                "country": req.body.seller_country,
                "mobilePhone": req.body.seller_mobilePhone,
                "homePhone": req.body.seller_homePhone,
                "email": req.body.seller_email,
                "tradingAccount": req.body.seller_tradingAccountNumber
            },
            "securityName": req.body.securityName,
            "securityCode": req.body.asxCode,
            "securityDescription": req.body.descriptionOfSecurities,

            "units": parseFloat(req.body.unitsToTransfer),
            "consideration": parseFloat(req.body.consideration),
            "asxRefId": asxID,
            "txnRefId": null,

            "date": req.body.dateOfTransfer,

            "status": "Proposed",
            "reason": null,
            "completedParty": null,
            
            "events": [[ledgerTime, req.body.seller_accountRegistrationName.trim().split(' ').join('').toUpperCase(), `${req.body.seller_accountRegistrationName} created OMT request`]]

        }

        deployContract("TransferRequest:TransferRequest", "BROADRIDGE", payload)
            .then((response) => {
                    if (!response) {
                        // logger.failed(`Failed to deploy contract`,res.locals.SVCREQID);
                        console.log(response)
                    }
                    res.send({ status: true, responseData: response });
                },
                (reject) => {
                    res.send({ status: false, errMsg: "Failed to Deploy contract" });
                })

    } catch (error) {
        // logger.error(`System error`, res.locals.SVCREQID, error);
        res.send({ status: false, msg: 'System Error Occured. Please Check Error Logs' })
    }

});


router.post('/accept', (req, res) => {
    let entityId = req.body.entityId;
    let omtId = req.body.omt

    let key = {
        "_1": "BROADRIDGE",
        "_2": omtId
    }
    
    try {
        fetchContract("TransferRequest:TransferRequest", "BROADRIDGE", key)
            .then(async (response) => {
                let contractId = response["result"]["contractId"]
                let payload = {
                    "party": entityId
                }
                exerciseChoice("TransferRequest:TransferRequest", contractId, entityId, "Accept", payload)
                    .then(
                        (response) => {
                            
                            fetchContract("TransferRequest:TransferRequest", "BROADRIDGE", key)
                                .then((response) => {

                                    let dataSet  = response.result.payload
                                    let new_contractId = response["result"]["contractId"]

                                    if (dataSet.units > 1000 && dataSet.securityCode === "BHP") {

                                        //WE NEED TO EXERCISE REJECT IN THIS SECTION. REJECTION BY ASX
                                        let new_payload =
                                        {
                                            "party": "BROADRIDGE",
                                            "rejectReason": "ASX - Insufficient Quantity"
                                        }
                                        exerciseChoice("TransferRequest:TransferRequest", new_contractId, "BROADRIDGE", "Reject", new_payload).
                                            then((response) => {
                                                res.status(200).send({ status: true, responseData: response, msg: `Contract reject [${new_contractId}]` })
                                            })
                                    } else if (dataSet.securityCode === "CBA") {

                                        //WE NEED TO EXERCISE REJECT IN THIS SECTION. REJECTION BY ASX
                                        let new_payload =
                                        {
                                            "party": "BROADRIDGE",
                                            "rejectReason": "ASX - Invalid Transfer of Securities"
                                        }
                                        exerciseChoice("TransferRequest:TransferRequest", new_contractId, "BROADRIDGE", "Reject", new_payload).
                                            then((response) => {
                                                res.status(200).send({ status: true, responseData: response, msg: `Contract reject [${new_contractId}]` })
                                            })
                                    } else {

                                        //WE NEED TO EXERCISE COMPLETE IN THIS SECTION. COMPLETE BY ASX
                                        let new_payload =
                                        {
                                            "party": "BROADRIDGE"
                                        }
                                        exerciseChoice("TransferRequest:TransferRequest", new_contractId, "BROADRIDGE", "Complete", new_payload).
                                            then((response) => {
                                                res.status(200).send({ status: true, responseData: response, msg: `Contract complete [${new_contractId}]` })
                                            })
                                        res.status(200).send({ status: true, responseData: response, msg: `Contract accept [${contractId}]` })
                                    }
                                })
                        },
                        (err) => {
                            // logger.failed(`Failed to accept on [${contractId}]`,res.locals.SVCREQID);
                            console.log(err);
                            res.status(400).send({ status: false, error: err.response.data, errorMsg: `Contract accept failed on [${contractId}]` })
                        })
            })
    } catch {
    }
})

router.post('/reject', (req, res) => {
    let rejectReason = req.body.rejectReason;
    let entityId = req.body.entityId
    let omtId = req.body.omtId;

    let key = {
        "_1": "BROADRIDGE",
        "_2": omtId
    }
    try {
        // logger.info(`Attempting Rejection on OMTID : ${omtId}`,res.locals.SVCREQID);
        fetchContract("TransferRequest:TransferRequest", "BROADRIDGE", key)
            .then(async (response) => {

                let contractId = response["result"]["contractId"]
                let payload = {
                    "party": entityId,
                    "rejectReason": rejectReason
                }
                exerciseChoice("TransferRequest:TransferRequest", contractId, entityId, "Reject", payload)
                    .then(
                        (response) => {
                            res.status(200).send({ status: true, responseData: response, msg: `Contract reject [${contractId}]` })
                        },
                        (err) => {
                            // logger.failed(`Failed to withdraw on [${contractId}]`,res.locals.SVCREQID);
                            console.log(err);
                            res.status(400).send({ status: false, error: err.response.data, errorMsg: `Contract reject failed on [${contractId}]` })
                        })
            })
    } catch(e) {
        console.log(e)
    }
})

router.post('/withdraw', (req, res) => {
    let withdrawalReason = req.body.withdrawalReason;
    let entityId = req.body.entityId;
    let omtId = req.body.omtId

    let key = {
        "_1": "BROADRIDGE",
        "_2": omtId
    }
    try {
        // logger.info(`Attempting Withdrawal on OMTID : ${omtId}`,res.locals.SVCREQID);
        fetchContract("TransferRequest:TransferRequest", "BROADRIDGE", key)
            .then(async (response) => {
                
                let contractId = response["result"]["contractId"]
                let payload = {
                    "withdrawalReason": withdrawalReason
                }
                
                exerciseChoice("TransferRequest:TransferRequest", contractId, entityId, "Withdraw", payload)        //send contract key as a composite key  
                    .then(
                        (response) => {
                            res.status(200).send({ status: true, responseData: response, msg: `Contract withdraw [${contractId}]` })
                        },
                        (err) => {
                            // logger.failed(`Failed to withdraw on [${contractId}]`,res.locals.SVCREQID);
                            console.log(err);
                            res.status(400).send({ status: false, error: err.response.data, errorMsg: `Contract withdraw failed on [${contractId}]` })
                        })
            })
    } catch(e) {
        console.log(e)
    }
})

router.post('/complete', (req, res) => {
    
    let entityId = req.body.entityId;
    let omtId = req.body.omtId;

    let key = {
        "_1": "BROADRIDGE",
        "_2": omtId
    }
    try {
        fetchContract("TransferRequest:TransferRequest", entityId, key)
            .then(async (response) => {

                //WE NEED TO FETCH THE CONTRACT ID WHICH MAPS TO A UNIQUE REFERENCE NUMBER
                let contractId = response["result"]["contractId"]

                let payload = {
                    "party": entityId
                }

                exerciseChoice("TransferRequest:TransferRequest", contractId, entityId, "Complete", payload)
                    .then(
                        (response) => {
                            // logger.info(`Contract completed on [${contractId}]`,res.locals.SVCREQID);
                            res.status(200).send({ status: true, responseData: response, msg: `Contract completed [${contractId}]` })
                        },
                        (err) => {
                            // logger.failed(`Failed to completed on [${contractId}]`,res.locals.SVCREQID);
                            console.log(err);
                            res.status(400).send({ status: false, error: err.response.data, errorMsg: `Contract completed failed on [${contractId}]` })
                        })

            })
    } catch {

    }
})