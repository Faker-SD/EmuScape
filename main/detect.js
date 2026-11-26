// Auto-detect emulators, ROM folders, Steam and media apps.
const path = require('path');
const { execFile } = require('child_process');
const { CONSOLES, APPS, SEARCH_ROOTS, ROM_ROOT_NAMES } = require('./systems');
const { expand, isFile, isDir, readDir, findFile, appRoot } = require('./paths');

// (1.82) Each folder searched is listed once, two folders deep, and every console and app looks its program names up in
// that list: the same answer as findFile (the first match, breadth first), without walking the Desktop, Downloads and
// Documents again for each of a dozen consoles while the setup window waits.
// (beta.12, Linux) what a folder entry really is: Flatpak puts its programs in exports/bin as links (org.libretro.RetroArch
// -> ../app/...), EmuDeck links folders too; a link was neither a file nor a folder here, so every Flatpak emulator was
// missed. Windows keeps its own answer (junctions aren't followed there)
const LINKS = process.platform !== 'win32';
function kind(full, ent) {
  if (ent.isFile()) return 'file'; if (ent.isDirectory()) return 'dir';
  if (LINKS && ent.isSymbolicLink()) { try { const s = require('fs').statSync(full); return s.isFile() ? 'file' : s.isDirectory() ? 'dir' : ''; } catch { return ''; } }
  return '';
}
function makeIndex(maxDepth = 2, maxEntries = Infinity) { // (own build: how deep, and how many entries at most, can be set)
  const cache = new Map();
  return dir => {
    const key = dir.toLowerCase(); let m = cache.get(key); if (m) return m;
    m = new Map(); let seq = 0, seen = 0; const queue = [[dir, 0]];
    while (queue.length && seen < maxEntries) {
      const [d, depth] = queue.shift();
      for (const ent of readDir(d)) { seen++;
        const full = path.join(d, ent.name), k0 = kind(full, ent);
        if (k0 === 'file') { const k = ent.name.toLowerCase(); if (!m.has(k)) m.set(k, { full, seq: seq++ }); }
        else if (k0 === 'dir' && depth < maxDepth && !ent.name.startsWith('.')) queue.push([full, depth + 1]);
      }
    }
    cache.set(key, m); return m;
  };
}
function findIn(index, dir, exeNames) {
  const m = index(dir); let best = null;
  for (const n of exeNames) {
    if (n.startsWith('re:')) { // (Linux) a pattern, for versioned AppImage names: "re:^duckstation.*\.appimage$"
      const re = new RegExp(n.slice(3), 'i');
      for (const [k, h] of m) if (re.test(k) && (!best || h.seq < best.seq)) best = h;
      continue; }
    const h = m.get(n.toLowerCase()); if (h && (!best || h.seq < best.seq)) best = h; }
  return best ? best.full : null;
}
// (Linux) SD cards and USB drives: /run/media/<user>/<card> (SteamOS, most desktops), /run/media/mmcblk0p1 (older SteamOS),
// /media/<user>/<card> (Ubuntu). Each card, and its Emulation and retrodeck folders, is searched like the home folder.
function mediaRoots() {
  if (process.platform !== 'linux') return [];
  const out = [], user = require('os').userInfo().username;
  for (const base of ['/run/media/' + user, '/run/media', '/media/' + user]) {
    for (const ent of readDir(base)) { if (!ent.isDirectory() || ent.name === user) continue; const d = path.join(base, ent.name); out.push(d, path.join(d, 'Emulation'), path.join(d, 'retrodeck')); }
  }
  return [...new Set(out)];
}
const searchRoots = () => [...SEARCH_ROOTS.map(expand), ...mediaRoots()];

function findExe(folders, exeNames, index = makeIndex()) {
  for (const f of folders) {
    const dir = expand(f);
    if (!isDir(dir)) continue;
    const hit = findIn(index, dir, exeNames);
    if (hit) return hit;
  }
  // Portable copies in common places (e.g. Desktop\Emulators\Dolphin-x64\Dolphin.exe)
  for (const root of searchRoots()) {
    if (!isDir(root)) continue;
    const hit = findIn(index, root, exeNames);
    if (hit) return hit;
  }
  return null;
}

