import { getAuthKey, setAuthKey, removeAuthKey,getSessionId,setSessionId,removeSessionId } from '@/utils/auth'
import {listToTree} from '@/utils/datatotree'
import axios from 'axios'
import router from '@/router'
const userlogin={
    state:{
        username:'',
        authKey:getAuthKey(),
        sessionId:getSessionId(),
        menumItems:[
            {
              id:1,
              name:"账户管理",
              pid:0,
              tip:null,
              path:"/account",
              sort:100,
              type:"nav",
              hide:0
          },
          {
            id:3,
            name:"创建账户",
            pid:1,
            tip:null,
            path:"/account/index",
            sort:100,
            type:"nav",
            hide:0
        },
          {
              id:2,
              name:"角色管理",
              pid:0,
              tip:null,
              path:"/role",
              sort:"100",
              type:"nav",
              hide:0
          },
          {
              id:4,
              name:"创建角色",
              pid:2,
              tip:null,
              path:"/role/index",
              sort:"100",
              type:"nav",
              hide:0
          }
        ]
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
          var menu=userlogin.state.menumItems;
          menu.map(item=>{
            if(item.pid==0){
              item.component=resolve => require(['@/components/common/Home.vue'],resolve)
            }else{
              item.component=resolve => require([`@/components/page${item.path}.vue`],resolve)
            }
          })
          menu=listToTree("id","pid",menu)
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
