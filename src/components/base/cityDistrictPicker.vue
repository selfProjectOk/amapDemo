<!--// 选择插件-->
<template>
  <div :style="pickStyle">
    <div @click="startChoose" class="showText" :class="{'noChoose': itemNameStr === '请选择'}">
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
          }
        ],
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
      }
    },
    watch: {
      items () {
        let defaultProvinceName = null;
        let defaultCityName = null;

        let itemArray = [];
        let itemMap = {};
        let mapArray = {};
        for (let i = 0; i < this.items.length; i++) {
          itemArray.push(this.items[i].name);
          itemMap[this.items[i].name] = {id: this.items[i].id};

          if (this.items[i].nextArray) {
            let secondMap = {};
            let secondArray = [];
            let items = this.items[i].nextArray;
            for (let j = 0; j < items.length; j++) {
              secondArray.push(items[j].name);
              secondMap[items[j].name] = {id: items[j].id};

              if (this.defaultCityId !== null && this.defaultCityId !== '' && this.defaultCityId === items[j].id) {
                defaultCityName = items[j].name;
                defaultProvinceName = this.items[i].name;
              }
            }
            itemMap[this.items[i].name].map = secondMap;
            mapArray[this.items[i].name] = secondArray;
          }
        }

        this.itemMap = itemMap;
        this.mapArray = mapArray;
        this.itemSlots[0].values = itemArray;
        this.itemSlots[1].values = mapArray[this.items[0].name];


        if (defaultProvinceName !== null && defaultCityName !== null) {
          this.itemChange(defaultProvinceName, 0);
          this.itemChange(defaultCityName, 1);
          this.itemNameStr = this.firstName + '-' + this.name;
          this.itemName = [this.firstName, this.name];
        } else {
          this.itemChange(this.items[0].name, 0);
          this.itemChange(this.items[0].nextArray[0].name, 1);
          if (this.showDefault) {
            this.itemNameStr = this.firstName + '-' + this.name;
          }
          this.itemName = [this.firstName, this.name];
        }
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
      itemChange (value, index) {
        switch (index) {
          case 0:
            this.firstName = value;
            this.itemSlots[1].values = this.mapArray[value];
            this.name = this.mapArray[value][0];
            break;
          case 1:
            this.name = value;
            break;
        }
        this.itemName = [this.firstName, this.name];
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
          if (map && map[this.itemName[i]]) {
            let mapp = map[this.itemName[i]]['map'];
            map = mapp;
          }
          if (map === undefined) {
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
          this.itemSlots[1].values = this.mapArray[this.firstName];
          this.itemName = [this.firstName, this.name];
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
