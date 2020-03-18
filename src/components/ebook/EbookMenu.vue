<template>
  <div class="ebook-menu">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': settingVisible >= 0 || !menuVisible}"
           v-show="menuVisible">
        <div class="icon-wrapper" :class="{'selected': settingVisible === 3}">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper" :class="{'selected': settingVisible === 2}">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper" :class="{'selected': settingVisible === 1}">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper" :class="{'selected': settingVisible === 0}">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
     <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
    <!--<ebook-speaking-icon></ebook-speaking-icon> -->
  </div>
</template>

<script>
  import EbookSettingFont from './EbookSettingFont'
  import EbookSettingFontPopup from './EbookSettingFontPopup'
  import EbookSettingTheme from './EbookSettingTheme'
  import EbookSettingProgress from './EbookSettingProgress'
  // import EbookSpeakingIcon from './EbookSpeakingIcon'

  import EbookSlide from './EbookSlide'
  import { ebookMixin } from '@/mixins/ebook'

  export default {
    mixins: [ebookMixin],
    components: {
      EbookSettingFontPopup,
      EbookSlide,
      EbookSettingProgress,
      EbookSettingFont,
      EbookSettingTheme,
      // EbookSpeakingIcon
    }
  }
</script>

<style lang="scss" scoped>
.ebook-menu{
  height: auto;
  overflow: hidden;
}
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: 50px;
    font-size: 20px;
    background-color: #ffffff;
    box-shadow: 0 -8px 8px rgba(0, 0, 0, .15);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
    }
  }
</style>