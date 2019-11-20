<template>
  <div class="category">
    <title-view :label="$t('home.category')" :btn="$t('home.seeAll')" @onClick="showBookList"></title-view>
    <div class="category-list">
      <div
        class="category-item-wrapper"
        v-for="(item, index) in data"
        :key="index"
        @click="showBookCategory(item)"
      >
        <div class="category-item">
          <div class="content-wrapper">
            <div class="title title-medium">{{categoryText(item.category)}}</div>
            <div class="num sub-title-tiny">{{item.num + ' ' + $t('home.books')}}</div>
          </div>
          <div class="img-wrapper">
            <div class="img-group">
              <img class="img" v-lazy="item.img1"/>
              <img class="img2" v-lazy="item.img2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from "@/components/home/title";
import { categoryText, getCategoryName } from "@/utils/home";

export default {
  components: {
    TitleView
  },
  props: {
    data: Array
  },
  methods: {
    showBookCategory(item) {
      this.$router.push({
        path: "/home/list",
        query: {
          category: getCategoryName(item.category),
          categoryText: this.categoryText(item.category)
        }
      });
    },
    categoryText(category) {
      return categoryText(category, this);
    },
    showBookList() {
      this.$router.push("/home/list");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.category {
  .category-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    .category-item-wrapper {
      flex: 0 0 50%;
      width: 50%;
      padding: 0 5px 10px 5px;
      box-sizing: border-box;
      &:nth-child(odd) {
        padding-left: 10px;
      }
      &:nth-child(even) {
        padding-right: 10px;
      }
      .category-item {
        display: flex;
        width: 100%;
        background: #eee;
        .img-wrapper {
          flex: 0 0 50%;
          width: 50%;
          padding: 20px 10px;
          box-sizing: border-box;
          .img-group {
            position: relative;
            width: 100%;
            height: 60px;
            @include left;
            .img {
              position: absolute;
              left: 0;
              top: 0;
              z-index: 100;
              width: 45px;
              height: 60px;
            }
            .img2 {
              position: absolute;
              left: 30px;
              top: 7.5px;
              z-index: 99;
              width: 30px;
              height: 45px;
            }
          }
        }
        .content-wrapper {
          flex: 0 0 50%;
          width: 50%;
          @include columnCenter;
          .title {
            text-align: center;
          }
          .num {
            text-align: center;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
