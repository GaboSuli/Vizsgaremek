<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $senderName;
    public string $senderEmail;
    public string $contactType;
    public string $messageText;

    /**
     * Create a new message instance.
     */
    public function __construct(string $senderName, string $senderEmail, string $contactType, string $messageText)
    {
        $this->senderName = $senderName;
        $this->senderEmail = $senderEmail;
        $this->contactType = $contactType;
        $this->messageText = $messageText;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Új kapcsolati üzenet: ' . $this->contactType,
            replyTo: [$this->senderEmail],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
