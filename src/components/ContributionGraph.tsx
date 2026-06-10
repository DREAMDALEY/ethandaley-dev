"use client";

import { useEffect, useState } from "react";

type Day = {
  date: string;
  weekday: number;
  contributionCount: number;
  color: string;
};
type Week = { contributionDays: Day[] };

type Data = {
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  loc: { additions: number; deletions: number } | null;
  weeks: Week[];
};

const RED = "#C8102E";

// Map a GitHub contribution count to a red-intensity scale (dark theme).
function colorFor(count: number, max: number): string {
  if (count <= 0) return "#161616";
  const t = Math.min(1, count / Math.max(1, max));
  // 4 buckets like GitHub
  if (t > 0.66) return RED;
  if (t > 0.33) return "#8f0c20";
  if (t > 0.1) return "#5c0815";
  return "#33060d";
}

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function ContributionGraph() {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/contributions")
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        if (j.error || !j.weeks) {
          setErr("Could not load live GitHub activity.");
        } else {
          setData(j);
        }
      })
      .catch(() => alive && setErr("Could not load live GitHub activity."));
    return () => {
      alive = false;
    };
  }, []);

  if (err) {
    return (
      <p style={{ opacity: 0.5, fontSize: "0.8rem", margin: 0 }}>{err}</p>
    );
  }
  if (!data) {
    return (
      <p style={{ opacity: 0.5, fontSize: "0.8rem", margin: 0 }}>
        Loading live contributions…
      </p>
    );
  }

  const max = Math.max(
    1,
    ...data.weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount))
  );

  const cell = 12;
  const gap = 3;

  // month labels: find weeks where the month changes on the first day
  const monthLabels: { idx: number; label: string }[] = [];
  let lastMonth = -1;
  data.weeks.forEach((w, i) => {
    const first = w.contributionDays[0];
    if (!first) return;
    const m = new Date(first.date + "T00:00:00").getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ idx: i, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "inline-block", minWidth: "100%" }}>
          {/* month row */}
          <div
            style={{
              position: "relative",
              height: 14,
              marginLeft: 0,
              marginBottom: 2,
            }}
          >
            {monthLabels.map((ml) => (
              <span
                key={`${ml.idx}-${ml.label}`}
                style={{
                  position: "absolute",
                  left: ml.idx * (cell + gap),
                  fontSize: 9,
                  opacity: 0.4,
                  letterSpacing: "0.05em",
                }}
              >
                {ml.label}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap }}>
            {data.weeks.map((w, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap }}>
                {Array.from({ length: 7 }).map((_, di) => {
                  const d = w.contributionDays.find((x) => x.weekday === di);
                  if (!d) {
                    return (
                      <div
                        key={di}
                        style={{ width: cell, height: cell, borderRadius: 2 }}
                      />
                    );
                  }
                  let text = `${fmtDate(d.date)} · ${d.contributionCount} ${
                    d.contributionCount === 1 ? "commit" : "commits"
                  }`;
                  // daily LOC is not reliably available; show commits only — never fabricate
                  return (
                    <div
                      key={di}
                      onMouseEnter={(e) => {
                        const rect = (
                          e.currentTarget.offsetParent as HTMLElement
                        )?.getBoundingClientRect();
                        const cr = e.currentTarget.getBoundingClientRect();
                        setTip({
                          x: cr.left - (rect?.left || 0) + cell / 2,
                          y: cr.top - (rect?.top || 0) - 8,
                          text,
                        });
                      }}
                      onMouseLeave={() => setTip(null)}
                      style={{
                        width: cell,
                        height: cell,
                        borderRadius: 2,
                        background: colorFor(d.contributionCount, max),
                        border: "1px solid rgba(255,255,255,0.03)",
                        cursor: "default",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 8,
              fontSize: 9,
              opacity: 0.45,
              justifyContent: "flex-end",
            }}
          >
            <span>Less</span>
            {["#161616", "#33060d", "#5c0815", "#8f0c20", RED].map((c) => (
              <span
                key={c}
                style={{ width: cell, height: cell, borderRadius: 2, background: c }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {tip && (
        <div
          style={{
            position: "absolute",
            left: tip.x,
            top: tip.y,
            transform: "translate(-50%, -100%)",
            background: "#000",
            border: "1px solid #2a2a2a",
            color: "#efefef",
            fontSize: 11,
            padding: "5px 8px",
            borderRadius: 5,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
          }}
        >
          {tip.text}
        </div>
      )}

      {/* honest summary strip */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          marginTop: "1.1rem",
          fontSize: "0.8rem",
        }}
      >
        <Stat label="Contributions (yr)" value={data.totalContributions.toLocaleString()} />
        <Stat label="Active days" value={data.activeDays.toLocaleString()} />
        <Stat label="Longest streak" value={`${data.longestStreak} d`} />
        {data.loc && (
          <Stat
            label="Lines (yr)"
            value={`+${data.loc.additions.toLocaleString()} / -${data.loc.deletions.toLocaleString()}`}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: RED, fontWeight: 700, fontSize: "1.05rem" }}>{value}</div>
      <div
        style={{
          opacity: 0.45,
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}
