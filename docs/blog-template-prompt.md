# Reusable Blog Archive + Blog Post Template Prompt

Use this prompt to generate a reusable blog system for any website. The visual design, brand palette, typography, imagery, and content should adapt to the target site, but the structure and interaction model should remain consistent.

---

## Master Prompt

Build a production-ready blog archive page and individual blog post page for this website.

Do not copy a specific brand's visual identity unless requested. Instead, use the site's existing design system, tokens, typography, spacing, navigation, buttons, cards, icons, and footer patterns. If no design system exists, create a restrained, modern editorial system that matches the brand personality.

The output should include two pages:

1. Blog archive page
2. Blog post detail page

Both pages should share the same header, CTA section, footer, content model, and responsive behavior.

---

## Required Page 1: Blog Archive

### Purpose

The archive page helps visitors scan, filter, and open blog posts. It should feel editorial, scannable, and easy to navigate.

### Structure

Use this page structure:

```text
BlogArchivePage
  Navbar
  ArchiveHero
  FeaturedPost
  FilterBar
  BlogGrid
    BlogCard[]
  CTASection
  Footer
```

### Archive Hero

Include a simple page title such as:

```text
Blog
Insights
Resources
Journal
```

Choose the label that fits the website.

Layout rules:

- Center the title.
- Keep the hero compact.
- Use strong typography.
- Avoid turning the archive into a marketing landing page.

### Featured Post

Place one prominent article above the grid.

Recommended layout:

```text
Desktop:
Image/visual block | Article title + metadata

Mobile:
Image/visual block
Article title + metadata
```

Featured post fields:

```js
{
  title: "Article title",
  slug: "/blog/article-slug",
  category: "Category",
  date: "March 21, 2025",
  readTime: "6 min read",
  image: "/path-or-generated-visual"
}
```

### Filter Bar

Add a category filter above the grid.

Behavior:

- Default option: all posts.
- Changing the category filters visible cards.
- Preserve layout spacing when posts change.
- On mobile, the filter should be full-width or easy to tap.

Example categories:

```js
["All", "Insights", "Company", "Guides", "News"]
```

### Blog Grid

Use a responsive card grid:

```css
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 900px) {
  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
```

### Blog Card

Each card should include:

- Image or visual thumbnail
- Category tag
- Article title
- Publish date
- Reading time
- Link to detail page

Recommended card model:

```js
{
  title: "Interactive Brokers Goes Live with Crypto in Europe",
  slug: "/blog/interactive-brokers-crypto-europe",
  category: "Insights",
  date: "March 21, 2025",
  readTime: "6 min read",
  image: "/images/post-thumbnail.jpg",
  excerpt: "Optional short summary"
}
```

Card interaction:

- Slight lift on hover.
- Optional overlay revealing date or read time.
- Do not hide essential information behind hover only.
- Entire card should be clickable.

Base card markup:

```html
<article class="blog-card" data-category="Insights">
  <a href="/blog/article-slug" aria-label="Read: Article title">
    <div class="blog-card__media">
      <img src="/path/to/image.jpg" alt="" />
      <div class="blog-card__overlay">
        <span>March 21, 2025</span>
      </div>
    </div>
    <div class="blog-card__body">
      <span class="blog-card__tag">Insights</span>
      <h3>Article title goes here and may wrap to two lines</h3>
      <p class="blog-card__meta">March 21, 2025 • 6 min read</p>
    </div>
  </a>
</article>
```

Base interaction CSS:

```css
.blog-card__media {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card, 16px);
}

.blog-card {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.blog-card:hover {
  transform: translateY(-4px);
}

.blog-card__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  background: rgba(0, 0, 0, 0.35);
  transition: opacity 180ms ease;
}

.blog-card:hover .blog-card__overlay {
  opacity: 1;
}
```

---

## Required Page 2: Blog Post Detail

### Purpose

The post page should prioritize reading, hierarchy, navigation, and conversion.

### Structure

Use this page structure:

```text
BlogPostPage
  Navbar
  ArticleHeader
  ArticleLayout
    SidebarNav
    ArticleContent
  CTASection
  Footer
```

### Article Header

The article header should include:

- Category tag
- H1 headline
- Date
- Reading time
- Optional author
- Featured image or visual block

Recommended markup:

