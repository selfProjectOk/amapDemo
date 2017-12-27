<template>
  <div class="findMap">
    <div class="mapFindNavBar">
      <img class="backBtn" @click="back" src="../static/img/icon-back.png"/>
      <div style="height: 12px; width: 1px; background-color: #d0d0d0;"></div>
      <mg-single-picker class="picker" :items="stageArray" type="top" @choose="chooseCity" :defaultId="stage"></mg-single-picker>
      <div style="height: 12px; width: 1px; background-color: #d0d0d0;"></div>
      <mg-single-picker class="picker" :items="stageArray" type="top" @choose="chooseStage" :defaultId="stage"></mg-single-picker>
      <div style="height: 12px; width: 1px; background-color: #d0d0d0;"></div>
      <mg-single-picker class="picker" :items="typeArray" type="top" @choose="chooseType" :defaultId="type"></mg-single-picker>
    </div>
    <div class="legend">
      <p class="legendItem"><span class="point" style="background-color: #2e8afe"></span><span>私客</span></p>
      <p class="legendItem"><span class="point" style="background-color: #e1222b"></span><span>公客</span></p>
    </div>
    <div class="bottomResultDiv"
         :class="{'bottomResultDivHide': isBottomResultDivHide}">
      <div class="landlordInfoDiv"  @click="">
        <div class="first">
          <p class="name" v-text="landlordMsg.name"></p>
          <p class="phone" v-text="landlordMsg.phone"></p>
        </div>
      </div>
      <div class="xLine"></div>
      <div class="landlordRecordDiv">
        <div class="first">
          <p class="recordTitle" v-text="landlordMsg.followUpItem"></p>
          <p class="recordDate" v-text="(landlordMsg.createTime) ? landlordMsg.createTime.slice(0, 10) : ''"></p>
        </div>
        <div class="second">
          <p class="recordContent" v-text="landlordMsg.content"></p>
        </div>
      </div>
    </div>
    <div id="findMapDiv">
    </div>
  </div>
