
<template>
  <div class="store-category">
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll
      class="store-category-scroll-wrapper"
      :top="0"
      :bottom="scrollBottom"
      @onScroll="onScroll"
      ref="scroll"
      v-if="ifShowList"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <!-- 分类列表数据为空时展示内容 -->
    <div class="store-category-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import ShelfTitle from "../../components/shelf/shelfTitle";
import Scroll from "../../components/common/Scroll";
import ShelfList from "../../components/shelf/shelfList";
import ShelfFooter from "../../components/shelf/shelfFooter";
import { shelfMixin } from "@/mixins/shelf";
import { getBookShelf } from "../../utils/localStorage";

export default {
  name: "ShelfCategory",
  mixins: [shelfMixin],
  components: {
    Scroll,
    ShelfTitle,
    ShelfList,
    ShelfFooter
  },
  watch: {
    // 监听是否为编辑模式
    isEditMode(isEditMode) {
      // 如果是编辑模式，滚动条需要距底部48像素（需要换算成实际px，组件负责运算）
      this.scrollBottom = isEditMode ? 48 : 0;
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          this.$refs.scroll.refresh();
        }
      });
    }
  },
  computed: {
    ifShowList() {
      // 分类列表展示的条件
      return (
        this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      );
    }
  },
  data() {
    return {
      scrollBottom: 0
    };
  },
  methods: {
    // 列表滚动监听事件
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    }
  },
  created() {
    // 获取分类列表数据
    this.getCategoryList(this.$route.query.title);
    // 标记currentType为2，currentType=1在书架页，2为在分组页，ShelfTitle将呈现不同状态
    this.setCurrentType(2);
  }
};
</script>

<style lang="scss" scoped>
.store-category {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  .store-category-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .store-category-empty-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #333;
    @include center;
  }
}
</style>