import { Prisma, User } from "@/generated/prisma/client";
import prisma from "./connect";
import { shuffle } from "lodash";
type DrawHistory = Prisma.DrawHistoryGetPayload<{
  include: { whoDrew: true; whoWasDrawn: true };
}>;

type MatchContext = Record<string, number>;

type Draw = {
  whoDrew: User;
  whoWasDrawn: User;
  score: number;
};

function sanityCheck(draws: Draw[], users: User[]) {
  for (const draw of draws) {
    if (users.filter((user) => user.id === draw.whoDrew.id).length !== 1) {
      throw Error(`Who drew ${draw.whoDrew.id} not found`);
    }
    if (users.filter((user) => user.id === draw.whoWasDrawn.id).length !== 1) {
      throw Error(`Who was drawn ${draw.whoWasDrawn.id} not found`);
    }
  }
  for (const draw of draws) {
    if (draw.whoDrew.familyGroupId === draw.whoWasDrawn.familyGroupId) {
      throw Error(`User ${draw.whoDrew.id} drew their own family group`);
    }
  }
  for (const user of users) {
    if (draws.filter((draw) => draw.whoWasDrawn.id === user.id).length !== 1) {
      throw Error(`User ${user.id} not drawn by anyone`);
    }
  }
}

function makeContext(whoDrew: User, finishedDraws: Draw[]) {
  const context: MatchContext = {};
  for (const draw of finishedDraws) {
    if (draw.whoDrew.familyGroupId === whoDrew.familyGroupId) {
      context[draw.whoWasDrawn.familyGroupId] =
        draw.whoWasDrawn.familyGroupId in context
          ? context[draw.whoWasDrawn.familyGroupId] + 1
          : 1;
    }
  }
  return context;
}

function scoreMatch(
  who: User,
  whom: User,
  history: DrawHistory[],
  context: MatchContext,
  isCircle: boolean
): number {
  const drewHistory = history.filter((h) => h.whoDrewId === who.id);
  if (isCircle) {
    return 50;
  }
  const lastDrew =
    drewHistory.length > 0
      ? drewHistory.sort((a, b) => a.drewYear - b.drewYear)[0]
      : null;
  if (lastDrew?.whoWasDrawnId === whom.id) {
    return 50;
  }
  const hasDrewThisPersonBefore = drewHistory.some(
    (h) => h.whoWasDrawnId === whom.id
  );
  if (hasDrewThisPersonBefore) {
    return 25;
  }
  let starterScore = context[whom.familyGroupId] ?? 0;
  for (const [index, history] of drewHistory.entries()) {
    if (index > 5) {
      break;
    }
    if (history.whoWasDrawn.familyGroupId === whom.familyGroupId) {
      starterScore += 5 - index;
    }
  }
  return starterScore;
}

async function execute() {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
    },
  });
  const history = await prisma.drawHistory.findMany({
    include: {
      whoDrew: true,
      whoWasDrawn: true,
    },
  });
  let remainingUsers = [...users];
  let remainingTargets = [...users];
  const draws: Draw[] = [];
  while (remainingUsers.length > 0) {
    const nextUser = Math.floor(Math.random() * remainingUsers.length);
    const whoDrew = remainingUsers[nextUser];
    const possibleTargets = remainingTargets.filter(
      (target) => target.familyGroupId !== whoDrew.familyGroupId
    );
    const context = makeContext(whoDrew, draws);
    const isDrawnBy = draws.find((draw) => draw.whoWasDrawn.id === whoDrew.id)
      ?.whoDrew.id;
    const scores = possibleTargets.map((target) => ({
      target,
      score: scoreMatch(
        whoDrew,
        target,
        history,
        context,
        isDrawnBy === target.id
      ),
    }));
    if (scores.length === 0) {
      throw Error(`No targets found for ${whoDrew}`);
    }
    const minScore = Math.min(...scores.map((s) => s.score));
    const firstMin = shuffle(scores.filter((s) => s.score === minScore))[0];
    draws.push({
      whoDrew,
      whoWasDrawn: firstMin.target,
      score: firstMin.score,
    });
    remainingUsers = remainingUsers.filter((user) => user.id !== whoDrew.id);
    remainingTargets = remainingTargets.filter(
      (target) => target.id !== firstMin.target.id
    );
  }
  sanityCheck(draws, users);
  return draws;
}

function analyzeFamilyGroupDraws(draws: Draw[]) {
  // Group draws by the family group of whoDrew
  const drawsByFamily = new Map<string, Draw[]>();

  for (const draw of draws) {
    const familyGroupId = draw.whoDrew.familyGroupId;
    if (!drawsByFamily.has(familyGroupId)) {
      drawsByFamily.set(familyGroupId, []);
    }
    drawsByFamily.get(familyGroupId)!.push(draw);
  }

  // For each family group, analyze their draws
  for (const [familyGroupId, familyDraws] of drawsByFamily.entries()) {
    // Count how many unique family groups they drew
    const targetFamilyGroups = new Map<string, number>();

    for (const draw of familyDraws) {
      const targetFamilyGroupId = draw.whoWasDrawn.familyGroupId;
      targetFamilyGroups.set(
        targetFamilyGroupId,
        (targetFamilyGroups.get(targetFamilyGroupId) || 0) + 1
      );
    }

    const uniqueFamilyGroupsCount = targetFamilyGroups.size;
    const totalDraws = familyDraws.length;

    // Calculate ratios
    const ratios: string[] = [];
    for (const [targetFamilyGroupId, count] of targetFamilyGroups.entries()) {
      const ratio = (count / totalDraws).toFixed(2);
      ratios.push(`${targetFamilyGroupId}: ${ratio} (${count}/${totalDraws})`);
    }

    console.info(
      `Family Group ${familyGroupId}: ` +
        `Drew ${uniqueFamilyGroupsCount} different family groups. ` +
        `Ratios: ${ratios.join(", ")}`
    );
  }
}

export { execute, analyzeFamilyGroupDraws };
