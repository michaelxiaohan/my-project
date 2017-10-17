import Vue from 'vue'
import store from '../vuex/store'
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
import router from '../router'
import axios from 'axios'
Vue.prototype.$http = axios;
// let loadingInstance;
axios.interceptors.request.use(function (config) {
    // loadingInstance = Loading.service({target:document.querySelector(".router-view"),text:"加载中"});
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
axios.defaults.headers.authKey=store.state.authKey;
axios.defaults.headers.sessionId=store.state.sessionId;
