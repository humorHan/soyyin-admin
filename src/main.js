// main.js
import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

import { getQiniuUrl, dateFormat, datePickerFilter, realPrice, orderStatusFilter, priceFilter, invoiceStatusFilter, produceStatusFilter, refundTypeFilter, refundStatusFilter, refundWayFilter } from './filters'
import { route } from './router.js'

import App from './components/app.vue'
import Main from './components/main.vue'

if (!PRODUCTION_ENV) {
	Vue.config.debug = true;
	Vue.config.devtools = true;
} else {
	Vue.config.debug = false;
	Vue.config.devtools = false;
}
Vue.use(Router);
Vue.use(Resource);

Vue.filter('orderStatusFilter', orderStatusFilter);
Vue.filter('priceFilter', priceFilter);
Vue.filter('realPrice', realPrice);
Vue.filter('getQiniuUrl', getQiniuUrl);
Vue.filter('dateFormat', dateFormat);
Vue.filter('datePickerFilter', datePickerFilter);
Vue.filter('invoiceStatusFilter', invoiceStatusFilter);
Vue.filter('produceStatusFilter', produceStatusFilter);
Vue.filter('refundTypeFilter', refundTypeFilter);
Vue.filter('refundStatusFilter', refundStatusFilter);
Vue.filter('refundWayFilter', refundWayFilter);

var router = new Router();

route(router);

router.start(App,'#app');