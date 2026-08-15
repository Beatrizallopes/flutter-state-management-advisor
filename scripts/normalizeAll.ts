import * as dotenv from "dotenv";
dotenv.config();
import { getAllAnswers } from "../src/lib/googleSheets"; // já deve estar usando normalizedLine

async function main() {
  const answers = await getAllAnswers();
  const count: Record<string, number> = {};
  answers.forEach((r) => {
    count[r.bibliotecaUtilizada] = (count[r.bibliotecaUtilizada] ?? 0) + 1;
  });
  console.log("Bibliotecas mencionadas:", count);
}

main();
