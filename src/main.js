import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import { clearLocalStorage, getUserInfo } from './utils/localStorage'

// 初始化html font-size
import 'lib-flexible';
import './assets/styles/icon.css'
import './assets/styles/reset.scss'
import './assets/styles/global.scss'

// import './mock/index';
import './utils/boost'
import './utils/create-api'
import './utils/lazy'



Vue.config.productionTip = false

var vue = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

//登录守卫
router.beforeEach(async (to, from, next) => {
  const UserInfo = getUserInfo();
  if (UserInfo && UserInfo !== {}) {
    next()
  } else {
    if (!to.meta.isLogin) {
      next()
    } else {
      clearLocalStorage();
      next({ path: "/login" })
    }
  }
})

export default vue