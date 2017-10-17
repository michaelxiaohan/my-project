import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getter'
import tabs from './modules/tabs' //tabs模块
import userlogin from './modules/userlogin' //登陆模块
Vue.use(Vuex)
const store = new Vuex.Store({
  modules:{
    tabs,
    userlogin
  },
  getters,
})
export default store;
