import prisma from "../../utils/connect";
import { Migration, MigrationBase } from "./migration_types";

class MigrateLegacy extends MigrationBase implements Migration {
  migrationName = "migrate_legacy";
  async run() {
    const users = await prisma.user.findMany();
    for (const user of users) {
      if (!user.drawsId) continue;
      if (
        await prisma.drawHistory.findFirst({
          where: {
            whoDrewId: user.id,
            whoWasDrawnId: user.drawsId,
            drewYear: 2024,
          },
        })
      ) {
        continue;
      }
      await prisma.drawHistory.create({
        data: {
          whoDrewId: user.id,
          whoWasDrawnId: user.drawsId,
          drewYear: 2024,
        },
      });
    }
  }
}
if (require.main === module) {
  async function main() {
    const migrateLegacy = new MigrateLegacy();
    try {
      await migrateLegacy.run();
      await migrateLegacy.saveResult(true);
    } catch (error) {
      await migrateLegacy.saveResult(
        false,
        error instanceof Error ? error.message : undefined
      );
      console.error(error);
      process.exit(1);
    }
  }
  main();
}
export { MigrateLegacy };
