import { drewTemplate } from "@/mail_templates/dt";
import { PW_RESET_TEMPLATE } from "@/mail_templates/psr";
import { lookup } from "node:dns";
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
  const transporter = await getMailer();

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
  const transporter = trans ?? (await getMailer());
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

const getIp = async () => {
  return new Promise<string>((resolve, reject) => {
    lookup("smtp.gmail.com", (err, address, family) => {
      if (err) reject(err);
      resolve(address);
    });
  });
};

export const getMailer = async () =>
  nodemailer.createTransport({
    service: "gmail",
    host: await getIp(),
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PW, // the app password Not your gmail password
    },
    logger: process.env.EMAIL_DEBUG?.toLowerCase() === "true",
    debug: process.env.EMAIL_DEBUG?.toLowerCase() === "true",
  });
