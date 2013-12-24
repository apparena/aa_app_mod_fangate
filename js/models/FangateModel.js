define([
    'underscore',
    'backbone',
    'localstorage'
], function (_, Backbone) {
    'use strict';

    var namespace = 'fangate',
        Model, Init, Remove, Instance;

    Model = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage('AppArenaAdventskalenderApp_' + _.aa.instance.aa_inst_id + '_Fan'),

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

    Remove = function () {
        _.singleton.model[namespace].unbind().remove();
        delete _.singleton.model[namespace];
    };

    Init = function (init) {

        if (_.isUndefined(_.singleton.model[namespace])) {
            _.singleton.model[namespace] = new Model();
        } else {
            if (!_.isUndefined(init) && init === true) {
                Remove();
                _.singleton.model[namespace] = new Model();
            }
        }

        return _.singleton.model[namespace];
    };

    Instance = function () {
        return _.singleton.model[namespace];
    };

    return {
        init:        Init,
        view:        Model,
        remove:      Remove,
        namespace:   namespace,
        getInstance: Instance
    };
});