// Look for "<root>\ROMS\<system>" style folders.
function findRomDirs(sys) {
  const found = new Set();
  const roots = [appRoot(), ...searchRoots()];
  for (const root of roots) {
    if (!isDir(root)) continue;
    const candidates = [root];
    for (const ent of readDir(root)) {
      if (kind(path.join(root, ent.name), ent) === 'dir' && ROM_ROOT_NAMES.includes(ent.name.toLowerCase())) candidates.push(path.join(root, ent.name));
    }
    for (const c of candidates) {
      for (const ent of readDir(c)) {
        if (kind(path.join(c, ent.name), ent) === 'dir' && sys.romFolderNames.includes(ent.name.toLowerCase())) found.add(path.join(c, ent.name)); // (a linked folder counts: EmuDeck's roms on an SD card)
      }
    }
  }
  return [...found];
}

function regQuery(key, value) {
  return new Promise(resolve => {
    if (process.platform !== 'win32') return resolve(null);
    execFile('reg', ['query', key, '/v', value], { windowsHide: true }, (err, out) => {
      if (err) return resolve(null);
      const m = String(out).match(new RegExp(value + '\\s+REG_\\w+\\s+(.+)', 'i'));
      resolve(m ? m[1].trim() : null);
    });
  });
}

async function findSteam() {
  // (Linux) Steam's own folder (the one with steamapps): native, the Steam Deck's, or the Flatpak's
  if (process.platform === 'linux') {
    for (const p of ['%HOME%/.steam/steam', '%HOME%/.local/share/Steam', '%HOME%/.var/app/com.valvesoftware.Steam/.local/share/Steam'].map(expand))
      if (isDir(path.join(p, 'steamapps'))) { try { return require('fs').realpathSync(p); } catch { return p; } }
    return null;
  }
  const reg = await regQuery('HKCU\\Software\\Valve\\Steam', 'SteamPath');
  const options = [reg && reg.replace(/\//g, '\\'), expand('%ProgramFiles(x86)%\\Steam'), expand('%ProgramFiles%\\Steam'), 'C:\\Steam', 'D:\\Steam'];
  for (const p of options) if (p && isFile(path.join(p, 'steam.exe'))) return p;
  return null;
}


// ---------- (own build) "My folders": one folder with all the emulators, one with all the games ----------
// The emulators folder is searched deeper than the usual places (Emulators\Dolphin\Dolphin-x64\Dolphin.exe: four levels).
// In the games folder, each console's games are the folder named after it: any of its usual folder names or its own
// name, with case, spaces and dashes ignored and a maker's name in front allowed ("Nintendo GameCube", "PS2",
// "playstation-2", "Sony PlayStation 2"). One level down too, for a folder per maker (Games\Nintendo\GameCube).
const NORM = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const MAKERS = ['nintendo', 'sony', 'sega', 'microsoft', 'snk', 'nec', 'atari', 'bandai', 'retro'];
// Other names people give each console's games folder, on top of the ones EmuScape already knows (systems.js)
const ALIASES = {
  gc: ['gamecube', 'ngc', 'gcn', 'gamecubegames'], wii: ['wii', 'rvl'], wiiu: ['wiiu', 'cemu'],
  sw: ['switch', 'nx', 'yuzu', 'ryujinx', 'eden', 'suyu', 'sudachi', 'citron'], sw2: ['switch2', 'ns2', 'nsw2'],
  psp: ['psp', 'playstationportable', 'ppsspp'], ps2: ['ps2', 'playstation2', 'pcsx2'], ps3: ['ps3', 'playstation3', 'rpcs3'],
  ps4: ['ps4', 'playstation4', 'shadps4'], ps5: ['ps5', 'playstation5'],
  psx: ['psx', 'ps1', 'psone', 'playstation', 'playstation1', 'playstationone', 'duckstation', 'epsxe'],
  x360: ['xbox360', 'x360', '360', 'xenia'], xbox: ['xbox', 'xboxclassic', 'xboxog', 'ogxbox', 'originalxbox', 'xemu'],
  n3ds: ['3ds', 'n3ds', 'citra', 'azahar', 'lime3ds'],
  nes: ['nes', 'famicom', 'fc', 'nintendoentertainmentsystem', 'nestopia', 'fceux', 'mesen'],
  snes: ['snes', 'sfc', 'supernintendo', 'superfamicom', 'supernes', 'supernintendoentertainmentsystem', 'snes9x', 'bsnes'],
  n64: ['n64', 'nintendo64', 'ultra64', 'project64'],
  gb: ['gb', 'gameboy', 'dmg', 'gameboyclassic', 'gameboyoriginal'], gbc: ['gbc', 'gameboycolor', 'gameboycolour', 'cgb'],
  gba: ['gba', 'gameboyadvance', 'agb', 'mgba', 'visualboyadvance', 'vba'],
  nds: ['nds', 'ds', 'nintendods', 'melonds', 'desmume'],
  megadrive: ['megadrive', 'genesis', 'md', 'smd', 'gen', 'segagenesis', 'genesismegadrive', 'megadrivegenesis'],
  mastersystem: ['mastersystem', 'sms', 'segamastersystem', 'markiii'], gamegear: ['gamegear', 'gg'],
  dreamcast: ['dreamcast', 'dc', 'flycast', 'redream'], saturn: ['saturn', 'ss', 'yabause', 'mednafensaturn'],
  pcengine: ['pcengine', 'pce', 'tg16', 'turbografx', 'turbografx16', 'pcenginecd', 'turbografxcd', 'tgcd', 'supergrafx', 'pcecd'],
  neogeo: ['neogeo', 'aes', 'mvs', 'neogeoaes', 'neogeomvs'],
  arcade: ['arcade', 'mame', 'fbneo', 'finalburnneo', 'finalburn', 'fba', 'cps1', 'cps2', 'cps3', 'arcadegames'],
  segacd: ['segacd', 'megacd'], sega32x: ['32x', 'sega32x', 'genesis32x', 'megadrive32x', 'mars32x'],
  atari2600: ['2600', 'atari2600', 'vcs', 'atarivcs'], atarilynx: ['lynx', 'atarilynx'],
  wonderswan: ['wonderswan', 'wonderswancolor', 'ws', 'wsc'], dos: ['dos', 'msdos', 'dosbox', 'pcdos'],
};
// words a games folder name often carries that say nothing about which console it is ("PS2 ISOs", "ROMs de SNES",
// "Super Nintendo (USA)", "GameCube Games"). Whatever is in brackets is dropped too.
const JUNK = new Set(['rom', 'roms', 'iso', 'isos', 'game', 'games', 'juego', 'juegos', 'de', 'del', 'los', 'las', 'the', 'my', 'mis', 'all', 'todos',
  'collection', 'coleccion', 'set', 'full', 'complete', 'pack', 'library', 'files', 'archivos', 'usa', 'us', 'eu', 'eur', 'europe', 'jp', 'jpn', 'japan',
  'ntsc', 'pal', 'world', 'en', 'es', 'and', 'y', 'emu', 'emulation']);
function folderKeys(name) {
  const raw = String(name || '').toLowerCase().replace(/\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g, ' ');
  const words = raw.split(/[^a-z0-9]+/).filter(Boolean), kept = words.filter(w => !JUNK.has(w));
  const out = new Set();
  for (const base of [words.join(''), kept.join('')]) { if (!base) continue; out.add(base); for (const m of MAKERS) if (base.startsWith(m) && base.length > m.length) out.add(base.slice(m.length)); }
  return [...out];
}
function systemKeys(s) { return new Set([...(s.romFolderNames || []), s.name, ...(ALIASES[s.id] || [])].map(NORM).filter(Boolean)); }
const KEYS = new Map(CONSOLES.map(s => [s.id, systemKeys(s)]));
// one slip allowed (a letter wrong, missing, extra or two swapped: "snex", "gamecub", "playstaton2"), only for names of four
// letters or more and only when a single console is that close: "switch3" is as close to Switch as to Switch 2, so it's neither
function near1(a, b) {
  if (a === b) return true; const la = a.length, lb = b.length; if (Math.abs(la - lb) > 1) return false;
  if (la === lb) { const d = []; for (let i = 0; i < la; i++) if (a[i] !== b[i]) d.push(i); return d.length === 1 || (d.length === 2 && d[1] === d[0] + 1 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]]); }
  const [s, l] = la < lb ? [a, b] : [b, a]; let i = 0; while (i < s.length && s[i] === l[i]) i++; return s.slice(i) === l.slice(i + 1);
}
const hasDigit = k => /\d/.test(k);
function consoleOfFolder(name) {
  const ks = folderKeys(name); if (!ks.length) return '';
  for (const s of CONSOLES) { const mine = KEYS.get(s.id); if (ks.some(k => mine.has(k))) return s.id; }
  const close = new Set();
  for (const s of CONSOLES) for (const k of ks) { if (k.length < 4) continue; for (const m of KEYS.get(s.id)) if (m.length >= 4 && near1(k, m) && hasDigit(k) === hasDigit(m) && (!hasDigit(k) || k.replace(/\D/g, '') === m.replace(/\D/g, ''))) close.add(s.id); }
  return close.size === 1 ? [...close][0] : '';
}
// every folder in `root` (and one level down in the ones that aren't a console's) that is a console's games folder
function romFoldersIn(root) {
  const out = new Map(); // console id -> [folders]
  const add = (id, full) => { if (!id) return; const L = out.get(id) || []; if (!L.includes(full)) L.push(full); out.set(id, L); };
  if (!isDir(root)) return out;
  add(consoleOfFolder(path.basename(root)), root); // the folder chosen is itself one console's
  for (const ent of readDir(root)) {
    const full = path.join(root, ent.name); if (kind(full, ent) !== 'dir' || ent.name.startsWith('.')) continue;
    const id = consoleOfFolder(ent.name);
    if (id) { add(id, full); continue; }
    for (const e2 of readDir(full)) { const f2 = path.join(full, e2.name); if (kind(f2, e2) === 'dir' && !e2.name.startsWith('.')) add(consoleOfFolder(e2.name), f2); }
  }
  return out;
}
// { systems: { id: { emulator, romDirs } }, apps: { id: { path } } } for the two folders (either may be empty)
function detectIn({ emuDir, romDir } = {}) {
  emuDir = emuDir ? expand(String(emuDir)) : ''; romDir = romDir ? expand(String(romDir)) : '';
  const idx = emuDir && isDir(emuDir) ? makeIndex(4, 400000) : null, roms = romDir ? romFoldersIn(romDir) : new Map();
  const systems = {}, apps = {};
  for (const s of CONSOLES) systems[s.id] = { emulator: idx ? findIn(idx, emuDir, s.exeNames) : null, romDirs: roms.get(s.id) || [] };
  if (idx) for (const a of APPS) apps[a.id] = { path: findIn(idx, emuDir, a.exeNames) };
  return { systems, apps, emuDir, romDir };
}

