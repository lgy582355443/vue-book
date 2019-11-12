<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseEnd"
    ></div>
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
import { getLocalForage } from "../../utils/localForage";
//传给全局变量
global.ePub = Epub;
export default {
  name: "EbookReader",
  mixins: [ebookMixin],
  components: {},
  props: {},
  data() {
    return {
      book: null,
      mouseState: null
    };
  },
  watch: {},
  computed: {},
  methods: {
    //初始化图书
    initEpub(url) {
      // let url = process.env.VUE_APP_EPUB_URL + this.fileName + ".epub";
      this.book = new Epub(url);
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
            // //获取分页
            // locations.forEach(item => {
            //   const loc = item.match(/\[(.*)\]!/)[1];
            //   this.navigation.forEach(nav => {
            //     if (nav.href) {
            //       const href = nav.href.match(/^(.*)\.html$/)[1];
            //       console.log(nav);
            //       if (href == loc) {
            //         nav.pagelist.push(item);
            //       }
            //     }
            //   });
            //   let currentPage = 1;
            //   this.navigation.forEach((nav, index) => {
            //     if (index == 0) {
            //       nav.page = 1;
            //     } else {
            //       nav.page = currentPage;
            //     }
            //     currentPage += nav.pagelist.length + 1;
            //   });
            // });
            // this.setPageList(location);
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
        // flow:'scrolled' //滚动模式,兼容不好
      });
      const location = getLocation(this.fileName);
      this.display(location, () => {
        this.initTheme();
        this.initFontFamily();
        this.initFontSize();
        // this.refreshLocation();
        this.parseBook();
      });
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
      if (this.mouseState && (this.mouseState == 2 || this.mouseState == 3)) {
        return;
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleMenuVisible();
      }
    },

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

    // pc端书签功能
    //1-鼠标进入
    //2-鼠标进入后移动
    //3-鼠标从移动状态松手
    //4-鼠标还原

    onMouseEnter(e) {
      this.mouseState = 1;
      this.mouseStartTime = e.timeStamp;
      e.preventDefault();
      e.stopPropagation();
    },

    onMouseMove(e) {
      if (this.mouseState == 1) {
        this.mouseState = 2;
      } else if (this.mouseState == 2) {
        let offsetY = 0;
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY;
          this.setOffsetY(offsetY);
        } else {
          this.firstOffsetY = e.clientY;
        }
      }
    },

    onMouseEnd(e) {
      if (this.mouseState == 2) {
        this.setOffsetY(0);
        this.firstOffsetY = null;
        this.mouseState = 3;
      } else {
        this.mouseState = 4; //只点击不移动
      }
      //修正误触
      const time = e.timeStamp - this.mouseStartTime;
      if (time < 200) {
        this.mouseState = 4;
      }
      e.preventDefault();
      e.stopPropagation();
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
    const books = this.$route.params.fileName.split("|");
    const fileName = books[1];
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        this.setFileName(books.join("/")).then(() => {
          this.initEpub(blob);
        });
      } else {
        // let fileName = this.$route.params.fileName.split("|").join("/");
        this.setFileName(books.join("/")).then(() => {
          const url = process.env.VUE_APP_EPUB_URL + this.fileName + ".epub";
          this.initEpub(url);
        });
      }
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