import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = 'https://www.ryankroge.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  // Define all static pages
  const staticPages = [
    '',
    '/about',
    '/sba-loans',
    '/business-acquisition',
    '/strategic-financial-guidance',
    '/contact',
    '/resources'
  ];

  // Fetch all published posts from Supabase
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Construct XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${posts ? posts.map(post => `
  <url>
    <loc>${SITE_URL}/resources/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('') : ''}
</urlset>`;

  // Set response headers to XML
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour on Vercel Edge network
  res.status(200).send(sitemap);
}
