<!--// 选择插件-->
<template>
  <div :style="pickStyle">
    <div @click="startChoose" v-if="type !== 'hide'" class="showText" :class="{'noChoose': itemNameStr === '请选择'}">
      <span v-text="title"></span><span v-text="itemNameStr"></span>
      <img v-if="type === 'right'" class="rightIcon" src="../../static/img/icon_next.png"/>
      <img v-if="type === 'down'" class="downIcon" src="../../static/img/picker_down.png"/>
    </div>
    <div class="lineHalfPx"></div>
    <div class="backGround" ref="backGround" @click="cancelChoose" :style="bgStyle">
    </div>
    <div class="pickerDiv" ref="pickerDiv" :style="divStyle">
      <div class="btnDiv">
        <p class="left"><button @click="cancelChoose">取消</button></p>
        <span class="center" v-text="optionTitle"></span>
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
        itemSlots: [],
        itemNameStr: '请选择',
        itemName: ['', ''],
        firstName: '',
        name: '',

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
      optionTitle: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      triggerClick: Boolean,
      items: Array,
      type: {
        type: String,
        default: 'down'
      },
      showDefault: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      items () {
        let itemArray = [];
        let itemMap = {};
        let mapArray = {};
        for (let i = 0; i < this.items.length; i++) {
          itemArray.push(this.items[i].name);
          itemMap[this.items[i].name] = {id: this.items[i].id};

          if (this.items[i].nextArray && this.items[i].nextArray.length > 0) {
            let secondMap = {};
            let secondArray = [];
            let items = this.items[i].nextArray;
            for (let j = 0; j < items.length; j++) {
              secondArray.push(items[j].name);
              secondMap[items[j].name] = {id: items[j].id};
            }
            itemMap[this.items[i].name].map = secondMap;
            mapArray[this.items[i].name] = secondArray;
          }
        }

        this.itemMap = itemMap;
        this.mapArray = mapArray;
        let slots = [{
          width: '100%',
          textAlign: 'center',
          values: itemArray
        }];

        if (mapArray[this.items[0].name]) {
          slots.push({
            width: '100%',
            textAlign: 'center',
            values: mapArray[this.items[0].name]
          });
        }
        this.itemSlots = slots;

        this.itemChange(this.items[0].name, 0);
        if (this.items[0].nextArray && this.items[0].nextArray.length > 0) {
          this.itemChange(this.items[0].nextArray[0].name, 1);
        }

        this.itemName = [this.firstName];
        if (this.name && this.name !== '') {
          this.itemName.push(this.name);
        }
        if (this.showDefault) {
          this.itemNameStr = this.itemName.join('-');
        }
      },
      triggerClick () {
        this.startChoose();
      }
    },
    mounted () {
    },
    methods: {
      itemChange (value, index) {
        switch (index) {
          case 0:
            this.firstName = value;
            this.name = '';

            let slots = [{
              width: '100%',
              textAlign: 'center',
              values: this.itemSlots[0].values
            }];

            if (this.mapArray[value]) {
              slots.push({
                width: '100%',
                textAlign: 'center',
                values: this.mapArray[value]
              });
              this.name = this.mapArray[value][0];
            }
            this.itemSlots = slots;

            break;
          case 1:
            this.name = value;
            break;
        }
        this.itemName = [this.firstName];
        if (this.name && this.name !== '') {
          this.itemName.push(this.name);
        }
      },
      startChoose () {
        this.pickStyle = {
          'z-index': 4
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
          if (!this.itemName[i] || this.itemName[i] === '') {
            break;
          }
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

        if (this.itemNameStr !== '请选择') {
          this.firstName = this.itemNameStr.split('-')[0];
          this.name = this.itemNameStr.split('-')[1];


          let slots = [{
            width: '100%',
            textAlign: 'center',
            values: this.itemSlots[0].values
          }];

          if (this.mapArray[this.firstName]) {
            slots.push({
              width: '100%',
              textAlign: 'center',
              values: this.mapArray[this.firstName]
            });
          }
          this.itemSlots = slots;

          this.itemName = [this.firstName];
          if (this.name && this.name !== '') {
            this.itemName.push(this.name);
          }
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
      .center
        font-size: 13px
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
    justify-content: center
    color: #646464
    height: 100%
    &.noChoose
      color: #bbbbbb
    span
      font-size: 15px
      margin-right: 5px
      max-width: 160px
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
      display: inline-block
      vertical-align: middle
    .rightIcon
      height: 13px
      width: 8px
      position: relative;
    .downIcon
      height: 5px
      width: 8px
      top: 1px;
      position: relative;
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
