import { NextResponse } from "next/server";
import {
  isAuthed,
  svcCreateProject,
  svcUpdateProject,
  svcDeleteProject,
} from "@/lib/admin";

export const runtime = "nodejs";

function guard() {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request) {
  const g = guard();
  if (g) return g;
  const b = await req.json().catch(() => ({}));
  try {
    const row = await svcCreateProject({
      name: b.name,
      blurb: b.blurb,
      status: b.status || "building",
      url: b.url || null,
      sort_order: Number(b.sort_order) || 0,
      visible: b.visible !== false,
    });
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const g = guard();
  if (g) return g;
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  for (const k of ["name", "blurb", "status", "url", "sort_order", "visible"]) {
    if (k in b) patch[k] = k === "sort_order" ? Number(b[k]) : b[k];
  }
  try {
    const row = await svcUpdateProject(b.id, patch);
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = guard();
  if (g) return g;
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  try {
    await svcDeleteProject(b.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
