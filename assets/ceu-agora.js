/**
 * ceu-agora.js — Caos Astral
 * Widget fixo (canto inferior direito) com a posição dos planetas AGORA
 * e os aspectos ativos entre eles — calculado 100% no navegador via
 * astronomy-engine (CDN, carregado sob demanda) + a mesma kepleriana de
 * Quíron usada em compute-natal-chart (mesma época/elementos JPL SBDB).
 *
 * De propósito, NÃO depende de Supabase, de nenhuma Edge Function nem
 * de sessão — é matemática pura no cliente. Motivo: compute-natal-chart
 * está retornando erro em produção (ver claude.md, pendência aberta) e
 * isso dá pro site mostrar informação astrológica real e funcionando
 * enquanto isso não é resolvido, sem depender do motor quebrado.
 *
 * Orbe/ângulos dos aspectos e elementos orbitais de Quíron espelham
 * exatamente os mesmos valores do motor real (compute-natal-chart) —
 * se algum dia esses valores mudarem lá, mudar aqui também.
 */
(function () {
  'use strict';

  var SIGN_NAMES = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
  ];

  var BODIES = [
    { key: 'sun', label: 'Sol', glyph: '☉', body: 'Sun', neverRetro: true },
    { key: 'moon', label: 'Lua', glyph: '☽', body: 'Moon', neverRetro: true },
    { key: 'mercury', label: 'Mercúrio', glyph: '☿', body: 'Mercury' },
    { key: 'venus', label: 'Vênus', glyph: '♀', body: 'Venus' },
    { key: 'mars', label: 'Marte', glyph: '♂', body: 'Mars' },
    { key: 'jupiter', label: 'Júpiter', glyph: '♃', body: 'Jupiter' },
    { key: 'saturn', label: 'Saturno', glyph: '♄', body: 'Saturn' },
    { key: 'uranus', label: 'Urano', glyph: '♅', body: 'Uranus' },
    { key: 'neptune', label: 'Netuno', glyph: '♆', body: 'Neptune' },
    { key: 'pluto', label: 'Plutão', glyph: '♇', body: 'Pluto' },
    { key: 'chiron', label: 'Quíron', glyph: '⚷', custom: true },
    { key: 'exilio', label: 'Exílio', glyph: '⚸', lilith: true },
  ];

  var ASPECTS = [
    { key: 'conjuncao', angle: 0, orb: 8, rotulo: 'neutro' },
    { key: 'sextil', angle: 60, orb: 5, rotulo: 'corrente' },
    { key: 'quadratura', angle: 90, orb: 7, rotulo: 'friccao' },
    { key: 'trigono', angle: 120, orb: 7, rotulo: 'corrente' },
    { key: 'oposicao', angle: 180, orb: 8, rotulo: 'friccao' },
  ];
  var ASPECT_NAME = { conjuncao: 'Conjunção', sextil: 'Sextil', quadratura: 'Quadratura', trigono: 'Trígono', oposicao: 'Oposição' };

  function norm360(x) { x = x % 360; if (x < 0) x += 360; return x; }
  function angDiff(a, b) { var d = Math.abs(a - b) % 360; if (d > 180) d = 360 - d; return d; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // ---- Quíron: kepleriana de dois corpos, mesmos elementos/época do motor real ----
  var CHIRON_EPOCH_JD = 2459396.5;
  var CHIRON_EL = { a: 13.70, e: 0.3772, i: 6.9299, om: 209.27, w: 339.48, M0: 180.70, periodDays: 18523 };

  function toJulianDay(d) {
    var Y = d.getUTCFullYear(), M = d.getUTCMonth() + 1;
    var D = d.getUTCDate() + (d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600) / 24;
    var y = Y, m = M;
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + D + B - 1524.5;
  }

  function solveKepler(Mrad, e) {
    var E = Mrad;
    for (var i = 0; i < 30; i++) {
      var dE = (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-9) break;
    }
    return E;
  }

  function chironHeliocentricEcliptic(date) {
    var jd = toJulianDay(date);
    var n = 360 / CHIRON_EL.periodDays;
    var M = norm360(CHIRON_EL.M0 + n * (jd - CHIRON_EPOCH_JD)) * Math.PI / 180;
    var e = CHIRON_EL.e;
    var E = solveKepler(M, e);
    var nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    var r = CHIRON_EL.a * (1 - e * Math.cos(E));
    var xOrb = r * Math.cos(nu), yOrb = r * Math.sin(nu);
    var om = CHIRON_EL.om * Math.PI / 180, w = CHIRON_EL.w * Math.PI / 180, i = CHIRON_EL.i * Math.PI / 180;
    var cosO = Math.cos(om), sinO = Math.sin(om), cosw = Math.cos(w), sinw = Math.sin(w), cosi = Math.cos(i), sini = Math.sin(i);
    var x = (cosO * cosw - sinO * sinw * cosi) * xOrb + (-cosO * sinw - sinO * cosw * cosi) * yOrb;
    var y = (sinO * cosw + cosO * sinw * cosi) * xOrb + (-sinO * sinw + cosO * cosw * cosi) * yOrb;
    var z = (sinw * sini) * xOrb + (cosw * sini) * yOrb;
    return { x: x, y: y, z: z };
  }

  function chironGeocentricLongitude(date, Astronomy) {
    var helio = chironHeliocentricEcliptic(date);
    var earthHelioEQJ = Astronomy.HelioVector(Astronomy.Body.Earth, date);
    var rot = Astronomy.Rotation_EQJ_ECL();
    var earthHelioECL = Astronomy.RotateVector(rot, earthHelioEQJ);
    var gx = helio.x - earthHelioECL.x, gy = helio.y - earthHelioECL.y;
    return norm360(Math.atan2(gy, gx) * 180 / Math.PI);
  }

  function geoEclipticLongitude(Astronomy, bodyName, date) {
    var gv = Astronomy.GeoVector(Astronomy.Body[bodyName], date, true);
    var ecl = Astronomy.Ecliptic(gv);
    return norm360(ecl.elon);
  }

  // ---- Exílio (Lilith Negra verdadeira = apogeu osculante da órbita
  // lunar): NÃO é a Lilith média (polinômio suavizado que a maioria dos
  // sites usa por padrão) — é o apogeu instantâneo, calculado a partir
  // do vetor de excentricidade osculante da órbita relativa Terra-Lua
  // no instante exato. Perigeu e apogeu ficam na mesma reta (vistos da
  // Terra), então apogeu = direção do vetor de excentricidade + 180°.
  // μ usado é o geocêntrico Terra+Lua (órbita relativa de 2 corpos, não
  // só GM da Terra sozinha — usar só GM_Terra dá direção levemente
  // errada). Validado: oscila dentro de ~±30° da Lilith média em vários
  // instantes de teste, e a excentricidade osculante resultante fica
  // sempre entre ~0.026–0.077 — ambos batem com o comportamento
  // documentado da Lilith verdadeira (ela é assim mesmo: "erra volta",
  // pode até retrogradar, ao contrário da média que nunca retrograda).
  var LILITH_MU_AU3_DAY2 = (403503.235 * 86400 * 86400) / (149597870.7 * 149597870.7 * 149597870.7);

  function lilithGeocentricLongitude(Astronomy, date) {
    var state = Astronomy.GeoMoonState(date);
    var rot = Astronomy.Rotation_EQJ_ECL();
    var pos = Astronomy.RotateVector(rot, { x: state.x, y: state.y, z: state.z });
    var vel = Astronomy.RotateVector(rot, { x: state.vx, y: state.vy, z: state.vz });
    var r = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
    var v2 = vel.x * vel.x + vel.y * vel.y + vel.z * vel.z;
    var rdotv = pos.x * vel.x + pos.y * vel.y + pos.z * vel.z;
    var mu = LILITH_MU_AU3_DAY2;
    var ex = ((v2 - mu / r) * pos.x - rdotv * vel.x) / mu;
    var ey = ((v2 - mu / r) * pos.y - rdotv * vel.y) / mu;
    // vetor de excentricidade aponta pro perigeu; Lilith é o apogeu, +180°
    return norm360(Math.atan2(ey, ex) * 180 / Math.PI + 180);
  }

  function formatDegree(lonDeg) {
    var signIdx = Math.floor(lonDeg / 30);
    var inSign = lonDeg - signIdx * 30;
    var deg = Math.floor(inSign);
    var min = Math.round((inSign - deg) * 60);
    if (min === 60) { min = 0; deg += 1; }
    return { sign: SIGN_NAMES[signIdx], deg: deg, min: min };
  }

  function computeSky(Astronomy) {
    var now = new Date();
    var results = BODIES.map(function (b) {
      var lon = b.custom
        ? chironGeocentricLongitude(now, Astronomy)
        : b.lilith
        ? lilithGeocentricLongitude(Astronomy, now)
        : geoEclipticLongitude(Astronomy, b.body, now);
      var retro = false;
      if (!b.neverRetro) {
        var prev = new Date(now.getTime() - 86400000);
        var prevLon = b.custom
          ? chironGeocentricLongitude(prev, Astronomy)
          : b.lilith
          ? lilithGeocentricLongitude(Astronomy, prev)
          : geoEclipticLongitude(Astronomy, b.body, prev);
        var diff = lon - prevLon;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        retro = diff < 0;
      }
      return { key: b.key, label: b.label, glyph: b.glyph, lon: lon, retro: retro, fmt: formatDegree(lon) };
    });

    var aspectos = [];
    for (var i = 0; i < results.length; i++) {
      for (var j = i + 1; j < results.length; j++) {
        var diff = angDiff(results[i].lon, results[j].lon);
        var best = null, bestDelta = Infinity;
        for (var k = 0; k < ASPECTS.length; k++) {
          var a = ASPECTS[k];
          var delta = Math.abs(diff - a.angle);
          if (delta <= a.orb && delta < bestDelta) { best = a; bestDelta = delta; }
        }
        if (best) aspectos.push({ a: results[i], b: results[j], aspecto: best, orbe: bestDelta });
      }
    }
    aspectos.sort(function (x, y) { return x.orbe - y.orbe; });

    return { now: now, planetas: results, aspectos: aspectos };
  }

  // ---- widget: markup, carregamento sob demanda do astronomy-engine, refresh ----
  var astronomyPromise = null;
  function ensureAstronomy() {
    if (astronomyPromise) return astronomyPromise;
    astronomyPromise = new Promise(function (resolve) {
      if (window.Astronomy) { resolve(window.Astronomy); return; }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.js';
      s.onload = function () { resolve(window.Astronomy); };
      s.onerror = function () { resolve(null); };
      document.head.appendChild(s);
    });
    return astronomyPromise;
  }

  function buildWidgetShell() {
    var wrap = document.createElement('div');
    wrap.id = 'ceuAgora';
    wrap.className = 'ceu-agora';
    wrap.innerHTML =
      '<button type="button" class="ceu-agora-toggle" id="ceuAgoraToggle" aria-expanded="false" aria-label="O céu agora">' +
      '<span class="ceu-agora-glyph">☉</span> Céu agora' +
      '</button>' +
      '<div class="ceu-agora-panel" id="ceuAgoraPanel">' +
      '<div class="ceu-agora-head"><span>O céu agora</span>' +
      '<button type="button" class="ceu-agora-close" id="ceuAgoraClose" aria-label="Fechar">×</button></div>' +
      '<div class="ceu-agora-time" id="ceuAgoraTime">carregando…</div>' +
      '<div class="ceu-agora-planetas" id="ceuAgoraPlanetas"></div>' +
      '<div class="ceu-agora-aspectos-head">Aspectos ativos</div>' +
      '<div class="ceu-agora-aspectos" id="ceuAgoraAspectos"></div>' +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  var DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  function render(sky) {
    var timeEl = document.getElementById('ceuAgoraTime');
    var pEl = document.getElementById('ceuAgoraPlanetas');
    var aEl = document.getElementById('ceuAgoraAspectos');
    if (!timeEl) return;

    var d = sky.now;
    timeEl.textContent = DIAS[d.getDay()] + ', ' + pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + 'h' + pad2(d.getMinutes());

    pEl.innerHTML = sky.planetas.map(function (p) {
      return '<div class="ceu-agora-row">' +
        '<span class="ceu-agora-glyph-sm">' + p.glyph + '</span>' +
        '<span class="ceu-agora-planeta-nome">' + p.label + '</span>' +
        '<span class="ceu-agora-grau">' + p.fmt.deg + '°' + pad2(p.fmt.min) + "' " + p.fmt.sign + (p.retro ? ' R' : '') + '</span>' +
        '</div>';
    }).join('');

    if (!sky.aspectos.length) {
      aEl.innerHTML = '<div class="ceu-agora-sem-aspecto">nenhum aspecto exato agora</div>';
    } else {
      aEl.innerHTML = sky.aspectos.map(function (x) {
        return '<div class="ceu-agora-aspecto ceu-agora-aspecto--' + x.aspecto.rotulo + '">' +
          '<span>' + x.a.label + ' ' + ASPECT_NAME[x.aspecto.key] + ' ' + x.b.label + '</span>' +
          '<span class="ceu-agora-orbe">' + x.orbe.toFixed(2) + '°</span>' +
          '</div>';
      }).join('');
    }
  }

  function refresh() {
    ensureAstronomy().then(function (Astronomy) {
      if (!Astronomy) return;
      try {
        render(computeSky(Astronomy));
      } catch (e) {
        console.error('ceu-agora: erro ao calcular', e);
      }
    });
  }

  function init() {
    var wrap = buildWidgetShell();
    var toggle = document.getElementById('ceuAgoraToggle');
    var closeBtn = document.getElementById('ceuAgoraClose');

    toggle.addEventListener('click', function () {
      var open = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      if (open) refresh();
    });
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    // recalcula a cada 60s, só enquanto o painel estiver aberto
    setInterval(function () {
      if (wrap.classList.contains('open')) refresh();
    }, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
