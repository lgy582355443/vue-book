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
          'padding-bottom': `50pxpx!important`
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
          'padding-top': `50pxpx!important`,
          'padding-bottom': `50pxpx!important`
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
          'padding-top': `50pxpx!important`,
          'padding-bottom': `50pxpx!important`
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
          'padding-top': `50pxpx!important`,
          'padding-bottom': `50pxpx!important`
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

export function getCategoryName(id) {
  switch (id) {
    case 1:
      return 'ComputerScience'
    case 2:
      return 'SocialSciences'
    case 3:
      return 'Economics'
    case 4:
      return 'Education'
    case 5:
      return 'Engineering'
    case 6:
      return 'Environment'
    case 7:
      return 'Geography'
    case 8:
      return 'History'
    case 9:
      return 'Laws'
    case 10:
      return 'LifeSciences'
    case 11:
      return 'Literature'
    case 12:
      return 'Biomedicine'
    case 13:
      return 'BusinessandManagement'
    case 14:
      return 'EarthSciences'
    case 15:
      return 'MaterialsScience'
    case 16:
      return 'Mathematics'
    case 17:
      return 'MedicineAndPublicHealth'
    case 18:
      return 'Philosophy'
    case 19:
      return 'Physics'
    case 20:
      return 'PoliticalScienceAndInternationalRelations'
    case 21:
      return 'Psychology'
    case 22:
      return 'Statistics'
  }
}

export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.computerScience')
    case 2:
      return vue.$t('category.socialSciences')
    case 3:
      return vue.$t('category.economics')
    case 4:
      return vue.$t('category.education')
    case 5:
      return vue.$t('category.engineering')
    case 6:
      return vue.$t('category.environment')
    case 7:
      return vue.$t('category.geography')
    case 8:
      return vue.$t('category.history')
    case 9:
      return vue.$t('category.laws')
    case 10:
      return vue.$t('category.lifeSciences')
    case 11:
      return vue.$t('category.literature')
    case 12:
      return vue.$t('category.biomedicine')
    case 13:
      return vue.$t('category.businessandManagement')
    case 14:
      return vue.$t('category.earthSciences')
    case 15:
      return vue.$t('category.materialsScience')
    case 16:
      return vue.$t('category.mathematics')
    case 17:
      return vue.$t('category.medicineAndPublicHealth')
    case 18:
      return vue.$t('category.philosophy')
    case 19:
      return vue.$t('category.physics')
    case 20:
      return vue.$t('category.politicalScienceAndInternationalRelations')
    case 21:
      return vue.$t('category.psychology')
    case 22:
      return vue.$t('category.statistics')
  }
}

export function showBookDetail(vue, book) {
  vue.$router.push({
    path: '/book-store/detail',
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}

export const categoryList = {
  'ComputerScience': 1,
  'SocialSciences': 2,
  'Economics': 3,
  'Education': 4,
  'Engineering': 5,
  'Environment': 6,
  'Geography': 7,
  'History': 8,
  'Laws': 9,
  'LifeSciences': 10,
  'Literature': 11,
  'Biomedicine': 12,
  'BusinessandManagement': 13,
  'EarthSciences': 14,
  'MaterialsScience': 15,
  'Mathematics': 16,
  'MedicineAndPublicHealth': 17,
  'Philosophy': 18,
  'Physics': 19,
  'PoliticalScienceAndInternationalRelations': 20,
  'Psychology': 21,
  'Statistics': 22
}

const BOOK_SHELF_KEY = 'bookShelf'

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