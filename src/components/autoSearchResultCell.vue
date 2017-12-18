<template>
  <div class="autoSearchResultCell" @click="$emit('click', item)">
    <p v-text="item.name"></p>
    <p v-text="item.district + item.address"></p>
    <br/>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  .autoSearchResultCell
    text-align: left
</style>
