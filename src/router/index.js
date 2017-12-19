import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import searchMap from '@/components/searchMap'
import chooseLocation from '@/components/chooseLocation'

Vue.use(Router)
export default new Router({
  routes: [
    { path: '/home', component: home },
    { path: '/searchMap', component: searchMap },
    { path: '/', component: chooseLocation },
  ]
})
