import { NextResponse } from "next/server";
import { checkPassword, makeSessionToken, SESSION_COOKIE } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let password = "";
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    password = body.password || "";
  } else {
    const form = await req.formData();
    password = String(form.get("password") || "");
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, makeSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
