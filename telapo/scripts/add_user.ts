import prisma from "@/utils/connect";
import { Ask } from "./script-utils/ask";
import bcrypt from "bcrypt";
import { Command, Option } from "commander";
import { Program } from "./script-utils/program";

function makeMainProgram() {
  const program = new Command();
  program.addOption(new Option("--email <email>", "The email of the user"));
  program.addOption(
    new Option("--first-name <firstName>", "The first name of the user")
  );
  program.addOption(
    new Option("--last-name <lastName>", "The last name of the user")
  );
  program.addOption(
    new Option("--family-name <familyName>", "The family name of the user")
  );
  program.addOption(
    new Option(
      "--family-group-id <familyGroupId>",
      "The family group id of the user"
    )
  );
  return program;
}

async function main() {
  const familyGroups = await prisma.familyGroup.findMany();
  const emails = new Set(
    (
      await prisma.user.findMany({
        select: {
          email: true,
        },
      })
    ).map((user) => user.email)
  );
  const email = await Ask.input("email", {
    message: "Enter the email of the user",
  });
  if (!email || typeof email !== "string") {
    throw Error("Email is required and must be a string");
  }
  if (emails.has(email)) {
    throw Error(`Email ${email} already exists`);
  }
  const firstName = await Ask.input("firstName", {
    message: "Enter the first name of the user",
  });
  if (!firstName || typeof firstName !== "string") {
    throw Error("First name is required and must be a string");
  }
  const lastName = await Ask.input("lastName", {
    message: "Enter the last name of the user",
  });
  if (!lastName || typeof lastName !== "string") {
    throw Error("Last name is required and must be a string");
  }
  const familyName = await Ask.input("familyName", {
    message: "Enter the family name of the user",
  });
  if (!familyName || typeof familyName !== "string") {
    throw Error("Family name is required and must be a string");
  }

  const familyGroupId = await Ask.select("familyGroupId", {
    message: "Enter the family group of the user",
    choices: familyGroups.map((fg) => ({
      name: fg.displayName,
      value: fg.id,
    })),
  });
  if (!familyGroupId || typeof familyGroupId !== "string") {
    throw Error("Family group is required and must be a string");
  }
  if (!familyGroups.some((fg) => fg.id === familyGroupId)) {
    throw Error(`Family group ${familyGroupId} does not exist`);
  }
  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      familyGroupId: familyGroupId,
      passhash: await bcrypt.hash(familyName, 10),
      familyGroup: familyName,
    },
  });
}

if (require.main === module) {
  Program.initialize = makeMainProgram();
  Program.parse();
  Ask.loadArgs(Program.opts);
  main();
}
