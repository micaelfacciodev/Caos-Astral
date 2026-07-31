/**
 * space-bg.js — Caos Astral
 * Fundo espacial compartilhado por todas as páginas do site.
 * Depende do markup:
 *   <div id="space-bg" aria-hidden="true">
 *     <div class="nebula"></div>
 *     <div class="stars-static" id="stars-static"></div>
 *     <canvas id="space-canvas"></canvas>
 *   </div>
 * e das regras equivalentes em assets/style.css (seção "FUNDO ESPACIAL").
 * Custo propositalmente baixo: poucas partículas, ~24fps, pausa quando a
 * aba não está visível, e desliga a cintilação em prefers-reduced-motion.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Estrelas estáticas (posições fixas, geradas 1x, sem animação) ----
  var staticContainer = document.getElementById('stars-static');
  if (staticContainer) {
    var frag = document.createDocumentFragment();
    var count = window.innerWidth < 640 ? 60 : 110; // poucas estrelas, leve
    for (var i = 0; i < count; i++) {
      var star = document.createElement('i');
      var size = Math.random() < 0.85 ? 1 : 2; // maioria pequena
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 100) + '%';
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
      frag.appendChild(star);
    }
    staticContainer.appendChild(frag);
  }

  // ---- Estrelas cintilantes em canvas (poucas partículas, custo mínimo) ----
  var canvas = document.getElementById('space-canvas');
  if (!canvas || reduceMotion) return; // sem cintilação se o usuário pedir menos movimento

  var ctx = canvas.getContext('2d');
  var stars = [];
  var STAR_COUNT = window.innerWidth < 640 ? 35 : 70; // deliberadamente baixo
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5); // limita DPR pra não pesar em telas retina
  var running = true;
  var w, h;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.4,
        baseAlpha: 0.3 + Math.random() * 0.5,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  resize();
  makeStars();
  window.addEventListener('resize', function () {
    resize();
    makeStars();
  }, { passive: true });

  var last = 0;
  function tick(ts) {
    if (!running) return;
    // limita a ~24fps, suficiente pra um "piscar" suave e economiza CPU
    if (ts - last < 42) {
      requestAnimationFrame(tick);
      return;
    }
    last = ts;

    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = s.baseAlpha + Math.sin(ts * 0.001 * s.speed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, Math.min(1, alpha)) + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  function isLightMode() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  // Pausa completamente quando a aba não está visível, economiza bateria/CPU.
  // Também pausa em modo claro (CSS já esconde com opacity:0, mas sem isso
  // o canvas continuaria desenhando escondido, gastando CPU à toa).
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden && !isLightMode();
    if (running) requestAnimationFrame(tick);
  });
  document.addEventListener('caosastral:theme', function (e) {
    var light = e && e.detail && e.detail.theme === 'light';
    running = !light && !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  running = !isLightMode();
  if (running) requestAnimationFrame(tick);
})();
