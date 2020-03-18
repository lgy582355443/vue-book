<template>
  <div class="scroll-wapper" ref="scrollWrapper">
    <div class="scroll-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
export default {
  name: "BetterScroll",
  props: {
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scrollTop: 0
    };
  },
  watch: {},
  methods: {
    scrollTo(x, y) {
      this.$scroll.scrollTo(x, y);
    },
    refresh() {
      this.$scroll.refresh();
    },
    onScroll(pos) {
      this.scrollTop = pos.y;
      this.$emit("onScroll", this.scrollTop);
    },
    initHeight() {
      this.$refs.scrollWrapper.style.height = `calc(100% - ${this.top}px - ${this.bottom}px);`;
      this.$scroll.refresh();
    }
  },

  mounted() {
    // this.initHeight();
    this.$nextTick(() => {
      this.$scroll = new BScroll(this.$refs.scrollWrapper, {
        click: true,
        probeType: 2
      });
      this.$scroll.on("scroll", this.onScroll);
    });
  }
};
</script>
<style lang='scss' scoped>
.scroll-wapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
