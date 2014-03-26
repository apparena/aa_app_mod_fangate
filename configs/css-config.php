<?php
/**
 * add css lib paths here to compile it later with a less compiler in init.php
 * path starts from root
 */
$css_import = array(
    '/modules/aa_app_mod_fangate/css/fangate.less' => 'file',
);

// some stuff that replaces after compiling key = search, value = replace
$css_path_replacements = array(
    '@fangate_btn_pos_facebook_top'  => __c('fangate_btn_pos_facebook_top') . '%',
    '@fangate_btn_pos_facebook_left' => __c('fangate_btn_pos_facebook_left') . '%',
    '@fangate_btn_pos_twitter_top'   => __c('fangate_btn_pos_twitter_top') . '%',
    '@fangate_btn_pos_twitter_left'  => __c('fangate_btn_pos_twitter_left') . '%',
    '@fangate_btn_pos_google_top'    => __c('fangate_btn_pos_google_top') . '%',
    '@fangate_btn_pos_google_left'   => __c('fangate_btn_pos_google_left') . '%',
    '@fangate_btn_pos_close_top'     => __c('fangate_btn_pos_close_top') . '%',
    '@fangate_btn_pos_close_left'    => __c('fangate_btn_pos_close_left') . '%',
);

return array('import' => $css_import, 'replace' => $css_path_replacements);