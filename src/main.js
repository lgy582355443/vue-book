import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import { getToken } from './utils/login'

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
  const hasToken = getToken();
  if (hasToken) {
    next()
  } else {
    if (!to.meta.isLogin) {
      next()
    } else {
      next({ path: "/login" })
    }
  }
})