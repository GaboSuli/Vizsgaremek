<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Új kapcsolati üzenet</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 28px 32px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .body { padding: 28px 32px; }
        .field { margin-bottom: 18px; }
        .field-label { font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
        .field-value { font-size: 15px; color: #18181b; line-height: 1.5; }
        .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-size: 15px; color: #18181b; line-height: 1.6; }
        .footer { padding: 16px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #a1a1aa; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 Új kapcsolati üzenet</h1>
        </div>
        <div class="body">
            <div class="field">
                <div class="field-label">Feladó neve</div>
                <div class="field-value">{{ $senderName }}</div>
            </div>
            <div class="field">
                <div class="field-label">Email cím</div>
                <div class="field-value"><a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a></div>
            </div>
            <div class="field">
                <div class="field-label">Típus</div>
                <div class="field-value">{{ $contactType }}</div>
            </div>
            <div class="field">
                <div class="field-label">Üzenet</div>
                <div class="message-box">{{ $messageText }}</div>
            </div>
        </div>
        <div class="footer">
            Ez az üzenet a VevésBazár kapcsolatfelvételi űrlapjáról érkezett.
        </div>
    </div>
</body>
</html>
