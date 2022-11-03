<?php

final class OptionsController
{
    public function __construct()
    {
        if (is_admin()) {
            add_action('admin_menu', array($this, 'addOptionsMenu'));
            add_action('admin_init', array($this, 'registerOptions'));
        }
    }

    public function addOptionsMenu()
    {
        $parentSlug = 'tools.php';
        $pageTitle = 'Paramètres Am I Up To Date';
        $menuTitle = 'Am I Up To Date';
        $capability = 'administrator';
        $menuSlug = 'acti-aiutd';
        $callback = array($this, 'displayOptions');
        add_submenu_page($parentSlug, $pageTitle, $menuTitle, $capability, $menuSlug, $callback);
    }

    public function registerOptions()
    {
        register_setting('acti-amiuptodate', 'aiutd_route_url');
        register_setting('acti-amiuptodate', 'aiutd_api_key');
    }

    public function displayOptions()
    {
        $optionsTemplatePath = AMIUPTODATE_SRC. '/Templates/Options.php';

        require_once $optionsTemplatePath;
    }
}
