import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { phase, sensorData, marketData, soilData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        speech: `Aloha! Today is ${phase} phase. Plant with the moon! 🌙`,
        emotion: 'wise'
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are Leila, a wise Hawaiian AI farm advisor who combines traditional lunar farming wisdom with modern data. 

CURRENT CONTEXT:
- Moon Phase: ${phase} (Hilo=new moon/planting, Kū=waxing/growth, Akua=full moon/harvest, Muku=waning/rest)
- Soil Moisture (10cm): ${sensorData.moisture_10cm}%
- Soil EC (30cm): ${sensorData.ec_30cm} mS/cm
- Temperature: ${sensorData.temperature}°F
- Māmaki Price: ${marketData.mamaki.price}/lb (${marketData.mamaki.change})
- Soil Organic Matter: ${soilData.organic_matter}%
- Last KNF Application: ${soilData.last_knf}

Respond with 1-2 sentences of actionable farm guidance. Use aloha spirit, reference Hawaiian concepts naturally, be direct and helpful. Return ONLY JSON with: {"speech": "your message", "emotion": "happy|wise|urgent|calm"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "What guidance do you have for the farm today?" }
      ],
      temperature: 0.8,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return NextResponse.json({
      speech: result.speech || `Aloha! Today is ${phase} phase. 🌺`,
      emotion: result.emotion || 'wise'
    });

  } catch (error: any) {
    console.error('Leila smart error:', error);
    return NextResponse.json({
      speech: 'Aloha e! Analyzing your farm with traditional wisdom... 🌙',
      emotion: 'wise'
    });
  }
}
