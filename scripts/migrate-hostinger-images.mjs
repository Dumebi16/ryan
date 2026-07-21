import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
// Using service role or anon key if storage bucket is public
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateImages() {
  console.log("Fetching posts to check for legacy Hostinger images...");
  const { data: posts, error } = await supabase.from("posts").select("*");
  
  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  for (const post of posts) {
    let updatedContent = post.markdown_content || "";
    let updatedCover = post.cover_image_url || "";
    let modified = false;

    // Find all image URLs containing hostingersite.com
    const urls = new Set();
    if (updatedCover.includes("hostingersite.com")) {
      urls.add(updatedCover);
    }

    const matches = [...updatedContent.matchAll(/https:\/\/[^\s"'<>]+\.hostingersite\.com[^\s"'<>]+/gi)];
    for (const match of matches) {
      urls.add(match[0]);
    }

    if (urls.size === 0) {
      console.log(`[OK] Post "${post.title}" has no legacy Hostinger images.`);
      continue;
    }

    console.log(`\nProcessing post "${post.title}" (${urls.size} Hostinger image(s) found)...`);

    for (const oldUrl of urls) {
      try {
        console.log(`  Downloading: ${oldUrl}`);
        const res = await fetch(oldUrl);
        if (!res.ok) {
          console.error(`  Failed to download (${res.status}): ${oldUrl}`);
          continue;
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;
        const filePath = `post-images/${fileName}`;

        console.log(`  Uploading to Supabase Storage: ${filePath}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, buffer, {
            contentType: res.headers.get("content-type") || "image/png",
            upsert: true
          });

        if (uploadError) {
          console.error(`  Storage Upload Error:`, uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        const newUrl = publicUrlData.publicUrl;
        console.log(`  Successfully uploaded! New URL: ${newUrl}`);

        if (updatedCover === oldUrl) {
          updatedCover = newUrl;
        }

        updatedContent = updatedContent.replaceAll(oldUrl, newUrl);
        modified = true;
      } catch (err) {
        console.error(`  Error processing ${oldUrl}:`, err);
      }
    }

    if (modified) {
      console.log(`  Updating database record for post ID: ${post.id}...`);
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          cover_image_url: updatedCover,
          markdown_content: updatedContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", post.id);

      if (updateError) {
        console.error(`  Database update error:`, updateError);
      } else {
        console.log(`  [SUCCESS] Post "${post.title}" updated with Supabase Storage URLs!`);
      }
    }
  }
}

migrateImages().catch(err => console.error("Migration failed:", err));
