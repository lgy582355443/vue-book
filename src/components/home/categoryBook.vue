<template>
  <div class="category-book">
    <title-view :label="categoryText(data.category)" :btn="$t('home.seeAll')" @onClick="showBookCategory"></title-view>
    <div class="category-book-list">
      <div class="category-book-item" v-for="(item, index) in data.list" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" :src="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-small" ref="title">{{item.title}}</div>
          <div class="num sub-title-tiny" ref="author">{{item.author}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TitleView from '@/components/home/title'
  import { categoryText, getCategoryName } from '@/utils/home'
  import { StoreHomeMixin } from '../../utils/mixin'

  export default {
    mixins: [StoreHomeMixin],
    components: {
      TitleView
    },
    props: {
      data: Object
    },
    methods: {
      showBookCategory() {
        this.$router.push({
          path: '/home/list',
          query: {
            category: getCategoryName(this.data.category),
            categoryText: this.categoryText(this.data.category)
          }
        })
      },
      categoryText(category) {
        return categoryText(category, this)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .category-book {
    .category-book-list {
      width: 100%;
      @include top;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .category-book-item {
        flex: 0 0 25%;
        width: 25%;
        padding: 0 px2rem(5);
        box-sizing: border-box;
        .img-wrapper {
          @include center;
          .img {
            width: 100%;
          }
        }
        .content-wrapper {
          width: 100%;
          margin-top: px2rem(10);
          .num {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
