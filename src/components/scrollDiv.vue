<template>
  <div class="scrollDiv" ref="scrollDiv">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        lastScrollBottom: null
      }
    },
    mounted () {
      this.$refs.scrollDiv.addEventListener('scroll', this.scrollHandler, false)
    },
    beforeDestroy () {
      this.$refs.scrollDiv.removeEventListener('scroll', this.scrollHandler, false)
    },
    methods: {
      contentTapStart (e) {
        let clientHeight = this.$refs.scrollDiv.clientHeight;
        let scrollHeight = this.$refs.scrollDiv.scrollHeight;
        let scrollTop = this.$refs.scrollDiv.scrollTop;
        let scrollBottom = scrollHeight - scrollTop - clientHeight;
        this.lastScrollBottom = scrollBottom;
      },
      scrollHandler () {
        // 处理上拉加载
        let clientHeight = this.$refs.scrollDiv.clientHeight;
        let scrollHeight = this.$refs.scrollDiv.scrollHeight;
        let scrollTop = this.$refs.scrollDiv.scrollTop;

        let scrollBottom = scrollHeight - scrollTop - clientHeight;
        if (scrollBottom <= 50 && (this.lastScrollBottom > 50 || this.lastScrollBottom === null) && (scrollHeight - clientHeight > 0.5)) {
          this.$emit('willScrollToBottom');
        }
        this.lastScrollBottom = scrollBottom;
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .scrollDiv
    overflow: auto
</style>
