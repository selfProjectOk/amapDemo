<template>
  <div class="autoSearchResultCell" @click="$emit('click', item)">
    <div class="xLine"></div>
    <div class="cell">
      <div class="first">
        <img src="../static/img/icon_location.png"/>
      </div>
      <div class="second">
        <p class="name" v-text="item.name"></p>
        <p class="position" v-text="getAddress(item.address)"></p>
      </div>
    </div>
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
      getAddress (address) {
        if (typeof address !== 'string') {
          return '';
        }
        return address;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .autoSearchResultCell
    text-align: left
  .cell
    display: flex
    align-items: center
    padding: 0 10px
    .first
      img
        height: 16px
        width: 16px

    .second
      flex: 1
      text-align: left
      padding: 5px 10px
      .name
        font-size: 12px
        color: #323232
        display: flex
        align-items: center
      .position
        font-size: 10px
        color: #646464


  .xLine
    border-bottom: 1px solid #e4e4e4
    margin-left: 36px
    height: 1px
    transform: scaleY(0.5)
    transform-origin: 0 0
    -webkit-transform: scaleY(0.5)
    -webkit-transform-origin: 0 0
</style>
