export async function GET() {
  return Response.json({
    DEEPSEEK: process.env.DEEPSEEK_API_KEY ? 'SET' : 'MISSING',
    OPENAI: process.env.OPENAI_API_KEY ? 'SET' : 'MISSING',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV
  });
}
