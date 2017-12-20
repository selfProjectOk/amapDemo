
<template>
  <div class="period">
    <div class="showBg" :class="{hideBg: !isShowPicker}" @click="hidePicker"></div>
    <!--<div class="lineHalfPx"></div>-->
    <div class="showText" @click="showTextClick">
      <span v-text="showTitle" :style="{color: (isShowPicker) ? '#ff5353' : ''}"></span>
      <img class="textIcon" v-if="!isShowPicker" src="../../static/img/picker_down.png"/>
      <img class="textIcon" v-if="isShowPicker" src="../../static/img/picker_up.png"/>
    </div>
    <div class="lineHalfPx"></div>
    <div class="chooseDiv" :class="{hideChooseDiv: !isShowPicker}" :style="{height: (pickerData.length < 8) ? (pickerData.length * 45) + 'px' : '360px'}">
      <div class="right" ref="contentScroll">
        <div :class="{'selectedRight': (selectedRightIndex === index)}"
             class="rightCell"
             v-for="(item, index) in pickerData"
             :key="index"
             @click="rightTabClick(index)">
          <p class="title" v-text="item[titleField]"></p>
          <div class="lineHalfPx" style="position: absolute; bottom: 0; right: 0; left: 0;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        isShowPicker: false,
        showTitle: '',
        isReceivedData: false,

        lastSelectedLeftIndex: 0,
        selectedLeftIndex: 0,
        selectedRightIndex: 0,
      };
    },
    props: {
      pickerData: Array,
      pickHide: Boolean,
      titleField: {
        type: String,
        default: 'name'
      },
    },
    watch: {
      pickerData () {
        if (!this.isReceivedData && this.pickerData && this.pickerData.length > 0) {
          this.initData();
        }
      },
      pickHide () {
        this.hidePicker();
      }
    },
    mounted() {
      if (!this.isReceivedData && this.pickerData && this.pickerData.length > 0) {
        this.initData();
      }
    },

    methods: {
      initData () {
        this.isReceivedData = true;
        let id = this.pickerData[this.selectedRightIndex].id;
        let title = this.pickerData[this.selectedRightIndex][this.titleField];
        this.showTitle = title;
      },
      rightTabClick (index) {
        this.selectedRightIndex = index;
        let id = this.pickerData[this.selectedRightIndex].id;
        let title = this.pickerData[this.selectedRightIndex][this.titleField];
        this.showTitle = title;
        this.returnId(id);
        this.hidePicker();
      },
      showTextClick() {
        if (this.isShowPicker) {
          this.hidePicker();
        } else {
          this.$emit('hideAll');
          this.$nextTick(() => {
            this.showPicker();
          })
        }
      },
      showPicker () {
        this.isShowPicker = true;
      },
      hidePicker () {
        this.isShowPicker = false;
      },
      returnId (id) {
        this.$emit('choose', id);
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    -webkit-tap-highlight-color: transparent
  p
    margin: 0
  .period
    height: 36px
    padding-bottom: 1px
    z-index: 3

    .showBg
      position: absolute
      left: 0
      right: 0
      top: 39px
      height: 1000px
      background-color: black
      opacity: 0.4
      transition: opacity 0.25s

    .hideBg
      opacity: 0
      display: none

    .showText
      text-align: center
      line-height: 35px
      background-color: #ffffff
      font-size: 13px
      color: #323232
      span
        display: inline-block
        vertical-align: middle
      .textIcon
        width: 8px
        height: 5px

    .chooseDiv
      position: absolute
      left: 0
      right: 0
      top: 38px
      background-color: #ffffff
      display: flex
      overflow-y: auto
      max-height: 360px
      transition: all 0.25s
      z-index: 2
      .right
        flex: 1
        background-color: #ffffff
        .rightCell
          margin-left: 15px
          padding: 10px 0
          position: relative
          text-align: left
          .title
            font-size: 14px
            line-height: 25px
            color: #646464
        .selectedRight
          .title
            color: #ff5353

    .hideChooseDiv
      height: 0 !important

    .lineHalfPx
      z-index: 3
      border: none
      border-bottom: 1px solid #e6e6e6
      height: 1px
      transform: scaleY(0.5)
      transform-origin: 0 0
      -webkit-transform: scaleY(0.5)
      -webkit-transform-origin: 0 0
</style>
