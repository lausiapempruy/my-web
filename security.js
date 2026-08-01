/* ============================================
   Gerald's Private Web v2 — security.js
   Basic security layer
   ============================================ */

(function () {
  'use strict';

  /* ── Disable right click ── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  /* ── Disable common devtools shortcuts ── */
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (save page)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return false;
    }
  });

  /* ── Disable text selection (optional, uncomment if needed) ── */
  document.addEventListener('selectstart', function (e) {
     e.preventDefault();
  });

  /* ── Devtools size detection ── */
  var devtoolsOpen = false;
  var threshold = 160;

  function checkDevtools() {
    var widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    var heightDiff = window.outerHeight - window.innerHeight > threshold;

    if (widthDiff || heightDiff) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        // Bisa tambah aksi di sini kalo mau
        console.clear();
      }
    } else {
      devtoolsOpen = false;
    }
  }

  setInterval(checkDevtools, 1000);

  /* ── Console warning ── */
  setTimeout(function () {
    console.log('%cHey!', 'color: #fff; font-size: 32px; font-weight: 800;');
    console.log('%cIni website pribadi Gerald Jonathan William.', 'color: rgba(255,255,255,0.6); font-size: 14px;');
    console.log('%cKalau lo lagi ngoprek ini karena penasaran, ya silahkan tapi jangan aneh-aneh ya.', 'color: rgba(255,255,255,0.4); font-size: 12px;');
  }, 2000);

})();
