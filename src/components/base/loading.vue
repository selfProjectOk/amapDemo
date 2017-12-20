<template>
  <div class="loadingContent">
    <div class="loadingDiv" :class="{'centerLoading': (type === 'center')}" :style="{'height': height + 'px', 'width': ((width) ? width + 'px' : '')}">
      <img :style="{'transform': 'rotate(' + (delta * unitDeg) + 'deg)'}" class="loadingImg" src="../../static/img/loading.png"/>
      <p class="loadingText" v-text="(text && text !== '') ? text : '正在加载...'"></p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        unitDeg: 30,
        delta: 0,
      }
    },
    props: {
      height: {
        type: Number,
        default: 100
      },
      width: {
        type: Number
      },
      type: {
        type: String,
        default: 'bottom'
      },
      text: {
        type: String,
        default: '正在加载...'
      }
    },
    mounted() {
      this.changeDeg();
    },
    methods: {
      changeDeg () {
        setTimeout(() => {
          this.delta--;
          if (this.delta < -(360 / this.unitDeg)) {
            this.delta = this.delta % parseInt(360 / this.unitDeg)
          }
          this.changeDeg();
        }, 50);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .loadingContent
    display: flex
    justify-content: center
    align-items: center
    .loadingDiv
      display: flex
      justify-content: center
      align-items: center
      height: 100px
      .loadingImg
        display: inline-block
        height: 26px
        width: 26px
        margin-right: 10px
        /*animation: rotate 1.2s infinite linear;*/
      .loadingText
        font-size: 12px
        color: #909090
    .centerLoading
      background-color: rgba(230, 230, 230, 0.3);
      border-radius: 5px


  @keyframes rotate
    0%
      transform: rotate(0)
    25%
      transform: rotate(-90deg)
    50%
      transform: rotate(-180deg)
    100%
      transform: rotate(-360deg)
</style>
