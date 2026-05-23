# Product Spec Doc — Ryan Kroge | SBA Loan Specialist Website

## 1. Product Overview

**Product Name:** Ryan Kroge — SBA Loan Specialist  
**Type:** Professional lead-generation and service website  
**Stack:** React 19 + Vite + TypeScript + Tailwind CSS v4 + Supabase + Retell AI  
**Deployment:** Vercel (with serverless API routes)  
**Live URL:** https://www.ryankroge.com/

Ryan Kroge is an SBA loan specialist. This website serves as his primary digital presence — educating prospective clients about SBA loans, business acquisition financing, and strategic financial guidance, while capturing leads and enabling direct contact via form submission, calendar booking, and AI-powered phone calls.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Generate qualified leads | Contact form submissions, AI call initiations |
| Educate prospects | Time on page (SBALoan, BusinessAcquisition pages) |
| Build trust | Testimonials displayed, Resources published |
| Enable immediate engagement | Retell AI outbound calls triggered from Contact page |
| Support content management | Admin page for creating/editing Resources posts |

---

## 3. Pages & Routes

### 3.1 Home (`/`)
**Purpose:** Hero landing page that introduces Ryan and drives visitors to services or contact.

**Key Sections:**
- **Hero** — Headline: *"Get the Capital to Scale Your Business Fast."* with CTAs: `START YOUR APPLICATION` and `EXPLORE SERVICES`
- **A Clear Path to Funding** — Animated step-by-step process (mobile & desktop variants)
- **Strategic Funding Solutions** — Services overview grid (SBA Loans, Business Acquisition, Strategic Financial Guidance)
- **A More Strategic Lending Partner** — Value proposition with differentiators
- **Testimonials** — Rotating carousel with prev/next navigation and dot indicators
- **Experienced Guidance** — Secondary value prop section
- **FAQ Accordion** — Common questions (e.g. "How long does SBA financing take?", "What do I need to qualify?")
- **Business Acquisition CTA** — Pre-final push: *"Buying a Business Starts With the Right Financing Strategy"*
- **Final CTA** — *"Ready to Explore Your Funding Options?"* with `START YOUR APPLICATION` + `BOOK A CALL` buttons

**Interactions to test:**
- Hero CTA buttons navigate correctly
- `EXPLORE SERVICES` anchor scrolls to `#services`
- Testimonial carousel prev/next navigation works, dots update
- FAQ accordion opens/closes one item at a time
- Step animation advances through steps correctly

---

### 3.2 About (`/about`)
**Purpose:** Builds personal trust and credibility for Ryan Kroge.

**Key Sections:**
- Bio and background
- Professional credentials and experience
- Philosophy / approach

**Interactions to test:**
- Page loads and renders correctly
- Navigation links are functional
- Responsive layout on mobile/tablet/desktop

---

### 3.3 SBA Loans (`/sba-loans`)
**Purpose:** Deep-dive educational page on SBA loan products Ryan specializes in.

**Key Sections:**
- Hero with page headline
- Loan types explained (SBA 7(a), SBA 504, etc.)
- Eligibility criteria
- Process overview
- CTA to Contact page

**Interactions to test:**
- Page loads and all sections render
- CTA buttons navigate to `/contact`
- Responsive layout

---

### 3.4 Business Acquisition (`/business-acquisition`)
**Purpose:** Educates buyers on using SBA financing to acquire businesses.

**Key Sections:**
- Hero
- Why SBA for acquisitions
- How the process works
- Deal structure guidance
- CTA to contact

**Interactions to test:**
- Page loads correctly
- CTA buttons functional
- Responsive layout

---

### 3.5 Strategic Financial Guidance (`/strategic-financial-guidance`)
**Purpose:** Describes Ryan's advisory and consulting services beyond direct lending.

**Key Sections:**
- Hero
- Services breakdown
- Who this is for
- CTA

**Interactions to test:**
- Page loads and renders
- CTAs navigate correctly

---

### 3.6 Contact (`/contact`)
**Purpose:** Primary lead capture and engagement page. Multiple pathways to connect with Ryan.

**Key Sections:**

#### Book a Call (Cal.com Integration)
- Embedded calendar booking widget
- Users can schedule a meeting with Ryan

#### AI Phone Call (Retell AI Integration)
- Section: *"Get an Instant AI Callback"*
- Fields: Name, Phone Number
- Button: `Start AI Call`
- On submit: POSTs to `/api/retell/create-call`, triggers outbound call to user's phone within seconds
- Inbound number displayed: **(947) 218-1845**

