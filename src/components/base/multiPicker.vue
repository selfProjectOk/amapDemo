<!--// 选择插件-->
<template>
  <div class="multiPicker" :style="pickStyle">
    <div @click="startChoose" class="showText" :class="{'noChoose': itemNameStr === '请选择'}">
      <span v-text="title"></span><span v-text="itemNameStr"></span>
      <img v-if="type === 'right'" class="rightIcon" src="../../static/img/icon_next.png"/>
      <img v-if="type === 'down'" class="downIcon" src="../../static/img/icon_next.png"/>
    </div>
    <div class="backGround" ref="backGround" @click="cancelChoose" :style="bgStyle">
    </div>
    <div class="pickerDiv" ref="pickerDiv" :style="divStyle">
      <p class="muitiTitle" v-text="optionTitle"></p>
      <div class="optionDiv">
        <mg-multi-picker-item v-for="item, index in items" @click="itemChange" :item="item" :key="index"></mg-multi-picker-item>
      </div>
      <div class="btnDiv">
        <p class="left"><button @click="cancelChoose">取消</button></p>
        <p class="right"><button @click="endChoose">确定</button></p>
      </div>
    </div>
  </div>
</template>

<script>
  import multiPickerItem from './multiPickerItem.vue'

  export default {
    components: {
      'mg-multi-picker-item': multiPickerItem
    },
    data () {
      return {
        isInit: false,
        otherCheck: false,
        otherText: '',
        itemNameStr: '请选择',
        itemNameSave: [],
        itemIdSave: [],

        pickStyle: {
          'z-index': 'auto'
        },
        bgStyle: {
          opacity: 0,
          display: 'none'
        },
        divStyle: {
          display: 'none'
        },
        items: [],
        itemMap: {},
        dataDefaultId: []
      }
    },
    props: {
      optionTitle: {
        type: String,
        default: ''
      },
      originItems: Array,
      canResetItem: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'down'
      },
      pickType: {
        type: String,
        default: 'multi'
      },
      defaultId: {
        type: [Array, String, Number],
        default () {
          return [];
        }
      },
      title: {
        type: String,
        default: ''
      }
    },
    watch: {
      defaultId () {
        // 初始化已选值
        if (this.defaultId && (this.defaultId.constructor === String || this.defaultId.constructor === Number)) {
          this.dataDefaultId = [this.defaultId];
        } else {
          this.dataDefaultId = this.defaultId;
        }
        if (this.dataDefaultId && this.dataDefaultId.constructor === Array && this.dataDefaultId.length !== 0) {
          this.itemNameSave = [];
          this.itemIdSave = [];
          this.items = [];
          for (let i = 0; i < this.originItems.length; i++) {
            this.items.push({
              name: this.originItems[i].name,
              id: this.originItems[i].id,
              check: false
            });
          }
          for (let j = 0; j < this.dataDefaultId.length; j++) {
            let id = (this.dataDefaultId[j].toString().match('##')) ? this.dataDefaultId[j].toString().split('##')[1] : this.dataDefaultId[j].toString();
            let value = (this.dataDefaultId[j].toString().match('##')) ? this.dataDefaultId[j].toString().split('##')[0] : null;
            for (let i = 0; i < this.items.length; i++) {
              if (id == this.items[i].id) {
                this.itemIdSave.push(this.items[i].id);
                this.items[i].check = true;
                if (value !== null) {
                  this.items[i].otherText = value;
                }
                if (this.items[i].name === '其他' && this.items[i].otherText && this.items[i].otherText !== '') {
                  this.itemNameSave.push(this.items[i].otherText);
                } else {
                  this.itemNameSave.push(this.items[i].name);
                }
              }
            }
          }
          if (this.itemNameSave.length !== 0) {
            let nameStr = this.itemNameSave.join('；')
            this.itemNameStr = (nameStr.length > 10) ? (nameStr.slice(0, 10) + '...') : nameStr;
          }
        }
      },
      originItems () {
        this.initItem();
      }
    },
    mounted () {
      if (this.originItems.length !== 0) {
        this.initItem();
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
      initItem () {
        if (!this.isInit || this.canResetItem) {
          this.isInit = true;
          // 初始化已选值
          let itemMap = {};
          for (let i = 0; i < this.originItems.length; i++) {
            itemMap[this.originItems[i].name] = {id: this.originItems[i].id};
          }
          this.itemMap = itemMap;


          this.items = [];
          for (let i = 0; i < this.originItems.length; i++) {
            this.items.push({
              name: this.originItems[i].name,
              id: this.originItems[i].id,
              check: false
            });
          }

          if (this.defaultId && (this.defaultId.constructor === String || this.defaultId.constructor === Number)) {
            this.dataDefaultId = [this.defaultId];
          } else {
            this.dataDefaultId = this.defaultId;
          }
          if (this.dataDefaultId && this.dataDefaultId.constructor === Array && this.dataDefaultId.length !== 0) {
            this.itemNameSave = [];
            this.itemIdSave = [];
            for (let j = 0; j < this.dataDefaultId.length; j++) {
              let id = (this.dataDefaultId[j].toString().match('##')) ? this.dataDefaultId[j].toString().split('##')[1] : this.dataDefaultId[j].toString();
              let value = (this.dataDefaultId[j].toString().match('##')) ? this.dataDefaultId[j].toString().split('##')[0] : null;
              for (let i = 0; i < this.items.length; i++) {
                if (id == this.items[i].id) {
                  this.itemIdSave.push(this.items[i].id);
                  this.items[i].check = true;
                  if (value !== null) {
                    this.items[i].otherText = value;
                  }
                  if (this.items[i].name === '其他' && this.items[i].otherText && this.items[i].otherText !== '') {
                    this.itemNameSave.push(this.items[i].otherText);
                  } else {
                    this.itemNameSave.push(this.items[i].name);
                  }
                }
              }
            }
            if (this.itemNameSave.length !== 0) {
              let nameStr = this.itemNameSave.join('；')
              this.itemNameStr = (nameStr.length > 10) ? (nameStr.slice(0, 10) + '...') : nameStr;
            }
          } else {
            this.itemNameStr = '请选择';
          }
        }
      },
      itemChange (id, name, otherText) {
        if (this.pickType === 'single' || name === '无') {
          for (let i = 0; i < this.items.length; i++) {
            let newMap = {
              name: this.items[i].name,
              id: this.items[i].id,
              check: false
            };
            if (this.items[i].otherText) {
              newMap.otherText = this.items[i].otherText;
            }
            this.items.splice(i, 1, newMap);
          }
        }

        for (let i = 0; i < this.items.length; i++) {
          if (name !== '无' && this.items[i].name === '无') {
            let newMap = {
              name: this.items[i].name,
              id: this.items[i].id,
              check: false
            };
            this.items.splice(i, 1, newMap);
          }

          if (id == this.items[i].id) {
            let newMap = {
              name: this.items[i].name,
              id: this.items[i].id,
              check: !this.items[i].check
            };
            if (otherText) {
              newMap.otherText = otherText;
            }
            this.items.splice(i, 1, newMap);
          }
        }
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
          display: 'block'
        }
      },
      endChoose () {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].otherText && this.items[i].otherText.match('##')) {
            this.$mogo.showMessage('勿输入##');
            return;
          }
        }
        this.pickStyle = {
          'z-index': 'auto'
        };
        this.bgStyle = {
          opacity: 0,
          display: 'none'
        };
        this.divStyle = {
          display: 'none'
        }

        this.itemNameSave = [];
        this.itemIdSave = [];
        let idArray = [];
        let allId = [];
        for (let i = 0; i < this.items.length; i++) {
          allId.push(this.items[i].id);
          if (this.items[i].check === true) {
            if (this.items[i].name === '其他' && this.items[i].otherText && this.items[i].otherText !== '') {
              this.itemNameSave.push(this.items[i].otherText);
            } else {
              this.itemNameSave.push(this.items[i].name);
            }
            this.itemIdSave.push(this.items[i].id);
            let id = (this.items[i].otherText) ? (this.items[i].otherText + '##' + this.items[i].id) : (this.items[i].id);
            idArray.push(id);
          }
        }
        let nameStr = this.itemNameSave.join('；')
        this.itemNameStr = (nameStr.length > 10) ? (nameStr.slice(0, 10) + '...') : nameStr;
        if (this.itemIdSave.length === 0) {
          this.itemNameStr = '请选择';
        }
        this.$emit('choose', idArray, allId, this.itemNameSave, this.itemIdSave);
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
          display: 'none'
        }

        for (let i = 0; i < this.items.length; i++) {
          let newMap = {
            name: this.items[i].name,
            id: this.items[i].id,
            check: false
          };
          if (this.items[i].otherText) {
            newMap.otherText = this.items[i].otherText;
          }
          this.items.splice(i, 1, newMap);
        }
        for (let j = 0; j < this.itemIdSave.length; j++) {
          for (let i = 0; i < this.items.length; i++) {
            if (this.itemIdSave[j] == this.items[i].id) {
              let newMap = {
                name: this.items[i].name,
                id: this.items[i].id,
                check: true
              };
              if (this.items[i].otherText) {
                newMap.otherText = this.items[i].otherText;
              }
              this.items.splice(i, 1, newMap);
            }
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
    left: 50%
    top: 50%
    height: 335px
    width: 270px
    margin-left: -135px
    margin-top: -167px
    transition: all 0.25s
    z-index: 10
    border-radius: 8px
    overflow: hidden
    background-color: #ffffff
    .muitiTitle
      text-align: center
      line-height: 49px
      font-size: 17px
      color: #323232
    .optionDiv
      overflow: auto
      height: 240px

    .btnDiv
      height: 45px
      display: flex
      align-items: center
      border-top: 1px solid #f7f7f7
      background-color: #ffffff
      .left, .right
        flex: 1
        text-align: center
        button
          font-size: 17px
          line-height: 45px
          border: none
          outline: none
          background-color: transparent
      .left
        border-right: 1px solid #f7f7f7
        button
          color: #909090
      .right
        button
          color: #2e8afe

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
      height: 8px
      width: 13px
      top: 1px;
      position: relative;
</style>
