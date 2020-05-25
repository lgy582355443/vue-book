<template>
  <div class="book-list-wrapper" ref="searchBox">
    <search-title
      :title="title"
      :showShelf="true"
      @back="back"
      ref="title"
    ></search-title>
    <scroll
      class="book-list-scroll-wrapper"
      :top="42"
      @onScroll="onScroll"
      ref="scroll"
    >
      <featured
        :data="value"
        :titleText="getCategoryText(key)"
        :btnText="''"
        v-for="(value, key, index) in list"
        :key="index"
      ></featured>
    </scroll>
  </div>
</template>

<script>
import SearchTitle from "@/components/detail/detaiTitle";
import Scroll from "@/components/common/Scroll";
import Featured from "@/components/home/featured";
import { realPx } from "@/utils/utils";
import { listApi, searchBookApi, flatListApi } from "@/api/bookList";
import { categoryList, categoryText } from "@/utils/home";
import { StoreHomeMixin } from "@/mixins/home";
export default {
  name: "BookList",
  components: {
    SearchTitle,
    Scroll,
    Featured
  },
  mixins: [StoreHomeMixin],
  computed: {
    title() {
      if (JSON.stringify(this.list) !== "{}") {
        return this.$t("home.allBook").replace("$1", this.total);
      } else {
        return null;
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      titleText: ""
    };
  },
  methods: {
    getCategoryText(key) {
      return categoryText(categoryList[key], this);
    },
    back() {
      this.$router.go(-1);
    },
    onScroll(offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow();
      } else {
        this.$refs.title.hideShadow();
      }
    },
    getBookList() {
      this.continueShow("请稍等...")
      const category = this.$route.query.category;
      const keyword = this.$route.query.keyword;
      if (category) {
        listApi({ categoryName: category }).then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.toastHide();
        });
      } else if (keyword) {
        searchBookApi({ searchText: keyword }).then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.toastHide();
        });
      } else {
        flatListApi().then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.toastHide();
        });
      }
    }
  },
  created() {
    this.getBookList();
  }
};
</script>

<style lang="scss" scoped>
.book-list-wrapper {
  width: 100%;
  height: 100%;
  background: white;
  overflow: hidden;
}
</style>
