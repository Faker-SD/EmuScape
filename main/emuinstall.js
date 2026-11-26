// (own build) "Download emulators": EmuScape downloads each console's emulator from its official place, unpacks it into
// one folder per emulator (<Emulators>\<Name>, the "My emulators folder" when one is chosen, else EmuScape\Emulators),
// makes a games folder per console (<Games>\<Console>) and hands the result back in detectIn's shape, so the page puts
// each console's emulator and folder in place the same way "My folders" does. Like EmuDeck, without needing it.
//   Sources (checked 2026-11): GitHub releases through the public API (newest release with a matching Windows asset;
//   stable first, a pre-release only for projects that only publish those); Dolphin's and PPSSPP's own download pages
//   (the first Windows x64 link on the page); RetroArch's stable buildbot (newest version folder). Cores aren't
//   downloaded here: EmuScape already gets a console's core the first time a game needs it (main/racores.js).
//   Never downloaded: BIOS files, firmware, keys. Those stay the user's to add (each console's BIOS row).
// Unpacking: zips with Windows' own tar (bsdtar, also .7z on recent Windows); when tar can't read a .7z, 7-Zip's
// official stand-alone 7zr.exe is fetched once into data\tools. An update unpacks over the old copy without removing
// anything, so the emulator's own settings and saves next to it stay. Windows only.
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execFile } = require('child_process');

let log = () => {}, dataDir = '';
function init(o) { if (o && o.log) log = o.log; if (o && o.dataDir) dataDir = o.dataDir; }

