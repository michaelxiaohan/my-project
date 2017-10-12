import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const getters ={
  sidebar:state =>state.sidebar,
  num:state=>state.num
}
import {handle,works} from './sidebarData.js'
import { getAuthKey, setAuthKey, removeAuthKey,getSessionId,setSessionId,removeSessionId } from '@/utils/auth'
const store = new Vuex.Store({
  getters,
  state:{
    tabs:{
      editableTabsValue2: '1',
      editableTabs2: [
        {
          title:'标签管理',
          name:'1',
          content:'/handle/readme'
        }
      ],
      tabIndex: 1
    },
    num:1,
    sidebar:handle,
    header:'',
    username:'',
    authKey:getAuthKey(),
    sessionId:getSessionId()
  },
  mutations:{
    SET_AUTHKEY: (state, key) => {
      state.authKey = key
    },
    SET_SESSIONID: (state, id) => {
      state.sessionId = id
    },
    addTabs(state,obj){
      let editableTabs2=state.tabs.editableTabs2;
      if(JSON.stringify(editableTabs2).indexOf(JSON.stringify(obj.name)) == -1){//添加标签页判断是否有重复项
        let newTabName = ++state.tabs.tabIndex + '',
        newtabs = {
          title:obj.name,
          name:newTabName,
          content:obj.path
        };
        editableTabs2.push(newtabs)
        state.tabs.editableTabsValue2 = newTabName
      }else{
        editableTabs2.forEach(function(item,i){
          if(item.title == obj.name){
            state.num=item.name
          }
        })
      }
    },
    changeHeaders(state,e){
        switch (e) {
            case '/work/index':
              state.sidebar = works
            break;
            case '/handle/readme':
              state.sidebar = handle
            break;

        }
    }
  },
  actions:{
    //登陆
    userLogin({commit},key){
      setAuthKey(key.authKey);
      setSessionId(key.sessionId);
      commit('SET_AUTHKEY', key.authKey);
      commit('SET_SESSIONID', key.sessionId);
    },
    // 登出
    LogOut({ commit, state }) {
          commit('SET_AUTHKEY', '');
          commit('SET_SESSIONID', '');
          removeAuthKey();
          removeSessionId();
      }
    }

})
export default store;
