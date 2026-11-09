import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAuthorized } from "@/lib/admin-auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "No file" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Only images are allowed" }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return Response.json({ error: "Image is too large (max 8MB)" }, { status: 400 });
    }

    const extRaw = path.extname(file.name).toLowerCase();
    const ext = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].includes(extRaw)
      ? extRaw
      : ".jpg";
    const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error } = await supabase.storage
        .from("uploads")
        .upload(name, buffer, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("uploads").getPublicUrl(name);
      return Response.json({ url: data.publicUrl }, { status: 201 });
    }

    const folder = path.join(process.cwd(), "public", "uploads");
    await mkdir(folder, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(folder, name), buffer);

    return Response.json({ url: `/uploads/${name}` }, { status: 201 });
  } catch {
    return Response.json({ error: "Upload failed" }, { status: 400 });
  }
}
