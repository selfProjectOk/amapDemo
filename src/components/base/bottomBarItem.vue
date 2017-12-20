<template>
  <div class="bottomBarItem" @click="click">
    <div class="bottomBarItemDiv">
      <img v-if="value === 'home'" v-show="currentValue !== value" src="../../static/img/tab_home.png"/>
      <img v-if="value === 'home'" v-show="currentValue === value" src="../../static/img/tab_home_select.png"/>
      <img v-if="value === 'client'" v-show="currentValue !== value" src="../../static/img/tab_client.png"/>
      <img v-if="value === 'client'" v-show="currentValue === value" src="../../static/img/tab_client_select.png"/>
      <img v-if="value === 'job'" v-show="currentValue !== value" src="../../static/img/tab_job.png"/>
      <img v-if="value === 'job'" v-show="currentValue === value" src="../../static/img/tab_job_select.png"/>
      <img v-if="value === 'manage'" v-show="currentValue !== value" src="../../static/img/tab_manage.png"/>
      <img v-if="value === 'manage'" v-show="currentValue === value" src="../../static/img/tab_manage_select.png"/>
      <img v-if="value === 'mine'" v-show="currentValue !== value" src="../../static/img/tab_mine.png"/>
      <img v-if="value === 'mine'" v-show="currentValue === value" src="../../static/img/tab_mine_select.png"/>
      <p class="bottomTitle" :class="{'selectedItem': currentValue === value}" v-text="title"></p>
      <span class="bottomBadge" v-if="showBadge"></span>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      title: String,
      value: String,
      currentValue: String,
      showBadge: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },

    mounted() {
    },

    methods: {
      click () {
        this.$emit('valueChange', this.value);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .bottomBarItem
    text-align: center
    flex: 1
  .bottomBarItemDiv
    position: relative
    display: inline-block
    text-align: center
    padding: 6px 0 0 0
    font-size: 10px
    color: #909090
    img
      display: inline-block
      height: 24px
      width: 24px
    .bottomTitle
      line-height: 10px

  .selectedItem
    color: #ff5353

  .bottomBadge
    display: inline-block
    height: 8px
    width: 8px
    border-radius: 4px
    background-color: red
    position: absolute
    top: 3px
    right: -5px
</style>
