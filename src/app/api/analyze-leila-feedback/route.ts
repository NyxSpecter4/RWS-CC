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

    const analysisPrompt = `You are analyzing user feedback about AI-generated portraits of a Hawaiian-Japanese goddess named Leila. 

POSITIVE FEEDBACK (what user LIKES):
${likes.map((r: any) => `- "${r.notes}"`).join('\n') || 'None yet'}

NEGATIVE FEEDBACK (what user DISLIKES):
${dislikes.map((r: any) => `- "${r.notes}"`).join('\n') || 'None yet'}

Based on this feedback, create an IMPROVED DALL-E 3 prompt for generating Leila. 

REQUIREMENTS:
- Keep the core concept: Hawaiian-Japanese goddess, photorealistic portrait
- Incorporate specific preferences from POSITIVE feedback
- Avoid elements mentioned in NEGATIVE feedback
- Be very specific about facial features, expression, styling
- Keep it under 400 words
- Use photographic terminology (Hasselblad, f/2.8, etc.)
- Natural, authentic, high-quality aesthetic

Return ONLY the improved prompt, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert prompt engineer for DALL-E 3, specializing in photorealistic portrait generation." },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const improvedPrompt = response.choices[0].message.content?.trim() || '';

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
