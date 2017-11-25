const getters ={
  sidebar:state =>state.userlogin.menumItems,
  num:state=>state.tabs.num,
  authList:state =>state.userlogin.authList
}
export default getters
