import jwt_decode from 'jwt-decode';
import { backboneApiBaseUrl } from './constants';
import axiosWrapper from '../shared/axios-wrapper';


function removeTokens() {
    localStorage.clear();
}

function getAccessToken() {
    return localStorage.getItem("access");
}

function logIn(username, password) {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    return axiosWrapper.post(backboneApiBaseUrl + "/token", data).then(resp => {
        if (resp.status === 200) {
            localStorage.setItem("access", resp.data.data.access);
            localStorage.setItem("refresh", resp.data.data.refresh);
            return true;
        }
    }).catch(err => {
        const error = err.response;
        if (error.data.errors[0].detail === "No active account found with the given credentials") {
            return false;
        }
    });
}


function getDecodedAccessToken() {
    const token = getAccessToken();
    if (token != null) {
        return jwt_decode(token);
    }
}

function getLoggedInUserUrl() {
    return getDecodedAccessToken() != null ? "/user/" + getDecodedAccessToken().user_id : "/"
}

function isAdmin() {
    if (getDecodedAccessToken().type === "administrator") {
        return true;
    }
    return false;
}

function isAuthorized(id) {
    const token = getDecodedAccessToken();
    if (!token || (!isAdmin() && parseInt(token.user_id) !== parseInt(id))) {
        return false;
    }

    return true;
}

function isSubscribedToCategory(categoryId) {
    const token = getDecodedAccessToken();
    return token.categories.filter(category => {
        return parseInt(category.id) === parseInt(categoryId);
    }).length > 0;
}

function isSubscribedToCategoryByName(categoryName) {
    const token = getDecodedAccessToken();
    return token.categories.filter(category => {
        return category.name.trim().toLowerCase() === categoryName.trim().toLowerCase();
    }).length > 0;
}

export {
    getAccessToken,
    getDecodedAccessToken,
    getLoggedInUserUrl,
    isAdmin,
    isAuthorized,
    removeTokens,
    isSubscribedToCategory,
    isSubscribedToCategoryByName,
    logIn
}