// scripts/verHeaders.ts
import * as dotenv from "dotenv";
dotenv.config(); // carrega o .env explicitamente, ANTES de importar o resto

import {
  getAnswersPortuguese,
  getAnswersEnglish,
} from "../src/lib/googleSheets";

async function main() {
  console.log("SHEET_ID PT:", process.env.PORTUGUESE_ANSWERS_SHEET_ID); // debug rápido
  console.log("SHEET_ID EN:", process.env.ENGLISH_ANSWERS_SHEET_ID);

  const pt = await getAnswersPortuguese();
  const en = await getAnswersEnglish();

  console.log("=== COLUNAS PT ===");
  console.log(Object.keys(pt[0] ?? {}));

  console.log("\n=== COLUNAS EN ===");
  console.log(Object.keys(en[0] ?? {}));
}

main();
