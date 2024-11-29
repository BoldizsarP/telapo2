import { drewTemplate } from "@/mail_templates/dt";
import { PW_RESET_TEMPLATE } from "@/mail_templates/psr";
import { User } from "@prisma/client";
import nodemailer, { Transporter } from "nodemailer";
export const sendPasswordResetEmail = async ({
  email,
  link,
  displayName,
}: {
  email: string;
  displayName: string;
  link: string;
}) => {
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
};

export const sendDrawEmail = async ({
  displayName,
  recipientName,
  email,
  trans,
}: {
  displayName: string;
  recipientName: string;
  email: string;
  trans?: Transporter;
}) => {
  const transporter =
    trans ??
    nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW, // the app password Not your gmail password
      },
    });
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "A letter from the north pole | Secret Santa",
    text:
      "We were trying to reach out you about your car's extended warranty: You drew " +
      recipientName,
    html: drewTemplate({ displayName, recipientName }),
  });
};

export const getMailer = () =>
  nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PW, // the app password Not your gmail password
    },
  });
