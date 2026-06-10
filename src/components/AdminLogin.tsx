"use client";

import { useState } from "react";

const RED = "#C8102E";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setErr("Invalid password.");
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "rgba(12,12,12,0.85)",
          border: "1px solid #1c1c1c",
          borderRadius: 10,
          padding: "2rem",
          backdropFilter: "blur(3px)",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.5,
            margin: "0 0 0.5rem",
          }}
        >
          ethandaley.dev
        </p>
        <h1 style={{ fontSize: "1.4rem", margin: "0 0 1.5rem", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
          Admin
        </h1>
        <input
          type="password"
          value={pw}
          autoFocus
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "0.7rem 0.85rem",
            background: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: 6,
            color: "#efefef",
            fontSize: "0.9rem",
            fontFamily: "inherit",
          }}
        />
        {err && <p style={{ color: RED, fontSize: "0.8rem", marginTop: "0.75rem" }}>{err}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.7rem",
            background: RED,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            letterSpacing: "0.05em",
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.6 : 1,
            fontFamily: "inherit",
          }}
        >
          {busy ? "…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
