<template>
  <div class="ebook-slide-contents">
    <!-- 顶部搜索框 -->
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          class="slide-contents-search-input"
          type="text"
          :placeholder="$t('book.searchHint')"
          v-model.trim="searchText"
          @click="showSearchPage()"
          @keyup.enter.exact="search()"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage()"
      >{{$t('book.cancel')}}</div>
    </div>
    <!-- 书籍信息 -->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress}}%</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText}}</div>
      </div>
    </div>
    <!-- 章节列表 -->
    <scroll class="slide-contents-list" :top="156" :bottom="0" ref="scroll" v-show="!searchVisible">
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
        @click="displayContent(item.href)"
      >
        <span
          class="slide-contents-item-label"
          :class="{'selected': section === index}"
          :style="conntentItemStyle(item)"
        >{{item.label}}</span>
        <span class="slide-contents-item-page">{{item.page}}</span>
      </div>
    </scroll>
    <!-- 搜索列表 -->
    <scroll class="slide-search-list" :top="67" ref="scroll" v-show="searchVisible">
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayContent(item.cfi,true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from "@/mixins/ebook";
import Scroll from "../common/Scroll";
import { px2rem } from "@/utils/utils";
export default {
  name: "EbookSideContent",
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      searchText: "",
      searchVisible: false,
      searchList: null
    };
  },
  methods: {
    showSearchPage() {
      this.searchVisible = true;
    },
    hideSearchPage() {
      this.searchVisible = false;
      this.searchText = "";
      this.searchList = null;
    },
    displayContent(target, highlight = false) {
      this.display(target, () => {
        this.hideMenuVisible();
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target);
        }
      });
    },

    // 搜索操作
    search() {
      if (this.searchText) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list.map(item => {
            //给搜索关键字添加样式，突出显示
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            );
            return item;
          });
        });
      }
    },

    //全文搜索方法
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(section =>
          section
            .load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
        //二维数组转化为一维数组 1dArr = [].concat.apply([], 2dArr);
      ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    //子级目录样式缩进
    conntentItemStyle(item) {
      return {
        marginLeft: `${item.level * 15}px`
      };
    }
  },
  mounted() {},
  created() {}
};
</script>

<style lang="scss" scoped>
.ebook-slide-contents {
  width: 100%;
  height: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: 36px;
    margin: 20px 0 10px 0;
    padding: 0 15px;
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      border-radius: 3px;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 28px;
        @include center;
        .icon-search {
          font-size: 12px;
        }
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: 32px;
        font-size: 14px;
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 50px;
      font-size: 14px;
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: 90px;
    padding: 10px 15px 20px 15px;
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 45px;
      box-sizing: border-box;
      .slide-contents-book-img {
        width: 45px;
        height: 60px;
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      @include columnLeft;
      .slide-contents-book-title {
        font-size: 14px;
        line-height: 16px;
        padding: 0 10px;
        box-sizing: border-box;
        @include left;
        .slide-contents-book-title-text {
          @include ellipsis2(1);
        }
      }
      .slide-contents-book-author {
        font-size: 12px;
        line-height: 14px;
        padding: 0 10px;
        box-sizing: border-box;
        margin-top: 5px;
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 70px;
      @include columnLeft;
      .slide-contents-book-progress {
        .progress {
          font-size: 14px;
          line-height: 16px;
        }
        .progress-text {
          font-size: 12px;
          line-height: 14px;
          margin-left: 2px;
        }
      }
      .slide-contents-book-time {
        font-size: 12px;
        line-height: 14px;
        margin-top: 5px;
      }
    }
  }
  .slide-contents-list {
    padding: 0 15px;
    box-sizing: border-box;
    text-align: left;
    .slide-contents-item {
      display: flex;
      padding: 20px 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: 14px;
        line-height: 16px;
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 30px;
        font-size: 10px;
        @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 15px;
    box-sizing: border-box;
    text-align: left;
    .slide-search-item {
      font-size: 14px;
      line-height: 16px;
      padding: 20px 0;
      box-sizing: border-box;
    }
  }
}
</style>
