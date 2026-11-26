// (own build) Pick a cover from the web, inside EmuScape: a small browser window on an image search for the game's
// name. Click a picture there and a bar comes up along the bottom of the window: "Use this picture as the cover?",
// with the picture beside it and two buttons. "Use this picture" stores it as the game's cover and closes the window.
// (A right-click on a picture offers the same.)
//
// The window is a plain web page and nothing more: its own throw-away session (no cookies kept, nothing shared with
// EmuScape's own windows), sandboxed, no access to EmuScape or to files, every permission refused, downloads refused,
// new windows opened in place. Two things are added to it:
//  - a few lines run in each page that say which picture was clicked (its address, nothing else), through the page's
//    console with a mark only this window knows;
//  - the bar, which is EmuScape's own (a separate view over the bottom of the window, no scripts in it): the page can
//    neither draw it nor press its buttons. So a cover is only ever set by the player pressing "Use this picture".
// The picture is then fetched as bytes and checked to be a JPG, PNG or WebP before it is handed to `onPick`.
const { BrowserWindow, WebContentsView, Menu, session, webFrameMain, nativeImage } = require('electron');
const crypto = require('crypto');

const MAX = 25e6; // the same limit as a picture of your own
const BAR_H = 92;
const SMALL = 400; // a cover narrower than this looks blurry on the shelf: asked about before it is used
const TITLE = 'Pick a cover  ·  click a picture, then "Use this picture" at the bottom';
let open = null; // one at a time

// JPG / PNG / WebP by the file's first bytes (what the shelf can show); anything else is refused
function kindOf(buf) {
  if (!buf || buf.length < 16) return '';
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'png';
  if (buf.slice(0, 4).toString('latin1') === 'RIFF' && buf.slice(8, 12).toString('latin1') === 'WEBP') return 'webp';
  return '';
}
// the picture behind an address: a data: one is decoded, an http(s) one fetched through the window's own session
async function bytesOf(ses, src) {
  src = String(src || '');
  const d = /^data:image\/[a-z0-9.+-]+;base64,([a-z0-9+/=\s]+)$/i.exec(src);
  if (d) { const b = Buffer.from(d[1], 'base64'); if (b.length > MAX) throw new Error('That picture is too big (over 25 MB).'); return b; }
  if (!/^https?:\/\//i.test(src)) throw new Error("That picture can't be read from here. Open it bigger and try again.");
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await ses.fetch(src, { signal: ctl.signal, redirect: 'follow' }); // (no Referer header: sent along to another site, the request itself was refused, net::ERR_BLOCKED_BY_CLIENT)
    if (!r.ok) throw new Error(`The site didn't hand over that picture (${r.status}). Try another one.`);
    const len = Number(r.headers.get('content-length') || 0); if (len > MAX) throw new Error('That picture is too big (over 25 MB).');
    const b = Buffer.from(await r.arrayBuffer()); if (b.length > MAX) throw new Error('That picture is too big (over 25 MB).');
    return b;
  } catch (e) { if (e && e.name === 'AbortError') throw new Error('That picture took too long to download. Try another one.');
    if (e && /^net::|ERR_[A-Z_]+|fetch failed/i.test(String(e.message))) throw new Error("Couldn't download that picture (" + String(e.message).replace(/^net::/, '') + '). Try another one.'); throw e; } finally { clearTimeout(t); }
}
// how big a picture is, when that can be told (JPG and PNG; a WebP's size isn't read here: { w: 0 })
function sizeOf(buf) { try { const z = nativeImage.createFromBuffer(buf).getSize(); return { w: z.width | 0, h: z.height | 0 }; } catch { return { w: 0, h: 0 }; } }
// a search thumbnail's address without the size it was asked at: the biggest copy the search engine keeps of it
function biggerThumb(u) { try { const x = new URL(u); if (!/(^|\.)bing\.(com|net)$/i.test(x.hostname) || !/^\/th(\/|$)/i.test(x.pathname)) return ''; let ch = false; for (const k of ['w', 'h', 'c', 'rs', 'qlt', 'pid', 'o', 'dpr', 'cb', 'r']) if (x.searchParams.has(k)) { x.searchParams.delete(k); ch = true; } return ch ? x.toString() : ''; } catch { return ''; } }
// The picture to use for a click. The page may point at the full-size original (a search result does); that one is
// tried first, then a bigger copy of the thumbnail, then the picture as shown. The first that is a real picture and
// wide enough is taken; if none is wide enough, the widest that could be had. { buf, ext, w, h }
async function bestBytes(ses, sel) {
  const tries = [...(sel.big || []), biggerThumb(sel.src), sel.src].filter((u, i, a) => u && a.indexOf(u) === i).slice(0, 6); let last = null, best = null;
  for (const u of tries) {
    try {
      const buf = await bytesOf(ses, u), ext = kindOf(buf);
      if (!ext) { last = new Error("That one isn't a JPG, PNG or WebP picture. Try another one."); continue; }
      if (buf.length < 3000) { last = new Error('That picture is too small to make a cover. Click it to open it bigger, then click the big one.'); continue; }
      const z = sizeOf(buf), got = { buf, ext, w: z.w, h: z.h };
      if (!z.w || z.w >= SMALL) return got;
      if (!best || z.w > best.w) best = got;
    } catch (e) { last = e; }
  }
  if (best) return best;
  throw last || new Error("Couldn't use that picture. Try another one.");
}

