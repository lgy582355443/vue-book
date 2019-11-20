import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import './assets/styles/icon.css'
import './assets/styles/reset.scss'
// import './assets/styles/global.scss'
import './assets/fonts/fonts.css'
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
