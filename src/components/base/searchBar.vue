<template>
  <mg-nav-bar>
    <div slot="custom" class="searchBar">
      <form class="form" action="javascript:void(0)" @submit="submit">
        <input type="text" ref="input" @input="textInput" class="searchInput" :placeholder="placeholder" v-model="value"/>
      </form>
      <div @click="$emit('back')">
        <span class="cancel">取消</span>
      </div>
    </div>
    <div slot="left"></div>
    <div slot="center"></div>
    <div slot="right"></div>
  </mg-nav-bar>
</template>

<script>
  import navBar from './navBar.vue'
  import navBarItem from './navBarItem.vue'
  export default {
    components: {
      'mg-nav-bar': navBar,
      'mg-nav-bar-item': navBarItem
    },
    props: {
      placeholder: {
        type: String,
        default: '请输入房东姓名或电话'
      },
      searchType: {
        type: String,
        default: 'input'
      }
    },
    data () {
      return {
        style: {
          width: window.innerWidth - 100 + 'px'
        },
        value: ''
      }
    },
    mounted () {
       this.$refs.input.focus();
    },
    methods: {
      textInput () {
        if (this.searchType === 'input') {
          this.$emit('search', this.value);
          return false;
        }
      },
      submit () {
        if (this.searchType === 'submit') {
          this.$emit('search', this.value);
          return false;
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .searchBar
    display: flex
    align-items: center
    width: 100%
    padding: 0 15px
    .form
      flex: 1
      .searchInput
        padding: 4px 14px
        width: 100%
        height: 28px
        background-color: #EFEFF4
        border-radius: 14px
        line-height: 20px
        color: #000000
        outline: none
        font-size: 13px
  .cancel
    padding-left: 15px
    color: #646464
    font-size: 15px
</style>
