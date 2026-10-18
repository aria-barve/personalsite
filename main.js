/* ============================================================
   Aria Barve — shared notebook behaviour
   Every block checks for its elements, so any page can load this.
   ============================================================ */
(() => {
  /* ---------- notebook kernel ---------- */
  const cells = {};
  document.querySelectorAll('[data-cell]').forEach((el) => {
    cells[el.dataset.cell] = {
      el,
      labels: el.querySelectorAll('[data-label]'),
      out: el.querySelector('.cell-out'),
      btn: el.querySelector('.run'),
    };
  });
  const ids = Object.keys(cells);

  const state = { counts: {}, running: new Set(), next: 1 };
  ids.forEach((id) => { state.counts[id] = state.next++; }); // start fully executed

  const kernelEl = document.getElementById('kernel');
  const kernelState = document.getElementById('kernel-state');
  const runsEl = document.getElementById('runs');

  function renderCell(id) {
    const c = cells[id];
    const busy = state.running.has(id);
    const n = state.counts[id];
    const label = busy ? '[*]:' : n ? `[${n}]:` : '[ ]:';
    c.labels.forEach((l) => { l.textContent = label; });
    if (!c.out) return;
    const visible = !busy && !!n;
    if (visible && c.out.hidden) {
      c.out.hidden = false;
      c.out.classList.remove('show'); void c.out.offsetWidth; c.out.classList.add('show');
    } else if (!visible) {
      c.out.hidden = true;
    }
  }

  function renderKernel() {
    const busy = state.running.size > 0;
    if (kernelEl) kernelEl.classList.toggle('is-busy', busy);
    if (kernelState) kernelState.textContent = busy ? 'busy' : 'idle';
    if (runsEl) runsEl.textContent = Math.max(0, state.next - 1);
  }

  function renderAll() { ids.forEach(renderCell); renderKernel(); }

  function runCell(id, delay = 550) {
    if (state.running.has(id)) return;
    state.running.add(id);
    renderCell(id); renderKernel();
    setTimeout(() => {
      state.running.delete(id);
      state.counts[id] = state.next++;
      renderCell(id); renderKernel();
    }, delay);
  }

  ids.forEach((id) => { if (cells[id].btn) cells[id].btn.addEventListener('click', () => runCell(id)); });

  const runAll = document.getElementById('run-all');
  if (runAll) runAll.addEventListener('click', () => {
    ids.forEach((id, i) => runCell(id, 450 + i * 180));
  });

  const restart = document.getElementById('restart');
  if (restart) restart.addEventListener('click', () => {
    state.counts = {}; state.running.clear(); state.next = 1;
    renderAll();
  });

  /* ---------- clock ---------- */
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const tick = () => {
      clockEl.textContent = new Date()
        .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
        .toLowerCase();
    };
    tick(); setInterval(tick, 30000);
  }

  renderAll();
})();
