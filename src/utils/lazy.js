import Vue from 'vue'
import lazyload from 'vue-lazyload'

Vue.use(lazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/bookicon.png'),
  loading: require('@/assets/images/loading4.gif'),
  attempt: 1 
})
