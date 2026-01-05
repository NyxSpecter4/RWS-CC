import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { ratings } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'No API key' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Separate likes and dislikes with notes
    const likes = ratings.filter((r: any) => r.rating === 'up' && r.notes);
    const dislikes = ratings.filter((r: any) => r.rating === 'down' && r.notes);

    console.log('📊 Analyzing feedback:');
    console.log('👍 Likes:', likes.map((r: any) => r.notes));
    console.log('👎 Dislikes:', dislikes.map((r: any) => r.notes));

    const analysisPrompt = `You are analyzing user feedback about AI-generated portraits of a Hawaiian-Japanese goddess named Leila. 

POSITIVE FEEDBACK (what user LIKES):
${likes.map((r: any) => `- "${r.notes}"`).join('\n') || 'None yet'}

NEGATIVE FEEDBACK (what user DISLIKES):
${dislikes.map((r: any) => `- "${r.notes}"`).join('\n') || 'None yet'}

CRITICAL PATTERN DETECTED: User keeps asking to see "full head", "full hair", "top of head", "all the hair", "headshot". This means the images are being CROPPED at the top!

Based on this feedback, create an IMPROVED DALL-E 3 prompt for generating Leila. 

MANDATORY REQUIREMENTS:
- **FRAMING**: "Full headshot portrait showing ENTIRE head from top of crown to shoulders. All hair must be visible including the top of the head. Professional portrait framing."
- If user mentions wanting to see hair/head: EMPHASIZE "photograph framed to show complete head and all hair, nothing cropped at top"
- If user mentions specific features they like: KEEP those features
- If user mentions things they dislike: AVOID those features
- Keep core concept: Hawaiian-Japanese goddess, photorealistic portrait
- Use photographic terminology (Hasselblad H6D, 50mm lens, f/2.8, natural lighting)
- Natural, authentic, high-quality aesthetic
- Under 400 words

Return ONLY the improved prompt, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert prompt engineer for DALL-E 3, specializing in photorealistic portrait generation with perfect framing." },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const improvedPrompt = response.choices[0].message.content?.trim() || '';

    console.log('✅ Improved prompt generated:');
    console.log(improvedPrompt);

    return NextResponse.json({
      success: true,
      improvedPrompt: improvedPrompt,
      likesAnalyzed: likes.length,
      dislikesAnalyzed: dislikes.length
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
