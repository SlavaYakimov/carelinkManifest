(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var dialog = document.getElementById('chapter-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var titleEl = document.getElementById('chapter-dialog-title');
  var kickerEl = document.getElementById('chapter-dialog-kicker');
  var btnClose = dialog.querySelector('.chapter-dialog-close');
  var btnPrev = document.getElementById('chapter-prev');
  var btnNext = document.getElementById('chapter-next');
  var panelStructure = document.getElementById('chapter-panel-structure');
  var panelSource = document.getElementById('chapter-panel-source');
  var tabStructure = document.getElementById('chapter-tab-structure');
  var tabSource = document.getElementById('chapter-tab-source');
  var tabs = [tabStructure, tabSource];
  var total = document.querySelectorAll('.read-chapters .chapter').length;
  var current = null;
  var lastFocus = null;
  var focusables = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  var DEFAULT_VERSION = '3';

  function chapterFromHash() {
    var m = (location.hash || '').match(/^#glava-(\d{1,2})$/);
    return m ? parseInt(m[1], 10) : null;
  }

  function setHash(n) {
    var next = '#glava-' + n;
    if (location.hash !== next) history.pushState(null, '', next);
  }

  function clearHash() {
    if (location.hash.match(/^#glava-/)) history.pushState(null, '', location.pathname + location.search);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var nodes = [].slice.call(dialog.querySelectorAll(focusables)).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function lockScroll(on) {
    document.body.classList.toggle('dialog-open', on);
  }

  function selectTab(idx) {
    tabs.forEach(function (tab, i) {
      var on = i === idx;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });
    panelStructure.hidden = idx !== 0;
    panelSource.hidden = idx !== 1;
    panelStructure.classList.toggle('is-active', idx === 0);
    panelSource.classList.toggle('is-active', idx === 1);
  }

  function onTabKeydown(e, idx) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectTab((idx + 1) % tabs.length);
      tabs[(idx + 1) % tabs.length].focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectTab((idx + tabs.length - 1) % tabs.length);
      tabs[(idx + tabs.length - 1) % tabs.length].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectTab(0);
      tabStructure.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      selectTab(tabs.length - 1);
      tabSource.focus();
    }
  }

  tabStructure.addEventListener('click', function () { selectTab(0); });
  tabSource.addEventListener('click', function () { selectTab(1); });
  tabStructure.addEventListener('keydown', function (e) { onTabKeydown(e, 0); });
  tabSource.addEventListener('keydown', function (e) { onTabKeydown(e, 1); });

  function selectVersionTab(wrapper, vnum) {
    var vtabs = [].slice.call(wrapper.querySelectorAll('[data-version-tab]'));
    var vpanels = [].slice.call(wrapper.querySelectorAll('[data-version-panel]'));
    var id = String(vnum);
    vtabs.forEach(function (tab) {
      var on = tab.getAttribute('data-version-tab') === id;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });
    vpanels.forEach(function (pan) {
      if (pan.getAttribute('data-version-panel') === id) pan.removeAttribute('hidden');
      else pan.setAttribute('hidden', '');
    });
  }

  function initVersionTabs(container) {
    var wrapper = container.querySelector('[data-chapter-versions]');
    if (!wrapper) return;
    wrapper.removeAttribute('hidden');
    selectVersionTab(wrapper, DEFAULT_VERSION);
  }

  function onVersionTabKeydown(e, wrapper) {
    var btn = e.target.closest('[data-version-tab]');
    if (!btn || !wrapper.contains(btn)) return;
    var vtabs = [].slice.call(wrapper.querySelectorAll('[data-version-tab]'));
    var idx = vtabs.indexOf(btn);
    if (idx < 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      var next = vtabs[(idx + 1) % vtabs.length];
      selectVersionTab(wrapper, next.getAttribute('data-version-tab'));
      next.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      var prev = vtabs[(idx + vtabs.length - 1) % vtabs.length];
      selectVersionTab(wrapper, prev.getAttribute('data-version-tab'));
      prev.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectVersionTab(wrapper, vtabs[0].getAttribute('data-version-tab'));
      vtabs[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      var last = vtabs[vtabs.length - 1];
      selectVersionTab(wrapper, last.getAttribute('data-version-tab'));
      last.focus();
    }
  }

  panelStructure.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-version-tab]');
    if (!btn) return;
    var wrapper = btn.closest('[data-chapter-versions]');
    if (!wrapper || !panelStructure.contains(wrapper)) return;
    selectVersionTab(wrapper, btn.getAttribute('data-version-tab'));
  });

  panelStructure.addEventListener('keydown', function (e) {
    var btn = e.target.closest('[data-version-tab]');
    if (!btn) return;
    var wrapper = btn.closest('[data-chapter-versions]');
    if (!wrapper) return;
    onVersionTabKeydown(e, wrapper);
  });

  function fillDialog(n) {
    var src = document.getElementById('glava-' + n);
    if (!src) return false;
    var h2 = src.querySelector('.ch-h h2');
    titleEl.textContent = h2 ? h2.textContent : '';
    kickerEl.textContent = 'Глава ' + String(n).padStart(2, '0') + ' / ' + total;
    var sourcePane = src.querySelector('.chapter-pane-source');
    var structPane = src.querySelector('.chapter-pane-structure');
    panelSource.innerHTML = sourcePane ? sourcePane.innerHTML : '';
    panelStructure.innerHTML = structPane ? structPane.innerHTML : '';
    initVersionTabs(panelStructure);
    selectTab(0);
    btnPrev.disabled = n <= 1;
    btnNext.disabled = n >= total;
    current = n;
    return true;
  }

  function openChapter(n, push) {
    if (!fillDialog(n)) return;
    if (push !== false) setHash(n);
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
      lockScroll(true);
      dialog.addEventListener('keydown', trapFocus);
    }
    dialog.classList.add('is-visible');
    var verTab = panelStructure.querySelector('[data-version-tab="' + DEFAULT_VERSION + '"]');
    if (verTab && !panelStructure.hidden) verTab.focus();
    else tabStructure.focus();
  }

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', function () {
    lockScroll(false);
    dialog.removeEventListener('keydown', trapFocus);
    dialog.classList.remove('is-visible');
    clearHash();
    current = null;
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (err) { /* ignore */ }
      lastFocus = null;
    }
  });
  btnClose.addEventListener('click', function () { dialog.close(); });
  btnPrev.addEventListener('click', function () { if (current > 1) openChapter(current - 1); });
  btnNext.addEventListener('click', function () { if (current < total) openChapter(current + 1); });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#glava-"], a[data-chapter]');
    if (!link) return;
    var n = link.getAttribute('data-chapter');
    if (!n) {
      var hm = (link.getAttribute('href') || '').match(/^#glava-(\d+)/);
      n = hm ? hm[1] : null;
    }
    if (!n) return;
    e.preventDefault();
    openChapter(parseInt(n, 10));
  });

  addEventListener('hashchange', function () {
    var n = chapterFromHash();
    if (n) openChapter(n, false);
    else if (dialog.open) dialog.close();
  });

  var initial = chapterFromHash();
  if (initial) openChapter(initial, false);
})();
