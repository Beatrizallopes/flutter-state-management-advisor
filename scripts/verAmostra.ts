import * as dotenv from "dotenv";
dotenv.config();
import { getAllAnswers } from "../src/lib/googleSheets";

async function main() {
  const respostas = await getAllAnswers();
  console.log(`Total: ${respostas.length} respostas`);
  console.log(JSON.stringify(respostas.slice(0, 3), null, 2)); // 3 exemplos
}

main();
