<template>
  <div class="ebook-footer">
    <!--<span class="ebook-footer-text">{{this.paginate}}</span>-->
    <span class="ebook-footer-text">{{this.progress + '%'}}</span>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin]
  }
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

  .ebook-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 48px;
    padding: 0 15px;
    box-sizing: border-box;
    @include right;
    .ebook-footer-text {
      font-size: 12px;
      color: #6d7178;
    }
  }
</style>
