<template>
  <div id="app">
    <router-view></router-view>
    <div id="picker"></div>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="stylus">
@import "./static/static.css"
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>
