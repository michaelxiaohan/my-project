<template>
    <div class="sidebar">
        <el-menu :default-active="$route.path" @select="handleSelect" class="el-menu-vertical-demo" theme="dark" router>
            <template v-for="item in sidebar">
                <template v-if="item.children">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
                        <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="item.index+'/'+subItem.index">
                            {{ subItem.name }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {

            }
        },
        methods:{
          handleSelect(index,indexpath){

          }
        },
        computed:{
          ...mapGetters([
            'sidebar'
          ])
        },
        mounted(){
          console.log(this.$store.state);
        }
    }
</script>
<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #324157;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
