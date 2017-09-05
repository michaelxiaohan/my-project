<template>
    <div class="header">
        <div class="logo">后台管理系统</div>
        <div class="menu">
          <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1" @click="sendMsg">处理中心</el-menu-item>
              <el-menu-item index="2">我的工作台</el-menu-item>
              <!-- <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-submenu> -->
              <el-menu-item index="3">订单管理</el-menu-item>
              <el-menu-item index="4">订单</el-menu-item>
              <el-menu-item index="5">待发货</el-menu-item>
              <el-menu-item index="6">店铺管理</el-menu-item>
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
          activeIndex2: '1'
        }
      },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            handleSelect(){

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
              var items=[
                  {
                      icon: 'el-icon-setting',
                      index: '/readme',
                      title: '自述'
                  },
                  {
                      icon: 'el-icon-menu',
                      index: '/table',
                      title: '表格',
                      subs: [
                          {
                              index: 'basetable',
                              title: '基础表格'
                          },
                          {
                              index: 'vuetable',
                              title: 'Vue表格组件'
                          }
                      ]
                  },
                  {
                      icon: 'el-icon-date',
                      index: '/form',
                      title: '表单',
                      subs: [
                          {
                              index: 'baseform',
                              title: '基本表单'
                          },
                          {
                              index: 'vueeditor',
                              title: '编辑器'
                          },
                          {
                              index: 'markdown',
                              title: 'markdown'
                          },
                          {
                              index: 'upload',
                              title: '文件上传'
                          }
                      ]
                  },
                  {
                      icon: 'el-icon-star-on',
                      index: '/basecharts',
                      title: '图表'
                  },
                  {
                      icon: 'el-icon-upload2',
                      index: '/drag',
                      title: '拖拽'
                  }
              ]
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
