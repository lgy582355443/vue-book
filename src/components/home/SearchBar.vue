<template>
  <div class="search-main">
    <div class="search-bar" :class="{'hide-title':!titleVisible , 'hide-shadow':!shadowVisible}">
      <div class="title-icon-back-wrapper" @click="back" :class="{'hide-title':!titleVisible}">
        <span class="icon-back icon"></span>
      </div>
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
          <div class="title-icon-lang-wrapper" @click="switchLocale">
            <span class="icon-cn icon" v-if="lang == 'cn'"></span>
            <span class="icon-en icon" v-else></span>
          </div>
        </div>
      </transition>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            class="input"
            ref="searchInput"
            v-model="searchText"
            @click="showHotSearch"
            type="text"
            :placeholder="$t('home.hint')"
            @keyup.13.exact="search"
          />
        </div>
      </div>
    </div>
    <hot-search-list v-if="hotSearchVisible" ref="hotSearchList"></hot-search-list>
  </div>
</template>

<script>
import { setLocalStorage } from "../../utils/localStorage";
import { StoreHomeMixin } from "@/mixins/home";
import hotSearchList from "./hotSearchList";

export default {
  name: "SearchBar",
  mixins: [StoreHomeMixin],
  components: {
    hotSearchList
  },
  props: {
    ifShowSearchPage: {
      type: Boolean,
      default: false
    },
    ifShowHotSearch: {
      type: Boolean,
      default: true
    },
    bookListOffsetY: Number
  },
  data() {
    return {
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false,
      searchText: null
    };
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    }
  },
  watch: {
    homeOffsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    },
    hotSearchOffsetY(offsetY) {
      if (offsetY > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    }
  },
  methods: {
    search() {
      this.$refs.searchInput.blur();
      this.$router.push({
        name: "bookList",
        query: {
          keyword: this.searchText
        }
      });
    },
    hideTitle() {
      this.titleVisible = false;
    },
    showTitle() {
      this.titleVisible = true;
    },
    hideShadow() {
      this.shadowVisible = false;
    },
    showShadow() {
      this.shadowVisible = true;
    },
    back() {
      if (this.offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
      if (this.hotSearchVisible) {
        this.hidehotSearch();
      } else {
        this.$router.push("/shelf");
      }
    },
    goBookShelf() {
      this.$router.push("/shelf");
    },
    //隐藏热门搜索
    hidehotSearch() {
      this.hotSearchVisible = false;
    },
    //显示热门搜索栏
    showHotSearch() {
      this.hotSearchVisible = true;
      this.hideTitle();
      this.hideShadow();
      //DOM更新完后再重置回顶部
      this.$nextTick(() => {
        this.$refs.hotSearchList.reset();
      });
    },
    //显示随机动画
    showFlapCard() {
      this.setFlapCardVisible(true);
      this.$emit("getRandom");
    },
    //切换语言
    switchLocale() {
      if (this.lang == "en") {
        this.$i18n.locale = "cn";
      } else {
        this.$i18n.locale = "en";
      }

      setLocalStorage("locale", this.$i18n.locale);
    }
  },
  created() {},
  mounted() {
    if (this.homeOffsetY > 0) {
      this.hideTitle();
      this.showShadow();
    } else {
      this.showTitle();
      this.hideShadow();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.search-bar {
  position: relative;
  width: 100%;
  height: 94px;
  z-index: 120;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: 52px;
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .title-icon-back-wrapper {
    position: absolute;
    left: 15px;
    top: 0;
    z-index: 150;
    height: 42px;
    transition: all 0.2s linear;
    @include center;
    .icon-back {
      font-size: 16px;
    }
    &.hide-title {
      height: 52px;
    }
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 110;
    width: 100%;
    height: 42px;
    .title-text-wrapper {
      width: 100%;
      height: 100%;
      font-size: 18px;
      font-weight: bold;
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: 15px;
      top: 0;
      z-index: 110;
      height: 100%;
      @include center;
      .icon-shake {
        font-size: 20px;
      }
    }
    .title-icon-lang-wrapper {
      position: absolute;
      right: 50px;
      top: 0;
      z-index: 110;
      height: 100%;
      @include center;
      .icon {
        font-size: 20px;
      }
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    left: 0px;
    top: 42px;
    z-index: 130;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 52px;
    padding: 10px;
    transition: top 0.2s linear;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all 0.2s linear;
      &.hide-title {
        flex: 0 0 32px;
        width: 32px;
      }
    }
    .search-bar-input {
      flex: 1;
      box-sizing: border-box;
      width: 100%;
      padding: 5px 15px;
      border-radius: 20px;
      background-color: #f4f4f4;
      border: 1px solid #eee;
      transition: all 0.2s linear;
      @include center;
      .icon-search.icon {
        height: 100%;
        color: rgb(161, 160, 160);
        @include center;
      }
      .input {
        width: 100%;
        height: 22px;
        padding: 0 10px;
        border: none;
        background-color: transparent;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
