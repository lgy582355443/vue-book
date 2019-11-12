import axios from 'axios';
import { Book } from 'epubjs';
import { setLocalForage } from '../utils/localForage';

export function homeApi() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/home`
    })
}

export function detailApi(book) {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
        params: {
            fileName: book.fileName
        }
    })
}


export function flatListApi() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
    })
}

export function listApi() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/list`
    })
}

export function shelfApi() {
    return axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
    })
}

export function download(book, onSuccess, onError, onProgress) {
    if (!onProgress) {
        onProgress = onError;
        onError = null;
    }
    return axios.create({
        baseURL: process.env.VUE_APP_EPUB_URL,
        method: 'get',
        responseType: 'blob',
        timeout: 180 * 1000,
        onDownloadProgress: progressEvent => {
            if (onProgress) onProgress(progressEvent)
        }
    }).get(`${book.categoryText}/${book.fileName}.epub`)
        .then(res => {
            const blob = new Blob([res.data]);
            setLocalForage(book.fileName, blob, () => {
                if (onSuccess) {
                    onSuccess(book)
                }
            },
                (err) => {
                    if (onError) {
                        onError(err)
                    }
                })
        })
        .catch((err) => {
            if (onError) {
                onError(err)
            }
        })

}