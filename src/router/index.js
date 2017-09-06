import Vue from 'vue'
import Router from 'vue-router'
// import Home from '../components/common/Home.vue'
// const _import=file => require('@/components/' + file + '.vue')
import routeMeta from './route-meta/index'
Vue.use(Router)
export default new Router({
  routes:routeMeta

  // [
  //   {
  //     path: '/',
  //     component: Home,
  //     redirect:'/handle/readme',
  //     name:'自述',
  //     children:[{path:'/handle/readme',component:_import('page/handle/readme'),name:'自述'}]
  //   },
  //   {
  //     path:'/handle/table',
  //     component: Home,
  //     name:'表格',
  //     children:[
  //       {path:'basetable',component: _import('page/handle/basetable'),name:'基本表格'},
  //       {path:'vuetable',component: _import('page/handle/vuetable'),name:'vue表格'}
  //     ]
  //   },
  //   {
  //     path: '/handle/form',
  //     component: Home,
  //     name:'表单',
  //     children:[
  //       {path:'baseform',component: _import('page/handle/baseform'),name:"基本表单"},
  //       {path:'markdown',component: _import('page/handle/markdown'),name:"markdown"},
  //       {path:'upload',component: _import('page/handle/upload'),name:"文件上传"},
  //       {path:'vueeditor',component: _import('page/handle/vueeditor'),name:"编辑器"}
  //     ]
  //   },
  //   {
  //     path: '/handle/basecharts',
  //     component: Home,
  //     name:'图表',
  //     children:[{path:'readme',component: _import('page/basecharts'),name:'图表'}]
  //   },
  //   {
  //     path: '/handle/drag',
  //     component: Home,
  //     name:'拖拽',
  //     children:[{path:'readme',component: _import('page/drag'),name:'拖拽'}]
  //   }
  // ]
})
