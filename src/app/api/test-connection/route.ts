export async function GET() {
  return Response.json({ status: 'working', time: new Date().toISOString() });
}
