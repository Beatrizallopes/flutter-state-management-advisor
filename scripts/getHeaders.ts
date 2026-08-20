import * as dotenv from "dotenv";
dotenv.config();
import {
  getAnswersPortuguese,
  getAnswersEnglish,
} from "../src/functions/googleSheets";

async function main() {
  const portugueseAnswers = await getAnswersPortuguese();
  const englishAnswers = await getAnswersEnglish();

  console.log("=== COLUNAS portugueseAnswers ===");
  console.log(Object.keys(portugueseAnswers[0] ?? {}));

  console.log("\n=== COLUNAS EN ===");
  console.log(Object.keys(englishAnswers[0] ?? {}));
}

main();
