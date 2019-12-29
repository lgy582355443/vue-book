<template>
  <div class="featured-main">
    <title-view
      :label="titleText"
      v-if="titleVisible && data && data.length > 0"
      :btn="btnText"
      @onClick="onClick"
    ></title-view>
    <div class="featured-list">
      <div class="featured-item-wrapper">
        <featured-item v-for="(item, index) in data" :key="index" :data="item"></featured-item>
      </div>
    </div>
  </div>
</template>

<script>
import FeaturedItem from "./featuredItem";
import TitleView from "@/components/home/title";
import { realPx } from "@/utils/utils";
import { categoryText } from "@/utils/home";
import { StoreHomeMixin } from "@/mixins/home";

export default {
  mixins: [StoreHomeMixin],
  components: {
    TitleView,
    FeaturedItem
  },
  props: {
    data: Array,
    titleVisible: {
      type: Boolean,
      default: true
    },
    titleText: {
      type: String
    },
    btnText: {
      type: String
    }
  },
  computed: {
    // width() {
    //   return window.innerWidth - realPx(20) - realPx(60) + "px";
    // }
  },
  methods: {
    // resize() {
    //   this.$nextTick(() => {
    //     this.$refs.title.forEach(item => {
    //       item.style.width = this.width;
    //     });
    //     this.$refs.author.forEach(item => {
    //       item.style.width = this.width;
    //     });
    //     this.$refs.category.forEach(item => {
    //       item.style.width = this.width;
    //     });
    //   });
    // },
    onClick() {
      this.$emit("onClick");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";

.featured-main {
  .featured-list {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .featured-item-wrapper {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
}
</style>
