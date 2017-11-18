<template lang="html">
  <el-dialog
     width="30%"
     title="选择标签"
     :visible="innerVisible"
     @close='handleClose'
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
  </el-dialog>
</template>

<script>
export default {
  data(){
    return{
      activeName:'1'
    }
  },
  props:['selectTags','selectTagId','innerVisible','tagData','handleClose'],
  methods:{
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
  .el-tag{
    margin: 5px;
  }
</style>
