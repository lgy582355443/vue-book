import { request } from "./request"

export function flatListApi() {
    return request({
        method: 'get',
        url: `/api/list/allBookList`
    })
}


export function searchBookApi(data){
    return request({
        method: 'get',
        url: `/api/list/search`,
        data
    })
}

export function listApi(data) {
    return request({
        method: 'get',
        url: `/api/list/categoryList`,
        data
    })
}