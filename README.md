# M.Power Engineering — Public Website

The public website for M.Power Engineering, an electronics and electrical engineering training center in Bangladesh. Visitors can see courses with fees and class counts, instructors, the photo gallery, updates and notices, success stories and FAQs, and can send a message. They never log in.

All content comes from the **Admin Dashboard** (the separate `mpower-admin` project). Both projects use the same Supabase project, so nothing is entered twice.

```
Visitor ──► Cloudflare Pages
              ├─ static files (free, unlimited)          every normal page
              └─ 3 tiny Functions (Workers free tier)    link previews for course,
                                                         update and album pages,
                                                         sitemap.xml, robots.txt
                        │
                        ▼
            Supabase (free): reads published rows only, through Row Level Security
```

There is no server to rent and no paid API. The site works on the free `your-project.pages.dev` address; a domain is optional.

---

## Contents

1. [What visitors get](#what-visitors-get)
2. [How it is built](#how-it-is-built)
3. [Project structure](#project-structure)
4. [Deployment: 21 steps](#deployment-21-steps)
5. [Editing the fixed texts](#editing-the-fixed-texts)
6. [Privacy and security](#privacy-and-security)
7. [Free-tier budget](#free-tier-budget)
8. [Troubleshooting](#troubleshooting)

---

## What visitors get

- **Bangla first, English one tap away.** The switch (বাংলা | English) is at the top of every page, including on phones. The choice is remembered in the browser, and `?lang=en` on any link opens the English version. Interface text, course content, updates, FAQs and contact details all switch language. If the admin filled in only one language for an item, that language is shown instead of an empty space.
- **Answers to the first questions on the home page.** What is taught, the joining-fee range, course length in classes, and where the center is. These are calculated from the real course list; there are no invented counters.
- **Pages:** `/`, `/about`, `/courses`, `/courses/<name>`, `/instructors`, `/gallery`, `/gallery/<album>`, `/updates`, `/updates/<name>`, `/success-stories`, `/faq`, `/contact` and `/privacy`.
- **Readable addresses**, for example `/courses/industrial-automation`, created automatically by the database.
- **Contact:** phone, WhatsApp (with a pre-filled message from course pages), email, Facebook, Messenger and opening hours. There is a free Google Maps embed that loads only when tapped, and a form that saves straight to the Admin Dashboard's Messages page.
- **Gallery:** albums with category filters, a masonry grid of small thumbnails, and a photo viewer that supports the keyboard, swiping and screen readers. Full-size photos download only when opened.
- **Link previews.** Sharing a course or update on Facebook or WhatsApp shows its title, a short description and its cover image.

## How it is built

| Part | Choice | Why |
|---|---|---|
| UI | React 18, TypeScript (strict), Tailwind CSS | Small, typed, consistent |
| Build | Vite, fully static | Cloudflare serves static files for free |
| Data | A ~80-line `fetch` client for Supabase's REST API | Replaces supabase-js; the home page's JavaScript is about 80 KB gzipped |
| Fonts | IBM Plex Sans / Plex Sans Condensed + Hind Siliguri for Bangla | Engineering-document feel; proper Bangla rendering |
| SEO | Per-page titles, descriptions, Open Graph, canonical, hreflang, JSON-LD, sitemap, robots | See below |

**How metadata reaches search engines and link previews:**

- **Fixed pages** (Home, About, Courses…) get their own `about.html`, `faq.html`, etc. at build time, with the right title and description already in the HTML.
- **Course, update and album pages** pass through a small Pages Function. It reads that one record from Supabase and writes its title, description, image and structured data into the HTML before sending it. If Supabase is slow (over 2.5 s) or down, the normal page is sent unchanged and loads its data in the browser.
- **`/sitemap.xml`** is generated live from the database, so new courses and updates are listed without a rebuild.
- **`/robots.txt`** allows indexing on the main address. When a custom domain is set, it asks search engines to ignore the `*.pages.dev` copy, so results are not split across two addresses.

**Visual identity.** Deep navy with a faint engineering grid, white surfaces, electric-cyan traces and a green "status LED" accent. The hero is an IC package whose output traces run to the center's real course names, with an oscilloscope strip (square pulses turning into a sine wave) underneath. That single animation runs once on load. Down the home page, a trace connects the sections, and each section's node lights once as it scrolls into view. Everything respects the "reduce motion" setting.

---

## Project structure

```
mpower-website/
├── functions/                  Cloudflare Pages Functions (only these URLs run code)
│   ├── _lib.ts                 Supabase read, head injection, caching, fallbacks
│   ├── courses/[slug].ts       Link preview + Course structured data
│   ├── updates/[slug].ts       Link preview + NewsArticle structured data
│   ├── gallery/[slug].ts       Link preview for albums
│   ├── sitemap.xml.ts
│   └── robots.txt.ts
├── public/
│   ├── _headers                Security headers (CSP etc.) and caching
│   ├── _routes.json            Limits Functions to the URLs above
│   ├── favicon.svg
│   └── og-default.png          Preview image when an item has no photo
├── src/
│   ├── assets/
│   ├── components/             CourseCard, UpdateCard, GalleryGrid, Lightbox, LanguageSwitcher,
│   │   ├── layout/             Navbar, Footer, ContactForm, FAQAccordion, InstructorCard,
│   │   ├── home/               SuccessStoryCard, AlbumCard, ContactDetails, MapEmbed,
│   │   ├── decor/              ShareButtons; hero schematic, waveform, placeholders
│   │   └── ui/                 Section (trace rail), PageHeader, Img, Icon, feedback states
│   ├── pages/                  One file per route (all except Home are loaded on demand)
│   ├── lib/
│   │   ├── api.ts              Read-only REST client + contact insert
│   │   ├── i18n/               bn.ts (default), en.ts — all interface text
│   │   └── seo/                routes.json (page titles), head.ts (shared with Functions)
│   ├── services/               courses, content, updates, gallery, contact
│   ├── hooks/                  useData (cache), useSeo, useSettings, useDialog, useInView
│   ├── types/                  Public row types
│   └── utils/                  Text (paragraphs, safe links), contact links, cn
├── .env.example
└── vite.config.ts              Also writes the per-page HTML files after the build
```

---

## Deployment: 21 steps

You need a computer, a free GitHub account, a free Cloudflare account and the Supabase project that the Admin Dashboard already uses. If the Admin Dashboard is not set up yet, do that first by following its README. This takes about 45 minutes.

### Part A: Your computer

**1. Install Node.js.** Download the LTS version (20 or newer) from <https://nodejs.org>. Then check it in a terminal:

```bash
node -v
npm -v
```

**2. Get the code.** Install Git from <https://git-scm.com>, then either clone your repository:

```bash
git clone https://github.com/<you>/mpower-website.git
cd mpower-website
```

or unzip the project folder, open a terminal inside it, and run `git init`.

**3. Install the dependencies.**

```bash
npm install
```

### Part B: Supabase (shared with the Admin Dashboard)

**4. Create the Supabase project.** Skip this if the Admin Dashboard already has one, because both must use the **same** project. Otherwise, sign up at <https://supabase.com>, choose **New project**, and pick the region **Southeast Asia (Singapore)**.

**5. Configure the database.** In **SQL Editor**, run the Admin Dashboard's migrations in order: `001` to `005`, plus **`006_public_site.sql`**, which the website needs. Migration 006 adds:

- the readable web addresses (slugs)
- the About-page text and map fields in Settings
- protection against floods of contact-form messages

Run each file once. Re-running 006 on a database that already has it will fail harmlessly with "already exists".

**6. Check the public access rules (RLS).** These were created by migration `003_rls_policies.sql`; you don't write any. To confirm, open **Authentication → Policies** (or **Database → Policies**). Visitors (the `anon` role) should only be able to read:

- courses whose status is *Active* or *Upcoming*
- published albums and their photos
- published updates whose publish date has passed
- active instructors, published success stories and FAQs
- site settings

They may *insert* into `contact_messages` (five columns only) and cannot read messages back. Students, enrollments, attendance, admins and the activity log have no `anon` access at all.

**7. Check the storage buckets.** Migration `004_storage.sql` created them. Under **Storage** you should see `public-media` (public; course, gallery, instructor, update and story images) and `student-photos` (private; never used by the website). Nothing else is needed.

**8. Add the environment variables locally.** Copy `.env.example` to `.env.local` and fill it in from **Project Settings → API**:

```bash
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...        # anon / publishable key, safe to expose
VITE_SITE_URL=                              # leave empty for now
```

Never put the `service_role` key here. `.env.local` is in `.gitignore`.

**9. Run it locally.**

```bash
npm run dev
```

Open <http://localhost:5173>. You should see the courses and settings entered in the Admin Dashboard. Then try a production build:

```bash
npm run build
npm run preview
```

### Part C: GitHub

**10. Create a GitHub repository.** On GitHub choose **New repository**, name it `mpower-website`, and make it **Private** or Public. The code has no secrets; private just keeps it tidy. Don't add a README.

**11. Push the code.**

```bash
git add .
git commit -m "Public website"
git branch -M main
git remote add origin https://github.com/<you>/mpower-website.git
git push -u origin main
```

Check on GitHub that **no** `.env.local` file was uploaded.

### Part D: Cloudflare Pages

**12. Create the Pages project.** In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages**.

**13. Connect GitHub.** Choose **Connect to Git**, authorise Cloudflare to see the repository, and select `mpower-website`.

**14. Configure the build.**

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(empty)* |

The `functions/` folder is detected and deployed automatically. `public/_routes.json` makes sure only the course, update and album pages, the sitemap and robots.txt use it. Everything else is a free static file.

**15. Add the environment variables.** Under **Settings → Variables and Secrets**, add these to both **Production** and **Preview**. They are read by the build *and* by the Functions.

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | your Project URL |
| `VITE_SUPABASE_ANON_KEY` | the anon / publishable key |
| `VITE_SITE_URL` | `https://<project>.pages.dev` for now (no trailing slash) |
| `NODE_VERSION` | `20` |

`VITE_SITE_URL` makes canonical links, the sitemap and social preview images use full addresses. Facebook and WhatsApp need these.

**16. Deploy.** Click **Save and Deploy**. After about a minute the site is live at `https://<project>.pages.dev`. Check that:

- a course page loads
- the language switch works
- a test message from the contact form appears in the Admin Dashboard under **Messages**

### Part E: Your own domain (optional)

The site works permanently on the free `pages.dev` address. A domain like `mpowerengineer.org` must be bought from a registrar; registration is never free.

**17. Add the custom domain.** In the Pages project, go to **Custom domains → Set up a custom domain**, enter `mpowerengineer.org` (and/or `www.mpowerengineer.org`), and follow the prompts.

**18. Configure DNS through Cloudflare.**

- *If the domain already uses Cloudflare DNS*, Cloudflare adds the record for you. HTTPS is issued automatically within minutes.
- *If it doesn't*, add the domain to Cloudflare (**Add a site**, Free plan). Then, at your registrar, replace the nameservers with the two Cloudflare shows you. This can take a few hours. Return to step 17 once the domain shows as **Active**.
- To use only a subdomain without moving nameservers, add a `CNAME` record at your current DNS provider: `www` → `<project>.pages.dev`.

Then change `VITE_SITE_URL` to `https://mpowerengineer.org` (step 15) and choose **Deployments → Retry deployment**. In **Google Search Console** (free), add the domain and submit `https://mpowerengineer.org/sitemap.xml`.

### Part F: Running the site

**19. Update content through the Admin Dashboard.** Everything visitors see is edited there. Changes appear on the website within about five minutes, and immediately for new visitors. No rebuild is needed.

| On the website | In the Admin Dashboard |
|---|---|
| Courses, fees, classes, duration, class days, photo | Courses (Active or Upcoming are shown; Inactive, Completed and Archived are hidden) |
| Updates and notices | News & updates. Turn on **Published**; a future publish date schedules it |
| Gallery | Gallery: create an album, upload photos, turn on **Published**, choose a cover |
| Instructors | Instructors. **Active** ones are shown, in the order you set |
| Success stories | Success stories. Only **Published** ones are shown |
| FAQ | FAQ. Only **Published** ones are shown, in order |
| Phone, WhatsApp, email, address, hours, links, hero text, footer line | Settings → Website settings |
| About page text | Settings → About page |
| Map on the contact page | Settings → Links → *Map on the contact page*. Paste Google Maps → Share → **Embed a map** → Copy HTML |
| Contact-form messages | Messages |

Fill in **both** English and Bangla where you can. If one is empty, the website shows the other language rather than leaving a gap.

**20. Monitor Supabase usage.** In Supabase, open **Organization → Usage** (or **Project → Reports**) about once a month. The numbers that matter on the free plan are:

| Metric | Free limit | What uses it here |
|---|---|---|
| Database size | 500 MB | Text only. Thousands of updates and messages are still a few MB |
| Storage size | 1 GB | Photos (see step 21) |
| Egress (data sent out) | 5 GB / month | Mostly photo views. Thumbnails are about 30 KB, full photos 150–400 KB, opened only on tap |
| Monthly active users | 50,000 | Not used: visitors don't log in |

Supabase emails the owner when a project approaches a limit. Free projects also pause after about a week with **no activity at all**. Daily use of the Admin Dashboard prevents this; if it happens, click **Restore** in Supabase.

On Cloudflare, **Workers & Pages → your project → Metrics** shows Function requests. The free tier allows 100,000 per day; only course, update and album pages, the sitemap and robots.txt count.

**21. Keep image storage under 1 GB.**

- Upload through the Admin Dashboard only. It resizes every photo in the browser before upload (gallery 1600 px plus a 480 px thumbnail, around 200–400 KB in total per photo), so about 2,500 or more gallery photos fit in 1 GB.
- Each album page in the Admin Dashboard shows its total size. Check the largest ones once a term.
- Don't upload near-duplicates. Pick the best 15–30 photos of an event rather than all 200.
- Delete old albums you no longer need from the Admin Dashboard (this also deletes the files). Download them first with the Admin project's `npm run backup:storage` if you want to keep them.
- Supabase → **Storage** shows the exact space used per bucket.

---

## Editing the fixed texts

Interface wording lives in `src/lib/i18n/bn.ts` (Bangla, the default) and `src/lib/i18n/en.ts`. Both files have the same structure; TypeScript stops the build if a translation is missing.

Lines marked **`// REVIEW`** describe the center itself. These include the "Why M.Power Engineering" points, the About-page sections, the instructors' introduction and the "usually reply within one working day" promise. **Check that every sentence is true before going live**, and change anything that isn't.

Page titles and descriptions for search engines are in `src/lib/seo/routes.json`.

## Privacy and security

- **Visitors' data.** The only personal data handled is what someone types into the contact form. It goes to `contact_messages` through an insert-only permission on five columns. Visitors can never read messages, including their own. A hidden honeypot field and a minimum fill time stop simple bots, and the database rejects duplicates and bursts. The `/privacy` page explains this in both languages.
- **No accounts, no trackers.** There are no analytics, advertising or social-network scripts. Share buttons are plain links. Only the language preference and a cached copy of the public settings are stored in the browser.
- **Private data stays private.** The site never queries students, enrollments, attendance, admins or the activity log. Row Level Security would refuse it anyway.
- **Headers** (`public/_headers`): a strict Content Security Policy (scripts only from this site; images only from this site and Supabase; frames only from Google Maps), no framing of the site, HSTS, nosniff and a restrictive Permissions-Policy. If you ever give Supabase a custom domain, add it to `img-src` and `connect-src`.
- **Safe content.** Admin-entered text is shown as plain text; only `http(s)` links are made clickable, and they open with `rel="noopener noreferrer nofollow"`. The map accepts only Google's embed URLs.

## Free-tier budget

| Resource | Typical use for this site |
|---|---|
| Cloudflare Pages static requests | Free and unlimited |
| Cloudflare Functions | One per visit to a course, update or album page (plus crawlers). Well under 100,000/day |
| Supabase reads | Each page makes 1–7 small requests. Results are cached in the browser for 5 minutes, and Functions cache their reads for 1–5 minutes |
| Supabase storage / egress | Thumbnails everywhere; full photos only in the viewer; the map loads only on tap |

There are no realtime subscriptions and no polling.

## Troubleshooting

| Problem | Fix |
|---|---|
| Pages show "This section could not load" | Check `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in Cloudflare, then redeploy (they are built into the files). Check the Supabase project isn't paused. |
| Courses are missing | Only *Active* and *Upcoming* courses are public. Check the status in the Admin Dashboard. |
| An update doesn't appear | It must be **Published** and its publish date must have passed (Bangladesh time). |
| An album doesn't appear | It must be **Published** and contain at least one photo. |
| Facebook shows an old preview | Paste the link into <https://developers.facebook.com/tools/debug/> and click **Scrape again**. |
| Preview image missing | Set `VITE_SITE_URL` (step 15) and redeploy. Give the update or course a cover image. |
| Course pages show the generic title when shared | Make sure the `functions/` folder was deployed (Pages → Functions tab) and migration 006 was run (it creates the slugs). |
| Map doesn't show | The link must start with `https://www.google.com/maps/embed?`. Use **Embed a map**, not the normal share link. |
| "Cannot find module @rollup/rollup-…" during `npm run build` | A known npm bug. Delete `node_modules` and `package-lock.json`, then run `npm install` again. |
| Run all type checks | `npm run typecheck` (site and Functions) |
