import { isAuthorized } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  return Response.json({ db });
}
