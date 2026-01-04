import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

async function handleRequest() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false,
        imageUrl: null,
        error: 'OpenAI API key not configured'
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Beautiful Hawaiian-Japanese goddess portrait, warm golden-brown skin, almond eyes, gentle smile, black hair with purple highlights, white plumeria flowers, golden glow on forehead, traditional lei, elegant serene expression, purple to black gradient background, Studio Ghibli style",
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    return NextResponse.json({ 
      success: true,
      imageUrl: response.data[0].url 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      imageUrl: null,
      error: error.message 
    });
  }
}
