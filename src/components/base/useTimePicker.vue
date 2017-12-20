<!--// 消耗时间插件-->
<template>
  <div class="timePicker" :style="pickStyle">
    <div @click="startChoose" class="showText" :class="{'noChoose': timeStr === '请选择'}">
      <span v-text="timeStr"></span>
      <img v-if="type === 'right'" class="rightIcon" src="../../static/img/icon_next.png"/>
      <img v-if="type === 'down'" class="downIcon" src="../../static/img/icon_next.png"/>
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
  const hourArr = ['0小时', '1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '9小时', '10小时', '11小时', '12小时'];
  const minuteArr1 = ['15分钟', '30分钟', '45分钟'];
  const minuteArr2 = ['0分钟', '15分钟', '30分钟', '45分钟'];

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
            values: hourArr
          }, {
            width: '100%',
            textAlign: 'center',
            values: minuteArr1
          }
        ],

        timeStr: '请选择',
        time: ['0小时', '15分钟'],
        hour: '0小时',
        minute: '15分钟',

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
        }
      }
    },
    watch: {
      defaultDate () {
        if (this.defaultDate !== null && this.defaultDate !== '') {
          this.hour = this.defaultDate.split('-')[0];
          this.minute = this.defaultDate.split('-')[1];
          this.time = [this.hour, this.minute];
          this.timeStr = this.time.join('-');
        }
      }
    },
    mounted () {
      if (this.showDefault) {
        this.timeStr = this.time.join('-');
      }
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
      timeChange (value, index) {
        switch (index) {
          case 0:
            this.hour = value
            if (this.hour === '0小时') {
              this.timeSlots[1].values = minuteArr1
              this.minute = minuteArr1[0];
            } else {
              this.timeSlots[1].values = minuteArr2
              this.minute = minuteArr2[0];
            }
            break
          case 1:
            this.minute = value
            break
        }
        this.time = [this.hour, this.minute];
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
          this.hour = this.time[0];
          this.minute = this.time[1];
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
</style>
