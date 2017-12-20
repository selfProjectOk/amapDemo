<!--// 选择插件-->
<template>
  <div :style="pickStyle">
    <div @click="startChoose" class="showText" :class="{'noChoose': itemNameStr === '请选择地区'}">
      <span v-text="itemNameStr"></span>
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
      <mg-picker :slots="itemSlots" :visible-item-count="5" @change="itemChange" :values="itemName"/>
    </div>
  </div>
</template>

<script>
  import picker from './picker/picker.vue'
  export default {
    components: {
      'mg-picker': picker
    },
    data () {
      return {
        itemSlots: [
          {
            width: '100%',
            textAlign: 'center',
            values: []
          },
          {
            width: '100%',
            textAlign: 'center',
            values: []
          },
          {
            width: '100%',
            textAlign: 'center',
            values: []
          }
        ],
        itemNameStr: '请选择地区',
        itemName: ['', '', ''],
        firstName: '',
        secondName: '',
        thirdName: '',

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
        itemMap: {},
        mapArray: {}
      }
    },
    props: {
      items: Array,
      type: {
        type: String,
        default: 'down'
      },
      defaultProvinceId: {
        type: [Number, String],
        default: null
      },
      showDefault: {
        type: Boolean,
        default: false
      },
      defaultCityId: {
        type: [Number, String],
        default: null
      },
      defaultDistrictId: {
        type: [Number, String],
        default: null
      }
    },
    watch: {
      defaultProvinceId () {
        this.resetPicker();
      },
      items () {
        this.resetPicker();
      }
    },
    mounted () {
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
      resetPicker () {
        let defaultProvinceName = null;
        let defaultCityName = null;
        let defaultDistrictName = null;

        let itemArray = [];
        let itemMap = {};
        for (let i = 0; i < this.items.length; i++) {
          itemArray.push(this.items[i].name);
          itemMap[this.items[i].name] = {id: this.items[i].id};

          if (this.defaultProvinceId !== null && this.defaultProvinceId !== '' && this.defaultProvinceId === this.items[i].id) {
            defaultProvinceName = this.items[i].name;
          }

          if (this.items[i].nextArray) {
            let secondMap = {};
            let secondArray = [];
            let items = this.items[i].nextArray;
            for (let j = 0; j < items.length; j++) {
              secondArray.push(items[j].name);
              secondMap[items[j].name] = {id: items[j].id};

              if (this.defaultCityId !== null && this.defaultCityId !== '' && this.defaultCityId === items[j].id) {
                defaultCityName = items[j].name;
              }

              if (items[j].nextArray) {
                let thirdMap = {};
                let thirdArray = [];
                let thirdItems = items[j].nextArray;
                for (let k = 0; k < thirdItems.length; k++) {
                  thirdArray.push(thirdItems[k].name);
                  thirdMap[thirdItems[k].name] = {id: thirdItems[k].id};

                  if (this.defaultDistrictId !== null && this.defaultDistrictId !== '' && this.defaultDistrictId === thirdItems[k].id) {
                    defaultDistrictName = thirdItems[k].name;
                  }
                }
                secondMap[items[j].name].map = thirdMap;
                secondMap[items[j].name].array = thirdArray;
              }
            }
            itemMap[this.items[i].name].map = secondMap;
            itemMap[this.items[i].name].array = secondArray;
          }
        }

        this.itemMap = itemMap;
        this.itemSlots[0].values = itemArray;
        this.itemSlots[1].values = itemMap[this.items[0].name].array;
        this.itemSlots[2].values = itemMap[this.items[0].name]['map'][this.items[0]['nextArray'][0].name].array;


        if (defaultProvinceName !== null && defaultCityName !== null && defaultDistrictName !== null) {
          this.itemChange(defaultProvinceName, 0);
          this.itemChange(defaultCityName, 1);
          this.itemChange(defaultDistrictName, 2);
          this.itemName = [this.firstName, this.secondName, this.thirdName];
          this.itemNameStr = this.itemName.join('-');
        } else {
          this.itemChange(this.items[0].name, 0);
          this.itemChange(this.items[0].nextArray[0].name, 1);
          this.itemChange(this.items[0].nextArray[0].nextArray[0].name, 2);
          this.itemName = [this.firstName, this.secondName, this.thirdName];
          if (this.showDefault) {
            this.itemNameStr = this.itemName.join('-');
          }
        }
      },
      itemChange (value, index) {
        switch (index) {
          case 0:
            this.firstName = value;
            this.itemSlots[1].values = this.itemMap[this.firstName].array;
            this.itemChange(this.itemMap[this.firstName]['array'][0], 1);
            break;
          case 1:
            this.secondName = value;
            this.itemSlots[2].values = this.itemMap[this.firstName]['map'][this.secondName]['array'];
            this.itemChange(this.itemMap[this.firstName]['map'][this.secondName]['array'][0], 2);
            break;
          case 2:
            this.thirdName = value;
            break;
        }
        this.itemName = [this.firstName, this.secondName, this.thirdName];
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

        let valueArray = [];
        let map = this.itemMap;
        for (let i = 0; i < this.itemName.length; i++) {
          valueArray.push(map[this.itemName[i]].id);
          let mapp = map[this.itemName[i]].map;
          map = mapp;
          if (!map) {
            break;
          }
        }

        this.itemNameStr = this.itemName.join('-');
        this.$emit('choose', this.itemNameStr, valueArray);
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

        if (this.itemNameStr !== '请选择地区') {
          this.firstName = this.itemNameStr.split('-')[0];
          this.secondName = this.itemNameStr.split('-')[1];
          this.thirdName = this.itemNameStr.split('-')[2];

          this.itemSlots[1].values = this.itemMap[this.firstName].array;
          this.itemSlots[2].values = this.itemMap[this.firstName]['map'][this.secondName].array;
          this.itemName = [this.firstName, this.secondName, this.thirdName];
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
