import { PW_RESET_TEMPLATE } from "@/mail_templates/psr";
import nodemailer from "nodemailer";
export const sendPasswordResetEmail = async ({
  email,
  link,
  displayName,
}: {
  email: string;
  displayName: string;
  link: string;
}) => {
  console.log(process.env.DATABASE_URL);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PW, // the app password Not your gmail password
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Requested | Secret Santa",
    text:
      "You have requested a password reset, please navigate to this link: " +
      link,
    html: PW_RESET_TEMPLATE({ displayName, link }),
  });
  console.log(info);
};
