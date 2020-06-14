<template>
  <div class="book-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll
      class="book-shelf-scrill-wrapper"
      ref="scroll"
      :bottom="50"
      @onScroll="onScroll"
    >
      <shelf-search @doSearch="getSearchVaule"></shelf-search>
      <shelf-list :data="bookList"></shelf-list>
    </scroll>
    22
  </div>
</template>

<script>
import ShelfTitle from "@/components/shelf/shelfTitle";
import Scroll from "@/components/common/Scroll";
import ShelfSearch from "@/components/shelf/shelfSearch";
import ShelfList from "@/components/shelf/shelfList";
import { getShelfApi } from "../../api/shelf";
import { saveBookShelf, getUserInfo } from "../../utils/localStorage";
import { flatBookList } from "../../utils/shelf";
// import ShelfMixin from "../../mixins/shelf";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "BookShelf",
  // mixins: [ShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
  },
  data() {
    return {
      scrollBottom: 0,
      searchValue: "",
    };
  },
  computed: {
    ...mapGetters(["shelfList", "offsetY", "shelfCategory", "currentType"]),
    allBookList() {
      return flatBookList(this.shelfList);
    },
    bookList() {
      if (this.searchValue === "") {
        return this.shelfList;
      } else {
        const list = this.allBookList.filter(
          (item) => item.title.indexOf(this.searchValue) > -1
        );
        return list;
      }
    },
  },
  methods: {
    ...mapActions([
      "setShelfList",
      "setOffsetY",
      "setShelfCategory",
      "setCurrentType",
    ]),
    //获取书架列表
    getShelfList(cb) {
      const user = getUserInfo();
      if (user && user !== {}) {
        getShelfApi({
          userId: user.id,
        }).then((res) => {
          if (res.status === 200 && res.data && res.data.shelfList) {
            console.log("shelfList", res.data.shelfList);
            saveBookShelf(res.data.shelfList);
            this.setShelfList(res.data.shelfList);
            if (cb) {
              cb();
            }
            return res.data.shelfList;
          }
        });
      } else {
        this.$router.push({
          name: "login",
        });
      }
    },
    getSearchVaule(searchValue) {
      this.searchValue = searchValue;
    },
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    },
  },
  created() {
    this.getShelfList();
    this.setShelfCategory([]);
    //1，为当前在书架页， 2 ，为当前在书架分组页
    this.setCurrentType(1);
  },
};
</script>
<style lang="scss" scoped>
.book-shelf {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .book-shelf-scrill-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
}
</style>
