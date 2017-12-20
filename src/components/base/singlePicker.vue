<!--// 选择插件-->
<template>
  <div class="singlePicker" :style="pickStyle">
    <div @click="startChoose" class="showText" :class="{'noChoose': itemNameStr === '请选择'}">
      <span v-text="title"></span><span v-text="itemNameStr"></span>
      <img v-if="type === 'right'" class="rightIcon" src="../../static/img/icon_next.png"/>
      <img v-if="type === 'down'" class="downIcon" src="../../static/img/icon_next.png"/>
    </div>
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
        itemSlots: [
          {
            width: '100%',
            textAlign: 'center',
            values: []
          }
        ],
        itemNameStr: '请选择',
        itemName: [''],
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
        itemMap: {}
      }
    },
    props: {
      optionTitle: {
        type: String,
        default: ''
      },
      items: Array,
      type: {
        type: String,
        default: 'down'
      },
      showDefault: {
        type: Boolean,
        default: false
      },
      defaultId: {
        type: [Number, String],
        default: null
      },
      title: {
        type: String,
        default: ''
      }
    },
    watch: {
      defaultId () {
        for (let i = 0; i < this.items.length; i++) {
          if (this.defaultId !== null && this.defaultId !== '' && this.defaultId == this.items[i].id) {
            this.itemNameStr = this.items[i].name;
            this.itemName = [this.items[i].name];
          }
        }
      },
      items () {
        let defaultName = null;
        let itemArray = [];
        let itemMap = {};
        for (let i = 0; i < this.items.length; i++) {
          itemArray.push(this.items[i].name);
          itemMap[this.items[i].name] = {id: this.items[i].id};
          if (this.defaultId !== null && this.defaultId !== '' && this.defaultId == this.items[i].id) {
            defaultName = this.items[i].name;
          }
        }

        this.itemMap = itemMap;
        this.itemSlots[0].values = itemArray;
        if (this.showDefault) {
          this.itemNameStr = this.items[0].name;
        }
        this.itemName = [this.items[0].name];

        if (defaultName !== null) {
          this.itemNameStr = defaultName;
          this.itemName = [defaultName];
        }

//        this.endChoose();
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
        this.itemName = [value];
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

        let value = this.itemMap[this.itemName[0]].id;

        this.itemNameStr = this.itemName.join('-');
        this.$emit('choose', value, this.itemNameStr);
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
          this.itemName = [this.itemNameStr]
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
