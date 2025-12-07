import prisma from "@/utils/connect";
import { Ask } from "./script-utils/ask";
import { Command, Option } from "commander";
import { Program } from "./script-utils/program";
import {
  createPasswordResetToken,
  getPasswordResetLink,
} from "@/utils/password-reset";
import { sendPasswordResetEmail } from "@/server/mailer";

function makePasswordResetEmailProgram() {
  const program = new Command();
  program.addOption(new Option("--email <email>", "The email of the user"));
  return program;
}

async function passwordResetEmail() {
  const users = await prisma.user.findMany();
  const email = await Ask.select("email", {
    message: "Select the user to send the password reset email to",
    choices: users.map((user) => ({
      name: user.email,
      value: user.email,
    })),
  });
  if (!email || typeof email !== "string") {
    throw Error("Email is required and must be a string");
  }
  const user = users.find((user) => user.email === email);
  if (!user) {
    throw Error("User not found");
  }
  const secret = await createPasswordResetToken(user);
  await sendPasswordResetEmail({
    email: user.email,
    displayName: user.firstName ?? "Name missing",
    link: getPasswordResetLink(secret),
  });
}

if (require.main === module) {
  Program.initialize = makePasswordResetEmailProgram();
  Program.parse();
  Ask.loadArgs(Program.opts);
  void passwordResetEmail();
}
