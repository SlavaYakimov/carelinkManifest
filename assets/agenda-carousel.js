(function () {
  var root = document.querySelector('[data-agenda-carousel]');
  if (!root) return;
  var viewport = root.querySelector('[data-agenda-viewport]');
  if (!viewport) return;
  var track = viewport.querySelector('.agenda-carousel-track');
  var slides = [].slice.call(track.querySelectorAll('.agenda-carousel-slide'));
  var prevBtn = root.querySelector('[data-agenda-prev]');
  var nextBtn = root.querySelector('[data-agenda-next]');
  var status = root.querySelector('[data-agenda-status]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function perView() {
    return window.innerWidth < 720 ? 1 : 2;
  }

  function slideWidth() {
    var gap = parseFloat(getComputedStyle(track).gap) || 16;
    return (viewport.clientWidth - gap * (perView() - 1)) / perView() + gap;
  }

  function indexFromScroll() {
    var w = slideWidth();
    return Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / w)));
  }

  function updateStatus() {
    if (status) status.textContent = indexFromScroll() + 1 + ' / ' + slides.length;
    if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 2;
    if (nextBtn) {
      nextBtn.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2;
    }
  }

  function scrollToIndex(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    viewport.scrollTo({ left: i * slideWidth(), behavior: reduce ? 'auto' : 'smooth' });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      scrollToIndex(indexFromScroll() - perView());
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      scrollToIndex(indexFromScroll() + perView());
    });
  }
  viewport.addEventListener(
    'scroll',
    function () {
      requestAnimationFrame(updateStatus);
    },
    { passive: true }
  );
  window.addEventListener('resize', updateStatus);
  document.querySelectorAll('[data-agenda-jump]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var g = btn.getAttribute('data-agenda-jump');
      var el = track.querySelector('[data-agenda-group="' + g + '"]');
      if (el) {
        el.scrollIntoView({ inline: 'start', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      }
      updateStatus();
    });
  });
  viewport.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(indexFromScroll() - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(indexFromScroll() + 1);
    }
  });
  updateStatus();
})();
