// POST /api/contact — validates and stores a contact request, then notifies the administrator by e-mail.
const crypto = require("crypto");
const store = require("./_lib/store");

const TYPES = ["General enquiry", "Professional enquiry", "Partnership request", "Media request", "Event request", "Philanthropic request", "Other"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
const clean = (v, max) => String(v == null ? "" : v).replace(CONTROL, "").trim().slice(0, max);

function validate(b) {
  const d = {
    name: clean(b.name, 100), email: clean(b.email, 200).toLowerCase(), dial: clean(b.dial, 5), phone: clean(b.phone, 24).replace(/[\s().-]/g, ""),
    country: clean(b.country, 80), subject: clean(b.subject, 150), type: clean(b.type, 40), message: clean(b.message, 4000),
  };
  const e = {};
  if (d.name.length < 2) e.name = "Please enter your full name.";
  if (!EMAIL.test(d.email)) e.email = "Please enter a valid e-mail address.";
  if (d.phone || d.dial) {
    if (!/^\+\d{1,4}$/.test(d.dial)) e.phone = "Please add the international dialling code, e.g. +1.";
    else if (!/^\d{5,15}$/.test(d.phone)) e.phone = "Please enter a valid phone number.";
  }
  if (!d.country) e.country = "Please select your country.";
  if (d.subject.length < 3) e.subject = "Please enter a subject.";
  if (!TYPES.includes(d.type)) e.type = "Please choose a request type.";
  if (d.message.length < 10) e.message = "Please describe your request (at least 10 characters).";
  if (b.consent !== true) e.consent = "Please accept the privacy policy.";
  return { d, e };
}

// Notification through Resend (https://resend.com). Skipped when it is not configured.
async function notify(rec) {
  const { RESEND_API_KEY, ADMIN_EMAIL, MAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return;
  const text = [
    "A new request was sent from the website contact form.", "",
    `Name:     ${rec.name}`, `E-mail:   ${rec.email}`, `Phone:    ${rec.phone || "-"}`, `Country:  ${rec.country}`,
    `Type:     ${rec.type}`, `Subject:  ${rec.subject}`, "", rec.message, "",
    "Open the administration page of the website to manage this request.",
  ].join("\n");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: MAIL_FROM || "Website contact <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      reply_to: rec.email,
      subject: `New request: ${rec.type} - ${rec.subject}`,
      text,
    }),
  });
  if (!r.ok) throw new Error(`mail error ${r.status}`);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!store.configured()) return res.status(503).json({ error: "The contact form is not available at the moment." });
  const b = req.body && typeof req.body === "object" ? req.body : {};

  // Anti-spam: hidden field filled in, or form submitted faster than a person can type.
  if (b.website) return res.status(200).json({ ok: true });
  if (!(Number(b.elapsed) >= 3000)) return res.status(400).json({ error: "Please take a moment to review your message, then send it again." });

  const { d, e } = validate(b);
  if (Object.keys(e).length) return res.status(422).json({ error: "Please check the highlighted fields.", errors: e });

  try {
    if (await store.hit(store.ipKey("rl:contact", req), 600) > 5) return res.status(429).json({ error: "Too many requests. Please try again later." });
    const rec = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false,
      name: d.name, email: d.email, phone: d.phone ? `${d.dial} ${d.phone}` : "", country: d.country,
      subject: d.subject, type: d.type, message: d.message,
    };
    await store.save(rec);
    await notify(rec).catch((err) => console.error("notification failed:", err.message)); // the request is saved either way
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact failed:", err.message);
    return res.status(500).json({ error: "Your request could not be sent. Please try again later." });
  }
};
