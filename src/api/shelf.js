import { http } from '@/api/request';

export function getShelfApi(data) {
    return http({
        method: 'get',
        url: `/api/shelf/shelfList`,
        data
    })
}

export function updataShelfApi(data) {
    return http({
        method: 'get',
        url: `/api/shelf/updata`,
        data
    })
}