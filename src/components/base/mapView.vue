<template>
  <div class="mapDiv"></div>
</template>
<script>
  export default{
    data () {
      return {
        style: {
          width: '100%',
          height: '100%'
        },
        map: null
      }
    },
    props: {
      addressArray: {
        type: Array,
        default: []
      }
    },
    mounted () {
      // 初始化地图
      let map = new BMap.Map(this.$el);
      this.map = map;
      // 比例尺
//      map.addControl(new BMap.ScaleControl());
      let point = new BMap.Point(121.50, 31.235);
      map.centerAndZoom(point, 15);
      let marker = new BMap.Marker(point);
      map.addOverlay(marker);

      // 添加定位功能
      let icon = new BMap.Icon('#', new BMap.Size(0, 0));
      let locationCon = new BMap.GeolocationControl({
        showAddressBar: false,
        locationIcon: icon
      });
      map.addControl(locationCon);

      let _this = this;
      locationCon.addEventListener("locationSuccess", function(value) {
        _this.$mogo.loadingHide();
        // 清空地址数组
        _this.addressArray.splice(0, _this.addressArray.length);
        let point = new BMap.Point(value.point.lng, value.point.lat);
        // 反编码经纬度
        let myGeo = new BMap.Geocoder();
        myGeo.getLocation(point, function(result) {
          if (result && result.surroundingPois instanceof Array) {
            for (let i = 0; i < result.surroundingPois.length; i++) {
              _this.addressArray.push({
                shortAddress: result.surroundingPois[i].title,
                longAddress: result.surroundingPois[i].address,
                longitude: result.surroundingPois[i].point.lng,
                latitude: result.surroundingPois[i].point.lat
              });
            }
          }
        });

        // 处理地图位置和图标
        map.centerAndZoom(point, 15);
        marker.setPosition(point);
      });
      locationCon.addEventListener("locationError", function() {
        _this.$mogo.loadingHide();
        _this.$mogo.showMessage('定位失败');
      });

      _this.$emit('locate', () => {
        this.$mogo.showLoading('定位中...');
        locationCon.location();
      });
    }
  }
</script>
