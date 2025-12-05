import prisma from "../utils/connect";
async function main() {
  const users = await prisma.user.findMany();

  if (
    !users.every(
      (user) =>
        user.drawsId &&
        typeof user.drawsId === "string" &&
        user.drawsId.length !== 0
    )
  )
    throw Error("Some users have no matches");
  try {
    await Promise.all(
      users.map(async (user) => {
        await prisma.user.findFirstOrThrow({ where: { drawsId: user.id } });
      })
    );
  } catch (error) {
    throw Error("Some users have not been drawn");
  }
  console.log("Validated ", users.length);
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
