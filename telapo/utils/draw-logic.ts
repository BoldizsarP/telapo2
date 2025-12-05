export type Draw = {
  drewMemberId: string;
  whoDrewFamilyGroup: string;
  whoWasDrawnFamilyGroup: string;
};

export type DrawSeed = {
  familyGroups: Record<string, number>; // family group name -> number of people in the family group
  draws: Draw[];
};
