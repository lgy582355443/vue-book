import { request } from './request';

export function detailApi(data) {
    return request({
        method: 'get',
        url: `/api/detail/bookDetail`,
        data
    })
}