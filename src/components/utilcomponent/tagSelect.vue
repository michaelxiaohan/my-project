<template lang="html">
    <div>
        <div class="tagsContain" v-if='selectTags.length'>
          <el-tag
            v-for="tag in selectTags"
            :key="tag.name"
            :closable="!lookProduct"
            @close="handleTagClose(tag)"
          >
            {{tag.name}}
          </el-tag>
          <i @click='logSelectTags' class="el-icon-circle-plus" v-show='!lookProduct'></i>
        </div>
        <i @click='logSelectTags' class="el-icon-circle-plus" v-show='!lookProduct' v-else></i>
        <el-dialog
         width="30%"
         title="选择标签"
         :visible="innerVisible"
         :show-close='false'>
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
               <div @click='handleNodeClick(tag)' style="cursor:pointer;">{{tag.name}}</div>
             </el-tag>
           </el-collapse-item>
         </el-collapse>
         <div style="text-align:right;margin-top:20px;">
           <el-button @click='handleClose' v-if='!editImg'>关闭</el-button>
           <el-button type="primary" @click='saveTag'>保存</el-button>
         </div>
        </el-dialog>
  </div>
</template>
<script>
/*
  标签选择组件
*/
export default {
  data(){
    return{
      activeName:'1',
      innerVisible:false,
      selected:'',
      selectedId:''
    }
  },
  props:[
    'selectTags',
    'selectTagId',
    'tagData',
    'editImg',
    'lookProduct'
],
  created(){
    this.selected=this.selectTags,
    this.selectedId=this.selectTagId;
  },
  methods:{
    logSelectTags(){
      this.innerVisible=true;
    },
    handleClose(){
      let selected=this.selectTags,
          selectedId=this.selectTagId;
          selected.splice(0,selected.length);
          selectedId.splice(0,selectedId.length);
          this.innerVisible=false;
    },
    saveTag(){
      var selected=this.selectTags,
          selectedPid=[];
      selected.forEach((val)=>{
        selectedPid.push(val.pid)
      })
      let array = Array.from(new Set(selectedPid));
      if(array.length!=this.tagData.length){
        this.$message({
            message: '请分别在颜色、风格和场合里至少选择1个标签',
            type: 'warning'
          });
      }else{
        this.innerVisible=false;
      }
    },
    handleNodeClick(data){//标签点击事件
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
          this.selectTags.push({name:data.name,pid:data.pid})
          this.selectTagId.push(data.tag_id)
        }
      }
    },
    handleTagClose(tag){
      this.selectTagId.splice(this.selectTagId.indexOf(tag.tag_id), 1);
      this.selectTags.splice(this.selectTags.indexOf(tag), 1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .tagsContain{
    display:inline-block;
    width:200px;
    border:1px solid #d1dbe5;
    min-height:36px;
    width:330px;
  }
  .el-icon-circle-plus{
    font-size:35px;
    vertical-align:middle;
  }
  .el-tag{
    margin: 5px;
  }
</style>
