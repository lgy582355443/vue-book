<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive include="StoreHome">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <footers v-if="$route.meta.footShow"></footers>
    <shelf-footer v-if="$route.name=='shelf'||'ShelfCategory'"></shelf-footer>
  </div>
</template>
<script>
import shelfFooter from "./components/shelf/shelfFooter";
import footers from "./components/common/Footer";
export default {
  components: {
    footers,
    shelfFooter
  },
  data() {
    return {
      transitionName: ""
    };
  },
  watch: {
    $route(to, from) {
      const tabPath = ["/home", "/shelf", "/my"];
      //从tab来而且到tab去 不要走slide动画
      if (
        tabPath.some(item => item == to.path) &&
        tabPath.some(item => item == from.path)
      ) {
        this.transitionName = "fade2";
      } else {
        // console.log('to.path',to.path)
        // 比如:  #/news/123  ==> #/news  退出
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        this.transitionName =
          toDepth < fromDepth ? "slide-right2" : "slide-left2";
      }
    }
  }
};
// document.addEventListener("DOMContentLoaded", () => {
//   const html = document.querySelector("html");
//   let fontSize = window.innerHeight / 10;
//   fontSize = fontSize > 50 ? 50 : fontSize;
//   html.style.fontSize = fontSize + "px";
// });
</script>
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade2-enter-active {
  animation: fade 0.4s;
}
// 从左到右
.slide-right2-enter-active {
  animation: slideRight 0.4s;
}

.slide-left2-enter-active {
  animation: slideLeft 0.4s;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slideLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slideRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
