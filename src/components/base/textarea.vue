
<template>
  <div class="mgTextarea">
    <p class="title" v-text="title"></p>
    <div class="mgTextareaDiv">
      <textarea class="mgTextContent"
                ref="textarea"
                v-model="textValue"
                :placeholder="'     ' + placeholder"
                :maxlength="maxlength.toString()"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
      ></textarea>
      <img class="textAreaImg" v-if="textValue.length === 0" src="../../static/img/text_input.png"/>
    </div>
    <p class="number">
      <span v-text="textValue.length"></span><span>/</span><span v-text="maxlength.toString()"></span>
    </p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        textValue: ''
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      maxlength: {
        type: Number,
        default: 150
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      value: {
        type: String,
        default: ''
      }
    },
    watch: {
      textValue () {
        this.$emit('input', this.textValue);
      },
      value () {
        if (this.value) {
          this.textValue = this.value;
        }
      }
    },
    mounted () {
      if (this.value) {
        this.textValue = this.value;
      }
    },
    methods: {
      awake () {
        this.$refs.textarea.focus();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .mgTextarea
    background-color: #ffffff
    padding: 10px 15px
    .title
      color: #323232
      font-size: 15px
      text-align: left
      line-height: 25px
    .mgTextareaDiv
      position: relative
      .mgTextContent
        width: 100%
        border: none
        outline: none
        height: 90px
        font-size: 13px
        color: #909090
        line-height: 20px
      .textAreaImg
        position: absolute
        left: 4px
        top: 5px
        width: 14px
        height: 14px
    .number
      color: #909090
      font-size: 13px
      text-align: right
      line-height: 25px
</style>
