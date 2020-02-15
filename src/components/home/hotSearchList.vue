<template>
  <transition name="host-search">
    <div class="host-list">
      <scroll class="hot-search-wrapper" ref="scroll" @onScroll="onScroll">
        <hot-search
          :label="$t('home.hotSearch')"
          :btn="$t('home.change')"
          :hotSearch="hotSearchList"
        ></hot-search>
        <div class="line"></div>
        <hot-search
          :label="$t('home.historySearch')"
          :btn="$t('home.clear')"
          :hotSearch="searchHistoryList"
        ></hot-search>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/components/common/Scroll";
import { StoreHomeMixin } from "@/mixins/home";
import hotSearch from "./hotSearch";
import { getSearchHistory, saveSearchHistory } from "@/utils/localStorage.js";
export default {
  name: "HotSearchList",
  mixins: [StoreHomeMixin],
  components: {
    Scroll,
    hotSearch
  },
  props: {},
  data() {
    return {
      hotSearchList: [
        {
          type: 1,
          text: "Self-Reported Population Health",
          num: "1.8万"
        },
        {
          type: 1,
          text: "Library and Information Sciences",
          num: "1.1万"
        },
        {
          type: 1,
          text: "Global Business Strategy",
          num: "1.3万"
        },
        {
          type: 1,
          text: "Corporate Data Quality",
          num: "1.0万"
        },
        {
          type: 1,
          text: "Verrechnungspreise",
          num: "3.9万"
        }
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    onScroll(offsetY) {
      this.setHotSearchOffsetY(offsetY);
    },
    reset() {
      this.$refs.scroll.scrollTo(0, 0);
    }
  },
  created() {
    let searchList = getSearchHistory();
    console.log(searchList);
    if (searchList) {
      console.log('11');
      this.setSearchHistoryList(searchList);
    } else {
      saveSearchHistory(this.searchHistoryList);
      console.log('22');
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.host-list {
  position: absolute;
  top: 51px;
  z-index: 999;
  height: calc(100% - 52px);
  width: 100%;
  background-color: #fff;
}
.hot-search-wrapper {
  height: 100%;
}
</style>