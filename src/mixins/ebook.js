import {
  mapGetters,
  mapActions
} from 'vuex'
import {
  FONT_SIZE_LIST,
  FONT_FAMILY,
  themeList,
  getReadTimeByMinute
} from '@/utils/book'
import {
  addCss,
  removeAllCss
} from '@/utils/utils'
import * as Storage from '@/utils/localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible', //-1:隐藏2级菜单, 0:设置字体, 1:设置主题, 2:进度条, 3:书籍目录
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable', //电子书通过epub.js加载完成后为true
      'progress',
      'section',
      'isPaginating',
      'currentBook', //new Epub实例对象
      'navigation',
      'cover',
      'metadata', //书籍简介，信息
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark', //是否为书签页
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

    //根据阅读器主题动态设置菜单栏css样式
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

    //设置字体大小
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize).then(() => {
        this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },

    //设置字体样式
    setFontFamily(font) {
      this.setDefaultFontFamily(font).then(() => {
        this.currentBook.rendition.themes.font(this.defaultFontFamily);
        Storage.saveFontFamily(this.fileName, font)
      })
    },


    //注册主题
    registerTheme() {
      this.themeList.forEach(theme => {
        this.currentBook.rendition.themes.register(theme.name, theme.style)
      })
    },

    //设置主题
    setTheme(theme) {
      this.setDefaultTheme(theme).then(() => {
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
        //  通过本页的定位currentLocation.start.cfi
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
        Storage.saveLocation(this.fileName, startCfi);
      }
    },

  }
}