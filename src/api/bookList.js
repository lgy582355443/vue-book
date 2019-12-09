import request from '@/api/request';

export function flatListApi() {
    return request({
        method: 'get',
        url: `/api/list/allBookList`
    })
}

export function listApi() {
    return request({
        method: 'get',
        url: `/api/list/categoryList`
    })
}