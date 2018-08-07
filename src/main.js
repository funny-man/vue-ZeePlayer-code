import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'common/sass/index.scss'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// import VConsole from 'vconsole'
/* eslint-disable no-unused-vars */
// let vConsole = new VConsole()

/* 阻止启动生产消息 */
Vue.config.productionTip = false
//  优化移动端点击300毫秒
fastclick.attach(document.body)
//  全局注册VueLazyLoad
Vue.use(VueLazyLoad, {
  loading: require('common/image/loadImg@2x.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
