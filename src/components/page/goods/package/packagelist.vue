<template>
   <div>
     <!-- 编辑新增 -->
     <section v-if='editImg||dialogAddImage'>
                 <div style="margin-bottom:20px;">
                   <el-button @click="cancelUpdateImg">返回</el-button>
                   <el-button type="primary" @click="sureAddImg(ruleForm)">保存</el-button>
                   <el-button type="primary" @click="lookProduct=false;editImg=true;" v-show='lookProduct' style="float:right;">编辑</el-button>
                 </div>
                 <div style="display:flex;">
                     <div class="productImg">
                       <el-upload
                           class="avatar-uploader"
                           action="/admin/upload/upload"
                           list-type="picture-card"
                           :show-file-list="false"
                           :on-success='successUpload'
                           :headers='headers'
                           :disabled='lookProduct'
                            >
                             <img v-if="ruleForm.img" :src="ruleForm.img" style="width:148px;height:148px;">
                             <i v-else class="el-icon-plus"></i>
                       </el-upload>
                        <div style="text-align:center;margin-top:10px;">模特图片</div>
                     </div>
                     <el-form label-width="80px" style='width: 600px; margin-left:50px;' ref="ruleForm" :model='ruleForm'>
                       <el-form-item label="套装名称" prop="name">
                         <el-input v-model="ruleForm.name" :disabled='lookProduct'></el-input>
                       </el-form-item>
                       <el-form-item label="当前状态" v-if='editImg||lookProduct'>
                         <el-radio-group v-model="ruleForm.status" :disabled='lookProduct'>
                           <el-radio :label="0">待上架</el-radio>
                           <el-radio :label="1">已上架</el-radio>
                           <el-radio :label="-1">已下架</el-radio>
                         </el-radio-group>
                       </el-form-item>
                       <el-form-item label="卖点" prop='remark'>
                         <el-input type="textarea" v-model="ruleForm.remark" :disabled='lookProduct'></el-input>
                       </el-form-item>
                       <el-form-item label="已选标签">
                         <!-- 自定义组件 -->
                         <tag-select
                         :selectTags='selectTags'
                         :selectTagId='selectTagId'
                         :tagData='tagData'
                         :editImg="editImg"
                         :lookProduct='lookProduct'
                         >
                         </tag-select>
                       </el-form-item>
                       <el-form-item label="商品信息">
                         <div style="display:flex;">
                           <div v-for='item in ruleForm.products' >
                             <img :src="item.img_url" style="width:100px;height:120px;margin:5px;">
                             <i @click='selectClose(item.product_id)' class="el-icon-circle-close-outline" v-if='editImg' style="vertical-align:top;"></i>
                           </div>
                            <i @click='selectGoods' class="el-icon-circle-plus" v-if='editImg||newAdd'></i>
                         </div>
                       </el-form-item>
                     </el-form>
                     <transition name="slide-fade">
                       <select-goods style="margin-left:10px;" :showGoods.sync='showGoods' :imgList='ruleForm.products' v-show='showGoods'></select-goods>
                     </transition>
                 </div>
     </section>
     <section v-else>
        <div class="searchFilter" style="float:left;margin-bottom:10px;">
          <span style="margin-left:10px;">筛选条件</span>
          <el-select v-for='(tag,i) in tagData' v-model="tag.active" :placeholder="'请选择'+tag.name" clearable :key='i' style="margin-left:5px;width:10%;">
            <el-option v-for="item in tag.child" :key="item.tag_id" :label="item.name" :value="item.tag_id"></el-option>
          </el-select>
          <el-input placeholder="请输入套装信息搜索" v-model="searchValue" class="search" clearable>
            <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
          </el-input>
        </div>
        <div class="addButton">
          <el-button @click='addProduct' v-permission="'goods-package-packagelist-add'">添加商品</el-button>
        </div>
