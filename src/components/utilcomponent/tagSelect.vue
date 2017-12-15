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
           <el-collapse-item v-for='(item,i) in tagData' :title="item.name" :name="i" :key='i' v-if="noOccasion&&item.name!='场合'">
             <el-tag v-for="tag in item.child" :key="tag.name" style="position:relative" >
               <div @click='handleNodeClick(tag)' style="cursor:pointer;">{{tag.name}}</div>
               <div :style="{background:tag.color,width:'10px',height:'10px',position:'absolute',top:'0px',left:'-10px'}" v-if="item.name=='颜色'"></div>
             </el-tag>
           </el-collapse-item>
           <el-collapse-item v-for='(item,i) in tagData' :title="item.name" :name="i" :key='i' v-if="!noOccasion">
             <el-tag v-for="tag in item.child" :key="tag.name" style="position:relative" >
               <div @click='handleNodeClick(tag)' style="cursor:pointer;" >{{tag.name}}</div>
               <div :style="{background:tag.color,width:'10px',height:'10px',position:'absolute',top:'0px',left:'-10px'}" v-if="item.name=='颜色'"></div>
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
    'lookProduct',
    'noOccasion'//商品管理去掉场合标签
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
      // let selected=this.selectTags,
      //     selectedId=this.selectTagId;
      //     selected.splice(0,selected.length);
      //     selectedId.splice(0,selectedId.length);
          this.innerVisible=false;
    },
    saveTag(){
      var selected=this.selectTags,
          selectedPid=[];
      selected.forEach((val)=>{
        selectedPid.push(val.pid)
      })
      let array = Array.from(new Set(selectedPid));
//有场合情况和没场合情况
      if(this.noOccasion&&array.length<this.tagData.length-1 || !this.noOccasion&&array.length<this.tagData.length){
        this.$message({
            message: '请保证每个类别至少选择1个标签',
            type: 'warning'
          });
      }else{
        this.innerVisible=false;
      }
    },
//标签点击事件
    handleNodeClick(data){
      let occasion=[];
      if(data.child==undefined){
        let jundge=this.selectTags.some((v,i)=>{
                if(v.name==data.name){
                    this.$message({
                    showClose: true,
                    message: '该标签已存在',
                    type: 'warning'
                  });
                  return true
                }else if(v.pid==data.pid&&v.pid==18){
                    this.$message({
                      showClose: true,
                      message: '颜色只能选择一种',
                      type: 'warning'
                    });
                  return true
                }else if (v.pid==data.pid&&v.pid==3) {
                  occasion.push(v)
                  if(occasion.length==3){
                    this.$message({
                      showClose: true,
                      message: '场合最多只能选择3个标签',
                      type: 'warning'
                    });
                    return true
                  }
                }else if (v.pid==data.pid&&v.pid==21) {
                  occasion.push(v)
                  if(occasion.length==3){
                    this.$message({
                      showClose: true,
                      message: '风格最多只能选择3个标签',
                      type: 'warning'
                    });
                    return true
                  }
                }
              })
        if(!jundge){
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
    min-height:36px;
    width:330px;
  }
  .el-icon-circle-plus{
    font-size:35px;
    vertical-align:middle;
  }
  .el-tag{
    margin: 7px;
  }
</style>
