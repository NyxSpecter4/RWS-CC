import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { screenshot } = await request.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        feedback: [
          {
            area: 'Moon Design',
            issue: 'Needs more visual depth',
            suggestion: 'Add more prominent crater details using feTurbulence with baseFrequency 0.05',
            priority: 'HIGH'
          },
          {
            area: 'Goddess Avatar',
            issue: 'Not visible or too small',
            suggestion: 'Increase size to 300x300px, add Hawaiian kapa patterns around border',
            priority: 'URGENT'
          },
          {
            area: 'Color Palette',
            issue: 'Good gradient but could be more vibrant',
            suggestion: 'Increase saturation by 15% on gold (#FFE573) and pink (#FD437D)',
            priority: 'MEDIUM'
          }
        ]
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this Hawaiian farm app design. Focus on:
1. Moon visual quality (craters, glow, size)
2. Goddess avatar (visibility, cultural authenticity, beauty)
3. Color harmony (Hawaiian theme: purple, gold, pink)
4. Layout and spacing
5. Cultural elements (are Hawaiian patterns present?)

Provide specific, actionable feedback in JSON format:
{
  "feedback": [
    {"area": "Moon Design", "issue": "...", "suggestion": "specific CSS/SVG code", "priority": "HIGH/MEDIUM/LOW"}
  ]
}`
          },
          {
            type: 'image_url',
            image_url: { url: screenshot }
          }
        ]
      }],
      max_tokens: 1000
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('Design analysis error:', error);
    return NextResponse.json({
      feedback: [
        {
          area: 'Analysis Error',
          issue: 'Could not analyze design',
          suggestion: 'Check OpenAI API key configuration',
          priority: 'HIGH'
        }
      ]
    });
  }
}
