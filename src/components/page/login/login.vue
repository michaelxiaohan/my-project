<template>
  <el-form :model="ruleForm2" ref="ruleForm2" label-width="100px" class="ruleForm">
    <el-form-item label="用户名">
      <el-input v-model="ruleForm2.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" @keyup.enter.native="submitForm(ruleForm2)"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleForm2)">登陆</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {listToTree} from '@/utils/datatotree'
  export default {
    data() {
      return {
        ruleForm2: {
          name: '',
          password: ''
        }
      }
    },
    created(){

    },
    methods: {
      submitForm(ruleForm2) {
        this.$http.post('/admin/login/login_do',{
            username:ruleForm2.name,
            password:ruleForm2.password
        }).then(function(res){
          var that=this;
          if(res.data.data){
            localStorage.setItem('ms_username',res.data.data.userInfo.username);
            this.$store.dispatch('userLogin',res.data.data).then(function(){
              // that.$http.post('/admin/menu/menuAdd',{
              //     name:'商品库管理',
              //     pid:88,
              //     path:'/goods/store/storelist',
              //     sort:100,
              //     type:'nav',
              //     icon:''
              // })
            that.$router.push({ path: '/goods/brand/brandlist' })
            })
          }
        }.bind(this))
      }
    }
  }
</script>
<style scoped>
  .ruleForm{
    width: 500px;
    margin: 200px auto;
  }
</style>
