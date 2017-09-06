<template>
    <div class="wrapper">
        <v-header></v-header>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
              <!-- <router-view></router-view> -->
              <v-tabs></v-tabs>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHeader from './Header.vue'
    import vSidebar from './Sidebar.vue';
    import vTabs from '../page/handle/tabs.vue';
    export default {
        components: { vHeader,vSidebar,vTabs }
    }
</script>
