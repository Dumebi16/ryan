/**
 * Vercel Serverless Function — /api/debug/cal
 * Diagnostic endpoint — checks env vars and live Cal.com connectivity.
 * Does NOT book anything. Returns JSON safe to read publicly (no secrets exposed).
 */

const EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID ?? "5482148";
const TZ = "America/Detroit";
const CAL_API_KEY = process.env.CAL_API_KEY;

export default async function handler(req, res) {
  const env = {
    CAL_API_KEY: !!CAL_API_KEY,
    CAL_EVENT_TYPE_ID: EVENT_TYPE_ID,
    TWILIO_ACCOUNT_SID: !!process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: !!process.env.TWILIO_AUTH_TOKEN,
    RYAN_PHONE_NUMBER: !!process.env.RYAN_PHONE_NUMBER,
    RETELL_API_KEY: !!process.env.RETELL_API_KEY,
  };

  if (!CAL_API_KEY) {
    return res.status(200).json({ env, cal_status: "MISSING_KEY", slots: [] });
  }

  const start = new Date();
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  try {
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

    if (!calRes.ok || data.status === "error") {
      return res.status(200).json({
        env,
        cal_status: "API_ERROR",
        cal_http_status: calRes.status,
        cal_response: data,
        slots: [],
      });
    }

    const slotsByDay = data.data ?? {};
    const slots = [];
    for (const [day, times] of Object.entries(slotsByDay)) {
      if (!Array.isArray(times)) continue;
      for (const slot of times.slice(0, 2)) {
        slots.push({ day, time: slot.start ?? slot.time });
        if (slots.length >= 6) break;
      }
      if (slots.length >= 6) break;
    }

    return res.status(200).json({
      env,
      cal_status: "OK",
      cal_http_status: calRes.status,
      slot_count: slots.length,
      slots,
    });
  } catch (err) {
    return res.status(200).json({ env, cal_status: "EXCEPTION", error: err.message, slots: [] });
  }
}
