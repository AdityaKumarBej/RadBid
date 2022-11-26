const crypto = require('crypto');
const axios = require('axios');
const express = require('express');
const utils = require('../Utils');
const router = express.Router();
const config = require('../../config/ConfigProvider');
const appConfig = config.get('appConfig');
// const logger = require('@broadridge/logger');

let methods = {};

const algs = {
    'HS256': 'sha256',
    'HS384': 'sha384',
    'HS512': 'sha512',
    'RS256': 'rsa-sha256',
    'RS384': 'rsa-sha384',
    'RS512': 'rsa-sha512',
}

let approvedDummyUsers = require('./DummyUsers.json');

router.post('/getAccessToken', (req, res) => {
    try {
        /** Check for all mandatory fields */
        let mandatoryFields = ['email', 'password'];
        let isPayloadValid = utils.mandatoryFieldCheck(req.body, mandatoryFields);

        if (!isPayloadValid.status) {
            console.log(`Missing parameters ${isPayloadValid.missingFields.join(',')}`, res.locals.SVCREQID)
            res.status(400).send(utils.buildMissingFieldResponse(isPayloadValid.missingFields))
        } else {
            let email = req.body.email.trim().toLowerCase();
            let password = req.body.password.trim();
            console.log(`Access Token Request [${email}]`, res.locals.SVCREQID);
            if (approvedDummyUsers[email] && approvedDummyUsers[email].pwd === password) {
                console.log(`Login Success [${email}]`, res.locals.SVCREQID);
                let accessToken = generateAccessToken({ email: email });
                res.status(200).send(accessToken)
            } else {
                console.log(`Login Failed [${email}]`, res.locals.SVCREQID);
                res.status(401).send({ status: false, errMsg: 'Invalid Credentials' })
            }
        }

    } catch (e) {
        console.log(`Error`, res.locals.SVCREQID, e);
        res.status(400).send({ status: false, errMsg: `System error, Please check logs [${req.locals.SVCREQID}]` })
    }
})

router.post('/login', (req, res) => {
    try {
        /** Check for all mandatory fields */
        let mandatoryFields = ['email', 'password'];
        let isPayloadValid = utils.mandatoryFieldCheck(req.body, mandatoryFields);

        if (!isPayloadValid.status) {
            console.log(`Missing parameters ${isPayloadValid.missingFields.join(',')}`, res.locals.SVCREQID)
            res.status(400).send(utils.buildMissingFieldResponse(isPayloadValid.missingFields))
        } else {
            let email = req.body.email.trim().toLowerCase();
            let password = req.body.password.trim();

            console.log(`Access Token Request [${email}]`, res.locals.SVCREQID);
            if (approvedDummyUsers[email] && approvedDummyUsers[email].pwd === password) {
                console.log(`Login Success [${email}]`, res.locals.SVCREQID);
                let accessToken = generateAccessToken({ email: email });
                let profile = approvedDummyUsers[email].profile;
                res.status(200).send({ status: true, token: accessToken, profile: profile })
            } else {
                console.log(`Login Failed [${email}]`, res.locals.SVCREQID);
                res.status(401).send({ status: false, errMsg: 'Invalid Credentials' })
            }
        }

    } catch (e) {
        console.log(`Error`, res.locals.SVCREQID, e);
        res.status(400).send({ status: false, errMsg: `System error, Please check logs [${req.header['SVCREQID']}]` })
    }
})

router.post('/validate', (req, res) => {
    let authHeader = req.get('Authorization');
    let tokenValidity = validateAccessToken(authHeader)
    //console.log.info(`Token Validation Request`,res.locals.SVCREQID);
    if (!tokenValidity.result) {
        console.log(`Token Validation Failed`, res.locals.SVCREQID);
        tokenValidity.messages.forEach(message => {
            console.log(`${message}`, res.locals.SVCREQID);
        });
    }
    res.status(200).send({ result: tokenValidity.result });

})


/**
 * Generates JSON Webtoken
 *  -> expiry configuration from JWT_CONFIG
 */
const generateAccessToken = (requestedPayload) => {
    let header = {
        'alg': 'HS256',
        'typ': 'JWT'
    }

    let payload = {
        'expiresOn': new Date().getTime() + appConfig.jwtConfig.expiry,
        'email': requestedPayload.email,
        'token': createSignature(header.alg, requestedPayload.email)
    }

    let base64Header = Buffer.from(JSON.stringify(header)).toString('base64');
    let base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = createSignature(header.alg, `${base64Header}.${base64Payload}`)

    return `${base64Header}.${base64Payload}.${signature}`
}

/**
* Validates a JWT
*/
const validateAccessToken = (authHeader) => {

    if (!authHeader || !authHeader.trim().length === 0 || !authHeader.startsWith('Bearer')) {
        return { result: false, errMsg: 'Malformed Token' };
    }

    /**
     * [1]-> Check for expiry
     * [2]-> Check if secondary token signature tallies
     * [3]-> Check if token signature tallies
     */

    let tokenIsValid = true;
    let messages = [];

    let token = authHeader.split(' ')[1];
    if (token.trim().length === 0) {
        /** Some wise ass tried to send a blank token */
        tokenIsValid = false;
        messages.push('Malformed Token');
        return { result: tokenIsValid, messages: messages };
    }

    try {
        let sections = token.split('.');
        let header = JSON.parse(Buffer.from(sections[0], 'base64').toString());
        let payload = JSON.parse(Buffer.from(sections[1], 'base64').toString());
        let signature = sections[2];


        // [1]
        if (new Date().getTime() > payload.expiresOn) {
            /** Token has expired */
            tokenIsValid = false;
            messages.push(`Token Expired [${payload.email}]`)
        }

        // [2]
        if (!verifySignature(header.alg, payload.email, payload.token)) {
            /** Secondary Token has been tampered with */
            tokenIsValid = false;
            messages.push(`Token payload tampering detected [${payload.email}]`);
        }

        //[3]
        if (!verifySignature(header.alg, `${sections[0]}.${sections[1]}`, signature)) {
            /** Token has been tampered with */
            tokenIsValid = false;
            messages.push(`Token tampering detected [${payload.email}]`);
        }
        return { result: tokenIsValid, messages: messages };
    } catch (error) {
        console.log(`Malformed Token`, res.locals.SVCREQID, error);
        return { result: false, errMsg: 'Malformed Token', messages: [] };
    }

}

const createSignature = (alg, message) => {
    let hmac = crypto.createHmac(algs[alg], appConfig.jwtConfig.secret);
    return hmac.update(message).digest().toString('base64');
}

const verifySignature = (alg, message, signature) => {
    let derivedSignature = createSignature(alg, message);
    return (derivedSignature === signature);
}

module.exports.router = router;
module.exports.validateAccessToken = validateAccessToken;
