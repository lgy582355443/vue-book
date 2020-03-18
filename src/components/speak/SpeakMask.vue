<template>
  <transition name="fade">
    <div class="book-speak-mask-wrapper" @click.stop.prevent="hide" v-show="visible">
      <transition name="popup-slide-up">
        <div
          class="book-speak-mask-card-wrapper"
          v-show="speakCardVisible"
          @click.stop.prevent="hide"
        >
          <div class="pulldown-icon-wrapper" @click="hide">
            <span class="icon-pull_down"></span>
          </div>
          <div class="card-title-wrapper">
            <div class="icon-speak-wrapper">
              <span class="icon-speak"></span>
            </div>
            <div class="speak-title-wrapper">
              <span class="speak-title">{{$t('speak.voice')}}</span>
            </div>
            <div class="read-fulltext-wrapper">
              <span class="read-fulltext">{{$t('speak.read')}}</span>
            </div>
          </div>
          <div class="card-section-title-wrapper">
            <div class="card-section-title-text">{{title}}</div>
            <div class="card-section-sub-title-text" v-if="currentSectionIndex">
              {{currentSectionIndex}} /
              {{currentSectionTotal}}
            </div>
          </div>
          <div class="setting-progress">
            <div class="progress-wrapper">
              <input
                class="progress"
                type="range"
                max="100"
                min="0"
                step="1"
                @change="onProgressChange($event.target.value)"
                @input="onProgressInput($event.target.value)"
                :value="progress"
                ref="progress"
              />
            </div>
            <div class="progress-text">
              <div class="progress-text-current">
                {{playInfo ? playInfo.currentMinute : '00'}}:{{playInfo ?
                playInfo.currentSecond : '00'}}
              </div>
              <div class="progress-text-left">
                -{{playInfo ? playInfo.leftMinute : '00'}}:{{playInfo ?
                playInfo.leftSecond : '00'}}
              </div>
            </div>
          </div>
          <div class="playing-wrapper">
            <div class="icon-settings-wrapper">
              <span class="icon-settings"></span>
              <div class="settings-text">{{$t('speak.settings')}}</div>
            </div>
            <span
              class="icon-play_backward"
              :class="{'not-use': currentSectionIndex <= 1}"
              @click.stop.prevent="prev"
            ></span>
            <div class="icon-play-wrapper" @click.stop.prevent="togglePlay">
              <span class="icon-play_go" v-if="!isPlaying"></span>
              <span class="icon-play_pause" v-else></span>
            </div>
            <span
              class="icon-play_forward"
              :class="{'not-use': currentSectionIndex >= currentSectionTotal}"
              @click.stop.prevent="next"
            ></span>
            <div class="icon-clock-wrapper">
              <span class="icon-clock"></span>
              <div class="clock-text">{{$t('speak.timing')}}</div>
            </div>
          </div>
          <div class="read-apply-wrapper">{{$t('speak.apply')}}</div>
          <div class="read-title-wrapper">
            <span class="line"></span>
            <div class="read-title-text">{{$t('speak.current')}}</div>
            <span class="line"></span>
          </div>
          <div class="book-wrapper" ref="bookWrapper">
            <div id="book-read"></div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { realPx } from "@/utils/utils";

