<template>
  <div class="shelf-item-add" @click="goHome">
    <span class="icon-add"></span>
  </div>
</template>

<script>
export default {
  name: "ShelfItemAdd",
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    goHome() {
      this.$router.push({
        name: "home"
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.shelf-item-add {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
  @include center;
  .icon-add {
    font-size: 40px;
    color: #ccc;
  }
}
</style>