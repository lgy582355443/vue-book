<template>
  <div
    class="shelf-item"
    :class="{'shelf-item-shadow':data.type == 1 || data.type == 2}"
    @click="onItemClick"
  >
    <component class="shelf-item-comp" :class="{'is-edit':data.type == 2}" :is="item" :data="data"></component>
    <div
      class="icon-selected"
      :class="{'is-selected':data.selected}"
      v-show="isEditMode && data.type == 1"
    ></div>
  </div>
</template>

<script>
import ShelfItemBook from "./shelfItemBook";
import shelfItemCategory from "./shelfItemCategory";
import shelfItemAdd from "./shelfItemAdd";
import { gotoStoreHome } from "../../utils/home";
import { shelfMixin } from "../../utils/mixin";

export default {
  name: "ShelfItem",
  mixins: [shelfMixin],
  components: {
    ShelfItemBook,
    shelfItemCategory,
    shelfItemAdd
  },
  props: {
    data: Object
  },
  data() {
    return {
      book: ShelfItemBook,
      category: shelfItemCategory,
      add: shelfItemAdd
    };
  },
  watch: {},
  computed: {
    item() {
      if (this.data.type == 1) {
        return this.book;
      } else {
        if (this.data.type == 2) {
          return this.category;
        } else {
          return this.add;
        }
      }
    }
  },
  methods: {
    onItemClick() {
      if (this.isEditMode) {
        this.data.selected = !this.data.selected;
        if (this.data.selected && this.data.type == 1) {
          this.shelfSelected.pushWithoutDuplicate(this.data);
        } else {
          this.setShelfSelected(
            this.shelfSelected.filter(item => item.id !== this.data.id)
          );
        }
      } else {
        if (this.data.type == 1) {
          this.showBookDetail(this.data);
        } else if (this.data.type == 2) {
          this.$router.push({
            path: "/home/category",
            query: {
              title: this.data.title
            }
          });
        } else {
          gotoStoreHome(this);
        }
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.shelf-item-shadow {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: 0.5;
    }
  }
  .icon-selected {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.5);
    &.is-selected {
      color: $color-blue;
    }
  }
}
</style>