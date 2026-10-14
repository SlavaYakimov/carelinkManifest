(function () {
  var mqMobile = window.matchMedia('(max-width: 760px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Hero chips */
  var tabRoot = document.querySelector('[data-hero-tabs]');
  if (tabRoot) {
    var tabs = [].slice.call(tabRoot.querySelectorAll('[data-hero-tab]'));
    var stand = document.querySelector('[data-hero-standfirst]');
    function selectTab(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (stand && tab) {
        var text = tab.getAttribute('data-hero-text') || '';
        stand.textContent = text;
      }
    }
    tabs.forEach(function (tab) {
      tab.setAttribute('aria-controls', 'hero-tab-panel');
      tab.addEventListener('click', function () { selectTab(tab); });
    });
    tabRoot.addEventListener('keydown', function (e) {
      var idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      var next = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  }

  /* Bundle scroll (Figma Make parity) */
  var bundleScroll = document.querySelector('.bundle-scroll');
  var bundleViewport = document.querySelector('[data-bundle-viewport]');
  var bundleTrack = document.querySelector('[data-bundle-track]');
  if (bundleScroll && bundleViewport && bundleTrack) {
    var cards = [].slice.call(bundleTrack.querySelectorAll('.bundle-card'));
    var total = Math.max(cards.length || 9, 1);
    var index = 0;
    var frac = 0;
    var dragPointerId = null;
    var progressEl = document.querySelector('[data-bundle-progress]');
    var prevBtn = document.querySelector('[data-bundle-prev]');
    var nextBtn = document.querySelector('[data-bundle-next]');
    var navItems = [].slice.call(document.querySelectorAll('[data-bundle-nav]'));
    var mobileCounter = document.querySelector('[data-bundle-mobile-counter]');
    var desktopCounter = document.querySelector('[data-bundle-desktop-counter]');
    var drag = { active: false, x: 0, scrollY: 0 };
    var raf = 0;

    function setActiveNav(i) {
      navItems.forEach(function (li) {
        var n = parseInt(li.getAttribute('data-bundle-nav'), 10);
        li.classList.toggle('is-active', n === i + 1);
      });
      cards.forEach(function (card, ci) {
        var on = ci === i;
        card.tabIndex = on ? 0 : -1;
        if (on) {
          card.setAttribute('aria-hidden', 'false');
        } else {
          card.setAttribute('aria-hidden', 'true');
        }
      });
      if (mobileCounter) {
        mobileCounter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
      }
      if (desktopCounter) {
        var spans = desktopCounter.querySelectorAll('span');
        if (spans[0]) spans[0].textContent = String(i + 1).padStart(2, '0');
      }
      bundleScroll.setAttribute('data-bundle-active', String(i + 1));
      if (!mqMobile.matches) {
        var activeLi = navItems.filter(function (li) {
          return parseInt(li.getAttribute('data-bundle-nav'), 10) === i + 1;
        })[0];
        if (activeLi && typeof activeLi.scrollIntoView === 'function') {
          activeLi.scrollIntoView({
            block: 'nearest',
            behavior: mqReduce.matches ? 'auto' : 'smooth',
          });
        }
      }
    }

    function applyTransform() {
      var maxX = Math.max(bundleTrack.scrollWidth - bundleViewport.clientWidth, 1);
      if (!mqReduce.matches) {
        bundleTrack.style.willChange = 'transform';
      } else {
        bundleTrack.style.willChange = 'auto';
      }
      bundleTrack.style.transform = 'translate3d(' + (-frac * maxX) + 'px,0,0)';
      if (progressEl) progressEl.style.width = (frac * 100) + '%';
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= total - 1;
      setActiveNav(index);
    }

    function syncFromScroll() {
      var rect = bundleScroll.getBoundingClientRect();
      var scrollRange = Math.max(bundleScroll.offsetHeight - window.innerHeight, 1);
      var f = Math.min(Math.max(-rect.top / scrollRange, 0), 1);
      if (mqMobile.matches) {
        var card = cards[0];
        var step = card ? card.offsetWidth + 12 : bundleViewport.clientWidth * 0.88;
        index = Math.min(Math.max(Math.round(bundleViewport.scrollLeft / step), 0), total - 1);
        frac = Math.min(Math.max(bundleViewport.scrollLeft / Math.max(bundleTrack.scrollWidth - bundleViewport.clientWidth, 1), 0), 1);
      } else {
        index = Math.round(f * (total - 1));
        frac = f;
      }
      applyTransform();
    }

    function goTo(i, smooth) {
      index = Math.max(0, Math.min(total - 1, i));
      var behavior = mqReduce.matches || smooth === false ? 'auto' : 'smooth';
      if (mqMobile.matches) {
        var card = cards[index];
        if (card) bundleViewport.scrollTo({ left: card.offsetLeft, behavior: behavior });
        return;
      }
      var top = window.scrollY + bundleScroll.getBoundingClientRect().top;
      var scrollRange = Math.max(bundleScroll.offsetHeight - window.innerHeight, 1);
      var denom = Math.max(total - 1, 1);
      window.scrollTo({ top: top + (index / denom) * scrollRange, behavior: behavior });
    }

    function onScrollTick() {
      raf = 0;
      syncFromScroll();
    }

    function schedule() {
      if (!raf) raf = window.requestAnimationFrame(onScrollTick);
    }

    bundleViewport.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    if (!mqReduce.matches) {
      bundleScroll.addEventListener('wheel', function (e) {
        if (mqMobile.matches) return;
        if (Math.abs(e.deltaX) < 1 && !e.shiftKey) return;
        e.preventDefault();
        window.scrollBy({ top: Math.abs(e.deltaX) >= 1 ? e.deltaX : e.deltaY });
      }, { passive: false });
    }

    function clearDrag() {
      drag.active = false;
      dragPointerId = null;
    }

    bundleViewport.addEventListener('pointerdown', function (e) {
      if (mqReduce.matches || mqMobile.matches || e.target.closest('button')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag.active = true;
      dragPointerId = e.pointerId;
      drag.x = e.clientX;
      drag.scrollY = window.scrollY;
      try {
        bundleViewport.setPointerCapture(e.pointerId);
      } catch (err) {
        clearDrag();
      }
    });
    bundleViewport.addEventListener('pointermove', function (e) {
      if (!drag.active || e.pointerId !== dragPointerId) return;
      var maxX = Math.max(bundleTrack.scrollWidth - bundleViewport.clientWidth, 1);
      var scrollRange = Math.max(bundleScroll.offsetHeight - window.innerHeight, 1);
      var dx = e.clientX - drag.x;
      window.scrollTo({ top: drag.scrollY - (dx / maxX) * scrollRange });
    });
    function endDrag(e) {
      if (dragPointerId != null && e.pointerId !== dragPointerId) return;
      if (bundleViewport.hasPointerCapture(e.pointerId)) {
        try {
          bundleViewport.releasePointerCapture(e.pointerId);
        } catch (err) { /* ignore */ }
      }
      clearDrag();
    }
    bundleViewport.addEventListener('pointerup', endDrag);
    bundleViewport.addEventListener('pointercancel', endDrag);
    bundleViewport.addEventListener('lostpointercapture', clearDrag);
    window.addEventListener('blur', clearDrag);

    function navToBundle(i) {
      var n = parseInt(i, 10);
      if (isNaN(n)) return;
      goTo(n - 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () { goTo(index - 1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { goTo(index + 1); });
    }
    navItems.forEach(function (li) {
      li.addEventListener('click', function (e) {
        if (e.target.closest('button[data-bundle-focus]')) return;
        navToBundle(li.getAttribute('data-bundle-nav'));
      });
    });
    [].slice.call(document.querySelectorAll('[data-bundle-focus]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        navToBundle(btn.getAttribute('data-bundle-focus'));
      });
    });

    var navOl = document.querySelector('ol[data-bundle-nav]');
    if (navOl) {
      navOl.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
        var next = index;
        if (e.key === 'ArrowDown') next = Math.min(index + 1, total - 1);
        else if (e.key === 'ArrowUp') next = Math.max(index - 1, 0);
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = total - 1;
        if (next === index) return;
        e.preventDefault();
        goTo(next);
        var li = navItems.filter(function (el) {
          return parseInt(el.getAttribute('data-bundle-nav'), 10) === next + 1;
        })[0];
        var focusBtn = li && li.querySelector('button[data-bundle-focus]');
        if (focusBtn) focusBtn.focus();
      });
    }

    bundleScroll.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (!bundleScroll.contains(document.activeElement)) return;
      e.preventDefault();
      goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
    });

    if (mobileCounter) {
      mobileCounter.setAttribute('role', 'status');
      mobileCounter.setAttribute('aria-live', 'polite');
      mobileCounter.setAttribute('aria-atomic', 'true');
    }
    if (desktopCounter) {
      desktopCounter.setAttribute('role', 'status');
      desktopCounter.setAttribute('aria-live', 'polite');
      desktopCounter.setAttribute('aria-atomic', 'true');
    }

    mqMobile.addEventListener('change', schedule);
    mqReduce.addEventListener('change', schedule);

    syncFromScroll();
  }

  /* Chapters vertical sets */
  var chaptersScroll = document.querySelector('.chapters-scroll');
  var chaptersSets = document.querySelector('[data-chapters-sets]');
  if (chaptersScroll && chaptersSets) {
    var setCount = parseInt(getComputedStyle(chaptersScroll).getPropertyValue('--chapter-sets'), 10) || 5;
    var navBtns = [].slice.call(document.querySelectorAll('[data-chapter-goto]'));
    var mobileRange = document.querySelector('[data-chapters-mobile-range]');
    var mobileTitle = document.querySelector('[data-chapters-mobile-title]');
    var desktopRange = document.querySelector('[data-chapters-desktop-range]');
    var perSet = 4;
    var rafC = 0;
    var progress = 0;

    function chapterTitles() {
      return navBtns.map(function (b) {
        var strong = b.querySelector('strong');
        return strong ? strong.textContent : '';
      });
    }
    var titles = chapterTitles();

    var focusedChapter = 0;

    function updateNav(setIdx, focusIdx) {
      var start = setIdx * perSet;
      if (focusIdx == null) {
        focusIdx = focusedChapter;
      }
      if (focusIdx < start || focusIdx >= start + perSet) {
        focusIdx = start;
      }
      focusedChapter = focusIdx;
      navBtns.forEach(function (btn, ti) {
        var li = btn.closest('li');
        var inSet = ti >= start && ti < start + perSet;
        var active = ti === focusIdx;
        if (li) {
          li.classList.toggle('is-active', active);
          li.classList.toggle('is-in-set', inSet && !active);
        }
      });
      var sets = chaptersSets.querySelectorAll('.chapters-set');
      sets.forEach(function (setEl, si) {
        var inActiveSet = si === setIdx;
        setEl.setAttribute('aria-hidden', inActiveSet ? 'false' : 'true');
        if (typeof setEl.inert !== 'undefined') {
          setEl.inert = !inActiveSet;
        }
        setEl.querySelectorAll('.chapter-card').forEach(function (card) {
          if (!inActiveSet) {
            card.tabIndex = -1;
            card.removeAttribute('role');
            card.setAttribute('aria-hidden', 'true');
            return;
          }
          var r = card.getBoundingClientRect();
          var tappable = !mqMobile.matches || (r.height >= 44 && r.width >= 44);
          if (tappable) {
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.removeAttribute('aria-hidden');
          } else {
            card.tabIndex = -1;
            card.removeAttribute('role');
            card.setAttribute('aria-hidden', 'true');
          }
        });
      });
      var from = start + 1;
      var to = Math.min(start + perSet, titles.length);
      var range = String(from).padStart(2, '0') + '–' + String(to).padStart(2, '0');
      if (mobileRange) mobileRange.textContent = range + ' / 20';
      if (desktopRange) {
        var spans = desktopRange.querySelectorAll('span');
        if (spans[0]) spans[0].textContent = range;
      }
      if (mobileTitle && titles[start]) mobileTitle.textContent = titles[start];
    }

    function syncChapters() {
      var rect = chaptersScroll.getBoundingClientRect();
      var scrollRange = Math.max(chaptersScroll.offsetHeight - window.innerHeight, 1);
      var p = Math.min(Math.max(-rect.top / scrollRange, 0), 1);
      var raw = p * (setCount - 1);
      progress = mqReduce.matches ? Math.round(raw) : raw;
      chaptersSets.style.setProperty('--chapters-progress', String(progress));
      var setIdx = Math.floor(progress + 0.0001);
      if (focusedChapter < setIdx * perSet || focusedChapter >= (setIdx + 1) * perSet) {
        focusedChapter = setIdx * perSet;
      }
      updateNav(setIdx, focusedChapter);
    }

    function goChapter(chNum) {
      var i = chNum - 1;
      var setIdx = Math.floor(i / perSet);
      var top = window.scrollY + chaptersScroll.getBoundingClientRect().top;
      var scrollRange = Math.max(chaptersScroll.offsetHeight - window.innerHeight, 1);
      var behavior = mqReduce.matches ? 'auto' : 'smooth';
      window.scrollTo({
        top: top + (setIdx / Math.max(setCount - 1, 1)) * scrollRange,
        behavior: behavior,
      });
    }

    function scheduleC() {
      if (!rafC) rafC = window.requestAnimationFrame(function () { rafC = 0; syncChapters(); });
    }

    window.addEventListener('scroll', scheduleC, { passive: true });
    window.addEventListener('resize', scheduleC);
    navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ch = parseInt(btn.getAttribute('data-chapter-goto'), 10);
        if (isNaN(ch)) return;
        focusedChapter = ch - 1;
        goChapter(ch);
      });
    });

    var chaptersNav = document.querySelector('.chapters-panel nav');
    if (chaptersNav) {
      chaptersNav.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
        var idx = navBtns.indexOf(document.activeElement);
        if (idx < 0) return;
        var next = idx;
        if (e.key === 'ArrowDown') next = Math.min(idx + 1, navBtns.length - 1);
        else if (e.key === 'ArrowUp') next = Math.max(idx - 1, 0);
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = navBtns.length - 1;
        if (next === idx) return;
        e.preventDefault();
        var ch = parseInt(navBtns[next].getAttribute('data-chapter-goto'), 10);
        if (isNaN(ch)) return;
        focusedChapter = ch - 1;
        navBtns[next].focus();
        goChapter(ch);
      });
    }

    if (mobileRange) {
      mobileRange.setAttribute('role', 'status');
      mobileRange.setAttribute('aria-live', 'polite');
      mobileRange.setAttribute('aria-atomic', 'true');
    }
    if (desktopRange) {
      desktopRange.setAttribute('role', 'status');
      desktopRange.setAttribute('aria-live', 'polite');
      desktopRange.setAttribute('aria-atomic', 'true');
    }

    mqMobile.addEventListener('change', scheduleC);
    mqReduce.addEventListener('change', scheduleC);

    syncChapters();
  }
})();
