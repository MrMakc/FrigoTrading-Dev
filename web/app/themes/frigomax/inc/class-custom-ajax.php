<?php

/**
 * Ajax functions
 */
class CustomAjax extends Timber\Site
{
  /** Add timber support. */
    public function __construct()
    {

//        add_action('wp_ajax_theme_name_loadmore_news', array($this, 'theme_name_loadmore_news'));
//        add_action('wp_ajax_nopriv_theme_name_loadmore_news', array($this, 'theme_name_loadmore_news'));

//        add_action('rest_api_init', function () {
//            register_rest_route('frigomax', 'offerCity', [
//            'methods' => 'GET',
//            'callback' => array($this, 'theme_name_offerCity')
//            ]);
//        });

        parent::__construct();
    }

}

new CustomAjax();
