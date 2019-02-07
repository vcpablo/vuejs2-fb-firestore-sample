import Vue from 'vue';
import moment from 'moment';

Vue.filter('datetime', value => {
  return moment(value).format('MM/DD/YYYY H:mm:ss');
});

Vue.filter('date', value => {
  return moment(value).format('MM/DD/YYYY H:mm:ss');
});

Vue.filter('time', value => {
  return moment(value).format('H:mm:ss');
});