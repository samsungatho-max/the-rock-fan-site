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
| Contact e-mail in the footer | `contact.email` |
| Legal positioning | `affiliated` (see below) |

### Images

Every image slot is filled from the **photo library** at the top of `content.js` (`photos`):
36 freely licensed or public-domain photographs hosted by Wikimedia Commons, each stored with its
author, licence and real caption. Attribution is shown under enlarged pictures and in the
"Photo credits" panel linked from the footer — keep that panel, the CC licences require it.

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

### Legal positioning

`affiliated: false` (default) presents the site as an **independent fan & information website** and
prints the non-affiliation disclaimer in the footer. Switch it to `true` only with written
authorisation from Dwayne Johnson or his representatives.

### Before publishing

- Check every fact and date in `news`, `films`, `timeline` and `business` against a reliable source.
- Philanthropy text intentionally contains no figures or named partnerships; add them only with a source.
- Add a contact e-mail so rights holders can reach you.