#### Contact Form (`#contact-form`)
- Fields: First Name, Last Name, Email, Phone, Loan Purpose (dropdown), Message, Privacy consent checkbox
- Submit button with loading state
- Success state: Confirmation message shown
- Error state: Error message shown
- Rate limiting: Blocks re-submission within a cooldown window
- Submits lead to Supabase database and sends notification email via Resend

**Interactions to test:**
- Contact form: Fill and submit with valid data → success state shown
- Contact form: Submit with missing required fields → inline validation errors shown
- Contact form: Rate limit triggers after multiple rapid submissions
- AI Call section: Enter name + valid phone → `Start AI Call` triggers correctly
- AI Call section: Missing/invalid phone → validation error shown
- Cal.com widget: Renders and is interactable
- Anchor link `#contact-form` scrolls correctly from top-of-page CTA

---

### 3.7 Resources (`/resources`)
**Purpose:** Blog/resource listing page showing published guides and articles.

**Key Sections:**
- Grid/list of resource post cards
- Each card links to its individual post

**Interactions to test:**
- Page loads with published posts
- Clicking a resource card navigates to `/resources/:slug`
- Layout is responsive

---

### 3.8 Resource Post (`/resources/:slug`)
**Purpose:** Individual blog post / resource article view.

**Key Sections:**
- Post title, author, date
- Rich text body content (rendered from Supabase)
- Back navigation to `/resources`

**Interactions to test:**
- Valid slug loads the correct post
- Invalid slug shows 404 or redirect
- Back button returns to `/resources`

---

### 3.9 Admin (`/admin`)
**Purpose:** Password-protected admin panel for Ryan to manage Resources posts.

**Key Sections:**
- Login/authentication gate
- Post list (create, edit, delete)
- Rich text editor (TipTap) for post body
- Publish/draft toggle

**Interactions to test:**
- Unauthenticated access is blocked
- Login with valid Supabase credentials grants access
- Create new post → appears in list
- Edit existing post → changes persist
- Delete post → removed from list
- Rich text editor renders and accepts input

---

## 4. Global Components

### Navbar
- Logo links to `/`
- Navigation links: Home, About, SBA Loans, Business Acquisition, Strategic Financial Guidance, Resources, Contact
- Mobile hamburger menu opens/closes nav drawer
- Active route is highlighted

**Interactions to test:**
- All nav links navigate to correct routes
- Mobile menu opens and closes
- Active state reflects current page

### Footer
- Links to all main pages
- Contact info (phone, email)
- Social links (LinkedIn, etc.)

**Interactions to test:**
- All footer links are functional
- External links open in new tab

---

## 5. Integrations

| Integration | Purpose | Trigger |
|---|---|---|
| **Supabase** | Database for leads & resources | Contact form submit, Admin CRUD |
| **Retell AI** | AI outbound phone calls | "Start AI Call" button on Contact page |
| **Cal.com** | Calendar booking | Embedded widget on Contact page |
| **Resend** | Transactional email (lead notifications) | Contact form submit (via Supabase Edge Function) |
| **Google Analytics 4** | Page analytics | All page views |

---

## 6. Authentication

- **Admin page** (`/admin`) is protected by Supabase Auth
- All other pages are publicly accessible
- No user registration/login flow for public visitors

---

## 7. Responsive Behavior

The site must be fully responsive across:
- **Mobile:** 375px – 767px
- **Tablet:** 768px – 1023px
- **Desktop:** 1024px+

Key responsive notes:
- Hero section has separate mobile and desktop variants (different layouts rendered with CSS show/hide)
- Navbar collapses to hamburger menu on mobile
- Service cards stack vertically on mobile

---

## 8. Non-Functional Requirements

| Requirement | Detail |
|---|---|
| Page load | All pages should load within 3 seconds on a standard connection |
| Accessibility | Interactive elements must have proper aria-labels |
| SEO | Each page has unique `<title>` and `<meta description>` via `react-helmet-async` |
| Security | Retell & Resend API keys are server-side only, never exposed in frontend bundle |
| Rate limiting | Contact form submission is rate-limited client-side |

---

## 9. Out of Scope (for frontend testing)

- Server-side Retell webhook processing
- Supabase Row Level Security policy validation
- Email delivery confirmation (Resend)
- Google Analytics event tracking accuracy
