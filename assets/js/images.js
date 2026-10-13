// Image addresses. Loaded in <head> right after content.js so the hero picture starts downloading
// before the rest of the page is built.
(function () {
  "use strict";
  const S = window.SITE;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  // On Vercel, library photos go through its image optimizer: AVIF/WebP, resized per screen, cached on the CDN.
  // Elsewhere (local preview, GitHub Pages) they come straight from Wikimedia's own thumbnails.
  const optimizer = S.imageOptimizer !== false && !local && !/\.github\.io$/.test(location.hostname);
  const WIKI = [330, 500, 960, 1280, 1920];
  const OPT = [320, 480, 640, 828, 1080, 1280, 1920]; // must match "images.sizes" in vercel.json
  const set = (widths, max, url) => widths.filter((n) => n <= max).map((n) => `${url(n)} ${n}w`).join(", ");

  // Resolves an image slot: a local "image" wins over a library "photo". w = largest width the slot can need.
  window.sitePic = function (o, w = 960) {
    if (o.image) return { src: o.image };
    const p = S.photos[o.photo];
    if (!p) return null;
    const file = p.path.split("/").pop();
    const thumb = (n) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${p.path}/${n}px-${file}`;
    const max = Math.min(w, p.max || w);
    const direct = { src: thumb(max), srcset: set(WIKI, max, thumb) };
    if (!optimizer) return { photo: p, file, ...direct };
    const source = encodeURIComponent(thumb(Math.min(1920, p.max || 1920)));
    const opt = (n) => `/_vercel/image?url=${source}&w=${n}&q=70`;
    const top = max <= 960 ? 1080 : max; // 1080 keeps cards sharp on high-density phones
    return { photo: p, file, src: opt(top), srcset: set(OPT, top, opt), fallback: direct };
  };

  // If the optimizer refuses an image, fall back to the Wikimedia thumbnail; if that fails too, show the dark panel.
  window.siteImgFail = function (el) {
    if (!el.dataset.fb) return el.remove();
    const picture = el.closest("picture");
    if (picture) picture.querySelectorAll("source").forEach((s) => s.remove());
    const src = el.dataset.fb, srcset = el.dataset.fbset || "";
    delete el.dataset.fb;
    el.srcset = srcset;
    el.src = src;
  };

  /* ---------- Preload the hero picture only ---------- */
  window.HERO_SIZES = "(min-width: 900px) 130vw, 100vw";
  const preload = (x, media, sizes) => {
    if (!x) return;
    const l = document.createElement("link");
    l.rel = "preload"; l.as = "image"; l.fetchPriority = "high";
    if (x.srcset) { l.imageSrcset = x.srcset; l.imageSizes = sizes; } else l.href = x.src;
    if (media) l.media = media;
    document.head.appendChild(l);
  };
  const mobile = S.hero.photoMobile && window.sitePic({ photo: S.hero.photoMobile });
  preload(window.sitePic(S.hero, 1920), mobile ? "(min-width: 701px)" : "", window.HERO_SIZES);
  preload(mobile, "(max-width: 700px)", "100vw");

  if (!optimizer) {
    const l = document.createElement("link");
    l.rel = "preconnect"; l.href = "https://upload.wikimedia.org";
    document.head.appendChild(l);
  }
})();
