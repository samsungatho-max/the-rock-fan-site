(function () {
  "use strict";
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LICENSE_URL = {
    "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
    "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
    "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
  };
  const license = (name) => LICENSE_URL[name] ? `<a href="${LICENSE_URL[name]}" target="_blank" rel="noopener license">${esc(name)}</a>` : esc(name);

  // Image addresses come from images.js; this adds the caption and attribution line.
  const pic = (o, w) => {
    const x = window.sitePic(o, w);
    if (!x) return null;
    const p = x.photo;
    x.caption = p ? p.caption : "";
    x.byline = p
      ? `${esc(p.author)} · ${license(p.license)} · <a href="https://commons.wikimedia.org/wiki/File:${x.file}" target="_blank" rel="noopener">Wikimedia Commons</a>`
      : esc(o.credit || "");
    return x;
  };
  // "sizes" tells the browser how wide each picture is displayed, so it downloads the smallest file that fits.
  const SIZES = {
    card: "(max-width: 600px) 100vw, (max-width: 1020px) 50vw, 33vw",
    film: "(max-width: 460px) 100vw, (max-width: 1020px) 50vw, 25vw",
    about: "(max-width: 860px) 100vw, 45vw",
    step: "(max-width: 760px) 90vw, 40vw",
    full: "100vw",
  };
  const img = (o, w, eager, sizes = w > 960 ? SIZES.full : SIZES.card) => {
    const x = pic(o, w), fb = x && x.fallback;
    return x
      ? `<img src="${esc(x.src)}" ${x.srcset ? `srcset="${esc(x.srcset)}" sizes="${sizes}"` : ""} ${fb ? `data-fb="${esc(fb.src)}" data-fbset="${esc(fb.srcset)}"` : ""} alt="${esc(o.alt ?? x.caption ?? o.title ?? "")}" style="object-position:${esc(o.focus || "50% 22%")}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
      : "";
  };
  const media = (o, i, label, style = "", w, sizes) =>
    `<div class="media" style="--i:${i % 7};${style}">${img(o, w, false, sizes)}<span class="media__label" aria-hidden="true">${esc(label ?? o.title)}</span></div>`;
  const paras = (list) => (list || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const fmtDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? esc(iso) : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const ICONS = {
    entertainment: '<path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.3l6-.7z"/>',
    production: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 11l6-3v8l-6-3z"/>',
    brands: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
    fitness: '<path d="M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12"/>',
    ventures: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    Facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    X: '<path d="M4 4l16 16M20 4L4 20"/>',
    YouTube: '<rect x="2.5" y="6" width="19" height="12" rx="4"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ---------- Render ---------- */
  const heroMobile = S.hero.photoMobile && pic({ photo: S.hero.photoMobile });
  $("#heroBg").innerHTML = `<picture>${heroMobile ? `<source media="(max-width: 700px)" srcset="${esc(heroMobile.srcset)}" sizes="100vw">` : ""}${img(S.hero, 1920, true, window.HERO_SIZES)}</picture>`;

  $("#aboutMedia").innerHTML = media(S.about, 2, "Portrait", "", 960, SIZES.about);
  $("#aboutCopy").innerHTML = paras(S.about.paragraphs);
  $("#stats").innerHTML = S.about.stats.map((s) =>
    `<div><dt ${s.value != null ? `data-count="${Number(s.value)}" data-suffix="${esc(s.suffix || "")}"` : ""}>${esc(s.text ?? s.value + (s.suffix || ""))}</dt><dd>${esc(s.label)}</dd></div>`).join("");

  $("#films").innerHTML = S.films.map((f, i) => `
    <article class="film reveal" style="--d:${i % 4}">
      ${media(f, i, f.year, "", 960, SIZES.film)}
      <div class="film__info">
        <span class="film__year">${esc(f.year)}</span>
        <h3 class="film__title">${esc(f.title)}</h3>
        <div class="film__more"><div>
          <p class="film__role">as ${esc(f.role)}</p>
          <button class="btn btn--sm" data-open="film:${i}">View details</button>
        </div></div>
      </div>
    </article>`).join("");

  $("#timeline").innerHTML = S.timeline.map((t, i) => `
    <li class="tl reveal">
      ${pic(t) ? `<figure class="tl__img">${media(t, i, t.year, "", 960, SIZES.step)}<figcaption>${esc(pic(t).caption)}</figcaption></figure>` : ""}
      <span class="tl__year">${esc(t.year)}</span>
      <span class="tl__phase">${esc(t.phase)}</span>
      <h3 class="tl__title">${esc(t.title)}</h3>
      <p class="tl__text">${esc(t.text)}</p>
    </li>`).join("");

  const banner = S.businessBanner && pic(S.businessBanner);
  if (banner) $("#bizBanner").innerHTML = `${media(S.businessBanner, 4, "Business", "", 1920)}`;
  else $("#bizBanner").remove();

  $("#biz").innerHTML =S.business.map((b, i) => `
    <article class="biz__card reveal" style="--d:${i}">
      ${icon(b.icon)}
      <h3>${esc(b.title)}</h3>
      <p>${esc(b.text)}</p>
    </article>`).join("");

  const P = S.philanthropy;
  $("#impactBg").innerHTML = img(P, 1920);
  $("#impactLead").textContent = P.lead;
  $("#impactText").textContent = P.text;
  $("#impactCta").innerHTML = P.url
    ? `<a class="btn btn--gold" href="${esc(P.url)}" target="_blank" rel="noopener">Learn more about his impact</a>`
    : `<button class="btn btn--gold" data-open="impact">Learn more about his impact</button>`;

  const cats = ["All", "Movies", "Wrestling", "Fitness", "Business", "Philanthropy", "Lifestyle"];
  $("#filters").innerHTML = cats.map((c, i) => `<button aria-pressed="${i === 0}" data-filter="${c}">${c}</button>`).join("");
  $("#masonry").innerHTML = S.gallery.map((g, i) => `
    <button class="shot reveal" data-cat="${esc(g.category)}" data-open="gallery:${i}" aria-label="Open ${esc(g.title)} (${esc(g.category)})">
      ${media(g, i, g.category, `aspect-ratio:${esc(g.ratio || "4/3")}`)}
      <span class="shot__over">
        <span class="shot__zoom"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg></span>
        <span class="shot__cat">${esc(g.category)}</span>
        <span class="shot__title">${esc(g.title)}</span>
      </span>
    </button>`).join("");

  $("#newsGrid").innerHTML = S.news.slice(0, 6).map((n, i) => `
    <article class="post reveal" style="--d:${i % 3}">
      <div class="post__media">${media(n, i + 3, n.category)}</div>
      <div class="post__meta"><span>${esc(n.category)}</span><time datetime="${esc(n.date)}">${fmtDate(n.date)}</time></div>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.summary)}</p>
      ${n.url
        ? `<a class="link" href="${esc(n.url)}" target="_blank" rel="noopener">Read more</a>`
        : `<button class="link" data-open="news:${i}">Read more</button>`}
    </article>`).join("");

  const socialLinks = (large) => S.social.map((s) => `
    <li><a href="${esc(s.url)}" target="_blank" rel="noopener me" aria-label="${esc(s.name)} — ${esc(s.handle)}">
      ${icon(s.name)}${large ? `<span><b>${esc(s.name)}</b><small>${esc(s.handle)}</small></span>` : ""}
    </a></li>`).join("");
  $("#social").innerHTML = socialLinks(true);
  $("#footerSocial").innerHTML = socialLinks(false);

  $("#footerContact").innerHTML = `Questions, corrections or rights enquiries: <a href="contact.html">send a request</a> · <a href="privacy.html">Privacy policy</a>`;
  $("#footerLegal").innerHTML = S.affiliated
    ? `© ${esc(S.year)} — Official Website`
    : `© ${esc(S.year)} — Independent Fan &amp; Information Website
       <span>This website is an independent fan/information website and is not affiliated with or endorsed by Dwayne Johnson. All trademarks, film titles and images belong to their respective owners.</span>`;
  $("#footerLegal").insertAdjacentHTML("beforeend", ` <button class="link" data-open="credits">Legal notice</button>`);

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  const views = {
    film(i) {
      const f = S.films[i];
      return `<div class="modal__split">${media(f, i, f.year)}
        <div class="modal__text"><p class="eyebrow">Film</p><h3>${esc(f.title)}</h3>
        <dl><dt>Year</dt><dd>${esc(f.year)}</dd><dt>Role</dt><dd>${esc(f.role)}</dd></dl>
        <p>${esc(f.details)}</p></div></div>`;
    },
    news(i) {
      const n = S.news[i];
      return `<div class="modal__media">${media(n, i + 3, n.category, "", 1280)}</div>
        <div class="modal__text"><p class="eyebrow">${esc(n.category)} · ${fmtDate(n.date)}</p><h3>${esc(n.title)}</h3>
        <p>${esc(n.summary)}</p>${paras(n.body)}</div>`;
    },
    gallery(i) {
      const g = S.gallery[i], x = pic(g, 1280);
      return `${x ? `<img class="modal__full" src="${esc(x.src)}" alt="${esc(x.caption || g.title)}">` : ""}
        <div class="modal__text"><p class="eyebrow">${esc(g.category)}</p><h3>${esc(g.title)}</h3></div>`;
    },
    credits() {
      const rows = Object.values(S.photos).map((p) => {
        const file = p.path.split("/").pop();
        return `<li><a href="https://commons.wikimedia.org/wiki/File:${file}" target="_blank" rel="noopener">${esc(p.caption)}</a> — ${esc(p.author)}, ${license(p.license)}</li>`;
      }).join("");
      // Attribution required by the Creative Commons licences of the photographs: it must stay publicly reachable.
      return `<div class="modal__text"><p class="eyebrow">Information</p><h3>Legal notice</h3>
        <p>Photographs on this website are published under the licences listed below. Some have been cropped; no endorsement by their authors is implied.</p>
        <ul class="credits">${rows}</ul></div>`;
    },
    impact() {
      return `<div class="modal__text"><p class="eyebrow">Philanthropy</p><h3>Giving back</h3>${paras(P.more)}</div>`;
    },
  };
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (!t) return;
    const [kind, i] = t.dataset.open.split(":");
    $("#modalBody").innerHTML = views[kind](Number(i));
    modal.showModal();
  });
  $("#modalClose").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  /* ---------- Gallery filter ---------- */
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#filters button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    $$("#masonry .shot").forEach((s) => {
      s.hidden = b.dataset.filter !== "All" && s.dataset.cat !== b.dataset.filter;
      if (!s.hidden) s.classList.add("is-in");
    });
  });

  /* ---------- Mobile menu ---------- */
  const nav = $("#nav"), toggle = $("#navToggle");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $("#navMenu").addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Reveal on scroll + counters ---------- */
  const count = (el) => {
    const end = Number(el.dataset.count), suffix = el.dataset.suffix;
    if (reduced) return;
    const t0 = performance.now(), dur = 1500;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      $$("[data-count]", en.target).forEach(count);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Active nav link ---------- */
  const links = $$("#navMenu a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id], footer[id]").forEach((s) => spy.observe(s));

  /* ---------- Scroll effects: sticky nav, parallax, timeline progress, back to top ---------- */
  const heroBg = $("#heroBg"), impact = $("#philanthropy"), impactBg = $("#impactBg"), timeline = $("#timeline"), toTop = $("#toTop");
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("is-solid", y > 40);
    toTop.classList.toggle("is-on", y > vh * 0.8);
    const tr = timeline.getBoundingClientRect();
    timeline.style.setProperty("--p", Math.max(0, Math.min(1, (vh * 0.65 - tr.top) / tr.height)).toFixed(3));
    if (reduced) return;
    if (y < vh) heroBg.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
    const ir = impact.getBoundingClientRect();
    if (ir.bottom > 0 && ir.top < vh) impactBg.style.transform = `translate3d(0, ${(ir.top / vh) * -40}px, 0)`;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();
