<!--// 时间选择插件-->
<template>
  <div class="timePicker" :style="pickStyle">
    <div @click="startChoose" class="showText" :class="{'noChoose': timeStr === '请选择'}">
      <span v-text="timeStr" :style="{'color': (type === 'periodDown') ? '#ff5353' : ''}"></span>
      <img v-if="type === 'right'" class="rightIcon" src="../../static/img/icon_next.png"/>
      <img v-if="type === 'down'" class="downIcon" src="../../static/img/icon_next.png"/>
      <img v-if="type === 'periodDown'" class="periodDownIcon" style="transform: rotate(180deg)" src="../../static/img/picker_up.png"/>
    </div>
    <div class="backGround" ref="backGround" @click="cancelChoose" :style="bgStyle">
    </div>
    <div class="pickerDiv" ref="pickerDiv" :style="divStyle">
      <div class="btnDiv">
        <p class="left"><button @click="cancelChoose">取消</button></p>
        <p class="right"><button @click="endChoose">确定</button></p>
      </div>
      <mg-picker :slots="timeSlots" :visible-item-count="5" @change="timeChange" :values="time"/>
    </div>
  </div>
</template>

<script>

  let date = new Date();
  let yearArr30 = [];
  for (let i = -20; i < 30; i++) {
    yearArr30.push((date.getFullYear() + i).toString());
  }
  const monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const dateArr1 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  const dateArr2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
  const dateArr3 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
  const dateArr4 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];

  import picker from './picker/picker.vue'
  export default {
    components: {
      'mg-picker': picker
    },
    props: {
      type: {
        type: String,
        default: 'down'
      },
      showDefault: {
        type: Boolean,
        default: false
      },
      defaultDate: {
        type: [String],
        default: null
      },
    },
    data () {
      return {
        timeSlots: [
          {
            width: '100%',
            textAlign: 'center',
            values: yearArr30
          }, {
            width: '100%',
            textAlign: 'center',
            values: monthArr
          }, {
            width: '100%',
            textAlign: 'center',
            values: dateArr1
          }
        ],

        timeStr: '请选择',
        time: ['2017', '01', '01'],
        year: '2017',
        month: '01',
        date: '01',

        pickStyle: {
          'z-index': 'auto'
        },
        bgStyle: {
          opacity: 0,
          display: 'none'
        },
        divStyle: {
          opacity: '0',
          transform: 'translateY(224px)'
        },
        todayDate: null
      }
    },
    watch: {
      defaultDate () {
        this.initItem();
      }
    },
    mounted () {
      let date = new Date();
      this.year = date.getFullYear().toString();
      this.month = ((date.getMonth() + 1 > 9) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))).toString();
      this.date = (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate())).toString();
      this.time = [this.year, this.month, this.date];
      this.todayDate = this.time.join('-')
      if (this.showDefault) {
        this.timeStr = this.time.join('-');
      }

      this.initItem();
      this.timeChange(this.month, 1);

      this.$nextTick(() => {
        setTimeout(() => {
          let fixedTop = document.querySelector('#picker');
          if (!this.$refs.backGround && !this.$refs.pickerDiv) {
            return
          }
          let backGround = this.$refs.backGround;
          let pickerDiv = this.$refs.pickerDiv;
          fixedTop.appendChild(backGround);
          fixedTop.appendChild(pickerDiv);
        }, 0);
      })
    },
    beforeDestroy () {
      let backGround = this.$refs.backGround;
      let pickerDiv = this.$refs.pickerDiv;
      backGround.parentNode.removeChild(backGround);
      pickerDiv.parentNode.removeChild(pickerDiv);
    },
    methods: {
      initItem () {
        if (this.defaultDate !== null && this.defaultDate !== '') {
          this.year = this.defaultDate.split('-')[0];
          this.month = this.defaultDate.split('-')[1];
          this.date = this.defaultDate.split('-')[2];
          this.time = [this.year, this.month, this.date];
          this.timeStr = this.time.join('-');
        }

        this.timeChange(this.month, 1);
      },
      timeChange (value, index) {
        switch (index) {
          case 0:
            this.year = value
            if (this.month === '02') {
              let yearNum = parseInt(this.year);
                if (yearNum % 4 === 0 && yearNum % 400 !== 0) {
                  this.timeSlots[2].values = dateArr3
                  if (parseInt(this.date) > dateArr3.length) {
                    this.date = dateArr3[dateArr3.length - 1];
                  }
                } else {
                  this.timeSlots[2].values = dateArr4
                  if (parseInt(this.date) > dateArr4.length) {
                    this.date = dateArr4[dateArr4.length - 1];
                  }
                }
            }
            break
          case 1:
            this.month = value
            if (this.month === '02') {
              let yearNum = parseInt(this.year);
              if (yearNum % 4 === 0 && yearNum % 400 !== 0) {
                this.timeSlots[2].values = dateArr3
                if (parseInt(this.date) > dateArr3.length) {
                  this.date = dateArr3[dateArr3.length - 1];
                }
              } else {
                this.timeSlots[2].values = dateArr4
                if (parseInt(this.date) > dateArr4.length) {
                  this.date = dateArr4[dateArr4.length - 1];
                }
              }
            } else if (this.month === '04' || this.month === '06' || this.month === '09' || this.month === '11') {
              this.timeSlots[2].values = dateArr2
              if (parseInt(this.date) > dateArr2.length) {
                this.date = dateArr2[dateArr2.length - 1];
              }
            } else {
              this.timeSlots[2].values = dateArr1
              if (parseInt(this.date) > dateArr1.length) {
                this.date = dateArr1[dateArr1.length - 1];
              }
            }
            break
          case 2:
            this.date = value
            break
        }
        this.time = [this.year, this.month, this.date];
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
        if (this.todayDate && this.time.join('-') > this.todayDate) {
          this.$mogo.showMessage('日期不能晚于今天');
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
          transform: 'translateY(224px)'
        }

        this.timeStr = this.time.join('-');
        this.$emit('chooseTime', this.timeStr);
      },
      cancelChoose () {
        this.pickStyle = {
          'z-index': 'auto'
        };
        this.bgStyle = {
          opacity: 0,
          display: 'none'
        };
        this.divStyle = {
          opacity: '0',
          transform: 'translateY(224px)'
        }
        if (this.timeStr !== '请选择') {
          this.time = this.timeStr.split('-')
          this.year = this.time[0];
          this.month = this.time[1];
          this.date = this.time[2];
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
    height: 224px
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

  .showText
    display: flex
    align-items: center
    justify-content: flex-end
    color: #646464
    &.noChoose
      color: #bbbbbb
    span
      font-size: 15px
      margin-right: 5px
    .rightIcon
      height: 13px
      width: 8px
      position: relative;
    .downIcon
      height: 8px
      width: 13px
      top: 1px;
      position: relative;
    .periodDownIcon
      height: 5px
      width: 8px
      position: relative;
</style>
