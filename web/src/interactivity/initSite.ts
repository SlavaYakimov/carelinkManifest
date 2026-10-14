// @ts-nocheck
export function initSite() {
  var bar = document.getElementById('bar');
  if (bar) {
    function u() {
      var h = document.documentElement;
      bar.style.width = (100 * h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)) + '%';
    }
    addEventListener('scroll', u, { passive: true });
    u();
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealNodes = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealNodes.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealNodes.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      var revealIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              revealIo.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
      );
      revealNodes.forEach(function (el) {
        revealIo.observe(el);
      });
      var hero = document.querySelector('.hero-in[data-reveal]');
      if (hero) {
        requestAnimationFrame(function () {
          hero.classList.add('is-visible');
        });
      }
    }
  }

  var links = [].slice.call(document.querySelectorAll('.toc a'));
  if (links.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) {
              a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    document.querySelectorAll('.read-chapters .chapter, #sources').forEach(function (s) {
      io.observe(s);
    });
  }
}
