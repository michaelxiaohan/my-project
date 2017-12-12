<template lang="html">
  <div v-if='editPermit'>
      <el-button @click='editPermit=false'>返回</el-button>
      <br>
      <div style="margin:20px;">角色名称： {{role}}</div>
      <el-tabs type="border-card" >
        <el-tab-pane label="功能权限">
          <el-button @click='savePermit' type='primary'>保存</el-button>
          <div class="features" style="margin-top:20px;">
            <section v-for='(permit,index) in permitlist' class="permitWrapper">
              <label class="checkAll checkbox">
                <input type="checkbox" :checked="permit.check" :value="permit.id" @change='checkAll(index,permit.id)'>
                <span style="font-size:25px;">{{permit.name}}</span>
              </label>
              <div v-for='(menu,i) in permit.child' style="margin:25px 25px 25px 40px;"class="checkSecond">
                <label class="menuChange checkbox">
                  <input type="checkbox" :checked="menu.check" :value="menu.id" @change='handleMenuChange(i,index,menu.id)'>
                  <span style="font-size:20px;">{{menu.name}}</span>
                </label>
                <div style="display:flex;"class="operates">
                  <label v-for="(operate,i) in menu.child"  class="handleOperate checkbox" style="margin-left:30px;" >
                    <input type="checkbox" :checked="operate.check" :value="operate.id "@change='changeOperate(operate.id)'>
                    <span style="width:200px;">{{operate.name}}</span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </el-tab-pane>
        <el-tab-pane label="范围设定">
          <el-button @click='savePermit' type='primary'>保存</el-button>
          <div class="brandRange">
              <div style="margin:15px;margin-left:0;">品牌范围</div>
              <div style="display:flex;margin-left:20px;">
                <label v-for="operate in rangeList.brand_list" :key="operate.brand_id" class="checkbox">
                  <input type="checkbox"
                  :checked="operate.check"
                  :value="operate.brand_id"
                  >
                  <span>
                    {{operate.brand_name}}
                  </span>
                </label>
              </div>
          </div>
            <div class="storeRange">
              <div style="margin:15px;margin-left:0;">店铺范围</div>
              <section v-for='(permit,index) in rangeList.store_list' class="permitWrapper">
                <label class="checkAll">{{index}}</label>
                <div v-for='(menu,i) in permit' style="margin:20px;"class="checkSecond">
                  <label class="menuChange">{{i}}</label>
                  <div style="margin: 15px 0;display:flex;">
                    <label v-for="(operate,i) in menu" style="margin-left:15px;" class="handleOperate checkbox">
                      <input type="checkbox" :checked="operate.check" :value="operate.store_id"><span>{{operate.store_name}}</span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
        </el-tab-pane>
      </el-tabs>

  </div>
  <div v-else>
    <header>
      <div class="operation">
        <el-button @click='addGroup' v-permission="'permission-group-grouplist-add'">创建角色</el-button>
      </div>
    </header>
    <el-table :data="tableData"  style="width: 100%" @expand-change='expandChange' :expand-row-keys='expandRowKeys' :row-key='getRowKey'>
      <el-table-column type="expand">
         <template slot-scope="props">
           <el-table :data="props.row.children":show-header='false' v-show='props.row.children' :cell-class-name='cellstyle'>
               <el-table-column prop="title"></el-table-column>
               <el-table-column>
                 <template slot-scope="scope">
                   <el-button size="mini" type="primary" @click="groupEdit(scope.row)" v-permission="'permission-group-grouplist-edit'">修改</el-button>
                   <el-button size="mini" type="danger" @click="groupDistri(scope.row)" v-permission="'permission-group-grouplist-auth'">分配权限</el-button>
                 </template>
               </el-table-column>
           </el-table>
         </template>
       </el-table-column>
       <el-table-column prop="title" label="角色名称"></el-table-column>
       <el-table-column label="操作">
         <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="groupEdit(scope.row)" v-permission="'permission-group-grouplist-edit'">修改</el-button>
           <el-button size="mini" type="danger" @click="groupDistri(scope.row)" v-permission="'permission-group-grouplist-auth'">分配权限</el-button>
         </template>
       </el-table-column>
    </el-table>
    <!-- 新增 品类-->
    <el-dialog title="新增/修改角色" :visible.sync="dialogGroup" width='600px'>
      <el-form  label-width="160px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
        <div v-if='isAdd'>
          <el-form-item label="是否在当前角色下新增">
            <el-select placeholder='' v-model="ruleForm.pid" style="width:100%;">
                <el-option :label="item.title" :value="item.id" :key='item.id' v-for='item in roleList'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="角色名称">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroup=false">取 消</el-button>
        <el-button type="primary" @click="sureAddCategory(ruleForm)" v-if='isAdd'>新增</el-button>
        <el-button type="primary" @click="sureEditGroup(ruleForm)" v-else>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listToTree} from '@/utils/datatotree'
