/* visual-kit: one file, no dependencies. See KIT.md for the block list.
 *   VK.render(el, blocks)     render blocks into an element
 *   <script class="vk" type="application/json">[...]</script>   auto-rendered on load
 *   VK.loadLesson('lesson.js')  multi-section lesson viewer (see viewer.html)
 *   VK.blocks.myBlock = (props, ctx) => element   add your own block
 */
(function () {
  'use strict';
  var VK = (window.VK = window.VK || {});
  VK.blocks = VK.blocks || {};

  /* ---------- helpers ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, k) {
    if (k == null || k === false) return;
    if (Array.isArray(k)) k.forEach(function (x) { add(el, x); });
    else el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function inline(t) {
    return String(t == null ? '' : t).split(/(`[^`]+`)/).map(function (part) {
      if (part.length > 1 && part[0] === '`' && part[part.length - 1] === '`') return '<code>' + esc(part.slice(1, -1)) + '</code>';
      return esc(part)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*\s][^*]*)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\((https?:[^)\s]+|#[^)\s]*|[^):\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }).join('');
  }
  function md(s) {
    return String(s == null ? '' : s).trim().split(/\n{2,}/).map(function (p) {
      var lines = p.split('\n');
      if (lines.every(function (l) { return /^\s*[-•] /.test(l); }))
        return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\s*[-•] /, '')) + '</li>'; }).join('') + '</ul>';
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  }
  function text(s) { return h('div', { class: 'vk-text', html: md(s) }); }
  function pre(code) { return h('pre', {}, h('code', {}, code)); }
  function card(b, label, cls) {
    var el = h('section', { class: 'vk-card' + (cls ? ' ' + cls : '') });
    if (b.label || label) el.appendChild(h('span', { class: 'vk-pill' }, b.label || label));
    if (b.title) el.appendChild(h('h2', {}, b.title));
    return el;
  }
  function norm(s) {
    // lower-case, drop accents and punctuation (£ and % too), but keep the point in numbers: 1.5 is not 15
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/(\d)[.,](?=\d)/g, '$1\u0001').replace(/[^a-z0-9Ѐ-ӿ\s\u0001]/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++)
      for (j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  /* 'ok' exact (ignoring case/accents/punctuation), 'almost' one typo, else 'bad' */
  function grade(typed, answers) {
    var t = norm(typed), best = 'bad';
    if (!t) return 'bad';
    [].concat(answers).forEach(function (a) {
      var n = norm(a);
      if (t === n) best = 'ok';
      else if (best === 'bad' && n.length > 4 && lev(t, n) <= 1) best = 'almost';
    });
    return best;
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function list(x) { return Array.isArray(x) ? x : x == null ? [] : [x]; }
  VK.h = h; VK.md = md; VK.inline = inline; VK.text = text; VK.card = card; VK.grade = grade; VK.shuffle = shuffle;

  /* ---------- results (localStorage only; export to hand back to the AI) ---------- */
  var ns = location.pathname;
  function store(k, v) {
    try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ }
    return null;
  }
  VK.setNamespace = function (n) { ns = n; VK.results = store('vk:res:' + ns) || {}; };
  VK.setNamespace(ns);
  function record(id, type, title, r) {
    var e = VK.results[id] || (VK.results[id] = { type: type, title: title || '', attempts: [] });
    r.at = new Date().toISOString();
    e.attempts.push(r);
    store('vk:res:' + ns, VK.results);
  }
  VK.export = function () {
    return JSON.stringify({ page: document.title, exportedAt: new Date().toISOString(), results: VK.results }, null, 2);
  };
  function exportBar() {
    var btn = h('button', { class: 'vk-btn' }, 'Copy my answers');
    btn.addEventListener('click', function () {
      var out = VK.export();
      function done() { btn.textContent = 'Copied. Paste it to your AI'; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out).then(done, fallback);
      else fallback();
      function fallback() {
        var ta = h('textarea', {}); ta.value = out; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = 'Copy failed'; }
        ta.remove();
      }
    });
    return h('div', { class: 'vk-export' }, btn);
  }

  /* ---------- render ---------- */
  var INTERACTIVE = { quiz: 1, flashcards: 1, cloze: 1, shortAnswer: 1, match: 1, order: 1, sort: 1, explainBack: 1 };
  function renderBlock(b, i, prefix) {
    var el;
    try {
      var fn = b && VK.blocks[b.type];
      if (!fn) throw new Error('unknown block type "' + (b && b.type) + '". Known: ' + Object.keys(VK.blocks).join(', '));
      var id = b.id || (prefix || '') + b.type + '-' + i;
      el = fn(b, { id: id, record: function (r) { record(id, b.type, b.title, r); } });
    } catch (e) {
      el = h('section', { class: 'vk-card vk-error' }, '⚠ block ' + i + (b && b.type ? ' (' + b.type + ')' : '') + ': ' + e.message);
    }
    if (b && b.span === 'full') el.classList.add('vk-full');
    if (b && b.caption && el.classList.contains('vk-card')) el.appendChild(h('div', { class: 'vk-caption', html: inline(b.caption) }));
    return el;
  }
  VK.render = function (target, blocks, opts) {
    opts = opts || {};
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!Array.isArray(blocks)) blocks = (blocks && blocks.blocks) || [];
    el.textContent = '';
    if (!el.closest('.vk')) el.classList.add('vk');
    var grid = h('div', { class: 'vk-grid' });
    blocks.forEach(function (b, i) { grid.appendChild(renderBlock(b, i, opts.prefix)); });
    el.appendChild(grid);
    if (!opts.noExport && blocks.some(function (b) { return b && INTERACTIVE[b.type]; })) el.appendChild(exportBar());
    return el;
  };

  /* ---------- display blocks ---------- */
  var B = VK.blocks;
  B.explainer = function (b) {
    var el = card(b, 'Explainer');
    if (b.body) el.appendChild(text(b.body));
    if (b.code) el.appendChild(pre(b.code));
    if (b.points) el.appendChild(h('ol', { class: 'vk-points' }, b.points.map(function (p) { return h('li', { html: inline(p) }); })));
    return el;
  };
  B.callout = function (b) {
    var kind = b.kind || 'note';
    var labels = { note: 'Note', tip: 'Tip', warning: 'Watch out', success: 'Nice work', key: 'Key idea' };
    var el = card(b, labels[kind] || 'Note', 'vk-callout ' + kind);
    el.appendChild(text(b.body || b.text));
    return el;
  };
  B.stats = function (b) {
    var el = card(b, '');
    el.appendChild(h('div', { class: 'vk-stats' }, b.items.map(function (s) {
      var arrow = { up: ' ▲', down: ' ▼', flat: ' ▬' }[s.trend] || '';
      return h('div', { class: 'vk-stat' }, h('b', { class: s.trend ? 'vk-' + s.trend : '' }, s.value + arrow),
        h('span', {}, s.label), s.note && h('div', { class: 'vk-muted' }, s.note));
    })));
    return el;
  };
  B.timeline = function (b) {
    var el = card(b, '');
    el.appendChild(h('div', { class: 'vk-timeline' }, (b.events || b.items).map(function (e) {
      return h('details', { open: !b.collapse }, h('summary', {}, h('small', {}, e.date), e.title), e.body && h('div', { html: inline(e.body) }));
    })));
    return el;
  };
  B.compare = function (b) {
    var el = card(b, '');
    el.appendChild(h('div', { class: 'vk-table-wrap' }, h('table', {},
      h('thead', {}, h('tr', {}, h('th', {}), b.columns.map(function (c) { return h('th', {}, c); }))),
      h('tbody', {}, b.rows.map(function (r) {
        return h('tr', {}, h('th', {}, r.label), r.values.map(function (v) { return h('td', { html: inline(v) }); }));
      })))));
    if (b.note) el.appendChild(h('div', { class: 'vk-muted' }, b.note));
    return el;
  };
  B.tree = function (b) {
    function node(n, open) {
      if (!n.children || !n.children.length) return h('div', {}, n.label, n.note && h('span', { class: 'vk-muted' }, ' · ' + n.note));
      return h('details', { open: open }, h('summary', {}, n.label, n.note && h('span', { class: 'vk-muted' }, ' · ' + n.note)),
        n.children.map(function (c) { return node(c, !b.collapse); }));
    }
    var el = card(b, '');
    el.appendChild(node(b.root, true));
    return el;
  };
  B.barChart = function (b) {
    var data = Array.isArray(b.data) ? b.data : Object.keys(b.data).map(function (k) { return { label: k, value: b.data[k] }; });
    var max = Math.max.apply(null, data.map(function (d) { return d.value; })) || 1, unit = b.unit || '';
    var hl = b.highlight; if (hl === -1) hl = data.length - 1;
    var el = card(b, '');
    data.forEach(function (d, i) {
      el.appendChild(h('div', { class: 'vk-bar' + (hl === i || hl === d.label ? ' hl' : '') },
        h('span', {}, d.label), h('i', {}, h('s', { style: 'width:' + Math.max(0, d.value / max * 100) + '%' })), h('b', {}, d.value + unit)));
    });
    if (b.note) el.appendChild(h('div', { class: 'vk-muted' }, b.note));
    return el;
  };
  B.lineChart = function (b) {
    var NS = 'http://www.w3.org/2000/svg', colours = ['#0f8b8d', '#e07a1f', '#6a4fd6', '#d6457a'];
    function s(tag, a, t) {
      var e = document.createElementNS(NS, tag);
      for (var k in a) e.setAttribute(k, a[k]);
      if (t != null) e.textContent = t;
      return e;
    }
    var all = [].concat.apply([], b.series.map(function (x) { return x.points; }));
    var xs = all.map(function (p) { return p[0]; }), ys = all.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = b.yMin != null ? b.yMin : Math.min(0, Math.min.apply(null, ys)), y1 = Math.max.apply(null, ys);
    var W = 600, H = 280, L = 48, R = 12, T = 12, Bm = 32;
    function X(x) { return L + (x1 === x0 ? 0.5 : (x - x0) / (x1 - x0)) * (W - L - R); }
    function Y(y) { return T + (1 - (y1 === y0 ? 0.5 : (y - y0) / (y1 - y0))) * (H - T - Bm); }
    function fmt(n) { return Math.abs(n) >= 1000 ? Math.round(n).toLocaleString('en-GB') : +n.toFixed(2) + ''; }
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'vk-svg', role: 'img' });
    for (var t = 0; t <= 4; t++) {
      var yv = y0 + (y1 - y0) * t / 4;
      svg.appendChild(s('line', { x1: L, x2: W - R, y1: Y(yv), y2: Y(yv), stroke: 'var(--vk-line)' }));
      svg.appendChild(s('text', { x: L - 6, y: Y(yv) + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--vk-ink-3)' }, fmt(yv) + (b.unit || '')));
    }
    [x0, x1].forEach(function (x, i) {
      svg.appendChild(s('text', { x: X(x), y: H - 10, 'text-anchor': i ? 'end' : 'start', 'font-size': 11, fill: 'var(--vk-ink-3)' }, fmt(x)));
    });
    if (b.xLabel) svg.appendChild(s('text', { x: (L + W - R) / 2, y: H - 10, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--vk-ink-3)' }, b.xLabel));
    b.series.forEach(function (se, i) {
      var c = se.color || colours[i % colours.length];
      svg.appendChild(s('polyline', { points: se.points.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' '), fill: 'none', stroke: c, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
      se.points.forEach(function (p) { svg.appendChild(s('circle', { cx: X(p[0]), cy: Y(p[1]), r: 3, fill: c }, null)).appendChild(s('title', {}, se.name + ': ' + p[0] + ', ' + p[1])); });
    });
    var el = card(b, '');
    el.appendChild(svg);
    if (b.series.length > 1)
      el.appendChild(h('div', { class: 'vk-legend' }, b.series.map(function (se, i) {
        return h('span', {}, h('i', { style: 'background:' + (se.color || colours[i % colours.length]) }), se.name);
      })));
    if (b.note) el.appendChild(h('div', { class: 'vk-muted' }, b.note));
    return el;
  };
  /* flow / steps: numbered boxes joined by arrows, laid out by CSS (no coordinates to get wrong) */
  function flowEl(b, dir) {
    var steps = b.steps || b.items, row = dir === 'row' && steps.length <= 4;
    var el = card(b, ''), wrap = h('div', { class: 'vk-flow ' + (row ? 'row' : 'col'), style: row ? '--n:' + steps.length : '' });
    steps.forEach(function (st, i) {
      wrap.appendChild(h('div', { class: 'vk-step' + (b.highlight === i ? ' hl' : '') },
        h('span', { class: 'vk-num' }, String(i + 1)),
        h('div', {}, h('h3', {}, st.title), st.show && h('code', { class: 'vk-show' }, st.show), st.body && h('div', { class: 'vk-text', html: md(st.body) }))));
    });
    el.appendChild(wrap);
    if (b.loop) el.appendChild(h('div', { class: 'vk-loop', html: '↻ ' + inline(b.loop) }));
    return el;
  }
  B.flow = function (b) { return flowEl(b, 'row'); };
  B.steps = function (b) { return flowEl(b, 'col'); };
  B.cards = function (b) {
    var el = card(b, '');
    el.appendChild(h('div', { class: 'vk-minis' + (b.columns ? ' fixed' : ''), style: b.columns ? '--cols:' + b.columns : '' }, b.items.map(function (it) {
      return h('div', { class: 'vk-mini' }, it.tag && h('span', { class: 'vk-pill' }, it.tag), h('h3', {}, it.title), it.body && h('div', { class: 'vk-text', html: md(it.body) }));
    })));
    return el;
  };
  B.layers = function (b) {
    var el = card(b, '');
    el.appendChild(h('div', { class: 'vk-layers' }, b.items.map(function (it, i) {
      return h('div', { class: 'vk-layer', style: '--i:' + i }, h('b', {}, it.title), h('span', { html: inline(it.body || '') }));
    })));
    return el;
  };
  B.code = function (b) { var el = card(b, ''); el.appendChild(pre(b.code)); return el; };
  B.image = function (b) {
    var el = card(b, '');
    el.appendChild(h('img', { src: b.src, alt: b.alt || '' }));
    if (b.caption) el.appendChild(h('div', { class: 'vk-muted' }, b.caption));
    return el;
  };
  B.html = function (b) { return h('section', { class: 'vk-card', html: b.html }); };
  B.reveal = function (b) {
    var el = card(b, '');
    el.appendChild(h('p', { html: inline(b.q) }));
    el.appendChild(h('details', {}, h('summary', {}, 'Show answer'), text(b.a)));
    return el;
  };
  B.group = function (b, ctx) {
    var cols = b.columns || b.blocks.length;
    return h('div', { class: 'vk-grid', style: 'grid-template-columns:repeat(auto-fit,minmax(min(100%,' + (cols > 2 ? 220 : 300) + 'px),1fr))' },
      b.blocks.map(function (x, i) { return renderBlock(x, i, ctx.id + '-'); }));
  };

  /* ---------- interactive blocks (each redraws its body from a small state object) ---------- */
  function btn(label, fn, cls, disabled) { return h('button', { class: 'vk-btn' + (cls ? ' ' + cls : ''), onclick: fn, disabled: disabled }, label); }

  B.quiz = function (b, ctx) {
    var qs = b.questions || [b], sel = qs.map(function () { return []; }), done = false;
    var el = card(b, qs.length > 1 ? 'Quiz' : 'Question'), body = h('div', {});
    el.appendChild(body);
    function right(q) { return list(q.answer); }
    function ok(q, i) { var r = right(q), p = sel[i]; return r.length === p.length && r.every(function (x) { return p.indexOf(x) > -1; }); }
    function draw() {
      body.textContent = '';
      qs.forEach(function (q, i) {
        var box = h('div', { class: 'vk-q' }, h('p', { html: (qs.length > 1 ? (i + 1) + '. ' : '') + inline(q.q) }));
        if (q.code) box.appendChild(pre(q.code));
        if (Array.isArray(q.answer) && !done) box.appendChild(h('div', { class: 'vk-muted' }, 'Select all that apply'));
        q.options.forEach(function (o, j) {
          var picked = sel[i].indexOf(j) > -1, isRight = right(q).indexOf(j) > -1;
          var cls = 'vk-opt' + (done ? (isRight ? ' ok' : picked ? ' bad' : '') : picked ? ' sel' : '');
          box.appendChild(h('button', { class: cls, disabled: done, onclick: function () {
            if (Array.isArray(q.answer)) sel[i] = picked ? sel[i].filter(function (x) { return x !== j; }) : sel[i].concat(j);
            else sel[i] = [j];
            draw();
          } }, h('b', {}, 'ABCDEFGH'[j]), h('span', { html: inline(o) })));
        });
        if (done && q.explain) box.appendChild(h('div', { class: 'vk-explain', html: inline(q.explain) }));
        body.appendChild(box);
      });
      var row = h('div', { class: 'vk-row' });
      if (!done) row.appendChild(btn('Check', function () {
        done = true;
        var score = qs.filter(ok).length;
        ctx.record({ score: score, total: qs.length, items: qs.map(function (q, i) {
          return { prompt: q.q, answer: sel[i].map(function (x) { return q.options[x]; }).join('; '), expected: right(q).map(function (x) { return q.options[x]; }).join('; '), correct: ok(q, i) };
        }) });
        draw();
      }, 'primary', sel.some(function (s) { return !s.length; })));
      else {
        row.appendChild(h('span', { class: 'vk-score' }, qs.filter(ok).length + ' / ' + qs.length + ' correct'));
        row.appendChild(btn('Try again', function () { sel = qs.map(function () { return []; }); done = false; draw(); }));
      }
      body.appendChild(row);
    }
    draw();
    return el;
  };

  B.flashcards = function (b, ctx) {
    var cards = b.cards, queue, flipped, first, el = card(b, 'Flashcards'), body = h('div', {});
    el.appendChild(body);
    function start() { queue = cards.map(function (_, i) { return i; }); if (b.shuffle) queue = shuffle(queue); flipped = false; first = {}; }
    function draw() {
      body.textContent = '';
      if (!queue.length) {
        var known = cards.filter(function (_, i) { return first[i] !== 'again'; }).length;
        ctx.record({ score: known, total: cards.length, items: cards.map(function (c, i) { return { prompt: c.front, expected: c.back, answer: first[i], correct: first[i] !== 'again' }; }) });
        body.appendChild(h('p', { class: 'vk-score' }, 'Done. ' + known + ' of ' + cards.length + ' known first time.'));
        body.appendChild(btn('Restart', function () { start(); draw(); }));
        return;
      }
      var i = queue[0], c = cards[i];
      body.appendChild(h('div', { class: 'vk-muted' }, queue.length + ' left'));
      body.appendChild(h('div', { class: 'vk-flash', onclick: function () { flipped = !flipped; draw(); } },
        h('div', {}, flipped ? h('span', { html: inline(c.back) }) : c.front, !flipped && c.hint && h('small', {}, c.hint),
          flipped && c.example && h('small', {}, c.example))));
      body.appendChild(h('div', { class: 'vk-row' }, !flipped ? btn('Flip', function () { flipped = true; draw(); }) : [
        btn('Again', function () { grade2('again'); }), btn('Good', function () { grade2('good'); }, 'primary')]));
      function grade2(g) {
        if (!first[i]) first[i] = g;
        queue.shift();
        if (g === 'again') queue.push(i);
        flipped = false; draw();
      }
    }
    start(); draw();
    return el;
  };

  B.cloze = function (b, ctx) {
    var blanks = [], parts = [], last = 0, m, re = /\[([^\]]+)\]/g, src = String(b.text);
    while ((m = re.exec(src))) { parts.push(src.slice(last, m.index)); parts.push(blanks.length); blanks.push(m[1].split('|')); last = re.lastIndex; }
    parts.push(src.slice(last));
    var vals = blanks.map(function () { return ''; }), checked = false, el = card(b, 'Fill the gaps'), body = h('div', {});
    el.appendChild(body);
    var bank = b.bank === false ? null : blanks.map(function (a) { return a[0]; }).sort(function (x, y) { return x.localeCompare(y); });
    function draw() {
      body.textContent = '';
      var p = h('div', { class: 'vk-text', style: 'white-space:pre-wrap;line-height:2' + (b.mono ? ';font-family:var(--vk-mono)' : '') });
      parts.forEach(function (x) {
        if (typeof x === 'string') return p.appendChild(document.createTextNode(x));
        var g = checked ? grade(vals[x], blanks[x]) : '';
        var inp = h('input', { type: 'text', class: 'vk-blank' + (g ? (g === 'bad' ? ' vk-bad' : ' vk-ok') : ''), disabled: checked, 'aria-label': 'gap ' + (x + 1) });
        inp.value = vals[x];
        inp.addEventListener('input', function () { vals[x] = inp.value; });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
        p.appendChild(inp);
        if (g === 'bad') p.appendChild(h('small', { class: 'vk-muted' }, ' (' + blanks[x][0] + ')'));
      });
      body.appendChild(p);
      if (bank && !checked) body.appendChild(h('div', { class: 'vk-row' }, bank.map(function (w) {
        return h('button', { class: 'vk-chip', onclick: function () {
          var k = vals.findIndex(function (v) { return !v; });
          if (k > -1) { vals[k] = w; draw(); }
        } }, w);
      })));
      var row = h('div', { class: 'vk-row' });
      if (!checked) row.appendChild(btn('Check', check, 'primary'));
      else {
        var n = blanks.filter(function (a, i) { return grade(vals[i], a) !== 'bad'; }).length;
        row.appendChild(h('span', { class: 'vk-score' }, n + ' / ' + blanks.length + ' correct'));
        row.appendChild(btn('Try again', function () { vals = blanks.map(function () { return ''; }); checked = false; draw(); }));
      }
      body.appendChild(row);
    }
    function check() {
      if (checked) return;
      checked = true;
      var n = 0;
      var items = blanks.map(function (a, i) {
        var g = grade(vals[i], a); if (g !== 'bad') n++;
        return { prompt: 'Gap ' + (i + 1), answer: vals[i], expected: a[0], correct: g !== 'bad' };
      });
      ctx.record({ score: n, total: blanks.length, items: items });
      draw();
    }
    draw();
    return el;
  };

  B.shortAnswer = function (b, ctx) {
    var qs = b.questions || [b], vals = qs.map(function () { return ''; }), hints = {}, checked = false;
    var el = card(b, qs.length > 1 ? 'Recall from memory' : 'Recall'), body = h('div', {});
    el.appendChild(body);
    function draw() {
      body.textContent = '';
      qs.forEach(function (q, i) {
        var g = checked ? grade(vals[i], q.answer) : '';
        var inp = h('input', { type: 'text', style: 'width:100%', class: g ? (g === 'bad' ? 'vk-bad' : 'vk-ok') : '', disabled: checked });
        inp.value = vals[i];
        inp.addEventListener('input', function () { vals[i] = inp.value; });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
        body.appendChild(h('div', { class: 'vk-q' }, h('p', { html: (qs.length > 1 ? (i + 1) + '. ' : '') + inline(q.q) }), inp,
          q.hint && !checked && h('div', { class: 'vk-muted' }, hints[i] ? 'Hint: ' + q.hint : h('a', { href: '#', onclick: function (e) { e.preventDefault(); hints[i] = 1; draw(); } }, 'Hint')),
          checked && h('div', { class: 'vk-explain' }, g === 'ok' ? '✓ Correct' : g === 'almost' ? '✓ Almost: ' + list(q.answer)[0] : '✗ Answer: ' + list(q.answer)[0], q.explain && ' ' + q.explain)));
      });
      body.appendChild(h('div', { class: 'vk-row' }, !checked ? btn('Check', check, 'primary') : [
        h('span', { class: 'vk-score' }, qs.filter(function (q, i) { return grade(vals[i], q.answer) !== 'bad'; }).length + ' / ' + qs.length),
        btn('Try again', function () { vals = qs.map(function () { return ''; }); checked = false; draw(); })]));
    }
    function check() {
      if (checked) return;
      checked = true;
      ctx.record({ total: qs.length, score: qs.filter(function (q, i) { return grade(vals[i], q.answer) !== 'bad'; }).length,
        items: qs.map(function (q, i) { return { prompt: q.q, answer: vals[i], expected: list(q.answer)[0], correct: grade(vals[i], q.answer) !== 'bad' }; }) });
      draw();
    }
    draw();
    return el;
  };

  B.match = function (b, ctx) {
    var pairs = b.pairs, order = shuffle(pairs.map(function (_, i) { return i; })), matched = {}, tries = {}, sel = null, err = null, el = card(b, 'Match'), body = h('div', {});
    el.appendChild(body);
    function draw() {
      body.textContent = '';
      var n = Object.keys(matched).length;
      var left = pairs.map(function (p, i) {
        return h('button', { class: 'vk-opt' + (matched[i] ? ' done' : sel === i ? ' sel' : err && err[0] === i ? ' bad' : ''), disabled: !!matched[i], onclick: function () { sel = i; err = null; draw(); } }, p.left);
      });
      var right = order.map(function (i) {
        return h('button', { class: 'vk-opt' + (matched[i] ? ' done' : err && err[1] === i ? ' bad' : ''), disabled: !!matched[i], onclick: function () {
          if (sel == null) return;
          if (sel === i) { matched[i] = 1; sel = null; err = null; }
          else { tries[sel] = (tries[sel] || 0) + 1; err = [sel, i]; }
          if (Object.keys(matched).length === pairs.length)
            ctx.record({ total: pairs.length, score: pairs.filter(function (_, k) { return !tries[k]; }).length,
              items: pairs.map(function (p, k) { return { prompt: p.left, expected: p.right, correct: !tries[k], note: (tries[k] || 0) + ' wrong tries' }; }) });
          draw();
        } }, p2(i));
      });
      function p2(i) { return pairs[i].right; }
      body.appendChild(h('div', { class: 'vk-muted' }, n === pairs.length ? 'All matched.' : 'Pick a term, then its match.'));
      body.appendChild(h('div', { class: 'vk-pair' }, h('div', {}, left), h('div', {}, right)));
      if (n === pairs.length) body.appendChild(h('div', { class: 'vk-row' }, btn('Again', function () { order = shuffle(order); matched = {}; tries = {}; sel = null; err = null; draw(); })));
    }
    draw();
    return el;
  };

  B.order = function (b, ctx) {
    var n = b.items.length, arr = shuffle(b.items.map(function (_, i) { return i; })), checked = false, drag = null;
    if (n > 1 && arr.every(function (v, i) { return v === i; })) arr.push(arr.shift());
    var el = card(b, 'Put in order'), body = h('div', {});
    el.appendChild(body);
    function move(from, to) { if (to < 0 || to >= n) return; arr.splice(to, 0, arr.splice(from, 1)[0]); draw(); }
    function draw() {
      body.textContent = '';
      body.appendChild(h('div', { class: 'vk-muted' }, b.instruction || 'Put the steps in the right order, first at the top.'));
      arr.forEach(function (v, pos) {
        var row = h('div', { class: 'vk-item' + (checked ? (v === pos ? ' vk-ok' : ' vk-bad') : ''), draggable: !checked,
          ondragstart: function () { drag = pos; }, ondragover: function (e) { e.preventDefault(); }, ondrop: function (e) { e.preventDefault(); if (drag != null) move(drag, pos); drag = null; } },
          h('span', { style: b.mono ? 'font-family:var(--vk-mono)' : '' }, b.items[v]),
          !checked && [btn('↑', function () { move(pos, pos - 1); }), btn('↓', function () { move(pos, pos + 1); })]);
        body.appendChild(row);
      });
      var good = arr.filter(function (v, i) { return v === i; }).length;
      body.appendChild(h('div', { class: 'vk-row' }, !checked ? btn('Check', function () {
        checked = true;
        ctx.record({ score: good, total: n, items: arr.map(function (v, i) { return { prompt: 'Position ' + (i + 1), answer: b.items[v], expected: b.items[i], correct: v === i }; }) });
        draw();
      }, 'primary') : [h('span', { class: 'vk-score' }, good + ' / ' + n + ' in place'), btn('Try again', function () { arr = shuffle(arr); checked = false; draw(); })]));
      if (checked && b.explain) body.appendChild(h('div', { class: 'vk-explain', html: inline(b.explain) }));
    }
    draw();
    return el;
  };

  B.sort = function (b, ctx) {
    var pick = b.items.map(function () { return null; }), checked = false, el = card(b, 'Sort'), body = h('div', {});
    el.appendChild(body);
    function draw() {
      body.textContent = '';
      b.items.forEach(function (it, i) {
        var good = pick[i] === it.cat;
        body.appendChild(h('div', { class: 'vk-item' + (checked ? (good ? ' vk-ok' : ' vk-bad') : ''), style: 'flex-wrap:wrap' },
          h('span', { style: b.mono ? 'font-family:var(--vk-mono)' : '' }, it.text),
          b.categories.map(function (c, k) {
            return h('button', { class: 'vk-chip' + (pick[i] === k ? ' vk-opt sel' : ''), disabled: checked, onclick: function () { pick[i] = k; draw(); } }, c);
          }),
          checked && !good && it.why && h('div', { class: 'vk-muted', style: 'width:100%' }, it.why)));
      });
      var score = b.items.filter(function (it, i) { return pick[i] === it.cat; }).length;
      body.appendChild(h('div', { class: 'vk-row' }, !checked ? btn('Check', function () {
        checked = true;
        ctx.record({ score: score, total: b.items.length, items: b.items.map(function (it, i) { return { prompt: it.text, answer: b.categories[pick[i]], expected: b.categories[it.cat], correct: pick[i] === it.cat }; }) });
        draw();
      }, 'primary', pick.some(function (p) { return p == null; })) : [h('span', { class: 'vk-score' }, score + ' / ' + b.items.length), btn('Try again', function () { pick = pick.map(function () { return null; }); checked = false; draw(); })]));
    }
    draw();
    return el;
  };

  /* checklist: ticks are remembered in the browser (a plan the user works through) */
  B.checklist = function (b, ctx) {
    var items = b.items.map(function (x) { return typeof x === 'string' ? { text: x } : x; });
    var saved = store('vk:chk:' + ns) || {}, done = saved[ctx.id] || items.map(function (i) { return !!i.done; });
    var el = card(b, 'Checklist'), body = h('div', {});
    el.appendChild(body);
    function draw() {
      body.textContent = '';
      var n = done.filter(Boolean).length;
      body.appendChild(h('div', { class: 'vk-muted' }, n + ' / ' + items.length + ' done'));
      body.appendChild(h('div', { class: 'vk-bar-top', style: 'margin:6px 0 10px' }, h('i', { style: 'width:' + Math.round(n / items.length * 100) + '%' })));
      items.forEach(function (it, i) {
        var cb = h('input', { type: 'checkbox' });
        cb.checked = !!done[i];
        cb.addEventListener('change', function () { done[i] = cb.checked; saved[ctx.id] = done; store('vk:chk:' + ns, saved); draw(); });
        body.appendChild(h('label', { class: 'vk-check' + (done[i] ? ' done' : '') }, cb,
          h('span', {}, h('span', { html: inline(it.text) }), it.note && h('small', { class: 'vk-muted' }, it.note))));
      });
    }
    draw();
    return el;
  };

  /* slides: a deck inside the page, with arrows/keys and fullscreen. Slides hold any blocks. */
  B.slides = function (b, ctx) {
    var slides = b.slides, i = 0, el = h('section', { class: 'vk-card vk-slides', tabindex: '0' });
    var stage = h('div', { class: 'vk-stage' }), count = h('span', { class: 'vk-muted' }), dots = h('div', { class: 'vk-dots' });
    var prev = btn('←', function () { go(i - 1); }), next = btn('→', function () { go(i + 1); }, 'primary');
    var full = btn('⛶', function () {
      if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen();
    });
    full.title = 'Fullscreen';
    el.appendChild(h('div', { class: 'vk-slides-top' }, h('span', { class: 'vk-pill' }, b.label || 'Slides'), b.title && h('b', {}, b.title), h('span', { style: 'flex:1' }), count, full));
    el.appendChild(stage);
    el.appendChild(h('div', { class: 'vk-slides-nav' }, prev, dots, next));
    function go(n) { if (n >= 0 && n < slides.length) { i = n; draw(); } }
    function draw() {
      var s = slides[i];
      stage.textContent = '';
      stage.className = 'vk-stage ' + (s.layout || '');
      if (s.title) stage.appendChild(h('h2', {}, s.title));
      if (s.body) stage.appendChild(h('div', { class: 'vk-text vk-lead', html: md(s.body) }));
      if (s.blocks) stage.appendChild(h('div', { class: 'vk-slide-body' }, s.blocks.map(function (x, k) { return renderBlock(x, k, ctx.id + '-' + i + '-'); })));
      count.textContent = (i + 1) + ' / ' + slides.length;
      dots.textContent = '';
      slides.forEach(function (_, k) { dots.appendChild(h('button', { class: 'vk-dot' + (k === i ? ' on' : ''), 'aria-label': 'Slide ' + (k + 1), onclick: function () { go(k); } })); });
      prev.disabled = i === 0; next.disabled = i === slides.length - 1;
    }
    el.addEventListener('keydown', function (e) {
      if (e.target.closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(i + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(i - 1); e.preventDefault(); }
    });
    draw();
    return el;
  };

  B.explainBack = function (b, ctx) {
    var el = card(b, 'Explain it back'), ta = h('textarea', { placeholder: 'In your own words…' }), out = h('div', {});
    var pts = b.keyPoints.map(function (p) { return typeof p === 'string' ? p : p.point; });
    el.appendChild(h('p', { html: inline(b.prompt) }));
    el.appendChild(ta);
    el.appendChild(h('div', { class: 'vk-row' }, btn('Compare with key points', function () {
      var ticks = pts.map(function () { return false; });
      out.textContent = '';
      out.appendChild(h('div', { class: 'vk-muted' }, 'Tick what you covered:'));
      pts.forEach(function (p, i) {
        var cb = h('input', { type: 'checkbox' });
        cb.addEventListener('change', function () { ticks[i] = cb.checked; });
        out.appendChild(h('label', { class: 'vk-item' }, cb, h('span', { html: inline(p) })));
      });
      out.appendChild(h('div', { class: 'vk-row' }, btn('Done', function () {
        ctx.record({ total: pts.length, score: ticks.filter(Boolean).length, items: [{ prompt: b.prompt, answer: ta.value, expected: pts.join('; '), correct: ticks.every(Boolean), needsReview: true }] });
        out.appendChild(h('span', { class: 'vk-score' }, ticks.filter(Boolean).length + ' / ' + pts.length + ' covered'));
      }, 'primary')));
    }, 'primary')));
    el.appendChild(out);
    return el;
  };

  /* ---------- auto-render <script class="vk" type="application/json"> ---------- */
  function auto() {
    var tags = document.querySelectorAll('script.vk[type="application/json"]');
    if (!tags.length) return;
    document.body.classList.add('vk-page');
    [].forEach.call(tags, function (t, n) {
      var host = h('div', {});
      t.parentNode.insertBefore(host, t.nextSibling);
      try { VK.render(host, JSON.parse(t.textContent), { prefix: 'p' + n + '-' }); }
      catch (e) { host.className = 'vk'; host.appendChild(h('div', { class: 'vk-card vk-error' }, '⚠ invalid JSON in <script class="vk">: ' + e.message)); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();

  /* ---------- multi-section lesson viewer ---------- */
  /* lesson.js:  VK.lesson({ title, sections: [{ id, title, file: 'sections/01.js' } | { id, title, blocks: [...] }] })
   * section file (.js): VK.section([ ...blocks ])     section file (.json): [ ...blocks ]  (needs http, not file://) */
  VK.section = function (blocks) { if (VK._resolve) VK._resolve(blocks); };
  VK.loadLesson = function (src) {
    var url = new URL(src, location.href);
    VK._base = url.href;
    if (/\.json$/i.test(url.pathname)) return fetch(url).then(function (r) { return r.json(); }).then(function (d) { VK.lesson(d); }).catch(fail);
    var s = h('script', { src: url.href }); s.onerror = fail;
    document.head.appendChild(s);
    function fail() { fatal('Could not load lesson "' + src + '". For .json files serve the folder over http (python3 -m http.server).'); }
  };
  function fatal(msg) {
    var root = document.getElementById('vk-lesson') || document.body;
    root.className = 'vk'; root.appendChild(h('div', { class: 'vk-card vk-error' }, '⚠ ' + msg));
  }
  function loadSection(s, base) {
    if (s.blocks) return Promise.resolve(s.blocks);
    var url = new URL(s.file, base);
    if (/\.json$/i.test(url.pathname)) return fetch(url).then(function (r) { return r.json(); });
    return new Promise(function (res, rej) {
      VK._resolve = function (b) { VK._resolve = null; res(b); };
      var sc = h('script', { src: url.href }); sc.onerror = function () { rej(new Error('cannot load ' + s.file)); };
      document.head.appendChild(sc);
    });
  }
  VK.lesson = function (def) {
    var root = document.getElementById('vk-lesson') || document.body, base = VK._base || location.href;
    var secs = def.sections.map(function (s, i) { s.id = s.id || 's' + (i + 1); return s; });
    document.title = def.title || 'Lesson';
    document.body.classList.add('vk-page');
    VK.setNamespace('lesson:' + (def.title || location.pathname));
    var seen = store('vk:seen:' + ns) || {}, cur = 0, token = 0;
    root.className = 'vk vk-lesson'; root.textContent = '';
    var toc = h('nav', { class: 'vk-toc' }), main = h('main', {});
    root.appendChild(toc); root.appendChild(main);
    function idx() { var i = secs.findIndex(function (s) { return s.id === location.hash.slice(1); }); return i < 0 ? Math.min(store('vk:last:' + ns) || 0, secs.length - 1) : i; }
    function go(i) { location.hash = secs[i].id; }
    function drawToc() {
      toc.textContent = '';
      toc.appendChild(h('h1', {}, def.title || 'Lesson'));
      secs.forEach(function (s, i) { toc.appendChild(h('a', { href: '#' + s.id, class: i === cur ? 'on' : '' }, (seen[s.id] ? '✓ ' : '') + (s.title || s.id))); });
      toc.appendChild(exportBar());
    }
    function show() {
      cur = idx(); var s = secs[cur], my = ++token;
      store('vk:last:' + ns, cur); seen[s.id] = 1; store('vk:seen:' + ns, seen);
      drawToc();
      main.textContent = '';
      main.appendChild(h('div', { class: 'vk-bar-top' }, h('i', { style: 'width:' + Math.round((cur + 1) / secs.length * 100) + '%' })));
      var body = h('div', {}, h('div', { class: 'vk-muted' }, 'Loading…'));
      main.appendChild(body);
      loadSection(s, base).then(function (blocks) {
        if (my !== token) return;
        VK.render(body, blocks, { prefix: s.id + '-', noExport: true });
        body.insertBefore(h('h2', { style: 'margin:0 0 14px;font-size:26px' }, s.title || s.id), body.firstChild);
        main.appendChild(h('div', { class: 'vk-nav' },
          cur > 0 ? btn('← ' + (secs[cur - 1].title || 'Back'), function () { go(cur - 1); }) : h('span'),
          cur < secs.length - 1 ? btn((secs[cur + 1].title || 'Next') + ' →', function () { go(cur + 1); }, 'primary') : h('span')));
        window.scrollTo(0, 0);
      }).catch(function (e) { if (my === token) body.textContent = '⚠ ' + e.message; });
    }
    window.addEventListener('hashchange', show);
    show();
  };
})();
