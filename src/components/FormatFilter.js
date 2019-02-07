import moment from 'moment'

const formatDateTime = function (value) {
  return moment(value || '').format('MM/DD/YYYY H:mm:ss')
}

const formatCurrency = function (value) {
  return `US$ ${(value || '').toLocaleString('en-us')}`
}

export default function (value, type) {
  switch (type) {
    case 'date':
      return formatDateTime(value)
    case 'currency':
      return formatCurrency(value)
    default:
      return value
  }
}
