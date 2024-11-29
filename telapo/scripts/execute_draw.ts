import { PrismaClient } from "@prisma/client";
import logic from "./draw_logic_seed.json";
import _ from "lodash";
const prisma = new PrismaClient();
const MAPPINGS: { [key: string]: string } = {};
async function main() {
  await prisma.user.updateMany({ data: { drawsId: null } });
  await Promise.all(
    Object.keys(logic.fills).map(async (k) => {
      const fam = await prisma.user.findMany({
        where: { familyGroup: k },
      });
      if (fam.length != logic.fills[k as keyof typeof logic.fills])
        throw Error();
      const shuffledB = _.shuffle(fam);
      shuffledB.forEach((b, i) => {
        MAPPINGS[`${k[0].toUpperCase()}${i + 1}`] = b.email;
      });
    })
  );
  console.log(MAPPINGS);
  for (const entry of Object.entries(logic)) {
    if (entry[0] == "fills") return;
    const whoMail = MAPPINGS[entry[0]];
    const whomMail = MAPPINGS[entry[1] as string];
    console.log(entry, whoMail, whomMail);
    const whomId = (
      await prisma.user.findFirstOrThrow({ where: { email: whomMail } })
    ).id;
    await prisma.user.update({
      where: { email: whoMail },
      data: { drawsId: whomId },
    });
  }
  // await Promise.all(
  //   Object.entries(logic).map(async (k) => {
  //     if (k[0] == "fills") return;
  //     const whoMail = MAPPINGS[k[0]];
  //     const whomMail = MAPPINGS[k[1] as string];
  //     console.log(k, whoMail, whomMail);
  //     const whomId = (
  //       await prisma.user.findFirstOrThrow({ where: { email: whomMail } })
  //     ).id;
  //     await prisma.user.update({
  //       where: { email: whoMail },
  //       data: { drawsId: whomId },
  //     });
  //   })
  // );
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
