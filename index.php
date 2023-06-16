<?php

$context = Timber::context();

$context['post'] = new Timber\Post();

$context['temoignages'] = Timber::get_posts( array(
    'post_type' => 'temoignages',
    'posts_per_page' => 4,
    'orderby' => 'rand',
) );

$context['consultations'] = Timber::get_terms(array(
    'taxonomy' => 'types-consultation',
    'orderby' => 'ID',
    'hide_empty' => false,
));


Timber::render( 'pages/index.twig', $context );