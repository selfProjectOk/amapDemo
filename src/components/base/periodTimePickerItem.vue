<!--// 时间选择插件-->
<template>
  <div class="timePicker">
    <div class="pickerDiv">
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

        time: ['2017', '01', '01'],
        year: '2017',
        month: '01',
        date: '01',
      }
    },
    watch: {
      defaultDate () {
        this.initItem(this.defaultDate);
      }
    },
    mounted () {
      this.initItem(this.defaultDate);
    },
    methods: {
      initItem (defaultDate) {
        if (defaultDate !== null && defaultDate !== '') {
          this.year = defaultDate.split('-')[0];
          this.month = defaultDate.split('-')[1];
          this.date = defaultDate.split('-')[2];
          this.time = [this.year, this.month, this.date];
        }
        this.timeChange(this.month, 1, 'notChoose');
      },
      timeChange (value, index, isNotChoose) {
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
        if (isNotChoose === 'notChoose') {
          return;
        }
        this.$emit('timeChange', this.time.join('-'));
      },
    }
  }
</script>

<style lang="stylus" scoped>
</style>
