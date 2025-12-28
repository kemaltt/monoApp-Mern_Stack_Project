const nodemailer = require('nodemailer');


    const sendForgotPasswordEmail = async (options) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const message = {
            // from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            from: process.env.SMTP_EMAIL,
            to: options.email,
            subject: options.subject,
            html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options?.subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 24px;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            text-align: center;
        }
        .header {
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
           width: 180px;
           border-radius: 10px;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            background: linear-gradient(260deg, #2376ae 0%, #c16ecf 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888888;
        }
    </style>
</head>
<body>
    <div class="email-container">
     <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/golden-tempest-446213-g3.firebasestorage.app/o/ShoppingApp%2Fprivate%2Fusers%2F67744858d11b267aafd57453%2Fprofile%2Flogo.png-1736102886515?alt=media&token=7523f3fd-b12c-45dc-a42a-c6458afc609e" alt="Logo">
        </div>
        <div class="content">
            <p>Hello ${options?.name},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${options?.resetURL}" class="button">Reset Password</a>
            <p>If you didn’t request a password reset, please ignore this email.</p>
            <p>For any questions or concerns, feel free to contact our support team.</p>
        </div>
        <div class="footer">
           <p>&copy; ${options?.currentYear} Your Mono App. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      
      `
        };

        await transporter.sendMail(message)
        // .then(() => {
        //   console.log("Email sent successfully");
        // }
        // ).catch((error) => {
        //   console.error(error);
        // });
    }



    const sendVerificationEmail = async (options) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const message = {
            from: process.env.SMTP_EMAIL,
            to: options.email,
            subject: options.subject,
            html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options?.subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 24px;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            text-align: center;
        }
        .header {
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
           width: 180px;
           border-radius: 10px;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 14px 35px;
            background: #2B47FC;
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s ease;
        }
        .button:hover {
            background: #3A54FC;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888888;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/golden-tempest-446213-g3.firebasestorage.app/o/ShoppingApp%2Fprivate%2Fusers%2F67744858d11b267aafd57453%2Fprofile%2Flogo.png-1736102886515?alt=media&token=7523f3fd-b12c-45dc-a42a-c6458afc609e" alt="Logo">
        </div>
        <div class="content">
            <p>Hello ${options?.name},</p>
            <p>Welcome to Mono App! Please verify your email address to complete your registration. Click the button below to verify:</p>
            <a href="${options?.verificationURL}" class="button">Verify Email</a>
            <p style="font-size: 14px; color: #666;">This link will expire in 30 minutes.</p>
            <p>If you didn't register with us, please ignore this email.</p>
            <p>For any questions or concerns, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${options?.currentYear} Your Mono App. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `
        };

        await transporter.sendMail(message);
        
    }


module.exports = {
    sendForgotPasswordEmail,
    sendVerificationEmail
};