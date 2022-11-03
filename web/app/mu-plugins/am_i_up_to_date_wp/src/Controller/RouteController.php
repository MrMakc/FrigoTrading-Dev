<?php

    final class RouteController
    {
        private $_routeUrl;

        private $_apiKey;

        private $_headerApiKey;

        public function __construct()
        {
            $this->_routeUrl = get_option('aiutd_route_url');
            $this->_apiKey = get_option('aiutd_api_key');
            $this->_headerApiKey = 'Apikey';

            add_action('parse_request', array($this, 'sendData'), 1);
        }

        public function sendData()
        {
            global $wp;

            if ($this->_routeUrl && $this->_apiKey && $wp->request == $this->_routeUrl) {
                nocache_headers();
                header('Content-Type: application/json');

                $requestMethod = $_SERVER['REQUEST_METHOD'];
                $headers = $this->_getHeaders();
                if (isset($headers[$this->_headerApiKey]) && $requestMethod == 'GET') {
                    if ($headers[$this->_headerApiKey] == $this->_apiKey) {
                        status_header(200);
                        $data = $this->_buildData();
                        $result = json_encode($data);
                    } else {
                        status_header(401);
                        $result = json_encode([
                            'message' => 'Token invalide'
                        ]);
                    }
                } else {
                    status_header(404);
                    $result = json_encode([
                        'message' => '404 route non trouvée',
                    ]);
                }
                echo $result;
                exit;
            }
        }

        private function _buildData()
        {
            $data = array();
            $dataController = new DataController();
            $phpVersion = explode('-', phpversion());
            if (is_array($phpVersion)) {
                $phpVersion = $phpVersion[0];
            }
            $data['php'] = $phpVersion;
            $data['cms'] = 'wordpress-' . $dataController->getWordpressVersion();
            $data['plugins'] = $dataController->getPluginsVersions();

            return $data;
        }

        private function _getHeaders()
        {
            $headers = [];
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
            return $headers;
        }
    }