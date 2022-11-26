const fs = require('fs');
const config = require('./config/ConfigProvider');
const crypto = require('crypto');
const helmet = require('helmet');
const apiSpec = require('./apispec/openapi.json');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const jsonToYaml = require('json-to-pretty-yaml');
const packageInfo = require('./package.json');
const { resolve } = require('path');
let app;
const contextRoot = config.get('contextRoot');              // Context root on which this API will be served
const port = config.get('port')                             // Port on which API will listen for requests
const nonAuthPaths = config.get('nonAuthPaths')             // Paths and endpoints that dont need authentication

/**
 * Boot up application
 */
const bootExpress = () => {
    return new Promise((resolve, reject) => {

        console.log('Attaching Middleware');
        app = express();                                                        // This line initializes an express application instance
        app.use(helmet());                                                      // Attaching helmet to set various http security header
        app.use(express.json({ limit: process.env.API_BODY_LIMIT || '100kb' }));  // Attaching JSON parser for request body
        app.use(express.urlencoded({ extended: true }));                          // Allowing url encoded forms

        /* Catch error from bodyparser */
        /* istanbul ignore next */
        app.use((err, req, res, next) => {
            if (err) {
                console.log('Failed to parse post body : Invalid JSON')
                res.send({ status: false, errMsg: 'Bad request' })
            } else {
                next();
            }
        })

        /* Allow CORS */
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Authentication, Origin, X-Requested-With, Content-Type, Accept");
            next();
        })

        app.use((req, res, next) => {
            /** Respond to pre-flight options calls */
            if (req.method === 'OPTIONS' || req.method === 'options') {
                res.status(200).send();
            } else {
                next();
            }
        })

        /* Create a unique request Id that can be used to track the request end to end */
        app.use((req, res, next) => {
            /**
             * Check if this request already carries a SVCREQID
             *  -> This would happen when a sister application/component sends request that needs to be tracked end to end
             */
            res.locals.SVCREQID = req.get('SVCREQID');
            if (!res.locals.SVCREQID || res.locals.SVCREQID.trim().length === 0) {
                res.locals.SVCREQID = crypto.randomBytes(4).toString('hex')
            }
            next();
        })

        /**
         * API Auth validation
         */
        app.use((req, res, next) => {
            if (nonAuthPaths.includes(req.path.replace(contextRoot, '')) ||
                req.path.replace(contextRoot, '').startsWith('/ping') ||
                req.path.replace(contextRoot, '').startsWith('/api-docs') ||
                req.path.replace(contextRoot, '').startsWith('/static') ||
                req.path.replace(contextRoot, '').startsWith('/spec')
            ) {
                next();
            } else {
                //let tokenValidity = AuthHandler.validateAccessToken(req.get('Authorization'))
                //if(tokenValidity.result === true) {
                next();
                //} else {
                //    res.status(401).send({ result: false, errMsg: tokenValidity.errMsg || 'Unauthorized' })
                //}
            }
        })

        resolve();
    });
}

/**
 * Build API specification
 */
const buildAPISpec = () => {
    return new Promise((resolve, reject) => {
        console.log('Building API Specifications');

        apiSpec.info = {}
        apiSpec.info.title = "RadBid";
        apiSpec.info.version = packageInfo.version;
        apiSpec.info.description = "Prototype - Backend for interacting with Scrypto Services";
        apiSpec.info.termsOfService = "";
        apiSpec.servers = [
            { url: config.get('url') }
        ]
        if (!fs.existsSync('./public')) {
            fs.mkdirSync('./public');
        }

        fs.writeFileSync('./public/openapi.json', JSON.stringify(apiSpec, null, 4));
        fs.writeFileSync('./public/openapi.yaml', jsonToYaml.stringify(apiSpec));

        let options = {
            customCssUrl: `${contextRoot}/static/themes/blue.css`,
            customJs: `${contextRoot}/static/scripts/bootUI.js`
        }

        app.use(`${contextRoot}/api-docs`, swaggerUI.serve, swaggerUI.setup(apiSpec, options))
        resolve();
    });
}

/**
 * Register Routes
 */
const registerRoutes = () => {
    return new Promise((resolve, reject) => {
        app.use(`${contextRoot}/static`, express.static('static'))
        app.get(`${contextRoot}/`, (req, res) => {
            res.send({ name: packageInfo.name, version: packageInfo.version })
        })
        app.use(`${contextRoot}/ping/:pingid`, (req, res) => {
            res.send({ status: true, msg: `PONG-${req.params.pingid}`, name: packageInfo.name, version: packageInfo.version, uptime: process.uptime() })
        })

        app.use(`${contextRoot}/spec`, require('./src/handlers/SpecHandler'));
        app.use(`${contextRoot}/auth`, require('./src/handlers/DummyAuthHandler').router);
        app.use(`${contextRoot}/submit`, require('./src/reference/Submit').router);
        resolve()
    });
}

/**
 * Start Listening
 */

bootExpress()
    .then(() => buildAPISpec())
    .then(() => registerRoutes())
    .then(() => {
        app.listen(port, (err) => {
            console.log(`Server listening on [CONTEXTROOT:${contextRoot}][PORT:${port}]`)
        })
    })
