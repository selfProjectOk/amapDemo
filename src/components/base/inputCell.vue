<!--// inputCell-->
<template>
  <li class="inputCell" @click="$emit('click')">
    <div class="cellDiv">
      <p class="title">
        <span v-text="title"></span>
        <span class="subTitle" v-text="subTitle"></span>
      </p>
      <slot class="content"></slot>
    </div>
    <div class="xLine"></div>
  </li>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    props: {
      title: String,
      subTitle: {
        type: String,
        default: ''
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  .inputCell
    list-style: none
    padding-left: 15px
    background-color: #ffffff
  .cellDiv
    display: flex
    line-height: 50px
    position: relative
  .title
    text-align: left
    margin-right: 10px
    font-size: 15px
    color: #323232
    min-width: 60px
    white-space: nowrap
    .subTitle
      font-size: 9px
  .inputCell:last-child
    .xLine
      border-bottom: 1px solid transparent

  .xLine
    border-bottom: 1px solid #e4e4e4
    height: 1px
    transform: scaleY(0.5)
    transform-origin: 0 0
    -webkit-transform: scaleY(0.5)
    -webkit-transform-origin: 0 0
</style>
