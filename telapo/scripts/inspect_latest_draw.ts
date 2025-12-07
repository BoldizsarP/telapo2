import prisma from "../utils/connect";
import { analyzeFamilyGroupDraws } from "../utils/execute_draw";

async function main() {
  const latestDraws = await prisma.latestDrew.findMany({
    include: {
      whoDrew: true,
      whoWasDrawn: true,
    },
  });
  const history = await prisma.drawHistory.findMany({
    include: {
      whoDrew: true,
      whoWasDrawn: true,
    },
    orderBy: {
      drewYear: "desc",
    },
  });
  const draws = latestDraws.map((latestDraw) => ({
    whoDrew: latestDraw.whoDrew,
    whoWasDrawn: latestDraw.whoWasDrawn,
    score: 0,
  }));
  analyzeFamilyGroupDraws(draws);

  for (const draw of draws) {
    if (draw.whoDrew.familyGroupId === draw.whoWasDrawn.familyGroupId) {
      console.error(
        `${draw.whoDrew.firstName} ${draw.whoDrew.lastName} drew their own family group`
      );
      continue;
    }

    const lastDrew = history.find((h) => h.whoDrewId === draw.whoDrew.id);
    if (lastDrew?.whoWasDrawnId === draw.whoWasDrawn.id) {
      console.warn(
        `${draw.whoDrew.firstName} ${draw.whoDrew.lastName} also drew ${draw.whoWasDrawn.firstName} ${draw.whoWasDrawn.lastName} last year`
      );
    }
    if (
      lastDrew?.whoWasDrawn.familyGroupId === draw.whoWasDrawn.familyGroupId
    ) {
      console.warn(
        `${draw.whoDrew.firstName} ${draw.whoDrew.lastName} also drew  from family group ${draw.whoWasDrawn.familyGroup} last year`
      );
    }
  }
}

main();
