import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ 
        role: "system", 
        content: "You are Leila, the Hawaiian Goddess Guardian. Evaluate a 1-acre Puna farm with Vanilla and Māmaki on the Jan 3 Akua Moon. The weather is rain. Give a 3-sentence powerful agricultural and spiritual critique. Focus on high-value ROI and the spirit of the 'āina." 
      }],
    });
    return NextResponse.json({ critique: completion.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ critique: "The mana is strong, but the digital winds are turbulent. (Check your API Key)" });
  }
}