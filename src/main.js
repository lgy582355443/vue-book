import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import { clearLocalStorage, getUserInfo } from './utils/localStorage'

import './assets/styles/icon.css'
import './assets/styles/reset.scss'
// import './assets/styles/global.scss'

// 初始化html font-size
import 'lib-flexible';
// import './mock/index';
import './utils/boost'
import './utils/create-api'
import './utils/lazy'



Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

//登录守卫
router.beforeEach(async (to, from, next) => {
  const UserInfo = getUserInfo();
  if (UserInfo && UserInfo.loginTime) {
    const nowDate = new Date().getTime();
    const oldDate = new Date(UserInfo.loginTime).getTime();
    //如果超过3天没有登录，重新登录
    if (nowDate - oldDate > 259200000) {
      clearLocalStorage();
      next({ path: "/login" })
    } else {
      next()
    }
  } else {
    if (!to.meta.isLogin) {
      next()
    } else {
      clearLocalStorage();
      next({ path: "/login" })
    }
  }
})