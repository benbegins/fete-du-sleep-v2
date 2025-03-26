<?php

$timber = new Timber\Timber();

function bemy_timber_context( $context ) {
    $context['options'] = get_fields('option');

    // Get post type 'consultation'
    $context['services'] = Timber::get_posts(array(
        'post_type' => 'consultations',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'ASC'
    ));

    return $context;
}
add_filter( 'timber_context', 'bemy_timber_context'  );