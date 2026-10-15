# Dwayne “The Rock” Johnson — fan & information website

Static site: open `index.html` in a browser, or upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, classic FTP hosting). No build step, no database.

## Administration

Everything editable lives in one file: `assets/js/content.js`.

| To change… | Edit in `content.js` |
| --- | --- |
| Any photo | the slot's `photo` (library key) or `image` (your own file) — see Images below |
| Film cards (title, year, role, details, poster) | `films` |
| Career timeline | `timeline` |
| Business cards | `business` |
| Gallery photos and categories | `gallery` |
| News articles (3 to 6) | `news` — set `url` to link to a source, or leave it empty to open `body` in a panel |
| Social links | `social` — official, verified accounts only |
| Contact form, requests, notifications | see "Contact form and requests" below |
| Legal positioning | `affiliated` (see below) |

### Images

Every image slot is filled from the **photo library** at the top of `content.js` (`photos`):
36 freely licensed or public-domain photographs hosted by Wikimedia Commons, each stored with its
author, licence and real caption. Attribution is listed in the
"Legal notice" panel linked from the footer — keep that panel public, the CC licences require it.

**Replacing an image**

- With another library photo: change the slot's key, e.g. `photo: "venice_carpet"`.
- With your own file: put it in `assets/img/` and add `image: "assets/img/hero.jpg"` to the slot.
  `image` always wins over `photo`. Add `credit: "Photographer / Agency"` if the licence asks for it.
- Adjust the crop with `focus: "50% 20%"` (horizontal, vertical point that must stay visible).
  Pictures are only ever cropped, never stretched.
- Add a library photo: on its Commons page, copy the part of the "Original file" address after
  `/commons/` into `path`, then fill in `author`, `license` and `caption`.

If a picture fails to load, the slot falls back to a designed dark panel rather than a broken image.

**Formats and ratios for your own files**

| Slot | Ratio | Recommended size | Notes |
| --- | --- | --- | --- |
| Hero (desktop) | 16:9 or 3:2 | 2400 × 1350 | subject on the right half, calm area on the left for the title |
| Hero (phone, `photoMobile`) | 4:5 | 1200 × 1500 | face in the upper half |
| About portrait | 4:5 | 1200 × 1500 | |
| Film cards | 2:3 | 800 × 1200 | |
| Timeline steps | 16:10 | 1200 × 750 | |
| Business banner | 21:8 | 2100 × 800 | shown 16:10 on phones |
| Philanthropy background | 16:9 | 2400 × 1350 | subject on the left, text sits on the right |
| Gallery tiles | 3:4, 4:3, 1:1 or 16:9 | 1200 px long side | set the tile shape with `ratio` |
| News cards | 16:10 | 1200 × 750 | |

Export as WebP or JPEG (quality ≈ 80, under ~300 KB; hero under ~500 KB). Avoid PNG for photographs.

**Rights**

Film posters, stills and agency/press photos are copyrighted, so none are used: film cards show a
licensed photograph of Dwayne Johnson instead, with its true caption in the details panel. Use an
official visual only if you have cleared it. The library photos are currently loaded directly from
Wikimedia's servers; for a production site, download the ones you keep into `assets/img/` (same
attribution) so the site does not depend on a third-party host.

### Performance

- On Vercel, library photos are served through Vercel Image Optimization (`vercel.json` → `images`):
  AVIF/WebP, resized to the widths listed there, cached on the CDN. `assets/js/images.js` builds the
  addresses and must use the same width list. If the optimizer refuses a picture, the page falls back
  to the Wikimedia thumbnail. Set `imageOptimizer: false` in `content.js` to switch it off.
- Only the hero picture is preloaded (a portrait version on phones); every other picture is lazy-loaded
  and fades in over a fixed-ratio panel, so nothing moves while the page loads.
- Your own files in `assets/img/` are served as they are: export them as WebP at the sizes above.
- There is no build step, so CSS and JavaScript are not minified; Vercel compresses them (Brotli) and
  `vercel.json` sets the browser cache (1 hour for `assets/`, 30 days for `assets/img/`).

### Contact form and requests

`contact.html` sends each request to `/api/contact`, which stores it and e-mails a notification.
`admin.html` (also `/admin`; not linked from the menu, not indexed) lists the requests: search, filter by category
and read/unread, mark as read/unread, delete, export to CSV. Requests older than 12 months are
deleted automatically when the list is opened (`RETENTION_DAYS` to change it).

These functions only run on **Vercel** (not on GitHub Pages) and need the settings below, added in
Vercel → Project → Settings → Environment Variables, followed by a redeploy. Until the storage is
connected, the form answers "not available at the moment".

| Setting | What it is |
| --- | --- |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Storage. Added automatically by Vercel → Storage → Upstash for Redis → connect to the project |
| `ADMIN_PASSWORD` | Password of `admin.html` (also reachable at `/admin`). Choose a long, unique one. Signing in opens a session cookie (HttpOnly, Secure, SameSite=Strict) that ends after 30 min of inactivity or 8 h; 5 wrong attempts lock sign-in for 15 min |
| `RESEND_API_KEY` | Key from resend.com, for the notification e-mail (optional: without it, requests are stored but no e-mail is sent) |
| `ADMIN_EMAIL` | Address that receives the notifications. Never shown on the site |
| `MAIL_FROM` | Optional sender, e.g. `Website <contact@your-domain.com>`, once your domain is verified in Resend |

Anti-spam: hidden trap field, minimum fill time, and 5 requests per 10 minutes per visitor.
The privacy policy (`privacy.html`) is a starting template: have it checked, and set who operates
the site in `contact.operator` in `content.js`.

Local preview with a temporary in-memory store: `node .claude/serve.js`, then `sh .claude/test-api.sh`.

### Legal positioning

`affiliated: false` (default) presents the site as an **independent fan & information website** and
prints the non-affiliation disclaimer in the footer. Switch it to `true` only with written
authorisation from Dwayne Johnson or his representatives.

### Before publishing

- Check every fact and date in `news`, `films`, `timeline` and `business` against a reliable source.
- Philanthropy text intentionally contains no figures or named partnerships; add them only with a source.
- Add a contact e-mail so rights holders can reach you.
