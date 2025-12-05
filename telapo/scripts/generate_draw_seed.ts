import { DrawSeed } from "@/utils/draw-logic";
import prisma from "../utils/connect";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      familyGroup: true,
    },
    where: {
      isActive: true,
    },
  });
  console.info(`Found ${users.length} users`);
  const reducedUsers = users.reduce((acc, user) => {
    acc[user.familyGroup] = (acc[user.familyGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.info("Family groups found", reducedUsers.length);
  for (const familyGroup in reducedUsers) {
    console.info(
      `Family group ${familyGroup} has ${reducedUsers[familyGroup]} users`
    );
  }
  const drawSeed: DrawSeed = {
    familyGroups: reducedUsers,
    draws: [],
  };
}

main();
