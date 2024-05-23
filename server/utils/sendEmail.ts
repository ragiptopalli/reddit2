import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_USER_EMAIL,
    pass: process.env.MAIL_USER_PASSWORD,
  },
});

export async function sendEmail(to: string, html: string) {
  const info = await transporter.sendMail({
    from: `"Reddit2 👻" <${process.env.MAIL_USER_EMAIL}>`,
    to,
    subject: 'Reset Password - Reddit2',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Message URL: %s', nodemailer.getTestMessageUrl(info));
}
