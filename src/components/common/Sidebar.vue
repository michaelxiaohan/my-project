<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" @select="handleSelect" class="el-menu-vertical-demo" theme="dark" router>
            <template v-for="item in sidebar">
                <template v-if="item.subs">

                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="item.index+'/'+subItem.index">
                            {{ subItem.title }}
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
          ]),
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        mounted(){

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
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
