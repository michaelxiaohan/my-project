<template>
   <div>
     <!-- 编辑新增 -->
     <section v-if='dialogAddImage'>
                 <div style="margin-bottom:20px;">
                   <el-button @click="cancelUpdateImg">返回</el-button>
                   <el-button type="primary" @click="sureAddImg(ruleForm)">保存</el-button>
                   <el-button type="primary" style="float:right" v-if='lookAccount' @click='handleUpdate' v-permission="'permission-user-userlist-edit'">编辑</el-button>
                 </div>
                 <div style="display:flex;justify-content:center;">
                     <el-form label-width="80px" style='width: 450px; margin-left:50px;' ref="ruleForm" :label-width="'100px'" :model='ruleForm'>
                       <el-form-item label="账户名称" prop="username">
                         <el-input v-model="ruleForm.username" :disabled='lookAccount'></el-input>
                       </el-form-item>
                       <el-form-item label="角色">
                         <el-select placeholder="请选择角色" v-model="ruleForm.groups" multiple style="width:100%;" :disabled='lookAccount'>
                             <el-option :label="item.title" :value="item.id" :key='item.id' v-for='item in roleList'></el-option>
                         </el-select>
                       </el-form-item>
                       <el-form-item label="负责人姓名" prop="realname">
                         <el-input v-model="ruleForm.realname" :disabled='lookAccount'></el-input>
                       </el-form-item>
                       <el-form-item label="联系电话" prop="product_name">
                         <el-input v-model="ruleForm.phone" :disabled='lookAccount'></el-input>
                       </el-form-item>
                       <el-form-item label="备注" prop='remark'>
                         <el-input v-model="ruleForm.remark" :disabled='lookAccount'></el-input>
                       </el-form-item>
                       <el-form-item label="当前状态">
                         <el-radio-group v-model="ruleForm.status" :disabled='lookAccount'>
                           <el-radio :label="1">开启</el-radio>
                           <el-radio :label="0">禁用</el-radio>
                         </el-radio-group>
                       </el-form-item>
                       <el-form-item label="密码">
                         <el-input type="password" v-model="ruleForm.password" style="width:65%;" disabled></el-input>
                         <el-button style="margin:5px;" @click="editPassword"  :disabled='lookAccount'>
                           <span v-if='editUser'>重置</span><span v-else>设置</span>密码
                         </el-button>
                       </el-form-item>
                     </el-form>
                 </div>
                 <el-dialog width='30%' title="修改密码" :visible.sync="dialogPassword">
                   <el-form :model="passwordForm" style='width: 400px; margin-left:50px;' status-icon :rules="rules" ref="passwordForm" label-width="100px">
                      <el-form-item label="密码" prop="pass">
                          <el-input type="password" v-model="passwordForm.pass" auto-complete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="passwordForm.checkPass" auto-complete="off"></el-input>
                      </el-form-item>
                  </el-form>
                   <div slot="footer" class="dialog-footer">
                     <el-button @click="dialogPassword=false;">取 消</el-button>
                     <el-button type="primary" @click="sureUpdatePwd(passwordForm)">保存</el-button>
                   </div>
                </el-dialog>

     </section>
     <section v-else>
        <div class="searchFilter" style="float:left;">
          <el-input placeholder="请输入账户信息搜索" v-model="searchValue" class="search">
            <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
          </el-input>
        </div>
        <div class="addButton">
          <el-button @click='addProduct' v-permission="'goods-store-storelist-add'">创建账户</el-button>
        </div>
