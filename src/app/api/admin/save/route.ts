import { isAuthorized } from "@/lib/admin-auth";
import { getDb, saveDb } from "@/lib/db";

const allowedSections = [
  "settings",
  "content",
  "classes",
  "events",
  "products",
  "reviews",
  "bookings",
  "orders",
  "inquiries",
] as const;

type Section = (typeof allowedSections)[number];

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { section?: Section; data?: unknown };
    if (!body.section || !allowedSections.includes(body.section)) {
      return Response.json({ error: "Invalid section" }, { status: 400 });
    }
    if (body.data === undefined) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const db = await getDb();
    const next = { ...db, [body.section]: body.data };
    await saveDb(next);
    return Response.json({ db: next });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
