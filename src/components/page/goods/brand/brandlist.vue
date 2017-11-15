  <template lang="html">
    <div>
      <header class="operation">
        <el-button @click='addBrand()'>添加品牌</el-button>
        <el-button>删除品牌</el-button>
      </header>
      <section class="search"></section>
      <!-- 表格 -->
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
         <el-table-column type="selection" align="center"></el-table-column>
         <el-table-column type="index" label='序号' align="center"></el-table-column>
         <el-table-column label="品牌LOGO" prop="logo" align="center">
           <template slot-scope="scope">
             <img :src="scope.row.logo" style="height:100px;">
           </template>
         </el-table-column>
         <el-table-column prop="brand_name" label="品牌名称" align="center"></el-table-column>
         <el-table-column prop="remark"label="品牌描述" align="center"></el-table-column>
         <el-table-column label="操作" align="center">
           <template slot-scope="scope">
             <el-button size="mini" @click='lookBrand(scope.row)'>查看</el-button>
             <el-button size="mini" type="primary" @click="brandEdit(scope.row)">编辑</el-button>
             <el-button size="mini" type="danger" @click="brandDelete(scope.row)">删除</el-button>
           </template>
         </el-table-column>
      </el-table>
      <!-- 编辑，查看，新增弹出框 -->
      <el-dialog title="新增" :visible.sync="dialogBrand">
        <el-form  label-width="70px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
          <el-form-item label="品牌名称">
            <el-input v-model="ruleForm.brand_name"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <template>
              <!-- 图片上传 -->
              <el-upload
                  :headers='headers'
                  class="avatar-uploader"
                  action="/admin/upload/upload"
                  list-type="picture-card"
                  :show-file-list="false"
                  :on-success='successUpload'
                  >
                    <img v-if="ruleForm.logo" :src="ruleForm.logo" style="height:148px;">
                    <i v-else class="el-icon-plus"></i>
              </el-upload>
            </template>
          </el-form-item>
          <el-form-item label="品牌描述">
            <el-input type="textarea" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdateBrand">取 消</el-button>
          <el-button type="primary" @click="sureEditBrand(ruleForm)" v-if='editBrand'>保存</el-button>
          <el-button type="primary" @click="sureAddBrand(ruleForm)" v-else>保存</el-button>
        </div>
      </el-dialog>
    </div>
  </template>

  <script>
  import { getAuthKey,getSessionId} from '@/utils/auth'
  export default {
    data(){
      return {
        tableData:null,
        multipleSelection:[],
        dialogBrand:false,
        editBrand:'',
        ruleForm:{//表格行数据
          logo:'',
          brand_name:'',
          remark:''
        },
        headers:{
          authKey:getAuthKey(),
          sessionId:getSessionId()
        }
      }
    },
    created(){
      this.loadBrandList()
    },
    methods:{
      loadBrandList(){
        this.$http.get('/admin/brand/brandList').then(res=>{
          this.tableData=res.data.data;
        })
      },
      //多选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //图片上传成功
      successUpload(res){
        this.ruleForm.logo=res.data.url;
      },
      //添加品牌
      addBrand(){
        this.ruleForm={
          logo:'',
          brand_name:'',
          remark:''
        }
        this.dialogBrand=true;
      },
      cancelUpdateBrand(){
        this.dialogBrand=false;
      },
      sureAddBrand(ruleForm){ //新增保存
        this.$http.post('/admin/brand/brandAdd',ruleForm).then(res=>{})
        this.dialogBrand=false;
        this.loadBrandList();
      },
      // 查看品牌
      lookBrand(row){
        this.ruleForm=row;
        this.dialogBrand=true;
      },
      //编辑品牌
      brandEdit(row){
        this.editBrand=true;
        this.ruleForm={
           brand_id:row.brand_id,
           brand_name:row.brand_name,
           logo:row.logo,
           remark:row.remark
        };
        this.dialogBrand=true;
      },
      //确认编辑
      sureEditBrand(row){
        this.$http.post('/admin/brand/brandEdit',row).then(res=>{})
        this.dialogBrand=false;
        this.loadBrandList();
      }
    }
  }
  </script>

  <style lang="scss" scoped>
    .operation{
      float: right;
      margin-bottom: 10px;
    }
  </style>
