import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const lead = await req.json();
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      inquiry_type, 
      message, 
      subscribe_newsletter,
      honeypot,
      captcha_token
    } = lead;

    // 1. Honeypot check for spam bots
    if (honeypot) {
      console.log("Spam bot detected via honeypot field. Silently rejecting.");
      // Return 200 to trick the bot into thinking it succeeded
      return new Response(JSON.stringify({ success: true, id: "bot-blocked" }), {
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      });
    }

    // 2. Verify reCAPTCHA token with Google
    const RECAPTCHA_SECRET_KEY = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!RECAPTCHA_SECRET_KEY) {
      console.warn("RECAPTCHA_SECRET_KEY is not set. Skipping CAPTCHA validation.");
    } else if (!captcha_token) {
      throw new Error("Missing CAPTCHA token.");
    } else {
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captcha_token}`,
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        throw new Error("CAPTCHA verification failed. Are you a robot?");
      }
    }

    // 3. Initialize Supabase client with Service Role Key to bypass RLS
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables.");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 4. Insert the lead safely
    const { data, error } = await supabase
      .from("leads")
      .insert({
        first_name,
        last_name,
        email,
        phone: phone || null,
        inquiry_type,
        message,
        subscribe_newsletter,
        source: "contact_form",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    // 5. Return success
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });
  }
});
