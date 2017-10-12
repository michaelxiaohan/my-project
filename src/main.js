// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './vuex/store'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.use(ElementUI)
Vue.use(Vuex)
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   render: h => h(App),
//   components: { App }
// })
router.beforeEach((to, from, next) => {
    if(store.state.authKey || store.state.sessionId){
        next()
    }else{
      if(to.path=='/login'){
        next()
      }else{
        next('login')
      }
    }


})
new Vue({
  store:store,
  router,
  render: h => h(App)
}).$mount('#app')
