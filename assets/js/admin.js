(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPES = ["General enquiry", "Professional enquiry", "Partnership request", "Media request", "Event request", "Philanthropic request", "Other"];
  const KEY = "admin-session";

  let password = "", all = [];
  try { password = sessionStorage.getItem(KEY) || ""; } catch {}

  const api = async (method, body) => {
    const r = await fetch("/api/admin/requests", {
      method,
      headers: { Authorization: `Bearer ${password}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || "The request could not be completed."), { status: r.status });
    return j;
  };

  const alertBox = $("#adminAlert");
  const fail = (msg) => { alertBox.textContent = msg; alertBox.hidden = false; };

  /* ---------- Sign in / out ---------- */
  const signOut = () => {
    password = ""; all = [];
    try { sessionStorage.removeItem(KEY); } catch {}
    $("#requests").innerHTML = "";
    $("#inbox").hidden = true; $("#signOut").hidden = true; $("#login").hidden = false;
  };
  const load = async () => {
    alertBox.hidden = true;
    all = (await api("GET")).requests;
    $("#login").hidden = true; $("#inbox").hidden = false; $("#signOut").hidden = false;
    render();
  };
  $("#login").addEventListener("submit", async (e) => {
    e.preventDefault();
    password = $("#password").value;
    $("#loginError").textContent = "";
    try {
      await load();
      try { sessionStorage.setItem(KEY, password); } catch {}
      $("#password").value = "";
    } catch (err) { password = ""; $("#loginError").textContent = err.message; }
  });
  $("#signOut").addEventListener("click", signOut);
  $("#refresh").addEventListener("click", () => load().catch((err) => (err.status === 401 ? signOut() : fail(err.message))));

  /* ---------- List, search, filters ---------- */
  $("#filterType").insertAdjacentHTML("beforeend", TYPES.map((t) => `<option>${t}</option>`).join(""));
  const visible = () => {
    const q = $("#search").value.trim().toLowerCase(), type = $("#filterType").value, read = $("#filterRead").value;
    return all.filter((r) =>
      (!type || r.type === type) &&
      (!read || (read === "read") === Boolean(r.read)) &&
      (!q || [r.name, r.email, r.phone, r.country, r.subject, r.message].join(" ").toLowerCase().includes(q)));
  };
  const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  function render() {
    const rows = visible(), unread = all.filter((r) => !r.read).length;
    $("#count").textContent = `${all.length} total · ${unread} unread`;
    $("#empty").hidden = rows.length > 0;
    $("#requests").innerHTML = rows.map((r) => `
      <li class="request ${r.read ? "" : "is-unread"}" data-id="${esc(r.id)}">
        <details>
          <summary>
            <span class="request__dot" title="${r.read ? "Read" : "Unread"}"></span>
            <span class="request__who">${esc(r.name)}</span>
            <span class="request__type">${esc(r.type)}</span>
            <span class="request__subject">${esc(r.subject)}</span>
            <time datetime="${esc(r.createdAt)}">${esc(when(r.createdAt))}</time>
          </summary>
          <dl>
            <dt>E-mail</dt><dd><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></dd>
            <dt>Phone</dt><dd>${esc(r.phone || "—")}</dd>
            <dt>Country</dt><dd>${esc(r.country)}</dd>
          </dl>
          <p class="request__message">${esc(r.message)}</p>
          <div class="request__actions">
            <button class="btn btn--sm" data-act="read">${r.read ? "Mark as unread" : "Mark as read"}</button>
            <button class="btn btn--sm btn--danger" data-act="delete">Delete</button>
          </div>
        </details>
      </li>`).join("");
  }
  ["#search", "#filterType", "#filterRead"].forEach((s) => $(s).addEventListener("input", render));

  /* ---------- Read / unread, delete ---------- */
  $("#requests").addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = btn.closest(".request").dataset.id, rec = all.find((r) => r.id === id);
    alertBox.hidden = true;
    try {
      if (btn.dataset.act === "read") {
        await api("PATCH", { id, read: !rec.read });
        rec.read = !rec.read;
      } else {
        if (!confirm(`Delete the request from ${rec.name}? This cannot be undone.`)) return;
        await api("DELETE", { id });
        all = all.filter((r) => r.id !== id);
      }
      render();
    } catch (err) { err.status === 401 ? signOut() : fail(err.message); }
  });

  /* ---------- CSV export of the requests currently shown ---------- */
  $("#export").addEventListener("click", () => {
    const cols = ["createdAt", "read", "type", "name", "email", "phone", "country", "subject", "message"];
    // Quote every cell; neutralise values a spreadsheet would run as a formula.
    const cell = (v) => { const s = String(v ?? ""); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };
    const csv = [cols.join(","), ...visible().map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  if (password) load().catch(signOut);
})();
