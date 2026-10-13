(function () {
  var bar = document.getElementById('bar');
  if (bar) {
    function u() {
      var h = document.documentElement;
      bar.style.width = (100 * h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)) + '%';
    }
    addEventListener('scroll', u, { passive: true });
    u();
  }
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  if (links.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.read-chapters .chapter, #sources').forEach(function (s) {
      io.observe(s);
    });
  }
})();
