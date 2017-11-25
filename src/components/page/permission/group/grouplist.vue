<template lang="html">
  <div v-if='editPermit'>

  </div>
  <div v-else>
    <header>
      <div class="operation">
        <el-button @click='addGroup'>创建角色</el-button>
      </div>
    </header>
    <el-table :data="tableData" border style="width: 100%" @expand-change='expandChange' >
      <el-table-column type="expand" >
         <template slot-scope="props" v-if='props.row.children'>
           <el-table :data="props.row.children" border :show-header='false'>
               <el-table-column prop="title" align="center"></el-table-column>
               <el-table-column  align="center">
                 <template slot-scope="scope">
                   <el-button size="mini" type="primary" @click="groupEdit(scope.row)">修改</el-button>
                   <el-button size="mini" type="danger" @click="brandDelete(scope.row)">分配权限</el-button>
                 </template>
               </el-table-column>
           </el-table>
         </template>
       </el-table-column>
       <!-- <el-table-column type="index" label='序号' align="center" width="100"></el-table-column> -->
       <el-table-column prop="title" label="角色名称" align="center"></el-table-column>
       <el-table-column label="操作" align="center">
         <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="groupEdit(scope.row)">修改</el-button>
           <el-button size="mini" type="danger" @click="brandDelete(scope.row)">分配权限</el-button>
         </template>
       </el-table-column>
    </el-table>
    <!-- 新增 品类-->
    <el-dialog title="新增/修改角色" :visible.sync="dialogGroup" width='30%'>
      <el-form  label-width="150px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
        <div v-if='isAdd'>
          <el-form-item label="在当前角色下新增">
            <el-select placeholder="请选择角色" v-model="ruleForm.pid" style="width:100%;">
                <el-option :label="item.title" :value="item.id" :key='item.id' v-for='item in roleList'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="新增角色名称">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroup=false">取 消</el-button>
        <el-button type="primary" @click="sureAddCategory(ruleForm)" v-if='isAdd'>新增</el-button>
        <el-button type="primary" @click="sureEditGroup(ruleForm)" v-else>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listToTree} from '@/utils/datatotree'
import $ from 'jquery'
export default {
  data(){
    return{
      tableData:null,
      isAdd:false,
      pageSize:0,
      pages:0,
      dialogGroup:false,
      ruleForm:{
        name:""
      },
      roleList:'',
      editPermit:false
    }
  },
  created(){
    this.loadGroupList()
  },

  methods:{
// 加载数据方法
    loadGroupList(params){
      this.$http.get('/admin/group/groupList',{
        params:params
      }).then(res=>{
        this.tableData=listToTree('id','pid',res.data.data);
        this.pageSize=res.data.per_page;
        this.pages=res.data.total;
      })
    },
// 添加角色
    addGroup(){
      this.$http.get('/admin/group/groupList').then((res)=>{
        this.roleList=res.data.data;
        this.ruleForm={}
        this.dialogGroup=true;
        this.isAdd=true;
      })
    },
// 确定添加角色
    sureAddCategory(ruleForm){
      console.log(ruleForm);
      this.dialogGroup=false;
      this.$http.post('/admin/group/groupAdd',ruleForm).then(res=>{})
      this.loadGroupList();
    },
// 行编辑
    groupEdit(row){
      this.isAdd=false;
      this.dialogGroup=true;
      this.ruleForm=row;
    },
// 确定编辑
    sureEditGroup(row){
      this.dialogGroup=false;
      this.$http.post('/admin/group/groupEdit',{title:row.title,pid:row.pid,remark:row.remark,id:row.id})
      .then(res=>{
        this.loadGroupList()
      })
    },
    expandChange(){
      setTimeout(function(){
      $('.el-table__expanded-cell').css({'padding-right':'0'})
    },0)
  }

  }
}
</script>

<style lang="scss" scoped>
  .operation{
    float: right;
    margin-bottom: 10px;
  }
  .pagination{
    text-align: center;
  }
  .el-table__expanded-cell{
    padding-right: 0
  }
</style>
