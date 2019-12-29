import { http, service } from '@/api/request';

export function loginApi(data) {
    return http({
        method: 'post',
        url: `/api/user/login`,
        data
    })
}

export function registerApi(data) {
    return http({
        method: 'post',
        url: `/api/user/register`,
        data
    })
}

export function userUpdataApi(data) {
    return http({
        method: 'post',
        url: `/api/user/updata`,
        data
    })
}


export function changeAvatarApi(userId, data) {
    return service({
        method: "post",
        url: process.env.VUE_APP_BASE_URL + "/api/user/avatar/" + userId,
        data,
        // headers: {
        //     "Content-Type": "multipart/form-data"
        // }
    })
}