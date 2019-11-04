<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "@/utils/mixin";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  saveTheme,
  getTheme,
  getLocation
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
      book: null,
    };
  },
  watch: {},
  computed: {},
  methods: {
    //初始化图书
    initEpub() {
      let textURL = process.env.VUE_APP_EPUB_URL + this.fileName + ".epub";
      this.book = new Epub(textURL);
      this.setCurrentBook(this.book);
      this.initRendition();
      this.initGuest();
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
      this.currentBook.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default"
      });
      // Promise.all([
      // this.setDefaultTheme(this.initTheme()),
      // this.setDefaultFontSize(this.initFontSize()),
      //   this.setDefaultFontFamily(this.initFontFamily());
      // ]).then(() => {
      // this.switchTheme();
      // if (this.$route.query.navigation) {
      //   this.display(this.$route.query.navigation);
      // } else {
      //   const location = getLocation(this.fileName);
      //   if (location) {
      //     this.display(location);
      //   } else {
      const location = getLocation(this.fileName);
      if (location) {
        this.display(location, () => {
          this.initTheme();
          this.initFontFamily();
          this.initFontSize();
          this.refreshLocation();
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
      this.currentBook.rendition.hooks.content.register(contents => {
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
      this.currentBook.rendition.themes.select(this.defaultTheme);
      this.setGlobalTheme(this.defaultTheme);
      // return defaultTheme;
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
      this.currentBook.rendition.themes.fontSize(this.defaultFontSize);
      // return fontSize;
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
      this.currentBook.rendition.themes.font(this.defaultFontFamily);
      // return font;
    },

    //上一页
    prevPage() {
      if (this.currentBook.rendition) {
        this.currentBook.rendition.prev().then(() => {
          this.refreshLocation();
        });
      }
      this.hideMenuVisible();
    },
    //下一页
    nextPage() {
      if (this.currentBook.rendition) {
        this.currentBook.rendition.next().then(() => {
          this.refreshLocation();
        });
      }
      this.hideMenuVisible();
    },

    //初始化book手势功能
    initGuest() {
      this.currentBook.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.currentBook.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleMenuVisible();
        }
        event.preventDefault();
        event.stopPropagation();
      });
    }
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
}
</style>