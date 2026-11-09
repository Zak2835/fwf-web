export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const expected = process.env.ADMIN_PASSWORD ?? "fwf2026";
    if (!body.password || body.password !== expected) {
      return Response.json({ ok: false }, { status: 401 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
