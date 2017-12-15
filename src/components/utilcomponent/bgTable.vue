<template lang="html">
  <div>
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
         <el-table-column type="selection" align="center"></el-table-column>
         <el-table-column type="index" label='序号' align="center"></el-table-column>
         <el-table-column label="品牌LOGO" prop="logo" align="center">
           <template slot-scope="scope">
             <img :src="scope.row.logo" style="height:100px;width:80px;">
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
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pages"></el-pagination>
      </div>
  </div>
</template>

<script>
export default {
  props:{
    tableData:Array
  }
}
</script>

<style lang="scss" scoped>
</style>
