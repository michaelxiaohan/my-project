<template lang="html">
  <div>
    <header>
      <el-input placeholder="请输入品类名称搜索" v-model="searchValue" class="search">
        <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
      </el-input>
      <div class="operation">
        <el-button @click='addCategory'>添加品类</el-button>
        <el-button @click='brandDelete'>删除品类</el-button>
      </div>
    </header>
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
       <el-table-column type="selection" align="center"></el-table-column>
       <el-table-column type="index" label='序号' align="center" width="100"></el-table-column>
       <el-table-column prop="name" label="品类名称" align="center"></el-table-column>
       <el-table-column label="操作" align="center">
         <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="brandEdit(scope.row)">修改</el-button>
           <el-button size="mini" type="danger" @click="brandDelete(scope.row)">删除</el-button>
         </template>
       </el-table-column>
    </el-table>
    <!-- 新增 品类-->
    <el-dialog title="新增/修改品类" :visible.sync="dialogCategory">
      <el-form  label-width="70px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
        <el-form-item label="品牌名称">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCategory=false">取 消</el-button>
        <el-button type="primary" @click="sureAddCategory(ruleForm)" v-if='isAdd'>新增</el-button>
        <el-button type="primary" @click="sureEditCategory(ruleForm)" v-else>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tableData:null,
      isAdd:false,
      pageSize:0,
      pages:0,
      searchValue:'',
      dialogCategory:false,
      ruleForm:{
        name:""
      },
      multipleSelection:[]
    }
  },
  created(){
    this.loadCatList()
  },
  methods:{
    loadCatList(params){
      this.$http.get('/admin/product/catList',{
        params:params
      }).then(res=>{
        this.tableData=res.data.data;
        this.pageSize=res.data.per_page;
        this.pages=res.data.total;
      })

    },
    handleSelectionChange(val){
      this.multipleSelection=[];
      var id=this.multipleSelection;
      val.forEach((val,i)=>{
        id.push(val.id);
      })
    },
    // 添加品类
    addCategory(){
      this.ruleForm={name:""}
      this.dialogCategory=true;
      this.isAdd=true;
    },
    sureAddCategory(ruleForm){
      this.dialogCategory=false;
      this.$http.post('/admin/product/catAdd',ruleForm).then(res=>{})
      this.loadCatList();
    },
    brandEdit(row){
      this.isAdd=false;
      this.dialogCategory=true;
      this.ruleForm={name:row.name,id:row.id};
    },
    sureEditCategory(row){
      this.dialogCategory=false;
      this.$http.post('/admin/product/catEdit',row).then(res=>{})
      this.loadCatList()
    },
    brandDelete(row){
      var params=row.id||this.multipleSelection.join(','),
          that=this;
        this.$confirm('确认删除品类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/admin/product/catDel',{
            id:params
          }).then(
            function(res){
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.loadCatList();
            }
          )
        })
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
  .search{
    float: left;
    width: 20%;
  }
</style>
