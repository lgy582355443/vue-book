<template>
  <div class="ebook-header">
    <span class="ebook-header-text">{{getSectionName}}</span>
  </div>
</template>

<script>
  import { ebookMixin } from '@/mixins/ebook'

  export default {
    name:"EbookHeader",
    mixins: [ebookMixin]
  }
</script>

<style lang="scss" scoped>

  .ebook-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 48px;
    padding: 0 15px;
    box-sizing: border-box;
    overflow: hidden;
    @include left;
    .ebook-header-text {
      font-size: 12px;
      color: #6d7178;
      text-align: left;
    }
  }
</style>
