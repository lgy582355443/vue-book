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
    <div class="empty" v-if="!bookAvailable">
      <ebook-loading></ebook-loading>
    </div>
  </div>
</template>

<script>
import Epub from "epubjs";
import EbookLoading from "./EbookLoading";
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
  components: {
    EbookLoading
  },
  props: {},
  data() {
    return {
      book: null,
      mouseState: null,
      isOnline: false
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
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          );
        })
        .then(locations => {
          // //获取分页
          // this.navigation.forEach(nav => {
          //   nav.pagelist = [];
          // });
          // locations.forEach(item => {
          //   const loc = item.match(/\[(.*)\]!/)[1];
          //   this.navigation.forEach(nav => {
          //     if (nav.href) {
          //       const href = nav.href.match(/^(.*)\.html$/);
          //       if (href) {
          //         if (href[1] === loc) {
          //           nav.pagelist.push(item);
          //         }
          //       }
          //     }
          //   });
          //   let currentPage = 1;
          //   this.navigation.forEach((nav, index) => {
          //     if (index === 0) {
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
    },

    //初始化rendition对象
    initRendition() {
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default"
        // flow:'scrolled' //滚动模式,兼容不好
      });
      if (this.$route.query.navigation) {
        this.display(this.$route.query.navigation, () => {
          this.initTheme();
          this.initFontSize();
          this.initFontFamily();
          // this.refreshLocation();
          this.parseBook();
        });
      } else {
        const location = getLocation(this.fileName);
        this.display(location, () => {
          this.initTheme();
          this.initFontSize();
          this.initFontFamily();
          // this.refreshLocation();
          this.parseBook();
        });
      }
      //载入字体文件
      this.rendition.hooks.content.register(contents => {
        // let fontURL = process.env.VUE_APP_RES_URL + "/fonts/fonts.css";
        // contents.addStylesheet(fontURL).then(() => {});
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          )
        ]).then(() => {});
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
      this.rendition.themes.select(this.defaultTheme);
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
      this.rendition.themes.fontSize(this.defaultFontSize);
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
      this.rendition.themes.font(font);
    },

    //解析book,获取封面图片,作者等信息
    parseBook() {
      if (this.isOnline) {
        this.book.coverUrl().then(url => {
          this.setCover(url);
        });
      } else {
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url);
          });
        });
      }
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });
      this.book.loaded.navigation.then(nav => {
        console.log(nav);
        //把目录转化为一维数组
        const navItem = flatten(nav.toc);
        console.log(navItem);
        //添加level属性,指定每项目录标是哪一级的目录
        function find(item, level = 0) {
          const parent = navItem.filter(parentItem => {
            parentItem.id == item.parent;
          })[0];
          if (!item.parent) {
            return level;
          } else {
            if (parent) {
              return find(parent, ++level);
            }
            return level;
          }
        }
        navItem.forEach((item, index) => {
          item.level = find(item);
          item.total = 0;
          item.pagelist = [];
          if (item.href.match(/^(.*)\.html$/)) {
            item.idhref = item.href.match(/^(.*)\.html$/)[1];
          } else if (item.href.match(/^(.*)\.xhtml$/)) {
            item.idhref = item.href.match(/^(.*)\.xhtml$/)[1];
          }
        });
        this.setNavigation(navItem);
      });
    },

    //上一页
    prevPage() {
      if (this.bookAvailable) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideMenuVisible();
      }
    },

    //下一页
    nextPage() {
      if (this.bookAvailable) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
        this.hideMenuVisible();
      }
    },

    //mask上的手势操作,翻页..
    onMaskClick(e) {
      if (
        this.mouseState &&
        (this.mouseState == 2 || this.mouseState == 3) &&
        !this.bookAvailable
      ) {
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
      if (!this.bookAvailable) {
        return;
      }
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
      if (!this.bookAvailable) {
        return;
      }
      this.setOffsetY(0);
      this.firstOffsetY = null;
    },

    // pc端书签功能
    //1-鼠标进入
    //2-鼠标进入后移动
    //3-鼠标从移动状态松手
    //4-鼠标还原

    onMouseEnter(e) {
      if (!this.bookAvailable) {
        return;
      }
      this.mouseState = 1;
      this.mouseStartTime = e.timeStamp;
      e.preventDefault();
      e.stopPropagation();
    },

    onMouseMove(e) {
      if (!this.bookAvailable) {
        return;
      }
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
      if (!this.bookAvailable) {
        return;
      }
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
    //  this.rendition.on("touchstart", event => {
    //     this.touchStartX = event.changedTouches[0].clientX;
    //     this.touchStartTime = event.timeStamp;
    //   });
    //  this.rendition.on("touchend", event => {
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
          this.isOnline = false;
          this.initEpub(blob);
        });
      } else {
        if (this.$route.query.opf) {
          this.isOnline = true;
          this.initEpub(this.$route.query.opf);
        } else {
          // let fileName = this.$route.params.fileName.split("|").join("/");
          this.setFileName(books.join("/")).then(() => {
            const url = process.env.VUE_APP_EPUB_URL + this.fileName + ".epub";
            this.isOnline = true;
            this.initEpub(url);
          });
        }
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
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
  .empty {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 120;
    width: 100%;
    height: 100%;
    background-color: rgb(82, 81, 81);
    @include center;
    // font-size: 16px;
    // color: #333;
  }
}
</style>