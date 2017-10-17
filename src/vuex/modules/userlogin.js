import { getAuthKey, setAuthKey, removeAuthKey,getSessionId,setSessionId,removeSessionId } from '@/utils/auth'
import axios from 'axios'
const userlogin={
    state:{
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
