import { PrismaClient } from "@prisma/client";
import seedUsers from "./seed.json";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();
async function main() {
  const salt = await bcrypt.genSalt(10);
  const adminEmail = process.env.ADMIN_EMAIL ?? "boldizsarpal@invenshure.com";
  const adminPass = process.env.ADMIN_PASSWORD ?? "TelapoAdmin";
  const truePass = process.env.RANDOM_SEED_PW ?? false;
  await prisma.user.create({
    data: {
      lastName: "Pal",
      firstName: "Boldizsar",
      familyGroup: "Pal Institute",
      email: adminEmail,
      passhash: await bcrypt.hash(adminPass, salt),
    },
  });
  await Promise.all(
    seedUsers.map(async (element) => {
      await prisma.user.create({
        data: {
          email: element["Email cím"],
          familyGroup: element["fam"],
          lastName: element["lname"],
          firstName: element["fname"],
          passhash: await bcrypt.hash(
            truePass ? randomUUID() : "UnsetPassword",
            salt
          ),
        },
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
