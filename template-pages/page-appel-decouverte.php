<?php
/*
Template Name: Appel Découverte
*/

$context = Timber::context();

$context['post'] = new Timber\Post();

Timber::render( 'pages/appel-decouverte.twig', $context );