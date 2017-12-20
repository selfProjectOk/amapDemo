<template>
  <div class="iconTitle" @click="$emit('click')">
    <slot></slot>
    <p v-text="title"></p>
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
  .iconTitle
    display: inline-block
    padding: 8px 3px
    text-align: center
    width: 25%
  img
    display: inline-block
    width: 40px
    height: 40px

  p
    text-align: center
    font-size: 13px
    margin-top: 5px
    color: #666666
</style>
