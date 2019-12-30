<template>
  <div class="guess-you-like">
    <title-view :label="$t('home.guessYouLike')" :btn="$t('home.change')" @onClick="change"></title-view>
    <div class="guess-you-like-list">
      <div
        class="guess-you-like-item"
        v-for="(item, index) in showData"
        :key="index"
        @click="showBookDetail(item)"
      >
        <div class="img-wrapper">
          <img class="img" v-lazy="item.cover" />
        </div>
        <div class="content-wrapper">
          <div class="title title-big" ref="title">{{item.title}}</div>
          <div class="author sub-title" ref="author">{{item.author}}</div>
          <div class="result third-title" ref="result">{{resultText(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from "@/components/home/title";
import { realPx } from "@/utils/utils";
import { StoreHomeMixin } from "@/mixins/home";

export default {
  mixins: [StoreHomeMixin],
  components: {
    TitleView
  },
  props: {
    data: Array
  },
  watch: {
    data(v) {
      this.total = v.length / 3;
    }
  },
  computed: {
    width() {
      return window.innerWidth - realPx(20) - realPx(60) + "px";
    },
    showData() {
      if (this.data) {
        return [
          this.data[this.index],
          this.data[this.index + this.total],
          this.data[this.index + this.total * 2]
        ];
      } else {
        return [];
      }
    }
  },
  data() {
    return {
      index: 0,
      total: 0
    };
  },
  methods: {
    change() {
      if (this.index + 1 >= this.total) {
        this.index = 0;
      } else {
        this.index++;
      }
    },
    resultText(item) {
      if (item && item.type && item.result) {
        switch (item.type) {
          case 1:
            return this.$t("home.sameAuthor").replace("$1", item.result);
          case 2:
            return this.$t("home.sameReader").replace("$1", item.result);
          case 3:
            return this.$t("home.readPercent")
              .replace("$1", item.percent)
              .replace("$2", item.result);
        }
      }
    },
    resize() {
      this.$nextTick(() => {
        this.$refs.title.forEach(item => {
          item.style.width = this.width;
        });
        this.$refs.author.forEach(item => {
          item.style.width = this.width;
        });
        this.$refs.result.forEach(item => {
          item.style.width = this.width;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.guess-you-like {
  .guess-you-like-list {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .guess-you-like-item {
      display: flex;
      margin-top: 15px;
      &:first-child {
        margin-top: 5px;
      }
      .img-wrapper {
        flex: 0 0 20%;
        padding: 10px 10px 10px 0;
        box-sizing: border-box;
        .img {
          width: 100%;
        }
      }
      .content-wrapper {
        flex: 1;
        padding: 10px 0;
        box-sizing: border-box;
        .author {
          margin-top: 15px;
        }
        .result {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