```html
<header class="article-header">
  <span class="article-tag">Digital Assets</span>
  <h1>Interactive Brokers Goes Live with Crypto in Europe, Powered by zerohash</h1>
  <p class="article-meta">March 21, 2025 • 6 min read</p>
  <figure class="article-featured-image">
    <img src="/path/to/featured-image.jpg" alt="Descriptive alt text" />
  </figure>
</header>
```

Layout rules:

- Max width: around 760px to 900px depending on design.
- H1 should be large and multi-line.
- Featured image should be full-width within the article header container.
- Use generous spacing between metadata and image.

### Main Article Layout

Desktop layout:

```text
SidebarNav | ArticleContent
```

Recommended CSS:

```css
.article-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 700px);
  gap: 64px;
  align-items: start;
  max-width: 1100px;
  margin: 0 auto;
}

.article-sidebar {
  position: sticky;
  top: 100px;
}

.article-content {
  max-width: 700px;
}
```

Tablet/mobile behavior:

```css
@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    display: none;
  }

  .mobile-toc {
    display: block;
  }
}
```

### Sidebar Navigation

The sidebar should include:

- Title: "On the page"
- Anchor links generated from article headings
- Active section state while scrolling
- Small CTA link below the anchors

Recommended markup:

```html
<aside class="article-sidebar" aria-label="Article table of contents">
  <h2>On the page</h2>
  <ol class="toc-list">
    <li><a class="active" href="#section-one">Section One</a></li>
    <li><a href="#section-two">Section Two</a></li>
    <li><a href="#section-three">Section Three</a></li>
  </ol>
  <a class="toc-cta" href="/contact">Get in touch →</a>
</aside>
```

Mobile version:

```html
<nav class="mobile-toc" aria-label="Article table of contents">
  <details>
    <summary>On the page</summary>
    <a href="#section-one">Section One</a>
    <a href="#section-two">Section Two</a>
    <a href="#section-three">Section Three</a>
  </details>
</nav>
```

### Article Content

The article body should be semantic and readable.

Recommended markup:

```html
<article class="article-content">
  <section id="section-one">
    <p>Intro paragraph with an <a href="/internal-link">inline link</a>.</p>
    <p>Additional paragraph text.</p>
  </section>

  <section id="section-two">
    <h2>Section Two Heading</h2>
    <p>Body content.</p>
  </section>

  <section id="section-three">
    <h2>Section Three Heading</h2>
    <p>Body content.</p>
  </section>
</article>
```

Article typography rules:

```css
.article-content p {
  margin: 0 0 1rem;
  font-size: var(--article-body-size, 16px);
  line-height: 1.65;
  color: var(--color-text-muted);
}

.article-content h2 {
  margin: 3rem 0 1rem;
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  line-height: 1.05;
  color: var(--color-text);
}

.article-content a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

---

## Shared Components

### Navbar

Use the target site's real navbar if available.

If building from scratch:

```text
Navbar
  Left: Logo
  Center: Navigation links
  Right: Login / primary CTA
```

Behavior:

- Sticky at top.
- Add subtle background, blur, or shadow after scrolling.
- Collapse center links on mobile.

Scroll-state JavaScript:

```js
const nav = document.querySelector("[data-nav]");

function updateNav() {
  nav.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });
```

### CTA Section

Use this before the footer on both pages.

Structure:

```text
CTASection
  Left:
    Heading
    Primary button
  Right:
    Feature item 1
    Feature item 2
```

Markup:

```html
<section class="cta-section">
  <div class="cta-inner">
    <div>
      <h2>Start Building With [Brand]</h2>
      <a class="button" href="/contact">Get a demo</a>
    </div>
    <div class="cta-features">
      <a class="cta-feature" href="/docs">
        <span class="cta-icon" aria-hidden="true">&lt;/&gt;</span>
        <span>
          <strong>Designed for Developers</strong>
          <small>Check our docs</small>
        </span>
      </a>
      <a class="cta-feature" href="/security">
        <span class="cta-icon" aria-hidden="true">✓</span>
        <span>
          <strong>Built for Compliance</strong>
          <small>Learn more</small>
        </span>
      </a>
    </div>
  </div>
</section>
```

### Footer

Use the existing site footer when available.

If building from scratch:

```text
Footer
  Logo
  Column: Industries
  Column: Products
  Column: Resources
  Column: Company
  Bottom legal text
```

Footer should be brand-aware. It may be dark, light, minimal, or detailed depending on the site.

---

## Essential JavaScript

### Archive Category Filtering

```js
const filter = document.querySelector("[data-category-filter]");
const cards = [...document.querySelectorAll("[data-category]")];

