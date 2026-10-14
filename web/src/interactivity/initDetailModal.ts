// @ts-nocheck
export function initDetailModal() {
  var dialog = document.getElementById('detail-dialog');
  var store = document.getElementById('landing-card-store');
  if (!dialog || !store || typeof dialog.showModal !== 'function') return;

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function motionOk() {
    return !mqReduce.matches;
  }

  var kickerEl = document.getElementById('detail-dialog-kicker');
  var titleEl = document.getElementById('detail-dialog-title');
  var bodyEl = document.getElementById('detail-dialog-body');
  var btnClose = dialog.querySelector('.detail-dialog-close');
  var lastFocus = null;
  var focusables = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function lockScroll(on) {
    document.body.classList.toggle('dialog-open', on);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !dialog.open) return;
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

  function openDetail(id) {
    var src = store.querySelector('#' + CSS.escape(id));
    if (!src) return;
    kickerEl.textContent = src.getAttribute('data-kicker') || '';
    titleEl.textContent = src.getAttribute('data-title') || '';
    var inner = src.querySelector('.landing-card-modal-body');
    bodyEl.innerHTML = inner ? inner.innerHTML : '';
    lastFocus = document.activeElement;
    if (!dialog.open) {
      if (!motionOk()) {
        dialog.classList.add('detail-dialog--instant');
      } else {
        dialog.classList.remove('detail-dialog--instant');
      }
      dialog.showModal();
      lockScroll(true);
      dialog.addEventListener('keydown', trapFocus);
    }
    if (motionOk()) {
      btnClose.focus();
    }
  }

  function onDialogClosed() {
    lockScroll(false);
    dialog.removeEventListener('keydown', trapFocus);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try {
        lastFocus.focus();
      } catch {
        /* ignore */
      }
      lastFocus = null;
    }
  }

  function closeDetail() {
    if (!dialog.open) return;
    dialog.close();
  }

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeDetail();
  });
  dialog.addEventListener('close', onDialogClosed);
  btnClose.addEventListener('click', closeDetail);
  dialog.addEventListener('cancel', function (e) {
    e.preventDefault();
    closeDetail();
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-detail-open]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    openDetail(btn.getAttribute('data-detail-open'));
  });
}
