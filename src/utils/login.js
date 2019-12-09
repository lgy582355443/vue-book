
const TokenKey = 'ADMIN';

export function getToken() {
    var info = window.localStorage.getItem(TokenKey);
    if (info) {
        return JSON.parse(info);
    } else {
        return null;
    }
}

export function setToken(token) {
    //只能存字符串
    var userInfo = JSON.stringify(token);
    window.localStorage.setItem(TokenKey, userInfo);
}

export function removeToken() {
    return window.localStorage.removeItem(TokenKey)
}