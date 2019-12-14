<template>
  <div class="edit-moadl">
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
  </div>
</template>

<script>
import { shelfMixin } from "@/mixins/shelf";
import { saveBookShelf, removeLocalStorage } from "../../utils/localStorage";
import { download } from "@/api/download";
import { removeLocalForage } from "../../utils/localForage";
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
    async downloadSelectedBook() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true;
        });
      }
    },

    downloadBook(book) {
      let text = this.$t("shelf.startDownload");
      this.continueShow(text);
      return new Promise((resolve, reject) => {
        download(
          book,
          book => {
            this.toastHide();
            resolve(book);
          },
          reject,
          progressEvent => {
            const progress =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) +
              "%";
            text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress})`
            );
            this.toastUpdata(text);
          }
        );
      });
    },

    removeSelectedBook() {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(
        books => {
          books.map(book => {
            book.cache = false;
          });
          saveBookShelf(this.shelfList);
          this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
        }
      );
    },

    removeBook(book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`);
        removeLocalForage(`${book.fileName}`);
        resolve(book);
      });
    },

    removeSelected() {
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(book => book !== selected));
      });
      this.setShelfSelected([]);
      this.onComplete();
    },

    onComplete() {
      this.popupHide();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList);
    },

    //私密阅读
    setPrivate() {
      let isPrivate = this.isPrivate ? false : true;
      this.shelfSelected.forEach(book => {
        book.private = isPrivate;
      });
      this.onComplete();
      if (isPrivate) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess"));
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }
    },

    //缓存
    async setDownload() {
      // this.shelfSelected.forEach(book => {
      //   book.cache = !this.isDownload;
      // });
      this.onComplete();
      if (this.isDownload) {
        this.removeSelectedBook();
      } else {
        await this.downloadSelectedBook();
        saveBookShelf(this.shelfList);
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      }
      // if (!this.isDownload) {
      //   this.simpleToast(this.$t("shelf.removeDownloadSuccess"))
      // } else {
      //   this.simpleToast(this.$t("shelf.setDownloadSuccess"))
      // }
    },

    showPrivate() {
      this.popupShow(
        this.isPrivate
          ? this.$t("shelf.closePrivateSuccess")
          : this.$t("shelf.setPrivateTitle"),
        [
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
      );
    },

    showDownload() {
      this.popupShow(
        this.isDownload
          ? this.$t("shelf.removeDownloadTitle")
          : this.$t("shelf.setDownloadTitle"),
        [
          {
            text: this.isDownload
              ? this.$t("shelf.delete")
              : this.$t("shelf.open"),
            click: this.setDownload
          },
          {
            text: this.$t("shelf.cancel"),
            click: this.popupHide
          }
        ]
      );
    },

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
          this.dialog().show();
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
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.shelf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 250;
  display: flex;
  width: 100%;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
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
</style>