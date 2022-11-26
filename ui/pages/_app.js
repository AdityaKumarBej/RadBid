import App                  from 'next/app';
import React                from 'react';
import Head                 from 'next/head';
import PropTypes            from 'prop-types';
import CssBaseline          from '@material-ui/core/CssBaseline';
import {ThemeProvider}      from '@material-ui/core/styles';
import {
    UI_CONTEXT_ROOT,
    INTERNAL_API_URL,
    nonAuthPages
}                           from '../src/GlobalConfig';
import theme                from '../src/Theme';
import cookies              from 'next-cookies';
import fetch                from 'isomorphic-unfetch';
import './GlobalStyles/styles.css';

const CustomApplication = ({Component, pageProps}) => {
    React.useEffect(() => {
        /** Removing server-side injected CSS */
        const jssStyles = document.querySelector('#jss-server-side');
        if(jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    },[])

    return (
        <React.Fragment>
            <Head>
                <title>Broadridge Financial Solutions</title>
                <link rel="icon" href={`${UI_CONTEXT_ROOT}/favicon.ico`}></link>
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </React.Fragment>
    );

}

CustomApplication.getInitialProps = async (appContext) => {
    let returnStub = {};
    let pageProps = await App.getInitialProps(appContext);
    /** Capture cookie on the server side */
    const cookie = cookies(appContext.ctx)
    /**
     * Check for user authorization
     *  -> Cookie should contain authToken
     *      -> If not found -> Redirect to login page
     */
    if((cookie.authToken === undefined || cookie.authToken.trim().length === 0)) {
        /**
         * Certain pages don't need authentication.
         * These pages can be configured in next.config.js under nonAuthPages
         */
        if(nonAuthPages.includes(appContext.ctx.pathname.replace(UI_CONTEXT_ROOT,''))){
            returnStub = {pageProps}
        } else {
            returnStub = redirectTo(`${UI_CONTEXT_ROOT}/login`, appContext.ctx, pageProps)
        }
    } else {
        
        /**
         * We found an authToken in cookie
         *  -> Validate this token and proceed
         *  -> If validation fails
         *      -> Clear cookie and redirect to login page
         */

        await fetch(`${INTERNAL_API_URL}/auth/validate`,{
            method: 'post',
            headers: {
               'Accept': 'application/json, text/plain, */*',
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${cookie.authToken}`
           }
        })
        .then(res => res.json())
        .then(res => {
            if(res.result === true) {
                if(appContext.ctx.pathname.replace(UI_CONTEXT_ROOT,'') === '/Login') {
                    /**
                     * We came here either due to a bookmark or a manual typing of login in url
                     *  -> We shouldn't show a login page, if we are in posession of a valid token
                     *  -> Redirect this attempt to a valid homepage
                     *  -> In case homePage is set on cookie, redirect user to said page
                     */
                    let homePage = `${UI_CONTEXT_ROOT}/`
                    if(cookie.homePage && cookie.homePage.trim().length > 0) {
                        homePage = `${UI_CONTEXT_ROOT}${cookie.homePage}`
                    }
                    /** Redirect to homepage */
                    returnStub = redirectTo(`${UI_CONTEXT_ROOT}${homePage}`, appContext.ctx, pageProps)
                } else {
                    returnStub = {...pageProps, ...{query: appContext.ctx.query, authToken: cookie.authToken}}
                }
            } else {
                /**
                 * Expired or invalid token
                 *  -> Clear token from cookie
                 *      -> This will be taken care on the client side by the login page
                 *  -> Redirect to login page
                 */
                returnStub = redirectTo(`${UI_CONTEXT_ROOT}/login`, appContext.ctx, pageProps);
            }
        })
        .catch((err) => {
            /** 
             * Something terrible has to happen if we reached here. 
             *  -> Curse yourself for having to read this
             */
            console.log(err);
            returnStub = {pageProps}
        })
    }

    return returnStub
}

const redirectTo = (target, context, pageProps) => {
    /** Ensuring we are executing on the server side */
    if(typeof window === 'undefined' && context.res.writeHead) {
        context.res.writeHead(302, {Location: target});
        context.res.end();
    }
    return {...pageProps}
}

CustomApplication.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
}

export default CustomApplication;