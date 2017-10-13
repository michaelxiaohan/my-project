import Vue from 'vue'
import store from '../vuex/store'
import { Message } from 'element-ui';
import axios from 'axios'
Vue.prototype.$http = axios;
axios.interceptors.response.use(function (res) {
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
    }else{
      return res
    }
  }, function (error) {


  });
axios.defaults.headers.authKey=store.state.authKey;
axios.defaults.headers.sessionId=store.state.sessionId;
