// POST /api/contact — validates and stores a contact request, then notifies the administrator by e-mail.
const crypto = require("crypto");
const store = require("./_lib/store");
const mail = require("./_lib/notify");

const TYPES = ["General enquiry", "Professional enquiry", "Partnership request", "Media request", "Event request", "Philanthropic request", "Other"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
// Only plain text is accepted: objects or arrays sent in place of a field are treated as empty.
const clean = (v, max) => (typeof v === "string" ? v : "").replace(CONTROL, "").trim().slice(0, max);

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


module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!store.configured()) return res.status(503).json({ error: "The contact form is not available at the moment." });
  if (!/^application\/json/i.test(req.headers["content-type"] || "")) return res.status(415).json({ error: "Unsupported request." });
  const b = req.body && typeof req.body === "object" ? req.body : {};

  // Anti-spam: hidden field filled in, or form submitted faster than a person can type.
  if (b.website) return res.status(200).json({ ok: true });
  if (!(Number(b.elapsed) >= 3000)) return res.status(400).json({ error: "Please take a moment to review your message, then send it again." });

  const { d, e } = validate(b);
  if (Object.keys(e).length) return res.status(422).json({ error: "Please check the highlighted fields.", errors: e });

  let rec;
  try {
    // Abuse limits: 5 requests per visitor per 10 minutes, 300 per day for the whole site.
    const day = new Date().toISOString().slice(0, 10);
    if (await store.hit(store.ipKey("rl:contact", req), 600) > 5 || await store.hit(`rl:contact:day:${day}`, 86400) > 300) {
      console.warn(JSON.stringify({ event: "contact_rate_limited" }));
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
    rec = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new",
      name: d.name, email: d.email, phone: d.phone ? `${d.dial} ${d.phone}` : "", country: d.country,
      subject: d.subject, type: d.type, message: d.message,
      notification: mail.configured() ? "pending" : "off",
    };
    // 1. The request is stored first: it is safe in the admin area whatever happens to the e-mail.
    await store.save(rec);
  } catch (err) {
    console.error(JSON.stringify({ event: "contact_store_failed", message: err.message }));
    return res.status(500).json({ error: "Your request could not be sent. Please try again later." });
  }

  // 2. Then the administrator is notified; the outcome is recorded on the request.
  if (rec.notification === "pending") {
    try {
      await mail.notifyAdmin(rec, `https://${req.headers["x-forwarded-host"] || req.headers.host}`);
      rec.notification = "sent";
    } catch (err) {
      console.error(JSON.stringify({ event: "notification_failed", id: rec.id, message: err.message }));
      rec.notification = "failed";
    }
    await store.save(rec).catch((err) => console.error(JSON.stringify({ event: "notification_status_save_failed", id: rec.id, message: err.message })));
  }
  return res.status(200).json({ ok: true });
};
