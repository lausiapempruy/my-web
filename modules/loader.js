/* ============================================
   Gerald's Private Web v2 — modules/loader.js
   ============================================ */

(function (G) {
  'use strict';

  G.Loader = {
    init: function () {
      var loader = document.getElementById('loader');
      if (!loader) return;

      window.addEventListener('load', function () {
        setTimeout(function () {
          loader.classList.add('out');
        }, 1600);
      });
    }
  };

})(window.Gerald = window.Gerald || {});
