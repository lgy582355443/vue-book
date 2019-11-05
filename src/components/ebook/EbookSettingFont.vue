<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <div class="setting-font-size">
        <div class="preview left" ref="left">
          <span ref="leftText">A</span>
        </div>
        <div class="select">
          <div
            class="select-wrapper"
            v-for="(item, index) in fontSizeList"
            :key="index"
            @click.stop="setFontSize(item.fontSize)"
            ref="item"
          >
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="preview right" ref="right">
          <span ref="rightText">A</span>
        </div>
      </div>
      <div class="setting-font-family" @click.stop="showFontFamilySetting">
        <div class="setting-font-family-text-wrapper">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
import { getFontSize, saveFontSize } from "../../utils/localStorage";

export default {
  mixins: [ebookMixin],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
  position: absolute;
  bottom: 48px;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80px;
  box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.15);
  background-color: rgb(255, 255, 255);
  z-index: 190;
  .setting-font-size {
    flex: 2;
    display: flex;
    height: 100%;
    .preview {
      flex: 0 0 40px;
      @include center;
      &.left {
        font-size: 16px;
      }
      &.right {
        font-size: 36px;
      }
    }
    .select {
      display: flex;
      flex: 1;
      .select-wrapper {
        flex: 1;
        @include center;
        &:first-child {
          .line {
            &:first-child {
              border-top: none;
            }
          }
        }
        &:last-child {
          .line {
            &:last-child {
              border-top: none;
            }
          }
        }
        .line {
          flex: 1;
          height: 0;
          border-top: 1px solid #ccc;
        }
        .point-wrapper {
          position: relative;
          flex: 0 0 0;
          width: 0;
          height: 10px;
          border-left: 1px solid #ccc;
          .point {
            position: absolute;
            top: -5px;
            left: -11px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #ccc;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
            @include center;
            .small-point {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: black;
            }
          }
        }
      }
    }
  }
  .setting-font-family {
    flex: 1;
    font-size: 14px;
    height: 80px;
    @include center;
    .setting-font-family-text-wrapper {
      @include center;
    }
    .setting-font-family-icon-wrapper {
      @include center;
    }
  }
}
</style>
