const next      = require('next')
const {parse}   = require('url')
const express   = require('express');
const {
    name,
    version
}               = require('./package.json')

const CONTEXT_ROOT      = process.env.UI_CONTEXT_ROOT       || ''
const port              = parseInt(process.env.UI_PORT, 10) || 3000;
const dev               = process.env.NODE_ENV !== 'production';
const metricsEnabled    = (process.env.METRICS_LOGGING_ENABLED && process.env.METRICS_LOGGING_ENABLED === 'true')? true : false;

const app       = next({dev});
const handle    = app.getRequestHandler();

/**
 * Register all public page serving paths here
 */
let registry = {
    mappings: {
        [`${CONTEXT_ROOT}`]             : "/Index",
        [`${CONTEXT_ROOT}/`]            : "/Index",
        [`${CONTEXT_ROOT}/login`]       : "/Login",
        [`${CONTEXT_ROOT}/dashboard`]   : "/Dashboard",
        [`${CONTEXT_ROOT}/auctions`]    : "/AuctionBrowse",
        [`${CONTEXT_ROOT}/users`]       : "/Users",
        [`${CONTEXT_ROOT}/uploadFile`]  : "/UploadFile",
        [`${CONTEXT_ROOT}/addUser`]     : "/AddUser",  
        [`${CONTEXT_ROOT}/registerAuctionItem`]     : "/RegisterAuctionItem"
    }
}

app.prepare()
    .then(() => {
        const server = express();

        /** 
         * Handler to capture metrics 
         *  -> Metrics are logged only when environment METRICS_LOGGING_ENABLED os set to true
         */
        server.use((req, res, forward) => {
            if(metricsEnabled) {
                const { pathname, path, href, query } = parse(req.url, true);
                const start = Date.now();
                res.on('finish', () => {
                    if (pathname && pathname.indexOf('/_next') < 0) {
                        const duration = Date.now() - start;
                        console.log(`Served ${pathname} in ${duration}`)
                    }
                })
            }

            return forward()
        })

        /**
         * All page and asset requests are caught by below handler
         */
        server.all('*', (req, res) => {

            const{pathname, path, href, query} = parse(req.url, true);
           
            if(Object.keys(registry.mappings).includes(pathname)) {
                let resolvedPath = registry.mappings[pathname];
                app.render(req, res, resolvedPath, query);
            } else {

                /**
                 * A path rewrite maybe necessary in case 
                 *  - A basepath has been set and we have received a request that doesnt start with basepath
                 *  - A basepath has been set and a CSS URL is configured
                 */
                if(CONTEXT_ROOT.trim().length > 0 && !pathname.startsWith(CONTEXT_ROOT)) {
                    req.url = `${CONTEXT_ROOT}${req.url}`
                }
                handle(req, res);
            }

        })

        server.listen(port, (err) => {
            if(err) throw err

            console.log(`+-----------------------------------------------+`)
            console.log(`   ${name} : ${version}`)
            console.log(`+-----------------------------------------------+`)
            console.log(`   +- UI Application booted`)
            console.log(`   +- CONTEXT_ROOT : ${CONTEXT_ROOT}`)
            console.log(`   +- PORT : ${port}`)
            console.log(`   +- DEV MODE : ${dev}`)
            console.log(`   +- METRICS ENABLED : ${metricsEnabled}`)
            console.log(`+-----------------------------------------------+`)
        })
    })