import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home.vue'
import Readme from '../components/page/readme.vue'
import Basecharts from '../components/page/basecharts.vue'
import Baseform from '../components/page/baseform.vue'
import Basetable from '../components/page/basetable.vue'
import Drag from '../components/page/drag.vue'
import Markdown from '../components/page/markdown.vue'
import Upload from '../components/page/upload.vue'
import Vueeditor from '../components/page/vueeditor.vue'
import Vuetable from '../components/page/vuetable.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      redirect:'/readme',
      name:'自述',
      children:[{path:'readme',component:Readme,name:'自述'}]
    },
    {
      path:'/table',
      component: Home,
      // redirect:'/readme',
      name:'表格',
      children:[
        {path:'basetable',component: Basetable,name:'基本表格'},
        {path:'vuetable',component: Vuetable,name:'vue表格'}
      ]
    },
    {
      path: '/form',
      component: Home,
      // redirect:'/readme',
      name:'表单',
      children:[
        {path:'baseform',component: Baseform,name:"基本表单"},
        {path:'markdown',component: Markdown,name:"markdown"},
        {path:'upload',component: Upload,name:"文件上传"},
        {path:'vueeditor',component: Vueeditor,name:"编辑器"}
      ]
    }
    // {
    //   path: '/table',
    //   component: Home,
    //   // redirect:'/readme',
    //   name:'自述',
    //   children:[
    //     {path:'/readme',component: Readme,name:"自述"},
    //     {path:'/basecharts',component: Basecharts,name:"图表"},
    //     {path:'/baseform',component: Baseform,name:"基本表单"},
    //     {path:'/basetable',component: Basetable,name:"基础表格"},
    //     {path:'/drag',component: Drag,name:"拖拽"},
    //     {path:'/markdown',component: Markdown,name:"markdown"},
    //     {path:'/upload',component: Upload,name:"文件上传"},
    //     {path:'/vueeditor',component: Vueeditor,name:"编辑器"},
    //     {path:'/vuetable',component: Vuetable,name:'vue表格'},
    //   ]
    // }
  ]
})
