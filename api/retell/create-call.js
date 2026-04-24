/**
 * Vercel Serverless Function — /api/retell/create-call
 *
 * Triggers an outbound AI phone call via Retell AI.
 * API keys live here (server-side only) — never exposed to the browser.
 *
 * Required environment variables (set in Vercel dashboard or .env.local):
 *   RETELL_API_KEY          — your Retell secret key
 *   RETELL_AGENT_ID         — the agent ID configured in Retell dashboard
 *   RETELL_PHONE_NUMBER_ID  — the from-number (+19472181845)
 */

// Normalize any common phone format to E.164 (+1XXXXXXXXXX for US numbers)
function toE164(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, reason } = req.body ?? {};

  // ── Validate inputs ─────────────────────────────────────────────────────────
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please provide your name." });
  }

  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ error: "Please provide a phone number." });
  }

  const toNumber = toE164(phone.trim());
  if (!toNumber) {
    return res
      .status(400)
      .json({ error: "Please enter a valid US phone number." });
  }

  // ── Guard: API keys must be configured ──────────────────────────────────────
  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.RETELL_AGENT_ID ?? "agent_566f6a7cf6c15e0b8511679c38";
  const fromNumber = process.env.RETELL_PHONE_NUMBER_ID ?? "+19472181845";

  if (!apiKey) {
    console.error("Missing RETELL_API_KEY or RETELL_AGENT_ID env vars");
    return res
      .status(500)
      .json({ error: "Service not configured. Please contact us directly." });
  }

  // ── Call Retell API ──────────────────────────────────────────────────────────
  try {
    const retellRes = await fetch(
      "https://api.retellai.com/v2/create-phone-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_number: fromNumber,
          to_number: toNumber,
          override_agent_id: agentId,
          // Pass caller context to the agent so it greets by name
          retell_llm_dynamic_variables: {
            caller_name: name.trim(),
            call_reason: reason?.trim() ?? "",
          },
        }),
      }
    );

    const data = await retellRes.json();

    if (!retellRes.ok) {
      console.error("Retell API error:", data);
      return res.status(retellRes.status).json({
        error: data?.message ?? "Failed to initiate call. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      callId: data.call_id,
      message: `Call initiated to ${toNumber}`,
    });
  } catch (err) {
    console.error("Retell fetch error:", err);
    return res.status(500).json({ error: "Unexpected error. Please try again." });
  }
}