const AVOID = /libretro|arm64|aarch64|arm32|symbols|debug|\.pdb|pdb\.|\.sha256|\.sha512|\.sig$|\.asc$|installer|setup|source|linux|macos|android|\.appimage|\.flatpak|\.dmg|\.apk/i;
// id: also the folder name. systems: the consoles it's put on. exe: the program to find after unpacking.
const CATALOG = [
  { id: 'Dolphin', systems: ['gc', 'wii'], exe: /^dolphin\.exe$/i, page: 'https://dolphin-emu.org/download/', link: [/https:\/\/dl\.dolphin-emu\.org\/releases\/[^"'\s<>]+?-x64\.7z/i, /https:\/\/dl\.dolphin-emu\.org\/builds\/[^"'\s<>]+?-x64\.7z/i], site: 'dolphin-emu.org' },
  { id: 'Cemu', systems: ['wiiu'], exe: /^cemu\.exe$/i, gh: 'cemu-project/Cemu', want: [/windows-x64\.zip$/i, /win.*\.zip$/i] },
  { id: 'Eden', systems: ['sw'], exe: /^eden\.exe$/i, api: ['https://git.eden-emu.dev/api/v1/repos/eden-emu/eden/releases?limit=15'], gh: 'eden-emulator/Releases', want: [/windows.*(amd64|x86_64|x64).*msvc.*pgo.*\.zip$/i, /windows.*(amd64|x86_64|x64).*msvc.*\.zip$/i, /windows.*(amd64|x86_64|x64).*\.zip$/i, /windows.*\.zip$/i] },
  { id: 'PPSSPP', systems: ['psp'], exe: /^ppssppwindows64\.exe$/i, page: 'https://www.ppsspp.org/download/', link: /(?:https:\/\/www\.ppsspp\.org)?\/files\/[0-9_]+\/ppsspp_win\.zip/i, site: 'ppsspp.org' },
  { id: 'PCSX2', systems: ['ps2'], exe: /^pcsx2-qt.*\.exe$/i, gh: 'PCSX2/pcsx2', want: [/windows-x64-qt\.7z$/i, /windows.*x64.*\.7z$/i, /windows.*x64.*\.zip$/i] },
  { id: 'RPCS3', systems: ['ps3'], exe: /^rpcs3\.exe$/i, gh: 'RPCS3/rpcs3-binaries-win', want: [/_win64.*\.7z$/i, /win64.*\.(7z|zip)$/i] },
  { id: 'shadPS4', systems: ['ps4'], exe: /^shadps4.*\.exe$/i, gh: 'shadps4-emu/shadPS4', want: [/win64.*qt.*\.zip$/i, /win64.*\.zip$/i, /windows.*\.zip$/i] },
  { id: 'Xenia', systems: ['x360'], exe: /^xenia_canary\.exe$/i, gh: 'xenia-canary/xenia-canary-releases', pre: true, want: [/^xenia_canary_windows\.zip$/i, /xenia.*windows.*\.zip$/i] },
  { id: 'xemu', systems: ['xbox'], exe: /^xemu\.exe$/i, gh: 'xemu-project/xemu', want: [/win.*x86_64.*release\.zip$/i, /xemu-win.*\.zip$/i, /win.*\.zip$/i] },
  { id: 'Azahar', systems: ['n3ds'], exe: /^azahar(-qt)?\.exe$/i, gh: 'azahar-emu/azahar', want: [/windows-msvc[-\d.]*\.zip$/i, /windows-(mxe|msys2?)[-\d.]*\.zip$/i, /windows.*\.zip$/i] }, // (own build) its zips carry the version (azahar-windows-msvc-2126.2.zip) and a RetroArch core zip sits beside them
  { id: 'DuckStation', systems: ['psx'], exe: /^duckstation-qt.*\.exe$/i, gh: 'stenzek/duckstation', pre: true, want: [/windows-x64-release\.zip$/i, /windows.*x64.*\.zip$/i] },
  { id: 'melonDS', systems: ['nds'], exe: /^melonds\.exe$/i, gh: 'melonDS-emu/melonDS', want: [/windows.*x86_64.*\.zip$/i, /win.*x64.*\.zip$/i, /windows.*\.zip$/i] },
  { id: 'Eglantine', systems: ['sw2'], exe: /^eglantine\.exe$/i, gh: 'Djihads80/Eglantine', pre: true, want: [/windows.*(amd64|x86_64|x64).*\.zip$/i, /win.*\.zip$/i, /\.zip$/i] },
  { id: 'Kyty', systems: ['ps5'], exe: /^kyty(_emulator)?\.exe$/i, gh: 'Jetsku/KytyPS5', pre: true, want: [/win.*\.zip$/i, /\.zip$/i, /\.7z$/i] },
  { id: 'RetroArch', systems: ['nes', 'snes', 'n64', 'gb', 'gbc', 'gba', 'megadrive', 'mastersystem', 'gamegear', 'dreamcast', 'saturn', 'pcengine', 'neogeo', 'arcade', 'segacd', 'sega32x', 'atari2600', 'atarilynx', 'wonderswan', 'dos'], exe: /^retroarch\.exe$/i, buildbot: 'https://buildbot.libretro.com/stable/', site: 'buildbot.libretro.com' },
];
const byId = id => CATALOG.find(e => e.id === id);

// ---------- web ----------
const UA = 'EmuScape (emulator installer)';
function get(url, { json = false, hops = 0, timeout = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!/^https:\/\//i.test(url)) return reject(new Error('only https downloads'));
    const req = https.get(url, { headers: { 'User-Agent': UA, Accept: json ? 'application/vnd.github+json' : 'text/html,*/*' } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && hops < 6) { res.resume(); return resolve(get(new URL(res.headers.location, url).toString(), { json, hops: hops + 1, timeout })); }
      if (res.statusCode !== 200) { res.resume(); return reject(Object.assign(new Error(res.statusCode === 403 || res.statusCode === 429 ? 'GitHub is limiting requests right now: try again in an hour' : `the site answered ${res.statusCode}`), { status: res.statusCode })); }
      let b = ''; res.setEncoding('utf8'); res.on('data', c => { b += c; if (b.length > 8e6) req.destroy(new Error('answer too big')); });
      res.on('end', () => { if (!json) return resolve(b); try { resolve(JSON.parse(b)); } catch (e) { reject(new Error('the answer could not be read')); } });
    });
    req.on('error', reject); req.setTimeout(timeout, () => req.destroy(new Error('the site did not answer')));
  });
}
function download(url, dest, onPct, hops = 0) {
  return new Promise((resolve, reject) => {
    if (!/^https:\/\//i.test(url)) return reject(new Error('only https downloads'));
    const req = https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && hops < 6) { res.resume(); return resolve(download(new URL(res.headers.location, url).toString(), dest, onPct, hops + 1)); }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`the download server answered ${res.statusCode}`)); }
      const total = +res.headers['content-length'] || 0; let got = 0, last = -1;
      res.on('data', c => { got += c.length; const p = total ? Math.floor(got / total * 100) : -1; if (p !== last && onPct) { last = p; onPct(p, got, total); } });
      require('stream').pipeline(res, fs.createWriteStream(dest), e => { if (e) reject(e); else if (total && got < total) reject(new Error('the download was cut short')); else if (got < 100000) reject(new Error('the download was too small to be an emulator')); else resolve(got); });
      req.setTimeout(90000, () => req.destroy(new Error('the download stalled')));
    });
    req.on('error', reject); req.setTimeout(60000, () => req.destroy(new Error('the download server did not answer')));
  });
}

