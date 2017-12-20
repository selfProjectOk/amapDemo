<template>
  <div class="multiItem">
    <p class="itemCell" v-if="item.name !== '其他'" @click="click">
      <span v-text="item.name"></span>
      <img v-if="check" src="../../static/img/select_multi_yes.png"/>
      <img v-if="!check" src="../../static/img/select_multi_no.png"/>
    </p>
    <p class="itemCell" v-if="item.name === '其他'" @click="click" style="position: relative">
      <span v-if="!check">其他</span>
      <input v-if="check" type="text" ref="input" placeholder="请输入" @click="inputClick($event)" v-model="item.otherText"/>
      <img v-if="check" src="../../static/img/select_multi_yes.png"/>
      <img v-if="!check" src="../../static/img/select_multi_no.png"/>
    </p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        check: true
      }
    },
    props: {
      item: Object
    },
    watch: {
      item () {
        this.check = this.item.check;
      },
      check () {
        if (this.item.name === '其他' && this.check) {
          this.$nextTick(() => {
            if (this.$refs.input) {
              this.$refs.input.focus();
            }
          })
        }
      }
    },
    mounted() {
      this.check = this.item.check;
    },

    methods: {
      click () {
        this.$emit('click', this.item.id, this.item.name, this.item.otherText);
      },
      inputClick (e) {
          e.stopPropagation();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .multiItem
    padding: 0 30px
    .itemCell
      display: flex
      align-items: center
      line-height: 40px
      img
        width: 19px
        height: 19px
      span
        flex: 1
        text-align: left
        margin-right: 20px
        font-size: 15px
        color: #646464
      input
        flex: 1
        background-color: transparent;
        padding: 10px 0
        margin-right: 20px
        line-height: 20px;
        outline: none;
        font-size: 15px
        color: #646464
</style>
