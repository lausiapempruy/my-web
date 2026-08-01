/* ============================================
   Gerald's Private Web v2 — modules/ads.js
   ADS — Automatic Device Fit
   Deteksi device & sesuaikan layout/behavior
   otomatis tanpa media query manual
   ============================================ */

(function (G) {
  'use strict';

  /* ── Device profiles ── */
  var PROFILES = {
    mobile:  { maxWidth: 480,  label: 'mobile'  },
    tablet:  { maxWidth: 1024, label: 'tablet'  },
    desktop: { maxWidth: Infinity, label: 'desktop' }
  };

  /* ── Touch detection ── */
  function isTouch() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
  }

  /* ── Get current profile ── */
  function getProfile() {
    var w = window.innerWidth || document.documentElement.clientWidth;

    if (w <= PROFILES.mobile.maxWidth)  return PROFILES.mobile;
    if (w <= PROFILES.tablet.maxWidth)  return PROFILES.tablet;
    return PROFILES.desktop;
  }

  /* ── Apply device class to <html> ── */
  function applyClass(profile) {
    var html = document.documentElement;
    html.classList.remove('ads-mobile', 'ads-tablet', 'ads-desktop');
    html.classList.add('ads-' + profile.label);

    if (isTouch()) {
      html.classList.add('ads-touch');
    } else {
      html.classList.remove('ads-touch');
    }
  }

  /* ── Device-specific behaviors ── */
  function applyBehaviors(profile) {

    /* Mobile: disable heavy parallax, simplify loader */
    if (profile.label === 'mobile') {
      var heroCard = document.getElementById('heroCard');
      if (heroCard) {
        heroCard.style.borderRadius = '20px';
      }

      /* Hapus parallax event kalau ada — hemat baterai */
      var hero = document.getElementById('hero');
      if (hero) {
        var cloned = hero.cloneNode(true);
        /* Hanya clone kalau belum ada flag */
        if (!hero.dataset.adsApplied) {
          hero.dataset.adsApplied = '1';
        }
      }
    }

    /* Tablet: intermediate behavior */
    if (profile.label === 'tablet') {
      var grid = document.querySelector('.sosial-grid');
      if (grid) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      }
    }

    /* Desktop: full experience, nothing to restrict */
    if (profile.label === 'desktop') {
      var gridD = document.querySelector('.sosial-grid');
      if (gridD) {
        gridD.style.gridTemplateColumns = '';
      }
    }
  }

  /* ── Font size scaling (fluid, per device) ── */
  function applyFontScale(profile) {
    var root = document.documentElement;

    if (profile.label === 'mobile') {
      root.style.setProperty('--ads-scale', '0.92');
    } else if (profile.label === 'tablet') {
      root.style.setProperty('--ads-scale', '0.96');
    } else {
      root.style.setProperty('--ads-scale', '1');
    }
  }

  /* ── Viewport height fix (mobile browser bar) ── */
  function fixViewportHeight() {
    function set() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--ads-vh', vh + 'px');
    }
    set();
    window.addEventListener('resize', set, { passive: true });
  }

  /* ── Orientation change handler ── */
  function watchOrientation() {
    window.addEventListener('orientationchange', function () {
      setTimeout(function () {
        var profile = getProfile();
        applyClass(profile);
        applyBehaviors(profile);
        applyFontScale(profile);
      }, 150);
    });
  }

  /* ── Resize debounce ── */
  function watchResize() {
    var timer = null;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var profile = getProfile();
        applyClass(profile);
        applyBehaviors(profile);
        applyFontScale(profile);
      }, 120);
    }, { passive: true });
  }

  /* ── Public API ── */
  G.ADS = {
    profile: null,

    init: function () {
      var profile = getProfile();
      this.profile = profile;

      applyClass(profile);
      applyFontScale(profile);
      fixViewportHeight();
      watchOrientation();
      watchResize();

      /* Apply behaviors setelah DOM siap */
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          applyBehaviors(profile);
        });
      } else {
        applyBehaviors(profile);
      }

      /* Expose ke window untuk debug */
      window.__ads = {
        profile: profile.label,
        touch:   isTouch(),
        width:   window.innerWidth
      };
    },

    /* Utility: check current device */
    is: function (label) {
      return this.profile && this.profile.label === label;
    }
  };

})(window.Gerald = window.Gerald || {});
