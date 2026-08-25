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
 * CTA do header — três estados. (1) Override manual (kit logado,
 * admin) -> CTA simples de sempre, sem checar nada. (2) Sem override +
 * sessão salva no navegador -> mostra o e-mail com um menu de conta
 * (Meu kit / Sair). (3) Sem override + sem sessão -> dropdown "Entrar"
 * (Google + e-mail/senha via Supabase Auth, mesmas credenciais/
 * chamadas de ritual-de-entrada.html) com link "Criar agora" pro
 * ritual de entrada. Login bem-sucedido (Google ou e-mail/senha)
 * redireciona pro `kit` — desde 25/08 é o hub único do ecossistema
 * (mapa natal, janela do dia, grid de produtos, prévia do diário,
 * encerrar conta, tudo numa página só, ver kit.html). dashboard.html
 * foi apagado nessa data (nunca teve nada indexado).
 *
 * Detecção de sessão é OTIMISTA: lê direto a chave que o supabase-js
 * já guarda em localStorage (sem carregar a lib nem validar com o
 * servidor) só pra decidir o que mostrar. É decoração de UI, não gate
 * de conteúdo — se o token realmente tiver expirado, a primeira ação
 * que precisar dele de verdade (abrir o kit, etc.) vai falhar do jeito
 * normal e pedir login de novo. Login/logout feito por FORA deste
 * dropdown (ex.: login direto em ritual-de-entrada.html) só reflete
 * aqui depois de recarregar a página — não há listener de
 * onAuthStateChange entre páginas.
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

  var DEFAULT_FOOTER_CTA = { label: 'Abrir meu kit, grátis', href: 'ritual-de-entrada' };

  // credenciais públicas do Supabase (anon/publishable key — protegida por
  // RLS, seguro deixar no código-fonte, ver claude.md seção 4)
  // Lê de assets/supabase-config.js (fonte única). O fallback abaixo
  // só entra em ação se, por algum motivo, essa página carregar
  // site-chrome.js sem antes carregar supabase-config.js.
  var SUPABASE_URL = window.CAOS_SUPABASE_URL || 'https://pibwwyqjrsdwnzsiremx.supabase.co';
  var SUPABASE_KEY = window.CAOS_SUPABASE_KEY || 'sb_publishable_kPxQ9BGs68o9lich7qWTKw_W83iNPgs';

  function currentSlug() {
    var last = location.pathname.split('/').pop() || '';
    last = last.replace(/\.html$/, '');
    return last === '' ? 'index' : last;
  }

  // ---- sessão salva: lida direto do localStorage, sem carregar o
  // supabase-js inteiro só pra decidir o que mostrar no header. O
  // supabase-js v2 guarda a sessão em 'sb-<project-ref>-auth-token'.
  // Leitura otimista: se tem usuário guardado, mostra estado logado —
  // não valida token com o servidor aqui (isso é decoração de UI, não
  // gate de conteúdo; se o token realmente expirou, a primeira ação que
  // precisar dele de verdade vai falhar e pedir login de novo).
  function readStoredSession() {
    try {
      var raw = window.localStorage.getItem('sb-pibwwyqjrsdwnzsiremx-auth-token');
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      var session = parsed && (parsed.currentSession || parsed);
      if (!session || !session.user) return null;
      return session;
    } catch (e) {
      return null;
    }
  }

  function ctaMarkup(cta, extraClass) {
    var cls = 'btn ' + (extraClass || 'btn-ghost mono');
    if (cta.onclick) {
      return '<a href="javascript:void(0)" onclick="' + cta.onclick + '" class="' + cls + '">' + cta.label + '</a>';
    }
    return '<a href="' + cta.href + '" class="' + cls + '">' + cta.label + '</a>';
  }

  function buildAuthBlock() {
    return (
      '<div class="nav-auth" id="navAuth">\n' +
      '      <button type="button" class="btn btn-ghost mono" id="navAuthToggle" aria-expanded="false">Entrar</button>\n' +
      '      <div class="auth-dropdown" id="navAuthDropdown">\n' +
      '        <button type="button" class="auth-oauth-btn" id="navBtnGoogle">\n' +
      '          <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/></svg>\n' +
      '          Continuar com Google\n' +
      '        </button>\n' +
      '        <div class="auth-divider">ou com e-mail</div>\n' +
      '        <div class="field"><input type="email" id="navInpEmail" placeholder="voce@email.com" autocomplete="email"></div>\n' +
      '        <div class="field"><input type="password" id="navInpSenha" placeholder="senha" autocomplete="current-password"></div>\n' +
      '        <p id="navAuthError" style="display:none; color:#e0665a; font-size:0.72rem; margin:-2px 0 10px;"></p>\n' +
      '        <button type="button" class="btn btn-solid mono" id="navBtnEntrar" style="width:100%;">Entrar</button>\n' +
      '        <p class="auth-dropdown-foot">Ainda não tem kit? <a href="ritual-de-entrada">Criar agora →</a></p>\n' +
      '      </div>\n' +
      '    </div>'
    );
  }

  function buildAccountBlock(session) {
    var email = (session.user && session.user.email) || '';
    var label = email ? email.split('@')[0] : 'Minha conta';
    return (
      '<div class="nav-auth" id="navAccount">\n' +
      '      <button type="button" class="btn btn-ghost mono" id="navAccountToggle" aria-expanded="false">' + label + ' <span class="nav-account-caret">▾</span></button>\n' +
      '      <div class="auth-dropdown" id="navAccountDropdown">\n' +
      '        <div class="auth-account-email">' + (email || label) + '</div>\n' +
      '        <a href="kit" class="auth-account-link">Meu kit</a>\n' +
      '        <button type="button" class="btn btn-ghost mono" id="navBtnSair" style="width:100%; margin-top:12px;">Sair</button>\n' +
      '      </div>\n' +
      '    </div>'
    );
  }

  function buildHeader(activeSlug) {
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

    // três estados possíveis: override manual (dashboard logado, admin) ->
    // CTA simples de sempre; sem override + sessão salva -> conta logada;
    // sem override + sem sessão -> dropdown de Entrar/Cadastrar.
    var session = cfg.headerCta ? null : readStoredSession();
    var ctaSlot;
    if (cfg.headerCta) {
      ctaSlot = ctaMarkup(cfg.headerCta, 'btn-ghost mono');
    } else if (session) {
      ctaSlot = buildAccountBlock(session);
    } else {
      ctaSlot = buildAuthBlock();
    }

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
      '    ' + ctaSlot + '\n' +
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

  // ---- dropdown de Entrar/Cadastrar: interação + login real ----
  // Carrega o supabase-js sob demanda (a maioria das páginas do site
  // não precisa dele até alguém clicar em "Entrar") e reaproveita as
  // mesmas credenciais/chamadas já usadas em ritual-de-entrada.html.
  var authClientPromise = null;
  function getAuthClient() {
    if (authClientPromise) return authClientPromise;
    authClientPromise = new Promise(function (resolve) {
      function create() {
        resolve(window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY));
      }
      if (window.supabase) { create(); return; }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = create;
      document.head.appendChild(s);
    });
    return authClientPromise;
  }

  function setupAuthDropdown() {
    var wrap = document.getElementById('navAuth');
    if (!wrap) return; // página com CTA override (dashboard logado, admin) — nada a fazer

    var toggle = document.getElementById('navAuthToggle');
    var errorEl = document.getElementById('navAuthError');

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.getElementById('navBtnGoogle').addEventListener('click', function () {
      getAuthClient().then(function (sb) {
        // mesma pasta da página atual (preserva o base path, ex.: /Caos-Astral/),
        // trocando só o arquivo final por kit — consistente com o
        // e-mail/senha logo abaixo. NÃO confundir com o botão Google
        // de dentro de ritual-de-entrada.html, que é outro código e
        // continua voltando pra si mesmo de propósito (precisa terminar
        // o ritual/cálculo antes de sair da página).
        var dir = window.location.pathname.replace(/[^/]*$/, '');
        sb.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin + dir + 'kit' },
        });
      });
    });

    document.getElementById('navBtnEntrar').addEventListener('click', function () {
      var email = document.getElementById('navInpEmail').value.trim();
      var senha = document.getElementById('navInpSenha').value;
      errorEl.style.display = 'none';
      if (!email || !senha) { showError('preenche e-mail e senha.'); return; }
      getAuthClient().then(function (sb) {
        sb.auth.signInWithPassword({ email: email, password: senha }).then(function (res) {
          if (res.error) { showError('e-mail ou senha incorretos.'); return; }
          // kit é o hub do ecossistema (ver comentário no topo do arquivo)
          window.location.href = 'kit';
        });
      });
    });
  }

  function setupAccountDropdown() {
    var wrap = document.getElementById('navAccount');
    if (!wrap) return; // não está logado, ou é página com override — nada a fazer

    var toggle = document.getElementById('navAccountToggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.getElementById('navBtnSair').addEventListener('click', function () {
      getAuthClient().then(function (sb) {
        sb.auth.signOut().then(function () {
          window.location.href = 'index';
        });
      });
    });
  }

  var slug = currentSlug();
  var headerEl = document.getElementById('site-header') || document.querySelector('header.site-header');
  if (headerEl) {
    headerEl.innerHTML = buildHeader(slug);
    setupAuthDropdown();
    setupAccountDropdown();
  }

  if (cfg.footer !== false) {
    var footerEl = document.getElementById('site-footer') || document.querySelector('footer.site-footer');
    if (footerEl) {
      footerEl.innerHTML = buildFooter();
    }
  }
})();
