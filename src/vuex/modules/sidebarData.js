const works=[
        {
            icon: 'el-icon-setting',
            index: '/work/index',
            title: '首页'
        },
        {
            icon: 'el-icon-menu',
            index: '/work/table',
            title: '客服',
            subs: [
                {
                    index: 'work2',
                    title: '客服1'
                },
                {
                    index: 'work3',
                    title: '客服2'
                }
            ]
        },
        {
            icon: 'el-icon-date',
            index: '/work/form',
            title: '订单',
            subs: [
                {
                    index: 'work4',
                    title: '已付款'
                },
                {
                    index: 'work5',
                    title: '待付款'
                },
                {
                    index: 'work6',
                    title: '待发货'
                },
                {
                    index: 'work7',
                    title: '全部订单'
                }
            ]
        },
        {
            icon: 'el-icon-star-on',
            index: '/work/work8',
            title: '店铺'
        }

  ]
  const handle = [
      {
          icon: 'el-icon-setting',
          index: '/handle/tags',
          title: '标签管理'
      },
      {
          icon: 'el-icon-menu',
          index: '/handle/table/pictures',
          title: '图片管理'
          // subs: [
          //     {
          //         index: 'basetable',
          //         title: '基础表格'
          //     },
          //     {
          //         index: 'vuetable',
          //         title: 'Vue表格组件'
          //     }
          // ]
      }
      // ,
      // {
      //     icon: 'el-icon-date',
      //     index: '/handle/form',
      //     title: '表单',
      //     subs: [
      //         {
      //             index: 'baseform',
      //             title: '基本表单'
      //         },
      //         {
      //             index: 'vueeditor',
      //             title: '编辑器'
      //         },
      //         {
      //             index: 'markdown',
      //             title: 'markdown'
      //         },
      //         {
      //             index: 'upload',
      //             title: '文件上传'
      //         }
      //     ]
      // }
  ]
  export {
    handle,
    works
  }
