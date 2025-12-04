import { sendPasswordResetEmail } from "@/server/mailer";
import prisma from "../app/utils/connect";
async function main() {
  const basePath = process.env.NEXTAUTH_URL;
  if (!basePath || basePath.length == 0) throw Error("You gotta have this");
  const users = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      id: true,
    },
  });
  await Promise.all(
    users.map(async (user) => {
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

      await prisma.pWResetToken.deleteMany({ where: { userId: user.id } });
      await prisma.pWResetToken.create({ data: { userId: user.id, secret } });
      await sendPasswordResetEmail({
        email: user.email,
        displayName: user.firstName ?? "Name missing",
        link: basePath + "/reset?token=" + secret,
      });
    })
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
