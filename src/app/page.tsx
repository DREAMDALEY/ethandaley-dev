type Status = "LIVE" | "BUILDING";

type Project = {
  name: string;
  status: Status;
  description: string;
  repo?: string;
  link?: string;
};

const projects: Project[] = [
  {
    name: "Citadel",
    status: "BUILDING",
    description:
      "Secure AI desktop app for local model inference. Custom Dream model substrate, Electron, RAG memory layer.",
  },
  {
    name: "Dream Model",
    status: "BUILDING",
    description:
      "TNAADO Labs' proprietary AI model family. Substrate base training, substrate-modulated adapters.",
  },
  {
    name: "GEB — Gesture Beats",
    status: "BUILDING",
    description:
      "React Native music app. AI-powered gesture recognition for beat creation.",
    repo: "TNAADO-Labs-Inc/geb",
    link: "https://github.com/TNAADO-Labs-Inc/geb",
  },
  {
    name: "Command Central",
    status: "LIVE",
    description:
      "Discord-based ops hub for TNAADO Labs Miami. Auto-recording, event management, team coordination bot.",
  },
  {
    name: "tnaado.com",
    status: "LIVE",
    description:
      "TNAADO Labs company site. Next.js, custom CMS, Supabase backend.",
    repo: "TNAADO-Labs-Inc/tnaado-com",
    link: "https://github.com/TNAADO-Labs-Inc/tnaado-com",
  },
  {
    name: "dreamdaley.ca",
    status: "LIVE",
    description:
      "Personal brand site. Next.js App Router, Framer Motion, Supabase.",
    repo: "DREAMDALEY/dreamdaleysite",
    link: "https://github.com/DREAMDALEY/dreamdaleysite",
  },
  {
    name: "merch.dreamdaley.ca",
    status: "LIVE",
    description:
      "Merch drop site. Next.js, Stripe Checkout, Printful print-on-demand.",
    repo: "DREAMDALEY/merch-dreamdaley",
    link: "https://github.com/DREAMDALEY/merch-dreamdaley",
  },
  {
    name: "photos.tnaado.ca",
    status: "LIVE",
    description:
      "Photography stock store. Watermarked previews, Stripe payments, Supabase storage.",
    repo: "DREAMDALEY/photos.tnaado.ca",
    link: "https://github.com/DREAMDALEY/photos.tnaado.ca",
  },
  {
    name: "Sam The Man",
    status: "BUILDING",
    description: "Realtor personal brand site. Editorial look, no fake stats.",
  },
  {
    name: "Music Rights Clearance",
    status: "LIVE",
    description:
      "Client site for music licensing. Supabase, contact flows, docs.",
    repo: "DREAMDALEY/musicrightsclearance.com",
    link: "https://github.com/DREAMDALEY/musicrightsclearance.com",
  },
  {
    name: "WILDIN",
    status: "LIVE",
    description: "Event/social app site + CRM. Live at wildin.app.",
    repo: "DREAMDALEY/WILDIN-site-crm",
    link: "https://github.com/DREAMDALEY/WILDIN-site-crm",
  },
  {
    name: "Claude Vault",
    status: "BUILDING",
    description:
      "macOS Keychain CLI + SwiftUI app for managing secrets across projects.",
  },
];

const stack: { group: string; items: string[] }[] = [
  {
    group: "Core",
    items: [
      "Next.js",
      "TypeScript",
      "React",
      "Supabase",
      "Tailwind CSS",
      "Vercel",
    ],
  },
  {
    group: "Regular",
    items: [
      "Python",
      "PostgreSQL",
      "Stripe",
      "Node.js",
      "Electron",
      "Expo / React Native",
    ],
  },
  {
    group: "Tools & Services",
    items: [
      "Framer Motion",
      "shadcn/ui",
      "Printful API",
      "Resend",
      "Hetzner",
      "Cloudflare",
    ],
  },
];

const RED = "#C8102E";
const GREEN = "#00c850";

