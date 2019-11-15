<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="`backgroundImage:url(${banner})`"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend"></recommend>
      <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book class="category-book" :data="item"></category-book>
      </div>
      <category class="category" :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
import guessYouLike from "../../components/home/guessYouLike";
import recommend from "../../components/home/recommend";
import featured from "../../components/home/featured";
import categoryBook from "../../components/home/categoryBook";
import category from "../../components/home/category";
import SearchBar from "../../components/home/SearchBar";
import flapCard from "../../components/home/flapCard";
import Scroll from "../../components/common/Scroll";
import { StoreHomeMixin } from "../../utils/mixin";
import { homeApi } from "@/api/home";
export default {
  name: "StoreHome",
  mixins: [StoreHomeMixin],
  components: {
    SearchBar,
    Scroll,
    flapCard,
    guessYouLike,
    recommend,
    featured,
    categoryBook,
    category
  },
  props: {},
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    };
  },
  watch: {},
  computed: {},
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94;
      }
      this.$refs.scroll.refresh();
    }
  },
  created() {},
  mounted() {
    homeApi().then(res => {
      if (res && res.status == 200) {
        console.log(res);
        const data = res.data;
        const randomIndex = Math.floor(Math.random() * data.random.length);
        this.random = data.random[randomIndex];
        this.banner = data.banner;
        this.guessYouLike = data.guessYouLike;
        this.recommend = data.recommend;
        this.featured = data.featured;
        this.categoryList = data.categoryList;
        this.categories = data.categories;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: 140px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .category-book {
    margin-top: 20px;
  }
  .category {
    margin-top: 20px;
  }
}
</style>