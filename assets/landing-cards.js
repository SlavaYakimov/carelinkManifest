(function () {
  var root = document.getElementById('landing-card-drawer');
  var store = document.getElementById('landing-card-store');
  if (!root || !store) return;

  var overlay = document.getElementById('landing-card-drawer-overlay');
  var panel = document.getElementById('landing-card-drawer-panel');
  var kickerEl = document.getElementById('landing-card-drawer-kicker');
  var titleEl = document.getElementById('landing-card-drawer-title');
  var bodyEl = document.getElementById('landing-card-drawer-body');
  var btnClose = document.getElementById('landing-card-drawer-close');
  var lastFocus = null;
  var focusables = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function isOpen() {
    return root.classList.contains('is-open');
  }

  function lockScroll(on) {
    document.body.classList.toggle('dialog-open', on);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !isOpen()) return;
    var scope = panel;
    var nodes = [].slice.call(scope.querySelectorAll(focusables)).filter(function (el) {
      return !el.disabled && el.offsetParent !== null && !el.hasAttribute('hidden');
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

  function onEscape(e) {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      closeDrawer();
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
    if (!isOpen()) {
      lastFocus = document.activeElement;
      root.hidden = false;
      root.setAttribute('aria-hidden', 'false');
      lockScroll(true);
      document.addEventListener('keydown', trapFocus);
      document.addEventListener('keydown', onEscape);
      bodyEl.classList.remove('is-swapping');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.add('is-open');
          btnClose.focus();
        });
      });
    } else {
      bodyEl.classList.add('is-swapping');
      requestAnimationFrame(function () {
        bodyEl.classList.remove('is-swapping');
      });
    }
  }

  function clearHash() {
    if (location.hash.match(/^#card-/)) history.pushState(null, '', location.pathname + location.search);
  }

  function closeDrawer() {
    if (!isOpen()) return;
    root.classList.remove('is-open');
    document.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', onEscape);
    lockScroll(false);
    clearHash();
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      root.hidden = true;
      root.setAttribute('aria-hidden', 'true');
      if (lastFocus && typeof lastFocus.focus === 'function') {
        try { lastFocus.focus(); } catch (err) { /* ignore */ }
        lastFocus = null;
      }
    };
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      finish();
      return;
    }
    var sheet = root.querySelector('.landing-drawer-sheet');
    var onEnd = function (ev) {
      if (ev.target !== sheet || ev.propertyName !== 'transform') return;
      sheet.removeEventListener('transitionend', onEnd);
      finish();
    };
    sheet.addEventListener('transitionend', onEnd);
    window.setTimeout(finish, 380);
  }

  overlay.addEventListener('click', closeDrawer);
  btnClose.addEventListener('click', closeDrawer);

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-landing-card]');
    if (!trigger) return;
    if (trigger.tagName === 'A') e.preventDefault();
    openCard(trigger.getAttribute('data-landing-card'));
  });

  addEventListener('hashchange', function () {
    var m = (location.hash || '').match(/^#card-([a-z0-9-]+)$/i);
    if (m) openCard(m[1], false);
    else if (isOpen() && !location.hash.match(/^#glava-/)) closeDrawer();
  });

  var initial = (location.hash || '').match(/^#card-([a-z0-9-]+)$/i);
  if (initial) openCard(initial[1], false);
})();
