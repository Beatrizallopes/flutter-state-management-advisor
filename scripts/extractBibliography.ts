import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pdfPath = path.join(
  process.cwd(),
  "bibliografia",
  "Referência Bibliográfica TCC.pdf",
);
const outputFile = path.join(process.cwd(), "src", "data", "bibliografia.json");

async function main() {
  const buffer = fs.readFileSync(pdfPath);
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

  const cleanText = response.text;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      [{ nomeArquivo: "Referência Bibliográfica TCC.pdf", texto: cleanText }],
      null,
      2,
    ),
  );

  console.log("✅ Texto extraído via Gemini e salvo em:", outputFile);
  console.log(`Total de caracteres: ${cleanText?.length}`);
}

main();
