import Home from '../../components/common/Home.vue'
const _import=file => require('@/components/' + file + '.vue')
export default [
  {
    path: '/',
    component: Home,
    redirect:'/work/index',
    name:'自述',
    children:[{path:'/work/index',component:_import('page/handle/readme'),name:'自述'}]
  },
  {
    path:'/work/table',
    component: Home,
    name:'表格',
    children:[
      {path:'basetable',component: _import('page/handle/basetable'),name:'基本表格'},
      {path:'vuetable',component: _import('page/handle/vuetable'),name:'vue表格'}
    ]
  },
  {
    path: '/work/form',
    component: Home,
    name:'表单',
    children:[
      {path:'baseform',component: _import('page/handle/baseform'),name:"基本表单"},
      {path:'markdown',component: _import('page/handle/markdown'),name:"markdown"},
      {path:'upload',component: _import('page/handle/upload'),name:"文件上传"},
      {path:'vueeditor',component: _import('page/handle/vueeditor'),name:"编辑器"}
    ]
  },
  {
    path: '/work/basecharts',
    component: Home,
    name:'图表',
    children:[{path:'readme',component: _import('page/basecharts'),name:'图表'}]
  }
]
