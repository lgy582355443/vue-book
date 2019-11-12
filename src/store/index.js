import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import home from './modules/home'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book,
    home
  },
  getters,
  actions
})
