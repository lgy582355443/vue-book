
const TokenKey = 'Token';

export function getToken() {
    var token = window.localStorage.getItem(TokenKey);
    if (token) {
        return JSON.parse(token);
    } else {
        return null;
    }
}

export function setToken(token) {
    //只能存字符串
    var token = JSON.stringify(token);
    window.localStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return window.localStorage.removeItem(TokenKey)
}