import { writeFileSync } from "fs";
import { analyzeFamilyGroupDraws, execute } from "../utils/execute_draw";

async function main() {
  const draws = await execute();
  analyzeFamilyGroupDraws(draws);
  writeFileSync("draws.json", JSON.stringify(draws, null, 2), "utf-8");
}

main();
