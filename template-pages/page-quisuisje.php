<?php
/*
Template Name: Qui suis-je ?
*/

$context = Timber::context();

$context['post'] = new Timber\Post();
$context['thumbnail'] = get_the_post_thumbnail( 
    null, 'xxl', array( 
        'class' => 'parallax', 
        'data-speed'=>'10', 
        'sizes'=>'100vw' 
    )
);

Timber::render( 'pages/quisuisje.twig', $context );