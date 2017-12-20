<template>
  <button v-text="text"
          @click="btnClick"
          :class="{'defaultDisabled': (disabled)}"
          :disabled="disabled"
  ></button>
</template>

<script>
  export default {
    name: 'authcode-btn',
    data () {
      return {
        text: '获取验证码',
        second: this.maxSecond,
        intervalIndex: null
      }
    },
    props: {
      maxSecond: {
        type: Number,
        default: 60
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      btnClick () {
        // 倒计时读秒
        this.$emit('click', is => {
          if (is) {
            setTimeout(() => {
              this.endTime(true);
            }, 0);
          }
        })
        this.$el.disabled = true
        this.text = this.second + 's'
        this.intervalIndex = setInterval(() => {
          if (this.second === 0) {
            this.endTime();
            return
          }
          this.second--
          this.text = this.second + 's'
        }, 1000)
      },
      endTime (isNew) {
        clearInterval(this.intervalIndex)
        this.$el.disabled = false
        this.text = (isNew) ? '发送验证码' : '重新获取';
        this.second = this.maxSecond
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  button
    height: 30px
    border: none
    border-radius: 3px
    color: #4482ef
    background: transparent
    outline: none
    font-size: 14px

  .defaultDisabled
    color: #cccccc
</style>
