import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    // Try to load index.html from dist (production) or root (local dev)
    let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(process.cwd(), 'index.html');
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');

    if (slug) {
      const { data: post, error } = await supabase
        .from('posts')
        .select('title, excerpt, cover_image')
        .eq('slug', slug)
        .single();

      if (post && !error) {
        const title = post.title ? post.title.replace(/"/g, '&quot;') : '';
        const description = post.excerpt ? post.excerpt.replace(/"/g, '&quot;') : '';
        const image = post.cover_image || '';
        const currentUrl = `https://${req.headers.host}/resources/${slug}`;
        
        const ogTags = `
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="${currentUrl}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${image}" />
        `;
        
        // Inject tags right before </head>
        html = html.replace('</head>', `${ogTags}</head>`);
        
        // Replace default <title>
        html = html.replace(/<title>.*?<\/title>/, `<title>${title} | Ryan Kroge</title>`);
      }
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); 
    res.status(200).send(html);
  } catch (err) {
    console.error('Error in og-post handler:', err);
    // Fallback: just send something rather than crashing
    res.status(500).send("Error generating page metadata");
  }
}
