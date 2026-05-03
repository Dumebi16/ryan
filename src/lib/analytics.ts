import { supabase } from "./supabase";

function getSessionId(): string {
  let id = sessionStorage.getItem("rk_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("rk_session", id);
  }
  return id;
}

export function hasTracked(key: string): boolean {
  return !!sessionStorage.getItem(`rk_t_${key}`);
}

export function markTracked(key: string): void {
  sessionStorage.setItem(`rk_t_${key}`, "1");
}

export async function trackEvent(
  eventType: "post_view" | "post_read" | "cta_click",
  post: { id: string; slug: string; category?: string | null },
  extras?: { time_on_page?: number }
): Promise<void> {
  try {
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      post_id: post.id,
      post_slug: post.slug,
      category: post.category ?? null,
      session_id: getSessionId(),
      referrer: document.referrer || null,
      time_on_page: extras?.time_on_page ?? null,
    });
  } catch {
    // Tracking failures are silent — never break the reader experience
  }
}
