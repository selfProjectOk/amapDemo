<template>
  <div>
    <p @click="$router.push({name: 'searchMap'})">地图选点(加联想搜索)</p>
    <p @click="$router.push({name: 'chooseLocation'})">地图选点</p>
    <p @click="$router.push({name: 'findLandlord'})">地图找房东</p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
</style>
