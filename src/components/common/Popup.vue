<template>
  <div class="popup" v-show="popupVisible">
    <transition name="fade">
      <div class="popup-bg" v-show="popupVisible" @click.stop="hide"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title && title.length>0">{{title}}</div>
        <div
          class="popup-btn"
          :class="{'danger':item.type == 'danger'}"
          v-for="(item,index) in btn"
          :key="index"
          @click="item.click"
        >{{item.text}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Popup",
  components: {},
  props: {
    title: String,
    btn: Array
  },
  data() {
    return {
      popupVisible: false,
      visible: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    show() {
      this.popupVisible = true;
      setTimeout(() => {
        this.visible = true;
      });
    },
    hide() {
      this.visible = false;
      setTimeout(() => {
        this.popupVisible = false;
      }, 200);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 990;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  .popup-bg {
    width: 100%;
    height: 100%;
  }
  .popup-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    .popup-title {
      width: 100%;
      height: 14px;
      border-bottom: 1px solid #eee;
      font-size: 12px;
      line-height: 14px;
      padding: 15px;
      box-sizing: border-box;
      color: #999;
      @include center;
    }
    .popup-btn {
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      color: #666;
      font-weight: bold;
      @include center;
      &.danger {
        color: $color-pink;
      }
    }
  }
}
</style>