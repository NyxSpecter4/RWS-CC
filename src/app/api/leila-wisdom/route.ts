import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { phase } = await request.json();
  
  const wisdom = {
    Hilo: "The new moon whispers of beginnings. Plant your seeds with intention, for what you sow in darkness will bloom in light.",
    Kū: "As the moon rises, so too does your harvest. Transplant with care, for growth follows the celestial tide.",
    Akua: "The full moon illuminates all. This is the time of PEAK MANA - pollinate your Vanilla, harvest your Māmaki. The goddess blesses your labor.",
    Muku: "In darkness, we rest. Sharpen your tools, reflect on your harvest, and prepare for the cycle to begin anew."
  };

  return NextResponse.json({ 
    wisdom: wisdom[phase as keyof typeof wisdom],
    phase 
  });
}
