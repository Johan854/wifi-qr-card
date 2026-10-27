/*
 * Wi-Fi QR Card (FR)
 * Carte Home Assistant qui affiche le QR code de connexion Wi-Fi (scan = connexion directe), le nom du réseau,
 * un mot de passe masqué avec boutons « afficher » et « copier », et une image de fond au choix.
 * Style verre, thème clair/sombre automatique, éditeur visuel, textes en français.
 */
const CARD_VERSION = "1.0.0";

const DEFAULTS = {
  title: "Wi‑Fi invités",
  theme: "auto",
  ssid: "",
  security: "",
  qr_image: "",
  qr_entity: "",
  password: "",
  hint: "Scannez pour vous connecter",
  image: "",
  image_opacity: 0.35,
  qr_size: 15,
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

class WifiQrCard extends HTMLElement {
  static getConfigElement() { return document.createElement("wifi-qr-card-editor"); }
  static getStubConfig() { return { ...DEFAULTS, ssid: "Mon réseau" }; }

  constructor() { super(); this.attachShadow({ mode: "open" }); this._show = false; this._sig = ""; }

  setConfig(config) {
    if (!config) throw new Error("Configuration invalide");
    this._config = { ...DEFAULTS, ...config };
    this._sig = "";
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const sig = this._qrUrl() + (this._isDark() ? "d" : "l");
    if (sig !== this._sig) { this._sig = sig; this._render(); }
  }

  getCardSize() { return 6; }

  _isDark() {
    const t = this._config && this._config.theme;
    if (t === "dark") return true;
    if (t === "light") return false;
    const dm = this._hass && this._hass.themes && this._hass.themes.darkMode;
    return typeof dm === "boolean" ? dm : !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  _qrUrl() {
    const c = this._config, h = this._hass;
    if (c.qr_entity && h && h.states[c.qr_entity]) {
      const a = h.states[c.qr_entity].attributes || {};
      const p = a.entity_picture_local || a.entity_picture;
      if (p) return h.hassUrl ? h.hassUrl(p) : p;
    }
    return c.qr_image || "";
  }

  async _copy() {
    const pw = this._config.password;
    try { await navigator.clipboard.writeText(pw); }
    catch (e) {
      const t = document.createElement("textarea"); t.value = pw; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (_) {} t.remove();
    }
    const b = this.shadowRoot.querySelector("[data-copy]");
    if (b) { const old = b.innerHTML; b.innerHTML = `<ha-icon icon="mdi:check"></ha-icon>Copié`; setTimeout(() => { if (b.isConnected) b.innerHTML = old; }, 1600); }
  }

  _render() {
    const c = this._config;
    if (!c) return;
    const dark = this._isDark();
    const url = this._qrUrl();
    const bg = c.image ? `<div class="bgimg" style="background-image:url('${esc(c.image)}');opacity:${Number(c.image_opacity) || 0.35}"></div>` : "";
    const size = Math.max(8, Math.min(30, Number(c.qr_size) || 15));
    const qr = url
      ? `<img class="qr" src="${esc(url)}" alt="QR code Wi‑Fi" style="width:min(100%,${size}em)">`
      : `<div class="noqr glass"><ha-icon icon="mdi:qrcode"></ha-icon><span>Indique l'image du QR code dans l'éditeur.</span></div>`;
    const pw = c.password
      ? `<div class="pw glass"><ha-icon icon="mdi:key-variant"></ha-icon><code>${this._show ? esc(c.password) : "••••••••••••"}</code>
          <button data-toggle aria-label="${this._show ? "Masquer" : "Afficher"} le mot de passe"><ha-icon icon="${this._show ? "mdi:eye-off-outline" : "mdi:eye-outline"}"></ha-icon></button>
          <button data-copy aria-label="Copier le mot de passe"><ha-icon icon="mdi:content-copy"></ha-icon>Copier</button></div>` : "";

    this.shadowRoot.innerHTML = `<style>
      * { box-sizing:border-box; }
      ha-card.dark { --wq-text:#f4f6fb; --wq-muted:#c3c8d8; --wq-bg:linear-gradient(160deg,#1b1e32 0%,#241a2a 55%,#2d1519 100%); --wq-border:rgba(255,255,255,.14); --wq-shadow:0 .6em 2em rgba(0,0,0,.35); --wq-glass:rgba(20,22,36,.55); --wq-glass-b:rgba(255,255,255,.16); --wq-accent:#ff7ab0; }
      ha-card.light { --wq-text:#1c2030; --wq-muted:#4d5468; --wq-bg:linear-gradient(160deg,#f8f9fd 0%,#eef1f8 55%,#f8eff0 100%); --wq-border:rgba(20,24,40,.12); --wq-shadow:0 .4em 1.4em rgba(20,24,40,.12); --wq-glass:rgba(255,255,255,.72); --wq-glass-b:rgba(20,24,40,.1); --wq-accent:#c2245f; }
      ha-card { position:relative; container-type:inline-size; display:flex; flex-direction:column; align-items:center; gap:12px; padding:16px; color:var(--wq-text); border-radius:24px; border:1px solid var(--wq-border); background:var(--wq-bg); box-shadow:var(--wq-shadow); overflow:hidden; }
      ha-card > * { position:relative; }
      .bgimg { position:absolute !important; inset:0; background-size:cover; background-position:center; pointer-events:none; }
      ha-icon { --mdc-icon-size:1.3em; flex:none; }
      button { font:inherit; color:inherit; background:none; border:0; padding:.35em .5em; border-radius:.7em; cursor:pointer; display:inline-flex; align-items:center; gap:.35em; -webkit-tap-highlight-color:transparent; }
      button:hover { background:var(--wq-glass-b); }
      .t { align-self:flex-start; font-weight:700; font-size:1.05em; }
      .glass { background:var(--wq-glass); border:1px solid var(--wq-glass-b); -webkit-backdrop-filter:blur(18px) saturate(140%); backdrop-filter:blur(18px) saturate(140%); }
      .qr { display:block; height:auto; border-radius:1em; filter:drop-shadow(0 .4em 1em rgba(0,0,0,.25)); }
      .noqr { display:flex; align-items:center; gap:.7em; padding:1.2em; border-radius:18px; color:var(--wq-muted); }
      .net { display:flex; flex-direction:column; align-items:center; text-align:center; padding:.5em 1em; border-radius:18px; max-width:100%; }
      .ssid { display:flex; align-items:center; gap:.45em; font-weight:800; font-size:1.2em; word-break:break-all; } .ssid ha-icon { color:var(--wq-accent); }
      .sub { font-size:.85em; color:var(--wq-muted); }
      .pw { display:flex; align-items:center; gap:.4em; padding:.35em .6em .35em .9em; border-radius:999px; max-width:100%; flex-wrap:wrap; justify-content:center; }
      .pw code { font-size:.95em; letter-spacing:.04em; word-break:break-all; }
      .pw > ha-icon { color:var(--wq-accent); }
    </style>
    <ha-card class="${dark ? "dark" : "light"}">${bg}
      ${c.title ? `<div class="t">${esc(c.title)}</div>` : ""}
      ${qr}
      <div class="net glass"><div class="ssid"><ha-icon icon="mdi:wifi"></ha-icon>${esc(c.ssid || "Réseau Wi‑Fi")}</div>
        <div class="sub">${esc(c.hint)}${c.security ? ` · ${esc(c.security)}` : ""}</div></div>
      ${pw}
    </ha-card>`;
    const t = this.shadowRoot.querySelector("[data-toggle]");
    if (t) t.addEventListener("click", () => { this._show = !this._show; this._render(); });
    const cp = this.shadowRoot.querySelector("[data-copy]");
    if (cp) cp.addEventListener("click", () => this._copy());
  }
}

/* ---------- Éditeur visuel ---------- */
const LABELS = { title: "Titre", theme: "Thème", ssid: "Nom du réseau (SSID)", security: "Sécurité affichée (ex. WPA2)", qr_image: "Image du QR code (URL, ex. /local/wifi/qr.png)",
  qr_entity: "ou entité image du QR code", password: "Mot de passe (facultatif, affichable / copiable)", hint: "Texte d'invitation", image: "Image de fond (URL, facultatif)",
  image_opacity: "Opacité de l'image de fond", qr_size: "Taille du QR code (em)" };
const SCHEMA = [
  { type: "grid", name: "", schema: [{ name: "title", selector: { text: {} } },
    { name: "theme", selector: { select: { mode: "dropdown", options: [{ value: "auto", label: "Automatique" }, { value: "light", label: "Clair" }, { value: "dark", label: "Sombre" }] } } }] },
  { type: "grid", name: "", schema: [{ name: "ssid", selector: { text: {} } }, { name: "security", selector: { text: {} } }] },
  { name: "qr_image", selector: { text: {} } },
  { name: "qr_entity", selector: { entity: { domain: "image" } } },
  { name: "password", selector: { text: { type: "password" } } },
  { name: "hint", selector: { text: {} } },
  { name: "image", selector: { text: {} } },
  { type: "grid", name: "", schema: [{ name: "image_opacity", selector: { number: { min: 0.05, max: 1, step: 0.05, mode: "slider" } } },
    { name: "qr_size", selector: { number: { min: 8, max: 30, mode: "box" } } }] },
];

class WifiQrCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...DEFAULTS, ...config };
    if (!this._form) this._build(); else this._form.data = this._config;
  }
  set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
  _build() {
    const el = document.createElement("ha-form");
    el.hass = this._hass; el.data = this._config; el.schema = SCHEMA; el.computeLabel = (s) => LABELS[s.name] || s.name;
    el.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      const cfg = { ...ev.detail.value };
      ["qr_image", "qr_entity", "password", "image", "security"].forEach((k) => { if (cfg[k] === "" || cfg[k] == null) delete cfg[k]; });
      this._config = cfg;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
    });
    this._form = el; this.appendChild(el);
  }
}

customElements.define("wifi-qr-card", WifiQrCard);
customElements.define("wifi-qr-card-editor", WifiQrCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "wifi-qr-card", name: "Wi‑Fi QR Card (FR)", description: "QR code de connexion Wi‑Fi avec image de fond, mot de passe masqué, afficher / copier.", preview: true });
console.info(`%c WIFI-QR-CARD %c v${CARD_VERSION} `, "color:#fff;background:#c2245f;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px", "color:#c2245f;background:#fff;font-weight:700;border-radius:0 3px 3px 0;padding:2px 4px");
