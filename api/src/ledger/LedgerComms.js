/** Provides utility methods to access ledger */
require('../../custom-console');
const util          = require('util');
const axios         = require('axios');
const crypto        = require('crypto');
const config        = require('../../config/ConfigProvider');
const ledgerConfig  = config.get('ledgerConfig')

/**
 * Builds and returns a JWT OAUTH2 token
 * TODO - This is not for production and is to be replaced a RSA token once the tooling
 * is available from DA
 * @param {string} partyName 
 */
const getTokenFor = (partyName) => {
    let header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    /**
     * JwT token struture changed as per latest DAML SDK version 0.13.55
     */
    let payload = {
        "https://daml.com/ledger-api": {
            "ledgerId": ledgerConfig.ledgerId,
            "applicationId": "DLR-JSON-GateWay",
            "actAs": [partyName]
        }
    }
    let headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64');
    let payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

    let hmac = crypto.createHmac('sha256', 'secret');
    let digest = hmac.update(`${headerBase64}.${payloadBase64}`).digest().toString('base64');

    return `${headerBase64}.${payloadBase64}.${digest}`.replace(/=/g, '')
}

const getContract = (templateName, partyName, queryParams) => {
    return new Promise(async (resolve, reject) => {
        /**
         * Payload stucture has changed as per latest DAML SDK version 0.13.55
         */
        let payload = {
            'templateIds': [templateName]
        }
        if (queryParams) {
            payload = {
                'templateIds': payload['templateIds'],
                query: queryParams
            }
        }

        let accessToken = await getTokenFor(partyName);

        let reqConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
        /**
         * JSON API end point has changed from /contracts/search to /v1/query
         * as per latest DAML SDK version 0.13.55
         */
        try {
            axios.post(
                `http://localhost:7575/v1/query`,
                payload,
                reqConfig
            )
                .then((response) => {
                    resolve(response.data);
                })
                .catch(err =>
                    reject(err))

        } catch (e) {
            console.log(e)
        }
    })
}



const fetchContract = (templateName, boss, key) => {
    return new Promise(async (resolve, reject) => {

        let payload = {
            'templateId': templateName,
            "key": key
        }

        // let key = {
        //     "_1": "BROADRIDGE",
        //     "_2": "OMT001"
        // }
        let accessToken = await getTokenFor(boss);

        let reqConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
        /**
         * JSON API end point has changed from /contracts/search to /v1/query
         * as per latest DAML SDK version 0.13.55
         */
        try {
            axios.post(
                `http://localhost:7575/v1/fetch`,
                payload,
                reqConfig
            )
                .then((response) => {
                    resolve(response.data);
                })
                .catch(err =>
                    reject(err))

        } catch (e) {
            console.log(e)
        }
    })
}

/**
 * Deploys an instance of DAML template
 * @param {string} templateName - Fully qualified name of the DAML template ex 'modulename:entityname'
 * @param {string} partyName - party through which this template is to be deployed
 * @param {object} deployArguments - JSON with arguments as per DAML LF spec
 * @param {object} req - Actual APi request object
 */
const deployContract = (templateName, partyName, deployArguments, req) => {
    return new Promise(async (resolve, reject) => {
        console.log(`Received Deploy Req [${templateName}][${partyName}]`);
        let accessToken = await getTokenFor(partyName);
        /**
         * Payload stucture has changed as per latest DAML SDK version 0.13.55
         */
        let payload = {
            'templateId': templateName,
            payload: deployArguments
        }


        console.log(`Deploying [${templateName}][${partyName}]`);
        /** Transmitting deployment command */
        let reqConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        /**
         * JSON API end point has changed from /command/create to /v1/create
         * as per latest DAML SDK version 0.13.55
         */
        axios.post(
            `http://${ledgerConfig.jsonApiHost}:${ledgerConfig.jsonApiPort}/v1/create`,
            payload,
            reqConfig
        )
            .then((response) => {
                console.log(`Deployed [${templateName}][${partyName}]`);
                resolve(response.data);
            })
            .catch(err => {console.log(err);reject(err)})

    })
}

/**
 * 
 * @param {string} templateName - Fully qualified name of the DAML template ex 'modulename:entityname'
 * @param {string} contractId - Current contract Id of mentioned template
 * @param {string} partyName - party through which this template is to be deployed
 * @param {string} choiceName - Name of the choice on the template
 * @param {object} choiceArguments - JSON with arguments as per DAML LF spec
 * @param {object} req - Actual APi request object
 */
const exerciseChoice = (templateName, contractId, partyName, choiceName, choiceArguments, req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accessToken = await getTokenFor(partyName);
            /**
             * Payload stucture has changed as per latest DAML SDK version 0.13.55
             */
            let payload = {
                'templateId': templateName,
                'contractId': contractId,
                'choice': choiceName,
                'argument': {}
            }
            if (choiceArguments) {
                payload['argument'] = choiceArguments;
            }

            // console.log(`Exercising [${templateName}][${partyName}][${choiceName}] with [${JSON.stringify(choiceArguments)}]`);
            /** Transmitting deployment command */
            let reqConfig = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            /**
             * JSON API end point has changed from /command/exercise to /v1/exercise
             * as per latest DAML SDK version 0.13.55
             */
            try {
                axios.post(
                    `http://${ledgerConfig.jsonApiHost}:${ledgerConfig.jsonApiPort}/v1/exercise`,
                    payload,
                    reqConfig
                )
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch(err => {
                        resolve(err);
                    })
            } catch (error) {
                console.log(error)
            }

        } catch (e) {
            console.log(e)
            console.log(e.response.data);
        }
    })
}

module.exports.getContract = getContract;
module.exports.deployContract = deployContract;
module.exports.exerciseChoice = exerciseChoice;
module.exports.fetchContract = fetchContract;
