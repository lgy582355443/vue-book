import axios from 'axios';
import { setLocalForage } from '@/utils/localForage';

//下载电子书
export function download(book, onSucess, onError, onProgress) {
    if (onProgress == null) {
        onProgress = onError
        onError = null
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
            const blob = new Blob([res.data])
            setLocalForage(book.fileName, blob,
                () => onSucess(book),
                err => onError(err))
        }).catch(err => {
            if (onError) onError(err)
        })
}