</template>
<script>
  let typeArray = [
    {name: '全部', id: 1},
    {name: '公客', id: 2},
    {name: '私客', id: 3},
  ];
  let stageArray = [
    {name: '全部', id: 1},
    {name: '未签约', id: 2},
    {name: '已签约', id: 3},
  ]

  import AMap from 'AMap'
  import AMapUI from 'AMapUI'
  import singlePicker from './base/singlePicker.vue'
  export default {
    components: {
      'mg-single-picker': singlePicker,
    },
    data () {
      return {
        map: null,
        mapMoveListener: null,
        geocoder: null,
        geolocation: null,
        markers: [],
        areaMarkersLoaded: false,

        mapCenter: null,
        mapZoom: null,
        cityArray: [],
        typeArray: [],
        stageArray: [],
        type: 1,
        stage: 1,
        city: 289,
        cityName: '上海市',

        selectedMarker: null,
        selectedMarkerId: null,
        isBottomResultDivHide: true,
        landlordMsg: {},
      }
    },
    mounted () {
      let initDataStr = window.sessionStorage.getItem('findLandlordInitData');
      if (initDataStr) {
        let initData = JSON.parse(initDataStr);
        this.city = initData.city;
        this.cityName = initData.cityName;
        this.type = initData.type;
        this.stage = initData.stage;
        this.mapCenter = initData.mapCenter;
        this.mapZoom = initData.mapZoom;
        this.selectedMarkerId = initData.selectedMarkerId;
      } else {
        let cityMap = JSON.parse(window.localStorage.getItem('city'));
        this.city = 289;
        this.cityName = '上海市';
      }

      this.typeArray = typeArray;
      this.stageArray = stageArray;

      AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
        this.map = new AMap.Map('findMapDiv', {
          zoom: 17,
          zooms: [10, 18],
          center: [121.48, 31.22]
        });
        AMap.plugin(['AMap.Geolocation'], () => {
          try {
            this.initMap();
          } catch (e) {
            console.error(e);
          }
        });
        // 缩放控件
//        this.map.addControl(new BasicControl.Zoom({
//          position: 'lb', // left top，左上角
//          showZoomNum: true // 显示zoom值
//        }));
      });
    },
    methods: {
      back () {
        this.$router.go(-1);
      },
      goLandlordInfo () {
        let mapInitData = {
          mapCenter: this.map.getCenter(),
          mapZoom: this.map.getZoom(),
          city: this.city,
          cityName: this.cityName,
          type: this.type,
          stage: this.stage,
          selectedMarkerId: this.selectedMarkerId
        }
        window.sessionStorage.setItem('findLandlordInitData', JSON.stringify(mapInitData));

        this.$store.commit('LANDLORD_SHOW_MARK', {showMark: false});
        this.$store.commit('LANDLORD_MSG', {landlordMsg: this.landlordMsg});
        this.$router.push({name: 'landlordInfo'});
      },
      chooseCity (valueStr, valueArray) {
        this.city = valueArray[1];

        let strArr = valueStr.split('-');
        this.cityName = strArr[strArr.length - 1];
        this.areaMarkersLoaded = false;

        this.map.setCity(this.cityName);
      },
      chooseStage (value) {
        this.stage = value;
        this.areaMarkersLoaded = false;
        this.getData();
      },
      chooseType (value) {
        this.type = value;
        this.areaMarkersLoaded = false;
        this.getData();
      },
      initMap () {
        AMap.event.addListener(this.map, "click", this.mapClick);
        AMap.event.addListener(this.map, "moveend", this.mapMoveEnd);

        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
          convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        // 显示定位按钮，默认：true
          buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 160), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        this.map.addControl(this.geolocation);
        if (this.mapCenter) {
          this.map.setZoomAndCenter(this.mapZoom, this.mapCenter);
        } else {
          this.startLocate();
        }
        this.getData();
      },
      startLocate () {
        this.geolocation.getCurrentPosition();
        AMap.event.addListener(this.geolocation, 'complete', (result) => {
          this.map.setCenter(result.position);
          this.map.setZoom(17);
        }); // 返回定位信息
        AMap.event.addListener(this.geolocation, 'error', (err) => {
          this.$mogo.showMessage('定位失败');
          console.log(err)
        });
      },
      mapClick (e) {
        this.clearMsg();
      },
      clearMsg () {
        if (this.selectedMarker) {
          let className = this.selectedMarker.getContent().className;
          let r = className.match(/^(.*)(\sselected$)/)
          if (r) {
            this.selectedMarker.getContent().className = r[1];
          }
        }
        this.selectedMarker = null;
        this.landlordMsg = {};
        this.isBottomResultDivHide = true;
      },
      mapMoveEnd (e) {
        let zoom = this.map.getZoom();
        console.log(zoom);
        console.log(this.map.getBounds());
        this.getData();
      },
      getData () {
        let zoom = this.map.getZoom();
        if (zoom <= 13 && !this.areaMarkersLoaded) { // 区汇总
          this.loadAreaData();
        } else if (zoom > 13) { // 房东数据
          this.areaMarkersLoaded = false;
          this.loadLandlordData();
        }
      },
      loadAreaData () {
        let mapBounds = this.map.getBounds();
        let maxLat = mapBounds.northeast.lat;
        let maxLng = mapBounds.northeast.lng;
        let minLat = mapBounds.southwest.lat;
        let minLng = mapBounds.southwest.lng;

//        console.log(this.city);
//        console.log(this.type);
//        console.log(this.stage);

        setTimeout(() => {
          let markerArray = [
            {"id": 2, "name": "黄浦区", count: 666, "lng": "121.491585", "lat": "31.237247", "adCode": "310101"},
            {"id": 3, "name": "徐汇区", count: 666, "lng": "121.4434", "lat": "31.194557", "adCode": "310104"},
            {"id": 4, "name": "长宁区", count: 666, "lng": "121.43045", "lat": "31.226849", "adCode": "310105"},
            {"id": 5, "name": "静安区", count: 666, "lng": "121.45343", "lat": "31.233845", "adCode": "310106"},
            {"id": 6, "name": "普陀区", count: 666, "lng": "121.40357", "lat": "31.254972", "adCode": "310107"},
            {"id": 8, "name": "虹口区", count: 666, "lng": "121.51159", "lat": "31.269747", "adCode": "310109"},
            {"id": 9, "name": "杨浦区", count: 666, "lng": "121.53252", "lat": "31.265524", "adCode": "310110"}
          ];
          this.clearMsg();
          this.map.remove(this.markers);
          this.markers = [];

          for (let i = 0; i < markerArray.length; i++) {
            let data = markerArray[i];
            let marker = this.createAreaMarker(data);
            this.markers.push(marker);
          }
          this.areaMarkersLoaded = true;
        }, 500);
      },
      createAreaMarker (data) {
        var div = document.createElement('div');
        let className = 'map-marker-area';
        div.className = className;
        div.innerHTML = '<p>' + data.name + '</p><p>' + data.count + '人</p>'

        var marker = new AMap.Marker({
          content: div,
          title: data.name,
          position: [data.lng, data.lat],
          offset: new AMap.Pixel(-51, -32)
        });
        marker.data = data;
        marker.setMap(this.map);
        AMap.event.addListener(marker, 'click', this.areaMarkerClick);

        if (this.selectedMarkerId == data.id) {
          this.landlordMarkerClick({target: marker})
        }
        return marker;
      },
      areaMarkerClick (e) {
        let data = e.target.data;
        this.map.setZoomAndCenter(14, [data.lng, data.lat]);
      },
      loadLandlordData () {
        let mapBounds = this.map.getBounds();
        let maxLat = mapBounds.northeast.lat;
        let maxLng = mapBounds.northeast.lng;
        let minLat = mapBounds.southwest.lat;
        let minLng = mapBounds.southwest.lng;

//        console.log(this.city);
//        console.log(this.type);
//        console.log(this.stage);
//        console.log(minLat + '-' + maxLat);
//        console.log(minLng + '-' + maxLng);

        setTimeout(() => {
          let markerArray = [{id: 2001134, name: '66', lat: (maxLat - minLat) * 0.5 + minLat, lng: (maxLng - minLng) * 0.5 + minLng, type: 2}];

          for (let lat = Math.round(minLat * 200) / 200; lat < maxLat; lat += 0.005) {
            for (let lng = Math.round(minLng * 200) / 200; lng < maxLng; lng += 0.005) {
              let id = lat.toString() + lng;
              let name = '房东' + id;
              markerArray.push({id: id, name: name, lat: lat, lng: lng, type: ((lat + lng) % 0.002) * 1000 + 2})
            }
          }

          this.clearMsg();
          this.map.remove(this.markers);
          this.markers = [];

          for (let i = 0; i < markerArray.length; i++) {
            let data = markerArray[i];
            let marker = this.createLandlordMarker(data);
            this.markers.push(marker);
          }
        }, 500);
      },
      createLandlordMarker (data) {
        var div = document.createElement('div');
        let className = 'map-marker-landlord';
        className += (data.type === 2) ? ' red' : ' blue';
        div.className = className;
        div.innerHTML = '<span>' + data.name + '</span><span class="marker-arrow"></span>'

        var marker = new AMap.Marker({
          content: div,
          title: data.name,
          position: [data.lng, data.lat],
          offset: new AMap.Pixel(-51, -32)
        });
        marker.data = data;
        marker.setMap(this.map);
        AMap.event.addListener(marker, 'click', this.landlordMarkerClick);

        if (this.selectedMarkerId == data.id) {
          this.landlordMarkerClick({target: marker})
        }
        return marker;
      },
      landlordMarkerClick (e) {
        this.clearMsg();

        this.selectedMarker = e.target;
        this.selectedMarker.getContent().className += ' selected';
        let id = e.target.data.id;
        this.selectedMarkerId = id;

        let map = {
          communicator: "测试12220-房东本人",
          createTime: "2017-12-20 13:35:03",
          followUpItem: "面谈-沟通洽谈",
          type: "followUp",
          content: '号好好好好好好好号号号号号号号号号号好好好好好好好好好好',
          "id": 2001134,
          "landlordId": null,
          "cityId": null,
          "name": "画画",
          "phone": "18632569820",
          "roleName": null,
          "sex": null,
          "ageGroup": null,
          "province": null,
          "education": null,
          "maritalStatus": null,
          "avocation": null,
          "dataChannel": null,
          "bdchannel": null,
          "bdchannelremark": null,
          "status": 6,
          "servicePerson": 2002033,
          "serviceOrgId": null,
          "canBeAssigned": null,
          "allotCount": null,
          "createBy": null,
          "createByType": null,
          "updateBy": null,
          "updateTime": null,
          "updateByType": null,
          "valid": null,
          "serviceName": null,
          "expandMan": null,
          "pendingAudit": null,
          "createDate": null,
          "landlordNum": null,
          "statusDesc": "合规驳回",
          "expandManager": null,
          "followUpTime": null,
          "planendTime": null,
          "allDays": null,
          "protectDays": null,
          "orgString": null,
          "statusList": null,
          "bdLandlordId": null,
          "operatingPeriod": null,
          "officeAddress": null,
          "centralizeCount": null,
          "decentralizeCount": null,
          "allCount": null,
          "vacantCount": null,
          "minRent": null,
          "maxRent": null,
          "avgRent": null,
          "mansionName": null,
          "staffCount": null,
          "districtIdList": null,
          "districtNames": null,
          "cityName": null,
          "orgIdList": null,
          "citySelectTag": null,
          "pendingTime": null,
          "avgMogoScore": null,
          "statusLists": null,
          "bdchannelName": null,
          "orderByProcessTime": null,
          "tag": 1,
          "tagDesc": "重点",
          "remark": null,
          "questionArr": null,
          "excludedStatus": null,
          "permission": null,
          "cityList": null,
          "customfield": null,
          "inputCustomfield": null,
          "inputValue": null
        }

        this.landlordMsg = map;
        this.isBottomResultDivHide = false;
      }
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
    z-index: 0

  .mapFindNavBar
    position: absolute
    top: 20px
    left: 0
    right: 0
    height: 48px
    margin: 0 12px
    z-index: 1
    display: flex
    align-items: center
    background-color: #ffffff
    box-shadow: 0 2px 4px 0 #cccccc

    .backBtn
      height: 20px
      width: 20px
      margin: 0 10px
    .picker
      flex: 1
      display: flex
      justify-content: center

  .legend
    position: absolute
    top: 80px
    right: 12px
    height: 42px
    width: 66px
    z-index: 1
    background-color: #ffffff
    box-shadow: 0 2px 4px 0 #cccccc
    border-radius: 3px
    font-size: 11px
    color: #323232
    .legendItem
      height: 21px
      display: flex
      align-items: center
      justify-content: center
      .point
        display: inline-block
        height: 12px
        width: 12px
        border-radius: 6px
        overflow: hidden
        margin-right: 5px


  .bottomResultDiv
    position: absolute
    left: 0
    right: 0
    bottom: 0
    background-color: #ffffff
    z-index: 1
    transition: all 0.25s
    .landlordInfoDiv
      display: flex
      align-items: center
      padding: 10px 15px
      .first
        flex: 1
        text-align: left
        .name
          font-size: 17px
          color: #323232
        .phone
          font-size: 15px
          color: #646464
      img
        height: 13px
        width: 8px
    .landlordRecordDiv
      padding: 0 15px 10px 15px
      .first
        display: flex
        align-items: center
        justify-content: space-between
        padding: 5px 0
        .recordTitle
          font-size: 15px
          color: #323232
        .recordDate
          font-size: 14px
          color: #909090
      .second
        .recordContent
          font-size: 15px
          color: #b3b3b3
          word-break: break-all
          text-align: left

  .bottomResultDivHide
    transform: translateY(500px);

  .xLine
    border-bottom: 1px solid #e4e4e4
    margin-left: 15px
    height: 1px
    transform: scaleY(0.5)
    transform-origin: 0 0
    -webkit-transform: scaleY(0.5)
    -webkit-transform-origin: 0 0

</style>

