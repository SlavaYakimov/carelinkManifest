(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function dotIndexAttr(dot) {
    if (dot.hasAttribute('data-chapter')) return 'data-chapter';
    if (dot.hasAttribute('data-challenge')) return 'data-challenge';
    return 'data-item';
  }

  function initPin(scrollPin) {
    var carousel = scrollPin.querySelector('.speaker-carousel');
    if (!carousel) return;

    var slides = [].slice.call(carousel.querySelectorAll('.speaker-slide'));
    var dots = [].slice.call(scrollPin.querySelectorAll('.speaker-dot'));
    if (!slides.length || !dots.length) return;

    var attr = dotIndexAttr(dots[0]);
    var perSlide =
      slides[0].querySelectorAll('.speaker-person').length || 3;
    var activeItem = 0;
    var activeSlide = 0;

    function setState(itemIndex) {
      var max = dots.length - 1;
      activeItem = Math.min(max, Math.max(0, itemIndex));
      activeSlide = Math.floor(activeItem / perSlide);
      carousel.style.setProperty('--speaker-index', activeSlide);
      carousel.style.setProperty(
        '--speaker-offset',
        activeSlide * -100 + '%'
      );
      slides.forEach(function (slide, i) {
        var on = i === activeSlide;
        slide.classList.toggle('is-active', on);
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function (dot) {
        var idx = Number(dot.getAttribute(attr)) - 1;
        var on = idx === activeItem;
        dot.classList.toggle('is-active', on);
        if (on) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }

    function scrollToItem(itemIndex) {
      var rect = scrollPin.getBoundingClientRect();
      var start = window.scrollY + rect.top;
      var span = scrollPin.offsetHeight - window.innerHeight;
      if (span <= 0) {
        setState(itemIndex);
        return;
      }
      var max = dots.length - 1;
      var t = max > 0 ? itemIndex / max : 0;
      window.scrollTo({
        top: start + t * span,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = Number(dot.getAttribute(attr)) - 1;
        if (Number.isNaN(idx)) return;
        scrollToItem(idx);
      });
    });

    scrollPin.querySelectorAll('[data-speakers-jump]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-speakers-jump'));
        if (Number.isNaN(idx)) return;
        scrollToItem(idx);
      });
    });

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        setState(activeItem + 1);
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setState(activeItem - 1);
      }
    });

    function onScroll() {
      var rect = scrollPin.getBoundingClientRect();
      var span = scrollPin.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      var progress = Math.min(1, Math.max(0, -rect.top / span));
      var item = Math.round(progress * (dots.length - 1));
      if (item !== activeItem) setState(item);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    setState(0);
  }

  document.querySelectorAll('[data-speakers-scroll-pin]').forEach(initPin);
})();
