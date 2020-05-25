<template>
  <div class="search-main" v-if="hotSearch.length > 0">
    <div class="hot-search-title">
      <span class="label">{{ label }}</span>
      <span class="btn" @click="btnTap">{{ btn }}</span>
    </div>
    <div class="hot-search-list">
      <div
        class="hot-search-item"
        v-for="(item, index) in hotSearch"
        :key="index"
        @click="searchBook(item.text)"
      >
        <div class="icon-wrapper">
          <span class="icon-book icon" v-if="item.type === 1"></span>
          <span class="icon-search icon" v-else></span>
        </div>
        <div class="hot-search-text-wrapper">
          <div class="text" ref="searchText">{{ item.text }}</div>
          <div class="num" v-if="item.num">{{ item.num }}人搜索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { removeLocalStorage } from "@/utils/localStorage.js";
import { StoreHomeMixin } from "@/mixins/home";
export default {
  name: "HotSearch",
  mixins: [StoreHomeMixin],
  props: {
    label: String,
    btn: String,
    hotSearch: Array
  },
  computed: {
    btnTap() {
      return this.btn === this.$t("home.clear")
        ? this.clearHistory
        : this.replaceList;
    }
  },
  methods: {
    clearHistory() {
      removeLocalStorage("searchHistory");
      this.setSearchHistoryList([]);
    },
    replaceList() {},
    searchBook(searchText) {
      this.$router.push({
        name: "bookList",
        query: {
          keyword: searchText
        }
      });
    }
  },
  mounted() {
    if (this.$refs.searchText) {
      this.$refs.searchText.forEach(item => {
        item.style.width = window.innerWidth - 20 - 40 + "px";
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hot-search-title {
  display: flex;
  width: 100%;
  font-size: 13px;
  padding: 10px;
  box-sizing: border-box;
  .label {
    flex: 1;
    text-align: left;
    font-weight: bold;
    color: #666;
  }
  .btn {
    flex: 1;
    text-align: right;
    font-weight: bold;
    color: #409eff;
  }
}
.hot-search-list {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  .hot-search-item {
    padding: 10px 0;
    display: flex;
    .icon-wrapper {
      flex: 0 0 40px;
      @include center;
      .icon-book {
        font-size: 16px;
      }
      .icon-search {
        font-size: 16px;
      }
    }
    .hot-search-text-wrapper {
      flex: 1;
      height: 35px;
      @include columnLeft;
      .text {
        flex: 1;
        height: 100%;
        @include ellipsis;
        @include left;
        font-size: 14px;
        font-weight: bold;
        color: #666;
      }
      .num {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }
    }
  }
}
</style>
