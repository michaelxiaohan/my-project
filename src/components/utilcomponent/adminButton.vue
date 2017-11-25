<template lang="html">
    <el-button size="mini" @click='triggerClick'>{{operation}}</el-button>
</template>

<script>
export default {
  props:['operation','permi'],
  watch:{
    route(){
      console.log(this.$route);
    }
  },
  methods:{
    triggerClick(){
      console.log(this.$route);
      this.$emit('handleClick');
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
