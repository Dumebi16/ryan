/**
 * Supabase Edge Function: subscribe-newsletter
 *
 * Called from ResourcePost.tsx when a reader subscribes via the blog embed.
 * 1. Inserts into newsletter_subscribers table
 * 2. Subscribes to Beehiiv publication
 * 3. Sends welcome email to subscriber + notification email to Ryan (in parallel)
 *
 * Required Supabase secrets:
 *   supabase secrets set BEEHIIV_API_KEY=your_key_here
 *   supabase secrets set BEEHIIV_PUB_ID=pub_xxxxxxxxxx
 *   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
 *   supabase secrets set FROM_EMAIL="Ryan Kroge <contact@mail.ryankroge.com>"
 *   supabase secrets set RYAN_EMAIL="ryankrogesba@gmail.com"
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BEEHIIV_API_KEY      = Deno.env.get("BEEHIIV_API_KEY") ?? "";
const BEEHIIV_PUB_ID       = Deno.env.get("BEEHIIV_PUB_ID") ?? "";
const RESEND_API_KEY        = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL            = Deno.env.get("FROM_EMAIL") ?? "Ryan Kroge <contact@mail.ryankroge.com>";
const RYAN_EMAIL            = Deno.env.get("RYAN_EMAIL") ?? "hello@ryankroge.com";
const SITE_URL              = Deno.env.get("SITE_URL") ?? "https://ryankroge.com";
const SUPABASE_URL          = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const { email, post_slug } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Upsert into newsletter_subscribers (ignore duplicate emails)
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, source: "blog", post_slug }, { onConflict: "email", ignoreDuplicates: true });

    if (dbError) throw dbError;

    // 2. Subscribe to Beehiiv
    let beehiivOk = false;
    if (BEEHIIV_API_KEY && BEEHIIV_PUB_ID) {
      const bhRes = await fetch(
        `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${BEEHIIV_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            reactivate_existing: false,
            send_welcome_email: true,
            utm_source: "blog",
            utm_medium: "website",
            utm_campaign: post_slug ?? "general",
          }),
        }
      );
      beehiivOk = bhRes.ok;
      if (beehiivOk) {
        await supabase
          .from("newsletter_subscribers")
          .update({ beehiiv_subscribed: true })
          .eq("email", email);
      }
    }

    // 3. Send emails in parallel — welcome to subscriber + notification to Ryan
    let resendOk = false;
    let resendError: string | null = null;

    if (RESEND_API_KEY) {
      const sendEmail = (to: string, subject: string, html: string) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
        });

      const [welcomeResult, notifyResult] = await Promise.allSettled([
        sendEmail(email, "You're on the list — Ryan Kroge Insights", welcomeEmailHtml(SITE_URL)),
        sendEmail(RYAN_EMAIL, `New subscriber: ${email}`, notifyEmailHtml(email, post_slug)),
      ]);

      if (welcomeResult.status === "fulfilled") {
        resendOk = welcomeResult.value.ok;
        if (!welcomeResult.value.ok) {
          const body = await welcomeResult.value.text();
          resendError = `${welcomeResult.value.status}: ${body}`;
          console.error("Resend welcome error:", resendError);
        }
      } else {
        resendError = welcomeResult.reason;
        console.error("Resend welcome failed:", resendError);
      }

      if (notifyResult.status === "rejected") {
        console.error("Resend notify failed:", notifyResult.reason);
      } else if (!notifyResult.value.ok) {
        const body = await notifyResult.value.text();
        console.error("Resend notify error:", notifyResult.value.status, body);
      }
    }

    return new Response(
      JSON.stringify({ success: true, beehiiv: beehiivOk, resend: resendOk, resendError }),
      { headers: { ...corsHeaders(), "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });
  }
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// ─── Welcome email → subscriber ───────────────────────────────────────────────

function welcomeEmailHtml(siteUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:48px 24px 0;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="border-bottom:2px solid #D4AF37;padding-bottom:24px;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;letter-spacing:0.3em;text-transform:uppercase;color:#111111;">RYAN KROGE</p>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#999999;">SBA Loan Specialist · Insights Newsletter</p>
        </td></tr>

        <tr><td style="padding:36px 0 32px;">
          <p style="margin:0 0 20px;font-size:24px;font-weight:500;line-height:1.2;color:#111111;">You're in.</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#555555;">
            You'll now get Ryan's latest thinking on SBA loans, business acquisitions, and strategic financial decisions — delivered straight to your inbox.
          </p>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#555555;">
            No noise. No spam. Just practical insights from someone who's been doing this for 25+ years.
          </p>
          <a href="${siteUrl}/resources" style="display:inline-block;background:#D4AF37;color:#000000;text-decoration:none;padding:14px 32px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
            Browse All Articles
          </a>
        </td></tr>

        <tr><td style="border-top:1px solid #eeeeee;padding:24px 0;">
          <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
            Ryan Kroge · SBA Loan Specialist · Detroit, MI · Serving clients nationwide<br>
            <a href="https://ryankroge.com" style="color:#D4AF37;text-decoration:none;">ryankroge.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Notification email → Ryan ────────────────────────────────────────────────

function notifyEmailHtml(email: string, post_slug?: string): string {
  const articleLine = post_slug
    ? `<tr><td style="padding:4px 0;font-size:14px;color:#555555;"><strong style="color:#111111;">Article:</strong> ${post_slug}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:48px 24px 0;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="border-bottom:2px solid #D4AF37;padding-bottom:24px;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;letter-spacing:0.3em;text-transform:uppercase;color:#111111;">RYAN KROGE</p>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#999999;">CMS · Newsletter Notification</p>
        </td></tr>

        <tr><td style="padding:32px 0 24px;">
          <p style="margin:0 0 20px;font-size:20px;font-weight:500;color:#111111;">New newsletter subscriber</p>
          <table cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:3px solid #D4AF37;padding:16px 20px;width:100%;box-sizing:border-box;">
            <tr><td style="padding:4px 0;font-size:14px;color:#555555;"><strong style="color:#111111;">Email:</strong> ${email}</td></tr>
            ${articleLine}
            <tr><td style="padding:4px 0;font-size:14px;color:#555555;"><strong style="color:#111111;">Source:</strong> Blog post</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#555555;"><strong style="color:#111111;">Time:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/Detroit", dateStyle: "medium", timeStyle: "short" })}</td></tr>
          </table>
        </td></tr>

        <tr><td style="border-top:1px solid #eeeeee;padding:24px 0;">
          <p style="margin:0;font-size:12px;color:#aaaaaa;">
            Sent automatically by your CMS when a reader subscribes from a blog post.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
