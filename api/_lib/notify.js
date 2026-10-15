// E-mail notification to the administrator through Resend (https://resend.com).
// Settings (server-side only): RESEND_API_KEY, ADMIN_EMAIL, MAIL_FROM, optional SITE_URL and TIMEZONE.
const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const configured = () => Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);

function received(iso) {
  const zone = process.env.TIMEZONE || "Europe/Paris";
  try {
    return new Date(iso).toLocaleString("fr-FR", { timeZone: zone, dateStyle: "full", timeStyle: "short" }) + ` (${zone})`;
  } catch {
    return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC";
  }
}

async function notifyAdmin(rec, siteUrl) {
  const { RESEND_API_KEY, ADMIN_EMAIL, MAIL_FROM } = process.env;
  const link = `${(process.env.SITE_URL || siteUrl).replace(/\/$/, "")}/admin.html#${rec.id}`;
  const when = received(rec.createdAt);
  const rows = [
    ["Nom", rec.name], ["E-mail", rec.email], ["Téléphone", rec.phone || "—"], ["Pays", rec.country],
    ["Catégorie", rec.type], ["Objet", rec.subject], ["Reçue le", when],
  ];

  const text = [
    "Nouvelle demande reçue depuis le site.", "",
    ...rows.map(([k, v]) => `${k} : ${v}`), "", "Message :", rec.message, "",
    `Voir la demande dans l'administration : ${link}`,
  ].join("\n");

  // Every visitor value is escaped before it goes into the HTML.
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f2ee;font-family:Arial,Helvetica,sans-serif;color:#141414">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden">
    <tr><td style="background:#0b0b0b;color:#c8a45c;padding:20px 28px;font-size:13px;letter-spacing:3px;text-transform:uppercase">Nouvelle demande reçue depuis le site</td></tr>
    <tr><td style="padding:24px 28px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
        ${rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#7a7368;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${k === "E-mail" ? `<a href="mailto:${esc(v)}" style="color:#141414">${esc(v)}</a>` : esc(v)}</td></tr>`).join("")}
      </table>
      <p style="margin:22px 0 8px;color:#7a7368;font-size:13px">Message</p>
      <div style="padding:16px;background:#f7f6f3;border-left:3px solid #c8a45c;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(rec.message)}</div>
      <p style="margin:28px 0 8px;text-align:center">
        <a href="${esc(link)}" style="display:inline-block;padding:14px 26px;background:#c8a45c;color:#0b0b0b;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:2px;border-radius:3px">VOIR LA DEMANDE DANS L'ADMINISTRATION</a>
      </p>
    </td></tr>
  </table></body></html>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: MAIL_FROM || "Site therockfanworld <onboarding@resend.dev>",
      to: ADMIN_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: rec.email,
      subject: "Nouvelle demande reçue depuis le site",
      text,
      html,
    }),
  });
  if (!r.ok) throw new Error(`mail error ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

module.exports = { configured, notifyAdmin };
