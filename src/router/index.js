import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import searchMap from '@/components/searchMap'
import chooseLocation from '@/components/chooseLocation'
import findLandlord from '@/components/findLandlord'
import learnJs from '@/components/learnJs'

Vue.use(Router)
export default new Router({
  routes: [
    { path: '/', component: home },
    { path: '/chooseLocation', name: 'chooseLocation', component: chooseLocation },
    { path: '/searchMap', name: 'searchMap', component: searchMap },
    { path: '/findLandlord', name: 'findLandlord', component: findLandlord },
    { path: '/12', name: 'learnJs', component: learnJs },
  ]
})
