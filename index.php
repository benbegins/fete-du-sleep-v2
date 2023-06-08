<?php

$context = Timber::context();

$context['post'] = new Timber\Post();

$context['temoignages'] = Timber::get_posts( array(
    'post_type' => 'temoignages',
    'posts_per_page' => 4,
    'orderby' => 'rand',
) );


Timber::render( 'pages/index.twig', $context );