<!-- 表格组件 -->
        <el-table ref="multipleTable" :data="tableData" border>
           <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
           <el-table-column prop="img" label="模特图片" align="center">
              <template slot-scope="scope">
                  <img :src="scope.row.img" style="height:100px;width:80px;">
              </template>
            </el-table-column>
            <el-table-column prop="name" label="套装名称" align="center"></el-table-column>
            <el-table-column prop="tags" label="标签" align="center">
              <template slot-scope="scope">
                  <el-tag v-for="tag in scope.row.tags" :key="tag.tag_id">{{tag.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="卖点" align="center" width='100'></el-table-column>
            <el-table-column prop="status" align="center" label="状态" width='100'>
              <template slot-scope="scope">
                <el-button v-if="scope.row.status==1" size="small" type="success">已上架</el-button>
                <el-button v-else-if="scope.row.status==-1" size="small" type="primary">已下架</el-button>
                <el-button v-else size="small" type="info">待上架</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="operationn" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleLook(scope.row)" v-permission="'goods-package-packagelist-look'">查看</el-button>
                <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="'goods-package-packagelist-edit'">编辑</el-button>
                <el-button size="mini" @click='upAndDown(scope.row)' v-if="scope.row.status==1" v-permission="'goods-package-packagelist-down'">下架</el-button>
                <el-button size="mini" @click='upAndDown(scope.row)' v-else v-permission="'goods-package-packagelist-up'">上架</el-button>
                <el-button size="mini" @click="handleDelete(scope.row)" v-permission="'goods-package-packagelist-delete'">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
<!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
        </div>
      </section>
    </div>

</template>
<script>
import tagSelect from '@/components/utilcomponent/tagSelect'
import selectGoods from '@/components/page/goods/package/selectGoods'
import {formatData,tagColor} from '@/utils/formatTags.js'
import { getAuthKey,getSessionId} from '@/utils/auth'
  export default {
    data(){
      return{
        tagData:null,
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        dialogAddImage:false,
        selectTags:[],
        selectTagId:[],
        imgListParams:{
          status:'',
          page:1
        },
        lookProduct:'',
        editImg:false,//是否从编辑按钮进入弹窗
        ruleForm:{},//表单
        headers:{
          authKey:getAuthKey(),
          sessionId:getSessionId()
        },
        searchValue:'',
        statusArr:[{name:'待上架',status:0},{name:'已上架',status:1},{name:'已下架',status:-1}],
        showGoods:false,
        newAdd:''//是否是新增
      }
    },
    components:{tagSelect,selectGoods},
    created(){
      this.loadImgList(this.imgListParams)
    },
    methods:{
//重新加载数据方法
      loadImgList(params){
        var axios=this.$http;
        axios.all([
          axios.get('/admin/package/packageList',{params:params}),
          axios.get('/admin/tag/tagTree')
        ]).then(axios.spread((list,tree)=>{
          this.tableData=formatData(list.data.data);
          this.pages=list.data.total;
          this.pageSize=list.data.per_page;
          if(!this.tagData){this.tagData=tagColor(tree.data.data);}
        }))
      },
//图片上传成功回调
      successUpload(res){
        this.ruleForm.img=res.data.url;
      },
      handleTagClose(tag){
        this.selectTagId.splice(this.selectTagId.indexOf(tag.tag_id), 1);
        this.selectTags.splice(this.selectTags.indexOf(tag), 1);
      },
//新增图片按钮
      addProduct(){
        var that=this;
        this.newAdd=true;
        this.dialogAddImage=true;
        this.editImg=false;
        this.lookProduct=false;
        this.ruleForm={img:'',products:[]};
        this.selectTags=[];
        this.selectTagId=[];
        this.$http.get('/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
      },
//取消编辑或新增
      cancelUpdateImg(){
        this.loadImgList(this.imgListParams)
        this.dialogAddImage=false;
        this.editImg=false;
        this.showGoods=false;
        this.newAdd=false;
      },
//确定新增或确定编辑套餐按钮
      sureAddImg(ruleForm){
        let tags=this.selectTagId.join(',');
        ruleForm.tags=tags;
        var url=this.editImg?'/admin/package/packageEdit':'/admin/package/packageAdd',
            params=this.collectParams(['name','img','remark','package_id','status','tags','products'],ruleForm),
            request=this.$http;
            params.products=params.products.join(',');

        this.$refs.ruleForm.validate((valid) => {
         if (valid) {
               request.post(url,params).then((res)=>{
                 this.loadImgList(this.imgListParams);
                 this.dialogAddImage=false;
                 this.editImg=false;
               })
         } else {
           return false;
         }
       });
      },
//删除图片事件
      handleDelete(row){
        var params=row.package_id||this.multipleSelection.join(',');
        var that=this;
        this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/admin/package/packageDel',{
            package_id:params
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
          // this.$router.push({path:'storelist/detail'})
          this.$http.get('/admin/package/packageDetail',{params:{package_id:row.package_id}}).then((res)=>{
            this.lookProduct=true;
            this.dialogAddImage=true;
            this.selectTags=row.tags;
            this.ruleForm=res.data.data;
          })
      },
//选择商品
       selectGoods(){
         this.showGoods=true;
       },
//删除商品
       selectClose(id){
         let products=this.ruleForm.products;
            this.ruleForm.products = products.filter((item,i)=>{
               return item.product_id!=id
             })
       },
//表格编辑事件
      handleUpdate(row){
          this.$http.get('/admin/package/packageDetail',{params:{package_id:row.package_id}}).then((res)=>{
            this.lookProduct=false;
            this.editImg=true;
            this.selectTags=row.tags;
            this.ruleForm=res.data.data;
          })
          this.selectTagId=[];
          row.tags.forEach((item,index)=>{
            this.selectTagId.push(item.tag_id)
          })
          this.dialogAddImage=true;
        //   this.$http.get('/admin/tag/tagTree').then((res)=>{
        //       this.tagData=res.data.data;
        // })
      },
// 上架、下架
      upAndDown(row){
        var status=row.status==1?-1:1,
            confirm=row.status==1?'确定下架该商品？':'确定上架该商品？';
          this.$confirm(confirm, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/admin/package/packageStatus',{
              package_id:row.package_id,
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
          if(item=='products'){
            form[item].forEach((val,i)=>{
              form[item][i]=val.product_id
            })
          }
            doneObj[item]=form[item]
        });
        return doneObj
      },
//搜索
      search(val){
        let searchTags=[]
        this.tagData.forEach((item)=>{
          if(item.active){
            searchTags.push(item.active)
          }
        })
        var params={
          tags:searchTags.join(','),
          name:val
        };
        this.imgListParams=Object.assign(this.imgListParams,params)
        this.loadImgList(this.imgListParams)
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
  .search{
    width: 20%;

  }
  .el-icon-circle-plus{
    font-size:35px;
    align-self: center;
  }
  .slide-fade-enter-active {
  transition: all 1s ease;
  }
  .slide-fade-leave-active {
    transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateX(10px);
    opacity: 0;
  }
</style>
