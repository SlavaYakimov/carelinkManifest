(function () {
  var dialog = document.getElementById('landing-card-dialog');
  var store = document.getElementById('landing-card-store');
  if (!dialog || !store || typeof dialog.showModal !== 'function') return;

  var kickerEl = document.getElementById('landing-card-dialog-kicker');
  var titleEl = document.getElementById('landing-card-dialog-title');
  var bodyEl = document.getElementById('landing-card-dialog-body');
  var btnClose = dialog.querySelector('.chapter-dialog-close');
  var lastFocus = null;
  var focusables = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function lockScroll(on) {
    document.body.classList.toggle('dialog-open', on);
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

  function openCard(id, push) {
    var src = store.querySelector('#' + CSS.escape(id));
    if (!src) return;
    kickerEl.textContent = src.getAttribute('data-kicker') || '';
    titleEl.textContent = src.getAttribute('data-title') || '';
    var inner = src.querySelector('.landing-card-modal-body');
    bodyEl.innerHTML = inner ? inner.innerHTML : '';
    if (push !== false) {
      var hash = '#card-' + id;
      if (location.hash !== hash) history.pushState(null, '', hash);
    }
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
      lockScroll(true);
      dialog.addEventListener('keydown', trapFocus);
    }
    dialog.classList.add('is-visible');
    btnClose.focus();
  }

  function clearHash() {
    if (location.hash.match(/^#card-/)) history.pushState(null, '', location.pathname + location.search);
  }

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', function () {
    lockScroll(false);
    dialog.removeEventListener('keydown', trapFocus);
    dialog.classList.remove('is-visible');
    clearHash();
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (err) { /* ignore */ }
      lastFocus = null;
    }
  });
  btnClose.addEventListener('click', function () { dialog.close(); });

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-landing-card]');
    if (!trigger) return;
    if (trigger.tagName === 'A') e.preventDefault();
    openCard(trigger.getAttribute('data-landing-card'));
  });

  addEventListener('hashchange', function () {
    var m = (location.hash || '').match(/^#card-([a-z0-9-]+)$/i);
    if (m) openCard(m[1], false);
    else if (dialog.open && !location.hash.match(/^#glava-/)) dialog.close();
  });

  var initial = (location.hash || '').match(/^#card-([a-z0-9-]+)$/i);
  if (initial) openCard(initial[1], false);
})();
