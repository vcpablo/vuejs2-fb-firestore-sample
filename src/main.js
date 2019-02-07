import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueFire from 'vuefire'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faCheck, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit)
library.add(faCheck)
library.add(faTimes)
library.add(faSearch)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueFire)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
