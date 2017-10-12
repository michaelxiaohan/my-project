import Vue from 'vue'
import Router from 'vue-router'
// import Home from '../components/common/Home.vue'
// const _import=file => require('@/components/' + file + '.vue')
import routeMeta from './route-meta/index'
Vue.use(Router)
export default new Router({
  routes:routeMeta
})
