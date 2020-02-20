import axios from 'axios'
import vue from '../main'
import qs from 'qs'
import {
    getToken,
    setToken,
    removeToken
} from '../utils/login'
import Router from '../router/index'

export const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 5000
})

//请求拦截
service.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

//响应拦截
service.interceptors.response.use(
    response => {
        // const res = response.data
        if (response.data.token) {
            setToken(response.data.token);
        }
        if (response.data.code == -1) {
            removeToken();
            Router.push({
                name: 'login'
            })
        }
        return response
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

//对与get和post请求做不同处理,axios默认post发送json格式
export function http(config) {
    if (config.method.toLowerCase() === 'post') {
        config.data = qs.stringify(config.data, {
            arrayFormat: 'repeat',
            allowDots: true
        });
    } else {
        config.params = config.data;
    }
    return service(config)
}