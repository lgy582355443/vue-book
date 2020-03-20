

import { request } from '@/api/request';

export function getShelfApi(data) {
    return request({
        method: 'get',
        url: `/api/shelf/shelfList`,
        data
    })
}

export function updataShelfApi(data) {
    return request({
        method: 'get',
        url: `/api/shelf/updata`,
        data
    })
}