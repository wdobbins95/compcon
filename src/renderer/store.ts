import Vue from 'vue'
import Vuex from 'vuex'
import datastore from './features/_shared/store/'
import management from './features/pilot_management/store/'

import gmToolkitModules from './features/gm_toolkit/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    datastore,
    management,
    ...gmToolkitModules,
  },
})
