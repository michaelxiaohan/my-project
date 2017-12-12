/*
错误捕捉
*/
import Vue from 'vue'
import store from '../vuex/store'
import { getAuthKey,getSessionId,getSessionStore} from '@/utils/auth'
import {listToTree} from '@/utils/datatotree'
import { Message } from 'element-ui'
import router from '../router'
import axios from 'axios'
import $ from 'jquery'
axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {

  });
axios.interceptors.response.use((res)=>{
      if(res.data.code==0){
        Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        return Promise.reject(res)
      }
     else if(res.data.code==1002){
        Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        router.push({path:'/login'})
      }else{
        return res
      }
    },(error)=>{

    });
Vue.prototype.$http = axios;
//获取菜单
var menusList=getSessionStore('menu');
if(menusList){
  menusList.map(item=>{
    if(item.pid==0){
      item.component=resolve => require(['@/components/common/Home.vue'],resolve)
    }else{
      item.component=resolve => require([`@/components/page${item.path}.vue`],resolve)
    }
  })
  menusList=listToTree("id","pid",menusList)
  store.state.userlogin.menumItems=menusList;//刷新获取菜单
  router.addRoutes(menusList)
  router.options.routes=router.options.routes.concat(menusList)
}
//路由钩子
router.beforeEach((to, from, next) => {
  var authKey=store.state.userlogin.authKey,
      sessionId=store.state.userlogin.sessionId;
    if(!menusList){
       if(to.path=='/'){
         next('login')
       }
    }
    if(authKey || sessionId){
        next()
    }else{
      if(to.path=='/login'){
        next()
      }else{
        next('login')
      }
    }
})
//指令
Vue.directive('permission',{
  inserted:function(el,binding){
    let auth=getSessionStore('authList'),
        value=binding.value;
     if(auth.indexOf(value)<0){
       $(el).remove()
     }
  }
})
axios.defaults.headers.authKey=getAuthKey();
axios.defaults.headers.sessionId=getSessionId();
