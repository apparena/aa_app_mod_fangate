define([
    'ModelExtend',
    'underscore',
    'backbone',
    'localstorage'
], function (Model, _, Backbone) {
    'use strict';

    return function () {
        Model.namespace = 'fangate';

        Model.code = Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage('AppArenaFangate_' + _.aa.instance.i_id),

            defaults: {
                isFan:         false,
                isFacebookFan: false,
                isTwitterFan:  false,
                isGoogleFan:   false
            },

            initialize: function () {
                this.fetch();
            }
        });

        return Model;
    };
});