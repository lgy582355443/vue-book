<!-- 电子书详情组件 -->
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
      <!-- <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div> -->
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
  </div>
</template>

<script>
import DetailTitle from "../../components/detail/detaiTitle";
import BookInfo from "../../components/detail/bookInfo";
import Scroll from "../../components/common/Scroll";
import { detailApi } from "@/api/detail";
import { px2rem, realPx } from "../../utils/utils";
import { getLocalForage } from "../../utils/localForage";
import { removeFromBookShelf, addToShelf } from "../../utils/shelf";
import { shelfMixin } from "@/mixins/shelf";
import {
  getBookShelf,
  saveBookShelf,
  saveReaderHistory,
  getReaderHistory
} from "../../utils/localStorage";
import Epub from "epubjs";

global.ePub = Epub;

export default {
  mixins: [shelfMixin],
  components: {
    DetailTitle,
    Scroll,
    BookInfo
  },
  computed: {
    // 获取电子书摘要
    desc() {
      if (this.description) {
        return this.description.substring(0, 100);
      } else {
        return "";
      }
    },

    // 将电子书目录转为一维数组
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
    // 获取电子书语种
    lang() {
      return this.metadata ? this.metadata.language : "-";
    },
    // 获取电子书isbn
    isbn() {
      return this.metadata ? this.metadata.identifier : "-";
    },
    // 获取电子书出版社
    publisher() {
      return this.metadata ? this.metadata.publisher : "-";
    },
    // 获取电子书书名
    title() {
      return this.metadata ? this.metadata.title : "";
    },
    // 获取电子书作者
    author() {
      return this.metadata ? this.metadata.creator : "";
    },
    // 判断当前的电子书是否存在于书架
    inBookShelf() {
      if (this.bookItem && this.shelfList) {
        // 定义一个自执行函数，将书架转为一维数组结构，并且只保留type为1的数据（type=1的为电子书）
        const flatShelf = (function flatten(arr) {
          return [].concat(
            ...arr.map(v => (v.itemList ? [v, ...flatten(v.itemList)] : v))
          );
        })(this.shelfList).filter(item => item.type === 1);
        // 查找当前电子书是否存在于书架
        const book = flatShelf.filter(
          item => item.fileName === this.bookItem.fileName
        );
        return book && book.length > 0;
      } else {
        return false;
      }
    },

    // //判断电子书是否在历史列表
    inHistory() {
      if (this.bookItem && this.historyList) {
        const book = this.historyList.find(item => item.id == this.bookItem.id);
        return book;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
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
      trialText: null,
      categoryText: null,
      opf: null
    };
  },
  methods: {
    //加入书架
    addOrRemoveShelf() {
      // 如果电子书存在于书架，则从书架中移除电子书
      if (this.inBookShelf) {
        this.setShelfList(removeFromBookShelf(this.bookItem)).then(() => {
          // 将书架数据保存到LocalStorage
          saveBookShelf(this.shelfList);
        });
      } else {
        // 如果电子书不存在于书架，则添加电子书到书架
        addToShelf(this.bookItem);
        this.setShelfList(getBookShelf());

        function updataShelf(arr) {
          let updataArr = [];
          arr.forEach((item, index) => {
            if (item.type == 1) {
              updataArr.push({
                id: item.id,
                shelf_id: item.shelf_id,
                type: item.type
              });
            } else if (item.type == 2) {
              updataArr.push({
                shelf_id: item.shelf_id,
                type: item.type,
                title: item.title
              });
              updataArr[index].itemList = [];
              item.itemList.forEach(itemc => {
                updataArr[index].itemList.push({
                  id: itemc.id,
                  shelf_id: itemc.shelf_id,
                  type: itemc.type
                });
              });
            }
          });
          console.log(updataArr);
        }

        updataShelf(this.shelfList);
      }
    },

    //加入历史阅读
    addReaderHistory() {
      let historyList = getReaderHistory();
      if (!historyList) {
        historyList = [];
      }
      if (this.inHistory) {
        historyList = this.historyList.filter(
          item => item.id != this.inHistory.id
        );
        historyList.unshift(this.inHistory);
      } else {
        historyList.unshift(this.bookItem);
      }
      this.setHistoryList(historyList);
      saveReaderHistory(historyList);
    },

    // 听书
    trialListening() {
      // 如果电子书已经缓存，从IndexedDB中读取电子书
      getLocalForage(this.bookItem.fileName, (err, blob) => {
        if (!err && blob && blob instanceof Blob) {
          this.$router.push({
            path: "/home/speaking",
            query: {
              fileName: this.bookItem.fileName
            }
          });
        } else {
          // 如果没有缓存，直接跳转到听书页面
          this.$router.push({
            path: "/home/speaking",
            query: {
              fileName: this.bookItem.fileName,
              opf: this.opf
            }
          });
        }
      });
    },

    // 阅读电子书
    readBook() {
      this.addReaderHistory();
      this.$router.push({
        path: `/ebook/${this.$route.query.category}|${this.$route.query.fileName}`
      });
    },

    // 通过章节阅读电子书
    read(item) {
      getLocalForage(this.$route.query.fileName, (err, blob) => {
        if (!err && blob && blob instanceof Blob) {
          this.$router.push({
            path: `/ebook/${this.$route.query.category}}|${this.$route.query.fileName}`,
            query: {
              navigation: item.href
            }
          });
        } else {
          this.$router.push({
            path: `/ebook/${this.$route.query.category}}|${this.$route.query.fileName}`,
            query: {
              navigation: item.href,
              opf: this.opf
            }
          });
        }
      });
      this.addReaderHistory();
    },

    // 电子书目录缩进样式
    itemStyle(item) {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + "rem"
      };
    },
    
    // 将目录从多维转为一维
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

    // 通过opf下载电子书（实现逐章下载，提供电子书访问性能）
    downloadBook() {
      // 拼接opf文件路径
      const opf = `${process.env.VUE_APP_EPUB_URL}/${this.$route.query.categoryText}/${this.$route.query.fileName}/OEBPS/package.opf`;
      this.parseBook(opf);
    },

    // 解析电子书
    parseBook(url) {
      // 通过电子书或opf文件的url生成Book对象
      this.book = new Epub(url);
      // 获取电子书的metadata信息
      this.book.loaded.metadata.then(metadata => {
        this.metadata = metadata;
      });
      // 获取电子书的目录信息
      this.book.loaded.navigation.then(nav => {
        this.navigation = nav;
        // 通过第二章的目录（第一章通常是封面，所以获取第二章）
        if (this.navigation.toc && this.navigation.toc.length > 1) {
          // 将第二章进行渲染（渲染的内容隐藏在屏幕外，用户是看不见的）
          const candisplay = this.display(this.navigation.toc[1].href);
          if (candisplay) {
            candisplay.then(section => {
              if (this.$refs.scroll) {
                this.$refs.scroll.refresh();
              }
              this.displayed = true;
              // 渲染成功后通过section获取HTML文本，将HTML标签进行替换，提取纯文本信息
              const reg = new RegExp("<.+?>", "g");
              const text = section.output.replace(reg, "").replace(/\s\s/g, "");
              // 将纯文本信息保存到description变量中，用于进行摘要信息展示
              this.description = text;
            });
          }
        }
      });
    },

    // 获取电子书详情
    init() {
      // 获取电子书书名
      this.fileName = this.$route.query.fileName;
      // 获取电子书分类
      this.categoryText = this.$route.query.category;
      if (this.fileName) {
        // 请求API，获取电子书详情数据
        detailApi({
          fileName: this.fileName
        }).then(response => {
          if (
            response.status === 200 &&
            response.data.code === 0 &&
            response.data.data
          ) {
            console.log(response, "书籍详情");
            const data = response.data.data;
            // 保存电子书详情数据
            this.bookItem = data;
            // 获取封面数据
            this.cover = this.bookItem.cover;
            // 获取rootFile数据
            let rootFile = data.rootFile;
            if (rootFile.startsWith("/")) {
              rootFile = rootFile.substring(1, rootFile.length);
            }
            // 根据rootFile拼接出opf文件路径(opf可以在线请求书籍,而用书籍url会下载整本电子书再解析)
            this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`;
            // 解析电子书
            this.parseBook(this.opf);
          } else {
            // 请求失败时打印错误提示
            this.simpleToast(response.data.msg);
          }
        });
      }
    },

    back() {
      this.$router.go(-1);
    },

    // 根据传入的目录信息，渲染电子书
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

    // 处理用户滚动事件，确定标题阴影的显示状态
    onScroll(offsetY) {
      if (offsetY > 42) {
        this.$refs.title.showShadow();
      } else {
        this.$refs.title.hideShadow();
      }
    }
  },

  mounted() {
    this.init();
    if (!this.shelfList || this.shelfList.length === 0) {
      this.getShelfList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.book-detail {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: white;
  .content-wrapper {
    width: 100%;
    .book-detail-content-wrapper {
      width: 100%;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      .book-detail-content-title {
        font-size: 20px;
        font-weight: bold;
        padding: 20px 15px 10px 15px;
        box-sizing: border-box;
      }
      .book-detail-content-list-wrapper {
        padding: 10px 15px;
        box-sizing: border-box;
        .loading-text-wrapper {
          width: 100%;
          .loading-text {
            font-size: 14px;
            color: #666;
          }
        }
        .book-detail-content-row {
          display: flex;
          box-sizing: border-box;
          margin-bottom: 10px;
          .book-detail-content-label {
            flex: 0 0 70px;
            font-size: 14px;
            color: #666;
          }
          .book-detail-content-text {
            flex: 1;
            font-size: 14px;
            color: #333;
          }
        }
        // #preview {
        // }
        .book-detail-content-item-wrapper {
          .book-detail-content-item {
            padding: 15px 0;
            font-size: 14px;
            line-height: 16px;
            color: #666;
            border-bottom: 1px solid #eee;
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
      padding: 15px;
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
    height: 52px;
    background-color: #fff;
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.3);
    .bottom-btn {
      flex: 1;
      color: $color-blue;
      font-weight: bold;
      font-size: 14px;
      @include center;
      &:active {
        color: $color-blue-transparent;
      }
      .icon-check {
        margin-right: 5px;
      }
    }
    &.hide-shadow {
      box-shadow: none;
    }
  }
}
</style>
