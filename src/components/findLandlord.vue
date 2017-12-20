<template>
  <div class="findMap">
    <div class="mapFindNavBar">
      <img class="backBtn" @click="back" src="../static/img/icon-back.png"/>
      <mg-single-picker :items="itemArray" type="down" @choose="chooseCity" :defaultId="city"></mg-single-picker>
      <mg-single-picker :items="itemArray" type="down" @choose="chooseStage" :defaultId="stage"></mg-single-picker>
      <mg-single-picker :items="itemArray" type="down" @choose="chooseType" :defaultId="type"></mg-single-picker>
    </div>
    <div id="findMapDiv">
    </div>
  </div>
</template>
<script>
  let itemArray = [
    {name: '全部', id: 1},
    {name: '公客', id: 2},
    {name: '私客', id: 3},
  ]

  import AMap from 'AMap'
  import singlePicker from './base/singlePicker.vue'
  export default {
    components: {
      'mg-single-picker': singlePicker
    },
    data () {
      return {
        itemArray: [],
        type: 1,
        stage: 1,
        city: 1,
      }
    },
    mounted () {
      this.itemArray = itemArray;

      this.map = new AMap.Map('findMapDiv', {
        zoom: 17,
        center: [121.48, 31.22]
      });
      AMap.plugin(['AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.Geolocation'], () => {
        try {
          this.initMap();
        } catch (e) {
          console.error(e);
        }
      });
    },
    methods: {
      back () {
        this.$router.go(-1);
      },
      chooseCity (value) {
        this.city = value;
      },
      chooseStage (value) {
        this.stage = value;
      },
      chooseType (value) {
        this.type = value;
      },
      initMap () {}
    }
  }
</script>

<style lang="stylus" scoped>
  .findMap
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
  #findMapDiv
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: -1

  .mapFindNavBar
    position: absolute
    top: 20px
    left: 0
    right: 0
    height: 48px
    margin: 0 12px
    z-index: 0
    display: flex
    align-items: center
    background-color: #ffffff
    box-shadow: 0 2px 4px 0 #cccccc

    .backBtn
      height: 20px
      width: 20px
      margin: 0 10px
</style>
