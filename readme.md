# App-Arena.com App Module: Fangate
* **Github:** https://github.com/apparena/aa_app_mod_fangate
* **Docs:** http://www.appalizr.com/index.php/fangate.html
* This is a module of the [aa_app_template](https://github.com/apparena/aa_app_template)

## Module job
Shows a modal or a single page to get new social media fans. You can show the fangate as window or as fullscreen and with some more options.

### Dependencies
* [logging module](https://github.com/apparena/aa_app_mod_loggin)
* [facebook module](https://github.com/apparena/aa_app_mod_facebook)
* [twitter module](https://github.com/apparena/aa_app_mod_twitter)
* [google module](https://github.com/apparena/aa_app_mod_google)

### Important functions
* **openFangate** - shows the fangate and calls additional function like socialButton and saveAsFan.

### Example
```javascript
if (_.fangate === null && (_.c('mod_fangate_activated').toString() === '1' || _.c('mod_fangate_activated') === 'y')) {
    require(['modules/aa_app_mod_fangate/js/views/FangateView'], function (FangateView) {
        FangateView().init({init: true}).render().openFangate();
    });
}
```
First we check, if the fangate is activated not not opened before. After that, we load the sources over the require statement and initialize them.

### Load module with require
```
modules/aa_app_mod_fangate/js/views/FacebookView
```

#### App-Manager config values
| config | default | description |
|--------|--------|--------|
| fangate_social_networks | ["fb","twitter","gplus"] | multiselect box to activate social media chanels buttons |
| fangate_close_on_like | on | checkbox to define if fangate is closable over a button |