// POST /api/admin/logout — closes the administrator session.
const store = require("../_lib/store");
const auth = require("../_lib/auth");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!auth.sameOrigin(req)) return res.status(403).json({ error: "Forbidden." });
  try {
    if (store.configured()) await auth.endSession(req, res);
    auth.logEvent("admin_logout", req);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(JSON.stringify({ event: "admin_logout_error", message: err.message }));
    return res.status(500).json({ error: "The request could not be completed." });
  }
};
