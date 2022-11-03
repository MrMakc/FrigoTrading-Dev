<?php

    final class DataController
    {
        public function getPhpVersion()
        {
            return phpversion();
        }

        public function getWordpressVersion()
        {
            return get_bloginfo('version');
        }

        public function getPluginsVersions()
        {
            if (!function_exists('get_plugins')) {
                require_once ABSPATH . 'wp-admin/includes/plugin.php';
            }
            $versions = array();
            $plugins = get_plugins();

            foreach ($plugins as $plugin) {
                $versions[$plugin['TextDomain']] = $plugin['Version'];
            }

            return $versions;
        }
    }