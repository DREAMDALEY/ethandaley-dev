'use client';

import { useEffect } from 'react';

const SITE = 'ethandaley.dev';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wecacgalccnsjjgczyja.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function Analytics() {
  useEffect(() => {
    try {
      if (!SUPABASE_ANON_KEY) return;
      fetch(`${SUPABASE_URL}/rest/v1/site_analytics`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          site: SITE,
          path: window.location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never block render, never throw */
    }
  }, []);

  return null;
}
