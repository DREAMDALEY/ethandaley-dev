import { NextResponse } from "next/server";
import { isAuthed, svcUpsertProfile } from "@/lib/admin";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const b = await req.json().catch(() => ({}));
  try {
    const row = await svcUpsertProfile(String(b.building_style || ""), String(b.story || ""));
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
