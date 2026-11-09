import { newId, updateDb } from "@/lib/db";
import type { Inquiry } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Inquiry>;
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const inquiry: Inquiry = {
      id: newId("msg"),
      name,
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    await updateDb((current) => ({
      ...current,
      inquiries: [inquiry, ...current.inquiries],
    }));

    return Response.json({ inquiry }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
