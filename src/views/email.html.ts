export function getEmailHTML(token: string): string {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                margin: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                font-size: 24px;
                color: #333;
            }
            .content {
                margin-bottom: 20px;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
            }
            .verification-code {
                display: inline-block;
                padding: 10px;
                margin: 10px 0;
                font-size: 18px;
                font-weight: bold;
                color: #fff;
                background-color: #007bff;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <p>Hi there!</p>
                <p>You have recently visited our website and entered your email address.</p>
                <p>Here is your verification code:</p>
                <div class="verification-code">${token}</div>
                <p>Thanks for your attention!</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Zitrium. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `

    return html;
}