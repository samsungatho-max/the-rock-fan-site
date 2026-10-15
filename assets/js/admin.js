(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Categories are stored in English, as sent by the public form.
  const TYPES = {
    "General enquiry": "Demande générale", "Professional enquiry": "Demande professionnelle", "Partnership request": "Demande de partenariat",
    "Media request": "Demande média", "Event request": "Demande événementielle", "Philanthropic request": "Demande philanthropique", "Other": "Autre",
  };
  const STATUSES = { new: "Nouveau", read: "Lu", handled: "Traité", archived: "Archivé" };
  const NOTIFY = { sent: "E-mail de notification envoyé", failed: "Échec de l'e-mail de notification", off: "Notification e-mail non configurée", pending: "Notification en cours" };
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
    if (!r.ok) {
      const msg = { 401: "Mot de passe incorrect.", 429: "Trop de tentatives. Réessayez dans 15 minutes.", 503: "L'administration n'est pas encore configurée." }[r.status];
      throw Object.assign(new Error(msg || "L'opération n'a pas pu être effectuée."), { status: r.status });
    }
    return j;
  };

  const alertBox = $("#adminAlert");
  const fail = (msg) => { alertBox.textContent = msg; alertBox.hidden = false; };
  const handle = (err) => (err.status === 401 ? signOut() : fail(err.message));

  /* ---------- Connexion ---------- */
  function signOut() {
    password = ""; all = [];
    try { sessionStorage.removeItem(KEY); } catch {}
    $("#requests").innerHTML = "";
    $("#inbox").hidden = true; $("#signOut").hidden = true; $("#login").hidden = false;
  }
  async function load() {
    alertBox.hidden = true;
    all = (await api("GET")).requests;
    $("#login").hidden = true; $("#inbox").hidden = false; $("#signOut").hidden = false;
    render();
    openFromLink();
  }
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
  $("#refresh").addEventListener("click", () => load().catch(handle));

  /* ---------- Compteurs, recherche, filtres ---------- */
  $("#filterType").insertAdjacentHTML("beforeend", Object.entries(TYPES).map(([v, l]) => `<option value="${v}">${l}</option>`).join(""));
  $("#filterStatus").insertAdjacentHTML("beforeend", Object.entries(STATUSES).map(([v, l]) => `<option value="${v}">${l}</option>`).join(""));

  const visible = () => {
    const q = $("#search").value.trim().toLowerCase(), type = $("#filterType").value, status = $("#filterStatus").value;
    return all.filter((r) =>
      (!type || r.type === type) &&
      (status === "" || (status === "active" ? r.status !== "archived" : r.status === status)) &&
      (!q || [r.name, r.email, r.phone, r.country, r.subject, r.message].join(" ").toLowerCase().includes(q)));
  };
  const when = (iso) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

  function render() {
    const count = (s) => all.filter((r) => r.status === s).length;
    $("#statsBar").innerHTML = `
      <div class="stat stat--main"><b>${count("new")}</b><span>Nouvelles demandes</span></div>
      <div class="stat"><b>${count("read")}</b><span>Lues</span></div>
      <div class="stat"><b>${count("handled")}</b><span>Traitées</span></div>
      <div class="stat"><b>${count("archived")}</b><span>Archivées</span></div>
      <div class="stat"><b>${all.length}</b><span>Total</span></div>`;
    document.title = `${count("new") ? `(${count("new")}) ` : ""}Administration — Demandes`;

    const rows = visible();
    $("#empty").hidden = rows.length > 0;
    $("#requests").innerHTML = rows.map((r) => `
      <li class="request is-${esc(r.status)}" data-id="${esc(r.id)}" id="r-${esc(r.id)}">
        <details>
          <summary>
            <span class="request__dot" title="${esc(STATUSES[r.status])}"></span>
            <span class="request__who">${esc(r.name)}</span>
            <span class="request__type">${esc(TYPES[r.type] || r.type)}</span>
            <span class="request__subject">${esc(r.subject)}</span>
            <time datetime="${esc(r.createdAt)}">${esc(when(r.createdAt))}</time>
          </summary>
          <dl>
            <dt>Statut</dt><dd><span class="status status--${esc(r.status)}">${esc(STATUSES[r.status])}</span></dd>
            <dt>E-mail</dt><dd><a href="mailto:${esc(r.email)}?subject=${encodeURIComponent("Re: " + r.subject)}">${esc(r.email)}</a></dd>
            <dt>Téléphone</dt><dd>${r.phone ? `<a href="tel:${esc(r.phone.replace(/\s/g, ""))}">${esc(r.phone)}</a>` : "—"}</dd>
            <dt>Pays</dt><dd>${esc(r.country)}</dd>
            <dt>Catégorie</dt><dd>${esc(TYPES[r.type] || r.type)}</dd>
            <dt>Objet</dt><dd>${esc(r.subject)}</dd>
            <dt>Reçue le</dt><dd>${esc(new Date(r.createdAt).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "medium" }))}</dd>
            ${r.notification ? `<dt>Notification</dt><dd>${esc(NOTIFY[r.notification] || r.notification)}</dd>` : ""}
          </dl>
          <p class="request__message">${esc(r.message)}</p>
          <div class="request__actions">
            <label class="request__status">Changer le statut
              <select data-act="status">${Object.entries(STATUSES).map(([v, l]) => `<option value="${v}" ${v === r.status ? "selected" : ""}>${l}</option>`).join("")}</select>
            </label>
            <a class="btn btn--sm" href="mailto:${esc(r.email)}?subject=${encodeURIComponent("Re: " + r.subject)}">Répondre</a>
            <button class="btn btn--sm btn--danger" data-act="delete">Supprimer</button>
          </div>
        </details>
      </li>`).join("");
  }
  ["#search", "#filterType", "#filterStatus"].forEach((s) => $(s).addEventListener("input", render));

  /* ---------- Statut, suppression ---------- */
  async function setStatus(id, status) {
    const rec = all.find((r) => r.id === id);
    if (!rec || rec.status === status) return;
    await api("PATCH", { id, status });
    rec.status = status;
  }
  // Opening a new request marks it as read.
  $("#requests").addEventListener("toggle", (e) => {
    const li = e.target.closest(".request");
    if (!e.target.open || !li.classList.contains("is-new")) return;
    setStatus(li.dataset.id, "read").then(() => {
      li.classList.replace("is-new", "is-read");
      li.querySelector(".status").textContent = STATUSES.read;
      li.querySelector(".status").className = "status status--read";
      li.querySelector('[data-act="status"]').value = "read";
      const keepOpen = li.dataset.id;
      render();
      const again = document.getElementById(`r-${keepOpen}`);
      if (again) again.querySelector("details").open = true;
    }).catch(handle);
  }, true);
  $("#requests").addEventListener("change", async (e) => {
    if (e.target.dataset.act !== "status") return;
    const id = e.target.closest(".request").dataset.id;
    alertBox.hidden = true;
    try {
      await setStatus(id, e.target.value);
      render();
      const again = document.getElementById(`r-${id}`);
      if (again) again.querySelector("details").open = true;
    } catch (err) { handle(err); }
  });
  $("#requests").addEventListener("click", async (e) => {
    const btn = e.target.closest('[data-act="delete"]');
    if (!btn) return;
    const id = btn.closest(".request").dataset.id, rec = all.find((r) => r.id === id);
    if (!confirm(`Supprimer définitivement la demande de ${rec.name} ?`)) return;
    alertBox.hidden = true;
    try {
      await api("DELETE", { id });
      all = all.filter((r) => r.id !== id);
      render();
    } catch (err) { handle(err); }
  });

  /* ---------- Lien « Voir la demande » reçu par e-mail : admin.html#<id> ---------- */
  function openFromLink() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    if (!all.some((r) => r.id === id)) return;
    $("#filterStatus").value = ""; $("#filterType").value = ""; $("#search").value = "";
    render();
    const li = document.getElementById(`r-${id}`);
    if (!li) return;
    li.querySelector("details").open = true;
    li.scrollIntoView({ block: "center" });
  }
  addEventListener("hashchange", openFromLink);

  /* ---------- Export CSV des demandes affichées ---------- */
  $("#export").addEventListener("click", () => {
    const cols = [["createdAt", "Reçue le"], ["status", "Statut"], ["type", "Catégorie"], ["name", "Nom"], ["email", "E-mail"], ["phone", "Téléphone"], ["country", "Pays"], ["subject", "Objet"], ["message", "Message"]];
    const value = (r, c) => (c === "status" ? STATUSES[r.status] : c === "type" ? TYPES[r.type] || r.type : r[c]);
    // Every cell is quoted; values a spreadsheet would run as a formula are neutralised.
    const cell = (v) => { const s = String(v ?? ""); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };
    const csv = [cols.map(([, l]) => cell(l)).join(";"), ...visible().map((r) => cols.map(([c]) => cell(value(r, c))).join(";"))].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `demandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  if (password) load().catch(signOut);
})();
