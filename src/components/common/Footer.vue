<template>
  <div class="footer-main">
    <div class="footer">
      <router-link class="footer-icon home" :to="{ name: 'home' }" tag="div">
        <div class="title-icon-wrapper">
          <span class="icon-home icon"></span>
        </div>
        <p class="footer-title">{{ $t("home.home") }}</p>
      </router-link>
      <router-link class="footer-icon shelf" :to="{ name: 'classify' }" tag="div">
        <div class="title-icon-wrapper">
          <span class="icon-menu icon"></span>
        </div>
        <p class="footer-title">{{ $t("home.classify") }}</p>
      </router-link>
      <router-link class="footer-icon shelf" :to="{ name: 'shelf' }" tag="div">
        <div class="title-icon-wrapper">
          <span class="icon-shelf icon"></span>
        </div>
        <p class="footer-title">{{ $t("shelf.title") }}</p>
      </router-link>
      <router-link class="footer-icon my" :to="{ name: 'my' }" tag="div">
        <div class="title-icon-wrapper">
          <span class="icon-my icon"></span>
        </div>
        <p class="footer-title">{{ $t("my.my") }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.footer-main {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  z-index: 200;
  box-shadow: 0 0px 5px #cccc;
  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .footer-icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      .title-icon-wrapper {
        font-size: 18px;
        color: rgb(144, 144, 144);
      }
      .footer-title {
        margin-top: 5px;
        color: rgb(144, 144, 144);
      }
      &.router-link-active .footer-title {
        color: rgb(72, 153, 219);
      }
      &.router-link-active .title-icon-wrapper {
        color: rgb(72, 153, 219);
      }
    }
  }
}
</style>
