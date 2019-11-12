import { getReadTime, getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage'
import { removeLocalForage } from './localForage'
import { realPx } from './utils'

export const FONT_SIZE_LIST = [
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 },
  { fontSize: 30 }
]

export const FONT_FAMILY = [
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

//book主题样式
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `50px!important`,
          'padding-bottom': `50px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `50px!important`,
          'padding-bottom': `50px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `50px!important`,
          'padding-bottom': `50px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `50px!important`,
          'padding-bottom': `50px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      } 
    }
  ]
}

//秒转化为 分
export function getReadTimeByMinute(fileName) {
  const readTime = getReadTime(fileName);
  if (!readTime) {
    return 0;
  } else {
    return Math.ceil(readTime / 60);
  }
}

const BOOK_SHELF_KEY = 'bookShelf'

//加入书架
export function addToShelf(book) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  bookList = clearAddFromBookList(bookList)
  book.type = 1
  bookList.push(book)
  bookList.forEach((item, index) => {
    item.id = index + 1
  })
  appendAddToBookList(bookList)
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}


export function appendAddToBookList(bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}


export function clearAddFromBookList(bookList) {
  return bookList.filter(item => {
    return item.type !== 3
  })
}

export function removeFromBookShelf(bookItem) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  bookList = bookList.filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subItem => subItem.fileName !== bookItem.fileName)
    }
    return item.fileName !== bookItem.fileName
  })
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

export function flatBookList(bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}

export function findBook(fileName) {
  const bookList = getLocalStorage(BOOK_SHELF_KEY)
  return flatBookList(bookList).find(item => item.fileName === fileName)
}

export function removeBookCache(fileName) {
  return new Promise((resolve, reject) => {
    removeLocalStorage(fileName)
    removeLocalStorage(`${fileName}-info`)
    removeLocalForage(fileName, () => {
      console.log(`[${fileName}]删除成功...`)
      resolve()
    }, reject)
  })
}

export function switchLocale(vue) {
  if (vue.$i18n.locale === 'en') {
    vue.$i18n.locale = 'cn'
  } else {
    vue.$i18n.locale = 'en'
  }
  setLocalStorage('locale', vue.$i18n.locale)
}

export function reset(vue) {
  vue.$store.dispatch('setMenuVisible', false)
  vue.$store.dispatch('setSettingVisible', 0)
  vue.$store.dispatch('setFontFamilyVisible', false)
  vue.$store.dispatch('setSpeakingIconBottom', realPx(58))
}

//把书籍目录数组转为一维数组
export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}