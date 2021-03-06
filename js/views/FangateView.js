define([
    'ViewExtend',
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'modules/aa_app_mod_fangate/js/models/FangateModel',
    'text!modules/aa_app_mod_fangate/templates/fangate.html'
], function (View, $, _, Backbone, Bootstrap, FangateModel, fangateTemplate) {
    'use strict';

    return function () {
        View.namespace = 'fangate';

        View.code = Backbone.View.extend({
            el: $('body'),

            events: {
                'click .openfangate': 'openFangate',
                'click .fangate_btn_facebook, .fangate_btn_google, .fangate_btn_twitter, .closemodel': 'saveAsFan' // sorry but the last one (closemodel) is very stupid and not my decision ...
            },

            initialize: function () {
                _.bindAll(this, 'render', 'openFangate', 'socialButton', 'saveAsFan');

                // init fangate model to handle fan status
                this.fangateModel = FangateModel().init();
            },

            render: function () {
                /*
                 * very dirty implementation, because it didn't work.
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
                return this;
            },

            openFangate: function () {
                var that = this,
                    model = this.fangateModel,
                    fangate = $('#fangateModal, .modal-backdrop');

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
                    _.fangate = 1;
                    // show social buttons
                    this.socialButton();
                    // change url to call fangate again if needed
                    //this.goTo('call/fangate', false);

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
                        var modal_background = $('.modal-backdrop');
                        fangate.remove();
                        if(modal_background.length > 1) {
                            modal_background.remove();
                        }
                        //that.goTo('', false);
                        //_.router.goToPreviewsPage(false);
                        //_.fangate = 1;
                        //Remove();

                        require(['modules/aa_app_mod_facebook/js/views/FacebookView'], function (Facebook) {
                            Facebook().init({init: true}).libInit();
                        });
                    });

                    if (fangate.length === 0) {
                        //that.goTo('', false);
                        //_.router.goToPreviewsPage(false);
                    }
                } else {
                    fangate.remove();
                    //Remove();
                }

                return this;
            },

            socialButton: function () {
                var google, twitter, facebook,
                    that = this,
                    social_networks = _.c('fangate_social_networks');

                // facebook like button
                if (social_networks.indexOf('fb') !== -1) {
                    require([
                        'modules/aa_app_mod_facebook/js/views/FacebookView'
                    ], function (Facebook) {
                        facebook = Facebook().init({init: true});

                        facebook.libInit();
                        facebook.like(function () {
                            that.saveAsFan({
                                target: {
                                    className: 'fangate_btn_facebook'
                                }
                            });

                            // close fangate if user liked the page, but only if activated or only FB button is shown
                            if ((social_networks.indexOf('gplus') === -1 && social_networks.indexOf('twitter') === -1) || _.c('fangate_close_on_like').toString() !== '0') {
                                $('#fangateModal').modal('hide');
                            }
                        });
                    });
                }

                // google follow button
                if (social_networks.indexOf('gplus') !== -1) {
                    require([
                        'modules/aa_app_mod_google/js/views/GoogleView'
                    ], function (Google) {
                        google = Google().init({init: true});
                        google.libInit();
                    });
                }

                // twitter follow button
                if (social_networks.indexOf('twitter') !== -1) {
                    require([
                        'modules/aa_app_mod_twitter/js/views/TwitterView'
                    ], function (Twitter) {
                        twitter = Twitter().init({init: true});

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
                if ( element.target.className.length !== 0 ) {
                    var target = element.target.className;
                } else {
                    target = element.currentTarget.className;
                }
                switch (target) {
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
                    case 'closemodel':
                        data = {
                            isFan: true
                        };
                        break;
                }

                this.fangateModel.set(data);
                this.fangateModel.save();
                $('#fangateModal').modal('hide');
                return this;
            }

        });

        return View;
    };
});