// ---------- where the newest Windows build is ----------
// a version to show: the tag when it's a number (v2.4.0, 2124), else the file's (rpcs3-v0.0.38-18300…), else the release date
function verOf(r, file) {
  const t = String(r.tag_name || r.name || '').replace(/^v\.?(?=\d)/i, '');
  if (/^\d+(\.\d+)*$/.test(t)) return t;
  const m = /v?(\d+\.\d+(?:\.\d+)*(?:-\d+)?)/.exec(file); if (m) return m[1];
  return r.published_at ? String(r.published_at).slice(0, 10) : t;
}
function pickAsset(e, releases) {
  const rels = (Array.isArray(releases) ? releases : []).filter(r => r && !r.draft);
  const order = [...rels.filter(r => !r.prerelease), ...(e.pre ? rels.filter(r => r.prerelease) : [])];
  // newest first within each group (the API already lists newest first; stable releases are tried before pre-releases
  // unless the project publishes only pre-releases, as Xenia Canary and DuckStation's rolling builds do)
  if (e.pre) order.sort((a, b) => Date.parse(b.published_at || 0) - Date.parse(a.published_at || 0));
  for (const r of order) for (const w of e.want) {
    const a = (r.assets || []).find(x => x && w.test(x.name) && !AVOID.test(x.name) && /^https:\/\//.test(x.browser_download_url || ''));
    if (a) return { url: a.browser_download_url, file: a.name, version: verOf(r, a.name), size: a.size || 0 };
  }
  return null;
}
// GitHub's web pages: /releases/latest (stable) or /releases (newest first, for projects that only publish pre-releases),
// then each release's file list (/releases/expanded_assets/TAG)
async function htmlReleases(e) {
  const base = `https://github.com/${e.gh}`, tagsOf = h => [...new Set([...String(h).matchAll(/releases\/expanded_assets\/([^"'?#<>\s]+)/g)].map(m => m[1]))];
  let tags = [];
  if (!e.pre) { try { tags = tagsOf(await get(base + '/releases/latest')).slice(0, 1); } catch {} }
  if (!tags.length) tags = tagsOf(await get(base + '/releases')).slice(0, 4);
  const out = [];
  for (const t of tags) {
    let h = ''; try { h = await get(`${base}/releases/expanded_assets/${t}`); } catch { continue; }
    const assets = [...new Set([...h.matchAll(new RegExp('href="(/' + e.gh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/releases/download/[^"]+)"', 'gi'))].map(m => m[1]))]
      .map(href => ({ name: decodeURIComponent(href.split('/').pop()), browser_download_url: 'https://github.com' + href, size: 0 }));
    out.push({ tag_name: decodeURIComponent(t), prerelease: !!e.pre, assets });
  }
  return out;
}
async function latest(e) {
  if (e.gh || e.api) {
    // the project's own server first when it has one (Gitea / Forgejo answer like GitHub), then GitHub
    const urls = [...(e.api || []), ...(e.gh ? [`https://api.github.com/repos/${e.gh}/releases?per_page=15`] : [])]; let why = null;
    for (const u of urls) {
      try { const a = pickAsset(e, await get(u, { json: true })); if (a) return a; why = why || new Error('no Windows download found in its releases'); }
      catch (err) { why = err.status === 451 ? new Error('GitHub has this download blocked (451)') : err; log('Emulator installer:', e.id, u, 'failed:', err.message); }
    }
    // (own build) GitHub's API allows 60 questions an hour without an account: when it says no (or found nothing), read the
    // project's public releases page instead, which has the same files
    if (e.gh) { try { const a = pickAsset(e, await htmlReleases(e)); if (a) { log('Emulator installer:', e.id, 'found through the releases page:', a.file); return a; } }
      catch (err) { log('Emulator installer:', e.id, 'releases page failed:', err.message); } }
    throw why || new Error('no Windows download found');
  }
  if (e.page) {
    const html = await get(e.page), m = [].concat(e.link).map(re => re.exec(html)).find(Boolean); if (!m) throw new Error(`no Windows download link found on ${e.site}`);
    const url = new URL(m[0].replace(/&amp;/g, '&'), e.page).toString(), file = decodeURIComponent(url.split('/').pop());
    const v = (/(\d+(?:[._]\d+)+)/.exec(url.replace(/\/[^/]+$/, '').split('/').pop() + ' ' + file) || [])[1] || '';
    return { url, file, version: v.replace(/_/g, '.'), size: 0 };
  }
  if (e.buildbot) {
    // (own build) any way the folder list writes its links (href="1.22.2/", href="/stable/1.22.2/", …); if the page has none,
    // the newest version comes from RetroArch's GitHub releases and the download is still the buildbot's
    let html = ''; try { html = await get(e.buildbot); } catch (err) { log('Emulator installer: buildbot list failed:', err.message); }
    let vs = [...new Set([...String(html).matchAll(/(?:href=["']|\/)(\d+\.\d+\.\d+)\/?["']/g)].map(m => m[1]))];
    if (!vs.length) { try { const rel = await get('https://api.github.com/repos/libretro/RetroArch/releases?per_page=10', { json: true });
      vs = (Array.isArray(rel) ? rel : []).filter(r => r && !r.draft && !r.prerelease).map(r => String(r.tag_name || '').replace(/^v/i, '')).filter(v => /^\d+\.\d+\.\d+$/.test(v)); } catch (err) { log('Emulator installer: RetroArch releases failed:', err.message); } }
    if (!vs.length) throw new Error("couldn't find RetroArch's newest version (buildbot.libretro.com or GitHub didn't answer)");
    const num = v => v.split('.').map(Number), newest = vs.sort((a, b) => { const x = num(a), y = num(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i]; return 0; })[0];
    return { url: `${e.buildbot}${newest}/windows/x86_64/RetroArch.7z`, file: 'RetroArch.7z', version: newest, size: 0 };
  }
  throw new Error('unknown source');
}

// ---------- unpacking ----------
const run = (cmd, args, ms = 15 * 60e3) => new Promise((res, rej) => execFile(cmd, args, { windowsHide: true, timeout: ms, maxBuffer: 32 << 20 }, (e, out, err) => e ? rej(Object.assign(e, { stderr: String(err || '') })) : res(String(out))));
const isFile = f => { try { return fs.statSync(f).isFile(); } catch { return false; } };
async function sevenZip() {
  const dir = path.join(dataDir || os.tmpdir(), 'tools'), exe = path.join(dir, '7zr.exe');
  if (isFile(exe)) return exe;
  fs.mkdirSync(dir, { recursive: true }); const tmp = exe + '.part';
  log('Emulator installer: getting 7-Zip (7zr.exe) to unpack .7z files');
  await new Promise((res, rej) => { const go = (u, h) => https.get(u, { headers: { 'User-Agent': UA } }, r => { if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location && h < 5) { r.resume(); return go(new URL(r.headers.location, u).toString(), h + 1); } if (r.statusCode !== 200) { r.resume(); return rej(new Error('7-Zip\'s site answered ' + r.statusCode)); } require('stream').pipeline(r, fs.createWriteStream(tmp), e => e ? rej(e) : res()); }).on('error', rej); go('https://www.7-zip.org/a/7zr.exe', 0); });
  const head = Buffer.alloc(2), fd = fs.openSync(tmp, 'r'); fs.readSync(fd, head, 0, 2, 0); fs.closeSync(fd);
  if (head.toString('latin1') !== 'MZ') { try { fs.unlinkSync(tmp); } catch {} throw new Error('the 7-Zip download was not a program'); }
  fs.renameSync(tmp, exe); return exe;
}
function emptyDir(d) { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} fs.mkdirSync(d, { recursive: true }); }
async function unpack(file, out) {
  emptyDir(out);
  try { await run('tar', ['-xf', file, '-C', out]); if (fs.readdirSync(out).length) return; throw new Error('nothing unpacked'); }
  catch (e) {
    if (!/\.7z$/i.test(file)) throw new Error('the download could not be unpacked (' + String(e.stderr || e.message).trim().split('\n')[0] + ')');
    emptyDir(out); const z = await sevenZip(); await run(z, ['x', '-y', '-o' + out, file]);
    if (!fs.readdirSync(out).length) throw new Error('the .7z download could not be unpacked');
  }
}
// one folder holding everything (Dolphin-x64\…, RetroArch-Win64\…): its contents are the emulator's folder
function rootOf(dir) { let d = dir; for (let i = 0; i < 2; i++) { const l = fs.readdirSync(d).filter(n => !/^__MACOSX$/i.test(n)); if (l.length === 1 && fs.statSync(path.join(d, l[0])).isDirectory()) d = path.join(d, l[0]); else break; } return d; }
function findExe(dir, re, depth = 3) {
  let best = null; const walk = (d, n) => { let l = []; try { l = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const x of l) { const p = path.join(d, x.name); if (x.isFile() && re.test(x.name)) { if (!best || p.length < best.length) best = p; } }
    if (n > 0) for (const x of l) if (x.isDirectory() && !/^(user|users|cache|shaders?|saves?|states?|logs?|dev_hdd\d|dev_flash)$/i.test(x.name)) walk(path.join(d, x.name), n - 1); };
  walk(dir, depth); return best;
}

// ---------- folders ----------
let roots = () => ({ emulators: '', games: '' });
function setRoots(fn) { roots = fn; }
const verFile = d => path.join(d, '.boxshelf-install.json');
function readVer(d) { try { return JSON.parse(fs.readFileSync(verFile(d), 'utf8')); } catch { return null; } }

function status() {
  const r = roots(); const out = {};
  for (const e of CATALOG) {
    const d = path.join(r.emulators, e.id), v = readVer(d), exe = fs.existsSync(d) ? findExe(d, e.exe) : null;
    out[e.id] = { id: e.id, systems: e.systems, folder: d, installed: !!exe, exe: exe || '', version: v && v.version || '', at: v && v.at || 0, busy: busy.has(e.id) ? busy.get(e.id) : null };
  }
  return { emulators: r.emulators, games: r.games, list: out, windows: process.platform === 'win32' };
}

// ---------- installing ----------
const busy = new Map(); let queue = Promise.resolve();
function install(id, names, onStep) {
  const e = byId(id); if (!e) return Promise.reject(new Error('Unknown emulator.'));
  if (process.platform !== 'win32') return Promise.reject(new Error('Downloading emulators works on Windows only.'));
  if (busy.has(id)) return Promise.reject(new Error(id + ' is already being downloaded.'));
  const step = (phase, pct, extra) => { const s = { id, phase, pct: pct == null ? -1 : pct, ...(extra || {}) }; busy.set(id, s); try { onStep && onStep(s); } catch {} };
  step('waiting');
  const job = queue.then(async () => {
    const r = roots(); if (!r.emulators) throw new Error('No emulators folder.');
    const dest = path.join(r.emulators, e.id), tmp = path.join(r.emulators, '.download-' + e.id);
    try {
      step('finding');
      const a = await latest(e); log('Emulator installer:', e.id, a.version || '', a.url);
      fs.mkdirSync(tmp, { recursive: true }); const file = path.join(tmp, a.file.replace(/[^\w.\-]+/g, '_'));
      step('downloading', 0, { version: a.version });
      await download(a.url, file, p => step('downloading', p, { version: a.version }));
      step('unpacking', null, { version: a.version });
      const x = path.join(tmp, 'x'); await unpack(file, x);
      const src = rootOf(x); if (!findExe(src, e.exe)) throw new Error(`${e.id}'s program wasn't in the download`);
      fs.mkdirSync(dest, { recursive: true });
      fs.cpSync(src, dest, { recursive: true, force: true }); // over the old copy: its settings, saves and anything added stay
      const exe = findExe(dest, e.exe); if (!exe) throw new Error(`${e.id} was unpacked but its program wasn't found`);
      checked.set(e.id, { at: Date.now(), r: { id: e.id, version: a.version, file: a.file } });
      fs.writeFileSync(verFile(dest), JSON.stringify({ version: a.version, file: a.file, url: a.url, at: Date.now() }, null, 1));
      // a games folder per console it plays, named as EmuScape shows the console (My folders recognises these names)
      const sys = {};
      for (const s of e.systems) {
        const g = r.games ? path.join(r.games, String((names && names[s]) || s).replace(/[<>:"/\\|?*]+/g, ' ').trim()) : '';
        if (g) { try { fs.mkdirSync(g, { recursive: true }); } catch {} }
        sys[s] = { emulator: exe, romDirs: g ? [g] : [] };
      }
      log('Emulator installer:', e.id, 'ready at', exe);
      return { id: e.id, version: a.version, exe, systems: sys };
    } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} busy.delete(id); }
  });
  queue = job.catch(() => {}); // one at a time: several large downloads at once only slowed each other
  return job.catch(err => { log('Emulator installer:', e.id, 'failed:', err.message); throw err; });
}
const checked = new Map();
async function check(id, force) { const e = byId(id); if (!e) throw new Error('Unknown emulator.'); const c = checked.get(id); if (!force && c && Date.now() - c.at < 3600e3) return c.r;
  const a = await latest(e), r = { id, version: a.version, file: a.file }; checked.set(id, { at: Date.now(), r }); return r; }

module.exports = { init, setRoots, status, install, check, CATALOG, _pickAsset: pickAsset, _latest: latest, _findExe: findExe, _rootOf: rootOf };
