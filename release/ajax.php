<?php
include 'vendor/autoload.php';
$name = $_POST['name'];
$phone = $_POST['phone'];
$subject = $_POST['subject'];
$comment = $_POST['comment'];
$error = '';
$success = false;
if(trim($name) == ''){
    $error = 'name';
}
if(trim($phone) == ''){
    $error = 'phone';
}
if(trim($comment) == ''){
    $error = 'comment';
}
if($error == ''){
    $to = 'brand@2-br.ru';
    $message = wordwrap($comment, 70, "\r\n");

    // Create the Transport
    $transport = (new \Swift_SmtpTransport('smtp.mail.ru', 465, 'ssl'))
        ->setUsername($to)
        ->setPassword('21081986a');

//            // Create the Mailer using your created Transport
    $mailer = new \Swift_Mailer($transport);
//
//            // Create a message
    $message = (new \Swift_Message($subject))
        ->setFrom($to)
        ->setTo($to)
        ->setBody($message, 'text/html');

    if ($mailer->send($message)){
        $success = true;
    }
//            $success = mail($to, $subject, $message);
}
echo json_encode(['error' => $error, 'success' => $success], 64 | 256);

