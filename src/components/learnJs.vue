<template>
  <div ref="div">
    55555
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    mounted () {
      // 判断类型 typeof(undefined、object、boolean、number、string、function、symbol)  Object.prototype.toString.call()  constructor   instanceof
      console.log(typeof (new Date()));
      console.log(Object.prototype.toString.call(new Date()));
      console.log(Object.prototype.toString.call(undefined));
      console.log((new Date()).constructor);
      console.log((new Date()) instanceof Date);
      //
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
</style>
