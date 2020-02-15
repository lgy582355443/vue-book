<template>
  <div class="book-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll class="book-shelf-scrill-wrapper" ref="scroll" :bottom="50" @onScroll="onScroll">
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-Footer></shelf-Footer>
  </div>
</template>

<script>
import ShelfTitle from "../../components/shelf/shelfTitle";
import Scroll from "../../components/common/Scroll";
import ShelfSearch from "../../components/shelf/shelfSearch";
import ShelfList from "../../components/shelf/shelfList";
import ShelfFooter from "../../components/shelf/shelfFooter";
import { shelfMixin } from "@/mixins/shelf";

export default {
  name: "BookShelf",
  mixins: [shelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter,
  },
  props: {},
  data() {
    return {
      scrollBottom: 0
    };
  },
  watch: {
    // isEditMode(isEditMode) {
    //   this.scrollBottom = isEditMode ? 50 : 0;
    //   this.$nextTick(() => {
    //     this.$refs.scroll.refresh();
    //   });
    // }
  },
  computed: {},
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    }
  },
  created() {
    this.getShelfList();
    this.setShelfCategory([]);
    this.setCurrentType(1);
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.book-shelf {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .book-shelf-scrill-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
}
</style>
