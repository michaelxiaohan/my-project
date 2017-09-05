import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state:{
    tabs:{
      editableTabsValue2: '1',
      editableTabs2: [
        {
          title:'自述',
          name:'1',
          content:'/readme'
        }
      ],
      tabIndex: 1
    },
    num:1
  },
  mutations:{
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
            state.num=i+1
          }
        })
      }
    }
  }
})
export default store;
