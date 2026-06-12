/* Pokoland UI v0.2 — 可选交互(零依赖)
   提供:toast()/openDialog()/closeDialog()/Tabs 自动初始化/轻量 i18n
   i18n 词典由页面在加载本脚本前定义:window.POKOLAND_I18N = { key: [zh, en, ja] }
   注意:data-i18n-html 对应的词典值以 innerHTML 渲染,务必为可信静态字符串,不可含用户输入。 */
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
    const ico = document.createElement('span');
    ico.className = 'ico';
    ico.innerHTML = '<svg class="pi" aria-hidden="true"><use href="#pi-' + icon + '"/></svg>';
    el.appendChild(ico);
    el.appendChild(document.createTextNode(msg));
    zone.appendChild(el);
    setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 320); }, 2600);
  }

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 隐私模式静默 */ } }

  var LANGS = ['zh', 'en', 'ja'];
  var DICT = window.POKOLAND_I18N || {};
  var cur = 'zh';
  function detect() {
    var url = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(url) >= 0) return url;
    var saved = lsGet('pokoland-lang');
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'zh').toLowerCase();
    return nav.indexOf('ja') === 0 ? 'ja' : nav.indexOf('en') === 0 ? 'en' : 'zh';
  }
  function T(k) { var e = DICT[k]; return e ? e[LANGS.indexOf(cur)] : k; }
  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    cur = lang;
    lsSet('pokoland-lang', lang);
    document.documentElement.lang = { zh: 'zh-CN', en: 'en', ja: 'ja' }[lang];
    if (DICT.title) document.title = T('title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
    document.querySelectorAll('.lang-switch button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }

  function initToTop() {
    var btn = document.querySelector('.to-top');
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle('show', window.scrollY > 400); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* 点击粒子:落叶 / 水花 */
  function burst(target, type) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var rect = target.getBoundingClientRect();
    var zone = document.createElement('div');
    zone.className = 'burst-zone';
    zone.setAttribute('aria-hidden', 'true');
    zone.style.left = rect.left + rect.width / 2 + 'px';
    zone.style.top = (type === 'splash' ? rect.top + 4 : rect.top + rect.height / 2) + 'px';
    document.body.appendChild(zone);
    var n = type === 'splash' ? 10 : 7;
    var colors = type === 'splash'
      ? ['#6EC9EA', '#93D8F1', '#BDE8F7']
      : ['#8FD178', '#5FAE52', '#A9DC8E', '#C6E162'];
    var icon = type === 'splash' ? 'drop' : 'leaf';
    for (var i = 0; i < n; i++) {
      var pt = document.createElement('span');
      pt.className = 'burst-pt ' + type;
      var size = Math.round(10 + Math.random() * 9);
      pt.style.color = colors[i % colors.length];
      pt.style.setProperty('--dx', ((Math.random() - .5) * (type === 'splash' ? 150 : 130)).toFixed(0) + 'px');
      if (type === 'splash') {
        pt.style.setProperty('--h', (-(50 + Math.random() * 70)).toFixed(0) + 'px');
        pt.style.setProperty('--dy', (30 + Math.random() * 30).toFixed(0) + 'px');
      } else {
        pt.style.setProperty('--dy', (70 + Math.random() * 70).toFixed(0) + 'px');
        pt.style.setProperty('--rot', ((Math.random() - .5) * 540).toFixed(0) + 'deg');
      }
      pt.style.animationDuration = (type === 'splash' ? .6 + Math.random() * .3 : .9 + Math.random() * .6).toFixed(2) + 's';
      pt.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
      pt.innerHTML = '<svg style="width:' + size + 'px;height:' + size + 'px;display:block" aria-hidden="true"><use href="#pi-' + icon + '"/></svg>';
      zone.appendChild(pt);
    }
    setTimeout(function () { zone.remove(); }, 1800);
  }

  function initBurst() {
    document.querySelectorAll('[data-burst]').forEach(function (el) {
      el.addEventListener('click', function () { burst(el, el.dataset.burst); });
    });
  }

  function init() {
    initTabs();
    initToTop();
    initBurst();
    document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', function () { applyLang(b.dataset.lang); }));
    if (Object.keys(DICT).length) { cur = detect(); applyLang(cur); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.toast = toast;
  window.burst = burst;
  window.openDialog = openDialog;
  window.closeDialog = closeDialog;
  window.T = T;
  window.applyLang = applyLang;
})();
