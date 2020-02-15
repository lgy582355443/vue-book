<template>
  <div class="shelf-search-main" :class="{'search-top':ifInputClicked, 'hide-shadow':ifHideShadow}">
    <div class="shelf-search" :class="{'search-top': ifInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input
            class="search-input"
            type="text"
            :placeholder="$t('shelf.search')"
            v-model="searchText"
            @click="onSearchClick"
            ref="searchInput"
          />
        </div>
        <div class="icon-clear-wrapper" @click="clearSearchText" v-show="searchText.length>0">
          <span class="icon-close-circle-fill icon"></span>
        </div>
      </div>
      <div class="icon-loale-wrapper" v-if="!ifInputClicked" @click="switchLocale">
        <span class="icon-cn icon" v-if="lang == 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" v-else @click="onCancelClick">
        <span class="cancel-btn">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="shelf-tab-slide-up">
      <div class="tab-wrapper" v-show="ifInputClicked">
        <div class="tab-item" v-for="(item, index) in tabs" :key="index" @click="onTabClick(item)">
          <span class="tab-item-text" :class="{'is-selected': selectedID == item.id}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { setLocalStorage } from "../../utils/localStorage";
import { shelfMixin } from "@/mixins/shelf";
export default {
  name: "ShelfSearch",
  components: {},
  props: {},
  mixins: [shelfMixin],
  data() {
    return {
      ifInputClicked: false,
      ifHideShadow: true,
      searchText: "",
      selectedID: 1
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0 && this.ifInputClicked) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t("shelf.default"),
          selected: true
        },
        {
          id: 2,
          text: this.$t("shelf.progress"),
          selected: false
        },
        {
          id: 3,
          text: this.$t("shelf.purchase"),
          selected: false
        }
      ];
    }
  },
  methods: {
    onTabClick(item) {
      this.selectedID = item.id;
    },
    onSearchClick() {
      this.ifInputClicked = true;
      this.setShelfTitleVisible(false);
    },
    onCancelClick() {
      this.clearSearchText();
      this.ifInputClicked = false;
      this.setShelfTitleVisible(true);
    },
    //切换语言
    switchLocale() {
      if (this.lang == "en") {
        this.$i18n.locale = "cn";
      } else {
        this.$i18n.locale = "en";
      }
      setLocalStorage("locale", this.$i18n.locale);
    },
    //清空文本框
    clearSearchText() {
      this.searchText = "";
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.onCancelClick();
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.shelf-search-main {
  position: relative;
  z-index: 105;
  width: 100%;
  height: 94px;
  font-size: 16px;
  background: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  &.search-top {
    position: fixed;
    left: 0;
    top: 0;
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-search {
    position: absolute;
    top: 42px;
    left: 0;
    display: flex;
    z-index: 105;
    width: 100%;
    height: 52px;
    transition: top 0.2s linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      display: flex;
      flex: 1;
      margin: 8px 0 8px 10px;
      border: 1px solid #ccc;
      border-radius: 3px;
      .icon-search-wrapper {
        flex: 0 0 22px;
        @include right;
        .icon-search {
          font-size: 12px;
        }
      }
      .search-input-wrapper {
        flex: 1;
        padding: 0 10px;
        box-sizing: border-box;
        @include center;
        .search-input {
          width: 100%;
          //   height: 100%;
          font-size: 14px;
          border: none;
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: 14px;
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 24px;
        @include left;
        .icon-close-circle-fill {
          font-size: 14px;
          color: #ccc;
        }
      }
    }
    .icon-loale-wrapper {
      flex: 0 0 55px;
      @include center;
      .icon-cn,
      .icon-en {
        font-size: 22px;
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      flex: 0 0 55px;
      @include center;
      .cancel-btn {
        font-size: 14px;
        color: $color-blue;
      }
    }
  }
  .tab-wrapper {
    position: absolute;
    top: 52px;
    left: 0;
    z-index: 100;
    display: flex;
    width: 100%;
    height: 42px;
    .tab-item {
      flex: 1;
      @include center;
      .tab-item-text {
        font-size: 12px;
        color: #999;
        &.is-selected {
          color: $color-blue;
        }
      }
    }
  }
}
</style>