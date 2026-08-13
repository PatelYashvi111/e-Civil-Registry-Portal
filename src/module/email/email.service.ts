import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private clerkTransporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER1,
        pass: process.env.EMAIL_PASS1,
      },
    });

     this.clerkTransporter = nodemailer.createTransport({
    service: "gmail",
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

    async sendApplicationCreatedEmail( to: string, name:string, applicationNumber: string, serviceType: string ) {
      await this.transporter.sendMail({
            from: `"E-Civil Registry Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Application Submitted Successfully',
    html: `
      <h2>Hello ${name},</h2>

      <p>Your application has been submitted successfully.</p>

      <p><strong>Application Number:</strong> ${applicationNumber}</p>

      <p><strong>Service Type:</strong> ${serviceType}</p>

      <p>Status: <strong>PENDING</strong></p>

      <p>We will notify you once your application has been reviewed.</p>
    `,

      })
  }

  async sendOtpEmail(
  to: string,
  name: string,
  otp: string,
  subject: string,
) {
  await this.transporter.sendMail({
    from: `"E-Civil Registry Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; background:#f4f6f9; padding:20px;">

        <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:30px;">

          <h2 style="color:#2563eb;">
            E-Civil Registry Portal
          </h2>

          <h3>Hello ${name},</h3>

          <p>Your One-Time Password (OTP) is:</p>

          <div style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:6px;
              color:#2563eb;
              text-align:center;
              margin:30px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p>
            Please do not share this OTP with anyone.
          </p>

          <hr>

          <p style="font-size:12px;color:#777;">
            This is an automated email from E-Civil Registry Portal.
          </p>

        </div>

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

async sendMeetingLinkToUser(
  to: string,
  meetingLink: string,
) {
  await this.transporter.sendMail({
    from: `"E-Civil Registry Portal" <${process.env.EMAIL_USER1}>`,
    to,
    subject: "Meeting Invitation",
    html: `
      <h2>Meeting Invitation</h2>

      <p>Your meeting has been scheduled successfully.</p>

      <a href="${meetingLink}">
        Join Meeting
      </a>
    `,
  });
}

}