export default {
  props: {
    title: String,
    book: Object,
    section: Object,
    currentSectionIndex: Number,
    currentSectionTotal: Number,
    isPlaying: Boolean,
    playInfo: Object
  },
  data() {
    return {
      visible: false,
      speakCardVisible: false,
      progress: 0,
      readHeight: 0
    };
  },
  methods: {
    //刷新进度条
    refreshProgress(p) {
      this.progress = p;
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    updateText(promise) {
      promise.then(() => {
        const currentPage = this.rendition.currentLocation();
        const cfibase = this.section.cfiBase;
        const cfistart = currentPage.start.cfi
          .replace(/.*!/, "")
          .replace(/\)/, "");
        const cfiend = currentPage.end.cfi.replace(/.*!/, "").replace(/\)/, "");
        this.book
          .getRange(`epubcfi(${cfibase}!,${cfistart},${cfiend})`)
          .then(range => {
            let text = range.toString();
            text = text.replace(/\s(2,)/g, "");
            text = text.replace(/\r/g, "");
            text = text.replace(/\n/g, "");
            text = text.replace(/\t/g, "");
            text = text.replace(/\f/g, "");
            this.$emit("updateText", text);
          });
      });
    },
    togglePlay() {
      this.$parent.togglePlay();
    },
    prev() {
      if (this.currentSectionIndex > 1) {
        this.updateText(this.rendition.prev());
        this.$emit("update:currentSectionIndex", this.currentSectionIndex - 1);
        this.$parent.resetPlay();
        setTimeout(() => {
          this.$parent.togglePlay();
        }, 500);
      }
    },
    next() {
      if (this.currentSectionIndex < this.currentSectionTotal) {
        this.updateText(this.rendition.next());
        this.$emit("update:currentSectionIndex", this.currentSectionIndex + 1);
        this.$parent.resetPlay();
        setTimeout(() => {
          this.$parent.togglePlay();
        }, 500);
      }
    },
    display() {
      if (!this.rendition) {
        this.rendition = this.book.renderTo("book-read", {
          width: window.innerWidth > 640 ? 640 : window.innerWidth,
          height: this.readHeight,
          method: "default"
        });
        this.displayed = this.rendition.display(this.section.href);
      } else {
        this.displayed = this.rendition.display(this.section.href);
      }
    },
    onProgressChange(progress) {},
    onProgressInput(progress) {
      this.progress = progress;
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    hide() {
      this.speakCardVisible = false;
      this.visible = false;
    },
    show() {
      this.visible = true;
      this.speakCardVisible = true;
      this.refresh();
      this.$nextTick(() => {
        this.display();
      });
    },
    refresh() {
      this.readHeight =
        window.innerHeight * 0.9 -
        realPx(40) -
        realPx(54) -
        realPx(46) -
        realPx(48) -
        realPx(60) -
        realPx(44);
      // console.log(this.readHeight)
      this.$refs.bookWrapper.style.height = this.readHeight + "px";
    }
  }
};
</script>
<style lang="scss" scoped>

  .book-speak-mask-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 120;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    .book-speak-mask-card-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 120;
      width: 100%;
      height: 90%;
      background: white;
      border-radius: 10px 10px 0 0;
      .pulldown-icon-wrapper {
        width: 100%;
        height: 40px;
        color: #ccc;
        font-size: 40px;
        @include center;
      }
      .card-title-wrapper {
        width: 100%;
        height: 54px;
        display: flex;
        padding: 0 15px;
        box-sizing: border-box;
        .icon-speak-wrapper {
          flex: 0 0 40px;
          @include left;
          .icon-speak {
            font-size: 24px;
            color: #999;
          }
        }
        .speak-title-wrapper {
          flex: 1;
          @include left;
          .speak-title {
            font-size: 16px;
            font-weight: bold;
            color: #666;
          }
        }
        .read-fulltext-wrapper {
          flex: 1;
          @include right;
          .read-fulltext {
            font-size: 12px;
            font-weight: bold;
            color: $color-blue;
            background: rgba(74, 171, 255, .2);
            padding:  5px 10px;
            box-sizing: border-box;
            border-radius: 20px;
          }
        }
      }
      .card-section-title-wrapper {
        width: 100%;
        height: 46px;
        padding: 0 15px;
        box-sizing: border-box;
        @include columnCenter;
        .card-section-title-text {
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }
        .card-section-sub-title-text {
          font-size: 12px;
          color: #666;
          margin-top:  5px;
        }
      }
      .setting-progress {
        width: 100%;
        height: 48px;
        @include columnTop;
        .progress-wrapper {
          flex: 1;
          width: 100%;
          @include center;
          padding: 0 30px;
          box-sizing: border-box;
          .progress {
            width: 100%;
            -webkit-appearance: none;
            height:  2px;
            background: -webkit-linear-gradient($color-blue, $color-blue) no-repeat, rgba(74, 171, 255, .2);
            background-size: 0 100%;
            &:focus {
              outline: none;
            }
            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: $color-blue;
              border: none;
              box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            }
          }
        }
        .progress-text {
          display: flex;
          width: 100%;
          padding: 0 30px;
          box-sizing: border-box;
          .progress-text-current {
            flex: 1;
            text-align: left;
            font-size: 10px;
            color: #666;
          }
          .progress-text-left {
            flex: 1;
            text-align: right;
            font-size: 10px;
            color: #666;
          }
        }
      }
      .playing-wrapper {
        width: 100%;
        height: 60px;
        @include center;
        .icon-settings-wrapper {
          flex: 1;
          @include columnCenter;
          .icon-settings {
            font-size: 18px;
            color: #666;
          }
          .settings-text {
            margin-top: 5px;
            font-size: 10px;
            color: #666;
          }
        }
        .icon-play_backward {
          font-size: 30px;
          color: $color-blue;
          &:active {
            opacity: .5;
          }
          &.not-use {
            color: $color-blue-transparent;
          }
        }
        .icon-play-wrapper {
          flex: 0 0 100px;
          @include center;
          &:active {
            opacity: .5;
          }
          .icon-play_go {
            font-size: 50px;
            color: $color-blue;
          }
          .icon-play_pause {
            font-size: 50px;
            color: $color-blue;
          }
        }
        .icon-play_forward {
          font-size: 30px;
          color: $color-blue;
          &:active {
            opacity: .5;
          }
          &.not-use {
            color: $color-blue-transparent;
          }
        }
        .icon-clock-wrapper {
          flex: 1;
          @include columnCenter;
          .icon-clock2 {
            font-size: 18px;
            color: #666;
          }
          .clock-text {
            margin-top: 5px;
            font-size: 10px;
            color: #666;
          }
        }
      }
      .read-apply-wrapper {
        width: 100%;
        height: 20px;
        font-size: 10px;
        color: $color-green;
        @include center;
      }
      .read-title-wrapper {
        width: 100%;
        height: 24px;
        box-sizing: border-box;
        @include center;
        .line {
          flex: 1;
          border-top: 1px solid #eee;
          height: 0;
        }
        .read-title-text {
          flex: 0 0 130px;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      }
      .book-wrapper {
        #read {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
