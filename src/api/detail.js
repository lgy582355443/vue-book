import request from '@/api/request';


export function detailApi(data) {
    return request({
        method: 'get',
        url: `/api/detail/bookDetail`,
        data
    })
}