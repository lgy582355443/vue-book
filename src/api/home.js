
import {request} from '@/api/request';

export function homeApi() {
    return request({
        method: 'get',
        url: `/api/home/homeData`
    })
}


