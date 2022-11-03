<?php

/**
 * Plugin Name: Am I up to date
 * Description: Envoie les versions de Wordpress ainsi que de PHP à une application tierse
 * Version: 1.0.0
 * Author: Acti
 */

define('AMIUPTODATE_SRC', WPMU_PLUGIN_DIR . '/am_i_up_to_date_wp/src');

add_action('init', 'initUpToDateProcess');

function initUpToDateProcess()
{
    require_once AMIUPTODATE_SRC . '/Controller/DataController.php';
    require_once AMIUPTODATE_SRC . '/Controller/OptionsController.php';
    require_once AMIUPTODATE_SRC . '/Controller/RouteController.php';

    new OptionsController();
    new RouteController();
}
