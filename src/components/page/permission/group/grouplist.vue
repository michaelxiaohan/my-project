<template lang="html">
  <div v-if='editPermit'>
      <el-button @click='editPermit=false'>返回</el-button>
      <el-button @click='editPermit=false' type='primary'>保存</el-button><br>
      <div style="margin:20px;">角色名称： {{role}}</div>
      <el-tabs type="border-card" >
        <el-tab-pane label="功能权限">
          <!-- <label>
            <input type="checkbox" name="" value="">
          </label> -->

          <section v-for='(permit,index) in permitlist' class="checkAll">
            <el-checkbox  v-model="permit.check" :label="permit.id" @change='checkAll(permit.check,index)'>{{permit.name}}</el-checkbox>
            <div v-for='(menu,i) in permit.child' style="margin:20px;"class="checkSecond">
              <el-checkbox v-model="menu.check" :label="menu.id" @change="handleCheckAllChange(menu.check,i,permitlist,index)">{{menu.name}}</el-checkbox>
              <div style="margin: 15px 0;"></div>
               <!-- <el-checkbox-group v-model="checkedOperate" @change="handleCheckedOperate(menu)" style="margin-left:15px;" v-if='menu.child'> -->
              <el-checkbox style="margin-left:15px;"
                @change='changeOperate(operate.check,i)'
                v-if='menu.child'
                v-for="(operate,i) in menu.child"
                :key="operate.id"
                :label="operate.id"
                :checked='operate.check'
                class="operate">
                  {{operate.name}}
              </el-checkbox>
               <!-- </el-checkbox-group> -->
            </div>
          </section>
        </el-tab-pane>
        <el-tab-pane label="范围设定">
          <!-- <div>
              <div style="margin:15px;margin-left:0;">品牌范围</div>
               <el-checkbox v-for="operate in rangeList.brand_list" :key="operate.brand_id" :label="operate.brand_id" :checked='operate.check'>
                 {{operate.brand_name}}
               </el-checkbox>
          </div>
          <div>
            <div style="margin:15px;margin-left:0;">店铺范围</div>
            <section v-for='range in rangeList.store_list'>
              <el-checkbox  v-model="permit.check" @change='checkAll(permit)'>{{permit.name}}</el-checkbox>
              <div v-for='menu in permit.child' style="margin:20px;">
                <el-checkbox  v-model="menu.check"  @change="handleCheckAllChange(menu)">{{menu.name}}</el-checkbox>
                <div style="margin: 15px 0;"></div>
                 <el-checkbox-group v-model="checkedOperate" @change="handleCheckedOperate(menu)" style="margin-left:15px;" v-if='menu.child'>
                   <el-checkbox v-for="operate in menu.child" :key="operate.id" :label="operate.id" :checked='operate.check'>{{operate.name}}</el-checkbox>
                 </el-checkbox-group>
              </div>
            </section>
          </div> -->
        </el-tab-pane>
      </el-tabs>

  </div>
  <div v-else>
    <header>
      <div class="operation">
        <el-button @click='addGroup'>创建角色</el-button>
      </div>
    </header>
    <el-table :data="tableData" border style="width: 100%" @expand-change='expandChange'>
      <el-table-column type="expand" >
         <template slot-scope="props" v-if='props.row.children'>
           <el-table :data="props.row.children" border :show-header='false'>
               <el-table-column prop="title" align="center"></el-table-column>
               <el-table-column  align="center">
                 <template slot-scope="scope">
                   <el-button size="mini" type="primary" @click="groupEdit(scope.row)">修改</el-button>
                   <el-button size="mini" type="danger" @click="groupDistri(scope.row)">分配权限</el-button>
                 </template>
               </el-table-column>
           </el-table>
         </template>
       </el-table-column>
       <!-- <el-table-column type="index" label='序号' align="center" width="100"></el-table-column> -->
       <el-table-column prop="title" label="角色名称" align="center"></el-table-column>
       <el-table-column label="操作" align="center">
         <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="groupEdit(scope.row)">修改</el-button>
           <el-button size="mini" type="danger" @click="groupDistri(scope.row)">分配权限</el-button>
         </template>
       </el-table-column>
    </el-table>
    <!-- 新增 品类-->
    <el-dialog title="新增/修改角色" :visible.sync="dialogGroup" width='30%'>
      <el-form  label-width="150px" style='width: 400px; margin-left:50px;' v-model='ruleForm'>
        <div v-if='isAdd'>
          <el-form-item label="在当前角色下新增">
            <el-select placeholder="请选择角色" v-model="ruleForm.pid" style="width:100%;">
                <el-option :label="item.title" :value="item.id" :key='item.id' v-for='item in roleList'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="新增角色名称">
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
import _ from 'lodash'
export default {
  data(){
    return{
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
      rangeList:[],
      checkedOperate:[]
    }
  },
  created(){
    this.editPermit=true;
    this.groupDistri({id:1})
    this.loadGroupList()
  },
  methods:{
// 加载数据方法
    loadGroupList(params){
      this.$http.get('/admin/group/groupList',{
        params:params
      }).then(res=>{
        this.tableData=listToTree('id','pid',res.data.data);
        this.pageSize=res.data.per_page;
        this.pages=res.data.total;
      })
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
      this.dialogGroup=false;
      this.$http.post('/admin/group/groupAdd',ruleForm).then(res=>{})
      this.loadGroupList();
    },
//分配权限
    groupDistri(row){
      this.editPermit=true;
      this.role=row.title;
      this.$http.get('/admin/group/groupAccess',{
        params:{id:row.id}
      }).then(res=>{
        this.permitlist=res.data.data;
      })
      this.$http.get('/admin/group/rangeAccess',{
        params:{id:row.id}
      }).then(res=>{
        this.rangeList=res.data.data.data;
      })
    },
//顶层全选
    checkAll(val,index){
      if(val){
        $('.checkAll').eq(index).find('.el-checkbox').each(function(i,value){
          $(value).removeClass('is-checked').addClass("is-checked");
          $(value).find('span').first().removeClass('is-checked').addClass("is-checked");
        })
      }else{
        $('.checkAll').eq(index).find('.el-checkbox').each(function(i,value){
          $(value).removeClass('is-checked');
          $(value).find('span').first().removeClass('is-checked');
        })
      }
      $("input[type='checkbox']")
      // let arr=[]
      // permit.child.forEach((item)=>{
      //   if(permit.check){
      //     item.check=true
      //   }else{
      //     item.check=false
      //   }
      //   if(item.child){
      //     item.child.forEach((val)=>{
      //       arr.push(val.id)
      //     })
      //   }
      // })
      // if(permit.check){
      //   this.checkedOperate=this.checkedOperate.concat(arr);
      // }else{
      //   this.checkedOperate=_.difference(this.checkedOperate,arr)
      // }
    },
//全选
    handleCheckAllChange(val,i,permitlist,index){
      if(val){
        // $('.checkSecond').eq(index).find('.el-checkbox').each(function(i,value){
        //   $(value).removeClass('is-checked').addClass("is-checked").attr("aria-checked","true");
        //   $(value).find('span').first().removeClass('is-checked').addClass("is-checked");
        // })
        this.permitlist[index].child[i].child.forEach((item)=>{
          item.check=true;
        })
        console.log(this.permitlist);
      }else{
        // $('.checkSecond').eq(index).find('.el-checkbox').each(function(i,value){
        //   $(value).removeClass('is-checked').removeAttr('aria-checked');
        //   $(value).find('span').first().removeClass('is-checked');
        // })
      }
      // if(val){
      //   console.log($(this))
      //   console.log($('.checkSecond').siblings());
      // }

      // let arr=[];
      // menu.child.forEach((item)=>{
      //   arr.push(item.id)
      // })
      // if(menu.check){
      //   this.checkedOperate=this.checkedOperate.concat(arr);
      // }else{
      //   this.checkedOperate=_.difference(this.checkedOperate,arr)
      // }
     },
     changeOperate(val,index){
         if($('.operate').eq(index).hasClass('is-checked')){
              $('.operate').eq(index).removeClass('is-checked');
              $('.operate').eq(index).find('span').first().removeClass('is-checked');
         };
     },
//  单个单选框
    //  handleCheckedOperate(value) {
    //    let arr=[],
    //    checkedOperate=this.checkedOperate;
    //    value.child.forEach((item)=>{
    //      arr.push(item.id)
    //    })
    //    if(_.difference(arr,checkedOperate).length==0){
    //      value.check=true;
    //    }else{
    //      value.check=false;
    //    }
    //  },
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
      $('.el-table__expanded-cell').css({'padding-right':'0'})
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
  .el-table__expanded-cell{
    padding-right: 0
  }
</style>