// mine: the player's own two folders (cfg.myFolders), looked in first; what's found there wins over the usual places
async function detectAll(mine) {
  const systems = {}, index = makeIndex();
  for (const s of CONSOLES) {
    systems[s.id] = { emulator: findExe(s.emulatorFolders, s.exeNames, index), romDirs: findRomDirs(s) };
  }
  const apps = {};
  for (const a of APPS) apps[a.id] = { path: findExe(a.folders, a.exeNames, index) };
  if (mine && (mine.emulators || mine.games)) { // (own build)
    const d = detectIn({ emuDir: mine.emulators, romDir: mine.games });
    for (const [id, x] of Object.entries(d.systems)) { const s = systems[id]; if (!s) continue; if (x.emulator) s.emulator = x.emulator; s.romDirs = [...new Set([...x.romDirs, ...s.romDirs])]; }
    for (const [id, x] of Object.entries(d.apps)) if (x.path && apps[id]) apps[id].path = x.path;
  }
  return { systems, apps, steam: { path: await findSteam() }, appRoot: appRoot() };
}

// one console's emulator and games folders (a console added in an update, found once as setup would have)
function detectSystem(id) { const s = CONSOLES.find(c => c.id === id); return s ? { emulator: findExe(s.emulatorFolders, s.exeNames), romDirs: findRomDirs(s) } : null; }

module.exports = { detectAll, detectSystem, findSteam, detectIn, consoleOfFolder };
