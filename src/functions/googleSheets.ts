import { google } from "googleapis";
import { normalizedLine } from "./normalizeAnswers";
import { getAuth } from "./googleAuth";
import { RESPONSES_SHEET_RANGE } from "@/constants/googleApi";
import type { NormalizedAnswer } from "@/types/answers";

async function getSheetValues(spreadsheetId: string) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: RESPONSES_SHEET_RANGE,
  });
  return res.data.values ?? [];
}

function toObjects(lines: string[][]): Record<string, string>[] {
  const [headers, ...rest] = lines;
  return rest.map((line) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = line[i] ?? ""));
    return obj;
  });
}

export async function getAnswersPortuguese() {
  const raw = await getSheetValues(process.env.PORTUGUESE_ANSWERS_SHEET_ID!);
  return toObjects(raw);
}

export async function getAnswersEnglish() {
  const raw = await getSheetValues(process.env.ENGLISH_ANSWERS_SHEET_ID!);
  return toObjects(raw);
}

async function getNormalizedAnswers(
  spreadsheetId: string,
  language: "pt" | "en",
): Promise<NormalizedAnswer[]> {
  const raw = await getSheetValues(spreadsheetId);
  const [, ...lines] = raw; // ignora o header
  return lines.map((line) => normalizedLine(line, language));
}

export async function getAllAnswers(): Promise<NormalizedAnswer[]> {
  const [pt, en] = await Promise.all([
    getNormalizedAnswers(process.env.PORTUGUESE_ANSWERS_SHEET_ID!, "pt"),
    getNormalizedAnswers(process.env.ENGLISH_ANSWERS_SHEET_ID!, "en"),
  ]);
  return [...pt, ...en];
}
