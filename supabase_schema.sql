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

-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS TABLE  (Supabase as CRM)
-- Stores every contact form submission. n8n / Edge Functions read from here.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE leads (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz DEFAULT now(),

  -- Contact info
  first_name           text NOT NULL,
  last_name            text NOT NULL,
  email                text NOT NULL,
  phone                text,

  -- Enquiry
  inquiry_type         text,   -- 'buy' | 'sell' | 'sba' | 'guidance' | 'exploring' | 'other'
  message              text,

  -- Marketing
  source               text DEFAULT 'contact_form',
  subscribe_newsletter boolean DEFAULT false,

  -- Workflow status (flipped by Edge Functions / n8n)
  confirmation_sent    boolean DEFAULT false,
  beehiiv_subscribed   boolean DEFAULT false,

  -- CRM notes (admin can fill these in later)
  status               text DEFAULT 'new',   -- 'new' | 'contacted' | 'qualified' | 'closed'
  notes                text,

  -- Spam prevention
  CONSTRAINT valid_email_format CHECK (
    email ~* '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
  ),
  CONSTRAINT first_name_not_empty CHECK (trim(first_name) <> ''),
  CONSTRAINT last_name_not_empty  CHECK (trim(last_name)  <> ''),
  CONSTRAINT message_min_length   CHECK (length(trim(coalesce(message, ''))) >= 10)
);

-- ── Rate limit function ───────────────────────────────────────────────────────
-- Blocks more than 3 submissions from the same email within any rolling 1-hour window.
-- Used inside the INSERT RLS policy so enforcement happens at the database level,
-- regardless of what the frontend does.
CREATE OR REPLACE FUNCTION is_lead_rate_limited(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*) >= 3
  FROM leads
  WHERE lower(email) = lower(p_email)
    AND created_at > now() - interval '1 hour';
$$;

-- RLS: public can INSERT only when email is valid + not rate-limited
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Email format (redundant with CHECK constraint but explicit in policy too)
    email ~* '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    -- Rate limit: max 3 per email per rolling hour
    AND NOT is_lead_rate_limited(email)
  );

CREATE POLICY "Admins can read and manage leads"
  ON leads FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- NEWSLETTER SUBSCRIBERS TABLE
-- Separate from leads — blog readers who subscribe via the article footer embed.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE newsletter_subscribers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz DEFAULT now(),
  email              text UNIQUE NOT NULL,
  source             text DEFAULT 'blog',       -- 'blog' | 'contact_form'
  post_slug          text,                      -- which article they subscribed from
  referrer           text,                      -- document.referrer at time of subscribe
  status             text DEFAULT 'active',     -- 'active' | 'unsubscribed'
  beehiiv_subscribed boolean DEFAULT false
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read newsletter subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- ANALYTICS EVENTS TABLE
-- Tracks post_view, post_read, and cta_click events from the public blog.
-- Powers the CMS analytics dashboard. Separate from GA4 (which handles
-- traffic sources and search console data).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE analytics_events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz DEFAULT now(),

  -- What happened
  event_type    text        NOT NULL
    CHECK (event_type IN ('post_view', 'post_read', 'cta_click')),

  -- Which post
  post_id       uuid        REFERENCES posts(id) ON DELETE SET NULL,
  post_slug     text,
  category      text,

  -- Session context (anonymous; no PII stored)
  session_id    text,
  referrer      text,

  -- Only populated for post_read events
  time_on_page  integer     -- seconds from page load to 75% scroll
);

CREATE INDEX idx_analytics_post_id    ON analytics_events(post_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public readers (anon) can write events — no auth required for tracking
CREATE POLICY "Public can insert analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read the data
CREATE POLICY "Admins can read analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');
