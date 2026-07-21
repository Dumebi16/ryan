import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    if (slug) {
      // Fetch single post + relational post_faqs
      const { data, error } = await supabase
        .from('posts')
        .select('*, post_faqs(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Sort FAQs
      if (data.post_faqs) {
        data.post_faqs.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      }

      // Edge CDN SWR cache: 24h fresh, 7 days stale-while-revalidate
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Cache-Control',
        'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
      );

      return res.status(200).json(data);
    } else {
      // Fetch all published posts
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Cache-Control',
        'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
      );

      return res.status(200).json(data || []);
    }
  } catch (err) {
    console.error('API /api/posts error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
