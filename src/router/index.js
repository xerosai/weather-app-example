/**
 * Created by Simon Neufville <simon@xrscodeworks.com> on March 30 2018 @ 00:56
 * Main Application Router
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import WeatherMainComponent from '../components/WeatherMain';
import WeatherGamecomponent from '../components/WeatherGame';

const routes = [
    {
        component: WeatherMainComponent, name: 'WeatherMain', path: '/'
    },
    {
        component: WeatherGamecomponent, name: 'WeatherGame', path: '/game'
    }
];

export const router = new VueRouter({
    routes
});
