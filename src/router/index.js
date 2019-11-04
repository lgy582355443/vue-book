import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ebook from '../views/ebook/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    name: 'ebook',
    component: () => import(/* webpackChunkName: "ebook" */ '../views/ebook/index.vue'),
    children:[
      {
        path:":fileName",
        name:'Reader',
        component: () => import(/* webpackChunkName: "EbookReader" */ '../components/ebook/EbookReader.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
