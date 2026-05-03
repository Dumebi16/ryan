/**
 * Supabase Edge Function: on-lead-created
 *
 * Fires when Contact.tsx calls supabase.functions.invoke('on-lead-created').
 * Sends two emails via Resend:
 *   1. Confirmation to the lead — branded, warm, personal
 *   2. Internal notification to Ryan
 *
 * Required Supabase secrets (set via CLI or dashboard):
 *   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
 *   supabase secrets set FROM_EMAIL="Ryan Kroge <hello@ryankroge.com>"
 *   supabase secrets set RYAN_EMAIL="hello@ryankroge.com"
 *
 * NOTE — Resend domain setup (one-time, ~10 min):
 *   1. Go to resend.com → Domains → Add Domain → enter "ryankroge.com"
 *   2. Add the 3 DNS records Resend shows you (SPF, DKIM, DMARC) in your Hostinger DNS
 *   3. Wait up to 24 hrs for propagation, then verify in Resend
 *   4. After verification, FROM_EMAIL can be anything @ryankroge.com
 *
 * Until your domain is verified, Resend will reject sends from @ryankroge.com.
 * For testing: use Resend's sandbox mode or set FROM_EMAIL to onboarding@resend.dev
 */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Ryan Kroge <contact@mail.ryankroge.com>";
const RYAN_EMAIL = Deno.env.get("RYAN_EMAIL") ?? "hello@ryankroge.com";

const INQUIRY_LABELS: Record<string, string> = {
  buy:       "Buying a Business",
  sell:      "Selling a Business",
  sba:       "SBA Loan",
  guidance:  "Financial Guidance",
  exploring: "Exploring Options",
  other:     "Other",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const lead = await req.json();
    const { first_name, last_name, email, inquiry_type, message, subscribe_newsletter } = lead;
    const label = INQUIRY_LABELS[inquiry_type] ?? inquiry_type ?? "General Inquiry";

    const [confirmResult, notifyResult] = await Promise.allSettled([
      sendEmail(email, `Ryan received your message`, confirmationHtml(first_name, label, message)),
      sendEmail(RYAN_EMAIL, `New lead: ${first_name} ${last_name} — ${label}`, notificationHtml(lead, label)),
    ]);

    const errors = [confirmResult, notifyResult]
      .filter(r => r.status === "rejected")
      .map(r => (r as PromiseRejectedResult).reason);

    return new Response(
      JSON.stringify({ success: errors.length === 0, errors }),
      { headers: { ...corsHeaders(), "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });
  }
});

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  return res.json();
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function confirmationHtml(firstName: string, label: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:48px 24px 0;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="border-bottom:2px solid #D4AF37;padding-bottom:24px;margin-bottom:32px;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;letter-spacing:0.3em;text-transform:uppercase;color:#111111;">RYAN KROGE</p>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#999999;">SBA Loan Specialist</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 0 32px;">
          <p style="margin:0 0 20px;font-size:24px;font-weight:500;line-height:1.2;color:#111111;">
            Got it, ${firstName}.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#555555;">
            Ryan personally received your message about <strong style="color:#111111;">${label}</strong>. He reads every submission himself and will be in touch within one business day — usually sooner.
          </p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#555555;">
            No obligation. No pressure. Just a real conversation about what's possible for you and your business.
          </p>

          <!-- Message recap -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;border-left:3px solid #D4AF37;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#999999;">Your message</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#444444;">${escapeHtml(message)}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 0 40px;">
          <p style="margin:0 0 16px;font-size:14px;color:#777777;">Need to reach Ryan sooner?</p>
          <a href="tel:+19472181845" style="display:inline-block;background:#D4AF37;color:#000000;text-decoration:none;padding:14px 32px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
            Call (947) 218-1845
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="border-top:1px solid #eeeeee;padding:24px 0;">
          <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
            Ryan Kroge · SBA Loan Specialist · Detroit, MI · Serving clients nationwide<br>
            <a href="https://ryankroge.com" style="color:#D4AF37;text-decoration:none;">ryankroge.com</a>
          </p>
          <p style="margin:12px 0 0;font-size:11px;color:#cccccc;">
            You're receiving this because you submitted a contact form at ryankroge.com.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationHtml(lead: Record<string, string>, label: string): string {
  const rows = [
    ["Name",    `${lead.first_name} ${lead.last_name}`],
    ["Email",   lead.email],
    ["Phone",   lead.phone || "—"],
    ["Topic",   label],
    ["Newsletter", lead.subscribe_newsletter ? "Yes — subscribe to Beehiiv" : "No"],
  ];

  const tableRows = rows.map(([k, v]) =>
    `<tr>
      <td style="padding:10px 16px;background:#f7f7f5;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#999999;white-space:nowrap;width:120px;">${k}</td>
      <td style="padding:10px 16px;font-size:14px;color:#111111;">${escapeHtml(v)}</td>
    </tr>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:32px 24px;background:#ffffff;font-family:'Inter',Arial,sans-serif;color:#111111;">
  <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#D4AF37;">NEW LEAD</p>
  <h1 style="margin:0 0 24px;font-size:22px;font-weight:500;">${lead.first_name} ${lead.last_name}</h1>

  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #eeeeee;width:100%;max-width:520px;">
    ${tableRows}
  </table>

  <div style="margin:28px 0;padding:20px;background:#f7f7f5;border-left:3px solid #D4AF37;">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#999999;">Message</p>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#333333;">${escapeHtml(lead.message ?? "")}</p>
  </div>

  <a href="mailto:${lead.email}?subject=Re: Your inquiry about ${encodeURIComponent(label)}"
     style="display:inline-block;background:#D4AF37;color:#000000;text-decoration:none;padding:12px 28px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
    Reply to ${lead.first_name}
  </a>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
