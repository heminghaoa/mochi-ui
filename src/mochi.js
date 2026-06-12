/* Mochi UI v0.2 — 可选交互(零依赖)
   提供:toast()/openDialog()/closeDialog()/Tabs 自动初始化/轻量 i18n
   i18n 词典由页面在加载本脚本前定义:window.MOCHI_I18N = { key: [zh, en, ja] } */
(function () {
  'use strict';

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
        document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(btn.dataset.tab);
        if (panel) panel.hidden = false;
      });
    });
  }

  function openDialog(id) { const el = document.getElementById(id || 'dlg'); if (el) el.classList.add('open'); }
  function closeDialog(id) { const el = document.getElementById(id || 'dlg'); if (el) el.classList.remove('open'); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDialog(); });

  function toast(type, icon, msg) {
    const zone = document.getElementById('toast-zone');
    if (!zone) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = '<span class="ico"><svg class="mi" aria-hidden="true"><use href="#mi-' + icon + '"/></svg></span>' + msg;
    zone.appendChild(el);
    setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 320); }, 2600);
  }

  var LANGS = ['zh', 'en', 'ja'];
  var DICT = window.MOCHI_I18N || {};
  var cur = 'zh';
  function detect() {
    var url = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(url) >= 0) return url;
    var saved = localStorage.getItem('mochi-lang');
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'zh').toLowerCase();
    return nav.indexOf('ja') === 0 ? 'ja' : nav.indexOf('en') === 0 ? 'en' : 'zh';
  }
  function T(k) { var e = DICT[k]; return e ? e[LANGS.indexOf(cur)] : k; }
  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    cur = lang;
    localStorage.setItem('mochi-lang', lang);
    document.documentElement.lang = { zh: 'zh-CN', en: 'en', ja: 'ja' }[lang];
    if (DICT.title) document.title = T('title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
    document.querySelectorAll('.lang-switch button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }

  function init() {
    initTabs();
    document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', function () { applyLang(b.dataset.lang); }));
    if (Object.keys(DICT).length) { cur = detect(); applyLang(cur); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.toast = toast;
  window.openDialog = openDialog;
  window.closeDialog = closeDialog;
  window.T = T;
  window.applyLang = applyLang;
})();
