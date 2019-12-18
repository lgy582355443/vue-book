import request from '@/api/request';
import axios from 'axios'

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


export function changeAvatarApi(userId, data) {
    return axios({
        method: "post",
        url: process.env.VUE_APP_BASE_URL + "/api/user/avatar/" + userId,
        data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}