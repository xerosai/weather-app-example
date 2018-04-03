/**
 * Created by Simon Neufville <simon@xrscodeworks.com> on April 02 2018 @ 14:26
 * Date Filter methods based on momentJS
 */

import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatToISODate', (value) => {
    if (!value) return 'Specify a date to be converted';

    // Date format is optional here, however, if moment.js can't convert the date, it will issue a console warning.
    if (!moment(value).isValid()) return 'Invalid Date. Please use an ISO Date';

    // The output format can be anything you'd like
    return moment(value).format('dddd, MMMM Do YYYY @ HH:mm a');
});
