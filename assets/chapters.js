(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var dialog = document.getElementById('chapter-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var bodyEl = document.getElementById('chapter-dialog-body');
  var titleEl = document.getElementById('chapter-dialog-title');
  var kickerEl = document.getElementById('chapter-dialog-kicker');
  var btnClose = dialog.querySelector('.chapter-dialog-close');
  var btnPrev = document.getElementById('chapter-prev');
  var btnNext = document.getElementById('chapter-next');
  var total = document.querySelectorAll('.read-chapters .chapter').length;
  var current = null;
  var focusables = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

  function fillDialog(n) {
    var src = document.getElementById('glava-' + n);
    if (!src) return false;
    var h2 = src.querySelector('.ch-h h2');
    titleEl.textContent = h2 ? h2.textContent : '';
    kickerEl.textContent = 'Глава ' + String(n).padStart(2, '0') + ' / ' + total;
    bodyEl.innerHTML = src.innerHTML;
    var head = bodyEl.querySelector('.ch-h');
    if (head) head.remove();
    btnPrev.disabled = n <= 1;
    btnNext.disabled = n >= total;
    current = n;
    return true;
  }

  function openChapter(n, push) {
    if (!fillDialog(n)) return;
    if (push !== false) setHash(n);
    if (!dialog.open) {
      dialog.showModal();
      lockScroll(true);
      dialog.addEventListener('keydown', trapFocus);
    }
    dialog.classList.add('is-visible');
    btnClose.focus();
  }

  function closeDialog() {
    if (!dialog.open) return;
    dialog.classList.remove('is-visible');
    dialog.close();
    lockScroll(false);
    dialog.removeEventListener('keydown', trapFocus);
    clearHash();
    current = null;
  }

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', function () {
    lockScroll(false);
    dialog.removeEventListener('keydown', trapFocus);
    dialog.classList.remove('is-visible');
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
