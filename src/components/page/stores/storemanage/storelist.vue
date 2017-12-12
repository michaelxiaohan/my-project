<template>
   <div>
     <!-- 编辑新增 -->
     <section v-if='dialogAddImage'>
       <el-button @click="cancelUpdateStore" style="margin-bottom:10px;">返回</el-button>
       <el-tabs type="border-card" :value="tabIndex">
        <el-tab-pane label="店铺信息">
          <div style="margin-bottom:20px;">
            <el-button type="primary" @click="sureAddStore(ruleForm)" v-if='editStore||addNewStore'>保存</el-button>
            <el-button type="primary" style="float:right" v-if='lookStore' @click='handleUpdate' v-permission="'stores-storemanage-storelist-editstore'">编辑</el-button>
          </div>
          <div style="display:flex;justify-content:center;">
              <el-form label-width="80px" style='width: 400px; margin-left:50px;' :label-width="'100px'" :model='ruleForm'>
                <el-form-item label="账户名称" prop="username">
                  <el-input v-model="ruleForm.store_name" :disabled='lookStore'></el-input>
                </el-form-item>
                <el-form-item label="店铺电话" prop="product_name">
                  <el-input v-model="ruleForm.tel" :disabled='lookStore'></el-input>
                </el-form-item>
                <el-form-item label="店铺地址">
                  <v-distpicker wrapper='addressSelect'
                  :disabled='lookStore'
                   @province='provinceSelected'
                   @city='citySelected'
                   @area='areaSelected'
                   :province='parseInt(ruleForm.province_id)'
                   :city="parseInt(ruleForm.city_id)">
                 </v-distpicker>
                  <el-input type='textarea' v-model="ruleForm.address" :disabled='lookStore'style="width:300px;margin-top:10px;" placeholder='请输入详细地址'></el-input>
                </el-form-item>
                <el-form-item label="店长姓名" prop="realname">
                  <el-input v-model="ruleForm.shopowner_name" :disabled='lookStore'></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="product_name">
                  <el-input v-model="ruleForm.phone" :disabled='lookStore'></el-input>
                </el-form-item>
                <el-form-item label="店铺账号" prop='remark'>
                  <el-input v-model="ruleForm.user_name" :disabled='lookStore'></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input  v-model="ruleForm.password" style="width:65%;" :disabled='lookStore'></el-input>
                </el-form-item>
                <el-form-item label="当前状态">
                  <el-radio-group v-model="ruleForm.account_status" :disabled='lookStore'>
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="店员信息">
            <el-button size="mini" style="margin:10px;"@click='addNewGuide' type="success" v-permission="'stores-storemanage-storelist-addguide'">新增店员</el-button>
          <el-table  :data="guiderData" border>
             <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
             <el-table-column label="员工照片" align="center">
               <template slot-scope="scope">
                 <img :src="scope.row.img_url" style="height:100px;width:80px;">
               </template>
             </el-table-column>
              <el-table-column prop="user_name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="job_number" label="工号" align="center" ></el-table-column>
              <el-table-column prop="role" label="岗位" align="center"></el-table-column>
              <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
              <el-table-column prop="operationn" label="操作" align="center" width='350'>
                <template slot-scope="scope">
                  <el-button size="mini" @click="lookUser(scope.row)" v-permission="'stores-storemanage-storelist-lookguide'">查看</el-button>
                  <el-button size="mini" @click="editGuide(scope.row)" v-permission="'stores-storemanage-storelist-editguide'">编辑</el-button>
                  <el-button size="mini" @click="removeGuide(scope.row)" v-permission="'stores-storemanage-storelist-deleteguide'">撤换</el-button>
                </template>
              </el-table-column>
          </el-table>
          <el-dialog width='30%' title="查看/编辑店员" :visible.sync="dialogGuider">
            <div style="display:flex">
              <div>
                <el-upload
                    class="avatar-uploader"
                    action="/admin/upload/upload"
                    list-type="picture-card"
                    :show-file-list="false"
                    :on-success='successUpload'
                    :headers='headers'
                    :disabled='lookGuide'
                     >
                      <img v-if="guideForm.img_url" :src="guideForm.img_url" style="width:148px;height:148px;">
                      <i v-else class="el-icon-plus"></i>
                </el-upload>
                 <div style="text-align:center;margin-top:10px;">店员图片</div>
              </div>
              <el-form label-width="80px" style='width: 400px;' :label-width="'100px'" :model='guideForm'>
                <el-form-item label="员工姓名" prop="username">
                  <el-input v-model="guideForm.user_name" :disabled='lookGuide'></el-input>
                </el-form-item>
                <el-form-item label="员工编号" prop="product_name">
                  <el-input v-model="guideForm.job_number" :disabled='lookGuide'></el-input>
                </el-form-item>
                <el-form-item label="岗位名称" prop="product_name">
                  <el-input v-model="guideForm.role" :disabled='lookGuide'></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop='remark'>
                  <el-input v-model="guideForm.phone" :disabled='lookGuide'></el-input>
                </el-form-item>
                <el-form-item label="自我介绍" prop='remark'>
                  <el-input type='textarea' v-model="guideForm.introduce" :disabled='lookGuide'></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div slot='footer'>
              <el-button @click='cancleSaveGuide'>取消</el-button>
              <el-button type="primary" @click='sureEditGuide' v-if='editGuider'>保存</el-button>
            </div>
         </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="设备信息"></el-tab-pane>
      </el-tabs>
     </section>
     <section v-else>
        <div class="searchFilter">
          <div class="left" style="line-height:3;">筛选条件</div>
          <v-distpicker
             wrapper='left'
             @province='provinceSearch'
             @city='citySearch'
             hide-area>
         </v-distpicker>
          <el-input placeholder="请输入店铺名称搜索" v-model="searchValue" class="search left">
            <el-button slot="append" icon="el-icon-search" @click='search(searchValue)'></el-button>
          </el-input>
        </div>
        <div class="addButton">
          <el-button @click='addStore' v-permission="'stores-storemanage-storelist-add'">创建店铺</el-button>
        </div>
