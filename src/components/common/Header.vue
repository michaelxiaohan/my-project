<template>
    <div class="header">
        <div class="logo">后台管理系统</div>
        <div class="menu">
          <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
            <template v-for="item in items">
              <el-menu-item :index="item.href" :name="item.name">{{item.name}}</el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../assets/img.jpg">
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="accountInfo">账户信息</el-dropdown-item>
                    <el-dropdown-item command="companyInfo">企业信息</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog width='650px' title="账户信息" center :visible.sync="dialogAccount">
          <el-form label-width="80px" style='width: 450px; margin-left:50px;' ref="ruleForm" :label-width="'100px'" :model='ruleForm'>
            <el-form-item label="账户名称" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-tag v-for="tag in ruleForm.groups" :key="tag.id" style="margin-left:5px;">{{tag.title}}</el-tag>
            </el-form-item>
            <el-form-item label="负责人姓名" prop="realname">
              <el-input v-model="ruleForm.realname"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="product_name">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop='remark'>
              <el-input v-model="ruleForm.remark"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否重置密码">
              <el-input type="password" v-model="ruleForm.password" style="width:65%;"></el-input>
              <!-- <el-button style="margin:5px;" @click="editPassword">重置密码</el-button> -->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAccount=false;">取 消</el-button>
            <el-button type="primary" @click="sureUpdateAccount(ruleForm)">保存</el-button>
          </div>
       </el-dialog>
       <el-dialog width='650px' title="企业信息" center :visible.sync="dialogCompany">
         <el-form label-width="80px" style='width: 450px; margin-left:50px;' :label-width="'100px'" :model='companyForm'>
           <el-form-item label="企业名称">
             <el-input v-model="companyForm.company_name" disabled></el-input>
           </el-form-item>
           <el-form-item label="企业电话">
             <el-input v-model="companyForm.tel" disabled></el-input>
           </el-form-item>
           <el-form-item label="企业地址" >
             <el-input type="textarea" v-model="companyForm.address" disabled></el-input>
           </el-form-item>
           <el-form-item label="负责人姓名">
             <el-input v-model="companyForm.contacts" disabled></el-input>
           </el-form-item>
           <el-form-item label="联系电话">
             <el-input v-model="companyForm.phone" disabled></el-input>
           </el-form-item>
         </el-form>
      </el-dialog>
    </div>
</template>
<script>
import {getSessionStore} from '@/utils/auth'
    export default {
      data () {
        return {
          name: '',
          activeIndex: '1',
          activeIndex2: '1',
          items:this.$store.header,
          dialogAccount:false,
          dialogCompany:false,
          ruleForm:getSessionStore('userInfo'),
          companyForm:{}
        }
      },
      mounted(){

      },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            handleSelect(e,h,name){
              this.$store.commit('changeHeaders',e)

            },
            handleCommand(command) {
                if(command == 'loginout'){
                    this.$router.push('/login');
                    this.$store.dispatch('LogOut')
                }else if (command == 'accountInfo'){
                  this.dialogAccount=true;
                }else{
                  this.$http.get('admin/company/companyDetail',{params:{company_id:this.ruleForm.company_id}}).then((res)=>{
                      this.companyForm=res.data.data;
                  })
                  this.dialogCompany=true;
                }
            },
            sureUpdateAccount(ruleForm){
              let params=this.collectParams(['username','realname','remark','status','user_id','phone'],ruleForm);
              this.$http.post('/admin/user/edit',params).then((res)=>{
              })
            },
//过滤提交给后台的参数
            collectParams(expect,form){
              let doneObj={};
              expect.forEach((item)=>{
                doneObj[item]=form[item]
              });
              return doneObj
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
