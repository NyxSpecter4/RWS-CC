import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { improvedPrompt } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'No API key' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: improvedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    return NextResponse.json({
      success: true,
      imageUrl: response.data[0].url,
      promptUsed: improvedPrompt
    });

  } catch (error: any) {
    console.error('Smart generation error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
