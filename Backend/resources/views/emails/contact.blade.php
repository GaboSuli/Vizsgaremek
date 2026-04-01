<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Új kapcsolati üzenet</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
                            <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">📬 Új kapcsolati üzenet</h1>
                            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Szaldon — Kapcsolati űrlap</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 40px;">
                            <!-- Típus badge -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="background:#f5f3ff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 16px;">
                                        <strong style="color:#6366f1;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Típus:</strong>
                                        <span style="color:#4f46e5;font-size:15px;font-weight:600;margin-left:8px;">{{ $contactType }}</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Feladó adatok -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td width="50%" style="padding:8px 0;">
                                        <span style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;">Feladó neve</span><br>
                                        <span style="color:#1e293b;font-size:15px;font-weight:500;">{{ $senderName }}</span>
                                    </td>
                                    <td width="50%" style="padding:8px 0;">
                                        <span style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;">Email cím</span><br>
                                        <a href="mailto:{{ $senderEmail }}" style="color:#6366f1;font-size:15px;font-weight:500;text-decoration:none;">{{ $senderEmail }}</a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Elválasztó -->
                            <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">

                            <!-- Üzenet -->
                            <p style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;margin:0 0 8px;">Üzenet</p>
                            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;color:#334155;font-size:15px;line-height:1.7;white-space:pre-wrap;">{{ $messageText }}</div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
                            <p style="color:#94a3b8;font-size:12px;margin:0;">
                                Ez az email a <strong>Szaldon</strong> kapcsolati űrlapján keresztül lett küldve.<br>
                                Válaszoláshoz kattints a válasz gombra — a feladó email címe automatikusan be lesz állítva.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>