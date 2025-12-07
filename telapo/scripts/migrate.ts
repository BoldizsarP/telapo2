import { Command, Option } from "commander";
import { MigrateLegacy } from "./migration_scripts/draws_legacy";
import { Migration, runMigration } from "./migration_scripts/migration_types";
import { MigrateFamilyNames } from "./migration_scripts/family_names";
import { Ask } from "./script-utils/ask";
import { Program } from "./script-utils/program";
import prisma from "../utils/connect";
const migrations: Migration[] = [new MigrateLegacy(), new MigrateFamilyNames()];

function makeMainProgram() {
  const program = new Command();
  program.addOption(
    new Option(
      "--action <action>",
      "The action to perform [all for every migration]"
    )
  );
  program.addOption(
    new Option("--re-apply <true|false>", "Re-apply the migration")
  );
  return program;
}
async function main() {
  const reApply = await Ask.confirm("reApply", {
    message: "Do you want to re-apply the migration?",
    default: false,
  });
  const ranMigrations = await prisma.customMigration.findMany({
    where: { success: true },
  });
  const action = await Ask.select("action", {
    message: "What action do you want to perform?",
    choices: migrations
      .map((migration) => migration.migrationName)
      .concat(["exit", "all"]),
  });
  if (!action) {
    console.error("No action selected");
    process.exit(1);
  }
  if (action === "exit") {
    process.exit(0);
  }
  if (action === "all") {
    for (const migration of migrations) {
      if (
        !reApply &&
        ranMigrations.some((m) => m.migrationName === migration.migrationName)
      ) {
        continue;
      }
      await runMigration(migration);
    }
    process.exit(0);
  }
  const migration = migrations.find(
    (migration) => migration.migrationName === action
  );
  if (migration === undefined) {
    console.error("Migration not found");
    process.exit(1);
  }
  if (
    !reApply &&
    ranMigrations.some((m) => m.migrationName === migration.migrationName)
  ) {
    console.error("Migration already ran");
    process.exit(1);
  }
  await runMigration(migration);
  process.exit(0);
}

if (require.main === module) {
  Program.initialize = makeMainProgram();
  Program.parse();
  Ask.loadArgs(Program.opts);
  main();
}
export { main };
