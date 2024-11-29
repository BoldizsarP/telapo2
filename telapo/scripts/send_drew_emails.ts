import { getMailer, sendDrawEmail } from "@/server/mailer";
import { PrismaClient } from "@prisma/client";
import readlineSync from "readline-sync";
const prisma = new PrismaClient();
async function main() {
  const draws = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      draws: { select: { firstName: true, lastName: true, familyGroup: true } },
    },
  });
  await prisma.$disconnect();
  for (const draw of draws) {
    const doit =
      readlineSync.question(`Send email to ${draw.email}`).toLowerCase() == "y";

    const trans = await getMailer();
    if (doit && draw.draws) {
      sendDrawEmail({
        displayName: draw.firstName,
        recipientName: `${draw.draws.firstName} ${draw.draws.lastName} (${draw.draws.familyGroup})`,
        email: draw.email,
        trans,
      });
    }
  }
}
main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
