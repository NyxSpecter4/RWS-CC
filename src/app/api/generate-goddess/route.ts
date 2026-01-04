import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  return handleRequest();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return handleRequest(body.customPrompt);
}

async function handleRequest(customPrompt?: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false,
        imageUrl: null,
        error: 'OpenAI API key not configured'
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const defaultPrompt = `Photorealistic portrait of a Hawaiian-Japanese goddess, medium format photograph shot on Hasselblad camera with 80mm f/2.8 lens. Subject is a beautiful mixed-heritage woman in her 30s with warm golden-brown skin, elegant almond-shaped eyes with gentle upward tilt, delicate nose bridge, full graceful lips with subtle natural smile. Long flowing black hair with soft natural waves, adorned with traditional Hawaiian lei po'o of white plumeria flowers and vibrant green maile leaves, interspersed with delicate Japanese kanzashi hairpins featuring mother-of-pearl inlay. She wears contemporary interpretation of Hawaiian kīhei shoulder garment made from fine undyed kapa cloth with subtle geometric water and growth patterns, draped like Japanese kimono collar. Simple gold necklace with Hawaiian ipu gourd pendant at collarbone. Expression is serene, wise, nurturing, embodying spirit of Laka goddess of growth and compassionate dignity of Kannon. Cinematic Rembrandt lighting highlights cheekbones, creates soft natural glow. Background is soft misty foliage of Hawaiian rainforest at dawn. Hyper-detailed with realistic skin texture showing visible pores, individual hair strands catching light, lifelike moisture on flowers. Professional high-fashion editorial photography, dramatic portrait, National Geographic quality, 8k resolution. Natural skin imperfections, subtle skin shine, authentic details.`;

    const prompt = customPrompt || defaultPrompt;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    return NextResponse.json({ 
      success: true,
      imageUrl: response.data[0].url,
      prompt_used: customPrompt ? "Custom mood prompt" : "Default goddess"
    });
  } catch (error: any) {
    console.error('Goddess generation error:', error);
    return NextResponse.json({ 
      success: false,
      imageUrl: null,
      error: error.message 
    });
  }
}
