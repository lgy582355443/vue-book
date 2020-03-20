<template>
  <div class="ebook-bookmark" ref="ebookBookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <!-- 书签icon -->
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed?fixedStyle:{}">
      <book-mark :color="color" ref="bookmark"></book-mark>
    </div>
  </div>
</template>

<script>
import { px2rem } from "@/utils/utils.js";
import BookMark from "@/components/common/Bookmark";
import { ebookMixin } from "@/mixins/ebook";
import { saveBookmark, getBookmark } from "../../utils/localStorage";

const BLUE = "#0e47c2";
const WHITE = "#fff";
export default {
  name: "EbookBookMark",
  mixins: [ebookMixin],
  components: {
    BookMark
  },
  data() {
    return {
      color: WHITE,
      text: "",
      isFixed: false
    };
  },
  computed: {
    //书签高
    height() {
      return 33;
    },
    //临界值
    threshold() {
      return 55;
    },
    fixedStyle() {
      return {
        position: "fixed",
        top: 0,
        right: 0
      };
    }
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return;
      }
      if (v > 0 && v < this.height) {
        this.beforeHeight();
      } else if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v);
      } else if (v >= this.threshold) {
        this.afterThreshold(v);
      } else if (v == 0) {
        this.restore();
      }
    },

    isBookmark(isBookmark) {
      this.isFixed = isBookmark;
      if (isBookmark) {
        this.color = BLUE;
      } else {
        this.color = WHITE;
      }
    }
  },
  created() {
    if (this.isBookmark) {
      this.text = this.$t("book.pulldownDeleteMark");
    } else {
      this.text = this.$t("book.pulldownAddMark");
    }
  },
  methods: {
    // 添加书签
    addBookmark() {
      this.bookmark = getBookmark(this.fileName);
      if (!this.bookmark) {
        this.bookmark = [];
      }
      //获取书籍当前页的cfi
      const currentLocation = this.currentBook.rendition.currentLocation();
      // console.log("currentLocation", currentLocation);
      const cfibase = currentLocation.start.cfi.replace(/!.*/, "");
      const cfistart = currentLocation.start.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfiend = currentLocation.end.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      //通过拼接cfistar和cfiend,得到一个范围cfirange,通过getRange方法获取当前页的文本内容;
      const cfirange = cfibase + "!," + cfistart + "," + cfiend + ")";
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, "");
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        });
        saveBookmark(this.fileName, this.bookmark);
      });
    },

    //删除书签
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfi = currentLocation.start.cfi;
      this.bookmark = getBookmark(this.fileName);
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi != cfi);
        saveBookmark(this.fileName, this.bookmark);
        this.setIsBookmark(false);
      }
    },

    //归位
    restore() {
      setTimeout(() => {
        this.$refs.ebookBookmark.style.top = `${-px2rem(this.height)}rem`;
        this.$refs.iconDown.style.transform = "rotate(0deg)";
      }, 200);
      if (this.isFixed) {
        this.setIsBookmark(true);
        this.addBookmark();
      } else {
        this.setIsBookmark(false);
        this.removeBookmark();
      }
    },

    beforeHeight() {
      // 第一阶段:未到达书签高度
      //判断当前页是否为书签,是=>书签icon进行fixed定位,颜色为蓝色
      if (this.isBookmark) {
        this.color = BLUE;
        this.text = this.$t("book.pulldownDeleteMark");
        this.isFixed = true;
      } else {
        this.color = WHITE;
        this.text = this.$t("book.pulldownAddMark");
        this.isFixed = false;
      }
    },

    beforeThreshold(v) {
      //第二阶段:吸顶，超过书签高度但没到更改书签的临界值
      //书签组件相对ebook在移动，形成静止视觉。
      this.$refs.ebookBookmark.style.top = `${-px2rem(v)}rem`;
      if (this.$refs.iconDown.style.transform == "rotate(180deg)") {
        this.$refs.iconDown.style.transform = "rotate(0deg)";
      }
      this.beforeHeight();
    },

    afterThreshold(v) {
      //第三阶段:箭头向上,书签icon变蓝，超过临界值
      this.$refs.ebookBookmark.style.top = `${-px2rem(v)}rem`;
      if (
        this.$refs.iconDown.style.transform == "" ||
        this.$refs.iconDown.style.transform == "rotate(0deg)"
      ) {
        this.$refs.iconDown.style.transform = "rotate(180deg)";
      }
      //判断当前页是否为书签
      if (this.isBookmark) {
        this.color = WHITE;
        this.text = this.$t("book.releaseDeleteMark");
        this.isFixed = false;
      } else {
        this.color = BLUE;
        this.text = this.$t("book.releaseAddMark");
        this.isFixed = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ebook-bookmark {
  position: absolute;
  top: -33px;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 33px;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: 45px;
    bottom: 0;
    display: flex;
    z-index: 101;
    .ebook-bookmark-down-wrapper {
      font-size: 14px;
      color: #ffffff;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: 14px;
      color: #ffffff;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 16px;
    z-index: 100;
  }
}
</style>
