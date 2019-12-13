<template>
  <div class="ebook-main">
    <div class="ebook" ref="ebook">
      <ebook-header></ebook-header>
      <ebook-bookmark></ebook-bookmark>
      <ebook-title></ebook-title>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
      <ebook-footer></ebook-footer>
    </div>
  </div>
</template>

<script>
import EbookFooter from "@/components/ebook/EbookFooter";
import EbookHeader from "@/components/ebook/EbookHeader";
import EbookBookmark from "@/components/ebook/EbookBookmark";
import EbookTitle from "@/components/ebook/EbookTitle";
import EbookMenu from "@/components/ebook/EbookMenu";
import EbookReader from "../../components/ebook/EbookReader";
import { ebookMixin } from "../../mixins/ebook";
import { getReadTime, saveReadTime } from "../../utils/localStorage";

export default {
  name: "Ebook",
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  props: {},
  data() {
    return {};
  },
  watch: {
    offsetY(v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v);
        } else if (v == 0) {
          this.restore();
        }
      }
    }
  },
  computed: {},
  methods: {
    //下拉
    move(v) {
      this.$refs.ebook.style.top = v + "px";
    },

    //下拉后还原
    restore() {
      this.$refs.ebook.style.top = "0px";
      this.$refs.ebook.style.transition = "all .2s";
      setTimeout(() => {
        this.$refs.ebook.style.transition = "";
      }, 200);
    },

    //把阅读时间存入localStorage
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0;
      }
      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 == 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    }
  },
  created() {},
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.hideMenuVisible();
    this.setBookAvailable(false);
    next();
  }
};
</script>
<style lang="scss" scoped>
.ebook-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(97, 96, 96);
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
  }
}
</style>