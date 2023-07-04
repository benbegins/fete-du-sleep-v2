<?php
add_action('wp_ajax_get_contact_form', 'get_contact_form');
add_action('wp_ajax_nopriv_get_contact_form', 'get_contact_form');

function get_contact_form() {

    if(isset($_POST['piege']) && $_POST['piege'] !== '') {
        wp_send_json_error('bot');
        return;
    }

    if ( isset( $_POST['name'] ) && isset( $_POST['email'] ) && isset( $_POST['message'] ) ) {

        $name = sanitize_text_field( $_POST['name'] );
        $email = sanitize_email( $_POST['email'] );
        $message = sanitize_textarea_field( $_POST['message'] );

        $childname = isset( $_POST['childname'] ) ? sanitize_text_field( $_POST['childname'] ) : '';
        
        $age = isset( $_POST['age'] ) ? sanitize_text_field( $_POST['age'] ) : '';

        $consent = isset( $_POST['consent'] ) && $_POST['consent'] === 'on' ? 'Oui' : 'Non';

        // Send all variables as json to the front
        $data = array(
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'childname' => $childname,
            'age' => $age,
            'consent' => $consent
        );

        if ( $consent === 'Oui' ) {
            // Envoie l'e-mail de notification
            $to = 'contact@lafetedusleep.com';
            $subject = 'Nouveau message depuis le site';
            $body = "<strong>Nom :</strong> $name<br><strong>Prénom(s) de(s) enfant(s) :</strong> $childname<br><strong>Email :</strong> $email<br><strong>Age :</strong> $age<br><strong>Message :</strong> $message";
            $headers = array('Content-Type: text/html; charset=UTF-8');

            wp_mail( $to, $subject, $body, $headers );

            // Réponse de succès
            wp_send_json( 'Message envoyé !' );
        } else {
            // Réponse d'erreur si la case à cocher "consent" n'est pas cochée
            wp_send_json_error( 'Veuillez donner votre consentement en cochant la case appropriée.' );
        }
    }
    
}