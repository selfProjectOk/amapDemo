<template>
  <div class="searchMap">
    <div class="mapSearchNavBar">
      <img class="backBtn" @click="back" src="../static/img/icon-back.png"/>
      <form @submit="keywordSubmit" class="searchKeywordDiv" action="javascript:void(0)">
        <input type="text"
               class="searchKeyword"
               ref="searchKeyword"
               maxlength="12"
               placeholder="输入详细地址"
               @focus="isResultDivHide = false;"
               v-model="searchKeyword"/>
      </form>
      <img class="clearSearch" @click="clearSearch" v-show="searchKeyword !== ''" src="../static/img/image_delete.png"/>
      <span class="cancelSearch" @click="startSearch" v-show="searchKeyword !== ''">搜索</span>
    </div>
    <mg-scroll-div class="resultDiv"
                   :class="{'resultDivHide': isResultDivHide}"
                   @willScrollToBottom="loadMoreResult">
      <div class="resultDivTitle">
        <p>建议</p>
      </div>
      <mg-auto-search-result-cell v-for="item, index in searchResult"
                                  :key="index"
                                  :item="item"
                                  @click="resultClick"
      ></mg-auto-search-result-cell>
      <div class="resultDivNoMore" v-show="!hasNext">
        <p>无更多数据</p>
      </div>
    </mg-scroll-div>
    <div class="bottomResultDiv"
         :class="{'bottomResultDivHide': !isResultDivHide}"
         v-show="chooseAddressMap.position">
      <div class="bottomResult">
        <p class="resultName" v-text="chooseAddressMap.name"></p>
        <p class="resultAddress" v-text="chooseAddressMap.address"></p>
      </div>
      <p class="resultFinish">确定</p>
    </div>
    <div id="searchMapDiv">
    </div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import AMapUI from 'AMapUI'
  import autoSearchResultCell from './autoSearchResultCell.vue'
  import scrollDiv from './scrollDiv.vue'
  export default {
    components: {
      'mg-auto-search-result-cell': autoSearchResultCell,
      'mg-scroll-div': scrollDiv,
    },
    data () {
      return {
        map: null,
        placeSearch: null,
        clickListener: null,
        geocoder: null,
        geolocation: null,
        positionPicker: null,

        isResultDivHide: true,
        searchKeyword: '',
        searchResult: [],

        city: '上海',

        searchItem: null,
        currentPage: 1,
        hasNext: true,

        chooseAddressMap: {}
      }
    },
    mounted () {
      AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
        this.map = new AMap.Map('searchMapDiv', {
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

        this.initPositionPicker(PositionPicker);
      });
    },
    beforeDestroy () {
      this.positionPicker.stop();
    },
    methods: {
      back () {
        this.$router.go(-1);
      },
      // 自定义导航栏元素事件
      startSearch () {
        this.keywordSubmit();
      },
      clearSearch () {
        this.searchKeyword = '';
        this.searchResult = [];
        this.hasNext = true;
        this.$nextTick(() => {
          this.$refs.searchKeyword.focus();
        })
      },
      keywordSubmit () {
        this.$refs.searchKeyword.blur();

        if (this.placeSearch) {
          this.searchResult = [];
          this.searchItem = null;
          this.currentPage = 1;
          this.hasNext = true;
          this.loadSearchResult();
        }
      },
      setChooseAddressMap (addressMap) {
        this.chooseAddressMap = addressMap;
      },

      // aMapUI事件
      initPositionPicker (PositionPicker) {
        this.positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: this.map,
        });
        this.positionPicker.on('success', (positionResult) => {
          let addressMap = this.getFormattedAddressByResult(positionResult.regeocode.addressComponent);
          addressMap.position = {
            lat: positionResult.position.lat,
            lng: positionResult.position.lng,
          };
          this.setChooseAddressMap(addressMap);
        });
        this.positionPicker.start();
      },

      // aMap事件
      initMap () {
        // 构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: this.city,
          type: '商务住宅'
        });
        this.clickListener = AMap.event.addListener(this.map, "click", this.mapClick);

        this.geocoder = new AMap.Geocoder({
          city: this.city
        });

        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
          convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        // 显示定位按钮，默认：true
          buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 80), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        this.startLocate();
      },
      startLocate () {
        this.map.addControl(this.geolocation);
        this.geolocation.getCurrentPosition();
        AMap.event.addListener(this.geolocation, 'complete', (result) => {
          this.$refs.searchKeyword.blur();
          this.isResultDivHide = true;
          this.map.setCenter(result.position);
          this.map.setZoom(17);
        }); // 返回定位信息
        AMap.event.addListener(this.geolocation, 'error', (err) => {
          console.log('定位失败');
          console.log(err);
        });      // 返回定位出错信息
      },
      mapClick (e) {
        this.$refs.searchKeyword.blur();
        this.isResultDivHide = true;
      },
      loadMoreResult () {
        if (this.placeSearch && this.hasNext) {
          this.loadSearchResult();
        }
      },
      loadSearchResult () {
        if (this.isResultDivHide) this.isResultDivHide = false;
        let item = {
          adcode: this.city,
          name: this.searchKeyword
        }
        if (this.searchItem) {
          item = this.searchItem;
        }
        this.placeSearch.setPageIndex(this.currentPage);
        this.placeSearch.setCity(item.adcode);
        this.placeSearch.search(item.name, (status, result) => {
          if (status === 'complete') {
            this.searchResult = this.searchResult.concat(result.poiList.pois);
            this.currentPage = result.poiList.pageIndex + 1;
            this.hasNext = result.poiList.count > (result.poiList.pageIndex * result.poiList.pageSize);
          } else {
            this.searchResult = this.searchResult.concat([]);
            this.hasNext = false;
          }
        });
      },
      resultClick (item) {
        this.$refs.searchKeyword.blur();
        this.isResultDivHide = true;
        this.map.setCenter([item.location.L, item.location.N]);
        this.map.setZoom(17);
      },
      getFormattedAddressByResult (addressComponent) {
        let name = '';
        if (addressComponent.building !== '') {
          name = addressComponent.building;
        } else if (addressComponent.neighborhood !== '') {
          name = addressComponent.neighborhood;
        }
        let address = addressComponent.province + addressComponent.city + addressComponent.district;
        let detailAddress = '';
        if (addressComponent.street === '') {
          detailAddress = addressComponent.township;
        } else {
          detailAddress = addressComponent.street + addressComponent.streetNumber;
        }
        return {
          adcode: addressComponent.adcode,
          name: name,
          address: address + detailAddress,
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .searchMap
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
  #searchMapDiv
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

  .mapSearchNavBar, .mapNavBar
    position: absolute
    top: 20px
    left: 0
    right: 0
    height: 48px
    margin: 0 12px
    z-index: 201
    display: flex
    align-items: center
    background-color: #ffffff
    box-shadow: 0 2px 4px 0 #cccccc

    .backBtn, .searchIcon
      height: 20px
      width: 20px
      margin: 0 10px
    .clearSearch
      height: 14px
      width: 14px
      margin: 0 10px 0 5px
    .cancelSearch
      font-size: 16px
      line-height: 16px
      color: #646464
      display: inline-block
      padding: 0 10px
      margin-right: 3px
      border-left: 1px solid #cccccc
    .showKeyword
      flex: 1
      padding: 0 10px
      font-size: 16px
      color: #323232
      line-height: 40px
      height: 40px
      text-align: left
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

    .searchKeywordDiv
      flex: 1
      .searchKeyword
        font-size: 16px
        color: #323232
        width: 100%
        height: 48px
        line-height: 22px
        padding: 13px 0
        border: none
        outline: none



  .resultDiv
    background-color: #ffffff
    overflow: auto
    z-index: 200
    position: absolute
    left: 12px
    right: 12px
    top: 75px
    bottom: 0
    transition: all 0.25s
    .resultDivTitle
      line-height: 50px
      font-size: 14px
      color: #909090
      text-align: left
      margin-left: 10px
    .resultDivNoMore
      border-top: 1px solid #f5f5f5
      line-height: 50px
      font-size: 14px
      color: #909090
      text-align: center
  .resultDivHide
    transform: translateY(-2000px);

  .bottomResultDiv
    position: absolute
    left: 0
    right: 0
    bottom: 0
    background-color: #ffffff
    z-index: 199
    display: flex
    align-items: center
    transition: all 0.25s
    .bottomResult
      flex: 1
      padding: 10px 15px
      text-align: left
      .resultName
        font-size: 20px
        color: #323232
        min-height: 30px
      .resultAddress
        font-size: 16px
        color: #646464
        min-height: 24px


    .resultFinish
      font-size: 19px
      color: #2E8AFE
      line-height: 25px
      padding: 0 15px
      border-left: 1px solid #cccccc

  .bottomResultDivHide
    transform: translateY(500px);


</style>
