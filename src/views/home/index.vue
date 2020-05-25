<template>
  <div class="store-home">
    <search-bar @getRandom="getRandom"></search-bar>
    <flap-card :randomBook="randomBook"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll" :bottom="50">
      <div class="banner-wrapper">
        <swiper
          class="banner-swiper"
          :options="swiperOption"
          ref="mySwiper"
          v-if="bannerList.length>0"
        >
          <swiper-slide v-for="item in bannerList" :key="item.id">
            <div class="banner-img" :style="`backgroundImage:url(${item.url})`"></div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend"></recommend>
      <featured :data="featured" :titleText="$t('home.featured')" :btnText="null"></featured>
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book class="category-book" :data="item"></category-book>
      </div>
    </scroll>
  </div>
</template>

<script>
import guessYouLike from "../../components/home/guessYouLike";
import recommend from "../../components/home/recommend";
import featured from "../../components/home/featured";
import categoryBook from "../../components/home/categoryBook";
import SearchBar from "../../components/home/SearchBar";
import flapCard from "../../components/home/flapCard";
import Scroll from "../../components/common/Scroll";
import { StoreHomeMixin } from "../../mixins/home";
import { homeApi } from "@/api/home";

import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

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
    swiper,
    swiperSlide
  },
  props: {},
  data() {
    return {
      scrollTop: 94,
      random: null,
      bannerList: [],
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null,
      randomBook: null,
      swiperOption: {
        loop: true,
        autoplay: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      swiper: null
    };
  },
  watch: {},
  computed: {
    // swiper() {
    //   this.$nextTick(() => {
    //     return this.$refs.mySwiper.swiper;
    //   });
    // }
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      this.setHomeOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94;
      }
      this.$refs.scroll.refresh();
    },

    getRandom() {
      const randomIndex = Math.floor(Math.random() * this.random.length);
      this.randomBook = this.random[randomIndex];
    },

    //返回之前的滚动位置
    reset() {
      if (this.homeOffsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94;
      }
      this.$refs.scroll.refresh();
      this.$nextTick(() => {
        this.$refs.scroll.scrollTo(0, this.homeOffsetY);
      });
    }
  },
  created() {},
  mounted() {
    homeApi().then(response => {
      if (response && response.status === 200) {
        const data = response.data;
        console.log(data);
        this.random = data.random;
        this.bannerList = data.banner;
        this.guessYouLike = data.guessYouLike;
        this.recommend = data.recommend;
        this.featured = data.featured;
        this.categoryList = data.categoryList;
        this.$nextTick(() => {
          this.swiper = this.$refs.mySwiper.swiper;
        });
      }
    });
  },
  activated() {
    this.reset();
  },
  deactivated() {}
};
</script>
<style lang="scss" scoped>
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: 10px;
    height: 150px;
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: 130px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .category-book {
    margin: 20px 0;
  }
}
</style>