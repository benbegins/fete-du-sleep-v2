<?php

function bemy_set_menus() {
    register_nav_menus( array(
        'main-menu' => 'Menu principal',
    ) );
    // see https://developer.wordpress.org/reference/functions/register_nav_menus/
}

add_action( 'after_setup_theme', 'bemy_set_menus' );