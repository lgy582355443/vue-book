<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd"></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "@/utils/mixin";
import { flatten } from "../../utils/book";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  saveTheme,
  getTheme,
  getLocation,
  setCover
} from "../../utils/localStorage";

//传给全局变量
global.ePub = Epub;
export default {
  name: "EbookReader",
  mixins: [ebookMixin],
  components: {},
  props: {},
  data() {
    return {
      book: null
    };
  },
  watch: {},
  computed: {},
  methods: {
    //下拉book
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        this.setOffsetY(offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    },

    //下拉松手
    moveEnd(e) {
      this.setOffsetY(0);
      this.firstOffsetY = null;
    },

    //初始化图书
    initEpub() {
      let textURL = process.env.VUE_APP_EPUB_URL + this.fileName + ".epub";
      this.book = new Epub(textURL);
      this.setCurrentBook(this.book);
      this.initRendition();
      // this.initGuest();
      this.parseBook();
      //book解析完成后获取locations对象
      this.book.ready.then(() => {
        return this.book.locations
          .generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
          .then(locations => {
            //加载完成
            this.setBookAvailable(true);
            this.refreshLocation();
          });
      });
    },

    //初始化rendition对象
    initRendition() {
      this.book.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default"
      });
      const location = getLocation(this.fileName);
      if (location) {
        this.display(location, () => {
          this.initTheme();
          this.initFontFamily();
          this.initFontSize();
          this.refreshLocation();
          this.parseBook();
        });
      } else {
        this.display(null, () => {
          this.initTheme();
          this.initFontFamily();
          this.initFontSize();
          this.refreshLocation();
        });
      }
      //载入字体文件
      this.book.rendition.hooks.content.register(contents => {
        let fontURL = process.env.VUE_APP_RES_URL + "/fonts/fonts.css";
        contents.addStylesheet(fontURL).then(() => {});
      });
    },

    //初始化主题
    initTheme() {
      this.registerTheme();
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      } else {
        this.setDefaultTheme(defaultTheme);
      }
      this.book.rendition.themes.select(this.defaultTheme);
      this.setGlobalTheme(this.defaultTheme);
    },

    //初始化字体大小
    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        fontSize = this.defaultFontSize;
        saveFontSize(this.fileName, fontSize);
      } else {
        this.setDefaultFontSize(fontSize);
      }
      this.book.rendition.themes.fontSize(this.defaultFontSize);
    },

    //初始化字体样式
    initFontFamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        font = this.defaultFontFamily;
        saveFontFamily(this.fileName, font);
      } else {
        this.setDefaultFontFamily(font);
      }
      this.book.rendition.themes.font(this.defaultFontFamily);
    },

    //解析book,获取封面图片,作者等信息
    parseBook() {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url);
        });
      });
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });
      this.book.loaded.navigation.then(nav => {
        //把目录转化为一维数组
        const navItem = flatten(nav.toc);
        //添加level属性,指定每项目录标是哪一级的目录
        function find(item, level = 0) {
          if (!item.parent) {
            return level;
          } else {
            return find(
              navItem.filter(parentItem => {
                parentItem.id == item.parent;
              })[0],
              ++level
            );
          }
        }
        navItem.map(item => {
          item.level = find(item);
        });
        this.setNavigation(navItem);
      });
    },

    //上一页
    prevPage() {
      if (this.book.rendition) {
        this.book.rendition.prev().then(() => {
          this.refreshLocation();
        });
      }
      this.hideMenuVisible();
    },

    //下一页
    nextPage() {
      if (this.book.rendition) {
        this.book.rendition.next().then(() => {
          this.refreshLocation();
        });
      }
      this.hideMenuVisible();
    },

    //mask上的手势操作,翻页..
    onMaskClick(e) {
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleMenuVisible();
      }
    }

    // //初始化book手势功能
    // initGuest() {
    //   this.book.rendition.on("touchstart", event => {
    //     this.touchStartX = event.changedTouches[0].clientX;
    //     this.touchStartTime = event.timeStamp;
    //   });
    //   this.book.rendition.on("touchend", event => {
    //     const offsetX = event.changedTouches[0].clientX - this.touchStartX;
    //     const time = event.timeStamp - this.touchStartTime;
    //     if (time < 500 && offsetX > 40) {
    //       this.prevPage();
    //     } else if (time < 500 && offsetX < -40) {
    //       this.nextPage();
    //     } else {
    //       this.toggleMenuVisible();
    //     }
    //     event.preventDefault();
    //     event.stopPropagation();
    //   });
    // }
  },
  created() {},
  mounted() {
    let fileName = this.$route.params.fileName.split("|").join("/");
    this.setFileName(fileName).then(() => {
      this.initEpub();
    });
  }
};
</script>
<style lang="scss" scoped>
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
  }
}
</style>