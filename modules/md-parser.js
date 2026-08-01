/* ============================================
   Gerald's Private Web v2 — modules/md-parser.js
   Minimal Markdown → HTML parser (ES5)
   Supported: h1-h4, p, ul/li, hr, bold,
              italic, code, links
   ============================================ */

(function (G) {
  'use strict';

  G.MdParser = {

    parse: function (raw) {
      var lines  = raw.split('\n');
      var out    = '';
      var inList = false;

      function closeList() {
        if (inList) { out += '</ul>'; inList = false; }
      }

      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];

        if (/^####\s/.test(l)) {
          closeList();
          out += '<h4>' + this._inline(this._esc(l.replace(/^####\s/, ''))) + '</h4>';
          continue;
        }
        if (/^###\s/.test(l)) {
          closeList();
          out += '<h3>' + this._inline(this._esc(l.replace(/^###\s/, ''))) + '</h3>';
          continue;
        }
        if (/^##\s/.test(l)) {
          closeList();
          out += '<h2>' + this._inline(this._esc(l.replace(/^##\s/, ''))) + '</h2>';
          continue;
        }
        if (/^#\s/.test(l)) {
          closeList();
          out += '<h1>' + this._inline(this._esc(l.replace(/^#\s/, ''))) + '</h1>';
          continue;
        }
        if (/^---+$/.test(l.trim())) {
          closeList();
          out += '<hr/>';
          continue;
        }
        if (/^[-*]\s/.test(l)) {
          if (!inList) { out += '<ul>'; inList = true; }
          out += '<li>' + this._inline(this._esc(l.replace(/^[-*]\s/, ''))) + '</li>';
          continue;
        }
        if (l.trim() === '') {
          closeList();
          continue;
        }

        closeList();
        out += '<p>' + this._inline(this._esc(l)) + '</p>';
      }

      closeList();
      return out;
    },

    hasContent: function (raw) {
      return raw.split('\n').filter(function (l) {
        return !/^#+\s/.test(l) && l.trim() !== '';
      }).length > 0;
    },

    _esc: function (s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },

    _inline: function (s) {
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.+?)\*/g,     '<em>$1</em>');
      s = s.replace(/`(.+?)`/g,       '<code>$1</code>');
      s = s.replace(/\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>');
      return s;
    }

  };

})(window.Gerald = window.Gerald || {});
