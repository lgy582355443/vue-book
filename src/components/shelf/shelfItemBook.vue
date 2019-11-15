<template>
  <div class="shelf-item-book">
    <img class="shelf-item-book-cover" :src="data.cover" />
    <div class="private-wrapper" v-show="data.private"></div>
    <div class="private-icon-wrapper" v-show="data.private">
      <span class="icon-private"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.shelf-item-book {
  width: 100%;
  height: 100%;
  .shelf-item-book-cover {
    width: 100%;
    height: 100%;
  }
  .private-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-width: 15px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.3);
  }
  .private-icon-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    padding-bottom: 5px;
    padding-left: 3px;
    @include leftBottom;
    .icon-private {
      font-size: 12px;
      color: white;
    }
  }
}
</style>
