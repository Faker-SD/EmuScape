// The release text for a version, from renderer/whatsnew.js (What's new in the app): node scripts/release-notes.js 2.0.24
const fs = require('fs'), path = require('path'), vm = require('vm');
const v = process.argv[2], box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'renderer', 'whatsnew.js'), 'utf8'), box);
const e = (box.window.BS_WHATSNEW || []).find(x => x.version === v);
const lines = e ? [`**${e.title}**`, '', ...(e.highlights || []).map(h => '- ' + h)] : [];
for (const s of (e && e.sections) || []) { lines.push('', `**${s.h}**`); for (const [a, b] of s.items || []) lines.push(`- ${a}${b ? ': ' + b : ''}`); }
lines.push('', 'Install: download **EmuScape-Setup-' + v + '.exe** and run it. Already have EmuScape? It updates itself.');
process.stdout.write(lines.join('\n') + '\n');
