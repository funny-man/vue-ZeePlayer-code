import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_DNV !== 'production'

export default new Vuex.State({
  actions,
  getters,
  state,
  mutations
})