<!-- 表格组件 -->
        <el-table ref="multipleTable" :data="tableData" border>
           <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
            <el-table-column prop="store_name" label="店铺名称" align="center"></el-table-column>
            <el-table-column prop="address" label="店铺地址" align="center" ></el-table-column>
            <el-table-column prop="tel" label="店铺电话" align="center"></el-table-column>
            <el-table-column prop="user_name" label="店长姓名" align="center"></el-table-column>
            <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="operationn" label="操作" align="center" width='350'>
              <template slot-scope="scope">
                <el-button size="mini" @click="look(scope.row)" v-permission="'stores-storemanage-storelist-managestore'">管理店铺</el-button>
                <el-button size="mini" @click="manageGuide(scope.row)" v-permission="'stores-storemanage-storelist-manageuser'">管理店员</el-button>
                <el-button size="mini" @click="manageDevice(scope.row)" v-permission="'stores-storemanage-storelist-managedevice'">管理设备</el-button>
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
import VDistpicker from 'v-distpicker'
import { getAuthKey,getSessionId} from '@/utils/auth'
  export default {
    components: { VDistpicker },
    data(){
      return{
        pages:null,//总页数
        pageSize:null,//每页条数
        tableData:null,
        guiderData:'',
        dialogAddImage:false,
        dialogGuider:false,
        storeListParams:{
          status:'',
          page:1
        },
        ruleForm:{},//表单
        guideForm:{},//店员信息
        searchValue:'',
        editStore:false,
        lookStore:false,
        lookGuide:false,
        editGuider:false,
        addNewStore:false,
        tabIndex:'',
        headers:{
          authKey:getAuthKey(),
          sessionId:getSessionId()
        },
        addressId:{}
      }
    },
    created(){
      this.loadStoreList(this.storeListParams)
    },
    methods:{
//重新加载所有店铺方法
      loadStoreList(params){
          this.$http.get('/admin/store/storeList',{params:params}).then((res)=>{
            this.tableData=res.data.data;
            this.pageSize=res.data.per_page;
            this.pages=res.data.total;
          })
      },
//加载店铺店铺的详情
      loadStoreDetail(row){
        let axios=this.$http;
        axios.all([
          axios.get('/admin/store/storeDetail',{params:{store_id:row.store_id}}),
          axios.get('/admin/store/userList',{params:{store_id:row.store_id}})
        ]).then(axios.spread((detail,guider)=>{
          this.ruleForm=detail.data.data;
          this.guiderData=guider.data.data.data;
          this.dialogAddImage=true;
          this.lookStore=true;
        }))
      },
//新增店铺按钮
      addStore(){
        var that=this;
        this.tabIndex='0';
        this.dialogAddImage=true;
        this.addNewStore=true;
        this.editStore=false;
        this.lookStore=false;
        this.ruleForm={};
      },
//取消编辑或新增
      cancelUpdateStore(){
        this.loadStoreList(this.storeListParams)
        this.dialogAddImage=false;
      },
//确定新增或编辑店铺按钮
      sureAddStore(ruleForm){
        var url=this.editStore?'/admin/store/storeEdit':'/admin/store/storeAdd',
            params=this.collectParams([
              'store_id','store_name',
              'tel','address',
              'user_name',
              'status',
              'shopowner_name',
              'password',
              'phone',
              'province_id',
              'city_id',
              'area_id'
            ],ruleForm),
            request=this.$http;
            Object.assign(params,this.addressId);
               request.post(url,params).then((res)=>{
                 this.loadStoreList();
                 this.dialogAddImage=false;
              })
      },

//管理店铺按钮
      look(row){
          this.tabIndex='0';
          this.loadStoreDetail(row);
      },
//管理店员按钮
      manageGuide(row){
        this.loadStoreDetail(row);
        this.tabIndex='1';
      },
//管理设备按钮
     manageDevice(row){
       this.loadStoreDetail(row);
       this.tabIndex='2';
     },
//表格编辑事件
      handleUpdate(){
        this.editStore=true;
        this.lookStore=false;
      },
      provinceSelected(data){
        this.addressId.province_id=data.code;
      },
      citySelected(data){
        this.addressId.city_id=data.code;
      },
      areaSelected(data){
        this.addressId.area_id=data.code;
      },
//改变页数
      handleCurrentChange(current){
        this.storeListParams.page=current;
        this.loadStoreList(this.storeListParams)
      },
// 图片上传成功回调
      successUpload(res){
        this.guideForm.img_url=res.data.url;
      },
//查看店员，不可编辑
      lookUser(row){
        this.guideForm=row;
        this.editGuider=false;
        this.dialogGuider=true;
        this.lookGuide=true;
      },
//加载店员
      loadUserList(){
          this.$http.get('/admin/store/userList',{params:{store_id:this.ruleForm.store_id}}).then((res)=>{
            this.guiderData=res.data.data.data;
          })
      },
//新增店员
      addNewGuide(){
        this.lookGuide=false;
        this.editGuider=false;
        this.dialogGuider=true;
        this.guideForm={img_url:'',store_id:this.ruleForm.store_id}
      },
//店员编辑
      editGuide(row){
        this.guideForm=row;
        this.lookGuide=false;
        this.editGuider=true;
        this.dialogGuider=true;
      },
//确认编辑店员
      sureEditGuide(){
        var url=this.editGuider?'/admin/store/userEdit':'/admin/store/userAdd',
            params=this.collectParams(['user_name','user_id','store_id','role','phone','job_number','introduce','img_url'],this.guideForm);
               this.$http.post(url,params).then((res)=>{
                 this.loadUserList()
                 this.dialogGuider=false;
              })
      },
//取消保存
      cancleSaveGuide(){
          this.dialogGuider=false;
          this.loadUserList();
      },
//撤换导购
      removeGuide(row){
          this.$confirm('确定撤换该店员？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/admin/store/userDel',{
              user_id:row.user_id,
              store_id:row.store_id
            }).then((res)=>{
                this.loadUserList()
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
            })
          })
      },
//过滤提交给后台的参数
      collectParams(expect,form){
        let doneObj={};
        expect.forEach((item)=>{
          doneObj[item]=form[item]
        });
        return doneObj
      },
//店铺搜索
      provinceSearch(data){
        this.storeListParams.province_id=data.code;
      },
      citySearch(data){
        this.storeListParams.city_id=data.code;
      },
      search(val){
        this.storeListParams.store_name=val;
        this.loadStoreList(this.storeListParams)
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
  .left{
    float: left;
    margin: 5px;
  }
  .search{
    width: 15%;
  }
  .addressSelect{
    width: 300px;
    display: flex;
  }
</style>
