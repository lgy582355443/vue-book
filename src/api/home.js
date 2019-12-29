
import {http} from '@/api/request';

export function homeApi() {
    return http({
        method: 'get',
        url: `/api/home/homeData`
    })
}


