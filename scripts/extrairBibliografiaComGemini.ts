// scripts/extrairBibliografiaComGemini.ts
import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CAMINHO_PDF = path.join(
  process.cwd(),
  "bibliografia",
  "Referência Bibliográfica TCC.pdf",
);
const ARQUIVO_SAIDA = path.join(
  process.cwd(),
  "src",
  "data",
  "bibliografia.json",
);

async function main() {
  const buffer = fs.readFileSync(CAMINHO_PDF);
  const base64Pdf = buffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf,
            },
          },
          {
            text: `Extraia o texto completo deste documento, mantendo a estrutura original (títulos, parágrafos, resumos de cada biblioteca) em português. Não resuma, não interprete, não adicione comentários — apenas transcreva o conteúdo de forma fiel e organizada, corrigindo apenas problemas óbvios de quebra de linha ou espaçamento.`,
          },
        ],
      },
    ],
  });

  const textoLimpo = response.text;

  fs.mkdirSync(path.dirname(ARQUIVO_SAIDA), { recursive: true });
  fs.writeFileSync(
    ARQUIVO_SAIDA,
    JSON.stringify(
      [{ nomeArquivo: "Referência Bibliográfica TCC.pdf", texto: textoLimpo }],
      null,
      2,
    ),
  );

  console.log("✅ Texto extraído via Gemini e salvo em:", ARQUIVO_SAIDA);
  console.log(`Total de caracteres: ${textoLimpo?.length}`);
}

main();
