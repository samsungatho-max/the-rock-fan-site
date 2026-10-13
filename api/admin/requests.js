// /api/admin/requests — list (GET), mark read/unread (PATCH), delete (DELETE). Protected by ADMIN_PASSWORD.
const crypto = require("crypto");
const store = require("../_lib/store");

const RETENTION_DAYS = Number(process.env.RETENTION_DAYS) || 365;
const digest = (s) => crypto.createHash("sha256").update(String(s)).digest();

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !store.configured()) return res.status(503).json({ error: "The administration area is not configured yet." });

  try {
    const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!given || !crypto.timingSafeEqual(digest(given), digest(password))) {
      if (await store.hit(store.ipKey("rl:admin", req), 900) > 10) return res.status(429).json({ error: "Too many attempts. Please try again in 15 minutes." });
      return res.status(401).json({ error: "Incorrect password." });
    }

    if (req.method === "GET") {
      // Requests older than the retention period are deleted when the list is loaded.
      const limit = Date.now() - RETENTION_DAYS * 864e5, keep = [];
      for (const r of await store.list()) {
        if (Date.parse(r.createdAt) < limit) await store.remove(r.id);
        else keep.push(r);
      }
      return res.status(200).json({ requests: keep, retentionDays: RETENTION_DAYS });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const id = String(body.id || (req.query && req.query.id) || "");
    if (!/^[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ error: "Missing request id." });

    if (req.method === "PATCH") {
      const rec = await store.get(id);
      if (!rec) return res.status(404).json({ error: "Request not found." });
      rec.read = Boolean(body.read);
      await store.save(rec);
      return res.status(200).json({ ok: true });
    }
    if (req.method === "DELETE") {
      await store.remove(id);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error("admin failed:", err.message);
    return res.status(500).json({ error: "The request could not be completed." });
  }
};
