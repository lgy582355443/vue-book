import { getLocalStorage, setLocalStorage, removeLocalStorage, getBookShelf, saveBookShelf } from './localStorage'
import { removeLocalForage } from './localForage'


//添加书架列表中最后一个添加按钮
export function appendAddToShelf(list) {
    list.push({
        shelf_id: -1,
        type: 3
    })
    return list
}

//排除最后一个添加按钮,获取书架列表
export function removeAddFromShelf(list) {
    return list.filter(item => item.type !== 3)
}

//重新排序shelf_id
export function computeId(list) {
    return list.map((book, index) => {
        if (book.type !== 3) {
            book.shelf_id = index + 1
            if (book.itemList) {
                book.itemList = computeId(book.itemList)
            }
        }
        return book
    })
}

//添加到书架
export function addToShelf(book) {
    let shelfList = getBookShelf()
    shelfList = removeAddFromShelf(shelfList)
    book.type = 1
    shelfList.push(book)
    shelfList = computeId(shelfList)
    shelfList = appendAddToShelf(shelfList)
    saveBookShelf(shelfList)
}

//移除出书架
export function removeFromBookShelf(book) {
    return getBookShelf().filter(item => {
        if (item.itemList) {
            item.itemList = removeAddFromShelf(item.itemList)
        }
        return item.fileName !== book.fileName
    })
}

//获取书架里的所有书籍（数组）
export function flatBookList(bookList) {
    if (bookList) {
        let orgBookList = bookList.filter(item => {
            return item.type !== 3
        })
        const categoryList = bookList.filter(item => {
            return item.type === 2
        })
        //书架里的分组里的书籍加入orgBookList
        categoryList.forEach(item => {
            const index = orgBookList.findIndex(v => {
                return v.shelf_id === item.shelf_id
            })
            if (item.itemList) {
                item.itemList.forEach(subItem => {
                    orgBookList.splice(index, 0, subItem)
                })
            }
        })
        orgBookList.forEach((item, index) => {
            item.shelf_id = index + 1
        })
        orgBookList = orgBookList.filter(item => item.type !== 2)
        return orgBookList
    } else {
        return []
    }
}

//在书架页查找书籍
export function findBook(fileName) {
    const bookList = getLocalStorage('shelf')
    return flatBookList(bookList).find(item => item.fileName === fileName)
}


//切换语言
export function switchLocale(vue) {
    if (vue.$i18n.locale === 'en') {
        vue.$i18n.locale = 'cn'
    } else {
        vue.$i18n.locale = 'en'
    }
    setLocalStorage('locale', vue.$i18n.locale)
}

//删除该书缓存
export function removeBookCache(fileName) {
    return new Promise((resolve, reject) => {
        removeLocalStorage(fileName)
        removeLocalStorage(`${fileName}-info`)
        removeLocalForage(fileName, () => {
            resolve()
        }, reject)
    })
}