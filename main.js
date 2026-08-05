/* ============================================================
   Aria Barve — shared behaviour
   ============================================================ */
(() => {

  /* ── CUSTOM CURSOR ──────────────────────────────────────── */
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');

  if (dot && ring && window.matchMedia('(hover: hover)').matches) {
    let mx = -300, my = -300, rx = -300, ry = -300;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', () => document.body.classList.add('cc'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cc'));

    const hoverables = 'a, button, summary, .work-card, .pill, .edu-card';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });

    (function loop() {
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();
  }


  /* ── MENU ───────────────────────────────────────────────── */
  const burger = document.querySelector('.burger');
  const menu   = document.querySelector('.menu');

  if (burger && menu) {
    burger.addEventListener('click', e => {
      e.stopPropagation();
      document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', document.body.classList.contains('menu-open'));
    });
    menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('click', e => {
      if (document.body.classList.contains('menu-open') && !e.target.closest('.menu')) close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    function close() {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  }


  /* ── MAGNETIC BUTTONS ───────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.mag').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * .22;
        const dy = (e.clientY - r.top  - r.height / 2) * .22;
        btn.style.transition = 'transform .08s ease';
        btn.style.transform  = `translate(${dx}px,${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
        btn.style.transform  = 'translate(0,0)';
      });
    });
  }


  /* ── COUNTERS ───────────────────────────────────────────── */
  const counters = document.querySelectorAll('.count');
  if (counters.length) {
    let counted = false;
    const run = () => {
      if (counted) return;
      counted = true;
      counters.forEach(el => {
        const end    = parseInt(el.dataset.end, 10);
        const suffix = el.dataset.suffix || '';
        const t0     = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / 1500, 1);
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * end) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    };
    const cObs = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) run();
    }, { threshold: .3 });
    counters.forEach(el => cObs.observe(el));
  }


  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rObs.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));


  /* ── ACCORDION: one open at a time ──────────────────────── */
  const details = [...document.querySelectorAll('details.exp')];
  details.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) details.forEach(o => { if (o !== d) o.open = false; });
    });
  });


  /* ── THEME TOGGLE ───────────────────────────────────────────
     The <head> script already stamped data-theme before paint;
     this just flips it and remembers the choice.                */
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }


  /* ── PORTRAIT ───────────────────────────────────────────────
     Drop a photo at ./portrait.jpg and it takes over automatically.
     Until then the monogram fallback stays put.                    */
  const shot = document.getElementById('portrait-img');
  if (shot) {
    const show = () => {
      shot.hidden = false;
      const fb = document.querySelector('.portrait-fallback');
      if (fb) fb.hidden = true;
    };
    if (shot.complete && shot.naturalWidth > 0) show();
    else shot.addEventListener('load', show);
    shot.addEventListener('error', () => shot.remove());
  }

})();
