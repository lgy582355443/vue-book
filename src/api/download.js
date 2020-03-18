import axios from 'axios';

//下载电子书
export function download(data) {
    return axios.create({
        baseURL: process.env.VUE_APP_EPUB_URL,
        responseType: 'blob',
        onDownloadProgress: progressEvent => {
            if (data.onProgress) data.onProgress(progressEvent)
        }
    }).get(`${data.categoryText}/${data.fileName}.epub`)
}