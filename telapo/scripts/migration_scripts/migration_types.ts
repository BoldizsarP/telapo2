import prisma from "../../utils/connect";
interface Migration {
  migrationName: string;
  run: () => Promise<void>;
  saveResult: (success: boolean, errorMessage?: string) => Promise<void>;
}
class MigrationBase {
  migrationName: string = "";
  async saveResult(success: boolean, errorMessage?: string) {
    if (success && errorMessage) {
      throw new Error("Success cannot be true when error message is provided");
    }
    await prisma.customMigration.create({
      data: {
        migrationName: this.migrationName,
        success: success,
        errorMessage: errorMessage,
      },
    });
  }
}

export { MigrationBase, type Migration };
