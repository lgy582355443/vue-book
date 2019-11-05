<template>
  <div class="ebook-bookmark-icon" :style="style" ref="bookmark"></div>
</template>

<script>
export default {
  props: {
    width: Number,
    height: Number,
    color: String
  },
  computed: {
    style() {
      if (this.color) {
        return {
          borderColor: `${this.color} ${this.color} transparent ${this.color}`
        };
      } else {
        return {};
      }
    }
  },
  methods: {
    refresh() {
      if (this.height && this.width && this.width > 0 && this.height > 10) {
        this.$refs.bookmark.style.borderWidth = `${this.height - 5}px ${this
          .width / 2}px ${5}px ${this.width / 2}px`;
      }
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.ebook-bookmark-icon {
  width: 0;
  height: 0;
  font-weight: bold;
  line-height: 0;
  border-width: 50px 10px 10px 10px;
  border-style: solid;
  border-color: white white transparent white;
}
</style>
