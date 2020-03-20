import { request, upload } from '@/api/request';

export function loginApi(data) {
    return request({
        method: 'post',
        url: `/api/user/login`,
        data
    })
}

export function getUserInfoApi(data) {
    return request({
        method: 'get',
        url: `/api/user/userInfo`,
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
    return upload({
        method: 'post',
        url: `/api/user/updata`,
        data
    })
}

// export function changeAvatarApi(userId, data) {
//     return upload({
//         method: "post",
//         url: process.env.VUE_APP_BASE_URL + "/api/user/avatar/" + userId,
//         data,
//         headers: {
//             "Content-Type": "multipart/form-data"
//         }
//     })
// }