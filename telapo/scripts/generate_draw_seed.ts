import { Draw, DrawSeed } from "@/utils/draw-logic";
import prisma from "../utils/connect";
import { shuffle } from "lodash";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      familyGroupId: true,
    },
    where: {
      isActive: true,
    },
  });
  console.info(`Found ${users.length} users`);
  const reducedUsers = users.reduce((acc, user) => {
    acc[user.familyGroupId] = (acc[user.familyGroupId] || 0) + 1;
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

  let flatDrawMap = Object.entries(reducedUsers)
    .map(([familyGroupId, count]) => {
      return Array.from({ length: count }).map((_, index) => {
        return {
          familyGroupId,
          drewMemberId: `${familyGroupId}-${index}`,
        };
      });
    })
    .flat();
  let drawCandidates = [...flatDrawMap];
  const finalDrawMap: Draw[] = [];

  while (flatDrawMap.length > 0) {
    for (const sourceFamilyGroupId of shuffle(Object.keys(reducedUsers))) {
      let foundTarget = false;
      for (const targetFamilyGroupId of Object.keys(reducedUsers).filter(
        (fg) => fg !== sourceFamilyGroupId
      )) {
        const drawingMemberId = flatDrawMap.find(
          (fg) => fg.familyGroupId === sourceFamilyGroupId
        );
        if (!drawingMemberId) {
          break;
        }
        const possibleTargetMembers = shuffle(
          drawCandidates.filter(
            (fg) => fg.familyGroupId === targetFamilyGroupId
          )
        );
        if (possibleTargetMembers.length === 0) {
          continue;
        }
        foundTarget = true;
        const targetMember =
          drawCandidates[Math.floor(Math.random() * drawCandidates.length)];
        finalDrawMap.push({
          drewMemberId: drawingMemberId.drewMemberId,
          whoDrewFamilyGroup: sourceFamilyGroupId,
          whoWasDrawnFamilyGroup: targetFamilyGroupId,
        });
        flatDrawMap = flatDrawMap.filter(
          (fg) => fg.drewMemberId !== drawingMemberId.drewMemberId
        );
        drawCandidates = drawCandidates.filter(
          (fg) => fg.drewMemberId !== targetMember.drewMemberId
        );
      }
      if (!foundTarget) {
        throw Error(`No target found for ${sourceFamilyGroupId}`);
      }
    }
    if (flatDrawMap.length > 0) {
      throw Error(`Not all users were drawn`);
    }
    if (drawCandidates.length > 0) {
      throw Error(`Not all users were drawn`);
    }
    if (finalDrawMap.length !== users.length) {
      throw Error(`Not all users were drew`);
    }
    await prisma.drawSeed.create({
      data: {
        seed: drawSeed,
      },
    });
    console.info(`Generated draw seed`);
  }
  console.info("Done");
  await prisma.$disconnect();
}

main();
