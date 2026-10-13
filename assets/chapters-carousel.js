(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var speakerCarousel = document.querySelector('.speakers--chapters .speaker-carousel');
  var scrollPin = document.getElementById('glavy');
  if (!speakerCarousel || !scrollPin) return;

  var speakerSlides = [].slice.call(speakerCarousel.querySelectorAll('.speaker-slide'));
  var speakerDots = [].slice.call(document.querySelectorAll('.speaker-controls--toc .speaker-dot'));
  var activeChapterIndex = 0;
  var activeSpeakerIndex = 0;

  function setSpeakerSlide(slideIndex, chapterIndex) {
    activeSpeakerIndex = (slideIndex + speakerSlides.length) % speakerSlides.length;
    if (typeof chapterIndex === 'number') activeChapterIndex = chapterIndex;
    speakerCarousel.style.setProperty('--speaker-index', activeSpeakerIndex);
    speakerCarousel.style.setProperty('--speaker-offset', activeSpeakerIndex * -100 + '%');
    speakerSlides.forEach(function (slide, i) {
      var on = i === activeSpeakerIndex;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    speakerDots.forEach(function (dot) {
      var ch = Number(dot.getAttribute('data-chapter')) - 1;
      var on = ch === activeChapterIndex;
      dot.classList.toggle('is-active', on);
      if (on) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  speakerDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var ch = Number(dot.getAttribute('data-chapter')) - 1;
      var slideIndex = Number(dot.getAttribute('data-slide'));
      if (Number.isNaN(ch)) return;
      setSpeakerSlide(slideIndex, ch);
      var rect = scrollPin.getBoundingClientRect();
      var start = window.scrollY + rect.top;
      var span = scrollPin.offsetHeight - window.innerHeight;
      var target = start + (ch / Math.max(1, speakerDots.length - 1)) * span;
      window.scrollTo({
        top: target,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    });
  });

  speakerCarousel.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      setSpeakerSlide(activeSpeakerIndex + 1, Math.min(activeChapterIndex + 1, speakerDots.length - 1));
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setSpeakerSlide(activeSpeakerIndex - 1, Math.max(activeChapterIndex - 1, 0));
    }
  });

  function onScroll() {
    var rect = scrollPin.getBoundingClientRect();
    var span = scrollPin.offsetHeight - window.innerHeight;
    if (span <= 0) return;
    var progress = Math.min(1, Math.max(0, -rect.top / span));
    var ch = Math.round(progress * (speakerDots.length - 1));
    var slideIndex = Math.floor(ch / 2);
    if (ch !== activeChapterIndex) setSpeakerSlide(slideIndex, ch);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  setSpeakerSlide(0, 0);
})();
