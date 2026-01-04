import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { cropName, prompt } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log(`Generating image for ${cropName}...`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0].url;

    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      cropName: cropName
    });

  } catch (error: any) {
    console.error('Crop image generation error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    });
  }
}
