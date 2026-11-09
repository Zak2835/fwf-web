import { getDb, newId, updateDb } from "@/lib/db";
import type { Booking } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Booking>;
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const classId = String(body.classId ?? "").trim();

    if (!name || !phone || !classId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const gymClass = db.classes.find((item) => item.id === classId);
    if (!gymClass) {
      return Response.json({ error: "Class not found" }, { status: 404 });
    }

    const booking: Booking = {
      id: newId("bk"),
      name,
      phone,
      email: String(body.email ?? "").trim(),
      classId,
      className: String(body.className ?? gymClass.name_en),
      date: String(body.date ?? ""),
      time: String(body.time ?? gymClass.time),
      notes: String(body.notes ?? "").trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await updateDb((current) => ({
      ...current,
      bookings: [booking, ...current.bookings],
    }));

    return Response.json({ booking }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
