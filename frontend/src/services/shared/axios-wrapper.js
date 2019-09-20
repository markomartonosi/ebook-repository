//Used for intercepting every request sent to the backbone service and adding authorization header with access key from localStorage.
import axios from 'axios';
import {backboneApiBaseUrl} from './constants';
import {getAccessToken} from './auth';

const axiosWrapper = axios.create();

axiosWrapper.interceptors.request.use(config => {
    if(config.url.includes(backboneApiBaseUrl)) {
        const bearerToken = getAccessToken();
        if(bearerToken) config.headers["Authorization"] = `Bearer ${bearerToken}`;
    }
    return config;
});

export default axiosWrapper;