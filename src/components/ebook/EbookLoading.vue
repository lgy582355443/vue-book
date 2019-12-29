<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [[{}, {}, {}], [{}, {}, {}]],
      maskWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 }
      ],
      lineWidth: [
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 }
      ],
      add: true,
      end: false,
      task: null
    };
  },
  methods: {},
  mounted() {
    this.task = setInterval(() => {
      this.$refs.mask.forEach((item, index) => {
        const mask = this.$refs.mask[index];
        const line = this.$refs.line[index];
        let maskWidth = this.maskWidth[index];
        let lineWidth = this.lineWidth[index];
        if (index === 0) {
          if (this.add && maskWidth.value < 16) {
            maskWidth.value++;
            lineWidth.value--;
          } else if (!this.add && lineWidth.value < 16) {
            maskWidth.value--;
            lineWidth.value++;
          }
        } else {
          if (this.add && maskWidth.value < 16) {
            let preMaskWidth = this.maskWidth[index - 1];
            if (preMaskWidth.value >= 8) {
              maskWidth.value++;
              lineWidth.value--;
            }
          } else if (!this.add && lineWidth.value < 16) {
            let preLineWidth = this.lineWidth[index - 1];
            if (preLineWidth.value >= 8) {
              maskWidth.value--;
              lineWidth.value++;
            }
          }
        }
        mask.style.width = `${maskWidth.value}px`;
        mask.style.flex = `0 0 ${maskWidth.value}px`;
        line.style.width = `${lineWidth.value}px`;
        line.style.flex = `0 0 ${lineWidth.value}px`;
        if (index === this.maskWidth.length - 1) {
          if (this.add) {
            if (maskWidth.value === 16) {
              this.end = true;
            }
          } else {
            if (maskWidth.value === 0) {
              this.end = true;
            }
          }
        }
        if (this.end) {
          this.add = !this.add;
          this.end = false;
        }
      });
    }, 20);
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.ebook-loading {
  position: relative;
  z-index: 500;
  width: 63px;
  height: 40px;
  background: transparent;
  border: 1.5px solid #d7d7d7;
  border-radius: 3px;
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 7px 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        padding: 0 7px;
        box-sizing: border-box;
        @include left;
        .ebook-loading-mask {
          flex: 0 0 0;
          width: 0;
          height: 1.5px;
        }
        .ebook-loading-line {
          flex: 0 0 16px;
          width: 16px;
          height: 2px;
          background: #d7d7d7;
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      top: 0;
      width: 1.5px;
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>
