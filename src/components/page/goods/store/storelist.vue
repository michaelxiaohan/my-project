<template>
   <div>
     <!-- 编辑新增 -->
     <section v-if='showDetail'>
                 <div>
                   <el-button @click="cancelUpdateImg">返回</el-button>
                   <el-button type="primary" @click="sureAddImg(ruleForm)" v-if='editImg||dialogAddImage'>保存</el-button>
                   <el-button type="primary" style="float:right;" @click='lookProduct=false;editImg=true;' v-if='lookProduct' v-permission="'goods-store-storelist-edit'">编辑</el-button>
                 </div>
                 <div style="display:flex;justify-content:center;">
                     <div>
                       <el-upload
                           class="avatar-uploader"
                           action="/admin/upload/upload"
                           list-type="picture-card"
                           :on-progress="handleProgress"
                           :show-file-list="false"
                           :on-success='successUpload'
                           :headers='headers'
                           :disabled='lookProduct'
                            >
                             <img v-if="ruleForm.img_url" :src="ruleForm.img_url" style="width:148px;height:148px;">
                             <i v-else class="el-icon-plus"></i>
                       </el-upload>
                        <el-progress  :percentage="upStatus" v-if='showProgress'></el-progress>
                        <div style="text-align:center;margin-top:10px;">商品图片</div>
                     </div>
                     <el-form label-width="80px" style='width: 400px; margin-left:50px;':rules="rules" ref="ruleForm" :model='ruleForm'>
                       <el-form-item label="商品名称" prop="product_name">
                         <el-input v-model="ruleForm.product_name" :disabled='lookProduct'></el-input>
                       </el-form-item>
                       <el-form-item label="所属品牌" prop="brand_id">
                         <el-select placeholder="请选择品牌" v-model='ruleForm.brand_id' :disabled='lookProduct'>
                             <el-option :label="item.brand_name" :value="item.brand_id" :key='i' v-for='(item,i) in brands'></el-option>
                         </el-select>
                       </el-form-item>
                       <el-form-item label="所属品类" prop="cat_id">
                         <el-select placeholder="请选择品类" v-model="ruleForm.cat_id" :disabled='lookProduct'>
                             <el-option :label="item.name" :value="item.id" :key='i' v-for='(item,i) in categorys'></el-option>
                         </el-select>
                       </el-form-item>
                       <el-form-item label="当前状态" v-if='editImg'>
                         <el-radio-group v-model="ruleForm.status" :disabled='lookProduct'>
                           <el-radio :label="0">待上架</el-radio>
                           <el-radio :label="1">已上架</el-radio>
                           <el-radio :label="-1">已下架</el-radio>
                         </el-radio-group>
                       </el-form-item>
                       <el-form-item label="已选标签">
                         <!-- 自定义组件 -->
                         <tag-select
                         :selectTags='selectTags'
                         :selectTagId='selectTagId'
                         :tagData='tagData'
                         :editImg="editImg"
                         :lookProduct='lookProduct'
                         noOccasion='true'
                         >
                         </tag-select>
                       </el-form-item>
                       <el-form-item label="卖点" prop='describe'>
                         <el-input v-model="ruleForm.describe" :disabled='lookProduct'></el-input>
                       </el-form-item>
                     </el-form>
                 </div>

     </section>
     <section v-else>
        <div style="margin-bottom:10px;">
          <span style="margin-left:10px;">筛选条件</span>
          <el-select v-model="activeBrand" placeholder="请选择品牌" clearable class="width-15">
            <el-option v-for="item in brands" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id"></el-option>
          </el-select>
          <el-select v-model="activeCategorys" placeholder="请选择品类" clearable class="width-15">
            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="activeStatus" placeholder="请选择状态" clearable class="width-15">
            <el-option v-for="item in statusArr" :key="item.status" :label="item.name" :value="item.status"></el-option>
          </el-select>
          <el-input placeholder="请输入商品信息搜索" v-model="searchValue" class="search" clearable>
            <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
          </el-input>
          <el-button @click='addProduct' v-permission="'goods-store-storelist-add'"style="float:right;">添加商品</el-button>
        </div>
<!-- 表格组件 -->
        <el-table ref="multipleTable" :data="tableData" border>
           <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
           <el-table-column prop="img_url" label="图片" align="center">
              <template slot-scope="scope">
                  <img :src="scope.row.img_url" style="height:100px;width:80px;" @click='pictureClick(scope.row.img_url)'>
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
                <el-button v-if="scope.row.status==1" size="small" type="success">已上架</el-button>
                <el-button v-else-if="scope.row.status==-1" size="small" type="success">已下架</el-button>
                <el-button v-else size="small" type="info">待上架</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="operationn" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" class="mar_5" @click="handleLook(scope.row)" v-permission="'goods-store-storelist-look'">查看</el-button>
                <el-button size="mini" class="mar_5" @click="handleUpdate(scope.row)" v-permission="'goods-store-storelist-edit'">编辑</el-button>
                <el-button size="mini" class="mar_5" @click='upAndDown(scope.row)' v-if="scope.row.status==1" v-permission="'goods-store-storelist-down'">下架</el-button>
                <el-button size="mini" class="mar_5" @click='upAndDown(scope.row)' v-else v-permission="'goods-store-storelist-up'">上架</el-button>
                <el-button size="mini" class="mar_5" @click="handleDelete(scope.row)" v-permission="'goods-store-storelist-delete'">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogImg" width='650px' >
          <img width="100%" :src="dialogImgSrc">
        </el-dialog>
<!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
        </div>
      </section>
    </div>

