// 展示图片
<template>
  <div class="image"
       ref="image"
       :class="{'loadFail': loadState === 'fail', 'loading': loadState === 'loading'}"
       :style="{height: (documentWidth - 15) * 0.292 + 'px'}">
    <img class="smallImg"
         ref="smallImg"
         :class="{'smallImgMaxWidth': smallMaxWidth}"
         :src="src"
         @click="smallImgClick"/>
    <img class="deleteIcon" v-if="isShowClose" src="../../static/img/image_delete.png" @click="$emit('close')" />
    <div class="bigImgBg" :style="bgStyle">
    </div>
    <div class="bigImgDiv" :style="divStyle">
      <img class="bigImg" ref="bigImg" :src="src" :style="imgStyle"/>
    </div>
  </div>
</template>

<script>
  import PhotoSwipe from '../../common/photoswipe'
  import PhotoSwipeUIDefault from '../../common/photoswipe-ui-default'

  export default {
    components: {
    },
    props: {
      src: String,
      isShowClose: {
        type: Boolean,
        default: true
      },
      loadState: {
        type: String,
        default: 'success'
      }
    },
    data () {
      return {
        documentWidth: document.body.clientWidth,
        bgStyle: {
          opacity: 0,
          display: 'none'
        },
        divStyle: {
          transform: 'translateY(0)',
          display: 'none'
        },
        imgStyle: {},
        bigImgDivClickNum: 0,
        bigImgDivClickTid: null,
        width: null,
        height: null,
        smallMaxWidth: false
      }
    },
    mounted() {
      this.$refs.smallImg.onload = this.smallImgLoaded;
    },
    methods: {
      smallImgLoaded () {
        this.resize();
      },
      resize () {
        if (this.$refs.image.offsetWidth <= 0.5) {
          return;
        }
        let smallImgWidth = this.$refs.smallImg.offsetWidth;
        let smallImgHeight = this.$refs.smallImg.offsetHeight;
        let imgWidth = this.$refs.image.offsetWidth;
        let imgHeight = this.$refs.image.offsetHeight;
        if ((smallImgWidth / smallImgHeight) < (imgWidth / imgHeight)) {
          this.smallMaxWidth = true;
        } else {
          this.smallMaxWidth = false;
        }
      },
      smallImgClick () {
        this.showBigImg();
      },
      loadBigImg () {
        let pswpElement = document.querySelectorAll('.pswp')[0];
        let items = [
          {
            src: this.src,
            w: this.width,
            h: this.height
          }
        ];
        let options = {
          barsSize: {
            top: 100,
            bottom: 100
          },
          shareButtons: [
            {id: 'download', label: '保存图片', url: '{{raw_image_url}}', download: true}
          ],
          focus: false,
          captionEl: false,
          fullscreenEl: false,
          zoomEl: false,
          shareEl: false
        };
        let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUIDefault, items, options);
        gallery.init();
      },
      showBigImg () {
        this.bgStyle = {
          opacity: 0.5,
          display: 'block'
        };
        this.divStyle = {
          transform: 'translateY(0)',
          display: 'flex'
        }
        let imgH = this.$el.lastChild.children[0].height;
        let imgW = this.$el.lastChild.children[0].width;
        this.imgStyle.width = window.innerWidth + 'px';
        this.imgStyle.height = window.innerWidth * imgH / imgW + 'px';
        this.width = imgW;
        this.height = imgH;
        this.loadBigImg();
        this.hideBigImg();
      },
      hideBigImg () {
        this.bgStyle = {
          opacity: 0,
          display: 'none'
        };
        this.divStyle = {
          transform: 'translateY(0)',
          display: 'none'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .image
    position: relative
    margin-right: 4.1%
    width: 29.2%
    margin-bottom: 15px
    display: flex
    justify-content: center
    align-items: center
    border-radius: 10px
    background-color: #ffffff
    overflow: hidden
    .smallImg
      height: 100%
    .smallImgMaxWidth
      height: auto
      width: 100%
    .deleteIcon
      position: absolute
      height: 19px
      width: 19px
      top: 5px
      right: 5px

  .loadFail
    border: 1px solid #ff5353
  .loading
    border: 1px solid yellow

  .bigImgDiv
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    display: flex
    flex-direction: column
    justify-content: center
    z-index: 2
    overflow: auto
    .bigImg
      z-index: 2

</style>
