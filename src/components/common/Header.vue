<template>
    <div class="header">
        <div class="logo">后台管理系统</div>
        <div class="menu">
          <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
            <template v-for="item in items">
              <el-menu-item :index="item.index">{{item.name}}</el-menu-item>
            </template>

              <!-- <el-menu-item index="2">我的工作台</el-menu-item> -->
              <!-- <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-submenu> -->
              <!-- <el-menu-item index="3">订单管理</el-menu-item>
              <el-menu-item index="4">订单</el-menu-item>
              <el-menu-item index="5">待发货</el-menu-item>
              <el-menu-item index="6">店铺管理</el-menu-item> -->
          </el-menu>
        </div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../assets/img.jpg">
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    import bus from '../../assets/eventBus'
    export default {
      data () {
        return {
          name: 'chao',
          activeIndex: '1',
          activeIndex2: '1',
          items:[
            {
              index:'/handle/readme',
              name:'处理中心'
            },
            {
              index:'/work/index',
              name:'我的工作台'
            },
            {
              index:'/ordermanage/index',
              name:'订单管理'
            },
            {
              index:'/order/index',
              name:'订单'
            },
            {
              index:'/backordered/index',
              name:'待发货'
            },
            {
              index:'/shopmanage/index',
              name:'店铺管理'
            }
          ]
        }
      },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            handleSelect(e,h){
                var items=[
                      {
                          icon: 'el-icon-setting',
                          index: '/readme',
                          title: '首页'
                      },
                      {
                          icon: 'el-icon-menu',
                          index: '/table',
                          title: '客服',
                          subs: [
                              {
                                  index: 'basetable',
                                  title: '客服1'
                              },
                              {
                                  index: 'vuetable',
                                  title: '客服2'
                              }
                          ]
                      },
                      {
                          icon: 'el-icon-date',
                          index: '/form',
                          title: '订单',
                          subs: [
                              {
                                  index: 'baseform',
                                  title: '已付款'
                              },
                              {
                                  index: 'vueeditor',
                                  title: '待付款'
                              },
                              {
                                  index: 'markdown',
                                  title: '待发货'
                              },
                              {
                                  index: 'upload',
                                  title: '全部订单'
                              }
                          ]
                      },
                      {
                          icon: 'el-icon-star-on',
                          index: '/basecharts',
                          title: '店铺'
                      }

                ]
                bus.$emit('setData',items)
            },
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
            },
            sendMsg() {
              // this.$axios.get('backend/index.php').then((res)=>{
              //   console.log(res)
              // })
                bus.$emit('setData',items)
              }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .menu{
      margin-top: 5px;
      float:left;
    }
    .el-menu-demo{
      background-color: #242f42;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
