/* (own build) A small menu at the pointer, for right-clicks: the shelf's console tabs and the setup wizard's console cards.
   BsMenu.open(x, y, items): items are { label, fn, danger, off } or "-" for a line. Closes on a choice, a click outside,
   Esc, scrolling or the window losing focus. BsMenu.isOpen() tells the key handlers it has the keys. Arrow keys move
   through it and Enter picks, so it works from the keyboard too. */
(function () {
  let cur = null;
  function close() {
    const c = cur; if (!c) return; cur = null;
    try { c.el.remove(); } catch {}
    removeEventListener('pointerdown', c.away, true); removeEventListener('keydown', c.key, true); removeEventListener('blur', c.blur); removeEventListener('wheel', c.blur, true);
  }
  function open(x, y, items) {
    close();
    const el = document.createElement('div'); el.className = 'bs-ctx'; el.setAttribute('role', 'menu');
    const btns = [];
    for (const it of items || []) {
      if (it === '-') { const hr = document.createElement('div'); hr.className = 'bs-ctx-line'; el.append(hr); continue; }
      if (!it) continue;
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.textContent = it.label;
      if (it.danger) b.classList.add('danger'); if (it.off) { b.disabled = true; }
      b.addEventListener('click', e => { e.stopPropagation(); close(); try { it.fn && it.fn(); } catch (err) { console.warn(err); } });
      el.append(b); btns.push(b);
    }
    if (!btns.length) return;
    document.body.append(el);
    const r = el.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    el.style.left = Math.max(8, Math.min(x, W - r.width - 8)) + 'px'; el.style.top = Math.max(8, Math.min(y, H - r.height - 8)) + 'px';
    const live = () => btns.filter(b => !b.disabled);
    const c = cur = {
      el,
      away: e => { if (!el.contains(e.target)) close(); },
      blur: () => close(),
      key: e => {
        const L = live(), i = L.indexOf(document.activeElement);
        if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); e.stopPropagation(); close(); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); const n = L.length; if (n) L[(i + (e.key === 'ArrowDown' ? 1 : -1) + n) % n].focus(); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); if (i >= 0) L[i].click(); else if (L[0]) L[0].click(); }
        else if (e.key !== 'Tab') { e.stopPropagation(); }
      },
    };
    setTimeout(() => { if (cur === c) { addEventListener('pointerdown', c.away, true); addEventListener('blur', c.blur); addEventListener('wheel', c.blur, true); } }, 0);
    addEventListener('keydown', c.key, true);
  }
  window.BsMenu = { open, close, isOpen: () => !!cur };
})();
