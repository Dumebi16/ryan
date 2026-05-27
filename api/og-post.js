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
    let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(process.cwd(), 'index.html');
    }
    let html = fs.readFileSync(htmlPath, 'utf8');

    const PAGE_SEO = {
      '/': {
        title: 'Ryan Kroge | Expert SBA Loan Specialist — Detroit, MI',
        description: 'Get funding to grow your business.',
        image: `${SITE_URL}/og-social.jpg`,
      },
      '/about': {
        title: 'About Ryan Kroge — Detroit SBA Loan Specialist',
        description: 'Meet Ryan Kroge, a Detroit-based SBA Loan Specialist with 25+ years of experience helping business owners secure SBA financing and structure acquisitions.',
        image: `${SITE_URL}/og-social.jpg`,
      },
      '/sba-loan': {
        title: 'SBA Loan Options (7a & 504) Explained — Ryan Kroge',
        description: 'Understand the difference between SBA 7(a) and 504 loans. Get expert guidance on terms, requirements, and securing the best capital for your business.',
        image: `${SITE_URL}/og-social.jpg`,
      },
      '/business-acquisition': {
        title: 'Business Acquisition Loans & Financing — Ryan Kroge',
        description: 'Buying a business? Learn how to structure your business acquisition with SBA financing. Get pre-qualified and negotiate with confidence.',
        image: `${SITE_URL}/og-social.jpg`,
      },
      '/strategic-financial-guidance': {
        title: 'Strategic Financial Guidance for Small Business — Ryan Kroge',
        description: 'Get expert strategic financial guidance from Ryan Kroge. Cash flow management, financial forecasting, loan readiness, and growth strategy for small business owners.',
        image: `${SITE_URL}/og-social.jpg`,
      },
      '/contact': {
        title: 'Contact Ryan Kroge | Book a Free SBA Loan Consultation',
        description: 'Ready to get your business funded? Book a free 30-minute consultation with Ryan Kroge, Detroit-based SBA Loan Specialist. Get a real answer within 24 hours.',
        image: `${SITE_URL}/og-social.jpg`,
      },
      '/resources': {
        title: 'SBA Loan Insights & Small Business Resources — Ryan Kroge',
        description: 'Expert articles on SBA financing, business acquisition, cash flow management, and small business growth strategies from Ryan Kroge, Detroit’s trusted SBA Loan Specialist.',
        image: `${SITE_URL}/og-social.jpg`,
      }
    };

    let pageTitle = '';
    let desc = '';
    let ogImage = '';
    let twitterTitle = '';
    let twitterDesc = '';
    let pageUrl = '';

    if (slug) {
      const { data: post, error } = await supabase
        .from('posts')
        .select('title, slug, excerpt, cover_image_url, open_graph_image, meta_title, meta_description, twitter_title, twitter_description, is_published')
        .eq('slug', slug)
        .single();

      if (post && !error && post.is_published) {
        pageTitle  = esc(post.meta_title  || post.title  || 'Ryan Kroge | SBA Loan Specialist');
        desc       = esc(post.meta_description || post.excerpt || 'Expert SBA loan guidance by Ryan Kroge.');
        ogImage    = post.open_graph_image || post.cover_image_url || `${SITE_URL}/og-social.jpg`;
        twitterTitle = esc(post.twitter_title || post.meta_title || post.title || pageTitle);
        twitterDesc  = esc(post.twitter_description || post.meta_description || post.excerpt || desc);
        pageUrl    = `${SITE_URL}/resources/${slug}`;
      }
    } else if (req.query.path && PAGE_SEO[req.query.path]) {
      const seo = PAGE_SEO[req.query.path];
      pageTitle = esc(seo.title);
      desc = esc(seo.description);
      ogImage = seo.image;
      twitterTitle = pageTitle;
      twitterDesc = desc;
      pageUrl = `${SITE_URL}${req.query.path}`;
    }

    if (pageTitle && desc) {
      const ogTags = `
  <!-- Dynamic OG / Twitter Card from Serverless Function -->
  <meta name="description" content="${desc}" />
  <meta property="og:type"        content="${slug ? 'article' : 'website'}" />
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

      // Remove existing static meta tags from index.html to avoid duplicates
      html = html.replace(/<meta name="description" content="[^"]*" \/>/, '');
      html = html.replace(/<!-- Open Graph.*?-->[\s\S]*?(?=<!-- Twitter)/, '');
      html = html.replace(/<!-- Twitter.*?-->[\s\S]*?(?=<!-- Google)/, '');

      // Inject tags and update <title>
      html = html.replace('</head>', `${ogTags}\n</head>`);
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);
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
