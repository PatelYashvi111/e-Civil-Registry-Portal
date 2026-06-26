import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.transporter.sendMail({
      from: `"E-Civil Registry Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to E-Civil Registry Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:30px;">
                
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
                  
                  <tr>
                    <td align="center" style="background:#2563eb; color:#ffffff; padding:25px;">
                      <h1 style="margin:0;">E-Civil Registry Portal</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:30px;">
                      
                      <h2 style="color:#333333;">
                        Hello ${name} 👋
                      </h2>

                      <p style="font-size:16px; color:#555555; line-height:1.6;">
                        Welcome to the <strong>E-Civil Registry Portal</strong>.
                        Your account has been created successfully.
                      </p>

                      <p style="font-size:16px; color:#555555; line-height:1.6;">
                        You can now access the system and use the available services.
                      </p>

                      <div style="text-align:center; margin:30px 0;">
                        <a href="#"
                          style="
                            background:#2563eb;
                            color:#ffffff;
                            text-decoration:none;
                            padding:12px 25px;
                            border-radius:5px;
                            display:inline-block;
                            font-size:16px;">
                          Login to Portal
                        </a>
                      </div>

                      <p style="font-size:14px; color:#777777;">
                        If you did not request this account, please contact the administrator.
                      </p>

                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="background:#f4f6f9; padding:20px; color:#888888; font-size:12px;">
                      © 2026 E-Civil Registry Portal<br>
                      This is an automated email. Please do not reply.
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