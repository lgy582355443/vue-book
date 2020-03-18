<template>
  <div class="home-title-wrapper">
    <div v-if="showBack" class="title-icon-back-wrapper" @click="back">
      <span class="icon-back icon"></span>
    </div>
    <div class="label">{{label}}</div>
    <div
      class="title-btn"
      v-if="btn"
      :class="{'touch': ifOnTouch}"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @mousedown="onTouchStart"
      @mouseup="onTouchEnd"
      @click="click"
    >{{btn}}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    btn: {
      type: String,
      default: null
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ifOnTouch: false
    };
  },
  methods: {
    onTouchStart() {
      this.ifOnTouch = true;
    },
    onTouchEnd() {
      this.ifOnTouch = false;
    },
    click() {
      this.$emit("onClick");
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.home-title-wrapper {
  width: 100%;
  padding: 15px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-icon-back-wrapper {
    font-size: 16px;
  }
  .label {
    font-size: 18px;
    color: #333;
    font-weight: bold;
  }
  .title-btn {
    font-size: 14px;
    color: rgba(64, 158, 255, 1);
    &.touch {
      color: rgba(64, 158, 255, 0.5);
    }
  }
}
</style>
