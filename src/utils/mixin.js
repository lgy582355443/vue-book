import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute, showBookDetail } from './book'
import { addCss, removeAllCss } from './utils'
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

    // getSectionName() {
    //   if (this.section) {
    //     const sectionInfo = this.currentBook.section(this.section)
    //     if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
    //       // return this.currentBook.navigation.get(section.href).label
    //       return this.navigation[this.section].label
    //     }
    //   }
    // }

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
    // const rules = this.themeList.filter(theme => theme.name === this.defaultTheme)[0]
    // if (this.defaultFontFamily && this.defaultFontFamily !== 'Default') {
    //   rules.style.body['font-family'] = `${this.defaultFontFamily}!important`
    // } else {
    //   rules.style.body['font-family'] = `Cabin!important`
    // }
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

    //     //获取当前页的进度
    //     displayProgress() {
    //       const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
    //       this.currentBook.rendition.display(cfi).then(() => {
    //         this.refreshLocation()
    //       })
    //     },
    //     //展示当前进度的章节
    //     displaySection(callback) {
    //       const section = this.currentBook.section(this.section)
    //       if (section && section.href) {
    //         this.currentBook.rendition.display(section.href).then(() => {
    //           this.refreshLocation()
    //           if (callback) {
    //             callback();
    //           }
    //         })
    //       }
    //     },

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

    //     //渲染book
    //     display(target, highlight = false) {
    //       if (target) {
    //         this.currentBook.rendition.display(target).then(() => {
    //           if (highlight) {
    //             if (target.startsWith('epubcfi')) {
    //               this.currentBook.getRange(target).then(range => {
    //                 this.currentBook.rendition.annotations.highlight(target, {}, (e) => {
    //                 })
    //               })
    //             }
    //           }
    //           this.refreshLocation()
    //         })
    //       } else {
    //         this.currentBook.rendition.display().then(() => {
    //           this.refreshLocation()
    //         })
    //       }
    //       this.hideMenuVisible()
    //     },

    //更新进度
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      if (currentLocation && currentLocation.start) {
        //  通过本章第一个字currentLocation.start.cfi
        const startCfi = currentLocation.start.cfi
        //获取百分比
        const progress = this.currentBook.locations.percentageFromCfi(startCfi);
        this.setProgress(Math.floor(progress * 100));
        this.setSection(currentLocation.start.index);
        Storage.saveLocation(this.fileName, startCfi);
        const bookmark = Storage.getBookObject(this.fileName);
        if (bookmark) {
          if (bookmark.some(item => item.cfi == startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },

    //     //更新进度
    //     refreshLocation() {
    //       const currentLocation = this.currentBook.rendition.currentLocation()
    //       if (currentLocation.start && currentLocation.start.index) {
    //         this.setSection(currentLocation.start.index)
    //         const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
    //         this.setProgress(Math.floor(progress * 100))
    //         if (this.pagelist) {
    //           if (currentLocation.start.location <= 0) {
    //             this.setPaginate('')
    //           } else {
    //             this.setPaginate(currentLocation.start.location + ' / ' + this.pagelist.length)
    //           }
    //         } else {
    //           this.setPaginate('')
    //         }
    //         const cfistart = currentLocation.start.cfi
    //         const bookmark = Storage.getBookmark(this.fileName)
    //         if (bookmark) {
    //           if (bookmark.some(item => item.cfi === cfistart)) {
    //             this.setIsBookmark(true)
    //           } else {
    //             this.setIsBookmark(false)
    //           }
    //         } else {
    //           this.setIsBookmark(false)
    //         }
    //         Storage.saveLocation(this.fileName, cfistart)
    //       }
    //     },
    //     
  }
}

export const ebookHome = {
  methods: {
    showBookDetail(item) {
      showBookDetail(this, item)
    }
  }
}
