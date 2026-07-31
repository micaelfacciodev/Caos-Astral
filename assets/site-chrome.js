/**
 * site-chrome.js — Caos Astral
 * Fonte única do header e do footer do site. Nenhuma página deve
 * hardcodar o markup de <header class="site-header"> ou
 * <footer class="site-footer"> — só um mount vazio:
 *
 *   <header class="site-header" id="site-header"></header>
 *   ...
 *   <footer class="site-footer" id="site-footer"></footer>
 *
 * Pra mudar um link do menu ou do rodapé em TODO o site, mude só aqui.
 * Nunca copie/cole o HTML do header ou footer numa página nova de novo
 * — isso é exatamente o que esse arquivo existe pra evitar (menu
 * divergindo por página, um por agente que passou por ali).
 *
 * Overrides pontuais (login-gated, admin etc.) via variável global
 * definida ANTES deste script, ex.:
 *   <script>
 *     window.SITE_CHROME = {
 *       headerCta: { label: "Registrar experiência", href: "diario" },
 *       footerCta: { label: "Registrar minha primeira experiência", href: "diario" },
 *       footer: false // omite o footer inteiro (ex.: ritual-de-entrada, admin)
 *     };
 *   </script>
 *   <script src="assets/site-chrome.js" defer></script>
 *
 * Ordem importa: este script deve ser o PRIMEIRO <script defer> da
 * página, antes de assets/nav-menu.js e assets/theme-toggle.js — eles
 * dependem do markup que este arquivo injeta.
 */
(function () {
  'use strict';

  var cfg = window.SITE_CHROME || {};

  // ---- grupos do menu — única lista, usada em toda página ----
  var NAV_GROUPS = [
    {
      label: 'Ferramentas',
      links: [
        ['kit', 'O Kit'],
        ['retorno', 'Retorno'],
        ['ressonancia', 'O Terceiro'],
        ['ancora', 'Âncora'],
        ['deriva', 'Deriva'],
        ['oraculo', 'Oráculo'],
        ['diario', 'Diário'],
      ],
    },
    {
      label: 'Saber',
      links: [
        ['raizes', 'Raízes'],
        ['enciclopedia', 'Enciclopédia'],
        ['blog', 'Blog'],
      ],
    },
    {
      label: 'Sobre',
      links: [
        ['manifesto', 'Manifesto'],
        ['intento', 'Intento'],
        ['planos', 'Planos'],
      ],
    },
  ];

  // ---- rodapé — única lista, usada em toda página ----
  var FOOTER_LINKS = [
    ['manifesto', 'Manifesto'],
    ['intento', 'Intento'],
    ['raizes', 'Raízes'],
    ['enciclopedia', 'Enciclopédia'],
    ['diario', 'Diário'],
    ['termos', 'Termos'],
    ['privacidade', 'Privacidade'],
    ['planos', 'Planos'],
  ];

  var DEFAULT_HEADER_CTA = { label: 'Abrir meu kit', href: 'ritual-de-entrada' };
  var DEFAULT_FOOTER_CTA = { label: 'Abrir meu kit, grátis', href: 'ritual-de-entrada' };

  function currentSlug() {
    var last = location.pathname.split('/').pop() || '';
    last = last.replace(/\.html$/, '');
    return last === '' ? 'index' : last;
  }

  function ctaMarkup(cta, extraClass) {
    var cls = 'btn ' + (extraClass || 'btn-ghost mono');
    if (cta.onclick) {
      return '<a href="javascript:void(0)" onclick="' + cta.onclick + '" class="' + cls + '">' + cta.label + '</a>';
    }
    return '<a href="' + cta.href + '" class="' + cls + '">' + cta.label + '</a>';
  }

  function buildHeader(activeSlug) {
    var cta = cfg.headerCta || DEFAULT_HEADER_CTA;
    var groupsHtml = NAV_GROUPS.map(function (group) {
      var linksHtml = group.links
        .map(function (l) {
          var active = l[0] === activeSlug ? ' class="active"' : '';
          return '<a href="' + l[0] + '"' + active + '>' + l[1] + '</a>';
        })
        .join('\n          ');
      return (
        '<div class="nav-group">\n' +
        '        <button type="button" class="nav-group-toggle" aria-haspopup="true" aria-expanded="false">' +
        group.label +
        ' <svg class="caret" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 1l4 4 4-4"/></svg></button>\n' +
        '        <div class="nav-dropdown">\n          ' +
        linksHtml +
        '\n        </div>\n      </div>'
      );
    }).join('\n      ');

    return (
      '<nav class="wrap">\n' +
      '    <a href="index" class="logo">\n' +
      '      <svg class="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">\n' +
      '        <path d="M12 1 L13.6 9.5 L22 8 L15.2 13.2 L20 21 L12 16.4 L4 21 L8.8 13.2 L2 8 L10.4 9.5 Z"/>\n' +
      '      </svg>\n' +
      '      Caos Astral\n' +
      '    </a>\n' +
      '    <button type="button" class="nav-toggle" id="navToggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-links">\n' +
      '      <svg class="icon-burger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>\n' +
      '      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>\n' +
      '    </button>\n\n' +
      '    <div class="nav-links" id="nav-links">\n      ' +
      groupsHtml +
      '\n    </div>\n' +
      '    ' + ctaMarkup(cta, 'btn-ghost mono') + '\n' +
      '  <button type="button" class="theme-toggle" id="themeToggle" aria-label="Alternar modo claro/escuro" aria-pressed="false">\n' +
      '      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.4A9 9 0 1 1 11.6 3a7 7 0 0 0 9.4 9.4Z"/></svg>\n' +
      '      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>\n' +
      '    </button>\n' +
      '  </nav>'
    );
  }

  function buildFooter() {
    var cta = cfg.footerCta || DEFAULT_FOOTER_CTA;
    var linksHtml = FOOTER_LINKS.map(function (l) {
      return '<a href="' + l[0] + '">' + l[1] + '</a>';
    }).join('');

    return (
      '<div class="wrap">\n' +
      '    <h2>Ninguém vai carregar seu destino no colo. Mas você pode aprender a ler o terreno.</h2>\n' +
      '    ' + ctaMarkup(cta, 'btn-solid mono') + '\n' +
      '    <div class="footer-bottom">\n' +
      '      <span>© Caos Astral</span>\n' +
      '      <div class="footer-links">' + linksHtml + '</div>\n' +
      '    </div>\n' +
      '  </div>'
    );
  }

  var slug = currentSlug();
  var headerEl = document.getElementById('site-header') || document.querySelector('header.site-header');
  if (headerEl) {
    headerEl.innerHTML = buildHeader(slug);
  }

  if (cfg.footer !== false) {
    var footerEl = document.getElementById('site-footer') || document.querySelector('footer.site-footer');
    if (footerEl) {
      footerEl.innerHTML = buildFooter();
    }
  }
})();
