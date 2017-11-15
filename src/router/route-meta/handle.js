import Home from '../../components/common/Home.vue'
const _import=file => require('@/components/' + file + '.vue')
export default [
  {
    path:'/login',
    component:_import('page/login/login')
  }
  // {
  //   path: '/handle',
  //   component: _import('common/Home'),
  //   redirect:'/handle/tags',
  //   name:'标签管理',
  //   children:[{path:'/handle/tags',component:_import('page/handle/tags'),name:'标签管理'}]
  // },
  // {
  //   path:'/handle',
  //   component: _import('common/Home'),
  //   name:'图片管理',
  //   children:[{path:'/handle/table/pictures',component:_import('page/handle/pictures'),name:'图片管理'}]
  // }
  // {
  //   path:'/handle/table',
  //   component: Home,
  //   name:'图片管理',
  //   children:[
  //     {path:'basetable',component: _import('page/handle/basetable'),name:'基本表格'},
  //     {path:'vuetable',component: _import('page/handle/vuetable'),name:'vue表格'}
  //   ]
  // },
  // {
  //   path: '/handle/form',
  //   component: Home,
  //   name:'表单',
  //   children:[
  //     {path:'baseform',component: _import('page/handle/baseform'),name:"基本表单"},
  //     {path:'markdown',component: _import('page/handle/markdown'),name:"markdown"},
  //     {path:'upload',component: _import('page/handle/upload'),name:"文件上传"},
  //     {path:'vueeditor',component: _import('page/handle/vueeditor'),name:"编辑器"}
  //   ]
  // }

  // {
  //   path: '/handle/drag',
  //   component: Home,
  //   name:'拖拽',
  //   children:[{path:'readme',component: _import('page/drag'),name:'拖拽'}]
  // }
]
