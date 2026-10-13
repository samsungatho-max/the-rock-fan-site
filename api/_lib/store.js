// Storage for contact requests: Upstash Redis over its REST API (no npm dependency).
// The Vercel "Upstash for Redis" integration provides KV_REST_API_URL / KV_REST_API_TOKEN.
const crypto = require("crypto");

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const dev = process.env.LOCAL_DEV_STORE === "1"; // in-memory store, local preview only
const mem = new Map(), hits = new Map();
const KEY = "contact:requests";

const configured = () => dev || Boolean(URL_ && TOKEN);

async function redis(...cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || `store error ${r.status}`);
  return j.result;
}

const save = async (rec) => { dev ? mem.set(rec.id, JSON.stringify(rec)) : await redis("HSET", KEY, rec.id, JSON.stringify(rec)); };
const get = async (id) => { const v = dev ? mem.get(id) : await redis("HGET", KEY, id); return v ? JSON.parse(v) : null; };
const remove = async (id) => { dev ? mem.delete(id) : await redis("HDEL", KEY, id); };
const list = async () => {
  const vals = dev ? [...mem.values()] : await redis("HVALS", KEY);
  return (vals || []).map((v) => JSON.parse(v)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

// Counts calls per key inside a time window (rate limiting). Returns the current count.
async function hit(key, ttlSeconds) {
  if (dev) {
    const now = Date.now(), h = hits.get(key);
    if (!h || h.until < now) { hits.set(key, { n: 1, until: now + ttlSeconds * 1000 }); return 1; }
    return ++h.n;
  }
  const n = await redis("INCR", key);
  if (n === 1) await redis("EXPIRE", key, ttlSeconds);
  return n;
}

const clientIp = (req) => String(req.headers["x-forwarded-for"] || (req.socket && req.socket.remoteAddress) || "unknown").split(",")[0].trim();
// Rate-limit keys never hold the raw IP address.
const ipKey = (prefix, req) => `${prefix}:${crypto.createHash("sha256").update(clientIp(req)).digest("hex").slice(0, 24)}`;

module.exports = { configured, save, get, remove, list, hit, ipKey };
