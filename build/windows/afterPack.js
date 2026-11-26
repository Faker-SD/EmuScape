// EmuScape.exe gets EmuScape's icon and name (Windows shows them in Explorer, the taskbar and "Apps"). Done here with
// resedit (plain JavaScript) instead of rcedit, which would need Windows or wine to run while building.
const fs = require('fs'), path = require('path');
exports.default = async ctx => {
  if (ctx.electronPlatformName !== 'win32') return;
  const ResEdit = await import('resedit').then(m => m.default || m);
  const exePath = path.join(ctx.appOutDir, 'EmuScape.exe');
  const exe = ResEdit.NtExecutable.from(fs.readFileSync(exePath), { ignoreCert: true });
  const res = ResEdit.NtExecutableResource.from(exe);
  const ico = ResEdit.Data.IconFile.from(fs.readFileSync(path.join(__dirname, 'icon.ico')));
  const groups = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
  const gid = groups.length ? groups[0].id : 1, lang = groups.length ? groups[0].lang : 1033;
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries, gid, lang, ico.icons.map(i => i.data));
  const v = String(ctx.packager.appInfo.version || '1.0.0').split(/[.\-]/).map(n => parseInt(n, 10) || 0).concat([0, 0, 0, 0]).slice(0, 4);
  const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0] || ResEdit.Resource.VersionInfo.createEmpty();
  const L = { lang: 1033, codepage: 1200 };
  vi.setStringValues(L, { ProductName: 'EmuScape', FileDescription: 'EmuScape', CompanyName: 'EmuScape', InternalName: 'EmuScape', OriginalFilename: 'EmuScape.exe', LegalCopyright: 'EmuScape (based on Boxshelf, GPL-3.0)', ProductVersion: ctx.packager.appInfo.version, FileVersion: ctx.packager.appInfo.version });
  vi.setFileVersion(...v, 1033); vi.setProductVersion(...v, 1033);
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  fs.writeFileSync(exePath, Buffer.from(exe.generate()));
  console.log('  • EmuScape.exe: icon and name set (resedit), icon group', gid);
};
