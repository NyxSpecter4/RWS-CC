import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Handle both GET and POST
export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

async function handleRequest() {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key missing');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        success: false,
        imageUrl: null
      }, { status: 200 }); // Return 200 to avoid errors
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('Generating goddess image with DALL-E...');

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A stunningly beautiful Hawaiian-Japanese goddess portrait. Professional headshot, 3/4 view, warm golden-brown skin, almond-shaped eyes with gentle loving expression, delicate features. Long flowing black hair with purple highlights, white plumeria flowers. Gentle nurturing smile, wise serene expression. Small glowing golden point on forehead. Traditional Hawaiian lei. High-quality digital portrait, soft natural lighting, warm colors. Style: Disney Moana meets Studio Ghibli elegance. Beautiful, elegant, nurturing goddess. Clean gradient background purple to black with golden glow.`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });

    console.log('Goddess image generated successfully');

    return NextResponse.json({ 
      imageUrl: response.data[0].url,
      success: true 
    });

  } catch (error: any) {
    console.error('DALL-E Error:', error.message);
    
    // Return error gracefully
    return NextResponse.json({ 
      error: error.message || 'Failed to generate goddess',
      success: false,
      imageUrl: null
    }, { status: 200 }); // Return 200 to avoid breaking the UI
  }
}
