import {http} from '@/api/request';

export function flatListApi() {
    return http({
        method: 'get',
        url: `/api/list/allBookList`
    })
}

export function listApi() {
    return http({
        method: 'get',
        url: `/api/list/categoryList`
    })
}