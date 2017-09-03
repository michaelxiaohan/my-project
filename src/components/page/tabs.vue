<template>
  <div>
      <!-- <el-button
        size="small"
        @click="addTab(editableTabsValue2)"
      >
        add tab
      </el-button> -->
    <el-tabs v-model="editableTabsValue2" type="card" @tab-remove="removeTab" @tab-click="tabClick" :active-name="num">

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
  export default {
    data() {
      return this.$store.state.tabs
      // return {
      //   editableTabsValue2: '2',
      //   // editableTabs2: [{
      //   //   title: 'Tab 1',
      //   //   name: '1',
      //   //   content: 'Tab 1 content'
      //   // }, {
      //   //   title: 'Tab 2',
      //   //   name: '2',
      //   //   content: 'Tab 2 content'
      //   // }],
      //   editableTabs2:this.$store.state.tabs.editableTabs2,
      //   tabIndex: 2
      // }
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
      num(){
        return this.$store.state.num.toString()
      }
    },
    methods: {
      isReande(item){//默认显示
        return item.title=='自述'
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
