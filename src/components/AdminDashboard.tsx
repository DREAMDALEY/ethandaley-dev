"use client";

import { useState } from "react";

const RED = "#C8102E";

type Project = {
  id: string;
  name: string;
  blurb: string;
  status: string;
  url: string | null;
  sort_order: number;
  visible: boolean;
};

type Profile = { id: number; building_style: string | null; story: string | null };

const emptyDraft = {
  name: "",
  blurb: "",
  status: "building",
  url: "",
  sort_order: 0,
  visible: true,
};

export default function AdminDashboard({
  initialProjects,
  initialProfile,
}: {
  initialProjects: Project[];
  initialProfile: Profile;
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [msg, setMsg] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  }

  async function refresh() {
    // reload from server (server component re-fetch)
    window.location.reload();
  }

  async function createProject() {
    if (!draft.name || !draft.blurb) {
      flash("Name + blurb required");
      return;
    }
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      setDraft({ ...emptyDraft });
      flash("Created");
      refresh();
    } else flash("Create failed");
  }

  async function patchProject(id: string, patch: Partial<Project>) {
    const res = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
      flash("Saved");
    } else flash("Save failed");
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProjects((ps) => ps.filter((p) => p.id !== id));
      flash("Deleted");
    } else flash("Delete failed");
  }

  async function saveProfile() {
    setSavingProfile(true);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        building_style: profile.building_style || "",
        story: profile.story || "",
      }),
    });
    setSavingProfile(false);
    flash(res.ok ? "Profile saved" : "Profile save failed");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", margin: 0, letterSpacing: "0.04em" }}>
          Admin
        </h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {msg && <span style={{ fontSize: "0.8rem", color: RED }}>{msg}</span>}
          <a href="/" style={{ fontSize: "0.8rem", opacity: 0.6 }}>
            ← site
          </a>
          <button onClick={logout} style={ghostBtn}>
            Log out
          </button>
        </div>
      </div>

      {/* Profile editor */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={h2}>Profile content</h2>
        <div style={card}>
          <label style={label}>The Story</label>
          <textarea
            value={profile.story || ""}
            onChange={(e) => setProfile({ ...profile, story: e.target.value })}
            rows={8}
            style={textarea}
          />
          <label style={{ ...label, marginTop: "1rem" }}>How I Build</label>
          <textarea
            value={profile.building_style || ""}
            onChange={(e) => setProfile({ ...profile, building_style: e.target.value })}
            rows={10}
            style={textarea}
          />
          <p style={{ fontSize: "0.7rem", opacity: 0.4, margin: "0.5rem 0 0" }}>
            Tip: lines starting with “—” render as bullet points on the site.
          </p>
          <button onClick={saveProfile} disabled={savingProfile} style={primaryBtn}>
            {savingProfile ? "Saving…" : "Save profile"}
          </button>
        </div>
      </section>

      {/* New project */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={h2}>Add project</h2>
        <div style={card}>
          <div style={grid2}>
            <Field label="Name">
              <input style={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                style={input}
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Blurb">
            <textarea style={textarea} rows={2} value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} />
          </Field>
          <div style={grid2}>
            <Field label="Status">
              <select style={input} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                <option value="building">building</option>
                <option value="live">live</option>
                <option value="paused">paused</option>
              </select>
            </Field>
            <Field label="URL (optional)">
              <input style={input} value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
            </Field>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            <input type="checkbox" checked={draft.visible} onChange={(e) => setDraft({ ...draft, visible: e.target.checked })} />
            Visible
          </label>
          <button onClick={createProject} style={primaryBtn}>
            Add project
          </button>
        </div>
      </section>

      {/* Project list */}
      <section>
        <h2 style={h2}>Projects ({projects.length})</h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {projects.map((p) => (
            <ProjectRow key={p.id} p={p} onPatch={patchProject} onDelete={deleteProject} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProjectRow({
  p,
  onPatch,
  onDelete,
}: {
  p: Project;
  onPatch: (id: string, patch: Partial<Project>) => void;
  onDelete: (id: string) => void;
}) {
  const [edit, setEdit] = useState(p);

  return (
    <div style={card}>
      <div style={grid2}>
        <Field label="Name">
          <input style={input} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            style={input}
            value={edit.sort_order}
            onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })}
          />
        </Field>
      </div>
      <Field label="Blurb">
        <textarea style={textarea} rows={2} value={edit.blurb} onChange={(e) => setEdit({ ...edit, blurb: e.target.value })} />
      </Field>
      <div style={grid2}>
        <Field label="Status">
          <select style={input} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
            <option value="building">building</option>
            <option value="live">live</option>
            <option value="paused">paused</option>
          </select>
        </Field>
        <Field label="URL">
          <input style={input} value={edit.url || ""} onChange={(e) => setEdit({ ...edit, url: e.target.value })} />
        </Field>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
          <input
            type="checkbox"
            checked={edit.visible}
            onChange={(e) => {
              const v = e.target.checked;
              setEdit({ ...edit, visible: v });
              onPatch(p.id, { visible: v });
            }}
          />
          Visible
        </label>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button
            style={primaryBtnSm}
            onClick={() =>
              onPatch(p.id, {
                name: edit.name,
                blurb: edit.blurb,
                status: edit.status,
                url: edit.url,
                sort_order: edit.sort_order,
              })
            }
          >
            Save
          </button>
          <button style={dangerBtn} onClick={() => onDelete(p.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label: l, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <label style={label}>{l}</label>
      {children}
    </div>
  );
}

const h2: React.CSSProperties = {
  fontSize: "0.8rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  opacity: 0.55,
  marginBottom: "1rem",
};
const card: React.CSSProperties = {
  background: "rgba(12,12,12,0.8)",
  border: "1px solid #1c1c1c",
  borderRadius: 8,
  padding: "1.25rem",
};
const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.75rem",
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.65rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: "0.35rem",
};
const input: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.7rem",
  background: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: 6,
  color: "#efefef",
  fontSize: "0.85rem",
  fontFamily: "inherit",
};
const textarea: React.CSSProperties = { ...input, resize: "vertical", lineHeight: 1.6 };
const primaryBtn: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.6rem 1.2rem",
  background: RED,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
const primaryBtnSm: React.CSSProperties = { ...primaryBtn, marginTop: 0, padding: "0.45rem 1rem", fontSize: "0.8rem" };
const dangerBtn: React.CSSProperties = {
  ...primaryBtnSm,
  background: "transparent",
  border: "1px solid #3a1015",
  color: "#c8506a",
};
const ghostBtn: React.CSSProperties = {
  padding: "0.45rem 0.9rem",
  background: "transparent",
  border: "1px solid #2a2a2a",
  borderRadius: 6,
  color: "#efefef",
  fontSize: "0.8rem",
  cursor: "pointer",
  fontFamily: "inherit",
};
