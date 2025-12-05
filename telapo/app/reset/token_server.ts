"use server";

import prisma from "@/utils/connect";
import { sendPasswordResetEmail } from "@/server/mailer";
import { genSalt, hash } from "bcrypt";

type Response = { field_error: string } | { global_error: string } | true;

export async function requestReset(
  baseUrl: string,
  prevState: Response | null,
  data: FormData
): Promise<Response> {
  const email = data.get("email");
  if (!email || typeof email !== "string")
    return { field_error: "Email must be ok" };
  const { id = undefined, firstName } =
    (await prisma.user.findFirst({
      where: { email },
      select: { id: true, firstName: true },
    })) ?? {};
  const userId = id;
  if (!userId) return { field_error: "Email must be ok" };
  let secret: string | undefined = undefined;
  while (!secret) {
    const testSecret = crypto.randomUUID();
    const isTaken = await prisma.pWResetToken.findFirst({
      where: { secret: testSecret },
    });
    if (isTaken) {
      continue;
    } else {
      secret = testSecret;
    }
  }
  if (!secret) return { field_error: "Email must be ok" };

  await prisma.pWResetToken.deleteMany({ where: { userId } });
  await prisma.pWResetToken.create({ data: { userId, secret } });
  await sendPasswordResetEmail({
    email,
    displayName: firstName ?? "Name missing",
    link: baseUrl + "/reset?token=" + secret,
  });

  return true;
}

export async function resetPassword(
  secret: string,
  prevState: Response | null,
  data: FormData
): Promise<Response> {
  console.log(data);
  const psw = data.get("psw");
  const psw_confirm = data.get("psw_confirm");
  if (!psw || !psw_confirm || psw != psw_confirm || typeof psw != "string") {
    console.log("error", psw, psw_confirm, psw != psw_confirm, typeof psw);
    return { field_error: "Passwords don't match" };
  }
  const resetEntry = await prisma.pWResetToken.findUnique({
    where: { secret },
  });
  console.log(resetEntry);
  if (!resetEntry) return { global_error: "secret missing" };
  await prisma.pWResetToken.delete({ where: { secret } });
  await prisma.user.update({
    where: { id: resetEntry.userId },
    data: { passhash: await hash(psw, await genSalt(10)) },
  });
  return true;
}
