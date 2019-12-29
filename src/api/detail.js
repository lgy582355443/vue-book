import {http} from '@/api/request';


export function detailApi(data) {
    return http({
        method: 'get',
        url: `/api/detail/bookDetail`,
        data
    })
}