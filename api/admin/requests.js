// /api/admin/requests — list (GET), change status (PATCH), delete (DELETE). Requires an administrator session (see login.js).
const auth = require("../_lib/auth");
const store = require("../_lib/store");

const RETENTION_DAYS = Number(process.env.RETENTION_DAYS) || 365;
const STATUSES = ["new", "read", "handled", "archived"];
// Requests saved before statuses existed only have a read flag.
const statusOf = (r) => (STATUSES.includes(r.status) ? r.status : r.read ? "read" : "new");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.ADMIN_PASSWORD || !store.configured()) return res.status(503).json({ error: "The administration area is not configured yet." });

  try {
    // Every call is authorised here, on the server, from the session cookie.
    if (!(await auth.hasSession(req))) return res.status(401).json({ error: "Not signed in." });
    if (req.method !== "GET" && !auth.sameOrigin(req)) {
      auth.logEvent("admin_csrf_blocked", req, { method: req.method });
      return res.status(403).json({ error: "Forbidden." });
    }

    if (req.method === "GET") {
      // Requests older than the retention period are deleted when the list is loaded.
      const limit = Date.now() - RETENTION_DAYS * 864e5, keep = [];
      for (const r of await store.list()) {
        if (Date.parse(r.createdAt) < limit) await store.remove(r.id);
        else keep.push({ ...r, status: statusOf(r) });
      }
      return res.status(200).json({ requests: keep, retentionDays: RETENTION_DAYS });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const id = String(body.id || (req.query && req.query.id) || "");
    if (!/^[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ error: "Missing request id." });

    if (req.method === "PATCH") {
      const rec = await store.get(id);
      if (!rec) return res.status(404).json({ error: "Request not found." });
      if (!STATUSES.includes(body.status)) return res.status(400).json({ error: "Unknown status." });
      rec.status = body.status;
      delete rec.read;
      await store.save(rec);
      return res.status(200).json({ ok: true });
    }
    if (req.method === "DELETE") {
      await store.remove(id);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error(JSON.stringify({ event: "admin_error", message: err.message }));
    return res.status(500).json({ error: "The request could not be completed." });
  }
};
