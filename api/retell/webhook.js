/**
 * Vercel Serverless Function — /api/retell/webhook
 * Receives Retell post-call events and triggers:
 *   1. SMS to caller — thank you + booking confirmation or cal link
 *   2. SMS to Ryan  — new lead summary
 */

const FROM_NUMBER = process.env.RETELL_PHONE_NUMBER_ID ?? "+19472181845";
const RYAN_PHONE  = process.env.RYAN_PHONE_NUMBER ?? "+12483150963";
const CAL_LINK    = `https://cal.com/${process.env.CAL_USERNAME ?? "ryan-kroge-nsvqdg"}`;

async function sendSMS(accountSid, authToken, to, body) {
  const resp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: FROM_NUMBER, Body: body }).toString(),
    }
  );
  const data = await resp.json();
  if (!resp.ok) console.error("[webhook] SMS send failed — status:", data.status, "code:", data.code ?? "");
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.error("Missing Twilio env vars");
    return res.status(200).json({ ok: true }); // still 200 so Retell doesn't retry
  }

  const event = req.body ?? {};

  // Only act on call_ended events
  if (event.event !== "call_ended") return res.status(200).json({ ok: true });

  const call          = event.call ?? {};
  const callerPhone   = call.from_number;
  const dynVars       = call.retell_llm_dynamic_variables ?? {};
  const callerName    = dynVars.caller_name?.trim() ?? "";
  const analysis      = call.call_analysis ?? {};
  const summary       = analysis.call_summary ?? "No summary available.";
  const booked        = analysis.custom_analysis_data?.appointment_booked ?? false;
  const bookingTime   = analysis.custom_analysis_data?.appointment_time ?? "";

  const promises = [];

  // ── SMS to caller ──────────────────────────────────────────────────────────
  if (callerPhone) {
    const greeting = callerName ? `Hi ${callerName}!` : "Hi there!";
    const callerMsg = booked
      ? `${greeting} Your consultation with Ryan Kroge is confirmed${bookingTime ? ` for ${bookingTime}` : ""}. Check your email for the calendar invite. Questions? Call or text (947) 218-1845.`
      : `${greeting} Thanks for calling Ryan Kroge SBA Loans. Ready to take the next step? Book a free 30-min consultation: ${CAL_LINK}. Questions? (947) 218-1845.`;

    promises.push(sendSMS(accountSid, authToken, callerPhone, callerMsg));
  }

  // ── SMS to Ryan ────────────────────────────────────────────────────────────
  const ryanMsg = [
    `📞 New call from ${callerPhone}${callerName ? ` — ${callerName}` : ""}.`,
    `Booked: ${booked ? `✅ YES${bookingTime ? ` (${bookingTime})` : ""}` : "❌ No"}`,
    `Summary: ${summary.slice(0, 140)}`,
  ].join("\n");

  promises.push(sendSMS(accountSid, authToken, RYAN_PHONE, ryanMsg));

  await Promise.allSettled(promises);

  return res.status(200).json({ ok: true });
}
