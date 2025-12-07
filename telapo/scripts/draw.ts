import prisma from "../utils/connect";
import { execute } from "../utils/execute_draw";

async function main() {
  const draws = await execute();
  await Promise.all(
    draws.map(async (draw) => {
      await prisma.latestDrew.upsert({
        where: {
          whoDrewId: draw.whoDrew.id,
        },
        create: {
          whoDrewId: draw.whoDrew.id,
          whoWasDrawnId: draw.whoWasDrawn.id,
        },
        update: {
          whoWasDrawnId: draw.whoWasDrawn.id,
        },
      });
    })
  );
}

main();
