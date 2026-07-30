/**
 * nav-menu.js — Caos Astral
 * Menu hamburguer mobile + dropdowns agrupados (Ferramentas / Saber / Sobre),
 * compartilhado por todas as páginas que usam o header padrão (assets/style.css).
 * Depende do markup gerado no <nav class="wrap">:
 *   <a class="logo">...</a>
 *   <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">...</button>
 *   <div class="nav-links" id="nav-links">
 *     <div class="nav-group">
 *       <button class="nav-group-toggle" aria-expanded="false">Rótulo</button>
 *       <div class="nav-dropdown"><a>...</a>...</div>
 *     </div>
 *     ...
 *   </div>
 *   <a class="btn ...">CTA</a>
 * e das regras equivalentes em assets/style.css (seções "NAV GROUPS" e "NAV MOBILE").
 */
(function () {
  'use strict';

  function setup(nav) {
    var toggle = nav.querySelector('.nav-toggle');
    var links = nav.querySelector('.nav-links');
    if (!toggle || !links) return;

    var groups = links.querySelectorAll('.nav-group');

    function closeGroups(except) {
      for (var i = 0; i < groups.length; i++) {
        if (groups[i] === except) continue;
        groups[i].classList.remove('open');
        var t = groups[i].querySelector('.nav-group-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    }

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      closeGroups();
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

    // marca o grupo que contém o link ativo, e liga os dropdowns
    for (var g = 0; g < groups.length; g++) {
      (function (group) {
        var groupToggle = group.querySelector('.nav-group-toggle');
        var dropdown = group.querySelector('.nav-dropdown');
        if (!groupToggle || !dropdown) return;

        if (dropdown.querySelector('a.active')) {
          groupToggle.classList.add('current');
        }

        groupToggle.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = group.classList.contains('open');
          closeGroups(group);
          group.classList.toggle('open', !isOpen);
          groupToggle.setAttribute('aria-expanded', String(!isOpen));
        });
      })(groups[g]);
    }

    // fecha tudo ao clicar fora do menu
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) { close(); }
      else if (!e.target.closest('.nav-group')) { closeGroups(); }
    });

    // fecha com Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // fecha tudo ao clicar num link (de dentro de um dropdown ou não)
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
