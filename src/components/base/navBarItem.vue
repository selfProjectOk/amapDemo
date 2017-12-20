<template>
  <div class="navBarItem" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>

  export default {
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
  .navBarItem
    height: 44px
    width: 50px
    color: #ffffff
    font-size: 18px
    display: flex
    justify-content: center
    align-items: center
    flex-shrink: 0
    img
      display: inline-block
      width: 20px
      height: 20px
</style>
