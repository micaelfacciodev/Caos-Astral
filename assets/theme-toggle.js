/**
 * theme-toggle.js — Caos Astral
 * Modo claro/escuro. Claro = "céu de amanhecer" (ver ADENDO-CLAUDE.md),
 * não é inversão automática de cor — a paleta clara e a nebulosa clara
 * já estão definidas em assets/style.css sob [data-theme="light"].
 *
 * Uso: incluir este script o quanto antes no <head> ou logo após
 * <body>, ANTES de qualquer conteúdo visível, pra aplicar o tema salvo
 * sem flash de tema errado. Depende de um botão em qualquer lugar da
 * página com a marcação:
 *   <button type="button" class="theme-toggle" id="themeToggle" aria-label="Alternar modo claro/escuro">
 *     <svg class="icon-moon" ...>...</svg>
 *     <svg class="icon-sun" ...>...</svg>
 *   </button>
 * Estilos em assets/style.css, seção "THEME TOGGLE".
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'caosastral-theme';

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (e) { return null; } // localStorage pode falhar (modo privado restrito etc.)
  }

  function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Aplica imediatamente, antes do resto do parsing/render, pra não
  // piscar tema escuro e depois trocar pra claro (ou vice-versa).
  applyTheme(getPreferredTheme());

  function wireButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    function currentTheme() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    btn.setAttribute('aria-pressed', currentTheme() === 'light' ? 'true' : 'false');

    btn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      applyTheme(next);
      btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* silencioso, tema ainda funciona só sem persistir */ }
      // Avisa outros scripts da página (ex: space-bg.js) que o tema mudou,
      // sem acoplar diretamente a nenhum deles.
      document.dispatchEvent(new CustomEvent('caosastral:theme', { detail: { theme: next } }));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButton);
  } else {
    wireButton();
  }
})();
