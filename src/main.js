import Vue from 'vue'
import Vuex from 'vuex'
import store from './vuex/store'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './utils/catcherror.js'    //应用axios请求
Vue.config.productionTip = false;
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
