export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 5000))
  return Response.json({ data: 'test' })
}
