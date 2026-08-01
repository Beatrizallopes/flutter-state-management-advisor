// scripts/normalizarTudo.ts
import * as dotenv from "dotenv";
dotenv.config();
import { getAllAnswers } from "../src/lib/googleSheets"; // já deve estar usando normalizedLine

async function main() {
  const respostas = await getAllAnswers();
  console.log(`Total normalizado: ${respostas.length}`);

  // conta quantas vezes cada biblioteca aparece — bom teste de sanidade
  const contagem: Record<string, number> = {};
  respostas.forEach((r) => {
    contagem[r.bibliotecaUtilizada] =
      (contagem[r.bibliotecaUtilizada] ?? 0) + 1;
  });
  console.log("Bibliotecas mencionadas:", contagem);
}

main();
