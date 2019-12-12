import request from '@/api/request';

export function loginApi(data) {
    return request({
        method: 'post',
        url: `/api/user/login`,
        data
    })
}

export function registerApi(data) {
    return request({
        method: 'post',
        url: `/api/user/register`,
        data
    })
}

export function userUpdataApi(data) {
    return request({
        method: 'post',
        url: `/api/user/updata`,
        data
    })
}