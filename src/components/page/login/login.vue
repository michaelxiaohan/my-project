<template>
  <el-form :model="loginForm" ref="loginForm" label-width="100px" class="ruleForm">
    <el-form-item label="用户名">
      <el-input v-model="loginForm.name" auto-complete="off" class="input"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="loginForm.password" auto-complete="off"class="input"></el-input>
    </el-form-item>
    <el-form-item label="验证码">
      <el-input v-model="loginForm.identify" auto-complete="off" class="input" @keyup.enter.native="submitForm(loginForm)" ></el-input>
      <img @click='changeImg' :src="identiImg" style="width:250px;vertical-align:middle;margin-top:10px;">
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(loginForm)">登陆</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {listToTree} from '@/utils/datatotree'
  export default {
    data() {
      return {
        loginForm: {
          name: '',
          password: '',
          identify:''
        },
        identiImg:'http://mirrortest.ibuguang.com/captcha.html'
      }
    },
    created(){

    },
    methods: {
      submitForm(loginForm) {
        this.$http.post('/admin/login/login_do',{
            username:loginForm.name,
            password:loginForm.password,
            // verify:loginForm.identify
        }).then(function(res){
          var that=this;
          if(res.data.data){
            localStorage.setItem('ms_username',res.data.data.userInfo.username);
            this.$store.dispatch('userLogin',res.data.data).then(function(){
              // that.$http.post('/admin/menu/menuAdd',{
              //     name:'店铺列表',
              //     pid:108,
              //     path:'/stores/storemanage/storelist',
              //     sort:100,
              //     type:'nav',
              //     icon:''
              // })
              // that.$http.post('/admin/menu/menuDel',{
              //     id:109
              // })
            that.$router.push({ path: '/permission/user/userlist' })
            })
          }
        }.bind(this)).catch((res)=>{
          this.changeImg();
        })
      },
      changeImg(){
        let num=Math.random();
        this.identiImg=`http://mirrortest.ibuguang.com/captcha.html?${num}`
      }
    }
  }
</script>
<style scoped>
  .ruleForm{
    width: 500px;
    margin: 200px auto;
  }
  .input{
    width:250px;
  }
</style>
