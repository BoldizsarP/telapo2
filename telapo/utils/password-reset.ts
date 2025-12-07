import { User } from "@/generated/prisma/client";
import prisma from "./connect";

const basePath = process.env.NEXTAUTH_URL;
if (!basePath || basePath.length == 0) throw Error("You gotta have this");

export async function createPasswordResetToken(user: User): Promise<string> {
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
  if (!secret) throw Error("Secret must be ok");

  await prisma.pWResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.pWResetToken.create({ data: { userId: user.id, secret } });
  return secret;
}

export function getPasswordResetLink(secret: string): string {
  return `${basePath}/reset?token=${secret}`;
}
