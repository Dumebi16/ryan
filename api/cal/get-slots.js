/**
 * Vercel Serverless Function — /api/cal/get-slots
 * Called by Retell AI mid-call to check Ryan's real-time availability.
 * Uses Cal.com v2 API (v1 was decommissioned April 2026).
 */

const EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID ?? "5482148";
const TZ = "America/Detroit";
const CAL_API_KEY = process.env.CAL_API_KEY;

function fmtSlot(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!CAL_API_KEY) {
    console.error("[get-slots] Missing CAL_API_KEY env var");
    return res.status(500).json({
      error: "calendar_unavailable",
      spoken: "I'm having trouble accessing the calendar right now. Let me take your contact info instead and have Ryan follow up with you directly.",
    });
  }

  // Look ahead 7 days from now
  const start = new Date();
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  try {
    console.log(`[get-slots] Requesting slots: ${start.toISOString()} → ${end.toISOString()}`);

    const params = new URLSearchParams({
      eventTypeId: EVENT_TYPE_ID,
      start: start.toISOString(),
      end: end.toISOString(),
      timeZone: TZ,
    });

    const calRes = await fetch(`https://api.cal.com/v2/slots?${params}`, {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        "cal-api-version": "2024-09-04",
      },
    });

    const data = await calRes.json();
    console.log(`[get-slots] Cal.com response status: ${calRes.status}`);

    if (!calRes.ok || data.status === "error") {
      console.error("[get-slots] Cal.com error:", JSON.stringify(data));
      return res.status(200).json({
        error: "calendar_unavailable",
        spoken: "I'm having trouble pulling up Ryan's live calendar right now. Let me get your contact details and he'll reach out to confirm a time with you directly.",
      });
    }

    // v2 response: data.data["2026-04-28"] = [{start: "2026-04-28T09:00:00.000-04:00"}, ...]
    const slotsByDay = data.data ?? {};
    const available = [];

    for (const [day, times] of Object.entries(slotsByDay)) {
      if (!Array.isArray(times)) continue;
      for (const slot of times.slice(0, 3)) {
        const isoTime = slot.start ?? slot.time;
        if (!isoTime) continue;
        available.push({ date: day, time: isoTime, formatted: fmtSlot(isoTime) });
        if (available.length >= 6) break;
      }
      if (available.length >= 6) break;
    }

    console.log(`[get-slots] Found ${available.length} available slots`);

    if (available.length === 0) {
      return res.status(200).json({
        available_slots: [],
        count: 0,
        spoken: "It looks like Ryan's calendar is fully booked for the next week. Let me take your name and number so he can reach out to find a time that works.",
      });
    }

    const readBack = available.slice(0, 3).map((s) => s.formatted).join("; ");

    return res.status(200).json({
      available_slots: available,
      count: available.length,
      spoken: `I have a few openings for you. ${readBack}. Which of those works best for you?`,
    });
  } catch (err) {
    console.error("[get-slots] Unexpected error:", err);
    return res.status(200).json({
      error: "calendar_unavailable",
      spoken: "I'm running into a technical issue with the calendar. No problem — let me collect your details and Ryan will follow up to schedule a time.",
    });
  }
}