function StatusBadge({ status }: { status: Status }) {
  const live = status === "LIVE";
  return (
    <span
      style={{
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        padding: "0.2rem 0.55rem",
        borderRadius: 3,
        fontWeight: 700,
        background: live ? "rgba(0,200,80,0.1)" : "rgba(200,16,46,0.1)",
        color: live ? GREEN : RED,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "2.5rem 1.5rem 0",
      }}
    >
      {/* Top nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
          opacity: 0.7,
        }}
      >
        <a href="https://dreamdaley.ca">← dreamdaley.ca</a>
        <span style={{ color: RED }}>ethandaley.dev</span>
      </nav>

      {/* Hero */}
      <header style={{ marginTop: "3rem", marginBottom: "3.5rem" }}>
        <p
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            opacity: 0.55,
            margin: 0,
          }}
        >
          Ethan Daley · Dev
        </p>
        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 100px)",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.02em",
            lineHeight: 1,
            margin: "0.75rem 0 1.25rem",
          }}
        >
          What I&apos;m Building
        </h1>
        <p
          style={{
            maxWidth: 640,
            lineHeight: 1.7,
            opacity: 0.8,
            margin: 0,
            fontSize: "0.95rem",
          }}
        >
          Founder first, builder by necessity. I ship the products I run — from
          AI infrastructure to consumer apps. This page is the raw view: stack,
          repos, and live GitHub activity.
        </p>
      </header>

      {/* GitHub activity */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={sectionTitle}>GitHub Activity</h2>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={card}>
            <p style={subLabel}>Contribution Graph</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ghchart.rshah.org/C8102E/DREAMDALEY"
              alt="Ethan Daley GitHub contribution graph"
              style={{ filter: "brightness(0.9) contrast(1.1)", width: "100%" }}
            />
          </div>
          <div style={card}>
            <p style={subLabel}>Stats</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api?username=DREAMDALEY&show_icons=true&theme=dark&bg_color=080808&title_color=EFEFEF&text_color=888&icon_color=C8102E&border_color=222&hide_border=false&rank_icon=github"
              alt="Ethan Daley GitHub stats"
              style={{ filter: "brightness(0.9) contrast(1.1)" }}
            />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={sectionTitle}>Projects</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {projects.map((p) => (
            <div key={p.name} style={card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.6rem",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1rem" }}>{p.name}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                  opacity: 0.7,
                }}
              >
                {p.description}
              </p>
              {p.repo && p.link && (
                <a
                  href={p.link}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.85rem",
                    fontSize: "0.75rem",
                    color: RED,
                  }}
                >
                  {p.repo} →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionTitle}>Stack</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {stack.map((s) => (
            <div key={s.group} style={card}>
              <p style={subLabel}>{s.group}</p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {s.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.3rem 0.6rem",
                      background: "#0a0a0a",
                      border: "1px solid #1c1c1c",
                      borderRadius: 4,
                      opacity: 0.85,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem 0 0.5rem",
          opacity: 0.45,
          fontSize: "0.75rem",
          borderTop: "1px solid #161616",
          marginTop: "2rem",
        }}
      >
        <p style={{ margin: "0 0 0.5rem" }}>
          Ethan Daley · 2026 &nbsp;·&nbsp;{" "}
          <a href="https://github.com/DREAMDALEY" style={{ color: RED }}>
            GitHub →
          </a>
        </p>
        <p style={{ margin: 0 }}>Built by Ethan Daley</p>
      </footer>
    </main>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: "0.85rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  opacity: 0.55,
  marginBottom: "1.25rem",
  borderBottom: "1px solid #161616",
  paddingBottom: "0.6rem",
};

const card: React.CSSProperties = {
  background: "#0c0c0c",
  border: "1px solid #161616",
  borderRadius: 8,
  padding: "1.25rem",
};

const subLabel: React.CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  opacity: 0.45,
  margin: "0 0 0.9rem",
};
