<template>
  <div>
        <div class="addButton">
          <el-button type="primary" @click='addImage'>添加图片</el-button>
           <el-radio-group v-model="sync" @change="syncChange">
            <el-radio class="radio" label="">全部</el-radio>
            <el-radio class="radio" label="1">已同步</el-radio>
            <el-radio class="radio" label="0">未同步</el-radio>
          </el-radio-group>
        </div>
        <!-- 表格组件 -->
        <el-table
          :data="tableData"
          border
          :default-sort = "{prop: 'date', order: 'descending'}"
          >
          <el-table-column
           label="序号"
           type="index"
           width="100">
         </el-table-column>
         <el-table-column
           prop="create_time"
           label="创建时间"
           width="180">
         </el-table-column>
          <el-table-column
            prop="img_url"
            label="图片"
            width="180">
            <template scope="scope">
                <img :src="scope.row.img_url" style="height:100px;">
            </template>
          </el-table-column>
          <el-table-column
            prop="tags"
            label="标签"
            width="180">
            <template scope="scope">
                <el-tag v-for="tag in scope.row.tags" :key="tag.tag_id">{{tag.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            label="状态"
            width="200">
            <template scope="scope">
              <el-button
                v-if="scope.row.status"
                size="small"
                type="success"
                @click="handleEdit(scope.row)">
                已同步
              </el-button>
              <el-button
                v-else
                size="small"
                type="info"
                @click="handleEdit(scope.row)">
                同步
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="operationn"
            label="操作"
            width="180"
            align="center"
            >
            <template scope="scope">
              <el-button v-if="scope.row.status" disabled size="small" type="primary" icon="edit"></el-button>
              <el-button v-else size="small" type="primary" icon="edit" @click="handleUpdate(scope.row)"></el-button>
              <el-button v-if="scope.row.status" disabled size="small" type="primary" icon="delete"></el-button>
              <el-button v-else size="small" type="primary" icon="delete" @click="handleDelete(scope.row)"></el-button>
            </template>


          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="pages">
          </el-pagination>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
          <el-form :model="editRowDate" label-width="70px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="图片">
              <template>
                  <img :src="editRowDate.img_url">
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
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureUpdateImg">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增图片 -->
        <el-dialog title="新增" :visible.sync="dialogAddImage">
          <el-form  label-width="70px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="图片">
              <template>
                <!-- 图片上传 -->
                <el-upload
                    action="/api/admin/upload/uploadAdd"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :show-file-list="false"
                    :on-success='successUpload'>
                    <div>
                      <img v-if="imageUrl" :src="imageUrl">
                      <i v-else class="el-icon-plus"></i>
                    </div>
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
            <el-form-item label="已选标签">
              <el-tag
                v-for="tag in selectTags"
                :key="tag.name"
                :closable="true"
                @close="handleTagClose(tag)"
              >
              {{tag.name}}
              </el-tag>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddImage = false">取 消</el-button>
            <el-button type="primary" @click="sureAddImg">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    data(){
      return{
        tagData:null,
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        dialogFormVisible:false,
        dialogAddImage:false,
        imageUrl:'',
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
        editRowDate:{
          create_time:'',
          tags:''
        }
      }
    },
    created(){
      this.loadImgList(this.imgListParams)
    },
    methods:{
      handleRemove(file, fileList) {

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      loadImgList(params){//重新加载数据方法
        var that=this;
        this.$http.get('/api/admin/upload/uploadList',{
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
        this.imageUrl=res.data.img_url;
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
        this.selectTags=[];
        this.selectTagId=[];
        this.$http.get('/api/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
      },
      sureUpdateImg(){//编辑完成确定按钮
        var tags=this.selectTagId.join(','),
        that=this;
        this.$http.post('/api/admin/upload/saveTag',{
          id:this.Img_id,
          tag:tags
        }).then(
          function(res){
            that.dialogFormVisible=false;
          }
        )
      },
      sureAddImg(){//确定新增图片按钮
        var tags=this.selectTagId.join(','),
        that=this;
        if(this.Img_id==[]||tags==[]){
          this.$message({
          showClose: true,
          message: '标签或图片不能为空',
          type: 'warning'
        });
        }else{
          this.$http.post('/api/admin/upload/saveTag',{
            id:this.Img_id,
            tag:tags
          }).then(
            function(res){
              that.loadImgList(that.imgListParams)
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
          this.$http.post('/api/admin/upload/delUpload',{
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
      handleUpdate(row){ //表格行点击事件
        var that=this;
        this.Img_id=row.id;
        this.editRowDate=row;
        this.selectTags=row.tags;
        row.tags.forEach(function(item,index){
          that.selectTagId.push(item.tag_id)
        })
        this.dialogFormVisible=true;
        this.$http.get('/api/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
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
          this.$http.post('/api/admin/upload/sycUpload',{
            id:row.id
          }).then(
            function(res){
              that.loadImgList(that.imgListParams)
              that.$message({
                  showClose: true,
                  message: '恭喜，同步到服务器成功',
                  type: 'success'
              });
            }
          )
        }

      },
      handleCurrentChange(current){//改变页数
        this.imgListParams.page=current;
        this.loadImgList(this.imgListParams)
      }
    }
  }
</script>
<style scoped>
  .addButton .el-button{
    margin-bottom: 10px;
  }
  .addButton .radio:nth-of-type(1){
    margin-left: 490px;
  }
  .el-tag{
    margin: 5px;
  }
  .pagination{
    float:left;
  }
</style>
