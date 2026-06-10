// SERVER-ONLY. Uses service role key. Never import into client components.
import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";
const ADMIN_PASS = process.env.ADMIN_PASS || "";

export const SESSION_COOKIE = "ed_admin";

function secret() {
  return ADMIN_PASS + "::ethandaley-dev-session";
}

export function makeSessionToken(): string {
  // value tied to ADMIN_PASS; changes if password changes
  return createHmac("sha256", secret()).update("authed").digest("hex");
}

export function checkPassword(input: string): boolean {
  if (!ADMIN_PASS) return false;
  const a = Buffer.from(input || "");
  const b = Buffer.from(ADMIN_PASS);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAuthed(): boolean {
  const c = cookies().get(SESSION_COOKIE)?.value;
  if (!c) return false;
  const expected = makeSessionToken();
  const a = Buffer.from(c);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function svcHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function svcGetAllProjects() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/dev_projects?order=sort_order.asc`,
    { headers: svcHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`projects fetch ${res.status}`);
  return res.json();
}

export async function svcGetProfile() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/dev_profile?id=eq.1`, {
    headers: svcHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`profile fetch ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

export async function svcCreateProject(body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/dev_projects`, {
    method: "POST",
    headers: svcHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`create ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function svcUpdateProject(id: string, body: Record<string, unknown>) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/dev_projects?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: svcHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`update ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function svcDeleteProject(id: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/dev_projects?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE", headers: svcHeaders() }
  );
  if (!res.ok) throw new Error(`delete ${res.status}: ${await res.text()}`);
}

export async function svcUpsertProfile(building_style: string, story: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/dev_profile?id=eq.1`, {
    method: "PATCH",
    headers: svcHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify({ building_style, story, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`profile update ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  if (!Array.isArray(rows) || !rows.length) {
    // row didn't exist — insert
    const ins = await fetch(`${SUPABASE_URL}/rest/v1/dev_profile`, {
      method: "POST",
      headers: svcHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify({ id: 1, building_style, story }),
    });
    if (!ins.ok) throw new Error(`profile insert ${ins.status}`);
    return ins.json();
  }
  return rows;
}
