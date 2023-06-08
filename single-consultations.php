<?php

$context = Timber::get_context();

$context['post'] = new Timber\Post();

// Term : Types de consultations
$types_consultation = get_the_terms( $post->ID, 'types-consultation' );
if($types_consultation){
    $context['types_consultation'] = $types_consultation[0];
}

// Term : Etapes de la consultation
$etapes = get_the_terms( $post->ID, 'etapes_consult' );
if($etapes){
    $context['etapes_consultations'] = $etapes[0];
    $liste_etapes = get_field('etapes', $etapes[0]);
    $context['liste_etapes'] = $liste_etapes;
}

$context['temoignages'] = Timber::get_posts( array(
    'post_type' => 'temoignages',
    'posts_per_page' => 4,
    'orderby' => 'rand',
) );

Timber::render( 'pages/single-consultations.twig', $context );

