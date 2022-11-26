module.exports.DEFAULT = {
    port: 9086,
    contextRoot: '/api',
    url: 'http://localhost:9086/api',
    nonAuthPaths: [

    ],
    appConfig: {
        jwtConfig: {
            "secret": parseInt(process.env.JWT_SECRET) || "klaatubaradanikto",
            "expiry": parseInt(process.env.JWT_EXPIRY, 10) || 86400000
        }
    },
    ledgerConfig: {
        ledgerId: 'asxomt-sandbox',
        host: 'localhost',
        port: 6865,
        jsonApiHost: 'localhost',
        jsonApiPort: 7575
    }
}

module.exports.QA = {
    port: 9086,
    contextRoot: '/api',
    url: 'http://qa-myapi.broadridge.net/api',
    ledgerConfig: {
        ledgerId: 'ASX-OMT-Sandbox',
        host: 'localhost',
        port: 6865,
        jsonApiHost: 'localhost',
        jsonApiPort: 7575
    }
}

module.exports.UAT = {
    port: 9086,
    contextRoot: '/api',
    url: 'http://uat-myapi.broadridge.net/api',
    ledgerConfig: {
        ledgerId: 'ASX-OMT-Sandbox',
        host: 'localhost',
        port: 6865,
        jsonApiHost: 'localhost',
        jsonApiPort: 7575
    }
}

module.exports.PROD = {
    port: 9086,
    contextRoot: '/api',
    url: 'http://myapi.broadridge.net/api',
    ledgerConfig: {
        ledgerId: 'ASX-OMT-Sandbox',
        host: 'localhost',
        port: 6865,
        jsonApiHost: 'localhost',
        jsonApiPort: 7575
    }
}
