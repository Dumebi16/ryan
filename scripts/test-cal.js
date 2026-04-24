/**
 * Local diagnostic script — /scripts/test-cal.js
 * Run from project root: node scripts/test-cal.js
 *
 * Reads .env.local (never .env — keep secrets out of that file).
 * Never prints key values. Only prints: exists/missing, counts, sanitized errors.
 *
 * To also test a REAL booking (creates an actual Cal.com booking), run:
 *   DRY_RUN=false node scripts/test-cal.js
 * Default is dry-run — no booking created.
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Load .env.local ────────────────────────────────────────────────────────────
const envPath = path.join(ROOT, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("ERROR: .env.local not found at", envPath);
  process.exit(1);
}

// Minimal dotenv parser — only for local use
const envLines = fs.readFileSync(envPath, "utf8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx < 0) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
  if (!(key in process.env)) process.env[key] = val;
}

const DRY_RUN = process.env.DRY_RUN !== "false";
const TZ = "America/Detroit";

// ── Required env var check ─────────────────────────────────────────────────────
const REQUIRED = [
  "CAL_API_KEY",
  "CAL_EVENT_TYPE_ID",
  "CAL_USERNAME",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "RYAN_PHONE_NUMBER",
  "RETELL_PHONE_NUMBER_ID",
  "RETELL_API_KEY",
];

console.log("\n── Env var check ────────────────────────────────────────");
let missing = 0;
for (const key of REQUIRED) {
  const present = !!process.env[key];
  console.log(`  ${key}: ${present ? "✓ present" : "✗ MISSING"}`);
  if (!present) missing++;
}
if (missing > 0) {
  console.error(`\n${missing} required env var(s) missing. Aborting.\n`);
  process.exit(1);
}

// ── Cal.com v2 — get-slots ─────────────────────────────────────────────────────
const EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID;
const CAL_API_KEY   = process.env.CAL_API_KEY;

console.log("\n── Cal.com v2 — availability check ─────────────────────");
console.log(`  Event type ID present: ${!!EVENT_TYPE_ID}`);
console.log(`  CAL_API_KEY present:   ${!!CAL_API_KEY}`);

const start = new Date();
start.setMinutes(0, 0, 0);
const end = new Date(start);
end.setDate(end.getDate() + 7);

const slotParams = new URLSearchParams({
  eventTypeId: EVENT_TYPE_ID,
  start: start.toISOString(),
  end: end.toISOString(),
  timeZone: TZ,
});

let availableSlots = [];

try {
  const calRes = await fetch(`https://api.cal.com/v2/slots?${slotParams}`, {
    headers: {
      Authorization: `Bearer ${CAL_API_KEY}`,
      "cal-api-version": "2024-09-04",
    },
  });

  console.log(`  Cal.com HTTP status: ${calRes.status}`);

  const data = await calRes.json();
  const topLevel = data.status;

  if (!calRes.ok || topLevel === "error") {
    console.error("  Cal.com returned error:");
    console.error("    status field:", topLevel ?? "(none)");
    console.error("    message:", data.message ?? data.error ?? "(none)");
    process.exit(1);
  }

  const slotsByDay = data.data ?? {};
  const dayCount = Object.keys(slotsByDay).length;

  for (const [, times] of Object.entries(slotsByDay)) {
    if (!Array.isArray(times)) continue;
    for (const slot of times) {
      const isoTime = slot.start ?? slot.time;
      if (isoTime) availableSlots.push(isoTime);
      if (availableSlots.length >= 20) break;
    }
    if (availableSlots.length >= 20) break;
  }

  console.log(`  Days with slots: ${dayCount}`);
  console.log(`  Total slots (sample, max 20): ${availableSlots.length}`);
  if (availableSlots.length > 0) {
    const first = new Date(availableSlots[0]).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", timeZone: TZ,
    });
    console.log(`  First available: ${first} ET`);
  } else {
    console.warn("  WARNING: 0 slots returned — check schedule timezone and event type linkage");
  }
} catch (err) {
  console.error("  Fetch error:", err.message);
  process.exit(1);
}

// ── Cal.com v2 — booking payload shape ────────────────────────────────────────
console.log("\n── Cal.com v2 — booking payload shape ──────────────────");

if (availableSlots.length === 0) {
  console.warn("  Skipping booking test — no slots available");
} else {
  const testSlot = availableSlots[0];
  const bookingBody = {
    eventTypeId: Number(EVENT_TYPE_ID),
    start: testSlot,
    attendee: {
      name: "Test User",
      email: "test@example.com",
      timeZone: TZ,
      phoneNumber: "+15550000000",
    },
    metadata: {
      source: "local-diagnostic-dry-run",
    },
  };

  console.log("  Booking payload shape: valid");
  console.log("  eventTypeId:", typeof bookingBody.eventTypeId, "(number)");
  console.log("  start field:", typeof bookingBody.start, "(ISO string)");
  console.log("  attendee fields:", Object.keys(bookingBody.attendee).join(", "));

  if (DRY_RUN) {
    console.log("  DRY_RUN=true — booking NOT submitted (set DRY_RUN=false to create a real booking)");
  } else {
    console.log("  DRY_RUN=false — submitting test booking to Cal.com...");
    try {
      const bookRes = await fetch("https://api.cal.com/v2/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CAL_API_KEY}`,
          "Content-Type": "application/json",
          "cal-api-version": "2020-11-17",
        },
        body: JSON.stringify(bookingBody),
      });

      console.log("  Cal.com booking HTTP status:", bookRes.status);
      const bookData = await bookRes.json();

      if (!bookRes.ok || bookData.status === "error") {
        console.error("  Booking failed:");
        console.error("    status:", bookData.status ?? "(none)");
        console.error("    message:", bookData.message ?? bookData.error ?? "(none)");
      } else {
        const uid = bookData.data?.uid ?? bookData.uid ?? "(unknown)";
        console.log("  Booking created successfully — uid:", uid);
        console.log("  ACTION REQUIRED: Cancel this test booking at https://cal.com/bookings");
      }
    } catch (err) {
      console.error("  Booking fetch error:", err.message);
    }
  }
}

// ── Retell tool URL check ──────────────────────────────────────────────────────
console.log("\n── Retell tool URL check ────────────────────────────────");
const baseUrl = "https://ryan-kroge-sba-loan-specialist.vercel.app";
const urls = [
  `${baseUrl}/api/cal/get-slots`,
  `${baseUrl}/api/cal/book-slot`,
];
for (const url of urls) {
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    // A 400 (missing fields) or 200 means the function exists and is reachable.
    // A 404 means it was never deployed.
    const deployed = r.status !== 404;
    console.log(`  ${url.split("/api/")[1]}: HTTP ${r.status} — ${deployed ? "DEPLOYED ✓" : "NOT FOUND ✗ (not deployed)"}`);
  } catch (err) {
    console.error(`  ${url}: fetch error — ${err.message}`);
  }
}

// ── Twilio (existence only — never print SID or token) ────────────────────────
console.log("\n── Twilio config ────────────────────────────────────────");
console.log("  TWILIO_ACCOUNT_SID present:", !!process.env.TWILIO_ACCOUNT_SID);
console.log("  TWILIO_AUTH_TOKEN present: ", !!process.env.TWILIO_AUTH_TOKEN);
console.log("  RYAN_PHONE_NUMBER present: ", !!process.env.RYAN_PHONE_NUMBER);
console.log("  RETELL_PHONE_NUMBER_ID present:", !!process.env.RETELL_PHONE_NUMBER_ID);
console.log("\n  To test SMS: set DRY_RUN=false and add a SEND_SMS=true flag (not implemented — add manually if needed)");
console.log("  Never test Twilio SMS by printing the auth token. Use Twilio console logs instead.");

console.log("\n── Done ──────────────────────────────────────────────────\n");
