-- Create the posts table with full SEO, GEO, and AEO support
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 1) Core
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text, -- Deprecated in favor of categories array string but kept for simplicity if needed, or use categories[]
  categories text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  author_name text,
  read_time integer,
  cover_image_url text,
  hero_alt_text text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  canonical_url text,

  -- 2) Content
  markdown_content text,
  excerpt text,

  -- 3) SEO (Search + Social)
  meta_title text,
  meta_description text,
  open_graph_image text,
  twitter_title text,
  twitter_description text,
  noindex boolean DEFAULT false,

  -- 4) GEO (Localization + Local SEO)
  geos jsonb DEFAULT '[]'::jsonb, -- [{country, region, city}]
  local_business_name text,
  service_area text,

  -- 5) AEO (Answer Engine Optimization)
  key_entities text[] DEFAULT '{}',
  target_queries text[] DEFAULT '{}',
  reference_links jsonb DEFAULT '[]'::jsonb, -- [{title, url}]

  -- 6) Related/Taxonomy
  primary_topic text,
  secondary_topics text[] DEFAULT '{}',
  internal_links text[] DEFAULT '{}',
  external_links jsonb DEFAULT '[]'::jsonb, -- [{url, rel:[]}]

  -- 7) Quality + Compliance
  originality_check boolean DEFAULT false,
  tone_of_voice text,
  reading_level text,
  accessibility_notes text,
  legal_disclaimer text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create the FAQs table linked to posts (AEO extension)
CREATE TABLE post_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  position integer DEFAULT 0
);

-- Set Row Level Security (RLS) policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_faqs ENABLE ROW LEVEL SECURITY;

-- 1) Public users can only read PUBLISHED posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT
  USING (is_published = true AND noindex = false);

CREATE POLICY "Public can view related FAQs" ON post_faqs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts WHERE posts.id = post_faqs.post_id AND posts.is_published = true
    )
  );

-- 2) Admins (authenticated users) can fully manage posts and FAQs
CREATE POLICY "Admins can manage posts" ON posts
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage FAQs" ON post_faqs
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE SETUP
-- Run this in your Supabase SQL Editor to create the images bucket.
-- The bucket must be created BEFORE image uploads will work.
-- ─────────────────────────────────────────────────────────────────────────────

-- Create the images bucket (public = true so images are readable without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update/replace images
CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- Allow public (unauthenticated) read access so images appear on the public blog
CREATE POLICY "Public can read images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');
