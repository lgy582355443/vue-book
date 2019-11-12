import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ebook from '../views/ebook/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/ebook',
    name: 'ebook',
    component: () => import(/* webpackChunkName: "ebook" */ '../views/ebook/index.vue'),
    children: [
      {
        path: ":fileName",
        name: 'Reader',
        component: () => import(/* webpackChunkName: "EbookReader" */ '../components/ebook/EbookReader.vue'),
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/storeHome',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue'),
    children: [
      {
        path: 'storeHome',
        name: 'storeHome',
        component: () => import(/* webpackChunkName: "storeHome" */ '../views/home/storeHome.vue'),
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "bookList" */ '../views/home/bookList.vue'),
      },
      {
        path: 'detail',
        component: () => import(/* webpackChunkName: "bookDetail" */ '../views/home/bookDetail.vue'),
      },
      {
        path: 'shelf',
        component: () => import(/* webpackChunkName: "bookShelf" */ '../views/home/bookShelf.vue'),
      },
      {
        path: 'category',
        component: () => import(/* webpackChunkName: "bookCategory" */ '../views/home/bookCategory.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
