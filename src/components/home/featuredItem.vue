<template>
  <div class="featured-item" @click="showBookDetail(data)">
    <div class="img-wrapper">
      <img class="img" v-lazy="data.cover" />
    </div>
    <div class="content-wrapper">
      <div class="title title-small" ref="title">{{data.title}}</div>
      <div class="author sub-title-tiny" ref="author">{{data.author}}</div>
      <div class="category third-title-tiny" ref="category">{{categoryText(data.category)}}</div>
    </div>
  </div>
</template>

<script>
import { StoreHomeMixin } from "@/mixins/home";
import { categoryText } from "@/utils/home";
export default {
  name: "FeaturedItem",
  mixins:[StoreHomeMixin],
  components: {},
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    categoryText(category) {
      return categoryText(category, this);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.featured-item {
  flex: 0 0 50%;
  width: 50%;
  padding: 5px 0;
  @include top;
  .img-wrapper {
    flex: 0 0 30%;
    width: 30%;
    .img {
      width: 100%;
    }
  }
  .content-wrapper {
    flex: 1;
    width: 117.5px;
    padding: 0 5px;
    box-sizing: border-box;
    .author {
      margin-top: 15px;
    }
    .category {
      margin-top: 5px;
    }
  }
}
</style>