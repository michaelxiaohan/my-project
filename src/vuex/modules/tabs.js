import {handle,works} from './sidebarData.js'
const tabs={
  state:{
    tabs:{
      editableTabsValue2: '1',
      editableTabs2: [
        {
          title:'标签管理',
          name:'1',
          content:'/handle/tags'
        }
      ],
      tabIndex: 1
    },
    num:1,
    sidebar:handle
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
  }
}
export default tabs
