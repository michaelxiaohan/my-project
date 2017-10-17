<template>
  <div>
    <el-tabs v-model="editableTabsValue2" type="card" @tab-remove="removeTab" @tab-click="tabClick" :active-name="num.toString()">
        <el-tab-pane
          v-for="(item, index) in editableTabs2"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :path="item.content"
          :closable="isReande(editableTabs2)?false:true"
        >
        </el-tab-pane>
    </el-tabs>
    <div class="router-view">
      <transition name="move" mode="out-in">
			     <router-view></router-view>
	    </transition>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return this.$store.state.tabs.tabs
    },
    mounted:function(){

    },
    beforeCreate(){

    },
    created(){
      this.$store.state.tabs.tabs.editableTabs2=[
        {
          title:this.$route.name,
          name:'1',
          content:this.$route.path
        }
      ]
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
        return item.length==1
      },
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {  //如果关闭的是当前选中项
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
                this.$router.push({path:nextTab.content})
              }
            }
          });
        }
        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      },
      tabClick(e){
        this.$router.replace({path:e.$attrs.path})
      }
    }
  }
</script>
<style>
  .content{
    padding: 5px;
  }
</style>
