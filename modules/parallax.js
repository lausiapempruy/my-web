/* ============================================
   Gerald's Private Web v2 — modules/parallax.js
   Hero bg scroll parallax + card mouse tilt
   ============================================ */

(function (G) {
  'use strict';

  G.Parallax = {
    init: function () {
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      this._initBgScroll();
      this._initCardTilt();
    },

    _initBgScroll: function () {
      var bg = document.querySelector('.hero-bg');
      if (!bg) return;

      window.addEventListener('scroll', function () {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        bg.style.transform = 'scale(1.05) translateY(' + (y * 0.22) + 'px)';
      }, { passive: true });
    },

    _initCardTilt: function () {
      var hero = document.getElementById('hero');
      var card = document.getElementById('heroCard');
      if (!hero || !card) return;

      /* Desktop only */
      if (window.matchMedia('(max-width: 768px)').matches) return;

      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;

        card.style.transition = 'transform 0.08s linear';
        card.style.transform  =
          'perspective(1400px) rotateX(' + (y * -2.5) + 'deg) rotateY(' + (x * 2.5) + 'deg)';
      });

      hero.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
        card.style.transform  = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
      });
    }
  };

})(window.Gerald = window.Gerald || {});
