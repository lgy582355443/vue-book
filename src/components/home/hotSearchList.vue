<template>
  <transition name="host-search">
    <div class="host-list">
      <scroll class="hot-search-wrapper" ref="scroll" @onScroll="onScroll">
        <hot-search
          :label="$t('home.hotSearch')"
          :btn="$t('home.change')"
          :hotSearch="searchList.hotSearch"
        ></hot-search>
        <div class="line"></div>
        <hot-search
          :label="$t('home.historySearch')"
          :btn="$t('home.clear')"
          :hotSearch="searchList.historySearch"
        ></hot-search>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/components/common/Scroll";
import { StoreHomeMixin } from "@/mixins/home";
import hotSearch from "./hotSearch";
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
      searchList: {
        hotSearch: [
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
        ],
        historySearch: [
          {
            type: 2,
            text: "Computer Science"
          },
          {
            type: 1,
            text: "Building the Infrastructure for Cloud Security"
          },
          {
            type: 2,
            text: "ePub"
          },
          {
            type: 2,
            text: "api"
          },
          {
            type: 2,
            text: "Vue.js"
          },
          {
            type: 2,
            text: "Nginx"
          },
          {
            type: 2,
            text: "Java"
          },
          {
            type: 2,
            text: "hdfs"
          },
          {
            type: 2,
            text: "vuejs"
          },
          {
            type: 2,
            text: "es6"
          },
          {
            type: 2,
            text: "Intel"
          },
          {
            type: 1,
            text: "Pro Git"
          },
          {
            type: 2,
            text: "imooc"
          },
          {
            type: 2,
            text: "Education"
          },
          {
            type: 2,
            text: "Springer"
          },
          {
            type: 2,
            text: "Environment"
          }
        ]
      }
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
  created() {},
  mounted() {},
  beforeDestroy() {}
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