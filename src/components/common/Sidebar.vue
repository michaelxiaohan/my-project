<template>
    <div class="sidebar">
        <el-menu :default-active="$route.path" @select="handleSelect" background-color="#fff" router>
            <template v-for="item in sidebar">
                <template v-if="item.children">
                    <el-submenu :index="item.path">
                        <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
                        <!-- 二级菜单 -->
                          <template v-for="(subItem,i) in item.children">
                            <!-- 三级菜单 -->
                            <el-submenu v-if="subItem.children" :index="subItem.path">
                              <template slot="title"><i :class="item.icon"></i>{{ subItem.name }}</template>
                              <el-menu-item v-for="(nextsubItem,i) in subItem.children" :key="i" :index="nextsubItem.path">
                                  {{ nextsubItem.name }}
                              </el-menu-item>
                            </el-submenu>
                            <el-menu-item :key="i" :index="subItem.path" v-else>
                                {{ subItem.name }}
                            </el-menu-item>
                          </template>
                        <!-- <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="item.path">
                            {{ subItem.name }}
                        </el-menu-item> -->
                    </el-submenu>
                </template>
                <!-- 一级菜单 -->
                <template v-else>
                    <el-menu-item :index="item.path">
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
