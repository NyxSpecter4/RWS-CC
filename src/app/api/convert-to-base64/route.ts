import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'No URL provided' });
    }

    console.log('🔄 Converting image to base64:', imageUrl);

    // Fetch the image from DALL-E (server-side, no CORS!)
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/png';
    const base64Image = `data:${mimeType};base64,${base64}`;

    console.log('✅ Image converted to base64 successfully');

    return NextResponse.json({
      success: true,
      base64: base64Image
    });

  } catch (error: any) {
    console.error('❌ Error converting image:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}
