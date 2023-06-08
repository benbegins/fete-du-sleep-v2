<?php

$context = Timber::context();

$context['type_consultation'] = new Timber\Term();
$context['image'] = get_field('image', $context['type_consultation']);

$args = array(
    'post_type' => 'consultations',
    'tax_query' => array(
        array(
            'taxonomy' => 'types-consultation',
            'field' => 'slug',
            'terms' => $context['type_consultation']->slug,
        ),
    ),
    'orderby' => 'ID',
    'order' => 'ASC',
);

$context['consultations'] = new Timber\PostQuery($args);

Timber::render( 'pages/types-consultation.twig', $context );