<!-- 表格组件 -->
        <el-table ref="multipleTable" :data="tableData" border>
           <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
            <el-table-column prop="username" label="账户名称" align="center"></el-table-column>
            <el-table-column prop="groups" label="角色" align="center">
              <template slot-scope="scope">
                <el-tag v-for="tag in scope.row.groups" :key="tag.id">{{tag.title}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="realname" label="负责人姓名" align="center" width='100'></el-table-column>
            <el-table-column prop="phone" label="联系电话" align="center" width='100'></el-table-column>
            <el-table-column prop="remark" label="备注" align="center" width='100'></el-table-column>
            <el-table-column prop="status" align="center" label="状态" width='100'>
              <template slot-scope="scope">
                <el-button v-if="scope.row.status==1" size="small" type="success">已启用</el-button>
                <el-button v-else size="small" type="info">已禁用</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="operationn" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="look(scope.row)" v-permission="'permission-user-userlist-look'">查看</el-button>
                <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="'permission-user-userlist-edit'">编辑</el-button>
                <el-button size="mini" @click="addRole(scope.row)" v-permission="'permission-user-userlist-auth'">授权</el-button>
                <el-button size="mini" @click='upAndDown(scope.row)' v-if="scope.row.status==1" v-permission="'permission-user-userlist-forbid'">禁用</el-button>
                <el-button size="mini" @click='upAndDown(scope.row)' v-else v-permission="'permission-user-userlist-start'">启用</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-dialog width='30%' title="角色授权" :visible.sync="dialogAddRole" @close='closeRole'>
          <el-select placeholder="请选择角色" v-model="roleGroups" multiple style="width:100%;">
              <el-option :label="item.title" :value="item.id" :key='item.id' v-for='item in roleList'></el-option>
          </el-select>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sureAddrole()">保存</el-button>
          </div>
       </el-dialog>
<!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
        </div>
      </section>
    </div>

</template>
<script>
  export default {
    data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return{
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        dialogAddImage:false,
        dialogPassword:false,
        dialogAddRole:false,
        imgListParams:{
          status:'',
          page:1
        },
        passwordForm:{
          pass: '',
          checkPass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validateCheckPass, trigger: 'blur' }
          ]
        },
        ruleForm:{},//表单
        searchValue:'',
        roleList:'',
        roleGroups:'',
        lookAccount:false,
        updatePassword:false//是否修改了密码
      }
    },
    created(){
      this.loadUserList(this.imgListParams)
    },
    methods:{
//重新加载所有账户方法
      loadUserList(params){
          this.$http.get('/admin/user/adminList',{params:params}).then((res)=>{
            let data=res.data.data;
            this.tableData=data.data;
            this.pageSize=data.per_page;
            this.pages=data.total;
          })
      },
// 加载所有角色组
      loadRoleList(row){
        this.$http.get('/admin/group/groupList').then((res)=>{
          this.roleList=res.data.data;
          row.groups.forEach((item,i)=>{
            row.groups[i]=item.id
          })
          this.ruleForm=row;
          this.roleGroups=row.groups;
        })
      },
//新增账户按钮
      addProduct(){
        var that=this;
        this.dialogAddImage=true;
        this.editUser=false;
        this.lookAccount=false;
        this.ruleForm={};
        this.$http.get('/admin/group/groupList').then((res)=>{
          this.roleList=res.data.data;
        })
      },
//取消编辑或新增
      cancelUpdateImg(){
        this.loadUserList(this.imgListParams)
        this.dialogAddImage=false;
      },
//确定新增或编辑图片按钮
      sureAddImg(ruleForm){
        if(ruleForm.password==null&!this.editUser){
          this.$message.error('密码不能为空');
          return false
        }
        let url=this.editUser?'/admin/user/edit':'/admin/user/add',
            params=this.collectParams(['username','realname','remark','groups','status','user_id','password','phone'],ruleForm),
            request=this.$http;
        if(!this.updatePassword){ //如果没有修改密码就不传递password字段
          delete params.password
        }
         request.post(url,params).then((res)=>{
           this.loadUserList(this.imgListParams);
           this.dialogAddImage=false;
         })
      },
//角色授权
      addRole(row){
        this.dialogAddRole=true;
        this.loadRoleList(row);
      },
      closeRole(){
        this.loadUserList()
      },
// 授权保存
      sureAddrole(){
        let id=this.ruleForm.user_id,
        groups=this.roleGroups.join(',');
        this.$http.post('/admin/user/accessGroups',{
          user_id:id,
          groups:groups
        }).then(()=>{
          this.dialogAddRole=false;
          this.loadUserList()
        })
      },
//查看按钮
      look(row){
          this.loadRoleList(row);
          this.dialogAddImage=true;
          this.lookAccount=true;
      },
//表格编辑事件
      handleUpdate(row){
        this.editUser=true;
        this.lookAccount=false;
        this.loadRoleList(row);
        this.dialogAddImage=true;
      },
// 启用，禁用
      upAndDown(row){
        var status=row.status==1?0:1,
            confirm=row.status==1?'确定禁用该用户？':'确定启用该用户？';
          this.$confirm(confirm, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/admin/user/adminState',{
              user_id:row.user_id,
              status:status
            }).then((res)=>{
                this.loadUserList()
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
            })
          })
      },
//改变页数
      handleCurrentChange(current){
        this.imgListParams.page=current;
        this.loadUserList(this.imgListParams)
      },
//过滤提交给后台的参数
      collectParams(expect,form){
        let doneObj={};
        expect.forEach((item)=>{
          doneObj[item]=form[item]
        });
        doneObj.groups=doneObj.groups.join(',')
        return doneObj
      },
//搜索
      search(val){
        let params={
          val:val
        };
        this.imgListParams=Object.assign(this.imgListParams,params)
        this.loadUserList(this.imgListParams)
      },
// 修改密码
      editPassword(){
        this.dialogPassword=true;
        this.updatePassword=false;
      },
// 确认修改密码
      sureUpdatePwd(form){
        this.$refs.passwordForm.validate((valid) => {
         if (valid) {
           this.ruleForm.password=form.pass;
           this.dialogPassword=false;
           this.updatePassword=true;
         } else {
           return false;
         }
       });

      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .addButton {
      margin-bottom: 10px;
      float: right;
  }
  .el-tag{
    margin: 5px;
  }
  .pagination{
    text-align: center;
  }
  .search{
    width: 100%;
  }
</style>
