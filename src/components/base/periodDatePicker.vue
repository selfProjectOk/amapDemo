<!--// 时间周期插件-->
<template>
  <div class="timePicker" :style="pickStyle">
    <div class="periodDiv" @click="startChoose">
      <div class="showText" :class="{'noChoose': noChoose}">
        <span v-text="showTimeStr(startTimeStr)"></span>
        <div class="timeLine"></div>
        <span v-text="showTimeStr(endTimeStr)"></span>
        <img v-if="!noChoose" class="periodDownIcon" style="transform: rotate(180deg)" src="../../static/img/picker_up.png"/>
        <img v-if="noChoose" class="periodDownIcon" src="../../static/img/picker_down.png"/>
      </div>
    </div>
    <div class="backGround" ref="backGround" @click="cancelChoose" :style="bgStyle">
    </div>
    <div class="pickerDiv" ref="pickerDiv" :style="divStyle">
      <div class="btnDiv">
        <p class="left"><button @click="cancelChoose" v-text="(chooseStage === 1) ? '取消' : '上一步'"></button></p>
        <p class="right"><button @click="endChoose" v-text="(chooseStage === 2) ? '确定' : '下一步'"></button></p>
      </div>
      <div class="timeShowDiv">
        <div class="timeShowTextDiv">
          <span class="timeText" :style="{color: (chooseStage === 1) ? '#2e8afe' : ''}" v-text="showTimeStr(currentStartDate)"></span>
          <span class="centerText">至</span>
          <span class="timeText" :style="{color: (chooseStage === 2) ? '#2e8afe' : ''}" v-text="showTimeStr(currentEndDate)"></span>
        </div>
        <img class="clearBtn" @click="clearDate" src="../../static/img/image_delete.png"/>
      </div>
      <mg-period-time-picker-item v-show="chooseStage === 1" ref="timePickerStart" :defaultDate="scrollStartDate" @timeChange="chooseStartTime"></mg-period-time-picker-item>
      <mg-period-time-picker-item v-show="chooseStage === 2" ref="timePickerEnd" :defaultDate="scrollEndDate" @timeChange="chooseEndTime"></mg-period-time-picker-item>
    </div>
  </div>
</template>

