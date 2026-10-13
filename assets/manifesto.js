(function () {
  /* Hero tabs */
  var tabRoot = document.querySelector('[data-hero-tabs]');
  if (tabRoot) {
    var tabs = [].slice.call(tabRoot.querySelectorAll('[role=tab]'));
    var panels = [].slice.call(tabRoot.querySelectorAll('[role=tabpanel]'));
    function selectTab(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        p.hidden = p.id !== tab.getAttribute('aria-controls');
      });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(tabs[(i + 1) % tabs.length]); tabs[(i + 1) % tabs.length].focus(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab(tabs[(i - 1 + tabs.length) % tabs.length]); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
      });
    });
  }

  /* Agenda horizontal scroll-jack */
  var pin = document.querySelector('[data-agenda-stage]');
  var track = document.querySelector('[data-agenda-track]');
  var spacer = document.querySelector('[data-agenda-steps]');
  if (pin && track && spacer) {
    var bundles = [].slice.call(track.querySelectorAll('.agenda-bundle'));
    var total = bundles.length || 9;
    var index = 0;
    var progress = document.querySelector('[data-agenda-progress]');
    var counter = document.querySelector('[data-agenda-counter]');
    var navLines = [].slice.call(document.querySelectorAll('[data-agenda-goto]'));

    function bundleWidth() {
      var b = bundles[0];
      return b ? b.getBoundingClientRect().width : track.clientWidth / 2.5;
    }

    function applyIndex(i, animate) {
      index = Math.max(0, Math.min(total - 1, i));
      var x = -index * bundleWidth();
      track.style.transition = animate === false ? 'none' : '';
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
      if (progress) progress.style.width = ((index + 1) / total * 100) + '%';
      if (counter) counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
      navLines.forEach(function (btn) {
        btn.classList.toggle('is-active', parseInt(btn.getAttribute('data-agenda-goto'), 10) === index + 1);
      });
    }

    navLines.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyIndex(parseInt(btn.getAttribute('data-agenda-goto'), 10) - 1);
        scrollToStep(index);
      });
    });

    var prevBtn = document.querySelector('[data-agenda-prev]');
    var nextBtn = document.querySelector('[data-agenda-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { applyIndex(index - 1); scrollToStep(index); });
    if (nextBtn) nextBtn.addEventListener('click', function () { applyIndex(index + 1); scrollToStep(index); });

    function scrollToStep(step) {
      var rect = spacer.getBoundingClientRect();
      var top = window.scrollY + rect.top;
      var stepH = window.innerHeight;
      window.scrollTo({ top: top + step * stepH, behavior: 'smooth' });
    }

    function onScroll() {
      var rect = spacer.getBoundingClientRect();
      var start = window.scrollY + rect.top;
      var end = start + spacer.offsetHeight - window.innerHeight;
      if (window.scrollY < start) { applyIndex(0, false); return; }
      if (window.scrollY > end) { applyIndex(total - 1, false); return; }
      var step = Math.round((window.scrollY - start) / window.innerHeight);
      applyIndex(step, false);
    }

    var wheelLock = false;
    pin.addEventListener('wheel', function (e) {
      var rect = spacer.getBoundingClientRect();
      var inZone = window.scrollY >= rect.top + window.scrollY - 80 && window.scrollY <= rect.top + window.scrollY + rect.height - window.innerHeight + 80;
      if (!inZone) return;
      var delta = e.deltaY || e.deltaX;
      if (e.shiftKey && e.deltaY) delta = e.deltaY;
      if (Math.abs(delta) < 2) return;
      if ((index === 0 && delta < 0) || (index === total - 1 && delta > 0)) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      applyIndex(index + (delta > 0 ? 1 : -1));
      window.setTimeout(function () { wheelLock = false; }, 420);
    }, { passive: false });

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { applyIndex(index, false); });
    applyIndex(0, false);
  }

  /* Chapters 2×2 paging */
  var glavyGrid = document.querySelector('[data-glavy-grid]');
  var glavySpacer = document.querySelector('[data-glavy-steps]');
  if (glavyGrid && glavySpacer) {
    var posters = [].slice.call(glavyGrid.querySelectorAll('[data-chapter-poster]'));
    var perPage = 4;
    var pages = Math.ceil(posters.length / perPage) || 5;
    var navItems = [].slice.call(document.querySelectorAll('[data-glavy-goto]'));
    var pageIndex = 0;

    function showPage(p) {
      pageIndex = Math.max(0, Math.min(pages - 1, p));
      posters.forEach(function (el, i) {
        var page = Math.floor(i / perPage);
        el.style.display = page === pageIndex ? '' : 'none';
      });
      var start = pageIndex * perPage + 1;
      var end = Math.min(posters.length, start + perPage - 1);
      navItems.forEach(function (btn) {
        var n = parseInt(btn.getAttribute('data-glavy-goto'), 10);
        btn.classList.toggle('is-active', n >= start && n <= end);
      });
    }

    function onGlavyScroll() {
      var rect = glavySpacer.getBoundingClientRect();
      var start = window.scrollY + rect.top;
      if (window.scrollY < start) { showPage(0); return; }
      var step = Math.floor((window.scrollY - start) / window.innerHeight);
      showPage(step);
    }
    navItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var n = parseInt(btn.getAttribute('data-glavy-goto'), 10);
        showPage(Math.floor((n - 1) / perPage));
      });
    });
    addEventListener('scroll', onGlavyScroll, { passive: true });
    showPage(0);
  }
})();
