// scripts/extrairBibliografia.ts
import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

const PASTA_BIBLIOGRAFIA = path.join(process.cwd(), "bibliografia");
const ARQUIVO_SAIDA = path.join(
  process.cwd(),
  "src",
  "data",
  "bibliografia.json",
);

async function main() {
  const arquivos = fs
    .readdirSync(PASTA_BIBLIOGRAFIA)
    .filter((f) => f.endsWith(".pdf"));

  console.log(`Encontrados ${arquivos.length} PDFs`);

  const artigos = [];

  for (const arquivo of arquivos) {
    const caminho = path.join(PASTA_BIBLIOGRAFIA, arquivo);
    const buffer = fs.readFileSync(caminho);
    const data = await pdf(buffer);

    artigos.push({
      nomeArquivo: arquivo,
      totalPaginas: data.numpages,
      texto: data.text.replace(/\s+/g, " ").trim(), // remove espaços/quebras excessivas
    });

    console.log(
      `✅ ${arquivo} — ${data.numpages} páginas, ${data.text.length} caracteres`,
    );
  }

  fs.mkdirSync(path.dirname(ARQUIVO_SAIDA), { recursive: true });
  fs.writeFileSync(ARQUIVO_SAIDA, JSON.stringify(artigos, null, 2));

  console.log(`\n📦 Bibliografia salva em: ${ARQUIVO_SAIDA}`);
  console.log(
    `Total de caracteres: ${artigos.reduce((sum, a) => sum + a.texto.length, 0)}`,
  );
}

main();
