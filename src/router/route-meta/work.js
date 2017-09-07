import Home from '../../components/common/Home.vue'
const _import=file => require('@/components/' + file + '.vue')
export default [
  {
    path: '/',
    component: Home,
    redirect:'/work/index',
    name:'首页',
    children:[{path:'/work/index',component:_import('page/work/work1'),name:'首页'}]
  },
  {
    path:'/work/table',
    component: Home,
    name:'客服',
    children:[
      {path:'work2',component: _import('page/work/work2'),name:'客服1'},
      {path:'work3',component: _import('page/work/work3'),name:'客服2'}
    ]
  },
  {
    path: '/work/form',
    component: Home,
    name:'订单',
    children:[
      {path:'work4',component: _import('page/work/work4'),name:"已付款"},
      {path:'work5',component: _import('page/work/work5'),name:"待付款"},
      {path:'work6',component: _import('page/work/work6'),name:"待发货"},
      {path:'work7',component: _import('page/work/work7'),name:"全部订单"}
    ]
  },
  {
    path: '/work',
    component: Home,
    name:'店铺',
    children:[{path:'work8',component: _import('page/work/work8'),name:'店铺'}]
  }
]
