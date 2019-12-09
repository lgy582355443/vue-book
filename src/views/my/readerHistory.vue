<template>
  <div class="reader-history-main">
    <title-view
      :class="`${isShadow?'isShadow':''}`"
      :showBack="true"
      :label="$t('my.ReaderHistory')"
      :btn="$t('my.clearHistory')"
      @onClick="clearHistory"
    ></title-view>
    <scroll :top="48" @onScroll="onScroll">
      <div class="history-list">
        <history-item v-for="item in historyList" :key="item.id" :data="item"></history-item>
      </div>
    </scroll>
  </div>
</template>

<script>
import TitleView from "@/components/home/title";
import HistoryItem from "@/components/home/featuredItem";
import scroll from "@/components/common/Scroll";
import { getReaderHistory, saveReaderHistory } from "@/utils/localStorage";
import { userMixin } from "@/utils/mixin";
export default {
  name: "ReaderHistory",
  components: {
    HistoryItem,
    TitleView,
    scroll
  },
  props: {},
  mixins: [userMixin],
  data() {
    return {
      isShadow: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    clearHistory() {
      this.setHistoryList([]);
      saveReaderHistory([]);
    },
    onScroll(offsetY) {
      if (offsetY > 20) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    },
    showShadow() {
      this.isShadow = true;
    },
    hideShadow() {
      this.isShadow = false;
    }
  },
  created() {
    this.setHistoryList(getReaderHistory());
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.reader-history-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .history-list {
    box-sizing: border-box;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding: 10px 10px;
    ::v-deep .featured-item {
      flex: 0 0 100%;
      .img-wrapper {
        flex: 0 0 20%;
      }
    }
  }
  .isShadow {
    box-shadow: 0 0 5px #ccc;
  }
}
</style>