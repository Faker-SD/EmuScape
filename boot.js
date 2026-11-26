// EmuScape — start-up. The installed EmuScape can update with only its own code (no new program to install, so nothing
// for an antivirus to flag): Update now puts the newer code in <EmuScape folder>\code\<version>\ and code\current.json
// names it. This file runs that code when it is newer than the code built in and made for this same engine; otherwise,
// or when it failed to start twice in a row, the built-in code.
const { app } = require('electron');
const fs = require('fs'), path = require('path');
const newer = (a, b) => { const p = v => String(v).split(/[.-]/).map(n => parseInt(n, 10) || 0); const x = p(a), y = p(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
let ran = false;
try {
  if (app.isPackaged && process.platform === 'win32' && !process.env.PORTABLE_EXECUTABLE_DIR) {
    const root = path.join(path.dirname(process.execPath), 'code'), cur = path.join(root, 'current.json');
    if (fs.existsSync(cur)) {
      const j = JSON.parse(fs.readFileSync(cur, 'utf8')), dir = path.join(root, path.basename(String(j.dir || '')));
      const own = require('./package.json').version;
      if (j.version && newer(j.version, own) && j.electron === process.versions.electron && (j.fails || 0) < 2 && fs.existsSync(path.join(dir, 'main.js'))) {
        j.fails = (j.fails || 0) + 1; try { fs.writeFileSync(cur, JSON.stringify(j, null, 1)); } catch {} // main.js sets it back to 0 once its window shows
        const v = String(j.version); app.getVersion = () => v;
        global.__emuscapeCode = { dir, version: v, file: cur };
        ran = true; require(path.join(dir, 'main.js'));
      }
    }
  }
} catch (e) { if (!ran) { try { console.error('EmuScape boot: code update skipped:', e && e.message); } catch {} } else throw e; }
if (!ran) require('./main.js');
