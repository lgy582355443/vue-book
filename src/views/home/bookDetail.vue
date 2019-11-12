<template>
  <div class="book-detail">
    <detail-title @back="back" :showShelf="true" ref="title"></detail-title>
    <scroll class="content-wrapper" :top="42" :bottom="52" @onScroll="onScroll" ref="scroll">
      <book-info :cover="cover" :title="title" :author="author" :desc="desc"></book-info>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.publisher')}}</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.category')}}</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.lang')}}</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.ISBN')}}</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div
              class="book-detail-content-item"
              v-for="(item, index) in flatNavigation"
              :key="index"
              @click="read(item)"
            >
              <div
                class="book-detail-content-navigation-text"
                :class="{'is-sub': item.deep> 1}"
                :style="itemStyle(item)"
                v-if="item.label"
              >{{item.label}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.trial')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
        </div>
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
      <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
import DetailTitle from "@/components/detail/detaiTitle";
import BookInfo from "@/components/detail/bookInfo";
import Scroll from "@/components/common/Scroll";
import Toast from "@/components/common/toast";
import { removeFromBookShelf, addToShelf } from "@/utils/book";
import { flatListApi, detailApi } from "@/api/home";
import { px2rem, realPx } from "@/utils/utils";
import { getLocalForage } from "@/utils/localForage";
import { getLocalStorage } from "@/utils/localStorage";
import Epub from "epubjs";

global.ePub = Epub;

export default {
  components: {
    DetailTitle,
    Scroll,
    BookInfo,
    Toast
  },
  computed: {
    //描述信息
    desc() {
      if (this.description) {
        return this.description.substring(0, 100);
      } else {
        return "";
      }
    },
    flatNavigation() {
      if (this.navigation) {
        return Array.prototype.concat.apply(
          [],
          Array.prototype.concat.apply(
            [],
            this.doFlatNavigation(this.navigation.toc)
          )
        );
      } else {
        return [];
      }
    },
    lang() {
      return this.metadata ? this.metadata.language : "-";
    },
    isbn() {
      return this.metadata ? this.metadata.identifier : "-";
    },
    publisher() {
      return this.metadata ? this.metadata.publisher : "-";
    },
    title() {
      return this.metadata ? this.metadata.title : "";
    },
    author() {
      return this.metadata ? this.metadata.creator : "";
    },
    inBookShelf() {
      if (this.bookItem && this.bookShelf) {
        const flatShelf = (function flatten(arr) {
          return [].concat(
            ...arr.map(v => (v.itemList ? [v, ...flatten(v.itemList)] : v))
          );
        })(this.bookShelf).filter(item => item.type === 1);
        const book = flatShelf.filter(
          item => item.fileName === this.bookItem.fileName
        );
        return book && book.length > 0;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      bookShelf: null,
      bookItem: null,
      book: null,
      metadata: null,
      trialRead: null,
      cover: null,
      navigation: null,
      displayed: false,
      audio: null,
      randomLocation: null,
      description: null,
      toastText: "",
      trialText: null,
      categoryText: null,
      opf: null
    };
  },
  methods: {
    addOrRemoveShelf() {
      if (this.inBookShelf) {
        removeFromBookShelf(this.bookItem);
      } else {
        addToShelf(this.bookItem);
      }
      this.bookShelf = getLocalStorage("bookShelf");
    },
    showToast(text) {
      this.toastText = text;
      this.$refs.toast.show();
    },
    readBook() {
      getLocalForage(this.bookItem.fileName, (err, value) => {
        console.log(this.bookItem.fileName);
        if (!err && value instanceof Blob) {
          this.$router.push({
            path: `/ebook/${this.categoryText}|${this.bookItem.fileName}`
          });
        } else {
          // this.showToast(this.$t('shelf.downloadFirst'))
          this.$router.push({
            path: `/ebook/${this.categoryText}|${this.bookItem.fileName}`,
            query: {
              opf: this.opf
            }
          });
        }
      });
    },
    trialListening() {
      getLocalForage(this.bookItem.fileName, (err, value) => {
        if (!err && value instanceof Blob) {
          this.$router.push({
            path: "/book-store/book-speaking",
            query: {
              fileName: this.bookItem.fileName
            }
          });
        } else {
          // this.showToast(this.$t('shelf.downloadFirst'))
          this.$router.push({
            path: "/book-store/book-speaking",
            query: {
              fileName: this.bookItem.fileName,
              opf: this.opf
            }
          });
        }
      });
    },
    read(item) {
      getLocalForage(this.bookItem.fileName, (err, value) => {
        if (!err && value instanceof Blob) {
          this.$router.push({
            path: `/ebook/${this.categoryText}|${this.bookItem.fileName}`,
            query: {
              navigation: item.href
            }
          });
        } else {
          // this.showToast(this.$t('shelf.downloadFirst'))
          this.$router.push({
            path: `/ebook/${this.categoryText}|${this.bookItem.fileName}`,
            query: {
              navigation: item.href,
              opf: this.opf
            }
          });
        }
      });
    },
    itemStyle(item) {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + "rem"
      };
    },
    doFlatNavigation(content, deep = 1) {
      const arr = [];
      content.forEach(item => {
        item.deep = deep;
        arr.push(item);
        if (item.subitems && item.subitems.length > 0) {
          arr.push(this.doFlatNavigation(item.subitems, deep + 1));
        }
      });
      return arr;
    },
    initBook() {
      if (this.bookItem) {
        getLocalForage(this.bookItem.fileName, (err, blob) => {
          if (err) {
            this.downloadBook();
          } else {
            if (blob) {
              this.parseBook(blob);
            } else {
              this.downloadBook();
            }
          }
        });
      }
    },
    downloadBook() {
      const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}/OEBPS/package.opf`;
      this.parseBook(opf);
    },
    parseBook(blob) {
      this.book = new Epub(blob);
      this.book.loaded.metadata.then(metadata => {
        this.metadata = metadata;
      });
      this.book.loaded.navigation.then(nav => {
        this.navigation = nav;
        if (this.navigation.toc && this.navigation.toc.length > 1) {
          this.display(this.navigation.toc[1].href).then(section => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh();
            }
            this.displayed = true;
            const reg = new RegExp("<.+?>", "g");
            const text = section.output.replace(reg, "").replace(/\s\s/g, "");
            this.description = text;
          });
        }
      });
    },
    findBookFromList(fileName) {
      flatListApi().then(response => {
        if (response.status === 200) {
          const bookList = response.data.data.filter(
            item => item.fileName === fileName
          );
          if (bookList && bookList.length > 0) {
            this.bookItem = bookList[0];
            console.log(this.bookItem);
            this.initBook();
          }
        }
      });
    },
    init() {
      const fileName = this.$route.query.fileName;
      this.categoryText = this.$route.query.category;
      if (fileName) {
        detailApi({
          fileName: fileName
        }).then(response => {
          if (
            response.status === 200 &&
            response.data.error_code === 0 &&
            response.data.data
          ) {
            const data = response.data.data;
            this.bookItem = data;
            this.cover = this.bookItem.cover;
            let rootFile = data.rootFile;
            if (rootFile.startsWith("/")) {
              rootFile = rootFile.substring(1, rootFile.length);
            }
            this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${fileName}/${rootFile}`;
            this.parseBook(this.opf);
          } else {
            this.showToast(response.data.msg);
          }
        });
      }
      this.bookShelf = getLocalStorage("bookShelf");
    },
    back() {
      this.$router.go(-1);
    },
    display(location) {
      if (this.$refs.preview) {
        if (!this.rendition) {
          this.rendition = this.book.renderTo("preview", {
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            height: window.innerHeight,
            method: "default"
          });
        }
        if (!location) {
          return this.rendition.display();
        } else {
          return this.rendition.display(location);
        }
      }
    },
    onScroll(offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow();
      } else {
        this.$refs.title.hideShadow();
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.book-detail {
  width: 100%;
  background: white;
  text-align: left;
  .content-wrapper {
    width: 100%;
    .book-detail-content-wrapper {
      width: 100%;
      border-bottom: px2rem(1) solid #eee;
      box-sizing: border-box;
      .book-detail-content-title {
        font-size: px2rem(20);
        font-weight: bold;
        padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
        box-sizing: border-box;
      }
      .book-detail-content-list-wrapper {
        padding: px2rem(10) px2rem(15);
        box-sizing: border-box;
        .loading-text-wrapper {
          width: 100%;
          .loading-text {
            font-size: px2rem(14);
            color: #666;
          }
        }
        .book-detail-content-row {
          display: flex;
          box-sizing: border-box;
          margin-bottom: px2rem(10);
          .book-detail-content-label {
            flex: 0 0 px2rem(70);
            font-size: px2rem(14);
            color: #666;
          }
          .book-detail-content-text {
            flex: 1;
            font-size: px2rem(14);
            color: #333;
          }
        }
        #preview {
        }
        .book-detail-content-item-wrapper {
          .book-detail-content-item {
            padding: px2rem(15) 0;
            font-size: px2rem(14);
            line-height: px2rem(16);
            color: #666;
            border-bottom: px2rem(1) solid #eee;
            &:last-child {
              border-bottom: none;
            }
            .book-detail-content-navigation-text {
              width: 100%;
              @include ellipsis;
              &.is-sub {
                color: #666;
              }
            }
          }
        }
      }
    }
    .audio-wrapper {
      width: 100%;
      padding: px2rem(15);
      box-sizing: border-box;
      #audio {
        width: 100%;
      }
    }
  }
  .bottom-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(52);
    box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, 0.1);
    .bottom-btn {
      flex: 1;
      color: $color-blue;
      font-weight: bold;
      font-size: px2rem(14);
      @include center;
      &:active {
        color: $color-blue-transparent;
      }
      .icon-check {
        margin-right: px2rem(5);
      }
    }
    &.hide-shadow {
      box-shadow: none;
    }
  }
}
</style>
