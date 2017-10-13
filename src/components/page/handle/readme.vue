<template>
  <div>
      <div class="tree">
        <div class="addButton">
          <el-button type="primary" @click='addGroup'>添加分组</el-button>
        </div>
        <el-tree
        :data="tagData"
        :props="defaultProps"
        node-key="tag_id"
        highlight-current
        @node-click="handleNodeClick"
        :render-content="renderContent"
        :load='reloadTree'
        >
        </el-tree>

      </div>
        <div class="syncGroup">
          <el-radio-group v-model="sync" @change="syncChange">
           <el-radio class="radio" label="">全部</el-radio>
           <el-radio class="radio" label="1">已同步</el-radio>
           <el-radio class="radio" label="0">未同步</el-radio>
         </el-radio-group>
        </div>
          <el-table
            :data="tableData"
            border
            style="width:660px;"
            >
            <el-table-column
             label="序号"
             type="index"
             width="100">
           </el-table-column>
           <el-table-column
             prop="create_time"
             label="创建时间"
             width="180">
           </el-table-column>
            <el-table-column
              prop="img_url"
              label="图片"
              width="180">
              <template scope="scope">
                  <img :src="scope.row.img_url" @click="handleUpdate(scope.row)" style="height:100px;">
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              align="center"
              width="200">
                <template scope="scope">
                  <el-button
                    v-if="scope.row.status"
                    size="small"
                    type="success">
                    已同步
                  </el-button>
                  <el-button
                    v-else
                    size="small"
                    type="info">
                    未同步
                  </el-button>
                </template>
            </el-table-column>
          </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="pages">
          </el-pagination>
        </div>
        <!-- 新增标签弹出框 -->
        <el-dialog
          title="新增标签"
          :visible.sync="dialogAddTag"
          size="tiny"
          >
          <el-form ref="form" :model="newTagForm" label-width="80px">
            <el-form-item label="标签名">
              <el-input v-model="newTagForm.name"></el-input>
            </el-form-item>
            <el-form-item>
             <el-button type="primary" @click="sureAddTag(newTagForm)">立即新增</el-button>
             <el-button @click="dialogAddTag = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 新增分组弹出框 -->
        <el-dialog
          title="新增分组"
          :visible.sync="dialogAddGroup"
          size="tiny"
          >
          <el-form ref="form" :model="newTagForm" label-width="80px">
            <el-form-item label="分组名">
              <el-input v-model="newTagForm.name"></el-input>
            </el-form-item>
            <el-form-item>
             <el-button type="primary" @click="sureAddGroup(newTagForm)">立即新增</el-button>
             <el-button @click="dialogAddGroup = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
 let tag_id = 1000;
  export default {
    data() {
      return {
        tableData:[],
        dialogAddTag:false,
        dialogAddGroup:false,
        pages:null,//总页数
        pageSize:null,//每页条数
        sync: '',//初始显示全部数据
        imgListParams:{
          id:'',
          page:1,
          status:''
        },
        tagData:null,
        defaultProps:{
          children:'child',
          label:'name'
        },
        editRowDate:{
          create_time:''
        },
        newTagForm:{
          name:''
        },
        store:null,
        treeData:null
      }
    },
    created(){
      var that=this;
      this.$http.get('/api/admin/tag/tagTree').then(
        function(res){
          that.tagData=res.data.data;
        }
      )
    },
    methods: {
      addGroup(){
        this.dialogAddGroup=true;
      },
      sureAddGroup(newTagForm){
        var that=this;
        this.$http.post('/api/admin/tag/tagAdd',
        {
            name:newTagForm.name,
            pid:0

        }).then(function(res){
          that.reloadTree()
          that.dialogAddGroup=false;
        })
      },
      formatter(row, column) {
        return row.address;
      },
      handleUpdate(row){
        this.editRowDate=row;
        this.dialogFormVisible=true;
      },
      handleNodeClick(data){//标签树节点点击事件
        this.imgListParams.id=data.tag_id;
        this.loadImgList(this.imgListParams)

      },
      reloadTree(node,resolve){
        var that=this;
        this.$http.get('/api/admin/tag/tagTree').then(
          function(res){
            that.tagData=res.data.data;
          }
        )
      },
      sureAddTag(newTagForm){
        var that=this;
        var data=this.treeData;
         this.$http.post('/api/admin/tag/tagAdd',
         {
             name:newTagForm.name,
             pid:data.tag_id

         }).then(function(res){
           that.reloadTree()
           that.dialogAddTag=false;
         })

      },
      append(store, data) {
       this.dialogAddTag=true;
       this.treeData=data;
      },
     remove(store, data) {
       this.$http.post('/api/admin/tag/tagDel',{
           id:data.tag_id
       }).then(function(res){
         if(res.data.code==1){
           store.remove(data);
         }else{
            alert(res.data.msg)
         }

       })
     },
      renderContent(h,{ node, data, store }){
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px;" class="addDelete">
              <el-button size="mini" on-click={ () => this.append(store, data) }>新增</el-button>
              <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>
            </span>
          </span>);
      },
      loadImgList(params){//加载图片数据
        var that=this;
        this.$http.get('/api/admin/tag/tagInfo',{
          params:params}).then(function(res){
          that.tableData=res.data.data.data;
          that.pages=res.data.data.total;
          that.pageSize=res.data.data.per_page;
        })
      },
      syncChange(label){//筛选同步未同步数据
        this.imgListParams.status=label;
        this.loadImgList(this.imgListParams)
      },
      handleCurrentChange(current){//改变页数
        this.imgListParams.page=current;
        this.loadImgList(this.imgListParams)
      }
    }
  }
</script>
<style scoped>
  .syncGroup{
    margin: 10px;
  }
  .tree{
    width: 20%;
    float: left;
    margin: 0 10px 0 10px;
  }
  .addButton{
    margin-bottom:10px;
  }
  .addButton .el-button{
    padding:2px 3px;
  }
  .pagination{
    margin-left: 346px;
    float: left;
  }
</style>
