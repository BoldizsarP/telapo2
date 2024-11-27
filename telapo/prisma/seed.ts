import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const salt = await bcrypt.genSalt(10);
  const adminEmail = process.env.ADMIN_EMAIL ?? "boldizsarpal@invenshure.com";
  const adminPass = process.env.ADMIN_PASSWORD ?? "TelapoAdmin";
  await prisma.user.create({
    data: {
      lastName: "Pal",
      firstName: "Boldizsar",
      familyGroup: "Pal",
      email: adminEmail,
      passhash: await bcrypt.hash(adminPass, salt),
    },
  });
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
