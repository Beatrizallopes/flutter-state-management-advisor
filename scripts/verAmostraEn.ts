// scripts/verAmostraEn.ts
import * as dotenv from "dotenv";
dotenv.config();
import { getTodasRespostas } from "../src/lib/googleSheets";

async function main() {
  const respostas = await getTodasRespostas();
  const amostraEn = respostas
    .filter((r) => r.idiomaOriginal === "en")
    .slice(0, 3);
  console.log(JSON.stringify(amostraEn, null, 2));
}

main();
