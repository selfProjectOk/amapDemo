<template>
  <input type="button" :value="btnName" class="ajaxBtn" @click="handleClick" ref="btn"/>
</template>

<script>
import { ajaxGet } from '../../common/ajax'

export default {
  props: {
    btnName: {
      type: String
    },
    url: {
      type: String
    },
    param: {
      type: String
    }
  },

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {
    handleClick(e) {
      e.target.disabled = true
      // this.$refs.btn.disabled = true
      setTimeout(() => {
        ajaxGet(...[this.url, this.param, res => {
          e.target.disabled = false
          this.$emit("ajaxCb", res)
        }])
      }, 3000)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ajaxBtn
    padding: 5px 10px
</style>
