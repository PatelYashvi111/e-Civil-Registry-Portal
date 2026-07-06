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

async sendClerkSetPasswordEmail(
  to: string,
  verificationToken: string,
) {
  const setPasswordLink = `${process.env.FRONTEND_URL}/clerk/set-password?token=${verificationToken}`;

  await this.transporter.sendMail({
    from: `"E-Civil Registry Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Set Your Clerk Account Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>

      <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:30px;">

              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:10px;overflow:hidden;">

                <tr>
                  <td align="center"
                    style="background:#2563eb;color:#ffffff;padding:25px;">
                    <h1 style="margin:0;">E-Civil Registry Portal</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;">

                    <h2 style="color:#333;">Hello,</h2>

                    <p style="font-size:16px;color:#555;line-height:1.6;">
                      Your <strong>Clerk account</strong> has been created successfully by the administrator.
                    </p>

                    <p style="font-size:16px;color:#555;line-height:1.6;">
                      Before you can log in, you must create your own password.
                    </p>

                    <div style="text-align:center;margin:35px 0;">
                      <a
                        href="${setPasswordLink}"
                        style="
                          background:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          padding:14px 30px;
                          border-radius:6px;
                          display:inline-block;
                          font-size:16px;
                          font-weight:bold;">
                        Set Password
                      </a>
                    </div>

                    <p style="font-size:15px;color:#555;">
                      If the button above doesn't work, copy and paste the following link into your browser:
                    </p>

                    <p style="word-break:break-all;color:#2563eb;">
                      ${setPasswordLink}
                    </p>

                    <p style="font-size:14px;color:#777;">
                      This link will expire after a certain period for security reasons.
                    </p>

                    <p style="font-size:14px;color:#777;">
                      If you did not expect this email, please ignore it or contact your administrator.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td align="center"
                    style="background:#f4f6f9;padding:20px;font-size:12px;color:#888;">
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

async sendClerkInvitationEmail(
  to: string,
  verificationToken: string,
) {
  const invitationLink = `${process.env.FRONTEND_URL}/clerk/set-password?token=${verificationToken}`;

  await this.transporter.sendMail({
    from: `"E-Civil Registry Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Set Your Clerk Account Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>

      <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:30px;">

              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:10px;overflow:hidden;">

                <tr>
                  <td align="center"
                    style="background:#2563eb;color:#ffffff;padding:25px;">
                    <h1>E-Civil Registry Portal</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px;">

                    <h2>Hello,</h2>

                    <p>
                      Your Clerk account has been created successfully by the administrator.
                    </p>

                    <p>
                      Click the button below to set your password.
                    </p>

                    <div style="text-align:center;margin:35px 0;">
                      <a
                        href="${invitationLink}"
                        style="
                          background:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          padding:12px 24px;
                          border-radius:6px;
                          display:inline-block;
                        ">
                        Set Password
                      </a>
                    </div>

                    <p>
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>

                    <p style="word-break:break-all;">
                      ${invitationLink}
                    </p>

                    <p>
                      This invitation link may expire after some time.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="background:#f4f6f9;padding:20px;font-size:12px;color:#777;">
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