import { authControl } from '../auth'
import axios from '../ajax'

let globalOptions = {}
export const initPlugin = function(Vue, options) {
  Mogo.setGlobalOptions(options)
  Vue.mogo = Vue.prototype.$mogo = Mogo
  Vue.axios = Vue.prototype.$axios = axios
}

export let Mogo = {
  authControl: function (el, codes) {
    authControl(el, codes)
  },

  setGlobalOptions: function (options) {
    globalOptions = options || {}
  }
}

export default {initPlugin, Mogo, axios}