</template>
<script>
import tagSelect from '@/components/utilcomponent/tagSelect'
import {tagColor,formatData} from '@/utils/formatTags.js'
import { getAuthKey,getSessionId} from '@/utils/auth'
  export default {
    data(){
      return{
        tagData:null,
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        dialogFormVisible:false,
        dialogImg:false,//图片点击放大
        dialogImgSrc:'',//图片点击放大
        dialogAddImage:false,
        innerVisible:false,
        dialogImageUrl:'',
        selectTags:[],
        selectTagId:[],
        imgListParams:{
          status:'',
          page:1
        },
        lookProduct:'',
        defaultProps:{
          children:'child',
          label:'name'
        },
        editImg:false,//是否从编辑按钮进入弹窗
        showDetail:false,
        editRowDate:{
          create_time:'',
          tags:''
        },
        ruleForm:{},//表单
        rules:{//表单验证
          product_name:[{required: true, message: '请输入产品名称', trigger: 'blur' }],
          brand_id:[{ required: true, message: '请选择品牌', trigger: 'change'}],
          cat_id:[{ required: true, message: '请选择品类', trigger: 'change',type:'number'}],
          describe:[{required: true, message: '请输入卖点', trigger: 'blur' }]
        },
        headers:{
          authKey:getAuthKey(),
          sessionId:getSessionId()
        },
        searchValue:'',
        activeStatus:'',
        statusArr:[{name:'待上架',status:0},{name:'已上架',status:1},{name:'已下架',status:-1}],
        activeBrand:'',
        activeCategorys:'',
        brands:'',//品牌
        categorys:'',//品类
        upStatus:60,//上传进度
        showProgress:false
      }
    },
    components:{tagSelect},
    created(){
      this.loadImgList(this.imgListParams)
    },
    methods:{
//重新加载数据方法
      loadImgList(params){
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
              if(val.brand_id==item.brand_id){
                return item.brand_name
              }
            })
            val.cat_name=categorys.map((item)=>{
              if(val.cat_id==item.id){
                return item.name
              }
            })
          })
          this.tableData=formatData(store);
          this.pages=goods.data.total;
          this.pageSize=goods.data.per_page;
          this.brands=barnds;
          this.categorys=categorys;
        }))
      },
//图片点击放大事件
      pictureClick(img_url){
        this.dialogImgSrc=img_url;
        this.dialogImg=true;
      },
//图片上传成功回调
      successUpload(res){
        this.upStatus=100;
        setTimeout(()=>{this.showProgress=false},500);
        this.ruleForm.img_url=res.data.url;
      },
      handleProgress(){
        this.showProgress=true;
        this.upStatus=60;
      },
      handleTagClose(tag){
        this.selectTagId.splice(this.selectTagId.indexOf(tag.tag_id), 1);
        this.selectTags.splice(this.selectTags.indexOf(tag), 1);
      },
//新增图片按钮
      addProduct(){
        this.dialogAddImage=true;
        this.showDetail=true;
        this.lookProduct=false;
        this.ruleForm={img_url:''};
        this.selectTags=[];
        this.selectTagId=[];
        this.$http.get('/admin/tag/tagTree').then((res)=>{
            this.tagData=res.data.data;
          })
      },
//取消编辑或新增
      cancelUpdateImg(){
        this.loadImgList(this.imgListParams);
        this.showDetail=false;
        this.editImg=false;
        this.dialogAddImage=false;
      },
//确定新增或编辑图片按钮
      sureAddImg(ruleForm){
        let tags=this.selectTagId.join(',');
        ruleForm.tags=tags;
        var url=this.editImg?'/admin/product/productEdit':'/admin/product/productAdd',
            params=this.collectParams(['cat_id','brand_id','product_name','img_url','describe','product_id','status','tags'],ruleForm),
            request=this.$http;
               request.post(url,params).then((res)=>{
                 this.loadImgList(this.imgListParams);
                 this.showDetail=false;
                 this.editImg=false;
               })
      },
//删除图片事件
      handleDelete(row){
        var params=row.product_id||this.multipleSelection.join(',');
        var that=this;
        this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/admin/product/productDel',{
            product_id:params
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
//查看按钮
      handleLook(row){
        this.$http.get('/admin/tag/tagTree').then((res)=>{
            this.lookProduct=true;
            this.showDetail=true;
            this.selectTags=row.tags;
            this.ruleForm=row;
            this.tagData= tagColor(res.data.data);
        })
      },
//表格编辑事件
      handleUpdate(row){
        this.editImg=true;
        this.showDetail=true;
        this.lookProduct=false;
        this.ruleForm=row;
        this.selectTags=row.tags;
        this.selectTagId=[];
        row.tags.forEach((item,index)=>{
          this.selectTagId.push(item.tag_id)
        })
        this.dialogAddImage=true;
        this.$http.get('/admin/tag/tagTree').then((res)=>{
            this.tagData=tagColor(res.data.data);
        })
      },
// 上架、下架
      upAndDown(row){
        let status=row.status==1?-1:1,
            confirm=row.status==1?'确定下架该商品？':'确定上架该商品？';
          this.$confirm(confirm, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/admin/product/productStatus',{
              product_id:row.product_id,
              status:status
            }).then((res)=>{
                this.loadImgList(this.imgListParams)
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
        this.loadImgList(this.imgListParams)
      },
//过滤提交给后台的参数
      collectParams(expect,form){
        let doneObj={};
        expect.forEach((item)=>{
          doneObj[item]=form[item]
        });
        return doneObj
      },
// 搜索
      search(val){
        let params={
          brand_id:this.activeBrand,
          cat_id:this.activeCategorys,
          status:this.activeStatus,
          product_name:val
        };
        this.imgListParams=Object.assign(this.imgListParams,params)
        this.loadImgList(this.imgListParams)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  // .addButton {
  //     margin-bottom: 10px;
  //     float: right;
  // }

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
  .search{
    width: 25%;
  }
</style>
