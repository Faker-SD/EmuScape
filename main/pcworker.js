// (own build) the PC shelf's other stores (Epic, GOG, Ubisoft, EA, Xbox), Quiver and the games added by hand, read on a
// worker thread: these readers touch every drive letter (Xbox's .GamingRoot) and many files one by one, and a drive that
// is slow to answer (asleep, a network share, a card reader) held the whole app up for seconds on every library refresh
const { isMainThread, parentPort, workerData, Worker } = require('worker_threads');
const path = require('path');

if (!isMainThread && workerData && workerData.pcLists) {
  const pcgames = require('./pcgames');
  const logs = [], log = (...a) => logs.push(a.map(String).join(' '));
  pcgames.init(workerData.dataDir, log);
  (async () => {
    const pc = workerData.pc || {}, epic = [], mine = [];
    if (pc.epic !== false) try { epic.push(...pcgames.epicGames()); } catch (e) { log('Epic library', e.message); }
    try { epic.push(...await pcgames.storeGames(pc)); } catch (e) { log('PC stores', e.message); }
    if (pc.quiver !== false) try { mine.push(...pcgames.quiverGames(pc.quiverPath)); } catch (e) { log('Quiver library', e.message); }
    try { mine.push(...pcgames.customGames(pc.custom, pc.customDefault)); } catch (e) { log('Custom games', e.message); }
    parentPort.postMessage({ epic, mine, logs });
  })().catch(e => parentPort.postMessage({ error: e.message, logs }));
}

const WORKER_FILE = __filename.replace(/app\.asar([\\/])/, 'app.asar.unpacked$1');
let last = null;
// the lists, or (worker failed or took too long) the last ones read; null when there are none yet: the caller reads them itself
function pcLists(dataDir, pc, log, ms = 25000) {
  return new Promise(resolve => {
    let w, done = false; const end = r => { if (done) return; done = true; clearTimeout(t); try { w && w.terminate(); } catch {} resolve(r); };
    const t = setTimeout(() => { log('PC stores: still reading after ' + ms / 1000 + ' s (a drive not answering?), kept the last list'); end(last); }, ms);
    try { w = new Worker(WORKER_FILE, { workerData: { pcLists: true, dataDir, pc } }); } catch (e) { log('PC stores worker', e.message); return end(null); }
    w.on('message', m => { for (const l of m.logs || []) log(l); if (m.error) { log('PC stores', m.error); return end(last); } last = { epic: m.epic, mine: m.mine }; end(last); });
    w.on('error', e => { log('PC stores worker', e.message); end(last); });
    w.on('exit', () => end(last));
  });
}
module.exports = { pcLists };
