import request from '@/api/request';

export function shelfApi(data) {
    return request({
        method: 'get',
        url: `/api/shelf/shelfList`,
        data
    })
}
