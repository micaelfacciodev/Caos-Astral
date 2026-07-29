/**
 * flash-decor.js — Caos Astral
 * Portado do site pessoal de tatuagem do fundador (mesma técnica de
 * "fractal de flash": múltiplas passagens decrescentes preenchem cada
 * buraco deixado pela passagem anterior), com três ajustes:
 *   1. Símbolos astrológicos autorais no lugar de flash de tatuagem.
 *   2. Tingimento na paleta do site (bone/oxblood) em vez de invert(1) puro.
 *   3. Fonte de dado é o Supabase (tabela `simbolos_astrologicos`), não
 *      um manifest.json commitado no GitHub — mais simples de manter,
 *      sem precisar de Worker/proxy nenhum.
 *
 * Pra adicionar novos desenhos: usar o admin-simbolos.html.
 * Enquanto a tabela estiver vazia (ou não existir ainda), este script
 * não faz nada — sem quebrar nada, sem símbolo nenhum aparecendo.
 */
(function () {
  'use strict';

  // ENGINE: confirmar que estes valores batem com o projeto Supabase real do Caos Astral
  const SUPABASE_URL = 'https://pvgeramqsatltnvkkpvf.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_f5iH4AnwTt1jnwGMWg0qGw_-rd06eGm';
  const CACHE_KEY = 'caos_astral_simbolos_v2';

  // ── Pool ────────────────────────────────────────────────────
  async function getPool() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    try {
      // ENGINE: espera tabela `simbolos_astrologicos` (colunas: image_url text, decor boolean)
      // com RLS de leitura pública (select livre) — ver spec no CLAUDE.md.
      const url = `${SUPABASE_URL}/rest/v1/simbolos_astrologicos?select=image_url&decor=eq.true`;
      const r = await fetch(url, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: 'no-store'
      });
      if (!r.ok) throw new Error('tabela ainda não existe ou está vazia');
      const rows = await r.json();
      const pool = (Array.isArray(rows) ? rows : [])
        .map(row => row.image_url)
        .filter(Boolean);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(pool));
      return pool;
    } catch {
      // Sem tabela/dado ainda — decoração fica desligada, sem quebrar nada.
      return [];
    }
  }

  // ── Utilitários ─────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // ── Passagens fractais ───────────────────────────────────────
  // Cada passagem: [raio de colisão px, largura CSS, faixa de opacidade, quantidade base]
  // Mais discreto que o original — decoração de fundo, não o assunto da tela.
  const OVERLAP = 1.4;

  const PASSES = [
    [ 140, 'clamp(150px,20vw,280px)', [0.05, 0.08], 3  ],
    [  85, 'clamp(90px,12vw,165px)',  [0.05, 0.07], 5  ],
    [  50, 'clamp(50px,7vw,95px)',    [0.04, 0.06], 9  ],
    [  27, 'clamp(26px,4vw,54px)',    [0.04, 0.06], 14 ],
    [  14, 'clamp(13px,2vw,26px)',    [0.03, 0.05], 20 ],
  ];

  function overlaps(placed, cx, cy, r) {
    for (const p of placed) {
      const dx = cx - p.cx, dy = cy - p.cy;
      if (Math.sqrt(dx * dx + dy * dy) < (r + p.r) * OVERLAP) return true;
    }
    return false;
  }

  function inGuard(cx, cy, r, guardRects, elLeft, elTop) {
    for (const g of guardRects) {
      if ((elLeft + cx) > g.left  - r && (elLeft + cx) < g.right  + r &&
          (elTop  + cy) > g.top   - r && (elTop  + cy) < g.bottom + r) return true;
    }
    return false;
  }

  function runPass(el, pool, placed, passR, passCss, opRange, nBase, guardRects) {
    const rect = el.getBoundingClientRect();
    const W = rect.width  || el.offsetWidth  || window.innerWidth;
    const H = rect.height || el.offsetHeight || 400;
    if (W < 10 || H < 10) return;

    const elLeft = rect.left + window.scrollX;
    const elTop  = rect.top  + window.scrollY;

    const area = W * H;
    const refArea = 960 * 500;
    const n = Math.round(nBase * Math.min(2.2, Math.max(0.4, area / refArea)));
    const imgs = shuffle(pool).slice(0, Math.min(n * 3, pool.length));
    let placedCount = 0;

    // tingimento: seções normais ficam em tom osso (bate com --ink);
    // seções marcadas com data-decor-accent usam tom oxblood (--accent-bright)
    const accent = el.closest('[data-decor-accent]') !== null;
    const tintCss = accent
      ? 'filter:invert(14%) sepia(64%) saturate(2800%) hue-rotate(347deg) brightness(85%) contrast(92%);'
      : 'filter:invert(94%) sepia(6%) saturate(280%) hue-rotate(345deg) brightness(0.92) contrast(0.9);';

    for (const src of imgs) {
      if (placedCount >= n) break;
      const MAX = 200;
      for (let t = 0; t < MAX; t++) {
        const cx = rnd(passR, W - passR);
        const cy = rnd(passR, H - passR);
        if (overlaps(placed, cx, cy, passR)) continue;
        if (guardRects.length && inGuard(cx, cy, passR, guardRects, elLeft, elTop)) continue;

        placed.push({ cx, cy, r: passR });
        placedCount++;

        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';

        const rot = rnd(-35, 35).toFixed(1);
        const op = (opRange[0] + Math.random() * (opRange[1] - opRange[0])).toFixed(3);

        img.style.cssText = [
          'position:absolute',
          'pointer-events:none',
          'user-select:none',
          tintCss,
          'height:auto',
          'z-index:0',
          `width:${passCss}`,
          `opacity:${op}`,
          `left:${((cx / W) * 100).toFixed(2)}%`,
          `top:${((cy / H) * 100).toFixed(2)}%`,
          `transform:translate(-50%,-50%) rotate(${rot}deg)`,
        ].join(';');

        el.appendChild(img);
        break;
      }
    }
  }

  // ── Guard rects — evita cobrir imagem real, formulário ou botão ──
  function getGuardRects() {
    const guards = [];
    document.querySelectorAll(
      'img:not([data-decor]), svg, form, input, textarea, select, .btn, .price-card, .card, .kit-wheel-box, .diagram-box'
    ).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 40 && r.height > 20) {
        guards.push({
          top:    r.top    + window.scrollY - 14,
          left:   r.left   + window.scrollX - 14,
          bottom: r.bottom + window.scrollY + 14,
          right:  r.right  + window.scrollX + 14,
        });
      }
    });
    return guards;
  }

  // ── Init ────────────────────────────────────────────────────
  async function init() {
    const pool = await getPool();
    if (!pool.length) return; // sem símbolo cadastrado ainda — não faz nada

    await new Promise(r => setTimeout(r, 400));
    const guards = getGuardRects();

    requestAnimationFrame(() => {
      document.querySelectorAll('section').forEach(el => {
        const pos = getComputedStyle(el).position;
        if (pos === 'static') el.style.position = 'relative';
        if (getComputedStyle(el).overflow === 'visible') el.style.overflow = 'hidden';

        const placed = [];
        PASSES.forEach(([r, css, opRange, nBase]) => {
          runPass(el, pool, placed, r, css, opRange, nBase, guards);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
