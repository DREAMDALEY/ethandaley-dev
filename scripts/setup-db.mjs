import pg from "pg";
const { Client } = pg;

const password = process.env.DBPASS;
if (!password) {
  console.error("Missing DBPASS env var");
  process.exit(1);
}

const candidates = [
  {
    label: "session pooler",
    config: {
      host: "aws-0-ca-central-1.pooler.supabase.com",
      port: 5432,
      database: "postgres",
      user: "postgres.wecacgalccnsjjgczyja",
      password,
      ssl: { rejectUnauthorized: false },
    },
  },
  {
    label: "direct host",
    config: {
      host: "db.wecacgalccnsjjgczyja.supabase.co",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password,
      ssl: { rejectUnauthorized: false },
    },
  },
];

const DDL = `
create table if not exists dev_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blurb text not null,
  status text not null default 'building' check (status in ('live','building','paused')),
  url text,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz default now()
);
create table if not exists dev_profile (
  id int primary key default 1,
  building_style text,
  story text,
  updated_at timestamptz default now()
);
alter table dev_projects enable row level security;
alter table dev_profile enable row level security;
drop policy if exists dev_projects_read on dev_projects;
create policy dev_projects_read on dev_projects for select to anon, authenticated using (visible = true);
drop policy if exists dev_profile_read on dev_profile;
create policy dev_profile_read on dev_profile for select to anon, authenticated using (true);
`;

const projects = [
  { name: "Citadel", blurb: "Secure AI desktop app for local model inference. Custom Dream model substrate, Electron, RAG memory layer.", status: "building", url: null, sort_order: 10 },
  { name: "Dream Model", blurb: "TNAADO Labs' proprietary AI model family. Substrate base training, substrate-modulated adapters.", status: "building", url: null, sort_order: 20 },
  { name: "GEB — Gesture Beats", blurb: "React Native music app. AI-powered gesture recognition for beat creation.", status: "building", url: "https://github.com/TNAADO-Labs-Inc/geb", sort_order: 30 },
  { name: "Command Central", blurb: "Discord-based ops hub for TNAADO Labs Miami. Auto-recording, event management, team coordination bot.", status: "live", url: null, sort_order: 40 },
  { name: "tnaado.com", blurb: "TNAADO Labs company site. Next.js, custom CMS, Supabase backend.", status: "live", url: "https://github.com/TNAADO-Labs-Inc/tnaado-com", sort_order: 50 },
  { name: "dreamdaley.ca", blurb: "Personal brand site. Next.js App Router, Framer Motion, Supabase.", status: "live", url: "https://github.com/DREAMDALEY/dreamdaleysite", sort_order: 60 },
  { name: "merch.dreamdaley.ca", blurb: "Merch drop site. Next.js, Stripe Checkout, Printful print-on-demand.", status: "live", url: "https://github.com/DREAMDALEY/merch-dreamdaley", sort_order: 70 },
  { name: "photos.tnaado.ca", blurb: "Photography stock store. Watermarked previews, Stripe payments, Supabase storage.", status: "live", url: "https://github.com/DREAMDALEY/photos.tnaado.ca", sort_order: 80 },
  { name: "Sam The Man", blurb: "Realtor personal brand site. Editorial look, no fake stats.", status: "building", url: null, sort_order: 90 },
  { name: "WILDIN", blurb: "Event/social app site + CRM. Live at wildin.app.", status: "live", url: "https://github.com/DREAMDALEY/WILDIN-site-crm", sort_order: 100 },
  { name: "Claude Vault", blurb: "macOS Keychain CLI + SwiftUI app for managing secrets across projects.", status: "building", url: null, sort_order: 110 },
];

const BUILDING_STYLE = `I build the way a founder has to: fast, end to end, and in public.

— Ship over plan. I'd rather have something live and ugly today than perfect and theoretical next month. Real feedback only comes from real users hitting a real URL.

— One person, whole stack. Design, database, API, deploy — I own the entire path. No handoffs, no "that's someone else's layer." If it breaks at 2am, I'm the one fixing it.

— A default stack I trust. Next.js + TypeScript on the front, Supabase (Postgres + auth + storage) for data, Vercel for deploy. It's boring on purpose — boring means I move fast instead of fighting tooling.

— AI-assisted and agentic by default. I lean hard on agentic workflows to scaffold, refactor, and debug. The leverage isn't writing every line myself; it's directing the work and keeping taste and judgment in the loop.

— Iterate in the open. Versions ship, get used, get torn down, ship again. The process is the product as much as the thing itself.

— Taste is the moat. Tools are commodities now. What's left that matters is knowing what to build, what to cut, and what "good" feels like.`;

const STORY = `I'm Ethan Daley — founder first, builder by necessity.

I run TNAADO Inc. out of Toronto and TNAADO Labs out of Miami. I didn't learn to build from a curriculum; I learned because the products I needed for my own companies didn't exist yet, and waiting on someone else to make them was never an option.

So I started shipping. AI infrastructure for the Labs side, consumer apps, internal ops tooling, client work, brand sites — whatever the business actually needed, I built and put live. Every project on this page is something I run or shipped, not a toy or a tutorial.

Being an operator first changes how I write code. I'm not optimizing for elegance in a vacuum — I'm optimizing for something that works, ships, and earns its place. This site is the raw view of that: what I'm building right now, the stack I reach for, and live GitHub activity, no varnish.`;

async function run() {
  let lastErr;
  for (const c of candidates) {
    const client = new Client(c.config);
    try {
      await client.connect();
      console.log(`Connected via ${c.label}`);
      await client.query(DDL);
      console.log("DDL applied.");

      const { rows } = await client.query("select count(*)::int as n from dev_projects");
      if (rows[0].n === 0) {
        for (const p of projects) {
          await client.query(
            `insert into dev_projects (name, blurb, status, url, sort_order, visible)
             values ($1,$2,$3,$4,$5,true)`,
            [p.name, p.blurb, p.status, p.url, p.sort_order]
          );
        }
        console.log(`Seeded ${projects.length} projects.`);
      } else {
        console.log(`dev_projects already has ${rows[0].n} rows; skipped seed.`);
      }

      await client.query(
        `insert into dev_profile (id, building_style, story, updated_at)
         values (1, $1, $2, now())
         on conflict (id) do update set
           building_style = coalesce(dev_profile.building_style, excluded.building_style),
           story = coalesce(dev_profile.story, excluded.story)`,
        [BUILDING_STYLE, STORY]
      );
      // Ensure first run fills empties even if row existed blank
      await client.query(
        `update dev_profile set building_style = $1, story = $2
         where id = 1 and (building_style is null or story is null)`,
        [BUILDING_STYLE, STORY]
      );
      console.log("Seeded dev_profile (id=1).");

      const pj = await client.query("select count(*)::int n from dev_projects");
      const pf = await client.query("select id, length(building_style) bs, length(story) st from dev_profile");
      console.log("Verify projects:", pj.rows[0].n, "profile:", pf.rows);

      await client.end();
      console.log(`DONE via ${c.label}`);
      return;
    } catch (e) {
      lastErr = e;
      console.error(`Failed via ${c.label}: ${e.message}`);
      try { await client.end(); } catch {}
    }
  }
  console.error("All connection attempts failed.");
  throw lastErr;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
