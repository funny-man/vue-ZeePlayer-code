import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

// Vuex 自带一个日志插件用于一般的调试;建议线下调试使用
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
// 判断是线上还是线下调试
// npm run dev时候process.env.NODE_DNV为dev；当npm run build的时候process.env.NODE_DNV为production
// 及线下调试开启严格模式；线上则不开启；详见vuex官方文档
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})