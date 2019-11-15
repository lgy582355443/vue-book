<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left" @click="back">
        <span class="icon-back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf"></span>
        </div>
        <!-- <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper" @click="gotoBookStore">
          <span class="icon-more"></span>
        </div> -->
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
export default {
  name: "EbookTitle",
  mixins: [ebookMixin],
  methods: {
    back() {
      this.$router.go(-1);
    },
    gotoBookStore() {
      this.$router.push("/book-store");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  width: 100%;
  height: 50px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.15);
  font-size: 20px;
  background-color: #fff;
  .left {
    flex: 0 0 40px;
    @include right;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .icon-wrapper {
      flex: 0 0 40px;
      @include left;
    }
  }
}
</style>