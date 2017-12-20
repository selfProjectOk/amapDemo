<!--// button组-->
<template>
  <div :class="styleType">
    <div class="btnItem" :class="(currentIndex === index) ? 'btnItemSelected' : ''" v-for="title, index in titles" @click="btnClick(index, $event)">
      <p class="itemText">{{title}}</p>
      <div class="bottomLine"></div>
    </div>
  </div>
</template>
<script>

  export default {
    components: {
    },
    props: {
      titles: Array,
      startIndex: {
        type: Number,
        default: 0
      },
      styleType: {
        type: String,
        default: 'btnGroup'
      }
    },
    data () {
      return {
          currentIndex: 0
      }
    },
    mounted () {
        this.currentIndex = this.startIndex;
    },
    methods: {
      btnClick (index, e) {
        this.currentIndex = index;
        this.$emit('change', index);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .btnGroup
    margin: 5px 10px
    background-color: transparent
    border: 1px solid #ff5353
    border-radius: 5px
    display: flex
    .btnItem
      flex: 1
      color: #ff5353
      height: 26px
      min-height: 26px
      line-height: 26px
      padding: 0
      font-size: 13px
      &+.btnItem
        border-left: 1px solid #ff5353

    .btnItemSelected
      background-color: #ff5353
      color: #ffffff



  .btnParted
    margin: 10px
    background-color: transparent
    display: flex
    .btnItem
      flex: 1
      align-items: center
      justify-content: center
      border: 1px solid #cccccc
      border-radius: 5px
      color: #909090
      min-width: 80px
      height: 36px
      line-height: 34px
      padding: 0
      margin-right: 10px
    .btnItem:last-child
      margin-right: 0
    .btnItemSelected
      background-color: #ff5353
      border: 1px solid #ff5353
      color: #ffffff

  .tabButton
    margin: 0 0 10px 0
    background-color: #ffffff
    display: flex
    text-align: center
    .btnItem
      flex: 1
      color: #323232
      height: 36px
      min-height: 36px
      line-height: 34px
      padding: 0;
      font-size: 13px
      text-align: center
      display: flex
      flex-direction: column
      align-items: center
      .bottomLine
        height: 2px
        width: 50px
        background-color: transparent
    .btnItemSelected
      color: #ff5353
      .bottomLine
        background-color: #ff5353
</style>
