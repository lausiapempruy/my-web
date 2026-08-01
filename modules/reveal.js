/* ============================================
   Gerald's Private Web v2 — modules/reveal.js
   Scroll reveal — fade + slide both directions
   ============================================ */

(function (G) {
  'use strict';

  G.Reveal = {
    init: function () {
      var els = document.querySelectorAll('.reveal');
      if (!els.length) return;

      function check() {
        var vh = window.innerHeight || document.documentElement.clientHeight;

        for (var i = 0; i < els.length; i++) {
          var rect   = els[i].getBoundingClientRect();
          var inView = rect.top < vh * 0.90 && rect.bottom > 0;

          if (inView) {
            els[i].classList.add('visible');
            els[i].classList.remove('hidden');
          } else {
            els[i].classList.remove('visible');
            els[i].classList.add('hidden');
          }
        }
      }

      check();
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check, { passive: true });
    }
  };

})(window.Gerald = window.Gerald || {});
