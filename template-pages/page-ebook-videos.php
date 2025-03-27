<?php
/*
Template Name: Ebooks & vidéos
*/

$context = Timber::context();

$context['post'] = new Timber\Post();

Timber::render( 'pages/ebooks-videos.twig', $context );