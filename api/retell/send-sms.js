/**
 * Vercel Serverless Function — /api/retell/send-sms
 * Called by Retell AI mid-call to send SMS via Twilio.
 *
 * Expected body: { to, message }
 *   to      — E.164 phone number of recipient
 *   message — SMS body text
 */

const FROM_NUMBER = process.env.RETELL_PHONE_NUMBER_ID ?? "+19472181845";
const RYAN_PHONE  = process.env.RYAN_PHONE_NUMBER    ?? "+12483150963";
const CAL_LINK    = `https://cal.com/${process.env.CAL_USERNAME ?? "ryan-kroge-nsvqdg"}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.error("[send-sms] Missing Twilio credentials");
    return res.status(200).json({ error: "sms_failed", spoken: "I wasn't able to send the text, but your booking is confirmed." });
  }

  let body = req.body ?? {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { to, message, name, appointment_time, caller_phone } = body;

  const sendSMS = async (toNumber, text) => {
    const resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: toNumber, From: FROM_NUMBER, Body: text }).toString(),
      }
    );
    const data = await resp.json();
    if (!resp.ok) console.error("[send-sms] Twilio error:", data.message ?? data.code);
    return resp.ok;
  };

  try {
    const results = [];

    // SMS to caller
    const callerTo = to ?? caller_phone;
    if (callerTo) {
      const callerMsg = message ?? `Your consultation with Ryan is confirmed${appointment_time ? ` for ${appointment_time}` : ""}.\n\nNeed to reschedule? ${CAL_LINK}\n\n— Ryan Kroge SBA Loans`;
      const ok = await sendSMS(callerTo, callerMsg);
      results.push({ to: "caller", sent: ok });
      console.log(`[send-sms] Caller SMS to ${callerTo}: ${ok ? "sent" : "failed"}`);
    }

    // Internal SMS to Ryan
    if (name || appointment_time || caller_phone) {
      const ryanMsg = [
        `New booking:`,
        name            ? `Name: ${name}`          : null,
        appointment_time ? `Time: ${appointment_time}` : null,
        caller_phone    ? `Phone: ${caller_phone}`  : null,
      ].filter(Boolean).join("\n");
      const ok = await sendSMS(RYAN_PHONE, ryanMsg);
      results.push({ to: "ryan", sent: ok });
      console.log(`[send-sms] Ryan SMS: ${ok ? "sent" : "failed"}`);
    }

    return res.status(200).json({
      success: true,
      results,
      spoken: "You're all set. I just sent you a confirmation text with the details.",
    });
  } catch (err) {
    console.error("[send-sms] Unexpected error:", err);
    return res.status(200).json({
      error: "sms_failed",
      spoken: "Your booking is confirmed. I had a small issue sending the text, but Ryan will follow up with you.",
    });
  }
}
