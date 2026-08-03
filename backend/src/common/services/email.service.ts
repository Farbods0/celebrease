/* eslint-disable */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: "smtp.resend.com",
            port: 2525,
            secure: false,
            auth: {
                user: "resend", // Resend SMTP username is always "resend"
                pass: this.config.get("mail.pass"), // The API key
            },
        });
    }

    async verifyEmail({ email, url }: { email: string; url: string }) {
        return await this.transporter.sendMail({
            from: `CeleBrease <onboarding@resend.dev>`, // Resend requires this for unverified domains
            to: [email],
            subject: "Verify Your CeleBrease Account",
            html: `
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Verify Your CeleBrease Account</title>
                    <style>
                        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Inter", sans-serif;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                        }
                        .header {
                            background-color: #6729FF;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            color: #ffffff !important;
                            text-decoration: none;
                            letter-spacing: 1px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 24px;
                            color: #333333;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .message {
                            font-size: 16px;
                            color: #666666;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        .verify-button {
                            display: inline-block;
                            background-color: #6729FF;
                            color: #ffffff !important;
                            text-decoration: none;
                            padding: 6px 32px;
                            border-radius: 99px;
                            font-size: 14px;
                            font-weight: bold;
                            line-height: 24px;
                            text-align: center;
                            transition: background-color 0.3s ease;
                        }
                        .verify-button:hover {
                            background-color: #3a6bc7;
                        }
                        .alternative-text {
                            font-size: 14px;
                            color: #888888;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eeeeee;
                        }
                    </style>
                </head>
                <body>
                    <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #f4f4f4; padding: 20px 0"
                    >
                        <tr>
                            <td align="center">
                                <table class="email-container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
                                    <!-- Header -->
                                    <tr>
                                        <td class="header">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="#" class="logo">CeleBrease</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td class="content">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div class="greeting">Welcome to CeleBrease!</div>
                                                        <div class="message">
                                                            Thank you for signing up for CeleBrease, your premium holiday décor rental subscription platform!
                                                            We're excited to help you dress your home for every celebration without the storage clutter.
                                                            <br /><br />
                                                            To complete your registration and choose your holiday kits, please verify
                                                            your email address by clicking the button below:
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="padding: 20px 0">
                                                        <a href="${url}" class="verify-button"> Verify Email Address </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="alternative-text">
                                                            If the button above doesn't work, copy and paste the following link into your browser:
                                                            <br />
                                                            <span style="color: #6729FF; word-break: break-all">${url}</span>
                                                            <br /><br />
                                                            This verification link will expire in 1 hour for security reasons.
                                                            <br /><br />
                                                            If you didn't create an account with CeleBrease, you can safely ignore this email.
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
            `,
        });
    }

    async contact({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
        return await this.transporter.sendMail({
            from: `CeleBrease Contact <onboarding@resend.dev>`,
            to: ["farbods0@gmail.com"],
            subject: `New Contact: ${subject}`,
            html: `
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>New Contact Form Submission</title>
                    <style>
                        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Inter", sans-serif;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                        }
                        .header {
                            background-color: #6729FF;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            color: #ffffff !important;
                            text-decoration: none;
                            letter-spacing: 1px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .title {
                            font-size: 24px;
                            color: #333333;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .info-box {
                            background-color: #f8f9fa;
                            border-radius: 12px;
                            padding: 20px;
                            margin-bottom: 20px;
                        }
                        .info-row {
                            margin-bottom: 12px;
                        }
                        .info-label {
                            font-weight: 600;
                            color: #333333;
                            display: inline-block;
                            min-width: 80px;
                        }
                        .info-value {
                            color: #666666;
                        }
                        .message-box {
                            background-color: #f8f9fa;
                            border-radius: 12px;
                            padding: 20px;
                            margin-top: 20px;
                        }
                        .message-label {
                            font-size: 16px;
                            font-weight: 600;
                            color: #333333;
                            margin-bottom: 12px;
                        }
                        .message-text {
                            color: #666666;
                            line-height: 1.6;
                            white-space: pre-wrap;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            color: #888888;
                            font-size: 14px;
                            border-top: 1px solid #eeeeee;
                        }
                    </style>
                </head>
                <body>
                    <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #f4f4f4; padding: 20px 0"
                    >
                        <tr>
                            <td align="center">
                                <table class="email-container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td class="header">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="#" class="logo">CeleBrease</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="content">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div class="title">New Contact Form Submission</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="info-box">
                                                            <div class="info-row">
                                                                <span class="info-label">Name:</span>
                                                                <span class="info-value">${name}</span>
                                                            </div>
                                                            <div class="info-row">
                                                                <span class="info-label">Email:</span>
                                                                <span class="info-value">${email}</span>
                                                            </div>
                                                            <div class="info-row">
                                                                <span class="info-label">Subject:</span>
                                                                <span class="info-value">${subject}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="message-box">
                                                            <div class="message-label">Message:</div>
                                                            <div class="message-text">${message}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="footer">
                                            This message was sent from the CeleBrease contact form.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
            `,
        });
    }

    async resetPassword({ email, url }: { email: string; url: string }) {
        return await this.transporter.sendMail({
            from: `CeleBrease <onboarding@resend.dev>`,
            to: [email],
            subject: "Reset Your CeleBrease Password",
            html: `
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Reset Your CeleBrease Password</title>
                    <style>
                        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
    
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Inter", sans-serif;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                        }
                        .header {
                            background-color: #6729FF;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            color: #ffffff !important;
                            text-decoration: none;
                            letter-spacing: 1px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 24px;
                            color: #333333;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .message {
                            font-size: 16px;
                            color: #666666;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        .verify-button {
                            display: inline-block;
                            background-color: #6729FF;
                            color: #ffffff !important;
                            text-decoration: none;
                            padding: 6px 32px;
                            border-radius: 99px;
                            font-size: 14px;
                            font-weight: bold;
                            line-height: 24px;
                            text-align: center;
                            transition: background-color 0.3s ease;
                        }
                        .verify-button:hover {
                            background-color: #3a6bc7;
                        }
                        .alternative-text {
                            font-size: 14px;
                            color: #888888;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eeeeee;
                        }
                    </style>
                </head>
                <body>
                    <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #f4f4f4; padding: 20px 0"
                    >
                        <tr>
                            <td align="center">
                                <table class="email-container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
                                    <!-- Header -->
                                    <tr>
                                        <td class="header">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="#" class="logo">CeleBrease</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <!-- Main Content -->
                                    <tr>
                                        <td class="content">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div class="greeting">Password Reset Request 🔐</div>
                                                        <div class="message">
                                                            We received a request to reset the password for your CeleBrease account.
                                                            <br /><br />
                                                            To reset your password and regain access to your holiday rental subscriptions, 
                                                            please click the button below:
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" style="padding: 20px 0">
                                                        <a href="${url}" class="verify-button"> Reset Password </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="alternative-text">
                                                            If the button above doesn't work, copy and paste the following link into your browser:
                                                            <br />
                                                            <span style="color: #6729FF; word-break: break-all">${url}</span>
                                                            <br /><br />
                                                            This password reset link will expire in 1 hour for security reasons.
                                                            <br /><br />
                                                            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
            `,
        });
    }
}
