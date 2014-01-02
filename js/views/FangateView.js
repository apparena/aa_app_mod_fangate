define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'modules/fangate/js/models/FangateModel',
    'text!modules/fangate/templates/fangate.html'
], function ($, _, Backbone, Bootstrap, FangateModel, fangateTemplate) {

    'use strict';

    var namespace = 'fangate',
        View, Init, Remove, Instance;

    View = Backbone.View.extend({
        el: $('body'),

        events: {
            'click .openfangate': 'openFangate'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'openFangate', 'socialButton', 'saveAsFan', 'changeButtonStyling');

            // init fangate model to handle fan status
            this.model = FangateModel.init();
        },

        render: function () {
            /*
             * very dirty implementation, because it didn't not work.
             * maybe check:
             * http://dailyjs.com/2012/12/06/backbone-tutorial-2/
             * to use gplus with require/backbone...
             */
            /*var gpluscontent = (_.c('fangate_social_networks').indexOf('gplus') !== -1) ?
             '<div class="g-follow" data-annotation="bubble" data-height="20" data-href="//plus.google.com/' + _.c('share_googleplus_id') + '" data-rel="author"></div>'
             : '',
             gplusscript = (_.c('fangate_social_networks').indexOf('gplus') !== -1) ?
             '<script type="text/javascript">(function(){var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;po.src = "https://apis.google.com/js/plusone.js";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);})();</script>'
             : '',
             data = {gpluscontent: gpluscontent, gplusscript: gplusscript},
             compiledTemplate = _.template(fangateTemplate, data);*/

            var compiledTemplate = _.template(fangateTemplate, {});
            this.$el.append(compiledTemplate);
            //this.socialButton();

            return this;
        },

        openFangate: function () {
            var that = this,
                model = this.model,
                fangate = $('#fangateModal');

            // when we are on facebook, check the fb variable
            if (typeof _.aa.fb.is_fb_user_fan === 'boolean') {
                // reset fan status
                model.set({
                    'isFan':         false,
                    'isFacebookFan': false
                });
                // check facebook fan status
                if (_.aa.fb.is_fb_user_fan === true) {
                    // ok user is facebook fan, save this
                    model.set({
                        'isFan':         true,
                        'isFacebookFan': true
                    });
                }
                model.save();
            }

            // show fangate only if model is not defined or user is not fan
            if (typeof model === 'undefined' || model.get('isFan') === false) {
                // open modal without keyboard and backdrop click support
                fangate.modal({keyboard: false, backdrop: 'static'});
                // show social buttons
                this.socialButton();
                // change url to call fangate again if needed
                this.goTo('call/fangate', false);

                // log this action and count adminlog up
                this.log('group', {
                    app_fangate_open: {
                        auth_uid:      _.uid,
                        auth_uid_temp: _.uid_temp,
                        code:          3001,
                        data_obj:      {}
                    },
                    app_fangate_show: ''
                });

                fangate.on('hidden.bs.modal', function () {
                    fangate.remove();
                    that.goTo('', false);
                    //Remove();
                });

                if (fangate.length === 0) {
                    that.goTo('', false);
                }
            } else {
                fangate.remove();
                //Remove();
            }

            return this;
        },

        socialButton: function () {
            var google, twitter, facebook,
                that = this;

            // facebook like button
            if (_.c('fangate_social_networks').indexOf('fb') !== -1) {
                require([
                    'modules/facebook/js/views/FacebookView'
                ], function (Facebook) {
                    facebook = Facebook.init();

                    facebook.libInit();
                    facebook.like(function () {
                        that.saveAsFan({
                            target: {
                                className: 'fangate_btn_facebook'
                            }
                        });
                    });
                });
            }

            // google follow button
            if (_.c('fangate_social_networks').indexOf('gplus') !== -1) {
                require([
                    'modules/google/js/views/GoogleView'
                ], function (Google) {
                    google = Google.init();
                    google.libInit();
                });
            }

            // twitter follow button
            if (_.c('fangate_social_networks').indexOf('twitter') !== -1) {
                require([
                    'modules/twitter/js/views/TwitterView'
                ], function (Twitter) {
                    twitter = Twitter.init();

                    twitter.libInit();
                    twitter.follow(function (response) {
                            that.saveAsFan({
                                target: {
                                    className: 'fangate_btn_twitter'
                                }
                            });
                        }
                    );
                });
            }

            return this;
        },

        saveAsFan: function (element) {
            var data = {};

            switch (element.target.className) {
                case 'fangate_btn_facebook':
                    data = {
                        isFan:         true,
                        isFacebookFan: true
                    };
                    break;
                case 'fangate_btn_google':
                    data = {
                        isFan:       true,
                        isGoogleFan: true
                    };
                    break;
                case 'fangate_btn_twitter':
                    data = {
                        isFan:        true,
                        isTwitterFan: true
                    };
                    break;
            }

            this.model.set(data);
            this.model.save();

            this.changeButtonStyling();

            return this;
        },

        changeButtonStyling: function () {
            this.$el
                .find('#fangateModal .modal-footer a')
                .addClass('btn btn-primary')
                .html(_.c('close_fangate_highlighted'));

            return this;
        }
    });

    Remove = function () {
        _.singleton.view[namespace].unbind().remove();
        delete _.singleton.view[namespace];
    };

    Init = function (init) {

        if (_.isUndefined(_.singleton.view[namespace])) {
            _.singleton.view[namespace] = new View();
        } else {
            if (!_.isUndefined(init) && init === true) {
                Remove();
                _.singleton.view[namespace] = new View();
            }
        }

        return _.singleton.view[namespace];
    };

    Instance = function () {
        return _.singleton.view[namespace];
    };

    return {
        init:        Init,
        view:        View,
        remove:      Remove,
        namespace:   namespace,
        getInstance: Instance
    };
});