// scripts/verAmostraEn.ts
import * as dotenv from "dotenv";
dotenv.config();
import { getAllAnswers } from "../src/lib/googleSheets";

async function main() {
  const respostas = await getAllAnswers();
  const amostraEn = respostas
    .filter((r) => r.originalLanguage === "en")
    .slice(0, 3);
  console.log(JSON.stringify(amostraEn, null, 2));
}

main();
