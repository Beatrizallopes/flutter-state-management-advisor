/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/testarSheets.ts
import { google } from "googleapis";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function testar() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.PORTUGUESE_ANSWERS_SHEET_ID!,
      range: "A1:Z5", // pega só as 5 primeiras lines pra testar
    });

    console.log("✅ Conexão funcionou!");
    console.log("Linhas recebidas:", res.data.values?.length);
    console.log("Primeira linha (cabeçalho):", res.data.values?.[0]);
    console.log("Segunda linha (exemplo de resposta):", res.data.values?.[1]);
  } catch (err: any) {
    console.error("❌ Erro:", err.message);
    if (
      err.message.includes("PERMISSION_DENIED") ||
      err.message.includes("403")
    ) {
      console.error(
        "→ Provavelmente você esqueceu de compartilhar a planilha com o client_email da service account.",
      );
    }
    if (err.message.includes("Unable to parse")) {
      console.error(
        "→ O GOOGLE_SERVICE_ACCOUNT_KEY no .env.local pode estar mal formatado (JSON quebrado).",
      );
    }
  }
}

testar();
