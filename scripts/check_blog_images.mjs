import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAllImages() {
  const { data: posts, error } = await supabase.from('posts').select('id, title, slug, cover_image_url, markdown_content');
  if (error) {
    console.error('Database query error:', error);
    return;
  }

  console.log(`Found ${posts.length} posts. Scanning for images...\n`);

  for (const post of posts) {
    console.log(`========================================`);
    console.log(`Post: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    
    // Check Cover Image
    if (post.cover_image_url) {
      try {
        const res = await fetch(post.cover_image_url, { method: 'HEAD' });
        console.log(`  [Cover Image] Status ${res.status}: ${post.cover_image_url}`);
      } catch (e) {
        console.log(`  [Cover Image] ERROR: ${post.cover_image_url} (${e.message})`);
      }
    }

    // Extract html <img> src and markdown ![alt](url)
    const content = post.markdown_content || '';
    const htmlImgs = Array.from(content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)).map(m => m[1]);
    const mdImgs = Array.from(content.matchAll(/!\[.*?\]\(([^)]+)\)/gi)).map(m => m[1]);
    const allUrls = Array.from(new Set([...htmlImgs, ...mdImgs]));

    if (allUrls.length === 0) {
      console.log(`  (No inline content images found)`);
    }

    for (const url of allUrls) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          console.log(`  [Inline Image] OK (${res.status}): ${url}`);
        } else {
          console.log(`  [Inline Image] BROKEN (${res.status}): ${url}`);
        }
      } catch (e) {
        console.log(`  [Inline Image] FAILED (${e.message}): ${url}`);
      }
    }
  }
}

checkAllImages();
