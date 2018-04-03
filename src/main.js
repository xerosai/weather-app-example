import Vue from 'vue'
import App from './App.vue'

import VueGeolocation from 'vue-browser-geolocation';
import VueNotifications from 'vue-notification';
import VueModal from 'vue-js-modal';

import {router} from './router';
import {store} from './store';

import './filters/dateFilters';

Vue.use(VueGeolocation);
Vue.use(VueNotifications);
Vue.use(VueModal, {dialog: true, dynamic: true});

new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router
});