<script>
  import periodTimePickerItem from './periodTimePickerItem.vue'

  let date = new Date();
  let year = date.getFullYear().toString();
  let month = ((date.getMonth() + 1 > 9) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))).toString();
  let day = (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate())).toString();
  let todayDate = year + '-' + month + '-' + day;

  export default {
    components: {
      'mg-period-time-picker-item': periodTimePickerItem,
    },
    props: {
      defaultStartDate: {
        type: [String],
        default: todayDate
      },
      defaultEndDate: {
        type: [String],
        default: todayDate
      },
      maxDay: {
        type: Number,
        default: 31
      },
      noChoose: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        startTimeStr: '开始日期',
        endTimeStr: '结束日期',
        currentStartDate: '开始日期',
        currentEndDate: '结束日期',

        scrollStartDate: null,
        scrollEndDate: null,

        chooseStage: 1,
        pickStyle: {
          'z-index': 'auto'
        },
        bgStyle: {
          opacity: 0,
          display: 'none'
        },
        divStyle: {
          opacity: '0',
          transform: 'translateY(268px)'
        },
      }
    },
    watch: {
      defaultStartDate () {
        this.initItem(this.defaultStartDate, this.defaultEndDate);
      },
      defaultEndDate () {
        this.initItem(this.defaultStartDate, this.defaultEndDate);
      },
    },
    mounted () {
      this.initItem(this.defaultStartDate, this.defaultEndDate);
      this.$nextTick(() => {
        setTimeout(() => {
          let fixedTop = document.querySelector('.fixedTop');
          if (!this.$refs.backGround && !this.$refs.pickerDiv) {
            return
          }
          let backGround = this.$refs.backGround;
          let pickerDiv = this.$refs.pickerDiv;
          fixedTop.appendChild(backGround);
          fixedTop.appendChild(pickerDiv);
        }, 400);
      })
    },
    methods: {
      showTimeStr (str) {
        return str.replace(/-/g, '.')
      },
      initItem (defaultStartDate, defaultEndDate) {
        if (defaultStartDate && defaultStartDate !== '') {
          this.currentStartDate = defaultStartDate;
          this.scrollStartDate = defaultStartDate;
          this.startTimeStr = defaultStartDate;
        }

        if (defaultEndDate && defaultEndDate !== '') {
          this.currentEndDate = defaultEndDate;
          this.scrollEndDate = defaultEndDate;
          this.endTimeStr = defaultEndDate;
        }
      },
      chooseStartTime (timeStr) {
        this.currentStartDate = timeStr;
      },
      chooseEndTime (timeStr) {
        this.currentEndDate = timeStr;
      },
      clearDate () {
        this.currentStartDate = '开始日期';
        this.currentEndDate = '结束日期';
        this.$refs.timePickerStart.initItem(todayDate);
        this.$refs.timePickerEnd.initItem(todayDate);
      },
      startChoose () {
        this.pickStyle = {
          'z-index': 2
        };
        this.bgStyle = {
          opacity: 0.3,
          display: 'block'
        };
        this.divStyle = {
          opacity: '1',
          transform: 'translateY(0)'
        }
      },
      endChoose () {
        if (this.chooseStage === 1) {
          this.chooseStage = 2;
          return;
        }
        if (!this.dealTime(this.currentStartDate, this.currentEndDate)) {
          return;
        }
        this.chooseStage = 1;
        this.pickStyle = {
          'z-index': 'auto'
        };
        this.bgStyle = {
          opacity: 0,
          display: 'none'
        };
        this.divStyle = {
          opacity: '0',
          transform: 'translateY(268px)'
        }

        let returnStartStr = '';
        if (this.currentStartDate !== '开始日期') {
          returnStartStr = this.currentStartDate;
        }
        let returnEndStr = '';
        if (this.currentStartDate !== '结束日期') {
          returnEndStr = this.currentEndDate;
        }
        this.startTimeStr = this.currentStartDate;
        this.endTimeStr = this.currentEndDate;

        this.$emit('chooseTime', returnStartStr, returnEndStr);
      },
      dealTime(startDate, endDate) {
        if (startDate === '开始日期') {
          this.$mogo.showMessage('请选择开始日期');
          return false;
        }
        if (startDate === '结束日期') {
          this.$mogo.showMessage('请选择结束日期');
          return false;
        }
        if (startDate > todayDate) {
          this.$mogo.showMessage('开始日期不能晚于今天');
          return false;
        }
        if (endDate > todayDate) {
          this.$mogo.showMessage('结束日期不能晚于今天');
          return false;
        }
        let start = new Date(startDate);
        let end = new Date(endDate);
        if (start.getTime() > end.getTime()) {
          this.$mogo.showMessage('开始日期不能晚于结束日期');
          return false;
        }
        start.setDate(start.getDate() + this.maxDay);
        if (start.getTime() <= end.getTime()) {
          this.timeframe = true
          this.$mogo.showMessage('时间范围最大可选' + this.maxDay + '天');
          return false;
        }
        return true;
      },
      cancelChoose () {
        if (this.chooseStage === 2) {
          this.chooseStage = 1;
          return;
        }
        this.pickStyle = {
          'z-index': 'auto'
        };
        this.bgStyle = {
          opacity: 0,
          display: 'none'
        };
        this.divStyle = {
          opacity: '0',
          transform: 'translateY(268px)'
        }
        this.currentStartDate = this.startTimeStr;
        this.currentEndDate = this.endTimeStr;

        if (this.startTimeStr === '开始日期') {
          this.$refs.timePickerStart.initItem(todayDate);
        } else {
          this.$refs.timePickerStart.initItem(this.startTimeStr);
        }
        if (this.endTimeStr === '结束日期') {
          this.$refs.timePickerEnd.initItem(todayDate);
        } else {
          this.$refs.timePickerEnd.initItem(this.endTimeStr);
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .backGround
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background-color: #000000
    opacity: 0.3
    z-index: 3
  .pickerDiv
    position: fixed
    left: 0
    bottom: 0
    right: 0
    height: 268px
    background-color: #f3f5fa
    transition: all 0.25s
    z-index: 10
    .btnDiv
      height: 44px
      display: flex
      line-height: 44px
      background-color: #fafafa
      font-size: 18px
      .left
        flex: 1
        text-align: left
        button
          border: none
          outline: none
          background-color: transparent
          color: #646464
          padding: 0 20px
      .right
        flex: 1
        text-align: right
        button
          border: none
          outline: none
          background-color: transparent
          color: #2e8afe
          padding: 0 20px
    .timeShowDiv
      position: relative
      height: 44px
      display: flex
      align-items: center
      justify-content: center
      background-color: #ffffff
      .timeShowTextDiv
        font-size: 18px
        color: #646464
        .timeText
          display: inline-block
          text-align: center
          min-width: 95px
        .centerText
          margin: 0 10px
      .clearBtn
        height: 20px
        width: 20px
        position: absolute
        right: 15px
        top: 12px

  .periodDiv
    display: flex
    justify-content: center
    align-items: center
    margin: 20px 0 20px 0
    .showText
      display: flex
      align-items: center
      justify-content: center
      border: solid 1px #ff5353
      border-radius: 15px
      padding: 2px 15px
      color: #ff5353
      background-color: #ffffff
      min-width: 120px
      min-height: 28px
      span
        font-size: 15px
      .timeLine
        height: 1px
        width: 8px
        background-color: #ff5353
        margin: 0 2px
      .periodDownIcon
        height: 5px
        width: 8px
        position: relative;
        margin-left: 10px
    .noChoose
      color: #646464
      border: solid 1px #cccccc
      .timeLine
        background-color: #646464

</style>
