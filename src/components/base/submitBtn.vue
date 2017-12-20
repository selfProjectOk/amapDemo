<template>
  <input type="button"
         :value="btnName"
         class="submitBtn"
         :class="{'blank': type === 'blank',
                  'defaultDisabled': (type === 'default' && disabled),
                  'blankDisabled': (type === 'blank' && disabled),
                  'touchDown': touchDown
                 }"
         @click="handleClick($event)"
         @touchstart="disabled || (touchDown = true)"
         @touchend="disabled || (touchDown = false)"
         :disabled="disabled"
         ref="btn"/>
</template>

<script>
export default {
  props: {
    btnName: {
      type: String
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => {
        return value === 'default' || value === 'blank'
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      touchDown: false,
      fire: true,
      tId: null
    }
  },

  mounted() {
  },

  methods: {
    handleClick(e) {
      if (this.fire) {
        this.$emit('click', e);
        this.fire = false;
        this.tId = setTimeout(() => {
          this.fire = true;
        }, 500)
      } else {
        if (this.tId !== null) {
          clearTimeout(this.tId);
        }
        this.tId = setTimeout(() => {
          this.fire = true;
        }, 500)
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .submitBtn
    padding: 5px 10px
    display: block
    height: 48px
    background-color: #ff5353
    width: 100%
    border: none
    border-radius: 0
    color: #ffffff
    font-size: 16px
    margin: 0
    outline: none
    border-top: solid 1px #f3f5fa
  .defaultDisabled
    background-color: #cccccc
    color: #f4f4f4

  .blank
    background-color: #ffffff
    color: #ff5353
  .blankDisabled
    color: #999999
  .touchDown
    opacity: 1
</style>
