<template>
   <el-row :gutter="10">
     <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <div class="addButton">
          <el-button type="primary" @click='addImage'>添加图片</el-button>
           <el-radio-group v-model="sync" @change="syncChange">
            <el-radio class="radio" label="">全部</el-radio>
            <el-radio class="radio" label="1">已同步</el-radio>
            <el-radio class="radio" label="0">未同步</el-radio>
          </el-radio-group>
        </div>

<!-- 表格组件 -->
        <el-table :data="tableData" border :default-sort="{prop: 'date', order: 'descending'}" @cell-click="shubiao">
         <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
         <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
         <el-table-column prop="img_url" label="图片" align="center">
            <template slot-scope="scope">
                <img :src="scope.row.img_url" style="height:100px;">
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签">
            <template slot-scope="scope">
                <el-tag v-for="tag in scope.row.tags" :key="tag.tag_id">{{tag.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status" size="small" type="success" @click="handleEdit(scope.row)">已同步</el-button>
              <el-button v-else size="small" type="info" @click="handleEdit(scope.row)">同步</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="operationn" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status" disabled size="small" type="primary" icon="edit"></el-button>
              <el-button v-else size="small" type="primary" icon="edit" @click="handleUpdate(scope.row)"></el-button>
              <el-button size="small" type="primary" icon="delete" @click="handleDelete(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>

<!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
        </div>
<!-- 编辑弹出框 -->
        <!-- <el-dialog title="编辑" :visible.sync="dialogFormVisible">
          <el-form :model="editRowDate" label-width="70px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="图片">
              <template>
                  <img :src="editRowDate.img_url" style="max-width:640px;">
              </template>
            </el-form-item>
            <el-form-item label="标签">
              <el-tree
              :data="tagData"
              :props="defaultProps"
              node-key="tag_id"
              @node-click="handleNodeClick"
              >
              </el-tree>
            </el-form-item>
            <el-form-item label="已有标签">
              <el-tag
                v-for="tag in editRowDate.tags"
                :key="tag.name"
                :closable="true"
                @close="handleTagClose(tag)"
              >
              {{tag.name}}
              </el-tag>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="remark" v-model='editRowDate.remark'>{{editRowDate.remark}}</el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelUpdateImg">取 消</el-button>
            <el-button type="primary" @click="sureUpdateImg(editRowDate)">确 定</el-button>
          </div>
        </el-dialog> -->
<!-- 新增或编辑图片 -->
        <el-dialog title="新增" :visible.sync="dialogAddImage">
          <el-form  label-width="70px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
            <el-form-item label="图片">
              <template>
                <!-- 图片上传 -->
                <img :src="ruleForm.img_url" v-if='editImg' style="max-width:640px;">
                <el-upload
                    class="avatar-uploader"
                    action="/admin/upload/uploadAdd"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :show-file-list="false"
                    :on-success='successUpload'
                    v-else>
                      <img v-if="ruleForm.img_url" :src="ruleForm.img_url" style="width:148px;">
                      <i v-else class="el-icon-plus"></i>
                </el-upload>
              </template>
            </el-form-item>
            <el-form-item label="选择标签" style="margin-top:100px;">
              <el-tree
              :data="tagData"
              :props="defaultProps"
              node-key="tag_id"
              @node-click="handleNodeClick"
              >
              </el-tree>
            </el-form-item>
            <el-form-item label="已选标签" class="tags">
              <div class="tagsContain">
                <el-tag
                  v-for="tag in selectTags"
                  :key="tag.name"
                  :closable="true"
                  @close="handleTagClose(tag)"
                >
                  {{tag.name}}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="remark" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelUpdateImg">取 消</el-button>
            <el-button type="primary" @click="sureAddImg(ruleForm)">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
</template>
<script>
import $ from 'jquery'
  export default {
    data(){
      return{
        tagData:null,
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        dialogFormVisible:false,
        dialogAddImage:false,
        dialogImageUrl:'',
        selectTags:[],
        selectTagId:[],
        imgListParams:{
          status:'',
          page:1
        },
        Img_id:'',//上传图片返回的id
        sync: '',
        defaultProps:{
          children:'child',
          label:'name'
        },
        editImg:false,//是否从编辑按钮进入弹窗
        editRowDate:{
          create_time:'',
          tags:''
        },
        ruleForm:{//备注
          remark:'',
          img_url:''
        }
      }
    },
    created(){
      this.loadImgList(this.imgListParams)
    },
    methods:{
      shubiao(row, column, cell, event){
        // if($(cell).find('img').length){
        //   $(cell).find('img').css(
        //     {
        //     'height':'640px',
        //     'width':'480px',
        //     'position':'absoulute'
        //
        // })
        // }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      loadImgList(params){//重新加载数据方法
        var that=this;
        this.$http.get('/admin/upload/uploadList',{
          params:params
        }).then(
          function(res){
            that.tableData=res.data.data.data;
            that.pages=res.data.data.total;
            that.pageSize=res.data.data.per_page;
          }
        )
      },
      syncChange(label){//筛选同步未同步数据
        this.imgListParams.status=label;
        this.loadImgList(this.imgListParams)
      },
      //图片上传成功回调
      successUpload(res){
        this.ruleForm.img_url=res.data.img_url;
        this.Img_id=res.data.id;
        this.$message(res.msg);
      },
      handleTagClose(tag){
        this.selectTagId.splice(this.selectTagId.indexOf(tag.tag_id), 1);
        this.selectTags.splice(this.selectTags.indexOf(tag), 1);
      },
      addImage(){//新增图片按钮
        var that=this;
        this.dialogAddImage=true;
        this.editImg=false;
        this.ruleForm={
          remark:'',
          img_url:''
        };
        this.selectTags=[];
        this.selectTagId=[];
        this.$http.get('/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
      },
      // cancelUpdateImg(){ //取消编辑
      //   this.dialogFormVisible=false;
      //   this.loadImgList(this.imgListParams);
      // },
      // sureUpdateImg(editRowDate){//编辑完成确定按钮
      //   var tags=this.selectTagId.join(','),
      //   that=this;
      //   this.$http.post('/admin/upload/saveTag',{
      //     id:this.Img_id,
      //     tag:tags,
      //     remark:editRowDate.remark
      //   }).then(
      //     function(res){
      //       that.dialogFormVisible=false;
      //       that.loadImgList(this.imgListParams)
      //     }
      //   )
      // },
      cancelUpdateImg(){ //取消编辑或新增
        this.dialogAddImage=false;
        this.loadImgList(this.imgListParams);
      },
      sureAddImg(ruleForm){//确定新增或编辑图片按钮
        var tags=this.selectTagId.join(','),
        that=this;
        if(this.Img_id==[]||tags==[]){
          this.$message({
          showClose: true,
          message: '标签或图片不能为空',
          type: 'warning'
        });
        }else{
          this.$http.post('/admin/upload/saveTag',{
            id:this.Img_id,
            tag:tags,
            remark:ruleForm.remark
          }).then(
            function(res){
              that.loadImgList(that.imgListParams);
              that.$message(res.data.msg);
              that.dialogAddImage=false;
            }
          )
        }
      },
      handleNodeClick(data){//标签树点击事件
        var that=this;
        var jundge=false;
        if(data.child==undefined){
          this.selectTags.forEach(function(v,i){
            if(v.name==data.name){
               jundge=true
            }
          })
          if(jundge){
            this.$message({
            showClose: true,
            message: '该标签已存在，请勿重复添加',
            type: 'warning'
          });
          }else{
            this.selectTags.push({name:data.name})
            this.selectTagId.push(data.tag_id)
          }

        }
      },
      handleDelete(row){//删除图片事件
        var that=this;
        this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/admin/upload/delUpload',{
            id:row.id
          }).then(
            function(res){
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.loadImgList(that.imgListParams)
            }
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleUpdate(row){ //表格编辑事件
        var that=this;
        this.editImg=true;
        this.Img_id=row.id;
        this.ruleForm=row;
        this.selectTags=row.tags;
        this.selectTagId=[];
        row.tags.forEach(function(item,index){
          that.selectTagId.push(item.tag_id)
        })
        this.dialogAddImage=true;
        this.$http.get('/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
        // var that=this;
        // this.Img_id=row.id;
        // this.editRowDate=row;
        // this.selectTags=row.tags;
        // this.selectTagId=[];
        // row.tags.forEach(function(item,index){
        //   that.selectTagId.push(item.tag_id)
        // })
        // this.dialogFormVisible=true;
        // this.$http.get('/admin/tag/tagTree').then(
        //   function(res){
        //     that.tagData=res.data.data;
        //   }
        // )
      },
      handleEdit(row){
        var that=this;
        if(row.status){
            this.$message({
            showClose: true,
            message: '已经同步到服务器！',
            type: 'warning'
          });
        }else{
          this.$confirm('是否同步到服务器?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/admin/upload/sycUpload',{
              id:row.id
            }).then(
              function(res){
                that.loadImgList(that.imgListParams)
                that.$message({
                  type: 'success',
                  message: '恭喜，同步到服务器成功!'
                });
              }
            )
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消同步'
            });
          });
        }

      },
      handleCurrentChange(current){//改变页数
        this.imgListParams.page=current;
        this.loadImgList(this.imgListParams)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .addButton {
      .el-button{
      margin-bottom: 10px;
    }
    .el-radio-group{
      float: right;
      margin-right: 20px;
    }
  }

  .el-tag{
    margin: 5px;
  }
  .pagination{
    text-align: center;
  }
  .tagsContain{
    display:inline-block;
    width:200px;
    border:1px solid #d1dbe5;
    min-height:36px;
    width:330px;
  }
</style>
