<template>
  <transition name="footerUp">
    <div class="shelf-footer" v-show="isEditMode">
      <div
        class="shelf-footer-tab-wrapper"
        v-for="item in tabs"
        :key="item.index"
        @click="onTabClick(item)"
      >
        <div class="book-shelf-tab" :class="{'is-selected': isSelected}">
          <div class="icon-private tab-icon" v-show="item.index === 1 && !isPrivate"></div>
          <div class="icon-private-see tab-icon" v-show="item.index === 1 && isPrivate"></div>
          <div class="icon-download tab-icon" v-show="item.index === 2 && !isDownload"></div>
          <div class="icon-download-remove tab-icon" v-show="item.index === 2 && isDownload"></div>
          <div class="icon-move tab-icon" v-show="item.index === 3"></div>
          <div class="icon-shelf tab-icon" v-show="item.index === 4"></div>
          <div class="tab-text" :class="{'remove-text': item.index === 4, }">{{label(item)}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { shelfMixin } from "@/mixins/shelf";
import {
  saveBookShelf,
  removeLocalStorage,
  getBookShelf
} from "../../utils/localStorage";
import { download } from "@/api/download";
import { removeLocalForage, setLocalForage } from "../../utils/localForage";
export default {
  name: "ShelfFooter",
  components: {},
  props: {},
  mixins: [shelfMixin],
  data() {
    return {
      popupMenu: null
    };
  },
  watch: {},
  computed: {
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0;
    },
    tabs() {
      return [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2
        },
        {
          label: this.$t("shelf.move"),
          index: 3
        },
        {
          label: this.$t("shelf.remove"),
          index: 4
        }
      ];
    },
    isPrivate() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every(item => item.private);
      }
    },
    isDownload() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every(item => item.cache);
      }
    }
  },
  methods: {
    //缓存选中的书籍方法
    async _downloadSelectedBook() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this._downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true;
        });
      }
    },

    //缓存或删除缓存操作
    async _setDownload() {
      this.onComplete();
      if (this.isDownload) {
        this._removeSelectedBook();
      } else {
        await this._downloadSelectedBook();
        saveBookShelf(this.shelfList);
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      }
      this.updataShelf();
      this.setShelfSelected([]);
    },

    //缓存书籍方法
    _downloadBook(book) {
      let text = this.$t("shelf.startDownload");
      this.continueShow(text);
      return new Promise((resolve, reject) => {
        download({
          categoryText: book.categoryText,
          fileName: book.fileName,
          //下载处理进度事件
          onProgress: progressEvent => {
            const progress =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
              "%";
            text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress})`
            );
            //toas显示下载进度
            this.toastUpdata(text);
          }
        }).then(res => {
          const blob = new Blob([res.data]);
          //存入indexDB
          setLocalForage(
            book.fileName,
            blob,
            () => {
              this.toastHide();
              resolve(book);
            },
            err => reject(err)
          );
        });
      });
    },

    //删除选中的书架的离线缓存操作
    _removeSelectedBook() {
      Promise.all(this.shelfSelected.map(book => this._removeBook(book))).then(
        books => {
          books.map(book => {
            book.cache = false;
          });
          saveBookShelf(this.shelfList);
          this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
        }
      );
    },

    //删除缓存方法
    _removeBook(book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`);
        removeLocalForage(`${book.fileName}`);
        resolve(book);
      });
    },

    //从书架列表移除被选中的
    removeSelected() {
      this.setSelectedRemoveFromShelf().then(() => {
        this.updataShelf();
        this.onComplete();
        this.setShelfSelected([]);
      });
    },

    //开启私密阅读
    setPrivate() {
      let isPrivate = this.isPrivate ? false : true;
      this.shelfSelected.forEach(book => {
        book.private = isPrivate;
      });
      this.updataShelf();
      this.setShelfSelected([]);
      this.onComplete();
      if (isPrivate) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess"));
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }
    },

    //重置
    onComplete() {
      this.popupHide();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
    },

    //开启或关闭私密阅读弹popup
    showPrivate() {
      this.popupShow({
        title: this.isPrivate
          ? this.$t("shelf.closePrivateSuccess")
          : this.$t("shelf.setPrivateTitle"),
        btn: [
          {
            text: this.isPrivate
              ? this.$t("shelf.cancel")
              : this.$t("shelf.open"),
            click: this.setPrivate
          },
          {
            text: this.$t("shelf.cancel"),
            click: this.popupHide
          }
        ]
      });
    },

    //删除或下载书本离线缓存弹出框
    showDownload() {
      this.popupShow({
        title: this.isDownload
          ? this.$t("shelf.removeDownloadTitle")
          : this.$t("shelf.setDownloadTitle"),
        btn: [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.open"),
            click: this._setDownload
          },
          {
            text: this.$t("shelf.cancel"),
            click: this.popupHide
          }
        ]
      });
    },

    //弹出移出书架弹出框
    showRemove() {
      let title;
      if (this.shelfSelected.length == 1) {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          `<${this.shelfSelected[0].title}>`
        );
      } else {
        title = this.$t("shelf.removeBookTitle").replace(
          "$1",
          this.$t("shelf.selectedBooks")
        );
      }
      this.popupShow(title, [
        {
          text: this.$t("shelf.removeBook"),
          type: "danger",
          click: this.removeSelected
        },
        {
          text: this.$t("shelf.cancel"),
          click: this.popupHide
        }
      ]);
    },

    onTabClick(item) {
      if (!this.isSelected) {
        return;
      }
      switch (item.index) {
        case 1:
          this.showPrivate();
          break;
        case 2:
          this.showDownload();
          break;
        case 3:
          this.shelfDialog().show();
          break;
        case 4:
          this.showRemove();
          break;
        default:
          break;
      }
    },
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label;
        case 2:
          return this.isDownload ? item.label2 : item.label;
        default:
          return item.label;
      }
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    //离开组件时，隐藏toas
    this.toastHide();
  }
};
</script>
<style lang="scss" scoped>
.shelf-footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  z-index: 250;
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0px 5px #cccc;
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .book-shelf-tab {
      width: 100%;
      height: 100%;
      opacity: 0.8;
      @include columnCenter;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: 20px;
        color: #666;
        opacity: 0.8;
        &.icon-shelf {
          color: $color-pink;
        }
        &.icon-download {
          font-size: 22px;
        }
      }
      .tab-text {
        margin-top: 5px;
        font-size: 12px;
        color: #666;

        &.remove-text {
          color: $color-pink;
        }
      }
    }
  }
}
.footerUp-enter-active {
  animation: footerUp 0.3s;
}
.footerUp-leave-active {
  animation: footerUp 0.3s reverse;
}
@keyframes footerUp {
  0% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>