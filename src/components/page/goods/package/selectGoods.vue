<template>
   <div style="position:absolute;background:white;width:50%;right:0;top:50px;">
        <div class="searchFilter">
          <span style="margin-left:10px;">筛选条件</span>
          <el-select v-model="activeBrand" placeholder="请选择品牌" clearable>
            <el-option v-for="item in brands" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id"></el-option>
          </el-select>
          <el-select v-model="activeCategorys" placeholder="请选择品类" clearable>
            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="activeStatus" placeholder="请选择状态" clearable>
            <el-option v-for="item in statusArr" :key="item.status" :label="item.name" :value="item.status"></el-option>
          </el-select>
          <el-input placeholder="请输入商品信息搜索" v-model="searchValue" class="search">
            <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
          </el-input>
          <br>
          <el-button style="margin-top:10px;" type="primary" size='mini' @click='saveChoose'>保存</el-button>
          <el-button style="margin-top:10px;" type="danger" size='mini' @click='closeChoose'>关闭</el-button>
        </div>
<!-- 表格组件 -->
        <el-table ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center"></el-table-column>
           <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
           <el-table-column prop="img_url" label="商品图片" align="center">
              <template slot-scope="scope">
                  <img :src="scope.row.img_url" style="height:100px;width:80px;">
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
        </el-table>
<!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
        </div>
    </div>

</template>
<script>
import { getAuthKey,getSessionId} from '@/utils/auth'
  export default {
    data(){
      return{
        tagData:null,
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        imgListParams:{
          status:'',
          page:1
        },
        searchValue:'',
        activeStatus:'',
        statusArr:[{name:'待上架',status:0},{name:'已上架',status:1},{name:'已下架',status:-1}],
        activeBrand:'',
        activeCategorys:'',
        brands:'',//品牌
        categorys:'',//品类
        selectes:'',
        goods:true
      }
    },
    props:['imgList','showGoods'],
    created(){
      this.loadImgList(this.imgListParams)
    },
    methods:{
      handleSelectionChange(val){
        this.selectes=val
      },
      closeChoose(){
        this.$parent.showGoods=false;
      },
      //保存选择
      saveChoose(){
        let imgList=this.imgList;
        this.$parent.showGoods=false;
        this.selectes.forEach((item,i)=>{
          let judge=imgList.filter((val)=>{
            return val.product_id==item.product_id
          })
          if(judge==false){
            imgList.push(item)
          }
        })


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
          this.tableData=store;
          this.pages=goods.data.total;
          this.pageSize=goods.data.per_page;
          this.brands=barnds;
          this.categorys=categorys;
        }))
      },
      handleCurrentChange(current){//改变页数
        this.imgListParams.page=current;
        this.loadImgList(this.imgListParams)
      },
      collectParams(expect,form){//过滤提交给后台的参数
        let doneObj={};
        expect.forEach((item)=>{
          doneObj[item]=form[item]
        });
        return doneObj
      },
      search(val){
        var params={
          brand_id:this.activeBrand,
          cat_id:this.activeCategorys,
          status:this.activeStatus,
          product_name:val
        };
        this.loadImgList(params)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-tag{
    margin: 5px;
  }
  .pagination{
    text-align: center;
  }
  .search{
    width: 30%;
    margin-left: 80px;
    margin-top: 10px;
  }
  .searchFilter{
      float:left;
      margin-bottom:10px;
  }

</style>
