import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      ...(history ?? []), // array de mensagens anteriores, se quiser manter contexto
      { role: "user", parts: [{ text: message }] },
    ],
  });

  return NextResponse.json({ reply: response.text });
}