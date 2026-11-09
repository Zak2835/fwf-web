import { getDb, newId, updateDb } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Order>;
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const itemsInput = Array.isArray(body.items) ? body.items : [];

    if (!name || !phone || itemsInput.length === 0) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const items: OrderItem[] = itemsInput
      .map((item) => {
        const product = db.products.find((entry) => entry.id === item.productId);
        if (!product) return null;
        const qty = Math.max(1, Math.min(99, Number(item.qty) || 1));
        return {
          productId: product.id,
          name: product.name_en,
          price: product.price,
          qty,
        };
      })
      .filter((item): item is OrderItem => Boolean(item));

    if (items.length === 0) {
      return Response.json({ error: "No valid products" }, { status: 400 });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order: Order = {
      id: newId("ord"),
      name,
      phone,
      email: String(body.email ?? "").trim(),
      address: String(body.address ?? "").trim(),
      notes: String(body.notes ?? "").trim(),
      items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await updateDb((current) => ({
      ...current,
      orders: [order, ...current.orders],
    }));

    return Response.json({ order }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
