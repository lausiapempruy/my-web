/* ============================================
   Gerald's Private Web v2 — app.js
   Entry point & orchestrator
   ES5 Compatible
   ============================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     CONFIG LOADER
  ───────────────────────────────────────── */
  function loadConfig(cb) {
    fetch('./package.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Gagal load config');
        return res.json();
      })
      .then(function (cfg) { cb(null, cfg); })
      .catch(function (err) { cb(err, null); });
  }

  /* ─────────────────────────────────────────
     LOADER — fix: dual trigger + fallback
     Problem: window 'load' event bisa ga fire
     kalau background.png gagal/lambat load.
     Fix: juga trigger setelah animasi CSS
     selesai + hard fallback 3s.
  ───────────────────────────────────────── */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    var dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      loader.classList.add('out');
    }

    /* Trigger 1: window load event (normal case) */
    window.addEventListener('load', function () {
      setTimeout(dismiss, 1600);
    });

    /* Trigger 2: CSS animation end pada loader bar */
    var fill = loader.querySelector('.loader-fill');
    if (fill) {
      fill.addEventListener('animationend', function () {
        setTimeout(dismiss, 200);
      });
    }

    /* Trigger 3: hard fallback — 3.5s max, apapun yang terjadi */
    setTimeout(dismiss, 3500);
  }

  /* ─────────────────────────────────────────
     HERO ENTRANCE
  ───────────────────────────────────────── */
  function initHeroEntrance() {
    var card = document.getElementById('heroCard');
    var hint = document.getElementById('heroScroll');
    if (!card) return;

    card.style.opacity    = '0';
    card.style.transform  = 'translateY(28px)';
    card.style.transition = 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';

    if (hint) {
      hint.style.opacity    = '0';
      hint.style.transition = 'opacity 0.6s ease 1.6s';
    }

    setTimeout(function () {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
      if (hint) hint.style.opacity = '1';
    }, 1700);
  }

  /* ─────────────────────────────────────────
     TEXT GENERATE EFFECT — hero subtitle
     Words fade + unblur one by one
  ───────────────────────────────────────── */
  function initTextGenerate() {
    var el = document.getElementById('heroSubtitle');
    if (!el) return;

    var text  = 'Website Pribadi · 2026';
    var words = text.split(' ');
    var html  = '';

    for (var i = 0; i < words.length; i++) {
      html += '<span class="gen-word">' + words[i] + '</span>';
    }

    el.innerHTML = html;

    var spans = el.querySelectorAll('.gen-word');
    var delay = 2200; /* start setelah hero entrance */

    for (var j = 0; j < spans.length; j++) {
      (function (span, d) {
        setTimeout(function () {
          span.classList.add('visible');
        }, d);
      })(spans[j], delay + j * 220);
    }
  }

  /* ─────────────────────────────────────────
     TEXT HOVER EFFECT — hero name SVG
     Radial gradient follows mouse
  ───────────────────────────────────────── */
  function initTextHoverEffect() {
    var wrap = document.querySelector('.hero-name-wrap');
    var svg  = document.getElementById('heroNameSvg');
    var rg   = svg ? svg.querySelector('#revealMask') : null;
    if (!wrap || !svg || !rg) return;

    /* Inject gradient defs for the gradient text */
    var defs = svg.querySelector('defs');
    if (defs) {
      var lg = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      lg.setAttribute('id', 'heroGradient');
      lg.setAttribute('x1', '0%'); lg.setAttribute('y1', '0%');
      lg.setAttribute('x2', '100%'); lg.setAttribute('y2', '0%');
      var stops = [
        { offset: '0%',   color: '#ffffff' },
        { offset: '40%',  color: 'rgba(255,255,255,0.7)' },
        { offset: '100%', color: 'rgba(255,255,255,0.9)' }
      ];
      stops.forEach(function (s) {
        var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop.setAttribute('offset', s.offset);
        stop.setAttribute('stop-color', s.color);
        lg.appendChild(stop);
      });
      defs.appendChild(lg);
    }

    wrap.addEventListener('mousemove', function (e) {
      var rect = svg.getBoundingClientRect();
      var cx   = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      var cy   = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      rg.setAttribute('cx', cx);
      rg.setAttribute('cy', cy);
    });

    wrap.addEventListener('mouseleave', function () {
      rg.setAttribute('cx', '50%');
      rg.setAttribute('cy', '50%');
    });
  }

  /* ─────────────────────────────────────────
     HERO SCROLL HINT
  ───────────────────────────────────────── */
  function initScrollHint() {
    var btn  = document.getElementById('heroScroll');
    var dest = document.getElementById('deskripsi');
    if (!btn || !dest) return;

    function go() { dest.scrollIntoView({ behavior: 'smooth' }); }
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  }

  /* ─────────────────────────────────────────
     HERO BG SCROLL PARALLAX
  ───────────────────────────────────────── */
  function initHeroBgParallax() {
    var bg = document.querySelector('.hero-bg');
    if (!bg) return;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      bg.style.transform = 'scale(1.05) translateY(' + (y * 0.22) + 'px)';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     HERO CARD MOUSE TILT
  ───────────────────────────────────────── */
  function initHeroCardParallax() {
    var hero = document.getElementById('hero');
    var card = document.getElementById('heroCard');
    if (!hero || !card) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'transform 0.08s linear';
      card.style.transform  = 'perspective(1400px) rotateX(' + (y * -2.5) + 'deg) rotateY(' + (x * 2.5) + 'deg)';
    });

    hero.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
      card.style.transform  = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ─────────────────────────────────────────
     FLOATING DOCK — neighbour magnify
  ───────────────────────────────────────── */
  function initDockMagnify() {
    var items = document.querySelectorAll('.dock-item');
    if (!items.length) return;

    items.forEach(function (item, idx) {
      item.addEventListener('mouseenter', function () {
        items.forEach(function (el, i) {
          el.classList.remove('dock-neighbour-1', 'dock-neighbour-2');
          var diff = Math.abs(i - idx);
          if (diff === 1) el.classList.add('dock-neighbour-1');
          if (diff === 2) el.classList.add('dock-neighbour-2');
        });
      });

      item.addEventListener('mouseleave', function () {
        items.forEach(function (el) {
          el.classList.remove('dock-neighbour-1', 'dock-neighbour-2');
        });
      });
    });
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.top < vh * 0.90 && r.bottom > 0) {
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

  /* ─────────────────────────────────────────
     MARKDOWN PARSER
  ───────────────────────────────────────── */
  function parseMd(raw) {
    var lines  = raw.split('\n');
    var out    = '';
    var inList = false;

    function closeList() { if (inList) { out += '</ul>'; inList = false; } }
    function esc(s)    { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function inline(s) {
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.+?)\*/g,     '<em>$1</em>');
      s = s.replace(/`(.+?)`/g,       '<code>$1</code>');
      s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      return s;
    }

    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      if (/^####\s/.test(l)) { closeList(); out += '<h4>' + inline(esc(l.replace(/^####\s/,''))) + '</h4>'; continue; }
      if (/^###\s/.test(l))  { closeList(); out += '<h3>' + inline(esc(l.replace(/^###\s/, ''))) + '</h3>'; continue; }
      if (/^##\s/.test(l))   { closeList(); out += '<h2>' + inline(esc(l.replace(/^##\s/,  ''))) + '</h2>'; continue; }
      if (/^#\s/.test(l))    { closeList(); out += '<h1>' + inline(esc(l.replace(/^#\s/,   ''))) + '</h1>'; continue; }
      if (/^---+$/.test(l.trim())) { closeList(); out += '<hr/>'; continue; }
      if (/^[-*]\s/.test(l)) {
        if (!inList) { out += '<ul>'; inList = true; }
        out += '<li>' + inline(esc(l.replace(/^[-*]\s/,''))) + '</li>';
        continue;
      }
      if (l.trim() === '') { closeList(); continue; }
      closeList();
      out += '<p>' + inline(esc(l)) + '</p>';
    }

    closeList();
    return out;
  }

  /* ─────────────────────────────────────────
     LOAD desk-singkat.md
  ───────────────────────────────────────── */
  function loadDeskripsi() {
    var el = document.getElementById('deskContent');
    if (!el) return;

    fetch('./assets/deskripsi/desk-singkat.md')
      .then(function (r) { if (!r.ok) throw new Error(); return r.text(); })
      .then(function (raw) {
        var hasContent = raw.split('\n')
          .filter(function (l) { return !/^#+\s/.test(l) && l.trim() !== ''; })
          .length > 0;

        el.innerHTML = hasContent
          ? parseMd(raw)
          : '<p class="desk-empty">Belum ada deskripsi.</p>';
      })
      .catch(function () {
        el.innerHTML = '<p class="desk-empty">Tidak bisa memuat deskripsi.</p>';
      });
  }

  /* ─────────────────────────────────────────
     CARD STACK — Komunitas
     Auto-cycle every 5s, click to advance
  ───────────────────────────────────────── */
  function initCardStack(cfg) {
    var stack = document.getElementById('komunitasStack');
    if (!stack) return;

    var list    = (cfg && cfg.communities) ? cfg.communities : [];
    var enabled = list.filter(function (c) { return c.enabled; });

    if (!enabled.length) {
      stack.innerHTML = '<p class="desk-empty" style="padding:28px">Belum ada komunitas.</p>';
      stack.style.height = 'auto';
      return;
    }

    /* Build card elements */
    var cards = [];
    for (var i = 0; i < enabled.length; i++) {
      var c   = enabled[i];
      var div = document.createElement('div');
      div.className = 'stack-card';
      div.innerHTML =
        '<div class="stack-card-content">' + (c.description || c.name) + '</div>' +
        '<div class="stack-card-footer">' +
          '<div class="stack-card-name">' + c.name + '</div>' +
          (c.url ? '<div class="stack-card-sub">' + c.url.replace(/^https?:\/\//, '') + '</div>' : '') +
        '</div>' +
        (c.url ? '<span class="stack-card-arrow">→</span>' : '');

      if (c.url) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (function (url) {
          return function (e) {
            if (e.target.tagName !== 'A') window.open(url, '_blank', 'noopener');
          };
        })(c.url));
      }

      stack.appendChild(div);
      cards.push(div);
    }

    var OFFSET      = 10;
    var SCALE_STEP  = 0.06;

    function applyPositions() {
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.top       = (i * -OFFSET) + 'px';
        cards[i].style.transform = 'scale(' + (1 - i * SCALE_STEP) + ')';
        cards[i].style.zIndex    = cards.length - i;
        cards[i].style.opacity   = i < 4 ? (1 - i * 0.12) : 0;
      }
    }

    function advance() {
      /* Move last to front */
      var last = cards.pop();
      cards.unshift(last);
      applyPositions();
    }

    applyPositions();

    /* Click top card to advance */
    stack.addEventListener('click', function () { advance(); });

    /* Auto advance every 5s */
    var timer = setInterval(advance, 5000);

    /* Pause on hover */
    stack.addEventListener('mouseenter', function () { clearInterval(timer); });
    stack.addEventListener('mouseleave', function () { timer = setInterval(advance, 5000); });
  }

  /* ─────────────────────────────────────────
     TABS — Karya
  ───────────────────────────────────────── */
  function initTabs(cfg) {
    var nav     = document.getElementById('karyaTabsNav');
    var content = document.getElementById('karyaTabsContent');
    if (!nav || !content) return;

    var list    = (cfg && cfg.works) ? cfg.works : [];
    var enabled = list.filter(function (w) { return w.enabled; });

    if (!enabled.length) {
      nav.style.display = 'none';
      content.innerHTML = '<p class="tab-empty">Belum ada karya.</p>';
      return;
    }

    /* Ghost depth panels */
    content.innerHTML =
      '<div class="tab-panel-ghost"></div>' +
      '<div class="tab-panel-ghost" style="z-index:-2;transform:translateY(-6px) scale(0.97)"></div>';

    var panels = [];
    var buttons = [];

    for (var i = 0; i < enabled.length; i++) {
      var w = enabled[i];

      /* Tab button */
      var btn = document.createElement('button');
      btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
      btn.textContent = w.title;
      btn.setAttribute('type', 'button');
      nav.appendChild(btn);
      buttons.push(btn);

      /* Panel */
      var panel = document.createElement('div');
      panel.className = 'tab-panel glass-card' + (i === 0 ? ' active' : '');
      panel.innerHTML =
        '<div class="tab-card">' +
          '<div class="tab-card-title">' + w.title + '</div>' +
          (w.description ? '<div class="tab-card-desc">' + w.description + '</div>' : '') +
          (w.url ? '<a class="tab-card-link" href="' + w.url + '" target="_blank" rel="noopener">Lihat →</a>' : '') +
        '</div>';
      content.appendChild(panel);
      panels.push(panel);
    }

    buttons.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        panels[idx].classList.add('active');
      });
    });
  }

  /* ─────────────────────────────────────────
     SVG ICONS
  ───────────────────────────────────────── */
  var ICONS = {
    roblox:           '<svg viewBox="0 0 24 24"><path d="M6.31 2L2 17.69 17.69 22 22 6.31 6.31 2zm8.27 11.17l-3.44-.97-.97 3.44-2.47-.7.97-3.44-3.44-.97.7-2.47 3.44.97.97-3.44 2.47.7-.97 3.44 3.44.97-.7 2.47z"/></svg>',
    instagram:        '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    tiktok:           '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/></svg>',
    whatsapp_group:   '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    whatsapp_channel: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    whatsapp_phone:   '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    youtube:          '<svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>',
    discord:          '<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.13 18.115a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
    ngl:              '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'
  };

  var TYPE_LABELS = {
    roblox: 'Roblox', instagram: 'Instagram', tiktok: 'TikTok',
    whatsapp_group: 'WA Group', whatsapp_channel: 'WA Channel',
    whatsapp_phone: 'WhatsApp', youtube: 'YouTube', discord: 'Discord', ngl: 'NGL'
  };

  /* ─────────────────────────────────────────
     SOSIAL — stateful click animation
  ───────────────────────────────────────── */
  function loadSosial(cfg) {
    var grid = document.getElementById('sosialGrid');
    if (!grid) return;

    var list    = (cfg && cfg.socials) ? cfg.socials : [];
    var enabled = list.filter(function (s) { return s.enabled && s.url; });

    if (!enabled.length) {
      grid.innerHTML = '<p class="sosial-empty">Belum ada link sosial.</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < enabled.length; i++) {
      var s    = enabled[i];
      var icon = ICONS[s.type] || ICONS['ngl'];
      var lbl  = s.label || TYPE_LABELS[s.type] || s.type;
      var type = TYPE_LABELS[s.type] || s.type;

      html += '<a class="sosial-item glass-card" href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + lbl + '">';
      html += '<div class="sosial-icon">' + icon + '</div>';
      html += '<div class="sosial-info">';
      html += '<span class="sosial-type">' + type + '</span>';
      html += '<span class="sosial-label">' + lbl + '</span>';
      html += '</div></a>';
    }

    grid.innerHTML = html;

    /* Stateful: click → loading spin → success scale */
    var items = grid.querySelectorAll('.sosial-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var el = this;
        el.classList.add('loading');
        setTimeout(function () {
          el.classList.remove('loading');
          el.classList.add('success');
          setTimeout(function () { el.classList.remove('success'); }, 600);
        }, 350);
      });
    });
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  function init() {
    /* ADS init dulu */
    if (window.Gerald && window.Gerald.ADS) window.Gerald.ADS.init();

    initLoader();
    initHeroEntrance();
    initScrollHint();
    initTextGenerate();
    initTextHoverEffect();
    initDockMagnify();
    loadDeskripsi();

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      initHeroBgParallax();
      initHeroCardParallax();
    }

    loadConfig(function (err, cfg) {
      initCardStack(cfg);
      initTabs(cfg);
      loadSosial(cfg);
    });

    setTimeout(initReveal, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
