<template>
  <div class="searchMap">
    <div class="mapNavBar" v-show="pageType === 'show'">
      <img class="backBtn" src="../static/img/icon-back.png"/>
      <div style="height: 16px; width: 1px; background-color: #cccccc;"></div>
      <p class="showKeyword" v-show="showSearchKeyword !== ''" v-text="showSearchKeyword" @click="goSearch"></p>
      <p class="showKeyword" v-show="showSearchKeyword === ''" v-text="'输入详细地址'" style="color: #bbbbbb" @click="goSearch"></p>
    </div>
    <div class="mapSearchNavBar" v-show="pageType === 'search'">
      <img class="searchIcon" src="../static/img/icon-search.png"/>
      <form @submit="keywordSubmit" class="searchKeywordDiv" action="javascript:void(0)">
        <input type="text"
               class="searchKeyword"
               ref="searchKeyword"
               maxlength="12"
               @input="keywordInput"
               @blur="isAutoResultDivHide = true"
               @focus="isAutoResultDivHide = false; isResultDivHide = true;"
               v-model="searchKeyword"/>
      </form>
      <img class="clearSearch" @click="clearSearch" src="../static/img/image_delete.png"/>
      <span class="cancelSearch" @click="cancelSearch">取消</span>
    </div>
    <div class="autoResultDiv" :class="{'hide': isAutoResultDivHide}">
      <div class="autoResultDivTitle">
        <p>建议</p>
      </div>
      <mg-auto-search-result-cell v-for="item, index in autoSearchResult"
                                  :key="index"
                                  :item="item"
                                  @click="autoResultClick"
      ></mg-auto-search-result-cell>
    </div>
    <mg-scroll-div class="resultDiv"
                   :class="{'resultDivHide': isResultDivHide}"
                   @willScrollToBottom="loadMoreResult">
      <mg-search-result-cell  v-for="item, index in searchResult"
                              :key="index"
                              :item="item"
                              @click="resultClick"
      ></mg-search-result-cell>
    </mg-scroll-div>
    <div id="searchMapDiv">
    </div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import autoSearchResultCell from './autoSearchResultCell.vue'
  import searchResultCell from './searchResultCell.vue'
  import scrollDiv from './scrollDiv.vue'
  export default {
    components: {
      'mg-auto-search-result-cell': autoSearchResultCell,
      'mg-search-result-cell': searchResultCell,
      'mg-scroll-div': scrollDiv,
    },
    data () {
      return {
        pageType: 'show',
        map: null,
        autocomplete: null,
        placeSearch: null,
        marker: null,
        infoWindow: null,
        clickListener: null,
        geocoder: null,
        geolocation: null,

        isAutoResultDivHide: true,
        isResultDivHide: true,

        showSearchKeyword: '',
        searchKeyword: '',

        autoSearchResult: [],
        searchResult: [],
        city: '上海',

        searchItem: null,
        currentPage: 1,
        hasNext: true
      }
    },
    mounted () {
      this.map = new AMap.Map('searchMapDiv', {
        zoom: 13,
        center: [121.48, 31.22]
      });

      AMap.plugin(['AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.Geocoder', 'AMap.Geolocation'], () => {
        try {
          this.initMap();
        } catch (e) {
          console.error(e);
        }
      });
    },
    methods: {
      // 自定义导航栏元素事件
      goSearch () {
        this.pageType = 'search';
        this.searchKeyword = this.showSearchKeyword;
        this.$nextTick(() => {
          this.$refs.searchKeyword.focus();
        })
      },
      cancelSearch () {
        this.pageType = 'show';
      },
      clearSearch () {
        this.searchKeyword = '';
        this.keywordInput();
        this.$nextTick(() => {
          this.$refs.searchKeyword.focus();
        })
      },
      keywordInput () {
        if (this.autocomplete) {
          this.autocomplete.search(this.searchKeyword, (status, result) => {
            console.log(result);
            if (status === 'complete') {
              this.autoSearchResult = result.tips;
            } else {
              this.autoSearchResult = [];
            }
          });
        }
      },
      keywordSubmit () {
        this.$refs.searchKeyword.blur();
        this.pageType = 'show';
        this.showSearchKeyword = this.searchKeyword;

        if (this.placeSearch) {
          this.searchResult = [];
          this.searchItem = null;
          this.currentPage = 1;
          this.hasNext = true;
          this.loadSearchResult();
        }
      },

      // 联想搜索cell点击
      autoResultClick (item) {
        this.searchKeyword = item.name;
        this.keywordSubmit();
      },

      // aMap事件
      getFormattedAddressByResult (result) {
        let address = result.addressComponent.province + result.addressComponent.city + result.addressComponent.district;
        let detailAddress = '';
        if (result.addressComponent.street === '') {
          detailAddress = result.addressComponent.township;
        } else {
          detailAddress = result.addressComponent.street + result.addressComponent.streetNumber + result.addressComponent.building;
        }
        return {
          adcode: result.addressComponent.adcode,
          address: address,
          detailAddress: detailAddress,
        }
      },
      initMap () {
        this.autocomplete = new AMap.Autocomplete({
          city: this.city
        });
        // 构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: this.city,
        });
        this.infoWindow = new AMap.InfoWindow({
          isCustom: true,
          offset: new AMap.Pixel(0, -40)
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
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        this.map.addControl(this.geolocation);
        this.geolocation.getCurrentPosition();
        AMap.event.addListener(this.geolocation, 'complete', (result) => {
          let addressMap = this.getFormattedAddressByResult(result);
          this.createMarker(result.position, addressMap.address + addressMap.detailAddress);
        }); // 返回定位信息
        AMap.event.addListener(this.geolocation, 'error', (err) => {
          console.log('定位失败');
          console.log(err);
        });      // 返回定位出错信息
      },
      mapClick (e) {
        this.$refs.searchKeyword.blur();
        this.isResultDivHide = true;
        this.getAddressWithGeocoder(e.lnglat);
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
          }
        });
      },
      resultClick (item) {
//        this.getAddressWithGeocoder([item.location.lng, item.location.lat]);
        this.createMarker([item.location.lng, item.location.lat], item.address + item.name);
      },
      markerClick (e) {
        if (this.infoWindow && e.target.content && e.target.content !== '') {
          this.infoWindow.setContent(this.createInfoWindow(e.target.content));
          this.infoWindow.open(this.map, e.target.getPosition());
        }
        console.log(e.target.getPosition().lng);
        console.log(e.target.getPosition().lat);
        console.log(e.target.content);
      },
      getAddressWithGeocoder (position) {
        this.geocoder.getAddress(position, (status, result) => {
          let title = '';
          if (status === 'complete' && result.info === 'OK') {
            let addressMap = this.getFormattedAddressByResult(result.regeocode);
            title = addressMap.address + addressMap.detailAddress;
          } else {
            title = '未知地址';
          }
          this.createMarker(position, title);
        });
      },
      createMarker (position, title) {
        if (this.marker) {
          this.marker.setMap(null);
        }
        let marker = new AMap.Marker({
          position: position,
          title: title,
          map: this.map
        });

        marker.content = title;
        marker.on('click', this.markerClick);
        this.marker = marker;

        this.map.setFitView();

        if (this.infoWindow && marker.content && marker.content !== '') {
          this.infoWindow.setContent(this.createInfoWindow(marker.content));
          this.infoWindow.open(this.map, marker.getPosition());
        }
      },
      createInfoWindow (content) {
        let info = document.createElement("div");
        info.style = "max-width: 150px; padding: 5px; display: flex; background-color: #ffffff; border: 1px solid #E4E4E4";

        // 定义顶部标题
        let top = document.createElement("div");
        let closeX = document.createElement("span");
        let arror = document.createElement("span");
        top.style = "flex: 1; text-align: left;";
        top.innerHTML = content;

        closeX.innerHTML = "×";
        closeX.style = "font-size: 20px; align-self: flex-start; line-height: 18px"
        closeX.onclick = () => {
          this.map.clearInfoWindow();
        };

        arror.style = "position: absolute; display: inline-block; height: 8px; width: 8px; bottom: -4px; left: 50%; margin-left: -4px;" +
          "border-bottom: 1px solid #E4E4E4; border-right:  1px solid #E4E4E4; background-color: #fefefe; transform: rotate(45deg)"

        info.appendChild(top);
        info.appendChild(closeX);
        info.appendChild(arror);

        return info;
      }
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
    z-index: 200
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



  .autoResultDiv
    background-color: #ffffff
    max-height: 300px
    overflow: auto
    z-index: 200
    position: absolute
    left: 12px
    right: 12px
    top: 75px
    .autoResultDivTitle
      line-height: 50px
      font-size: 14px
      color: #909090
      text-align: left
      margin-left: 10px

  .resultDiv
    position: absolute
    left: 0
    right: 0
    max-height: 200px
    bottom: 0
    padding: 0 15px
    z-index: 10000
    background-color: #ffffff
    overflow: auto
    transition: all 0.15s
  .resultDivHide
    transform: translateY(220px)

  .hide
    display: none

</style>
