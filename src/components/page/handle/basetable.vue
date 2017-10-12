<template>
  <div>
        <div class="addButton">
          <el-button type="primary" @click='addImage'>添加图片</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 800px"
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
                <img :src="scope.row.img_url" @click="handleUpdate(scope.row)" style="height:100px;">
            </template>
          </el-table-column>
          <el-table-column
            prop="tags"
            label="标签"
            width="180">
            <template scope="scope">
                <span v-for="tag in scope.row.tags">|{{tag.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="200">
            <template scope="scope">
              <el-button
                v-if="scope.row.status"
                size="small"
                @click="handleEdit(scope.row)">
                已同步
              </el-button>
              <el-button
                v-else
                size="small"
                @click="handleEdit(scope.row)">
                同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
        <el-dialog title="编辑" :visible.sync="dialogAddImage">
          <el-form  label-width="70px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="图片">
              <template>
                <!-- 图片上传 -->
                <el-upload
                    action="/api/admin/upload/uploadAdd"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success='successUpload'>
                    <div class="addButton">
                      <i class="el-icon-plus"></i>
                    </div>
                </el-upload>
              </template>
            </el-form-item>
            <el-form-item label="选择标签">
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
        tableData:null,
        dialogFormVisible:false,
        dialogAddImage:false,
        dialogImageUrl:'',
        selectTags:[],
        selectTagId:[],
        Img_id:'',//上传图片返回的id
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
      var that=this;
      this.$http.get('/api/admin/upload/uploadList').then(
        function(res){
          that.tableData=res.data.data.data;
        }
      )
    },
    methods:{
      handleRemove(file, fileList) {

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;

      },
      //图片上传成功回调
      successUpload(res){
        this.Img_id=res.data.id;
      },
      handleTagClose(tag){
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
          alert('标签或图片不能为空')
        }else{
          this.$http.post('/api/admin/upload/saveTag',{
            id:this.Img_id,
            tag:tags
          }).then(
            function(res){
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
            alert('该标签已存在，请勿重复添加')
          }else{
            this.selectTags.push({name:data.name})
            this.selectTagId.push(data.tag_id)
          }

        }
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
        if(row.status){
          alert('已经同步到服务器')
        }else{
          this.$http.post('/api/admin/upload/sycUpload',{
            id:row.id
          }).then(
            function(res){
              alert('图片上传成功')
            }
          )
        }

      }
    }
  }
</script>
<style scoped>
  .addButton .el-button{
    margin-bottom: 10px;
  }
  .el-tag{
    margin: 5px;
  }
  tbody .el-button{
    margin-left: 36px;
  }
</style>
