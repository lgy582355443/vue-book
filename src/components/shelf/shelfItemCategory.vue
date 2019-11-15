<template>
  <div class="shelf-item-categor">
    <div class="shelf-item-category-list" v-if="data.itemList.length > 0">
      <div class="shelf-item-category-item" v-for="(item ,index) in data.itemList" :key="index">
        <img :src="item.cover" class="shelf-item-category-img" />
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShelfItemCategor",
  components: {},
  props: {
    data: Object
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.shelf-item-categor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .shelf-item-category-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;
    padding-top: 5px;
    box-sizing: border-box;
    .shelf-item-category-item {
      flex: 0 0 33.33%;
      width: 33.33%;
      height: 33.33%;
      box-sizing: border-box;
      &:nth-child(3n + 1) {
        padding: 0 2.5px 5px 5px;
      }
      &:nth-child(3n + 2) {
        padding: 0 2.5px 5px 2.5px;
      }
      &:nth-child(3n + 3) {
        padding: 0 5px 5px 2.5px;
      }
      .shelf-item-category-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .shelf-item-category-bg {
    width: 100%;
    height: 100%;
    background: white;
    font-size: 30px;
    color: #ccc;
    @include center;
  }
}
</style>