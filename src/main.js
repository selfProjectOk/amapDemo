// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import MuseUI from 'muse-ui'
import MogoGlobal from './common/plugin/index'

require('es6-promise').polyfill()
// import 'muse-ui/dist/muse-ui.css'
// import 'muse-ui/dist/theme-light.css'  // 载入主题
// Vue.use(MuseUI)
Vue.use(MogoGlobal)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
