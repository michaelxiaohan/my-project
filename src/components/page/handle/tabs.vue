<template>
  <div>
      <!-- <el-button
        size="small"
        @click="addTab(editableTabsValue2)"
      >
        add tab
      </el-button> -->
    <el-tabs v-model="editableTabsValue2" type="card" @tab-remove="removeTab" @tab-click="tabClick" :active-name="num.toString()">

        <el-tab-pane
          v-for="(item, index) in editableTabs2"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :path="item.content"
          :closable="isReande(item)?false:true"
        >

        </el-tab-pane>

    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return this.$store.state.tabs
    },
    mounted:function(){

    },
    watch:{
      $route(){
        let obj={
          name:this.$route.name,
          path:this.$route.path
        }
        this.$store.commit('addTabs',obj)
      }
    },
    computed:{
      ...mapGetters([
        'num'
      ])
    },
    methods: {
      isReande(item){//默认显示且不可关闭
        return item.title=='标签管理'
      },
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      },
      tabClick(e){
        this.$router.push({path:e.$attrs.path})
      }
    }
  }
</script>
<style>
  .content{
    padding: 5px;
  }
</style>
