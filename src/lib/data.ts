// Server-side data helpers. ANON key for public reads, SERVICE ROLE only in server routes.

export type DevProject = {
  id: string;
  name: string;
  blurb: string;
  status: "live" | "building" | "paused";
  url: string | null;
  sort_order: number;
  visible: boolean;
  created_at?: string;
};

export type DevProfile = {
  id: number;
  building_style: string | null;
  story: string | null;
  updated_at?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const FALLBACK_PROJECTS: DevProject[] = [
  { id: "f1", name: "Citadel", blurb: "Secure AI desktop app for local model inference. Custom Dream model substrate, Electron, RAG memory layer.", status: "building", url: null, sort_order: 10, visible: true },
  { id: "f2", name: "Dream Model", blurb: "TNAADO Labs' proprietary AI model family. Substrate base training, substrate-modulated adapters.", status: "building", url: null, sort_order: 20, visible: true },
  { id: "f3", name: "GEB — Gesture Beats", blurb: "React Native music app. AI-powered gesture recognition for beat creation.", status: "building", url: "https://github.com/TNAADO-Labs-Inc/geb", sort_order: 30, visible: true },
  { id: "f4", name: "tnaado.com", blurb: "TNAADO Labs company site. Next.js, custom CMS, Supabase backend.", status: "live", url: "https://github.com/TNAADO-Labs-Inc/tnaado-com", sort_order: 50, visible: true },
];

export const FALLBACK_PROFILE: DevProfile = {
  id: 1,
  building_style:
    "I build the way a founder has to: fast, end to end, and in public. Ship over plan, own the whole stack, lean on agentic workflows, and let taste be the moat.",
  story:
    "I'm Ethan Daley — founder first, builder by necessity. I run TNAADO Inc. (Toronto) and TNAADO Labs (Miami), and I learned to build because the products I needed didn't exist yet.",
};

export async function getProjects(): Promise<DevProject[]> {
  try {
    if (!SUPABASE_URL || !ANON) return FALLBACK_PROJECTS;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/dev_projects?visible=eq.true&order=sort_order.asc`,
      {
        headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return FALLBACK_PROJECTS;
    const data = (await res.json()) as DevProject[];
    return Array.isArray(data) && data.length ? data : FALLBACK_PROJECTS;
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function getProfile(): Promise<DevProfile> {
  try {
    if (!SUPABASE_URL || !ANON) return FALLBACK_PROFILE;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/dev_profile?id=eq.1`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK_PROFILE;
    const data = (await res.json()) as DevProfile[];
    const row = Array.isArray(data) && data.length ? data[0] : null;
    if (!row) return FALLBACK_PROFILE;
    return {
      id: row.id,
      building_style: row.building_style || FALLBACK_PROFILE.building_style,
      story: row.story || FALLBACK_PROFILE.story,
    };
  } catch {
    return FALLBACK_PROFILE;
  }
}
