import { compare, genSalt, hash } from "bcrypt";
import prisma from "../../utils/connect";
async function main() {
  //   await prisma.user.update({
  //     where: { email: "boldizsarpal@invenshure.com" },
  //     data: { passhash: await hash("123", await genSalt(10)) },
  //   });

  const user = await prisma.user.findFirstOrThrow({
    where: { email: "boldizsarpal@invenshure.com" },
  });
  if (await compare("123", user.passhash)) {
    console.log("Password is correct");
  } else {
    console.error("Password is incorrect");
  }
}
main();
