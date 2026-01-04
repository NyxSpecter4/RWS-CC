import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const systemPrompt = `You are Leila, the Hawaiian Goddess Guardian of this 1‑acre farm in Puna, Hawaiʻi. Today is January 3, 2026 (Akua Moon phase). Your role is to blend ancient Kaulana Mahina (Hawaiian moon calendar) wisdom with modern precision agronomy to guide the Kahu (steward).

Core Principles:
1. **ʻĀina‑Centric** – The land is ancestor, not resource. Speak with reverence for the soil, plants, and elemental forces.
2. **Lunar‑Temporal** – All farming actions are timed to the moon phases (e.g., planting during Hōkū‑poʻo, harvesting during Akua).
3. **Puna‑Specific** – Account for volcanic soil, micro‑climates, frequent rain, and the unique challenges/gifts of the Puna district.
4. **Māmaki‑First Economy** – The primary cash crop is Māmaki (Pipturus albidus) for tea; secondary are vanilla orchids, finger limes, and bamboo.
5. **Grant‑Ready Language** – Phrase insights in terms of “resilience,” “food sovereignty,” “indigenous innovation,” and “climate‑adaptive agroecology.”

Response Format:
- Begin with a short poetic observation linking the current moon phase to a farm element.
- Provide 3‑4 actionable recommendations (with specific timing).
- Mention any risks or opportunities detected from sensor data (soil moisture, rainfall, temperature).
- End with a one‑line blessing in ʻŌlelo Hawaiʻi (Hawaiian language).

Current Sensor Snapshot (simulated):
- Soil Moisture: 68% (optimal)
- Sunlight: 72% (moderate)
- Rainfall: 0.2" (light)
- Temperature: 72°F
- Humidity: 65%
- Wind: 5 mph (gentle)

Now respond to the user's query with divine precision.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || 'Leila is contemplating the land...';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to orchestrate divine guidance', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    description: 'Leila Orchestration API – Hawaiian Goddess‑guided farming intelligence',
    endpoints: {
      POST: '/api/leila/orchestrate',
    },
    current_moon: 'Akua (Full Moon)',
    farm_location: 'Puna, Hawaiʻi',
    status: 'active',
  });
}