
<?php

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
        get_template_directory_uri() . '/dist/main.css',
        array(),
        '1.0'
    );

    // JS
    wp_enqueue_script( 
        'app', 
        get_template_directory_uri() . '/dist/main.js', 
        array(),
        '1.0',
        true
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
add_action('wp_ajax_get_contact_form', 'get_contact_form');
add_action('wp_ajax_nopriv_get_contact_form', 'get_contact_form');

function get_contact_form() {

    if(isset($_POST['piege']) && $_POST['piege'] !== '') {
        wp_send_json_error('bot');
        return;
    }

    if ( isset( $_POST['name'] ) && isset( $_POST['email'] ) && isset( $_POST['message'] ) ) {

        $name = sanitize_text_field( $_POST['name'] );
        $email = sanitize_email( $_POST['email'] );
        $message = sanitize_textarea_field( $_POST['message'] );

        $childname = isset( $_POST['childname'] ) ? sanitize_text_field( $_POST['childname'] ) : '';
        
        $age = isset( $_POST['age'] ) ? sanitize_text_field( $_POST['age'] ) : '';

        $consent = isset( $_POST['consent'] ) && $_POST['consent'] === 'on' ? 'Oui' : 'Non';

        // Send all variables as json to the front
        $data = array(
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'childname' => $childname,
            'age' => $age,
            'consent' => $consent
        );

        if ( $consent === 'Oui' ) {
            // Envoie l'e-mail de notification
            $to = 'benoit.beghyn@gmail.com';
            $subject = 'Nouveau message depuis le site';
            $body = "Nom : $name\n\nPrénom(s) de(s) enfant(s) : $childname\n\nEmail : $email\n\nAge : $age\n\nMessage : $message";
            $headers = array('Content-Type: text/html; charset=UTF-8');

            wp_mail( $to, $subject, $body, $headers );

            // Réponse de succès
            wp_send_json( 'Message envoyé !' );
        } else {
            // Réponse d'erreur si la case à cocher "consent" n'est pas cochée
            wp_send_json_error( 'Veuillez donner votre consentement en cochant la case appropriée.' );
        }
    }
    
}

add_action( 'phpmailer_init', 'fix_my_email_return_path' );