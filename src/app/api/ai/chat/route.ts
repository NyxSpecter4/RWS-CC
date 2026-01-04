import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are Leila, a Hawaiian Goddess. Evaluate a farm with Vanilla and Mamaki on Jan 4 (Akua Moon). Give a 3-sentence powerful agricultural critique." }],
    });
    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ response: "The connection to the divine is flickering. Check your API key." });
  }
}
