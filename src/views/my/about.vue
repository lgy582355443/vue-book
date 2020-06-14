<template>
  <div class="about-main">
    <title-view :showBack="true" :label="$t('my.about')"></title-view>
    <div class="desc">
      <p>github地址：</p>
      <p>
        <a
          href="https://github.com/lgy582355443/vue-book"
          target="_blank"
        >https://github.com/lgy582355443/vue-book</a>
      </p>
      <p>邮箱：582355443@qq.com</p>
      <p>WX/tell:18587865823</p>
    </div>
  </div>
</template>

<script>
import TitleView from "@/components/home/title";
export default {
  name: "About",
  components: {
    TitleView
  },
};
</script>
<style lang="scss" scoped>
.about-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::v-deep .label {
    flex: 0 0 60%;
  }
  .desc {
    box-sizing: border-box;
    padding: 10px;
    font-size: 18px;
    p {
      margin: 10px 0;
    }
  }
}
</style>