import { Migration, MigrationBase, runMigration } from "./migration_types";
import prisma from "../../utils/connect";
class MigrateFamilyNames extends MigrationBase implements Migration {
  migrationName: string = "migrate_family_names";
  async run() {
    await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany();
      const familyGroups = new Set<string>(
        users.map((user) => user.familyGroup)
      );
      const existingFamilyGroups = await tx.familyGroup.findMany({
        where: {
          displayName: { in: Array.from(familyGroups) },
        },
      });
      for (const familyGroup of familyGroups) {
        if (existingFamilyGroups.some((fg) => fg.displayName === familyGroup)) {
          continue;
        }
        await tx.familyGroup.create({
          data: {
            displayName: familyGroup,
          },
        });
      }
      const newFamilyGroups = await tx.familyGroup.findMany({
        where: {
          displayName: { in: Array.from(familyGroups) },
        },
      });
      for (const user of users) {
        const familyGroup = newFamilyGroups.find(
          (fg) => fg.displayName === user.familyGroup
        );
        if (familyGroup) {
          await tx.user.update({
            where: { id: user.id },
            data: { familyGroupId: familyGroup.id },
          });
        }
        if (!familyGroup) {
          throw new Error(`Family group ${user.familyGroup} not found`);
        }
      }
    });
  }
}

if (require.main === module) {
  async function main() {
    const migrateFamilyNames = new MigrateFamilyNames();
    await runMigration(migrateFamilyNames);
  }
  main();
}

export { MigrateFamilyNames };
