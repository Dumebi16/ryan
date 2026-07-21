import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function cleanDeadImages() {
  console.log("Searching database for dead Hostinger image tags...");
  const { data: posts, error } = await supabase.from("posts").select("id, title, markdown_content");
  
  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  for (const post of posts) {
    let content = post.markdown_content || "";
    if (!content.includes("hostingersite.com")) {
      continue;
    }

    console.log(`\nCleaning post: "${post.title}" (ID: ${post.id})...`);

    // Remove <img> tags containing hostingersite.com
    const cleanedContent = content.replace(/<img[^>]+src=["'][^"']*hostingersite\.com[^"']*["'][^>]*>/gi, "");

    // Also remove markdown images ![...](...hostingersite.com...)
    const finalContent = cleanedContent.replace(/!\[.*?\]\(https?:\/\/[^\s)]*hostingersite\.com[^\s)]*\)/gi, "");

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        markdown_content: finalContent,
        updated_at: new Date().toISOString()
      })
      .eq("id", post.id);

    if (updateError) {
      console.error(`  Failed to update post "${post.title}":`, updateError);
    } else {
      console.log(`  [SUCCESS] Removed dead Hostinger image tags from "${post.title}"`);
    }
  }
}

cleanDeadImages().catch(err => console.error("Script failed:", err));
