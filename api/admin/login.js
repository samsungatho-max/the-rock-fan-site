// POST /api/admin/login — checks the administrator password and opens a session.
const store = require("../_lib/store");
const auth = require("../_lib/auth");

const PER_CLIENT = 5, GLOBAL = 50, WINDOW = 15 * 60; // failed attempts allowed per 15 minutes
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!process.env.ADMIN_PASSWORD || !store.configured()) return res.status(503).json({ error: "The administration area is not configured yet." });
  if (!auth.sameOrigin(req)) return res.status(403).json({ error: "Forbidden." });

  try {
    const clientKey = store.ipKey("rl:login", req);
    if (await store.count(clientKey) >= PER_CLIENT || await store.count("rl:login:all") >= GLOBAL) {
      auth.logEvent("admin_login_blocked", req);
      return res.status(429).json({ error: "Too many attempts. Please try again in 15 minutes." });
    }
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
    if (!auth.passwordMatches(password)) {
      await store.hit(clientKey, WINDOW);
      await store.hit("rl:login:all", WINDOW);
      auth.logEvent("admin_login_failed", req);
      await wait(400); // slows down guessing
      return res.status(401).json({ error: "Incorrect password." });
    }
    await auth.startSession(res);
    auth.logEvent("admin_login_ok", req);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(JSON.stringify({ event: "admin_login_error", message: err.message }));
    return res.status(500).json({ error: "The request could not be completed." });
  }
};
