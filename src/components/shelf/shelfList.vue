<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <transition-group name="list" tag="div" appear class="shelf-list-item-animation">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="`height:${itemHeight}`"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { shelfMixin } from "../../utils/mixin";
import shelfItem from "./shelfItem";
import { realPx, px2rem } from "../../utils/utils";
export default {
  name: "ShelfList",
  mixins: [shelfMixin],
  components: {
    shelfItem
  },
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: Array
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    itemHeight() {
      //图片250px *350px
      //转化rem后的比例 w/250 = h/350
      //h = w*350/250
      return ((window.innerWidth - realPx(120)) / 3 / 250) * 350 + "px";
    },
    shelfListTop() {
      return px2rem(this.top) + "rem";
    }
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-list {
  position: absolute;
  z-index: 104;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  .shelf-list-item-animation {
    display: flex;
    flex-flow: row wrap;
  }
  .shelf-list-item-wrapper {
    flex: 0 0 33.33%;
    width: 33.33%;
    padding: 15px;
    box-sizing: border-box;
    &.list-leave-active {
      display: none;
    }
    &.list-move {
      transition: transform 0.5s;
    }
    .shelf-list-title-wrapper {
      margin-top: 10px;
    }
  }
}
</style>