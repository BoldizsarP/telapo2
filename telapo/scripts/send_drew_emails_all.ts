import { getMailer, sendDrawEmail } from "@/server/mailer";
import prisma from "../utils/connect";
import readlineSync from "readline-sync";
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
    const doit = readlineSync.question(`Send email to ${draw.email}`);
    const trans = await getMailer();
    if (doit.toLowerCase() === "y" && draw.draws) {
      await sendDrawEmail({
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
