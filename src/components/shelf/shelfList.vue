<template>
  <div class="shelf-list-main" :style="`top: ${top}px;`">
    <transition-group
      name="list"
      tag="div"
      appear
      class="shelf-list-item-animation"
    >
      <div
        class="shelf-list-item-wrapper"
        v-for="item in data"
        :key="item.shelf_id"
      >
        <shelf-item :data="item" :style="`height:${itemHeight}`"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{ item.title }}</span>
        </div>
      </div>
      <div class="itemAdd-wrapper" :key="-1" v-show="currentType == 1">
        <shelf-item-add :style="`height:${itemHeight}`"></shelf-item-add>
      </div>
    </transition-group>
  </div>
</template>

<script>
// import ShelfMixin from "@/mixins/shelf";
import ShelfItem from "./shelfItem";
import ShelfItemAdd from "./shelfItemAdd";
import { realPx, px2rem } from "../../utils/utils";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ShelfList",
  // mixins: [ShelfMixin],
  components: {
    ShelfItem,
    ShelfItemAdd,
  },
  props: {
    top: {
      type: Number,
      default: 94,
    },
    data: Array,
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapGetters(["shelfList", "currentType"]),
    itemHeight() {
      //图片原始尺寸：250px *350px
      //转化rem后的比例 w/250 = h/350
      //h = w*350/250
      return ((window.innerWidth - 120) / 3 / 250) * 350 + "px";
    },
  },
};
</script>
<style lang="scss" scoped>
.shelf-list-main {
  position: absolute;
  z-index: 104;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  .shelf-list-item-animation {
    display: flex;
    flex-flow: row wrap;

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
    .itemAdd-wrapper {
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
    }
  }
}
</style>
