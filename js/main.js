/*global define: false */
define([
    'jquery',
    'underscore',
    'modules/aa_app_mod_fangate/js/views/FangateView'
], function ($, _, FangateView) {
    'use strict';

    return function () {
        FangateView().init().render().openFangate();
    };
});