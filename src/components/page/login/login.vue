<template>
  <el-form :model="ruleForm2" ref="ruleForm2" label-width="100px" class="ruleForm">
    <el-form-item label="用户名">
      <el-input v-model="ruleForm2.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleForm2)">登陆</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm2: {
          name: 'admin',
          password: '123456'
        }
      };
    },
    methods: {
      submitForm(ruleForm2) {
        this.$http.post('/api/admin/login/login_do',{
            username:ruleForm2.name,
            password:ruleForm2.password
        }).then(function(res){
          var that=this;
          this.$store.dispatch('userLogin',res.data.data).then(function(){
          that.$router.push({ path: '/' })
          })
        }.bind(this))
        // this.$http.get('http://192.168.1.55/eolinker_os/server/index.php?g=Web&c=Mock&o=success&mockCode=8ns8jGyRRxa6jijwIbLFFnT91Xu98MIY').then(
        //   function(res){
        //     this.$store.header=res.data.data.menusList
        //     this.$router.push({ path: '/' })
        //   }.bind(this)
        // )
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     alert('submit!');
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
