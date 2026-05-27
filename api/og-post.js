import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = 'https://www.ryankroge.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    // Read built index.html (Vercel bundles it via includeFiles)
    let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(process.cwd(), 'index.html');
    }
    let html = fs.readFileSync(htmlPath, 'utf8');

    if (slug) {
      const { data: post, error } = await supabase
        .from('posts')
        .select('title, slug, excerpt, cover_image_url, open_graph_image, meta_title, meta_description, twitter_title, twitter_description, is_published')
        .eq('slug', slug)
        .single();

      if (post && !error && post.is_published) {
        const pageTitle  = esc(post.meta_title  || post.title  || 'Ryan Kroge | SBA Loan Specialist');
        const desc       = esc(post.meta_description || post.excerpt || 'Expert SBA loan guidance by Ryan Kroge.');
        const ogImage    = post.open_graph_image || post.cover_image_url || `${SITE_URL}/og-default.png`;
        const twitterTitle = esc(post.twitter_title || post.meta_title || post.title || pageTitle);
        const twitterDesc  = esc(post.twitter_description || post.meta_description || post.excerpt || desc);
        const pageUrl    = `${SITE_URL}/resources/${slug}`;

        const ogTags = `
  <!-- Dynamic OG / Twitter Card for blog post -->
  <meta name="description" content="${desc}" />
  <meta property="og:type"        content="article" />
  <meta property="og:site_name"   content="Ryan Kroge | SBA Loan Specialist" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:title"       content="${pageTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${ogImage}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:site"        content="@ryankroge" />
  <meta name="twitter:title"       content="${twitterTitle}" />
  <meta name="twitter:description" content="${twitterDesc}" />
  <meta name="twitter:image"       content="${ogImage}" />`;

        // Inject tags and update <title>
        html = html.replace('</head>', `${ogTags}\n</head>`);
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Cache 1 hr on edge, serve stale while revalidating for 24 hrs
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (err) {
    console.error('[og-post] Error:', err);
    res.status(500).send('Error generating page');
  }
}
