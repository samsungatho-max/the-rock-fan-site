// Administrator sessions: random token in an HttpOnly cookie, only its hash is stored server-side.
const crypto = require("crypto");
const store = require("./store");

const COOKIE = "__Host-admin";
const IDLE_SECONDS = 30 * 60;     // session ends after 30 minutes without activity
const MAX_SECONDS = 8 * 60 * 60;  // and in any case 8 hours after sign-in
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
const keyOf = (token) => `admin:session:${sha(token)}`;

function cookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}
const tokenOf = (req) => { const t = cookies(req)[COOKIE]; return t && /^[A-Za-z0-9_-]{43}$/.test(t) ? t : null; };

const setCookie = (res, value, maxAge) =>
  res.setHeader("Set-Cookie", `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);

// Requests that change something must come from this site's own pages (CSRF protection, with SameSite=Strict).
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try { return new URL(origin).host === (req.headers["x-forwarded-host"] || req.headers.host); } catch { return false; }
}

const passwordMatches = (given) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof given !== "string" || !given) return false;
  return crypto.timingSafeEqual(Buffer.from(sha(given)), Buffer.from(sha(expected)));
};

async function startSession(res) {
  const token = crypto.randomBytes(32).toString("base64url");
  await store.setKey(keyOf(token), JSON.stringify({ created: Date.now() }), IDLE_SECONDS);
  setCookie(res, token, MAX_SECONDS);
}

// Returns true when the request carries a valid, unexpired session (and extends its idle timeout).
async function hasSession(req) {
  const token = tokenOf(req);
  if (!token) return false;
  const raw = await store.getKey(keyOf(token));
  if (!raw) return false;
  let created = 0;
  try { created = JSON.parse(raw).created; } catch {}
  if (!created || Date.now() - created > MAX_SECONDS * 1000) { await store.delKey(keyOf(token)); return false; }
  await store.touch(keyOf(token), IDLE_SECONDS);
  return true;
}

async function endSession(req, res) {
  const token = tokenOf(req);
  if (token) await store.delKey(keyOf(token));
  setCookie(res, "", 0);
}

// Security events, without passwords, tokens or raw IP addresses.
const logEvent = (event, req, extra = {}) =>
  console.log(JSON.stringify({ event, at: new Date().toISOString(), client: store.ipKey("c", req).slice(2, 14), ...extra }));

module.exports = { sameOrigin, passwordMatches, startSession, hasSession, endSession, logEvent };
