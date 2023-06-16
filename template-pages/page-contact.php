<?php
/*
Template Name: Contact
*/

$context = Timber::context();

$context['post'] = new Timber\Post();

Timber::render( 'pages/contact.twig', $context );