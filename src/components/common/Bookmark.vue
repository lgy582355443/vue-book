<template>
  <div class="ebook-bookmark-icon" :style="style" ref="bookmark"></div>
</template>

<script>
export default {
  props: {
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
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>

.ebook-bookmark-icon {
  width: 0;
  height: 0;
  font-weight: bold;
  line-height: 0;
  border-width: 25px 8px 8px 8px;
  border-style: solid;
  border-color: white white transparent white;
}
</style>
