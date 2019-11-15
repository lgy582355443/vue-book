<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @input="onProgressInput($event.target.value)"
            @change="onProgressChange($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            ref="progress"
          />
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span class="progress-text">({{bookAvailable ? progress + '%' : $t('book.loading')}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { saveProgress } from "../../utils/localStorage";

export default {
  mixins: [ebookMixin],
  data() {
    return {
      isProgressLoading: false
    };
  },
  computed: {},
  created() {},
  methods: {
    //上一章
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.isProgressLoading = true;
        this.setSection(this.section - 1).then(() => {
          this.displaySection();
          // this.displaySection(() => {
          //   this.updateProgressBg();
          //   this.isProgressLoading = false;
          // });
        });
      }
    },
    //下一章
    nextSection() {
      if (
        this.section < this.currentBook.spine.length - 1 &&
        this.bookAvailable
      ) {
        this.isProgressLoading = true;
        this.setSection(this.section + 1).then(() => {
          this.displaySection();
          // this.displaySection(() => {
          //   this.updateProgressBg();
          //   this.isProgressLoading = false;
          // });
        });
      }
    },

    //渲染当前章节的text内容
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section);
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href);
      }
    },

    // 拖动进度条时触发事件
    onProgressInput(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg();
        // this.displayProgress();
      });
    },

    //拖动结束后
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg();
        this.displayProgress();
      });
      // saveProgress(this.fileName, progress);
    },

    //渲染当前进度的text内容
    displayProgress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(
        this.progress / 100
      );
      this.display(cfi);
    },

    //进度条动态样式 (当前进度,总进度)
    updateProgressBg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    }
  },
  updated() {
    this.updateProgressBg();
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.setting-wrapper {
  position: absolute;
  bottom: 48px;
  left: 0;
  z-index: 190;
  width: 100%;
  height: 90px;
  background-color: #fff;
  box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.15);
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 40px;
      @include center;
      font-size: 12px;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 15px;
      box-sizing: border-box;
      .progress {
        flex: 1;
        width: 100%;
        -webkit-appearance: none;
        height: 2px;
        background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
        background-size: 0 100%;
        margin: 0 10px;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ceced0;
          box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.15);
          border: none;
        }
      }
      .progress-icon-wrapper {
        flex: 0 0 22px;
        font-size: 22px;
        @include center;
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: 5px;
      width: 100%;
      font-size: 12px;
      text-align: center;
      padding: 0 15px;
      box-sizing: border-box;
      @include center;
      .progress-section-text {
        line-height: 15px;
        @include ellipsis;
      }
    }
  }
}
</style>
