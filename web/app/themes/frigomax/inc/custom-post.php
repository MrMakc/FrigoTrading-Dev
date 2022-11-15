<?php
add_action('init', function () {

  /* Register "NEWS" post type */
  register_extended_post_type('news', [
    'show_in_feed'       => true,
    'archive'            => [
      'nopaging' => true
    ],
    'admin_cols' => [
      'category' => [
        'taxonomy'		=> 'category-news',
        'title' => 'Categorie'
      ]
    ],
    'dashboard_activity' => true,
    'menu_icon'          => 'dashicons-awards',
    'supports'           => array('title', 'editor', 'thumbnail')
  ], [
    'singular' => 'Actualité',
    'plural'   => 'Actualités',
    'slug'     => 'actualite'
  ]);

    /* Register "NEWS" post type */
    register_extended_post_type('solutions', [
        'show_in_feed'       => true,
        'archive'            => [
            'nopaging' => true
        ],
        'admin_cols' => [
            'category' => [
                'taxonomy'		=> 'category-solutions',
                'title' => 'Categorie'
            ]
        ],
        'dashboard_activity' => true,
        'menu_icon'          => 'dashicons-money-alt',
        'menu_position'      => -5,
        'supports'           => array('title', 'editor', 'thumbnail')
    ], [
        'singular' => 'Solution',
        'plural'   => 'Solutions',
        'slug'     => 'solution'
    ]);


    register_extended_taxonomy('category-news', 'news', [
    'meta_box'   => 'radio',
    'admin_cols' => [
      'updated' => [
        'title_cb'    => function () {
          return '<em>Last</em> Updated';
        },
        'meta_key'    => 'updated_date',
        'date_format' => 'd/m/Y'
      ]
    ]
  ], [
    'singular' => __('Catégorie actualité', 'frigotrad'),
    'plural'   => __('Catégories actualité', 'frigotrad')
  ]);

    register_extended_taxonomy('category-solutions', 'solutions', [
        'meta_box'   => 'radio',
        'admin_cols' => [
            'updated' => [
                'title_cb'    => function () {
                    return '<em>Last</em> Updated';
                },
                'meta_key'    => 'updated_date',
                'date_format' => 'd/m/Y'
            ]
        ]
    ], [
        'singular' => __('Catégorie solutions', 'frigotrad'),
        'plural'   => __('Catégories solutions', 'frigotrad')
    ]);

    register_extended_taxonomy('zone-solutions', 'solutions', [
      'meta_box'   => 'radio',
      'admin_cols' => [
        'updated' => [
          'title_cb'    => function () {
            return '<em>Last</em> Updated';
          },
          'meta_key'    => 'updated_date',
          'date_format' => 'd/m/Y'
        ]
      ]
    ], [
      'singular' => __('Zone', 'frigotrad'),
      'plural'   => __('Zones', 'frigotrad')
    ]);

});
