import { getMailer, sendDrawEmail } from "@/server/mailer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const draws = await prisma.user.findMany({
    select: {
      email: true,
      firstName: true,
      draws: { select: { firstName: true, lastName: true, familyGroup: true } },
    },
  });
  const trans = await getMailer();
  await Promise.all(
    draws.map(async (draw) => {
      if (draw.draws) {
        sendDrawEmail({
          displayName: draw.firstName,
          recipientName: `${draw.draws.firstName} ${draw.draws.lastName} (${draw.draws.familyGroup})`,
          email: draw.email,
          trans,
        });
      }
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
