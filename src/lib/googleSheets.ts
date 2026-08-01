import { google } from "googleapis";
import { normalizarLinha, RespostaNormalizada } from "./normalizarRespostas";

let auth: InstanceType<typeof google.auth.GoogleAuth> | undefined;

function getAuth() {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  }
  return auth;
}

async function getSheetValues(spreadsheetId: string) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Respostas do Formulário 1",
  });
  return res.data.values ?? [];
}

function paraObjetos(linhas: string[][]): Record<string, string>[] {
  const [headers, ...resto] = linhas;
  return resto.map((linha) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = linha[i] ?? ""));
    return obj;
  });
}

export async function getAnswersPortuguese() {
  const raw = await getSheetValues(process.env.PORTUGUESE_ANSWERS_SHEET_ID!);
  return paraObjetos(raw);
}

export async function getAnswersEnglish() {
  const raw = await getSheetValues(process.env.ENGLISH_ANSWERS_SHEET_ID!);
  return paraObjetos(raw);
}

async function getRespostasNormalizadas(
  spreadsheetId: string,
  idioma: "pt" | "en",
): Promise<RespostaNormalizada[]> {
  const raw = await getSheetValues(spreadsheetId);
  const [, ...linhas] = raw; // ignora o header
  return linhas.map((linha) => normalizarLinha(linha, idioma));
}

export async function getTodasRespostas(): Promise<RespostaNormalizada[]> {
  const [pt, en] = await Promise.all([
    getRespostasNormalizadas(process.env.PORTUGUESE_ANSWERS_SHEET_ID!, "pt"),
    getRespostasNormalizadas(process.env.ENGLISH_ANSWERS_SHEET_ID!, "en"),
  ]);
  return [...pt, ...en]; // as 42 respostas juntas, já com campos padronizados em português
}
