<?php


/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/templates/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */
$context = Timber::context();
$timber_post     = new Timber\Post();

//Get the post
$context['post'] = $timber_post;

//Get terms of category-solutions taxonomy to display title and description of the different category
$context['terms'] = Timber::get_terms(array(
    'taxonomy' => 'category-solutions',
));

//Get the last 3 news post type
$newsArgs = array(
    'post_type' => 'news',
    'posts_per_page' => 3,
    'orderby' => array(
        'date' => 'DESC'
    )
);
$context['news'] = Timber::get_posts($newsArgs);


//echo '<pre>';
//var_dump($context['post']);
//echo '</pre>';

Timber::render( array( 'front-page.twig' ), $context );
