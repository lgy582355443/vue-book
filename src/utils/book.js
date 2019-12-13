import { getReadTime, setLocalStorage } from './localStorage'

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
          'color': '#424242',
          'background': '#EBECEC',
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
          'color': '#605A57',
          'background': '#FFF6E6',
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
          'color': '#3E4937',
          'background': '#CEEABA',
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
          'color': '#A4A294',
          'background': '#171B19',
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

//切换语言
export function switchLocale(vue) {
  if (vue.$i18n.locale === 'en') {
    vue.$i18n.locale = 'cn'
  } else {
    vue.$i18n.locale = 'en'
  }
  setLocalStorage('locale', vue.$i18n.locale)
}

//把书籍目录数组转为一维数组
export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}