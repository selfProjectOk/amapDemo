<template>
  <div class="navBar">
    <slot name="custom"></slot>
    <slot name="left">
      <mg-nav-bar-item></mg-nav-bar-item>
    </slot>
    <slot name="center">
      <p class="title" v-text="title"></p>
    </slot>
    <slot name="right">
      <mg-nav-bar-item></mg-nav-bar-item>
    </slot>
  </div>
</template>

<script>
  import navBarItem from './navBarItem.vue'
  export default {
    components: {
      'mg-nav-bar-item': navBarItem
    },
    props: {
      title: String
    },
    data () {
      return {
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  .navBar
    height: 44px
    // background: -webkit-linear-gradient(right, #3da3ff, #076ce0) !important
    background-color: #ffffff
    display: flex
    border-bottom: 1px solid #efeff4

  .title
    flex: 1
    line-height: 44px
    color: #323232
    text-align: center
    font-size: 17px
    font-weight: bolder

</style>