filter.addEventListener("change", (event) => {
  const selected = event.target.value;

  cards.forEach((card) => {
    const shouldShow = selected === "all" || card.dataset.category === selected;
    card.hidden = !shouldShow;
  });
});
```

### Blog Post Scroll Spy

```js
const tocLinks = [...document.querySelectorAll("[data-toc-link]")];
const sections = tocLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    tocLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-22% 0px -55% 0px",
    threshold: [0.12, 0.35, 0.65]
  }
);

sections.forEach((section) => spy.observe(section));
```

### Optional Section Reveal

```js
const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".article-content section").forEach((section) => {
  reveal.observe(section);
});
```

---

## Design Token Contract

Before styling the template, define these tokens from the target website:

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f7f7f5;
  --color-text: #111111;
  --color-text-muted: #5f6462;
  --color-accent: #18b957;
  --color-border: rgba(0, 0, 0, 0.12);

  --font-body: Inter, system-ui, sans-serif;
  --font-heading: Inter, system-ui, sans-serif;

  --radius-card: 16px;
  --radius-media: 16px;
  --radius-pill: 999px;

  --container: 1120px;
  --article-width: 700px;
  --shadow-card: 0 18px 48px rgba(0, 0, 0, 0.12);
}
```

When adapting to another site, replace only the tokens and component styling. Preserve the information architecture, semantic markup, and interactions unless the site has a better native pattern.

---

## Implementation Rules

1. Use semantic HTML: `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`.
2. Make the whole blog card clickable, with a clear accessible label.
3. Do not hide essential content behind hover.
4. Keep body text readable with a line height between `1.55` and `1.8`.
5. Use responsive grids instead of fixed pixel layouts.
6. Use sticky sidebar navigation only on desktop.
7. Use a collapsible or inline table of contents on mobile.
8. Highlight the active article section on scroll.
9. Use the existing site header/footer if they exist.
10. Keep the blog system visually native to the target website.

---

## Builder Checklist

Before finishing, verify:

- Archive page renders all posts.
- Category filtering works.
- Featured post links to a detail page.
- Blog cards link correctly.
- Post page sidebar links scroll to the right sections.
- Active sidebar section updates while scrolling.
- Navbar scroll state works.
- Mobile layout has no overlapping text.
- Mobile article TOC is usable.
- CTA and footer appear on both pages.
- Images have useful alt text or empty alt text when decorative.
- Page works without JavaScript for basic reading and navigation.

---

## Adaptation Instructions For Any New Website

When applying this template to a different website, ask for or infer:

- Brand name
- Existing color tokens
- Typography
- Header/nav structure
- Footer structure
- Blog categories
- Post data source
- CTA destination
- Image style
- Whether the site uses static HTML, React, Next.js, Webflow, Shopify, WordPress, or another stack

Then build the same structure using that platform's conventions.

For React/Next.js, split into:

```text
components/
  Navbar.tsx
  BlogCard.tsx
  BlogGrid.tsx
  BlogFilter.tsx
  ArticleHeader.tsx
  SidebarNav.tsx
  ArticleContent.tsx
  CTASection.tsx
  Footer.tsx

pages or app routes/
  /blog
  /blog/[slug]
```

For static HTML, keep:

```text
index.html
blog-post.html
styles.css
script.js
```

For CMS-backed sites, the data model should be:

```js
Post {
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  excerpt?: string;
  author?: string;
  featuredImage?: Image;
  body: RichText | Markdown | HTML;
  tableOfContents?: Heading[];
}
```

---

## Minimal Static HTML Skeleton

Use this only as a starting point. The visual design should be replaced by the target website's design system.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog Template</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-nav" data-nav>
      <a class="logo" href="/">Brand</a>
      <nav>
        <a href="/industries">Industries</a>
        <a href="/products">Products</a>
        <a href="/resources">Resources</a>
      </nav>
      <a class="button" href="/contact">Contact</a>
    </header>

    <main>
      <!-- Blog archive OR blog post content goes here. -->
    </main>

    <section class="cta-section">
      <h2>Start Building With Brand</h2>
      <a class="button" href="/contact">Get a demo</a>
    </section>

    <footer class="site-footer">
      <a class="logo" href="/">Brand</a>
      <nav>
        <a href="/blog">Blog</a>
        <a href="/docs">Docs</a>
        <a href="/company">Company</a>
      </nav>
    </footer>

    <script src="/script.js"></script>
  </body>
</html>
```