// Run in every page and frame of the window: on a click, the picture under the pointer (if any) is reported. Nothing
// is changed on the page and the click goes on to do what it always does there (open the picture bigger, say).
const clickScript = mark => `(() => { if (window.__bsCoverPick) return; window.__bsCoverPick = 1;
  const ok = u => typeof u === 'string' && /^https?:\\/\\//i.test(u) && u.length < 4000;
  const param = (loc, k) => { try { return new URLSearchParams(String(loc.search || '')).get(k) || ''; } catch { return ''; } };
  const bigOf = (img, r) => { const out = [];
    try { const a = img.closest('a[m]'); if (a) { const u = JSON.parse(a.getAttribute('m')).murl; if (ok(u)) out.push(u); } } catch {}   // a search result: the page it came from says where the original is
    try { if (!out.length && r.height >= 250) { let u = param(location, 'mediaurl'); if (!u) { try { u = param(top.location, 'mediaurl'); } catch {} } if (ok(u)) out.push(u); } } catch {}   // the result opened big: the original is in the address
    try { const a = img.closest('a[href]'); if (a && /\\.(jpe?g|png|webp)([?#]|$)/i.test(a.href) && ok(a.href)) out.push(a.href); } catch {}   // a picture that links to its own file
    try { const ss = img.getAttribute('srcset'); if (ss) { const L = ss.split(',').map(x => x.trim().split(/\\s+/)).filter(x => x[0]).map(x => [new URL(x[0], location.href).href, parseFloat(x[1]) || 0]).sort((p, q) => q[1] - p[1]); if (L[0] && ok(L[0][0])) out.push(L[0][0]); } } catch {}
    return out.filter((u, i, a) => a.indexOf(u) === i).slice(0, 4); };
  addEventListener('click', ev => { try {
    const L = document.elementsFromPoint(ev.clientX, ev.clientY), img = L.find(e => e && e.tagName === 'IMG' && (e.currentSrc || e.src));
    if (!img) return; const r = img.getBoundingClientRect(); if (r.width < 48 || r.height < 48) return;
    console.log(${JSON.stringify(mark)} + JSON.stringify({ src: String(img.currentSrc || img.src).slice(0, 200000), big: bigOf(img, r), w: img.naturalWidth | 0, h: img.naturalHeight | 0, page: location.href.slice(0, 2000) }));
  } catch {} }, true);
})();`;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// the bar's page: EmuScape's own, no scripts; its buttons are links the window catches (https://bs-cover.invalid/use, …/cancel: never loaded)
function barHtml({ src, w, h, state, error }) {
  const pic = /^(https?:|data:image\/)/i.test(src || '') ? `<img src="${esc(src)}" alt="">` : '<div class="ph"></div>';
  const size = w > 0 && h > 0 ? `${w} × ${h}` : '';
  const text = state === 'busy' ? '<b>Getting the picture…</b>' : state === 'small' ? `<b class="warn">This one is only ${esc(size)}: it will look blurry as a cover.</b><span>Click it to open it bigger and click the big one, or pick another. Or use it as it is.</span>` : error ? `<b class="err">${esc(error)}</b><span>Click another picture, or try this one again.</span>`
    : `<b>Use this picture as the cover?</b><span>${size ? esc(size) + ' · ' : ''}Clicking another picture changes the choice.</span>`;
  const btns = state === 'busy' ? '' : state === 'small' ? '<a class="go" href="https://bs-cover.invalid/use">Use it anyway</a><a class="no" href="https://bs-cover.invalid/cancel">Not this one</a>' : '<a class="go" href="https://bs-cover.invalid/use">Use this picture</a><a class="no" href="https://bs-cover.invalid/cancel">Not this one</a>';
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: http: data:; style-src 'unsafe-inline'">
<style>html,body{margin:0;height:100%;overflow:hidden}body{display:flex;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box;background:#14161f;color:#f2f4fb;font:15px/1.3 "Segoe UI",system-ui,sans-serif;border-top:2px solid #6f86ff;user-select:none}
img,.ph{height:72px;width:54px;object-fit:cover;border-radius:6px;background:#2a2e3d;flex:none}
.t{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}b{font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}b.err{color:#ffb4a8;white-space:normal;font-size:15px}b.warn{color:#ffd98a;white-space:normal;font-size:15px}
span{color:#a8aec4;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
a{flex:none;text-decoration:none;border-radius:999px;padding:12px 22px;font-weight:600;cursor:pointer}a.go{background:#fff;color:#11131a}a.go:hover{background:#dfe5ff}a.no{color:#f2f4fb;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}a.no:hover{background:rgba(255,255,255,.1)}</style>
${pic}<div class="t">${text}</div>${btns}`;
}

// query: what to search for; onPick(buf, ext): store it (may throw); resolves { ok } when the window closes
function pick({ parent, query, onPick, log }) {
  if (open && !open.isDestroyed()) { try { open.focus(); } catch {} return Promise.resolve({ ok: false, busy: true }); }
  return new Promise(resolve => {
    const ses = session.fromPartition('coverweb'); // no "persist:": kept in memory only, gone when EmuScape quits
    try { ses.setPermissionRequestHandler((wc, perm, cb) => cb(false)); ses.setPermissionCheckHandler(() => false); } catch {}
    try { ses.removeAllListeners('will-download'); ses.on('will-download', e => e.preventDefault()); } catch {}
    const web = { partition: 'coverweb', sandbox: true, contextIsolation: true, nodeIntegration: false, webSecurity: true, webviewTag: false, spellcheck: false, devTools: false };
    const win = open = new BrowserWindow({ parent: parent && !parent.isDestroyed() ? parent : undefined, width: 1180, height: 860, minWidth: 700, minHeight: 520, show: true, title: TITLE, autoHideMenuBar: true, backgroundColor: '#ffffff', webPreferences: web });
    try { win.removeMenu(); } catch {}
    const wc = win.webContents, mark = 'bscover:' + crypto.randomBytes(12).toString('hex') + ':';
    let done = false, busy = false, sel = null, bar = null, barOn = false;
    const canBack = () => { try { const h = wc.navigationHistory; return h && h.canGoBack ? h.canGoBack() : !!(wc.canGoBack && wc.canGoBack()); } catch { return false; } };
    const goBack = () => { try { const h = wc.navigationHistory; if (h && h.goBack) h.goBack(); else wc.goBack(); } catch {} };
    const keepTitle = () => { try { if (!win.isDestroyed() && win.getTitle() !== TITLE) win.setTitle(TITLE); } catch {} }; // the title bar keeps saying what to do
    win.on('page-title-updated', e => { e.preventDefault(); keepTitle(); }); wc.on('did-finish-load', keepTitle); wc.on('did-navigate', keepTitle);
    wc.setWindowOpenHandler(({ url }) => { if (/^https?:\/\//i.test(url)) setImmediate(() => { try { if (!win.isDestroyed()) wc.loadURL(url); } catch {} }); return { action: 'deny' }; });
    wc.on('will-navigate', (e, url) => { if (!/^https?:\/\//i.test(url)) e.preventDefault(); });
    wc.on('before-input-event', (e, input) => { if (input.type === 'keyDown' && ((input.alt && input.key === 'ArrowLeft') || input.key === 'BrowserBack')) { e.preventDefault(); goBack(); } });

    // ---- the bar along the bottom (EmuScape's own view, over the page)
    const place = () => { if (!bar || win.isDestroyed()) return; const [w, h] = win.getContentSize(); try { bar.setBounds({ x: 0, y: Math.max(0, h - BAR_H), width: w, height: BAR_H }); } catch {} };
    const showBar = o => {
      if (win.isDestroyed()) return;
      if (!bar) {
        bar = new WebContentsView({ webPreferences: { partition: 'coverweb', sandbox: true, contextIsolation: true, nodeIntegration: false, javascript: false, devTools: false } });
        const bw = bar.webContents;
        bw.setWindowOpenHandler(() => ({ action: 'deny' }));
        bw.on('will-navigate', (e, url) => { e.preventDefault(); if (url === 'https://bs-cover.invalid/use') use(); else if (url === 'https://bs-cover.invalid/cancel') hideBar(); /* an address that goes nowhere: only this catches it */ });
        bw.on('context-menu', e => e.preventDefault());
      }
      if (!barOn) { try { win.contentView.addChildView(bar); barOn = true; } catch (e) { if (log) log('Cover from the web: the bar could not be shown:', e.message); return; } }
      place(); bar.webContents.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(barHtml(o))).catch(() => {});
    };
    const hideBar = () => { sel = null; if (bar && barOn && !win.isDestroyed()) { try { win.contentView.removeChildView(bar); } catch {} barOn = false; } };
    win.on('resize', place);

    // ---- which picture was clicked (said by the lines run in each page / frame)
    const inject = frame => { try { if (frame) frame.executeJavaScript(clickScript(mark)).catch(() => {}); } catch {} };
    wc.on('dom-ready', () => inject(wc.mainFrame));
    wc.on('did-frame-finish-load', (e, isMain, pid, rid) => { try { inject(webFrameMain.fromId(pid, rid)); } catch {} });
    wc.on('did-frame-navigate', (e, url, code, status, isMain, pid, rid) => { try { const f = webFrameMain.fromId(pid, rid); if (f) f.once('dom-ready', () => inject(f)); } catch {} });
    wc.on('console-message', (e, level, message) => {
      const msg = e && typeof e.message === 'string' ? e.message : message; if (typeof msg !== 'string' || !msg.startsWith(mark) || busy || done) return;
      let o = null; try { o = JSON.parse(msg.slice(mark.length)); } catch { return; }
      const src = String((o && o.src) || ''), big = (Array.isArray(o && o.big) ? o.big : []).map(String).filter(u => /^https?:\/\//i.test(u) && u.length < 4000).slice(0, 4); if (!/^(https?:\/\/|data:image\/)/i.test(src)) return;
      /* a new click is a new choice */ sel = { src, big, page: /^https?:\/\//i.test(String(o.page || '')) ? String(o.page) : wc.getURL(), w: Number(o.w) | 0, h: Number(o.h) | 0 };
      showBar({ src: sel.src, w: sel.w, h: sel.h });
    });

    async function use(given) {
      const s = given || sel; if (busy || done || !s) return; busy = true; showBar({ src: s.src, w: s.w, h: s.h, state: 'busy' });
      try {
        const got = s.got && s.small ? s.got : await bestBytes(ses, s), { buf, ext } = got;
        if (got.w && got.w < SMALL && !s.small) { s.small = true; s.got = got; sel = s; if (!win.isDestroyed()) showBar({ src: s.src, w: got.w, h: got.h, state: 'small' }); return; } // asked once; "Use it anyway" comes back here
        await onPick(buf, ext); done = true; if (log) log('PC cover picked from the web:', ext, Math.round(buf.length / 1024) + ' KB', got.w ? got.w + 'x' + got.h : '');
        if (!win.isDestroyed()) win.close();
      } catch (e) {
        const m = String((e && e.message) || "Couldn't use that picture. Try another one."); if (log) log('Cover from the web:', m);
        sel = s; if (!win.isDestroyed()) showBar({ src: s.src, w: s.w, h: s.h, error: m });
      } finally { busy = false; }
    }
    wc.on('context-menu', (e, p) => {
      const items = [];
      if (p && p.mediaType === 'image' && p.srcURL) items.push({ label: 'Use this picture as the cover', click: () => use({ src: p.srcURL, big: [], page: p.pageURL || wc.getURL(), w: 0, h: 0 }) }, { type: 'separator' });
      items.push({ label: 'Back', enabled: canBack(), click: goBack }, { label: 'Reload', click: () => { try { wc.reload(); } catch {} } }, { type: 'separator' }, { label: 'Close without choosing', click: () => { try { win.close(); } catch {} } });
      try { Menu.buildFromTemplate(items).popup({ window: win }); } catch {}
    });
    win.on('closed', () => { if (open === win) open = null; try { if (bar && !bar.webContents.isDestroyed()) bar.webContents.close(); } catch {} resolve({ ok: done }); });
    // an image search for the name, asked for what a cover needs: tall pictures (a case is 2:3), large ones
    wc.loadURL('https://www.bing.com/images/search?q=' + encodeURIComponent(String(query || '').slice(0, 160)) + '&qft=' + encodeURIComponent('+filterui:aspect-tall+filterui:imagesize-large') + '&form=IRFLTR').catch(() => {});
  });
}
const close = () => { try { if (open && !open.isDestroyed()) open.close(); } catch {} };
module.exports = { pick, close, kindOf, bytesOf, barHtml, biggerThumb };
