<template>
  <div>
    <h2>VueJS 2 + Firebase Firestore</h2>
    <data-table
      :data="payments"
      :columns="columns"
      :options="options"
      :loading="loading"
      @save="handleSave"
    />
  </div>
</template>

<script>
import DataTable from './DataTable'

import { paymentsComputed, paymentsMethods } from '../store/helpers'

export default {
  name: 'Home',
  components: {
    DataTable
  },
  data () {
    return {
      columns: [
        {
          name: 'ID',
          title: 'Id',
          type: 'string',
          key: true,
          sortable: true,
          editable: false,
          style: (column, value) => {
            return {}
          },
          filter: (column, value) => {
            return ''
          }
        },
        {
          name: 'Name',
          type: 'string',
          title: 'Name',
          sortable: true,
          editable: false,
          style: (column, value) => {
            return {}
          },
          filter: (column, value) => {
            return ''
          }
        },
        {
          name: 'Description',
          type: 'string',
          title: 'Description',
          sortable: true,
          editable: true,
          style: (column, value) => {
            return {}
          },
          filter: (column, value) => {
            return ''
          }
        },
        {
          name: 'Date',
          type: 'date',
          title: 'Date',
          sortable: true,
          editable: false,
          style: (column, value) => {
            return {}
          },
          filter: (column, value) => {
            return ''
          }
        },
        {
          name: 'Amount',
          type: 'currency',
          title: 'Amount',
          sortable: true,
          editable: false,
          style: (column, value) => {
            return {}
          },
          filter: (column, value) => {
            return ''
          }
        }
      ],
      options: {
        allowEdit: true,
        allowSearch: true
      },
      data: [],
      loading: true
    }
  },
  mounted () {
    this.fetchPayments().then(() => {
      this.loading = false
    })
  },
  computed: {
    ...paymentsComputed
  },
  methods: {
    ...paymentsMethods,
    handleSave (payment) {
      this.loading = true
      this.updatePayment(payment).then(() => {
        this.loading = false
        this.$forceUpdate()
      })
    }
  }
}
</script>
