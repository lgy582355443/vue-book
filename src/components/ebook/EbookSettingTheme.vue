<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div
          class="setting-theme-item"
          v-for="(item, index) in themeList"
          :key="index"
          @click="setTheme(item.name)"
        >
          <div
            class="preview"
            :class="{'selected': item.name === defaultTheme}"
            :style="{background: item.style.body.background}"
          ></div>
          <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "@/mixins/ebook";
import { saveTheme, getTheme } from "../../utils/localStorage";

export default {
  name: "EbookSettingTheme",
  mixins: [ebookMixin],
  methods: {}
};
</script>

<style lang="scss" scoped>

.setting-wrapper {
  position: absolute;
  bottom: 48px;
  left: 0;
  z-index: 190;
  width: 100%;
  height: 90px;
  box-shadow: 0 -8px 8px rgba(0, 0, 0, 0.15);
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 5px;
      box-sizing: border-box;
      .preview {
        flex: 1;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border: none;
        &.selected {
          box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
          border: 2px solid #5e6369;
        }
      }
      .text {
        flex: 0 0 20px;
        font-size: 14px;
        @include center;
      }
    }
  }
}
</style>
