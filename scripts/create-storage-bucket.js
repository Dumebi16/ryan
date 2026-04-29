/**
 * Run this once to create the Supabase "images" storage bucket.
 * Usage:
 *   node scripts/create-storage-bucket.js <YOUR_SERVICE_ROLE_KEY>
 *
 * Get your service role key from:
 *   Supabase Dashboard → Settings → API → "service_role" (secret key)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iezqofjxrgrnfjrwtgkx.supabase.co";
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error("Usage: node scripts/create-storage-bucket.js <SERVICE_ROLE_KEY>");
  console.error("\nGet it from: Supabase Dashboard → Settings → API → service_role secret");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("Creating 'images' bucket...");

  const { data: existing } = await supabase.storage.getBucket("images");
  if (existing) {
    console.log("✓ Bucket 'images' already exists.");
    return;
  }

  const { error } = await supabase.storage.createBucket("images", {
    public: true,
    fileSizeLimit: 10485760, // 10 MB
    allowedMimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/avif",
    ],
  });

  if (error) {
    console.error("✗ Failed:", error.message);
    process.exit(1);
  }

  console.log("✓ Bucket 'images' created successfully.");
  console.log("\nStorage policies are handled by Supabase RLS — no extra setup needed.");
  console.log("Image uploads in the admin editor should now work.");
}

run();
