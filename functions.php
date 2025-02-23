
<?php

require_once __DIR__ . '/vendor/autoload.php';

$timber = new Timber\Timber();

// Configure les fonctionnalités de bases
function fetedusleep_theme_setup(){

    // Prise en charge des images de mise en avant
    add_theme_support('post-thumbnails');

    // Ajouter automatiquement le titre du site dans l'entete
    add_theme_support('title-tag');

    // Support pour ordonner les pages par attributs
    add_post_type_support( 'post', 'page-attributes' );

}
add_action( 'after_setup_theme', 'fetedusleep_theme_setup' );

// Ajout des scripts
function fetedusleep_theme_register_assets(){

    // CSS
    wp_enqueue_style( 
        'style', 
        get_template_directory_uri() . '/dist/fete-du-sleep-v2.css',
        array(),
        '1.0'
    );

    // JS
    wp_enqueue_script( 
        'app', 
        get_template_directory_uri() . '/dist/fete-du-sleep-v2.umd.js', 
        array(),
        '1.0',
        true
    );

    // Simplybookme
    wp_enqueue_script( 
        'simplybookme', 
        'https://widget.simplybook.it/v2/widget/widget.js', 
        array(),
        '1.0',
        false
    );

}
add_action( 'wp_enqueue_scripts', 'fetedusleep_theme_register_assets');


// Custom image size
add_image_size( 'xl', 1440);
add_image_size( 'xxl', 2048);


// Create option page
if( function_exists('acf_add_options_page') ) {
	acf_add_options_page();
}

//Disable plugin auto-update email notification
add_filter('auto_plugin_update_send_email', '__return_false');

// Cleanup Wordpress
require get_template_directory() . '/inc/cleanup.php';

// Text domain folder
load_theme_textdomain( 'fetedusleep', get_template_directory() . '/languages' );

// Excerpt length
function mytheme_custom_excerpt_length( $length ) {
    return 30;
}
add_filter( 'excerpt_length', 'mytheme_custom_excerpt_length', 999 );


// Remove Articles & Commentaires from admin bar
function post_remove (){ 
//    remove_menu_page('edit.php');
   remove_menu_page( 'edit-comments.php' );
}
add_action('admin_menu', 'post_remove'); 

// Use options page for ACF
add_filter( 'timber_context', 'mytheme_timber_context'  );

function mytheme_timber_context( $context ) {
    $context['options'] = get_fields('option');
    return $context;
}


// Ajax display contact form
require get_template_directory() . '/inc/contact-form.php';