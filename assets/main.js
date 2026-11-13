/* David Perraud Auto — maquette immersive (GSAP + ScrollTrigger + Lenis) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasG = typeof gsap !== 'undefined';

  /* menu mobile */
  const burger = $('.burger');
  burger?.addEventListener('click', () => {
    const o = document.body.classList.toggle('mopen');
    burger.setAttribute('aria-expanded', o);
    window.__lenis && (o ? window.__lenis.stop() : window.__lenis.start());
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('mopen'); window.__lenis && window.__lenis.start(); }));

  /* découpe : mots (titres) et lettres (mot géant) */
  const splitWords = (el, cls) => {
    let i = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { f.append(' '); return; }
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.textContent = t; s.style.setProperty('--i', i++);
          w.append(s); f.append(w);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(el);
  };
  $$('.sp').forEach(el => splitWords(el));
  const word = $('.word');
  if (word) {
    word.setAttribute('aria-label', word.textContent);
    const t = word.textContent; word.textContent = '';
    [...t].forEach((ch, i) => {
      const m = document.createElement('span'); m.className = 'm'; m.setAttribute('aria-hidden', 'true');
      const c = document.createElement('span'); c.className = 'c' + (i === 0 ? ' b' : ''); c.textContent = ch === ' ' ? ' ' : ch;
      m.append(c); word.append(m);
    });
    // ajuste la taille du mot pour qu'il remplisse la largeur
    const fit = () => {
      word.style.setProperty('--ws', '20vw');
      const w = [...word.children].reduce((a, e) => a + e.getBoundingClientRect().width, 0);
      const k = (innerWidth * .96) / w;
      word.style.setProperty('--ws', (20 * k).toFixed(2) + 'vw');
      const hero = $('.hero');
      if (hero) hero.style.setProperty('--wh', (20 * k).toFixed(2) + 'vw');
    };
    document.fonts.ready.then(fit); addEventListener('resize', fit); fit();
  }

  /* apparition simple (pages sans GSAP ou éléments secondaires) */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.rv,.sp').forEach(el => io.observe(el));
  setTimeout(() => $$('.ph .sp,.ph .rv').forEach(el => el.classList.add('in')), 150);

  /* barre de progression */
  const bar = $('#bar');
  const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
  addEventListener('scroll', prog, { passive: true });

  if (hasG && !calm) {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ lerp: .09 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -20 }); }
      }));
    }

    /* ---- hero : entrée ---- */
    const hero = $('.hero');
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.word .c', { yPercent: 115, duration: 1.5, stagger: .07 }, .1)
        .from(innerWidth > 900 ? '.top > *' : '.top > *:not(.nav)', { y: -30, opacity: 0, duration: 1, stagger: .1, clearProps: 'all' }, .2)
        .from('.hero .cap,.hero .go,.hero .para,.hero .chips .tag', { y: 24, opacity: 0, duration: 1.1, stagger: .06 }, .7)
        .from('.hero .tile', { scale: 0, rotation: () => gsap.utils.random(-22, 22), opacity: 0, duration: 1.3, stagger: .1, ease: 'back.out(1.5)' }, .5);
      $$('.hero .tile').forEach((t, i) => {
        gsap.to($('.fl', t), { y: gsap.utils.random(8, 18) * (i % 2 ? 1 : -1), duration: gsap.utils.random(3, 5), repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
      if (matchMedia('(hover:hover)').matches) {
        const qs = $$('.hero .tile').map((t, i) => {
          const el = $('.in', t), d = (i % 3 + 1) * 10;
          return { x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }), d };
        });
        addEventListener('pointermove', e => {
          const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
          qs.forEach(q => { q.x(nx * q.d * 2); q.y(ny * q.d * 2); });
        });
      }
      gsap.to('.hero .word', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero .tile', { yPercent: (i) => -30 - i * 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* ---- révélation de lettres/mots génériques ---- */
    gsap.utils.toArray('.sec h2.sp').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('in') }));

    const mm = gsap.matchMedia();

    mm.add('(min-width: 801px)', () => {
      /* ---- histoire : texte net/flou + cascade de photos ---- */
      const st = $('.story');
      if (st) {
        const words = $$('.story h2 .w');
        const tiles = $$('.stack .tile');
        const tl = gsap.timeline({ scrollTrigger: { trigger: st, start: 'top top', end: '+=260%', pin: true, scrub: .8 } });
        tl.to(words, { opacity: 1, filter: 'blur(0px)', stagger: .35, duration: .6, ease: 'none' }, 0);
        tiles.forEach((t, i) => {
          tl.fromTo(t, { x: '55vw', y: '70vh', rotationZ: 30, rotationY: -35, rotationX: 20, scale: .7, opacity: 0 },
            { x: () => -i * innerWidth * .052, y: () => -i * innerHeight * .012, rotationZ: -12 + i * 2.6, rotationY: -8, rotationX: 4, scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }, .6 + i * .32);
        });
        tl.to({}, { duration: .6 });
      }
      /* ---- mur 3D ---- */
      const wl = $('.wall');
      if (wl) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: wl, start: 'top top', end: '+=180%', pin: true, scrub: .8 } });
        tl.fromTo('.wall .grid', { scale: 2.6, rotationX: 58, rotationZ: -26, yPercent: 14 }, { scale: 1.05, rotationX: 28, rotationZ: -12, yPercent: -4, ease: 'none', duration: 1 }, 0)
          .fromTo('.wall .mid > *', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: .15, duration: .4 }, .45);
      }
      /* ---- piste : défilement horizontal ---- */
      const hz = $('.hz');
      if (hz) {
        const tr = $('.track', hz);
        gsap.to(tr, { x: () => -(tr.scrollWidth - innerWidth + 60), ease: 'none', scrollTrigger: { trigger: hz, start: 'top top', end: () => '+=' + (tr.scrollWidth - innerWidth), pin: true, scrub: .8, invalidateOnRefresh: true } });
      }
    });

    mm.add('(max-width: 800px)', () => {
      $$('.story h2 .w').forEach(w => gsap.to(w, { opacity: 1, filter: 'blur(0px)', scrollTrigger: { trigger: w, start: 'top 90%', end: 'top 60%', scrub: true } }));
      gsap.fromTo('.wall .grid', { scale: 1.6, rotationZ: -14 }, { scale: 1, rotationZ: -6, ease: 'none', scrollTrigger: { trigger: '.wall', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---- parallaxe d'images ---- */
    $$('[data-par]').forEach(el => gsap.fromTo(el, { yPercent: -+el.dataset.par }, { yPercent: +el.dataset.par, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    /* ---- parcours ---- */
    gsap.from('.stp', { y: 60, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.steps', start: 'top 80%' } });

    /* ---- liste des permis : aperçu photo qui suit la souris ---- */
    const pl = $('.plist'), pv = $('.prev');
    if (pl && pv && matchMedia('(hover:hover) and (min-width:801px)').matches) {
      const xs = gsap.quickTo(pv, 'x', { duration: .7, ease: 'power3' }), ys = gsap.quickTo(pv, 'y', { duration: .7, ease: 'power3' });
      const rot = gsap.quickTo(pv, 'rotation', { duration: .6, ease: 'power3' });
      let lx = 0;
      addEventListener('pointermove', e => {
        xs(e.clientX + 30); ys(e.clientY - pv.offsetHeight / 2);
        rot(gsap.utils.clamp(-10, 10, (e.clientX - lx) * .25)); lx = e.clientX;
      });
      const tiles = $$('.tile', pv);
      $$('a', pl).forEach((a, i) => {
        a.addEventListener('pointerenter', () => {
          pl.classList.add('hv'); tiles.forEach((t, j) => t.classList.toggle('on', i === j));
          gsap.to(pv, { opacity: 1, scale: 1, duration: .6, ease: 'expo.out' });
        });
      });
      pl.addEventListener('pointerleave', () => { pl.classList.remove('hv'); gsap.to(pv, { opacity: 0, scale: .7, duration: .5, ease: 'power3.in' }); });
    }

    /* ---- pied de page : mot géant qui monte ---- */
    gsap.from('.fw', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top 85%', end: 'bottom bottom', scrub: true } });
  } else {
    $$('.story h2 .w').forEach(w => { w.style.opacity = 1; w.style.filter = 'none'; });
  }

  /* compteurs */
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, t0 = performance.now(), dur = calm ? 1 : 1800;
    const tick = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = (to % 1 ? (to * (1 - Math.pow(1 - k, 4))).toFixed(1).replace('.', ',') : Math.round(to * (1 - Math.pow(1 - k, 4)))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-to]').forEach(el => co.observe(el));

  /* onglets de tarifs */
  $$('.tabs').forEach(t => {
    const bs = $$('button', t), ps = $$('.tp', t.parentElement);
    bs.forEach((b, i) => b.addEventListener('click', () => {
      bs.forEach(x => x.setAttribute('aria-selected', x === b));
      ps.forEach((p, j) => p.classList.toggle('on', i === j));
    }));
  });

  /* horaires et « ouvert maintenant » */
  const H = { perraud: { 1: [[8, 12], [13.75, 18.5]], 2: [[8, 12], [13.75, 18.5]], 3: [[8, 12], [13.75, 18.5]], 4: [[8, 12], [13.75, 18.5]], 5: [[8, 12], [13.75, 18.5]] } };

  const fmt = n => { const h = Math.floor(n), m = Math.round((n - h) * 60); return h + 'h' + (m ? String(m).padStart(2, '0') : ''); };
  const D = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const now = new Date(), d = now.getDay(), hh = now.getHours() + now.getMinutes() / 60;
  $$('[data-ag]').forEach(el => {
    const sc = H[el.dataset.ag]; if (!sc) return;
    const open = (sc[d] || []).some(([a, b]) => hh >= a && hh < b), o = $('.open', el);
    if (o) { o.classList.toggle('on', open); o.lastChild.textContent = open ? 'Ouvert maintenant' : 'Fermé actuellement'; }
    const ul = $('.hours', el);
    if (ul) ul.innerHTML = [1, 2, 3, 4, 5, 6].map(j => `<li class="${j === d ? 'today' : ''}"><span>${D[j]}</span><span>${(sc[j] || []).map(([a, b]) => fmt(a) + '–' + fmt(b)).join(' · ') || 'Fermé'}</span></li>`).join('');
    el.addEventListener('click', () => el.classList.toggle('act'));
  });

  /* simulateur de budget */
  const sim = $('#sim');
  if (sim) {
    let kind = 'm';
    const base = { m: 1221, a: 878, c: 1539 }, code = 250;
    const out = $('#simOut'), det = $('#simDet'), rg = $('#simRg'), rl = $('#simRl');
    const upd = () => {
      const aide = +rg.value, reste = Math.max(0, base[kind] + code - aide);
      rl.textContent = aide.toLocaleString('fr-FR') + ' €';
      out.textContent = reste.toLocaleString('fr-FR') + ' €';
      det.textContent = `ou 4 × ${Math.ceil(reste / 4).toLocaleString('fr-FR')} € sans frais`;
    };
    $$('.seg button', sim).forEach(b => b.addEventListener('click', () => {
      $$('.seg button', sim).forEach(x => x.setAttribute('aria-pressed', x === b)); kind = b.dataset.k; upd();
    }));
    rg.addEventListener('input', upd); upd();
  }

  /* filtres (avis, actualités) */
  $$('.flt').forEach(f => {
    const items = $$(f.dataset.t);
    $$('button', f).forEach(b => b.addEventListener('click', () => {
      $$('button', f).forEach(x => x.classList.toggle('on', x === b));
      items.forEach(i => i.classList.toggle('hide', b.dataset.f !== '*' && i.dataset.c !== b.dataset.f));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });

  /* paiement : montant libre (maquette, aucun paiement réel) */
  const pay = $('#pay');
  if (pay) {
    const inp = $('#amt'), out = $('#payOut'), qs = $$('.quick button', pay);
    const get = () => Math.max(0, parseFloat(String(inp.value).replace(',', '.')) || 0);
    const upd = () => { out.textContent = get().toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' €'; qs.forEach(b => b.classList.toggle('on', +b.dataset.v === get())); };
    $$('.amt [data-s]', pay).forEach(b => b.addEventListener('click', () => { inp.value = Math.max(0, get() + +b.dataset.s); upd(); }));
    qs.forEach(b => b.addEventListener('click', () => { inp.value = b.dataset.v; upd(); }));
    inp.addEventListener('input', upd);
    $('#payGo', pay).addEventListener('click', e => { e.preventDefault(); $('.ok', pay).style.display = 'block'; });
    upd();
  }

  /* formulaire (maquette : aucun envoi) */
  $$('form.f').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const ok = $('.ok', f); if (ok) ok.style.display = 'block'; f.reset();
  }));
})();


/* signature : un compte-tours dans l'en-tête. L'aiguille monte avec le défilement ; en bas de page, zone rouge : « service rapide ». */
(() => {
  const nd = document.querySelector('.rpm .nd'), rpm = document.querySelector('.rpm');
  if (!nd) return;
  let cur = 0, tgt = 0, last = 0;
  const read = () => { const h = document.documentElement.scrollHeight - innerHeight; tgt = h > 0 ? Math.min(1, scrollY / h) : 0; };
  addEventListener('scroll', read, { passive: true }); read();
  const loop = t => {
    // petit coup d'accélérateur : l'aiguille dépasse un peu puis revient
    const v = (tgt - cur) * .12; cur += v;
    const kick = Math.max(-.04, Math.min(.04, v * 4));
    const a = -130 + (cur + kick) * 260;
    nd.setAttribute('transform', `rotate(${a.toFixed(2)} 30 30)`);
    rpm.classList.toggle('red', cur > .84);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

/* rendez-vous (maquette) : créneaux */
(() => {
  const f = document.getElementById('resa'); if (!f) return;
  f.querySelectorAll('.cov button').forEach(b => b.addEventListener('click', () => { f.querySelectorAll('.cov button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }));
  const d = new Date().toISOString().slice(0, 10); f.querySelectorAll('input[type=date]').forEach(i => i.min = d);
})();


/* curseur : une bougie d'allumage qui lâche de petites étincelles bleues et jaunes (signature garage). */
(() => {
  const art = `<g transform="rotate(-35 15 15)"><rect x="12.2" y="1.5" width="5.6" height="4" rx="1" fill="#d9dde2" stroke="#111417" stroke-width="1.1"/><path d="M11.4 5.5h7.2l-.6 9h-6z" fill="#f4f1ea" stroke="#111417" stroke-width="1.1"/><path d="M11 14.5h8v4.2h-8z" fill="#b8bec6" stroke="#111417" stroke-width="1.1"/><path d="M11 16.6h8" stroke="#111417" stroke-width=".8"/><path d="M13.4 18.7h3.2v4.3h-3.2z" fill="#9aa1a9" stroke="#111417" stroke-width="1"/><path d="M15 23v3.2h2.4" fill="none" stroke="#111417" stroke-width="1.2" stroke-linecap="round"/></g>`;
  const COLS = ['#ffd84a','#8fd3ff','#ffffff','#39a6ea'];
  const makeFx = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return { step() {}, draw() {} };
    const cv = document.createElement('canvas');
    cv.className = 'fx'; cv.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(cv, document.body.firstChild);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, px = null, py = null, acc = 0, dirty = false;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    const gr = [], rnd = (a, b) => a + Math.random() * (b - a), G = 0;
    const step = (x, y, now) => {
      if (px === null) { px = x; py = y; return; }
      const sp = Math.hypot(x - px, y - py); px = x; py = y;
      if (sp < 1.2 || sp > 90) return;
      acc += sp;
      while (acc > 11) {
        acc -= 11;
        gr.push({ x: x + 12 + rnd(-2, 2), y: y + 20 + rnd(-2, 2), vx: G ? rnd(-.5, .5) : rnd(-1.6, 1.6), vy: G ? rnd(0, .6) : rnd(-1.4, 1.2), r: rnd(.7, G ? 2.2 : 1.7), c: COLS[(Math.random() * COLS.length) | 0], t: now, life: rnd(420, 820) });
      }
      if (gr.length > 220) gr.splice(0, gr.length - 220);
    };
    const draw = now => {
      while (gr.length && now - gr[0].t > gr[0].life) gr.shift();
      if (!gr.length) { if (dirty) { ctx.clearRect(0, 0, W, H); dirty = false; } return; }
      dirty = true; ctx.clearRect(0, 0, W, H);
      for (const g of gr) {
        const a = now - g.t, k = a / g.life, e = Math.min(1, k * 3);
        ctx.globalAlpha = (1 - k) * (1 - k);
        ctx.fillStyle = g.c;
        const gx = g.x + g.vx * 22 * e, gy = g.y + (G ? g.vy * 10 * e + G * a * a / 4000 : g.vy * 22 * e);
        ctx.beginPath();
        if (G) { ctx.ellipse(gx, gy, g.r * .8, g.r * 1.3, 0, 0, 6.2832); } else ctx.arc(gx, gy, g.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    return { step, draw };
  };
  const start = () => {
    const fx = makeFx();
    const el = document.createElement('div');
    el.className = 'trw'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 30 30">${art}</svg>`;
    document.body.append(el);
    document.documentElement.classList.add('vc');
    let tx = -99, ty = -99, x = tx, y = ty, shown = false;
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { x = tx; y = ty; shown = true; el.classList.add('on'); }
      el.classList.toggle('hot', !!(e.target.closest && e.target.closest('a,button,summary,input,select,textarea,label')));
    }, { passive: true });
    document.addEventListener('pointerleave', () => { el.classList.remove('on'); shown = false; });
    const loop = () => {
      x += (tx - x) * .35; y += (ty - y) * .35;
      el.style.transform = `translate(${(x - 4).toFixed(1)}px,${(y - 3).toFixed(1)}px)`;
      const now = performance.now();
      if (shown) fx.step(x, y, now);
      fx.draw(now);
      requestAnimationFrame(loop);
    };
    loop();
  };
  addEventListener('pointermove', function f(e) {
    if (e.pointerType !== 'mouse') return;
    removeEventListener('pointermove', f);
    start();
    dispatchEvent(new PointerEvent('pointermove', { clientX: e.clientX, clientY: e.clientY, pointerType: 'mouse' }));
  }, { passive: true });
})();
