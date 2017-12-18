import { initPlugin } from './global'

const MogoGlobal = {
  install: (Vue, options) => {
    initPlugin(Vue, options)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MogoGlobal)
}

export default MogoGlobal
