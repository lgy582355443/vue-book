<template>
  <transition name="slide-up">
    <div class="bottom-wrapper" v-if="showPlay">
      <div class="bottom-playing-wrapper" @click.stop.prevent="onPlayingCardClick">
        <div class="bottom-playing-left">
          <div class="icon-play-wrapper" @click.stop.prevent="togglePlay">
            <span class="icon-play_go" v-if="!isPlaying"></span>
            <span class="icon-play_pause" v-else></span>
          </div>
        </div>
        <div class="bottom-playing-right">
          <div class="bottom-playing-chapter-text">
            <span class="chapter-label">{{chapter ? chapter.label : ''}}</span>
            <span
              class="bottom-playing-page-text"
              v-if="currentSectionIndex && currentSectionTotal"
            >( {{currentSectionIndex}} / {{currentSectionTotal}} )</span>
          </div>
          <div
            class="bottom-playing-page-text"
          >{{playInfo ? playInfo.currentMinute : '00'}}:{{playInfo ? playInfo.currentSecond : '00'}} / {{playInfo ? playInfo.totalMinute : '00'}}:{{playInfo ? playInfo.totalSecond : '00'}}</div>
        </div>
      </div>
      <!-- <div class="bottom-btn-wrapper">
      <span class="bottom-btn-text" @click="goBick">{{$t('speak.goBackDetail')}}</span>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        <span
          class="bottom-btn-text"
        >{{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}</span>
      </div>
      </div>-->
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    chapter: Object,
    currentSectionIndex: Number,
    currentSectionTotal: Number,
    showPlay: Boolean,
    isPlaying: Boolean,
    playInfo: Object
  },
  data() {
    return {
      bookItem: null
    };
  },
  computed: {},
  methods: {
    togglePlay() {
      this.$parent.togglePlay();
    },
    onPlayingCardClick() {
      this.$emit("onPlayingCardClick");
    },
    goBick() {
      this.$router.push({
        path: "/detail",
        query: {
          fileName: this.$route.query.fileName
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.bottom-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 110;
  width: 100%;
  height: 64px;
  background: white;
  box-shadow: 0 -2px  -2px 2px  2px 0 rgba(0, 0, 0, 0.1);
  .bottom-playing-wrapper {
    display: flex;
    width: 100%;
    height: 64px;
    .bottom-playing-left {
      flex: 0 0 70px;
      width: 70px;
      @include center;
      .icon-play-wrapper {
        flex: 0 0 100px;
        @include center;
        &:active {
          opacity: 0.5;
        }
        .icon-play_go {
          font-size: 40px;
          color: $color-blue;
        }
        .icon-play_pause {
          font-size: 40px;
          color: $color-blue;
        }
      }
    }
    .bottom-playing-right {
      flex: 1;
      padding-right: 15px;
      box-sizing: border-box;
      @include columnLeft;
      .bottom-playing-chapter-text {
        max-width: 305px;
        color: #333;
        font-size: 16px;
        line-height: 19px;
        @include ellipsis;
      }
      .bottom-playing-page-text {
        color: #666;
        font-size: 10px;
        margin-top: 5px  5px;
      }
    }
  }
  .bottom-btn-wrapper {
    width: 100%;
    height: 52px;
    border-top: 1px  1px solid #eee;
    box-sizing: border-box;
    @include center;
    .bottom-btn-text {
      font-size: 14px;
      color: $color-blue;
      font-weight: bold;
    }
  }
}
</style>
