import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

const LOGIN = "DREAMDALEY";

type Day = { date: string; weekday: number; contributionCount: number; color: string };
type Week = { contributionDays: Day[] };

const GQL = `
query($login:String!) {
  user(login:$login) {
    contributionsCollection {
      totalCommitContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date weekday contributionCount color } }
      }
      commitContributionsByRepository(maxRepositories:25) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
    }
  }
}`;

function computeStreak(days: Day[]): number {
  let longest = 0;
  let cur = 0;
  for (const d of days) {
    if (d.contributionCount > 0) {
      cur += 1;
      if (cur > longest) longest = cur;
    } else {
      cur = 0;
    }
  }
  return longest;
}

async function fetchLoc(
  token: string,
  repos: { nameWithOwner: string; count: number }[]
): Promise<{ additions: number; deletions: number; ok: boolean }> {
  // Best-effort: use commit-author since=1y, sum per-commit stats on a sampled set.
  // To keep it bounded & honest, we sum code_frequency weekly stats over last ~52 weeks
  // for the top repos. If GitHub returns 202 (computing) we retry once then omit.
  const since = Math.floor(Date.now() / 1000) - 52 * 7 * 24 * 3600;
  let additions = 0;
  let deletions = 0;
  let any = false;

  for (const r of repos.slice(0, 5)) {
    let attempt = 0;
    while (attempt < 2) {
      const res = await fetch(
        `https://api.github.com/repos/${r.nameWithOwner}/stats/code_frequency`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          next: { revalidate: 3600 },
        }
      );
      if (res.status === 202) {
        attempt += 1;
        await new Promise((r2) => setTimeout(r2, 1500));
        continue;
      }
      if (!res.ok) break;
      const weeks = (await res.json()) as number[][]; // [week_ts, additions, deletions]
      if (Array.isArray(weeks)) {
        for (const w of weeks) {
          if (Array.isArray(w) && w[0] >= since) {
            additions += w[1] || 0;
            deletions += Math.abs(w[2] || 0);
            any = true;
          }
        }
      }
      break;
    }
  }
  return { additions, deletions, ok: any };
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "no token" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: GQL, variables: { login: LOGIN } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json(
        { error: `github ${res.status}`, detail: txt.slice(0, 300) },
        { status: 502 }
      );
    }

    const json = await res.json();
    const cc = json?.data?.user?.contributionsCollection;
    if (!cc) {
      return NextResponse.json(
        { error: "no data", detail: json?.errors || null },
        { status: 502 }
      );
    }

    const weeks: Week[] = cc.contributionCalendar.weeks;
    const flatDays: Day[] = weeks.flatMap((w) => w.contributionDays);
    const totalContributions: number = cc.contributionCalendar.totalContributions;
    const activeDays = flatDays.filter((d) => d.contributionCount > 0).length;
    const longestStreak = computeStreak(flatDays);

    const repos = (cc.commitContributionsByRepository || [])
      .map((x: { repository: { nameWithOwner: string }; contributions: { totalCount: number } }) => ({
        nameWithOwner: x.repository.nameWithOwner,
        count: x.contributions.totalCount,
      }))
      .sort((a: { count: number }, b: { count: number }) => b.count - a.count);

    let loc: { additions: number; deletions: number } | null = null;
    try {
      const r = await fetchLoc(token, repos);
      if (r.ok) loc = { additions: r.additions, deletions: r.deletions };
    } catch {
      loc = null;
    }

    return NextResponse.json(
      {
        login: LOGIN,
        totalContributions,
        totalCommitContributions: cc.totalCommitContributions,
        activeDays,
        longestStreak,
        loc, // null if GitHub stats unavailable — we do not fabricate
        weeks,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
