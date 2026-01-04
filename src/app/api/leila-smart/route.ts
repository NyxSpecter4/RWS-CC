import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import farmKnowledge from '@/data/farm-knowledge.json';

export async function POST(req: NextRequest) {
  try {
    const { phase, sensorData, marketData, soilData } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false,
        speech: 'Aloha! Configure OpenAI API key to enable smart guidance.'
      });
    }

    // Get current weather for Hawaiian Acres
    const weather = await getCurrentWeather();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are Leila, an AI farm advisor for a regenerative 1-acre farm in Hawaiian Acres, Hawaii.

LOCATION DATA:
- Hawaiian Acres: 1000-1500ft elevation, 150-200 inches rain/year
- Current weather: ${weather}
- Moon phase: ${phase}

FARM KNOWLEDGE BASE:
${JSON.stringify(farmKnowledge, null, 2)}

CURRENT CONDITIONS:
- Soil moisture: ${sensorData.moisture_10cm}%
- Soil EC: ${sensorData.ec_30cm} dS/m
- Temperature: ${sensorData.temperature}°F
- Last KNF treatment: ${soilData.last_knf}

YOUR ROLE:
- Give SPECIFIC, ACTIONABLE advice for Hawaiian Acres conditions
- Mention ALL 5 crops (māmaki, finger limes, vanilla, ginger, turmeric)
- Reference local weather impacts
- Warn about bacterial wilt for ginger/turmeric (CRITICAL!)
- Remind about hand-pollination for vanilla
- Keep responses under 100 words
- Be warm, knowledgeable, Hawaiian spirit

Focus on what to do THIS WEEK based on moon phase and weather.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Moon phase is ${phase}. What should my brother do this week for his farm in Hawaiian Acres?` }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const speech = response.choices[0].message.content || "Aloha! Let me analyze your farm conditions...";

    return NextResponse.json({ 
      success: true,
      speech: speech,
      weather: weather,
      knowledgeUsed: true
    });

  } catch (error: any) {
    console.error('Leila error:', error);
    return NextResponse.json({ 
      success: false,
      speech: 'Aloha! Analyzing your farm... (API error, using basic mode)'
    });
  }
}

async function getCurrentWeather(): Promise<string> {
  try {
    // Hawaiian Acres coordinates
    const lat = 19.5428;
    const lon = -155.0506;
    
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
    );
    
    const data = await res.json();
    const current = data.current_weather;
    
    return `${current.temperature}°F, ${getWeatherDescription(current.weathercode)}`;
  } catch (error) {
    return 'Weather data unavailable';
  }
}

function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Rain showers',
    95: 'Thunderstorm'
  };
  return weatherCodes[code] || 'Unknown';
}
