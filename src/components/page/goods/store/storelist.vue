<template>
   <div class="">
        <div class="addButton">
          <el-button @click='addProduct'>添加商品</el-button>
          <!-- <el-button @click='putProduct'>上架商品</el-button>
          <el-button @click='banProduct'>下架商品</el-button>
          <el-button @click='deleteProduct'>删除商品</el-button> -->
        </div>
<!-- 表格组件 -->
        <el-table :data="tableData" border :default-sort="{prop: 'date', order: 'descending'}">
           <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
           <el-table-column prop="img_url" label="图片" align="center">
              <template slot-scope="scope">
                  <img :src="scope.row.img_url" style="height:100px;">
              </template>
            </el-table-column>
            <el-table-column prop="product_name" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="brand_name" label="所属品牌" align="center" width='100'></el-table-column>
            <el-table-column prop="cat_name" label="所属品类" align="center" width='100'></el-table-column>
            <el-table-column prop="tags" label="标签" align="center">
              <template slot-scope="scope">
                  <el-tag v-for="tag in scope.row.tags" :key="tag.tag_id">{{tag.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态" width='100'>
              <template slot-scope="scope">
                <el-button v-if="scope.row.status" size="small" type="success">已上架</el-button>
                <el-button v-else size="small" type="info">未上架</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="operationn" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleLook(scope.row)">查看</el-button>
                <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button size="mini" @click="handleDelete(scope.row)">上架</el-button>
                <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
<!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
        </div>
<!-- 新增/编辑弹窗 -->
        <el-dialog title="新增" :visible.sync="dialogAddImage">
          <div style="display:flex;">
              <div class="productImg">
                <el-upload
                    class="avatar-uploader"
                    action="/admin/upload/upload"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :show-file-list="false"
                    :on-success='successUpload'
                    :headers='headers'
                     >
                      <img v-if="ruleForm.img_url" :src="ruleForm.img_url" style="width:148px;height:148px;">
                      <i v-else class="el-icon-plus"></i>
                </el-upload>
                 <div style="text-align:center;margin-top:10px;">商品图片</div>
              </div>
              <el-form label-width="70px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
                <el-form-item label="商品名称">
                  <el-input v-model="ruleForm.product_name"></el-input>
                </el-form-item>
                <el-form-item label="所属品牌">
                  <el-select placeholder="请选择品牌" v-model='ruleForm.brand_id' @change='changeBrand'>
                      <el-option :label="item.brand_name" :value="item.brand_id" :key='i' v-for='(item,i) in brands'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属品类">
                  <el-select placeholder="请选择品类" v-model="ruleForm.cat_id">
                      <el-option :label="item.name" :value="item.id" :key='i' v-for='(item,i) in categorys'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="当前状态" v-if='editImg'>
                  <el-radio-group v-model="ruleForm.resource">
                    <el-radio label="待上架"></el-radio>
                    <el-radio label="已上架"></el-radio>
                    <el-radio label="已下架"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="图片" style="float:left;">
                  <template>
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
                </el-form-item> -->
                <!-- <el-form-item label="选择标签">
                  <el-tree
                  :data="tagData"
                  :props="defaultProps"
                  node-key="tag_id"
                  @node-click="handleNodeClick"
                  >
                  </el-tree>
                </el-form-item> -->
                <!-- <el-dialog
                   width="30%"
                   title="选择标签"
                   :visible.sync="innerVisible"
                   append-to-body>
                   <div style="margin:10px;margin-left:0;"><el-button type="primary" size='mini'>已选标签</el-button></div>
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
                   <div style="margin:10px;margin-left:0;"><el-button type="primary" size='mini'>选择标签</el-button></div>
                   <el-collapse v-model="activeName" accordion>
                     <el-collapse-item v-for='(item,i) in tagData' :title="item.name" :name="i" :key='i'>
                       <el-tag v-for="tag in item.child" :key="tag.name">
                         <div @click='handleNodeClick(tag)'>{{tag.name}}</div>
                       </el-tag>
                     </el-collapse-item>
                   </el-collapse>
                </el-dialog> -->
                <tag-select :innerVisible='innerVisible' :selectTags='selectTags' :selectTagId='selectTagId' :tagData='tagData' :handleClose="handleClose">

                </tag-select>
                <el-form-item label="已选标签">
                  <div class="tagsContain" @click='logSelectTags'>
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
                <el-form-item label="卖点">
                  <el-input v-model="ruleForm.describe"></el-input>
                </el-form-item>
              </el-form>
          </div>
          <div style="text-align:right;">
            <el-button @click="cancelUpdateImg">取 消</el-button>
            <el-button type="primary" @click="sureAddImg(ruleForm)">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import tagSelect from '@/components/utilcomponent/tagSelect'
import { getAuthKey,getSessionId} from '@/utils/auth'
  export default {
    data(){
      return{
        tagData:null,
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        dialogFormVisible:false,
        dialogAddImage:false,
        innerVisible:false,
        dialogImageUrl:'',
        selectTags:[],
        selectTagId:[],
        imgListParams:{
          status:'',
          page:1
        },
        Img_id:'',//上传图片返回的id
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
          describe:'',
          img_url:'',
          product_name:'',
          cat_id:'',
          brand_id:''
        },
        headers:{
          authKey:getAuthKey(),
          sessionId:getSessionId()
        },
        activeName:'1',
        brands:'',//品牌
        categorys:''//品类
      }
    },
    components:{tagSelect},
    created(){
      this.loadImgList(this.imgListParams)
    },
    methods:{
      handleClose(){
        this.innerVisible=false;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      loadImgList(params){//重新加载数据方法
        var axios=this.$http;
        axios.all([
          axios.get('/admin/brand/brandList'),
          axios.get('/admin/product/catList'),
          axios.get('/admin/product/productList',{params:params})
        ]).then(axios.spread((brand,category,goods)=>{
          let store=goods.data.data,
              barnds=brand.data.data,
              categorys=category.data.data;
          store.forEach((val,index)=>{
            val.brand_name=barnds.map((item)=>{
              if(val.id==item.brand_id){
                return item.brand_name
              }
            })
            val.cat_name=barnds.map((item)=>{
              if(val.id==item.id){
                return item.name
              }
            })
          })
          this.tableData=store;
          this.pages=goods.data.total;
          this.pageSize=goods.data.per_page;
          this.brands=barnds;
          this.categorys=categorys;
        }))
      },
      //图片上传成功回调
      successUpload(res){
        this.ruleForm.img_url=res.data.url;
        this.Img_id=res.data.id;
        this.$message(res.msg);
      },
      handleTagClose(tag){
        this.selectTagId.splice(this.selectTagId.indexOf(tag.tag_id), 1);
        this.selectTags.splice(this.selectTags.indexOf(tag), 1);
      },
      addProduct(){//新增图片按钮
        var that=this;
        this.dialogAddImage=true;
        this.editImg=false;
        this.ruleForm={};
        this.selectTags=[];
        this.selectTagId=[];
        this.$http.get('/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
      },
      cancelUpdateImg(){ //取消编辑或新增
        this.dialogAddImage=false;
        this.loadImgList(this.imgListParams);
      },
      sureAddImg(ruleForm){//确定新增或编辑图片按钮
        console.log(ruleForm);
        // var tags=this.selectTagId.join(','),
        // that=this;
        // if(this.Img_id==[]||tags==[]){
        //   this.$message({
        //   showClose: true,
        //   message: '标签或图片不能为空',
        //   type: 'warning'
        // });
        // }else{
        //   this.$http.post('/admin/upload/saveTag',{
        //     id:this.Img_id,
        //     tag:tags,
        //     remark:ruleForm.remark
        //   }).then(
        //     function(res){
        //       that.loadImgList(that.imgListParams);
        //       that.$message(res.data.msg);
        //       that.dialogAddImage=false;
        //     }
        //   )
        // }
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
      handleLook(row){
          this.$router.push({ path: '/goods/store/storelist',query:{id:row.product_id} })
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
      },
      // 上架
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
      },
      logSelectTags(){
        this.innerVisible=true;
      },
      changeBrand(val){
        this.ruleForm.brand_id=val;
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
  .tagsContain{
    display:inline-block;
    width:200px;
    border:1px solid #d1dbe5;
    min-height:36px;
    width:330px;
  }
</style>
