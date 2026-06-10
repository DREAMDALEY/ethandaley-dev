import { getProjects, getProfile } from "@/lib/data";
import ContributionGraph from "@/components/ContributionGraph";

export const dynamic = "force-dynamic";

const RED = "#C8102E";
const GREEN = "#00c850";

const stack: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Swift", "Bash"],
  },
  {
    group: "Frontend",
    items: ["Next.js", "React", "React Native / Expo", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    group: "Backend & Data",
    items: ["Node.js", "Supabase", "PostgreSQL", "Stripe", "Resend", "Electron"],
  },
  {
    group: "Infra & Deploy",
    items: ["Vercel", "Hetzner", "Cloudflare", "Docker", "GitHub Actions"],
  },
  {
    group: "AI & Workflow",
    items: ["Agentic workflows", "Claude / Anthropic API", "OpenAI / gpt-image-1", "Discord.js", "Git"],
  },
];

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const live = s === "live";
  const paused = s === "paused";
  const color = live ? GREEN : paused ? "#999" : RED;
  const bg = live
    ? "rgba(0,200,80,0.1)"
    : paused
    ? "rgba(150,150,150,0.12)"
    : "rgba(200,16,46,0.1)";
  return (
    <span
      style={{
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        padding: "0.2rem 0.55rem",
        borderRadius: 3,
        fontWeight: 700,
        background: bg,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function repoLabel(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("github.com")) return u.pathname.replace(/^\//, "");
    return u.hostname + u.pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

export default async function Home() {
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);

  const storyParas = (profile.story || "").split("\n").filter((p) => p.trim());
  const styleParas = (profile.building_style || "").split("\n").filter((p) => p.trim());

  return (
    <main style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 0" }}>
      <div className="dd-watermark" aria-hidden />
      {/* Top nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
          opacity: 0.8,
        }}
      >
        <a href="https://dreamdaley.ca">← dreamdaley.ca</a>
        <span style={{ color: RED }}>ethandaley.dev</span>
      </nav>

      {/* Hero */}
      <header style={{ marginTop: "3rem", marginBottom: "3.5rem" }}>
        <p style={{ fontSize: "0.8rem", letterSpacing: "0.2em", opacity: 0.55, margin: 0 }}>
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
        <p style={{ maxWidth: 660, lineHeight: 1.75, opacity: 0.92, margin: 0, fontSize: "1rem" }}>
          I learned to build by building — shipping the products my companies needed straight
          into live use. This is the raw view: what I run, the stack I reach for, and live
          GitHub activity.
        </p>
      </header>

      {/* GitHub activity — interactive */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={sectionTitle}>GitHub Activity</h2>
        <div style={card}>
          <p style={subLabel}>Contributions — last year (live)</p>
          <ContributionGraph />
        </div>
      </section>

      {/* Story */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={sectionTitle}>The Story</h2>
        <div style={{ ...card, lineHeight: 1.8 }}>
          {storyParas.map((p, i) => (
            <p
              key={i}
              style={{
                margin: i === 0 ? "0 0 1rem" : "0 0 1rem",
                fontSize: "0.92rem",
                opacity: i === 0 ? 0.96 : 0.88,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Building style */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={sectionTitle}>How I Build</h2>
        <div style={{ ...card, lineHeight: 1.8 }}>
          {styleParas.map((p, i) => {
            const isPoint = p.trim().startsWith("—");
            return (
              <p
                key={i}
                style={{
                  margin: "0 0 0.9rem",
                  fontSize: "0.9rem",
                  opacity: isPoint ? 0.9 : 0.96,
                  borderLeft: isPoint ? `2px solid ${RED}` : "none",
                  paddingLeft: isPoint ? "0.75rem" : 0,
                }}
              >
                {isPoint ? p.replace(/^—\s*/, "") : p}
              </p>
            );
          })}
        </div>
      </section>

      {/* Right now */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={sectionTitle}>Right Now</h2>
        <div style={{ ...card, lineHeight: 1.8 }}>
          <p style={{ margin: "0 0 1rem", fontSize: "0.92rem", opacity: 0.96 }}>
            Two companies, two cities, and a shift in how I spend my time.
          </p>
          {[
            "Scaling TNAADO Labs in Miami — moving from doing every build myself to setting direction and letting senior teams run.",
            "Mentoring the juniors coming up — the same way I learned, by putting them on real work with real stakes.",
            "Going deep on the AI side personally — the Dream model family, and Citadel for secure local-first AI.",
          ].map((t, i) => (
            <p
              key={i}
              style={{
                margin: "0 0 0.9rem",
                fontSize: "0.9rem",
                opacity: 0.9,
                borderLeft: `2px solid ${RED}`,
                paddingLeft: "0.75rem",
              }}
            >
              {t}
            </p>
          ))}
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
            <div key={p.id} style={card}>
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
              <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.6, opacity: 0.86 }}>
                {p.blurb}
              </p>
              {p.url && (
                <a
                  href={p.url}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.85rem",
                    fontSize: "0.75rem",
                    color: RED,
                  }}
                >
                  {repoLabel(p.url)} →
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {s.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.3rem 0.6rem",
                      background: "#0a0a0a",
                      border: "1px solid #1c1c1c",
                      borderRadius: 4,
                      opacity: 0.95,
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
  opacity: 0.7,
  marginBottom: "1.25rem",
  borderBottom: "1px solid #161616",
  paddingBottom: "0.6rem",
};

const card: React.CSSProperties = {
  background: "rgba(12,12,12,0.72)",
  border: "1px solid #161616",
  borderRadius: 8,
  padding: "1.25rem",
  backdropFilter: "blur(2px)",
};

const subLabel: React.CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  opacity: 0.62,
  margin: "0 0 0.9rem",
};
