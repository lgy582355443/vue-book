<template>
  <div class="ebook-main">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookTitle from "@/components/ebook/EbookTitle";
import EbookMenu from "@/components/ebook/EbookMenu";
import EbookReader from "../../components/ebook/EbookReader";
import { ebookMixin } from "@/utils/mixin";
import { getReadTime,saveReadTime } from "../../utils/localStorage";

export default {
  name: "Ebook",
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
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
  }
};
</script>
<style lang="scss" scoped>
</style>