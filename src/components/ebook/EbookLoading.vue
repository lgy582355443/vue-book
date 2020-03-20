<template>
  <div class="ebook-loading-main">
    <div class="ebook-loading-wrapper">
      <div :class="`ebook-loading-item item${index}`" v-for="(item, index) in data" :key="index">
        <div
          class="ebook-loading-line"
          ref="line"
          v-for="(subItem, subIndex) in item"
          :key="subIndex"
          :style="`animation-delay:${(subIndex+1)*0.4}s`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"EbookLoading",
  data() {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}]
      ]
      // maskWidth: [
      //   { value: 0 },
      //   { value: 0 },
      //   { value: 0 },
      //   { value: 0 },
      //   { value: 0 },
      //   { value: 0 }
      // ],
      // lineWidth: [
      //   { value: 16 },
      //   { value: 16 },
      //   { value: 16 },
      //   { value: 16 },
      //   { value: 16 },
      //   { value: 16 }
      // ],
      // add: true,
      // end: false,
      // task: null
    };
  },
  methods: {},
  mounted() {
    // this.task = setInterval(() => {
    //   this.$refs.mask.forEach((item, index) => {
    //     const mask = this.$refs.mask[index];
    //     const line = this.$refs.line[index];
    //     let maskWidth = this.maskWidth[index];
    //     let lineWidth = this.lineWidth[index];
    //     if (index === 0) {
    //       if (this.add && maskWidth.value < 16) {
    //         maskWidth.value++;
    //         lineWidth.value--;
    //       } else if (!this.add && lineWidth.value < 16) {
    //         maskWidth.value--;
    //         lineWidth.value++;
    //       }
    //     } else {
    //       if (this.add && maskWidth.value < 16) {
    //         let preMaskWidth = this.maskWidth[index - 1];
    //         if (preMaskWidth.value >= 8) {
    //           maskWidth.value++;
    //           lineWidth.value--;
    //         }
    //       } else if (!this.add && lineWidth.value < 16) {
    //         let preLineWidth = this.lineWidth[index - 1];
    //         if (preLineWidth.value >= 8) {
    //           maskWidth.value--;
    //           lineWidth.value++;
    //         }
    //       }
    //     }
    //     mask.style.width = `${maskWidth.value}px`;
    //     mask.style.flex = `0 0 ${maskWidth.value}px`;
    //     line.style.width = `${lineWidth.value}px`;
    //     line.style.flex = `0 0 ${lineWidth.value}px`;
    //     if (index === this.maskWidth.length - 1) {
    //       if (this.add) {
    //         if (maskWidth.value === 16) {
    //           this.end = true;
    //         }
    //       } else {
    //         if (maskWidth.value === 0) {
    //           this.end = true;
    //         }
    //       }
    //     }
    //     if (this.end) {
    //       this.add = !this.add;
    //       this.end = false;
    //     }
    //   });
    // }, 20);
  }
  // beforeDestroy() {
  //   if (this.task) {
  //     clearInterval(this.task);
  //   }
  // }
};
</script>

<style lang="scss" scoped>

.ebook-loading-main {
  position: relative;
  z-index: 500;
  width: 100px;
  height: 70px;
  background: transparent;
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1;
      padding: 7px 4px;
      box-sizing: border-box;
      border: 1.5px solid #ffffff;
      &.item0 {
        border-radius: 5px 7px 7px 5px;
      }
      &.item1 {
        border-radius: 7px 5px 5px 7px;
      }
      .ebook-loading-line {
        width: 100%;
        height: 2px;
        background: #d7d7d7;
        transform-origin: left center;
        transform: scaleX(.2);
        animation: loading-line 1.5s linear infinite alternate;
      }
    }
  }
}
@keyframes loading-line {
  0% {
    transform: scaleX(.2);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
