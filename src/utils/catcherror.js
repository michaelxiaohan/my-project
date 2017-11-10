/*
错误捕捉
*/
import Vue from 'vue'
import store from '../vuex/store'
import { getAuthKey,getSessionId} from '@/utils/auth'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import router from '../router'
import axios from 'axios'
Vue.prototype.$http = axios;
axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {

  });
axios.interceptors.response.use(function (res) {
    // loadingInstance.close();
    if(res.data.code==0){
      Message({
          showClose: true,
          message: res.data.msg,
          type: 'error'
        });
    }
    if(res.data.code==1002){
      Message({
          showClose: true,
          message: res.data.msg,
          type: 'error'
        });
      router.push({path:'/login'})
    }else{
      return res
    }
  }, function (error) {

  });
axios.defaults.headers.authKey=getAuthKey();
axios.defaults.headers.sessionId=getSessionId();
