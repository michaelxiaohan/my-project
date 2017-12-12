import { getAuthKey, setAuthKey, removeAuthKey,getSessionId,setSessionId,removeSessionId,setSessionStore} from '@/utils/auth'
import {listToTree} from '@/utils/datatotree' //列表数据转树形
import axios from 'axios'
import router from '@/router'
const userlogin={
    state:{
        username:'',
        authKey:getAuthKey(),
        sessionId:getSessionId(),
        menumItems:'',
        authList:''
    },
    mutations:{
        SET_AUTHKEY: (state, key) => {
          state.authKey = key
        },
        SET_SESSIONID: (state, id) => {
          state.sessionId = id
        }
    },
    actions:{
      //登陆
      userLogin({commit},key){
        if(key){
          setAuthKey(key.authKey);
          setSessionId(key.sessionId);
          commit('SET_AUTHKEY', key.authKey);
          commit('SET_SESSIONID', key.sessionId);
          userlogin.state.authList=key.authList;
          let menu=key.menusList,
              auth=key.authList,
              userInfo=key.userInfo;
          setSessionStore('menu',menu);
          setSessionStore('authList',auth);
          setSessionStore('userInfo',userInfo);
          menu.map(item=>{
            if(item.pid==0){
              item.component=resolve => require(['@/components/common/Home.vue'],resolve)
            }else{
              item.component=resolve => require([`@/components/page${item.path}.vue`],resolve)
            }
          })
          menu=listToTree("id","pid",menu)
          userlogin.state.menumItems=menu;
          router.addRoutes(menu)
          router.options.routes=router.options.routes.concat(menu)
          axios.defaults.headers.authKey=userlogin.state.authKey;
          axios.defaults.headers.sessionId=userlogin.state.sessionId;
        }
      },
      // 登出
      LogOut({ commit, state }) {
            commit('SET_AUTHKEY', '');
            commit('SET_SESSIONID', '');
            removeAuthKey();
            removeSessionId();
        }
      }
}
export default userlogin
