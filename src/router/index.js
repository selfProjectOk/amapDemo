import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import searchMap from '@/components/searchMap'

Vue.use(Router)
export default new Router({
  routes: [
    { path: '/home', redirect: '/' },
    { path: '/', component: home },
    { path: '/searchMap', component: searchMap },
  ]
})
