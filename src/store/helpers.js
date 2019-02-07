import { mapState, mapActions } from 'vuex'

export const paymentsComputed = {
  ...mapState('payments', {
    payments: state => state.items
  })
}

export const paymentsMethods = mapActions('payments', ['fetchPayments', 'updatePayment'])
