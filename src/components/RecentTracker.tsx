"use client";

import { useEffect } from "react";
import { useRecents } from "@/lib/hooks/useRecents";

export function RecentTracker({ slug }: { slug: string }) {
  const { trackRecent } = useRecents();

  useEffect(() => {
    trackRecent(slug);
  }, [slug, trackRecent]);

  return null;
}
