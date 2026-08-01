// lib/googleSheets.ts
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!), // service account
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export async function getAnswersPortuguese() {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.PORTUGUESE_ANSWERS_SHEET_ID!,
    range: "Respostas ao formulário 1", // nome da aba
  });
  return res.data.values; // array de arrays (linhas)
}

export async function getAnswersEnglish() {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.ENGLISH_ANSWERS_SHEET_ID!,
    range: "Respostas ao formulário 1", // nome da aba
  });
  return res.data.values; // array de arrays (linhas)
}
