
<template>
  <div class="period">
    <div class="showBg" :class="{hideBg: !isShowPicker}" @click="hidePicker"></div>
    <div class="showText" @click="showTextClick">
      <span v-text="showTitle" :style="{color: (isShowPicker) ? '#ff5353' : ''}"></span>
      <img class="textIcon" v-if="!isShowPicker" src="../../static/img/picker_down.png"/>
      <img class="textIcon" v-if="isShowPicker" src="../../static/img/picker_up.png"/>
    </div>
    <div class="lineHalfPx"></div>
    <div class="chooseDiv" :class="{hideChooseDiv: !isShowPicker}">
      <div class="chooseContentDiv">
        <div class="left" ref="right">
          <div :class="{'selectedLeft': (selectedLeftIndex === index)}"
               class="leftCell"
               v-for="(item, index) in pickerData"
               :key="index"
               @click="leftTabClick(index)">
            <p class="title">{{item.name}}</p>
            <div class="lineHalfPx" style="position: absolute; bottom: 0; right: 0; left: 15px;"></div>
          </div>
        </div>
        <div class="yLine"></div>
        <div class="right" ref="right" v-if="pickerData.length > 0">
          <div :class="{'selectedRight': (selectedRightIndex === index && lastSelectedLeftIndex === selectedLeftIndex)}"
               class="rightCell"
               v-for="(item, index) in ((pickerData[this.selectedLeftIndex].nextArray) ? pickerData[this.selectedLeftIndex].nextArray : [])"
               :key="index"
               @click="rightTabClick(index)">
            <p class="title">{{item.name}}</p>
            <div class="lineHalfPx" style="position: absolute; bottom: 0; right: 0; left: 0;"></div>
          </div>
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
        selectedRightIndex: 0
      };
    },
    props: {
      pickerData: Array,
      pickHide: Boolean,
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
      if (!this.isReceivedData && this.pickerData  && this.pickerData.length > 0) {
        this.initData();
      }
    },

    methods: {
      initData () {
        this.isReceivedData = true;
        let firstMap = this.pickerData[this.selectedLeftIndex];

        let id = (firstMap.nextArray) ? firstMap.nextArray[this.selectedRightIndex].id : firstMap.id;
        let name = (firstMap.nextArray) ? firstMap.nextArray[this.selectedRightIndex].name : firstMap.name;
        this.showTitle = name;
        this.returnId(id);
      },
      leftTabClick (index) {
        this.selectedLeftIndex = index;
        if (!this.pickerData[this.selectedLeftIndex].nextArray) {
          let id = this.pickerData[this.selectedLeftIndex].id;
          let name = this.pickerData[this.selectedLeftIndex].name;
          this.showTitle = name;
          this.returnId(id);
          this.hidePicker();

          this.$refs.right.style.flex = 0;
        } else {
          this.$refs.right.style.flex = 1;
        }
      },
      rightTabClick (index) {
        this.selectedRightIndex = index;
        let id = this.pickerData[this.selectedLeftIndex].nextArray[this.selectedRightIndex].id;
        let name = this.pickerData[this.selectedLeftIndex].nextArray[this.selectedRightIndex].name;
        this.showTitle = name;
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
        this.selectedLeftIndex = this.lastSelectedLeftIndex;
        this.isShowPicker = true;
      },
      hidePicker () {
        this.isShowPicker = false;
      },
      returnId (id) {
        this.lastSelectedLeftIndex = this.selectedLeftIndex;
        this.$emit('choose', id);
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    -webkit-tap-highlight-color: transparent
    /*-webkit-overflow-scrolling: touch*/
    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
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
      overflow: hidden
      z-index: 2
      transition: height 0.25s
      height: 360px
    .chooseContentDiv
      display: flex
      height: 360px
      .left
        flex: 1
        height: 100%
        overflow-y: auto
        transition: all 0.25s
        .leftCell
          padding: 10px 0
          position: relative
          text-align: left
          .title
            margin-left: 7px
            font-size: 14px
            line-height: 25px
            color: #646464
            border-left: 3px solid transparent
            padding-left: 5px
        .selectedLeft
          background-color: #e9e7e7
          .title
            border-left: 3px solid #ff5353
            color: #ff5353

      .right
        /*flex: 1*/
        height: 100%
        overflow-y: auto
        transition: all 0.25s
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
      border: none
      height: 1px
      background-color: #e6e6e6
      transform: scaleY(0.5)
      transform-origin: 0 0
      -webkit-transform: scaleY(0.5)
      -webkit-transform-origin: 0 0
    .yLine
      border: none
      border-right: 1px solid #e6e6e6
      width: 1px
      height: 100%
      transform: scaleX(0.5)
      transform-origin: 0 0
      -webkit-transform: scaleX(0.5)
      -webkit-transform-origin: 0 0
</style>
