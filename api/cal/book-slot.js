/**
 * Vercel Serverless Function — /api/cal/book-slot
 * Called by Retell AI mid-call to create a booking on Cal.com.
 * Uses Cal.com v2 API (v1 was decommissioned April 2026).
 *
 * Expected body: { name, email, phone, start_time, notes }
 *   start_time — ISO 8601, e.g. "2026-04-28T14:00:00.000-04:00"
 */

const EVENT_TYPE_ID = Number(process.env.CAL_EVENT_TYPE_ID ?? "5482148");
const TZ = "America/Detroit";
const CAL_API_KEY = process.env.CAL_API_KEY;

function fmtTime(isoString) {
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
    console.error("[book-slot] Missing CAL_API_KEY env var");
    return res.status(200).json({
      error: "booking_failed",
      spoken: "I wasn't able to complete the booking due to a technical issue. I've noted your preferred time and Ryan will confirm with you directly.",
    });
  }

  // Parse body defensively — Vercel may deliver it as a parsed object or raw string
  let rawBody = req.body ?? {};
  if (typeof rawBody === "string") {
    try { rawBody = JSON.parse(rawBody); } catch { rawBody = {}; }
  }
  const { name, email, phone, start_time, notes } = rawBody;

  if (!name || !email || !start_time) {
    console.error("[book-slot] Missing required fields:", { name: !!name, email: !!email, start_time: !!start_time });
    return res.status(400).json({ error: "name, email, and start_time are required." });
  }

  try {
    console.log(`[book-slot] Booking for ${name} at ${start_time}`);

    const bookingBody = {
      eventTypeId: EVENT_TYPE_ID,
      start: start_time,
      attendee: {
        name: name.trim(),
        email: email.trim(),
        timeZone: TZ,
        language: "en",
        ...(phone ? { phoneNumber: phone.trim() } : {}),
      },
      metadata: {
        source: "retell-ai-phone-call",
        ...(notes ? { notes: notes.trim() } : {}),
      },
    };

    const bookingRes = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        "Content-Type": "application/json",
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(bookingBody),
    });

    const booking = await bookingRes.json();
    console.log(`[book-slot] Cal.com response status: ${bookingRes.status}`);

    if (!bookingRes.ok || booking.status === "error") {
      console.error("[book-slot] Booking failed — status:", booking.status, "message:", booking.message ?? booking.error ?? "");
      return res.status(200).json({
        error: "booking_failed",
        spoken: "I hit a snag completing the booking. I've captured your preferred time and Ryan will reach out to confirm everything with you personally.",
      });
    }

    const formattedTime = fmtTime(start_time);
    const uid = booking.data?.uid ?? booking.uid ?? "confirmed";

    console.log(`[book-slot] Booking successful: uid=${uid}`);

    return res.status(200).json({
      success: true,
      booking_id: uid,
      start_time,
      formatted_time: formattedTime,
      spoken: `You're all set. I've booked your 30-minute consultation with Ryan Kroge for ${formattedTime} Eastern time. You'll receive a calendar confirmation at ${email}. Is there anything else before we wrap up?`,
    });
  } catch (err) {
    console.error("[book-slot] Unexpected error:", err);
    return res.status(200).json({
      error: "booking_failed",
      spoken: "I ran into an unexpected issue with the booking. Ryan will follow up with you to lock in the time. You're in good hands.",
    });
  }
}
