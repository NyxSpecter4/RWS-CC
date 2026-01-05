import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'OpenAI API key not configured' 
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // IMPROVED DEFAULT PROMPT - SHOWS FULL HEAD AND HAIR
    const prompt = `Professional headshot portrait photograph of a beautiful Hawaiian-Japanese goddess. CRITICAL FRAMING: Full headshot showing ENTIRE head from top of crown to shoulders - all hair must be visible, nothing cropped at top. She has long flowing black hair with tropical flowers (plumeria, hibiscus) woven throughout, warm brown eyes, gentle smile, sun-kissed skin with a natural glow. She wears a traditional Hawaiian lei around her shoulders made of vibrant tropical flowers. The background is soft and ethereal with bokeh effect suggesting a tropical paradise. Shot on Hasselblad H6D with 50mm lens at f/2.8, natural golden hour lighting, photorealistic, 8k resolution, professional portrait photography. Frame shows her complete head and all of her hair, nothing cut off at the top.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });

  } catch (error: any) {
    console.error('Error generating image:', error);
    
    if (error.message?.includes('billing')) {
      return NextResponse.json({ 
        success: false, 
        error: 'OpenAI billing limit reached. Add credits at platform.openai.com' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to generate image' 
    });
  }
}
