<?php
/*
Template Name: Mes Consultations
*/

$context = Timber::context();

$context['post'] = new Timber\Post();
$context['consultations'] = Timber::get_terms(array(
    'taxonomy' => 'types-consultation',
    'orderby' => 'ID',
    'hide_empty' => false,
));

Timber::render( 'pages/mes-consultations.twig', $context );