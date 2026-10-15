// Shared by contact.html and privacy.html: mobile menu, footer notice, and the contact form.
(function () {
  "use strict";
  const S = window.SITE || {};
  const $ = (s) => document.querySelector(s);

  /* ---------- Menu + legal notice ---------- */
  const nav = $("#nav"), toggle = $("#navToggle");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  $("#footerLegal").innerHTML = S.affiliated
    ? `© ${S.year} — Official Website · <a href="privacy.html">Privacy policy</a>`
    : `© ${S.year} — Independent Fan &amp; Information Website · <a href="privacy.html">Privacy policy</a>
       <span>.</span>`;
  const notice = $("#notice");
  if (notice && !S.affiliated) notice.hidden = false;
  document.querySelectorAll("[data-operator]").forEach((el) => { el.textContent = (S.contact && S.contact.operator) || "the administrators of this website"; });

  const form = $("#contactForm");
  if (!form) return;

  /* ---------- Country list (names come from the browser, no data file needed) ---------- */
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const skip = new Set(["AC", "CP", "CQ", "DG", "EA", "EU", "EZ", "IC", "QO", "TA", "UN", "XA", "XB", "ZZ"]);
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", countries = [];
  for (const a of A) for (const b of A) {
    const code = a + b;
    if (skip.has(code)) continue;
    let name; try { name = names.of(code); } catch { continue; }
    if (name && name !== code && !countries.includes(name)) countries.push(name);
  }
  countries.sort((x, y) => x.localeCompare(y));
  // A fixed value attribute keeps the English name even when the browser translates the page.
  const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  $("#country").insertAdjacentHTML("beforeend", countries.map((c) => `<option value="${attr(c)}">${attr(c)}</option>`).join(""));

  /* ---------- Validation (same rules as the server) ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const f = form.elements, alertBox = $("#formAlert"), button = $("#submitBtn"), loadedAt = Date.now();
  const read = () => ({
    name: f.name.value.trim(), email: f.email.value.trim(), dial: f.dial.value.trim(), phone: f.phone.value.trim(),
    country: f.country.value, type: f.type.value, subject: f.subject.value.trim(), message: f.message.value.trim(),
    consent: f.consent.checked, website: f.website.value, elapsed: Date.now() - loadedAt,
  });
  const check = (d) => {
    const e = {}, digits = d.phone.replace(/[\s().-]/g, "");
    if (d.name.length < 2) e.name = "Please enter your full name.";
    if (!EMAIL.test(d.email)) e.email = "Please enter a valid e-mail address.";
    if (d.phone || d.dial) {
      if (!/^\+\d{1,4}$/.test(d.dial)) e.phone = "Please add the international dialling code, e.g. +1.";
      else if (!/^\d{5,15}$/.test(digits)) e.phone = "Please enter a valid phone number.";
    }
    if (!d.country) e.country = "Please select your country.";
    if (!d.type) e.type = "Please choose a request type.";
    if (d.subject.length < 3) e.subject = "Please enter a subject.";
    if (d.message.length < 10) e.message = "Please describe your request (at least 10 characters).";
    if (!d.consent) e.consent = "Please accept the privacy policy.";
    return e;
  };
  const FIELDS = ["name", "email", "phone", "country", "type", "subject", "message", "consent"];
  const show = (errors) => {
    FIELDS.forEach((k) => {
      const msg = errors[k] || "", input = f[k];
      $(`#${k}-error`).textContent = msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) input.setAttribute("aria-describedby", `${k}-error`); else input.removeAttribute("aria-describedby");
      if (k === "phone") f.dial.setAttribute("aria-invalid", msg ? "true" : "false");
    });
    const first = FIELDS.find((k) => errors[k]);
    if (first) f[first].focus();
  };
  const fail = (msg) => { alertBox.textContent = msg; alertBox.hidden = false; };

  // Clear a field's error as soon as the visitor corrects it.
  form.addEventListener("input", (e) => {
    const k = e.target.name === "dial" ? "phone" : e.target.name;
    if (!FIELDS.includes(k) || !$(`#${k}-error`).textContent) return;
    if (!check(read())[k]) { $(`#${k}-error`).textContent = ""; f[k].setAttribute("aria-invalid", "false"); if (k === "phone") f.dial.setAttribute("aria-invalid", "false"); }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.hidden = true;
    const data = read(), errors = check(data);
    show(errors);
    if (Object.keys(errors).length) return fail("Please check the highlighted fields.");

    button.disabled = true;
    button.textContent = "Sending…";
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (j.errors) show(j.errors);
        return fail(j.error || "Your request could not be sent. Please try again later.");
      }
      form.hidden = true;
      const done = $("#formDone");
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ block: "center" });
    } catch {
      fail("Your request could not be sent. Please check your connection and try again.");
    } finally {
      button.disabled = false;
      button.textContent = "Send my request";
    }
  });
})();
