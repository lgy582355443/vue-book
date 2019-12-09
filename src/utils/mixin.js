import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute } from './book'
import { gotoBookDetail, appendAddToShelf, computeId, removeAddFromShelf, removeFromBookShelf, addToShelf } from './home'
import { addCss, removeAllCss } from './utils'
import { shelfApi } from "@/api/shelf";
import * as Storage from './localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
    ]),

    themeList() {
      return themeList(this)
    },

    //获取章节标题
    getSectionName() {
      // if (this.section) {
      // const sectionInfo = this.currentBook.section(this.section);
      // if (
      //   sectionInfo &&
      //   sectionInfo.href &&
      //   this.currentBook &&
      //   this.currentBook.navigation
      // ) {
      //   //获取当前章节目录  .label就是标题
      //   return this.currentBook.navigation.get(sectionInfo.href).label;
      // }
      // }
      return this.section ? this.navigation[this.section].label : ''
    },

    //获取已阅读时间
    getReadTimeText() {
      return this.$t("book.haveRead").replace("$1", getReadTimeByMinute(this.fileName));
    }
  },
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST,
      fontFamily: FONT_FAMILY
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),

    //显示字体选择
    showFontFamilySetting() {
      this.setFontFamilyVisible(true)
    },

    //隐藏字体选择
    hideFontFamilySetting() {
      this.setFontFamilyVisible(false)
    },

    //book底部bar选择的settingVisible相对应得功能,
    showSetting(key) {
      this.setSettingVisible(key)
    },

    //隐藏所有菜单
    hideMenuVisible() {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },

    //菜单栏显示隐藏
    toggleMenuVisible() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },

    //根据主题动态设置菜单栏css样式
    setGlobalTheme(theme) {
      removeAllCss()
      switch (theme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          this.setDefaultTheme('Default')
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },

    //注册主题
    registerTheme() {
      this.themeList.forEach(theme => {
        this.currentBook.rendition.themes.register(theme.name, theme.style)
      })
    },

    //给book设置样式
    // switchTheme() {
    //   const rules = this.themeList.filter(theme => theme.name === this.defaultTheme)[0]
    //   if (this.defaultFontFamily && this.defaultFontFamily !== 'Default') {
    //     rules.style.body['font-family'] = `${this.defaultFontFamily}!important`
    //   } else {
    //     rules.style.body['font-family'] = `Cabin!important`
    //   }
    //   this.registerTheme()
    //   this.setGlobalTheme(this.defaultTheme)
    //   this.currentBook.rendition.themes.font(this.defaultFontFamily);
    //   this.currentBook.rendition.themes.select(this.defaultTheme)
    //   this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
    // },

    //设置字体大小
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize).then(() => {
        // this.switchTheme()
        this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },

    //设置字体样式
    setFontFamily(font) {
      this.setDefaultFontFamily(font).then(() => {
        // this.switchTheme()
        this.currentBook.rendition.themes.font(this.defaultFontFamily);
        Storage.saveFontFamily(this.fileName, font)
      })
    },

    //设置主题
    setTheme(theme) {
      this.setDefaultTheme(theme).then(() => {
        // this.switchTheme()
        this.currentBook.rendition.themes.select(this.defaultTheme)
        this.setGlobalTheme(this.defaultTheme)
        Storage.saveTheme(this.fileName, theme)
      })
    },

    //渲染book
    display(target, callback) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (callback) {
            callback();
          }
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (callback) {
            callback();
          }
        })
      }
    },

    //更新进度
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      if (currentLocation && currentLocation.start) {
        this.setSection(currentLocation.start.index);
        //  通过本章第一个字currentLocation.start.cfi
        const startCfi = currentLocation.start.cfi
        //获取百分比
        const progress = this.currentBook.locations.percentageFromCfi(startCfi);
        this.setProgress(Math.floor(progress * 100));

        //判断当前页是否为书签页
        const bookmark = Storage.getBookmark(this.fileName);
        if (bookmark) {
          if (bookmark.some(item => item.cfi == startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        // debugger
        Storage.saveLocation(this.fileName, startCfi);
      }
    },

  }
}


export const StoreHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible',
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible',
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    }
  }
}

export const shelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType',
      'historyList'
    ]),

  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType',
      'setHistoryList'
    ]),

    showBookDetail(book) {
      gotoBookDetail(this, book)
    },

    //获取书架列表
    getShelfList() {
      let shelfList = Storage.getBookShelf()
      if (!shelfList) {
        shelfApi().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            Storage.saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },

    //获取当前分组里的内容
    getCategoryList(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },

    //移出分组
    moveOutOfGroup(cb) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        //排除最后书架列表最后一项(添加书籍按钮)
        let list = removeAddFromShelf(this.shelfList);
        //分类里选中的和书架中的列表合并
        list = [].concat(list, ...this.shelfSelected);
        //添加最后一项(添加书籍按钮)
        list = appendAddToShelf(list);
        //排序ID
        list = computeId(list);

        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (cb) cb()
        })
      })
    }
  }
}

export const userMixin = {
  computed: {
    ...mapGetters([
      'historyList',
      'userList'
    ])
  },
  methods: {
    ...mapActions([
      'setHistoryList',
      'setUserList'
    ])
  }
}
