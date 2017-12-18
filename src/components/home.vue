<template>
  <div class="home">
    <!-- 地图容器 -->
    <div id="container" class="map" tabindex="0"></div>
    <!-- 搜索框-->
    <div id="searchBox">
      <input id="tipinput" v-model="tipinput" type="input" placeholder="请输入关键字搜索" />
      <div id="clearSearchBtn" @click="clearSearch">
        <div class="del">&#10005;</div>
      </div>
    </div>
    <!-- 结果面板 -->
    <div id="panel" :class="{'hidden': panelHide, 'empty': panelEmpty}">
      <!-- 隐藏按钮 -->
      <a id="showHideBtn" @click="showHideBtnClick"></a>
      <!--搜索结果列表 -->
      <div id="poiList" ref="poiList">
      </div>
    </div>
    <!-- loading -->
    <div id="loader" v-show="isSearching"></div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  export default {
    data () {
      return {
        map: null,
        placeSearch: null,
        tipinput: '',
        panelHide: true,
        panelEmpty: false,
        isSearching: false
      }
    },
    mounted () {
      this.map = new AMap.Map('container', {
        zoom: 9,
        center: [116.868549, 34.918187]
      });

      AMap.plugin(["AMap.PlaceSearch", "AMap.Autocomplete"], () => {
        try {
          this.ready();
        } catch (e) {
          console.error(e);
        }
      });
    },
    methods: {
      ready () {
        // 搜索框支持自动完成提示
        var auto = new AMap.Autocomplete({
          city: "菏泽",
          input: "tipinput"
        });

        // 构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          pageSize: 5,
          pageIndex: 1,
          map: this.map,
          panel: "poiList"
        });

        // 监听搜索框的提示选中事件
        AMap.event.addListener(auto, "select", (e) => {
          console.log(e);
          // 设置搜索的城市
          this.placeSearch.setCity(e.poi.adcode);
          // 开始搜索对应的poi名称
          this.tipinput = e.poi.name;
          this.placeSearch.search(e.poi.name, (status, results) => {
            console.log(results);
            if (results.pois && results.pois.length > 0) {
              this.panelEmpty = !this.panelEmpty;
            }

            // 显示结果列表
            this.panelHide = false;

            // 隐藏loading状态
            this.isSearching = false;
          });

          // 显示loading状态
          this.isSearching = true;
        });

        this.checkPoiList();

        // 监听搜索列表的渲染完成事件
        AMap.event.addListener(this.placeSearch, 'renderComplete', () => {
          this.checkPoiList();
        });

        // 监听marker/列表的选中事件
        AMap.event.addListener(this.placeSearch, 'selectChanged', (results) => {
          // 获取当前选中的结果数据
          console.log(results.selected.data);
        });
      },
      // 检查结果列表是否为空， 为空时显示必要的提示，即#emptyTip
      checkPoiList() {
        this.panelEmpty = !(this.$refs.poiList.innerHTML.match(/[^\n\r\t\s]/));
      },
      clearSearch () {
        // 清除搜索框内容
        this.tipinput = '';

        // 清除结果列表
        this.placeSearch.clear();
        this.panelHide = true;
        this.checkPoiList();
      },
      showHideBtnClick () {
        this.panelHide = !this.panelHide;
      },
    }
  }
</script>

<style lang="stylus" scoped>
  @import "./index.css"
  .home
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
  #container
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

</style>
