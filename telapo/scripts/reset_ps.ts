import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();

  try {
    Promise.all(
      users.map(async (user) => {
        if (user.email === process.env.ADMIN_EMAIL) return;
        await prisma.user.update({
          where: { id: user.id },
          data: { passhash: await hash("UnsetPassword", await genSalt(10)) },
        });
      })
    );
  } catch (error) {
    throw Error("Some users have not been drawn");
  }
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
