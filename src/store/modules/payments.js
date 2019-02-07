import Vue from 'vue'
import { db } from '../../firebase'

// initial state
const state = {
  items: []
}

// getters
const getters = {}

// actions
const actions = {
  // Fetch all payments
  fetchPayments ({ commit }) {
    db.collection('payments').get().then((querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => Object.assign({ uuid: doc.id }, doc.data()))
      commit('setPayments', docs)
    })
  },
  // Updates a payment
  updatePayment ({ commit }, payment) {
    db.collection('payments').doc(payment.uuid).update(payment).then(() => {
      commit('updatePayment', payment)
    })
  }
}

// mutations
const mutations = {
  setPayments (state, data) {
    state.items = data
  },
  updatePayment (state, data) {
    const index = state.items.findIndex(item => data.uuid === item.uuid)
    if (index !== -1) {
      Vue.set(state.items, index, data)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
