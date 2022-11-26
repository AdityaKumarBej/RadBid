import Axios from 'axios';
import {
    UI_CONTEXT_ROOT,
    API_URL
} from '../src/GlobalConfig';
import redirectTo from './RedirectTo';

let token = undefined

export const axios = Axios.create({
    baseURL: API_URL,
    timeout: 180000
})

axios.interceptors.request.use((config) => {
    if (token === undefined) {
        token = sessionStorage.getItem('accessToken');
    }
    config.headers.common['Authentication'] = token
    return config;
})

axios.interceptors.response.use((response) => {
    if (response.data.authStatus !== undefined && response.data.authStatus === false) {
        sessionStorage.clear();
        redirectTo(`${UI_CONTEXT_ROOT}/`)
    } else {
        return response;
    }
})
