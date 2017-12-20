// 去相册或者照相机加载图片
<template>
  <div @click="startUpload" class="loadImageDiv" :style="{height: (documentWidth - 15) * 0.292 + 'px'}" v-show="imgArr.length < imgNumLimit">
    <slot>
      <div class="image"><img src="../../static/img/loadimage_add.png"/></div>
    </slot>
    <form ref="form" class="inputForm" style="display: block;"><input type="file" v-if="(type !== 'onlyCamera')" multiple accept="image/*;capture=camera" @change="uploadImg($event)" ref="upInput"/></form>
  </div>
</template>
<script>
  import EXIF from '../../common/exif'
  const MAX_IMAGE_SIZE = 512000;

  import HybridJS from '../../common/core'
  const $M = HybridJS
  export default{
    name: "image-html5-upload",
    data () {
      return {
        documentWidth: document.body.clientWidth,
      }
    },
    props: {
      imgArr: {
        type: Array,
        default: Array
      },
      // 一次最多可以上传多少张照片
      imgNumLimit: {
        type: Number,
        default: 4
      },
      type: {
        type: String,
        default: 'default'
      }
    },
    mounted () {
      if (this.type === 'onlyCamera') {
        $M.nativeReady(bridge => {
          bridge.registerHandler('cameraOnClick', (data, responseCallback) => {
            let imageData = JSON.parse(data);
            let base64 = imageData.base64;
            let base64str = base64.substring(22);
            let equalIndex = base64str.indexOf('=');
            if (equalIndex > 0) {
              base64str = base64str.substring(0, equalIndex);
            }
            let base64Length = parseInt(base64str.length - (base64str.length / 8) * 2);

            if (base64Length / MAX_IMAGE_SIZE > 1) {
              this.imgScale(base64, Math.sqrt(base64Length / MAX_IMAGE_SIZE));
            } else {
              this.imgArr.push({"src": base64});
              this.$emit('imageLoaded', this.imgArr, this.imgArr.length - 1);
            }
          })
        })
      }
    },
    methods: {
      "startUpload": function() {
        if (this.type === 'onlyCamera') {
          $M.nativeReady(bridge => {
            bridge.callHandler('camera');
          })
        }
      },
      "uploadImg": function(e) {
        let tag = e.target;
        let fileList = tag.files;
        let imgNum = fileList.length;
        let _this = this;
//        this.imgArr.splice(0,this.imgArr.length);//图片数据清零
        if (this.imgArr.length + imgNum > this.imgNumLimit) {
          this.$mogo.showMessage('最多添加' + this.imgNumLimit + '张图片');
          return;
        }

        for (let i = 0; i < imgNum; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(fileList[i]);
          reader.onload = function() {
            var oReader = new FileReader();
            oReader.onload = function(e) {
              var image = new Image();
              image.src = e.target.result;
              image.onload = function() {
                let Orientation;
                EXIF.getData(image, function() {
                  Orientation = EXIF.getTag(image, 'Orientation');
                });

                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;
                if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                  expectWidth = 800;
                  expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                  expectHeight = 1200;
                  expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                }
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = expectWidth;
                canvas.height = expectHeight;
                ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                // 修复ios上传图片的时候 被旋转的问题
                if (Orientation !== "" && Orientation !== 1) {
                  switch (Orientation) {
                    case 6:// 需要顺时针（向左）90度旋转
                      _this.rotateImg(this, 'left', canvas);
                      break;
                    case 8:// 需要逆时针（向右）90度旋转
                      _this.rotateImg(this, 'right', canvas);
                      break;
                    case 3:// 需要180度旋转
                      _this.rotateImg(this, 'right', canvas);// 转两次
                      _this.rotateImg(this, 'right', canvas);
                      break;
                  }
                }

                var base64 = canvas.toDataURL("image/jpeg", 0.92);
                var base64str = base64.substring(22);
                var equalIndex = base64str.indexOf('=');
                if (equalIndex > 0) {
                  base64str = base64str.substring(0, equalIndex);
                }
                var base64Length = parseInt(base64str.length - (base64str.length / 8) * 2);

                if (base64Length / MAX_IMAGE_SIZE > 1) {
                  _this.imgScale(base64, Math.sqrt(base64Length / MAX_IMAGE_SIZE));
                } else {
                  _this.imgArr.push({"src": base64});
                  _this.$emit('imageLoaded', _this.imgArr, _this.imgArr.length - 1);
                  _this.$refs.form.reset();
                }
              };
            };
            oReader.readAsDataURL(fileList[i]);
          }
        }
      },
      "imgScale": function(imgUrl, quality) {
        let img = new Image();
        let _this = this;
        let canvas = document.createElement('canvas');
        let cxt = canvas.getContext('2d');
        img.src = imgUrl;
        img.onload = function() {
          // 缩放后图片的宽高
          let width = img.naturalWidth / quality;
          let height = img.naturalHeight / quality;
          canvas.width = width;
          canvas.height = height;
          cxt.drawImage(this, 0, 0, width, height);
          _this.imgArr.push({"src": canvas.toDataURL('image/jpeg')});
          _this.$emit('imageLoaded', _this.imgArr, _this.imgArr.length - 1);
          _this.$refs.form.reset();
        }
      },
      "rotateImg": function (img, direction, canvas) { // 图片旋转
        var minStep = 0;
        var maxStep = 3;
        if (img === null) return;
        var height = img.height;
        var width = img.width;
        var step = 2;
        if (step == null) {
          step = minStep;
        }
        if (direction === 'right') {
          step++;
          step > maxStep && (step = minStep);
        } else {
          step--;
          step < minStep && (step = maxStep);
        }
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        switch (step) {
          case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
          case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
          case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
          case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
        }
      }
    }
  }


</script>

<style lang="stylus">
  .loadImageDiv
    position: relative
    margin-right: 4.1%
    width: 29.2%
    margin-bottom: 15px
    .image
      display: flex
      justify-content: center
      align-items: center
      background-color: #fafbfd
      border: dotted 1px #cccccc
      width: 100%
      height: 100%
      img
        height: 35px
        width: 35px

    .inputForm
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      overflow: hidden
      opacity: 0
      input
        display: inline-block
        position: absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
</style>
