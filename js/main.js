/*global define: false */
define([
    'jquery',
    'underscore',
    'modules/fangate/js/views/FangateView'
], function ($, _, FangateView) {
    'use strict';

    return function () {
        FangateView.init().render().openFangate();
    };
});