import $ from 'jquery'
export default {
  data(){
    return{
      expandRowKeys:[],
      tableData:null,
      isAdd:false,
      pageSize:0,
      pages:0,
      dialogGroup:false,
      ruleForm:{
        name:""
      },
      roleList:'',
      editPermit:false,
      role:'',
      isIndeterminate:true,
      permitlist:[],
      rangeList:[]
    }
  },
  created(){
    this.loadGroupList()
  },
  updated(){
    $('.el-table__expanded-cell').css({'padding':'0 0 0 50px'})
    $('.morePadding div').css({'padding-left':'50px'})
  },
  methods:{
    cellstyle(row){
      if(row.columnIndex==0){
        return 'morePadding'
      }
    },
// 加载数据方法
    loadGroupList(params){
      this.$http.get('/admin/group/groupList',{
        params:params
      }).then(res=>{
        this.tableData=listToTree('id','pid',res.data.data);
        this.pageSize=res.data.per_page;
        this.pages=res.data.total;
        this.tableData.forEach((val,index)=>{//设置表格展开
          if(val.children){
            this.expandRowKeys.push(val.id)
          }
        })
      })
    },
//表格每一行Key值
    getRowKey(row){
      return row.id
    },
// 添加角色
    addGroup(){
      this.$http.get('/admin/group/groupList').then((res)=>{
        this.roleList=res.data.data;
        this.ruleForm={}
        this.dialogGroup=true;
        this.isAdd=true;
      })
    },
// 确定添加角色
    sureAddCategory(ruleForm){
      this.$http.post('/admin/group/groupAdd',ruleForm).then(res=>{
        this.dialogGroup=false;
        this.loadGroupList();
      })

    },
    getArr(){
      let featuresArr=[],brandArr=[],storeArr=[];
      $('.features').find('input').each(function(index,value){
        if($(value).is(':checked')){
          featuresArr.push($(value).val())
        }
      });
      $('.brandRange').find('input').each(function(index,value){
        if($(value).is(':checked')){
          brandArr.push($(value).val())
        }
      });
      $('.storeRange').find('input').each(function(index,value){
        if($(value).is(':checked')){
          storeArr.push($(value).val())
        }
      });
      return {
            id:this.groupId,
            rules:featuresArr.join(','),
            store_rule:storeArr.join(','),
            brand_rule:brandArr.join(',')
          }
    },
//保存编辑权限
    savePermit(){
      let params=this.getArr();
        this.$http.post('/admin/group/accessAdd',params).then((res)=>{
          this.loadPermit();
          this.$message({
          message: res.data.msg,
          type: 'success'
        });
        })
    },
// 权限详情
    loadPermit(){
      let request=this.$http;
      request.all([
        request.get('/admin/group/groupAccess',{params:{id:this.groupId}}),
        request.get('/admin/group/rangeAccess',{params:{id:this.groupId}})
      ]).then(request.spread((group,range)=>{
        this.permitlist=group.data.data;
        this.rangeList=range.data.data.data;
      }))
    },
//分配权限
    groupDistri(row){
      this.editPermit=true;
      this.role=row.title;
      this.groupId=row.id;
      this.loadPermit();
    },
//顶层全选
    checkAll(index,id){
      if($("input[value='"+id+"']").is(':checked')){
        $('.checkAll').eq(index).parent().find("input").each(function(i,value){
          $(value).prop("checked",true)
        })
      }else{
        $('.checkAll').eq(index).parent().find("input").each(function(i,value){
          $(value).prop("checked",false)
        })
      }

    },
//菜单选择
    handleMenuChange(i,index,id){
      if($("input[value='"+id+"']").is(':checked')){
          $("input[value='"+id+"']").parent().parent().siblings('.checkAll').find('input').prop("checked",true);
          $("input[value='"+id+"']").parent().siblings().find('input').each(function(num,value){
          $(value).prop("checked",true)
        })
      }else{
          $("input[value='"+id+"']").parent().siblings().find('input').each(function(num,value){
          $(value).prop("checked",false)
        })
      }
     },
//操作节点选择
     changeOperate(val){
        if($("input[value='"+val+"']").is(':checked')){
           $("input[value='"+val+"']").parents('.operates').siblings().find('input').prop("checked",true);
           $("input[value='"+val+"']").parents('.permitWrapper').find('.checkAll').find('input').prop("checked",true)
        }
     },
// 行编辑
    groupEdit(row){
      this.isAdd=false;
      this.dialogGroup=true;
      this.ruleForm=row;
    },
// 确定编辑
    sureEditGroup(row){
      this.dialogGroup=false;
      this.$http.post('/admin/group/groupEdit',{title:row.title,pid:row.pid,remark:row.remark,id:row.id})
      .then(res=>{
        this.loadGroupList()
      })
    },
    expandChange(){
      setTimeout(function(){
      $('.el-table__expanded-cell').css({'padding':'0 0 0 50px'})
      $('.morePadding div').css({'padding-left':'50px'})
    },0)
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
  .permitWrapper{
    font-size: 14px;
  }
  .checkbox {
      position: relative;
      height: 30px;
      display:block;
      min-width:120px;
  }
  .checkbox input[type='checkbox'] {
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      opacity: 0;
  }
  .checkbox span {
      position: absolute;
      left: 30px;
      top: 0;
      height: 20px;
      line-height: 20px;
  }
  .checkbox span:before {
      content: '';
      position: absolute;
      left: -30px;
      top: 0;
      width: 20px;
      height: 20px;
      border: 1px solid #ddd;
      border-radius: 50%;
      transition: all 0.3s ease;
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
  }

  .checkbox span:after {
      content: '';
      position: absolute;
      left: -22px;
      top: 3px;
      width: 6px;
      height: 12px;
      border: 0;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #fff;
      background: #fff;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transition: all 0.3s ease;
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
  }

  .checkbox input[type='checkbox']:checked + span:before {
      background: #4cd764;
      border-color: #4cd764;
  }
  .checkbox input[type='checkbox']:checked + span:after {
      background: #4cd764;
  }
</style>
