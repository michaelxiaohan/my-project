<template lang="html">
  <el-tabs type="border-card" @tab-click='tabClick'>
      <el-tab-pane :label="item.name" v-for='item in tagData' :key='item.tag_id' :id='item.tag_id'>
          <header>
            <el-input :placeholder="'请输入'+item.name+'名称搜索'" v-model="searchValue" class="search" clearable>
              <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
            </el-input>
            <div class="operation">
              <el-button @click='addTag' v-permission="'goods-tags-taglist-add'">添加{{item.name}}</el-button>
            </div>
          </header>
          <el-table :data="item.child" border style="width:100%">
             <el-table-column type="index" label='序号' align="center" width="100"></el-table-column>
             <el-table-column prop="name" :label="item.name+'名称'" align="center"></el-table-column>
             <el-table-column label="操作" align="center">
               <template slot-scope="scope">
                 <el-button size="mini" type="primary" @click="tagEdit(scope.row)" v-permission="'goods-tags-taglist-edit'">修改</el-button>
                 <el-button size="mini" type="danger" @click="tagDelete(scope.row)" v-permission="'goods-tags-taglist-delete'">删除</el-button>
               </template>
             </el-table-column>
          </el-table>
      </el-tab-pane>
      <el-dialog title="新增/修改标签" :visible.sync="dialogCategory">
        <el-form label-width="100px" style='width: 400px; margin-left:50px;' :rules="rules" ref="ruleForm" :model='ruleForm'>
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="色值" v-if="this.tabName=='颜色'">
            <el-color-picker v-model="ruleForm.color"></el-color-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCategory=false">取 消</el-button>
          <el-button type="primary" @click="sureAddTag(ruleForm)" v-if='isAdd'>新增</el-button>
          <el-button type="primary" @click="sureEditTag(ruleForm)" v-else>保存</el-button>
        </div>
      </el-dialog>
  </el-tabs>
</template>

<script>
import Lodash from 'lodash'
import {tagColor} from '@/utils/formatTags.js'
export default {
  data(){
    return{
      tagData:{},
      isAdd:false,
      pageSize:0,
      pages:0,
      searchValue:'',
      dialogCategory:false,
      ruleForm:{
        name:""
      },
      rules:{
        name:[
          { min: 1, max: 4, message: '标签名小于4个字', trigger: 'blur' }
        ]
      },
      multipleSelection:[],
      fiterData:'',
      tabName:''//当前tab
    }
  },
  created(){
    this.loadTagList()
  },
  methods:{
    tabClick(tab){
      this.ruleForm.pid=tab.$attrs.id;
      this.ruleForm;
      this.tabName=tab.label;
    },
    loadTagList(params){
      this.$http.get('/admin/tag/tagTree',{
        params:params
      }).then(res=>{
        this.tagData=tagColor(res.data.data);
        this.fiterData=Lodash.cloneDeep(res.data.data);//深拷贝
        this.pageSize=res.data.per_page;
        this.pages=res.data.total;
        this.ruleForm.pid=res.data.data[0].tag_id;
      })
    },
    //批量删除
    // handleSelectionChange(val){
    //   this.multipleSelection=[];
    //   var id=this.multipleSelection;
    //   val.forEach((val,i)=>{
    //     id.push(val.tag_id);
    //   })
    // },
// 添加标签
    addTag(){
      this.ruleForm.name='';
      if(this.tabName=='颜色'){
        this.ruleForm.color='#409EFF';
      }
      this.dialogCategory=true;
      this.isAdd=true;
    },
    //确定新增
    sureAddTag(ruleForm){
      this.$refs.ruleForm.validate((valid) => {
       if (valid) {
         if(ruleForm.color){
           ruleForm.name=`${ruleForm.name}|${ruleForm.color}`
         }
         delete ruleForm.color
         this.$http.post('/admin/tag/tagAdd',ruleForm).then(res=>{
           this.dialogCategory=false;
           this.loadTagList();
         })
       } else {
         return false;
       }
     });
    },
    // 编辑
    tagEdit(row){
      this.isAdd=false;
      this.dialogCategory=true;
      this.ruleForm={name:row.name,tag_id:row.tag_id,color:row.color};
    },
// 确定编辑
    sureEditTag(row){
      this.$refs.ruleForm.validate((valid) => {
       if (valid) {
         if(row.color){
           row.name=`${row.name}|${row.color}`
         }
         delete row.color
         this.$http.post('/admin/tag/tagEdit',row).then(res=>{
           this.loadTagList()
           this.dialogCategory=false;
         })
       } else {
         return false;
       }
     });

    },
// 搜索
    search(val){
      let pid=this.ruleForm.pid;
        this.tagData=Lodash.cloneDeep(this.fiterData);//深拷贝
        this.tagData.forEach((item,i)=>{
          if(item.tag_id==pid){
            item.child=item.child.filter((value)=>{
              return value.name.indexOf(val)>-1
            })
          }
        })
    },
    tagDelete(row){
      var params=row.tag_id||this.multipleSelection.join(','),
          that=this;
        this.$confirm('确认删除品类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/admin/tag/tagDel',{
            id:params
          }).then(
            function(res){
              that.$message({
                type: 'success',
                message: res.data.msg
              });
              that.loadTagList();
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
