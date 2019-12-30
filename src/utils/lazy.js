import Vue from 'vue'
import lazyload from 'vue-lazyload'

Vue.use(lazyload, {
  preLoad: 1,
  error: require('@/assets/images/bookicon.png'),
  loading: require('@/assets/images/bookicon.png'),
  attempt: 1
})
