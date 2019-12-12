<template>
  <transition name="fade">
    <div class="toast-bg-wrapper" @click.prevent v-show="visible">
      <div class="toast-bg">
        <div class="toast-wrapper">
          <div class="toast" v-html="showText"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
  props: {
    text: [String, Number],
    timeout: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      visible: false,
      showText: ""
    };
  },
  methods: {
    hide() {
      this.visible = false;
    },

    //显示1.5秒后消失
    show() {
      this.updateText(this.text);
      clearTimeout(this.task);
      this.task = null;
      this.visible = true;
      this.task = setTimeout(() => {
        this.visible = false;
      }, this.timeout);
    },

    //一直显示
    continueShow(text) {
      if (text) {
        this.updateText(text);
      }
      clearTimeout(this.task);
      this.task = null;
      this.visible = true;
    },

    updateText(text) {
      this.showText = text;
    },

    //显示1.5秒后消失，需要传入text
    showToast(text) {
      this.updateText(text);
      clearTimeout(this.task);
      this.task = null;
      this.visible = true;
      this.task = setTimeout(() => {
        this.visible = false;
      }, this.timeout);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.toast-bg-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: transparent;
  .toast-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 0 0 -50%;
    z-index: 999;
    width: 100%;
    @include center;
    .toast-wrapper {
      width: 60%;
      line-height: 20px;
      padding: 10px 20px;
      box-sizing: border-box;
      background: #ccc;
      border-radius: 10px;
      font-size: 14px;
      color: white;
      .toast {
        text-align: center;
        word-break: break-all;
      }
    }
  }
}
</style>
