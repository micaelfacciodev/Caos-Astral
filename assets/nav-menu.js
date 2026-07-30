/**
 * nav-menu.js — Caos Astral
 * Menu hamburguer mobile, compartilhado por todas as páginas do site
 * que usam o header padrão (assets/style.css).
 * Depende do markup gerado no <nav class="wrap">:
 *   <a class="logo">...</a>
 *   <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">...</button>
 *   <div class="nav-links" id="nav-links">...</div>
 *   <a class="btn ...">CTA</a>
 * e das regras equivalentes em assets/style.css (seção "NAV MOBILE").
 */
(function () {
  'use strict';

  function setup(nav) {
    var toggle = nav.querySelector('.nav-toggle');
    var links = nav.querySelector('.nav-links');
    if (!toggle || !links) return;

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
    }
    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      links.classList.add('open');
    }
    function toggleMenu() {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { close(); } else { open(); }
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // fecha ao clicar fora do menu
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) close();
    });

    // fecha com Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // fecha ao clicar num link do menu
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    // fecha sozinho se a tela crescer além do breakpoint mobile
    var mq = window.matchMedia('(min-width:861px)');
    function handleChange(e) {
      if (e.matches) close();
    }
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange);
    } else if (mq.addListener) {
      mq.addListener(handleChange); // Safari antigo
    }
  }

  var navs = document.querySelectorAll('nav.wrap');
  for (var i = 0; i < navs.length; i++) {
    setup(navs[i]);
  }
})();
