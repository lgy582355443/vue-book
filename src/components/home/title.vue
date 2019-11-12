<template>
  <div class="home-title-wrapper">
    <div class="label">{{label}}</div>
    <div class="btn" :class="{'touch': ifOnTouch}" @touchstart="onTouchStart" @touchend="onTouchEnd" @mousedown="onTouchStart" @mouseup="onTouchEnd" @click="click">{{btn}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      label: String,
      btn: String
    },
    data() {
      return {
        ifOnTouch: false
      }
    },
    methods: {
      onTouchStart() {
        this.ifOnTouch = true
      },
      onTouchEnd() {
        this.ifOnTouch = false
      },
      click() {
        this.$emit('onClick')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .home-title-wrapper {
    width: 100%;
    padding: px2rem(15) px2rem(10);
    box-sizing: border-box;
    @include top;
    .label {
      flex: 1;
      font-size: px2rem(18);
      color: #333;
      font-weight: bold;
    }
    .btn {
      font-size: px2rem(14);
      color: rgba(64, 158, 255, 1);
      &.touch {
        color: rgba(64, 158, 255, .5);
      }
    }
  }
</style>
