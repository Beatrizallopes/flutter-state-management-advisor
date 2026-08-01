import * as dotenv from "dotenv";
dotenv.config();
import { getTodasRespostas } from "../src/lib/googleSheets";

async function main() {
  const respostas = await getTodasRespostas();
  console.log(`Total: ${respostas.length} respostas`);
  console.log(JSON.stringify(respostas.slice(0, 3), null, 2)); // 3 exemplos
}

main();
