import Vue from 'vue'
import VueRouter from 'vue-router'
// import ebook from '../views/ebook/index.vue'

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
    meta: {
      footShow: false
    },
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
    component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue'),
    meta: {
      footShow: true
    },
  },
  {
    path: '/list',
    name: 'bookList',
    component: () => import(/* webpackChunkName: "bookList" */ '../views/home/bookList.vue'),
    meta: {
      footShow: true
    },
  },
  {
    path: '/shelf',
    name: 'shelf',
    component: () => import(/* webpackChunkName: "shelf" */ '../views/shelf/index.vue'),
    meta: {
      footShow: false
    },
  },
  {
    path: '/shelf/category',
    name: 'ShelfCategory',
    component: () => import(/* webpackChunkName: "ShelfCategory" */ '../views/shelf/ShelfCategory.vue'),
    meta: {
      footShow: false
    },
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */ '../views/detail/index.vue'),
    meta: {
      footShow: false
    }
  },
  {
    path: '/speaking',
    name: 'speaking',
    component: () => import(/* webpackChunkName: "speaking" */ '../views/speaking/index.vue'),
    meta: {
      footShow: false
    }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import(/* webpackChunkName: "speaking" */ '../views/my/index.vue'),
    meta: {
      footShow: true
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
