/* Animations for Class 11, Chapter 4: Chemical Bonding and Molecular Structure (ৰাসায়নিক বান্ধনি আৰু আণৱিক গঠন).
   Registered: lewis-builder, ionic-bond, bond-params, resonance, dipole, vsepr, overlap, hybridisation, mo-builder, h-bond
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  function opts(obj, fn) { return Object.keys(obj).map(function (key) { return { value: key, label: fn(obj[key], key) }; }); }
  var SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function sup(n) { return String(n).split('').map(function (c) { return SUPD.charAt(+c); }).join(''); }
  var VAL = { H: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, P: 5, S: 6, Cl: 7 };
  function arrow(s, g, x1, y1, x2, y2, color, w, hl) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len, hs = hl || 8;
    g.appendChild(s('line', { x1: x1, y1: y1, x2: x2 - ux * hs * 0.6, y2: y2 - uy * hs * 0.6, style: 'stroke:' + color + ';stroke-width:' + (w || 2) }));
    g.appendChild(s('polygon', { points: [x2, y2, x2 - ux * hs - uy * hs * 0.45, y2 - uy * hs + ux * hs * 0.45, x2 - ux * hs + uy * hs * 0.45, y2 - uy * hs - ux * hs * 0.45].join(' '), style: 'fill:' + color }));
  }

  /* ---- Lewis drawing helper: atoms {e,x,y,lp,unp,lab}, bonds [i,j,order] ---- */
  function placeLP(existing, n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var best = 0, bd = -1;
      for (var a = 0; a < 360; a += 15) {
        var t = a * Math.PI / 180, md = 9;
        existing.concat(out).forEach(function (e) { var d = Math.abs(Math.atan2(Math.sin(t - e), Math.cos(t - e))); if (d < md) md = d; });
        if (md > bd + 1e-9) { bd = md; best = t; }
      }
      out.push(best);
    }
    return out;
  }
  function bondSum(m, i) { var t = 0; m.bonds.forEach(function (b) { if (b[0] === i || b[1] === i) t += b[2]; }); return t; }
  function fcOf(m, i) { var a = m.atoms[i]; return VAL[a.e] - (2 * (a.lp || 0) + (a.unp || 0)) - bondSum(m, i); }
  function drawMol(s, g, m, o) {
    var sc = o.sc || 1, r = o.r || 10, fs = o.fs || 11, dot = o.dot || 1.8;
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    m.atoms.forEach(function (a) { x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
    var ox = o.cx != null ? o.cx - (x0 + x1) / 2 * sc : 0, oy = o.cy != null ? o.cy - (y0 + y1) / 2 * sc : 0;
    var P = m.atoms.map(function (a) { return { x: ox + a.x * sc, y: oy + a.y * sc }; });
    var ang = m.atoms.map(function () { return []; });
    m.bonds.forEach(function (b) {
      var a = P[b[0]], c = P[b[1]], dx = c.x - a.x, dy = c.y - a.y, len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len;
      ang[b[0]].push(Math.atan2(dy, dx)); ang[b[1]].push(Math.atan2(-dy, -dx));
      var order = o.skeleton ? 1 : b[2], n = Math.floor(order + 1e-6), frac = order - n > 0.01, tot = n + (frac ? 1 : 0), gap = 4 * Math.max(.75, sc);
      for (var q = 0; q < tot; q++) {
        var off = (q - (tot - 1) / 2) * gap, nx = -uy * off, ny = ux * off;
        g.appendChild(s('line', { x1: a.x + ux * r + nx, y1: a.y + uy * r + ny, x2: c.x - ux * r + nx, y2: c.y - uy * r + ny,
          style: 'stroke:var(--text);stroke-width:2;' + (q >= n ? 'stroke-dasharray:4 3;opacity:.8' : '') }));
      }
    });
    m.atoms.forEach(function (a, i) {
      var p = P[i];
      g.appendChild(s('circle', { cx: p.x, cy: p.y, r: r, style: 'fill:var(--brand-soft);stroke:var(--border);stroke-width:1' }));
      g.appendChild(txt(s, p.x, p.y + fs * 0.36, fs, 'middle', 'fill:var(--text)', a.e, 700));
      if (!o.skeleton && !o.noLP) {
        var an = placeLP(ang[i], a.lp || 0), un = placeLP(ang[i].concat(an), a.unp || 0);
        an.forEach(function (t) {
          var cx = p.x + Math.cos(t) * (r + 7), cy = p.y + Math.sin(t) * (r + 7), px = -Math.sin(t) * 3.2, py = Math.cos(t) * 3.2;
          [[cx + px, cy + py], [cx - px, cy - py]].forEach(function (d) { g.appendChild(s('circle', { cx: d[0], cy: d[1], r: dot, style: 'fill:var(--electron)' })); });
        });
        un.forEach(function (t) { g.appendChild(s('circle', { cx: p.x + Math.cos(t) * (r + 7), cy: p.y + Math.sin(t) * (r + 7), r: dot, style: 'fill:var(--accent)' })); });
      }
      var lab = null, col = 'var(--text)';
      if (a.lab != null) { lab = a.lab; col = 'var(--neg)'; }
      else if (o.fc) { var f = fcOf(m, i); if (f !== 0) { lab = (f > 0 ? '+' : '−') + Math.abs(f); col = f > 0 ? 'var(--pos)' : 'var(--neg)'; } }
      if (lab != null) g.appendChild(txt(s, p.x + r * 0.9, p.y - r * 0.9, Math.max(9, fs * 0.9), 'start', 'fill:' + col, lab, 700));
    });
    return P;
  }
  function frameBox(s, g, x, y, w, h) { g.appendChild(s('rect', { x: x, y: y, width: w, height: h, rx: 8, style: 'fill:none;stroke:var(--brand);stroke-width:2' })); }

  /* ================================================================== 1. Lewis structures */
  A.register('lewis-builder', function (root, k) {
    var h = k.h, s = k.s;
    function at(e, x, y, lp, unp) { return { e: e, x: x, y: y, lp: lp || 0, unp: unp || 0 }; }
    var M = [
      { f: 'H₂O', n: [L('পানী', 'water'), 'water'], ch: 0, atoms: [at('O', 210, 55, 2), at('H', 155, 120), at('H', 265, 120)], bonds: [[0, 1, 1], [0, 2, 1]] },
      { f: 'NH₃', n: ['', 'ammonia'], ch: 0, atoms: [at('N', 210, 55, 1), at('H', 145, 120), at('H', 210, 135), at('H', 275, 120)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
      { f: 'CH₄', n: ['', 'methane'], ch: 0, atoms: [at('C', 210, 90), at('H', 210, 30), at('H', 150, 90), at('H', 270, 90), at('H', 210, 150)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
      { f: 'CO₂', n: ['', 'carbon dioxide'], ch: 0, atoms: [at('O', 130, 90, 2), at('C', 210, 90), at('O', 290, 90, 2)], bonds: [[0, 1, 2], [1, 2, 2]] },
      { f: 'N₂', n: ['', 'nitrogen'], ch: 0, atoms: [at('N', 170, 90, 1), at('N', 250, 90, 1)], bonds: [[0, 1, 3]] },
      { f: 'CO', n: ['', 'carbon monoxide'], ch: 0, atoms: [at('C', 170, 90, 1), at('O', 250, 90, 1)], bonds: [[0, 1, 3]] },
      { f: 'NO₂⁻', n: ['', 'nitrite ion'], ch: -1, atoms: [at('N', 210, 55, 1), at('O', 150, 120, 2), at('O', 270, 120, 3)], bonds: [[0, 1, 2], [0, 2, 1]] },
      { f: 'CO₃²⁻', n: ['', 'carbonate ion'], ch: -2, atoms: [at('C', 210, 90), at('O', 210, 30, 2), at('O', 150, 135, 3), at('O', 270, 135, 3)], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1]] },
      { f: 'O₃', n: ['', 'ozone'], ch: 0, atoms: [at('O', 210, 55, 1), at('O', 150, 120, 2), at('O', 270, 120, 3)], bonds: [[0, 1, 2], [0, 2, 1]] },
      { f: 'NH₄⁺', n: ['', 'ammonium ion'], ch: 1, atoms: [at('N', 210, 90), at('H', 210, 30), at('H', 150, 90), at('H', 270, 90), at('H', 210, 150)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
      { f: 'BF₃', n: ['', 'boron trifluoride'], ch: 0, atoms: [at('B', 210, 85), at('F', 210, 25, 3), at('F', 150, 130, 3), at('F', 270, 130, 3)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
      { f: 'PCl₅', n: ['', 'phosphorus pentachloride'], ch: 0, atoms: [at('P', 210, 90), at('Cl', 210, 22, 3), at('Cl', 140, 62, 3), at('Cl', 280, 62, 3), at('Cl', 160, 152, 3), at('Cl', 260, 152, 3)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1]] },
      { f: 'NO', n: ['', 'nitric oxide'], ch: 0, atoms: [at('N', 170, 90, 1, 1), at('O', 250, 90, 2)], bonds: [[0, 1, 2]] }
    ];
    var NAMES = { 'H₂O': 'পানী', 'NH₃': 'এমনিয়া', 'CH₄': 'মিথেন', 'CO₂': 'কাৰ্বন ডাই-অক্সাইড', 'N₂': 'নাইট্ৰজেন', 'CO': 'কাৰ্বন মন\'ক্সাইড', 'NO₂⁻': 'নাইট্ৰাইট আয়ন', 'CO₃²⁻': 'কাৰ্বনেট আয়ন', 'O₃': 'অ\'জ\'ন', 'NH₄⁺': 'এম\'নিয়াম আয়ন', 'BF₃': 'বৰণ ট্ৰাইফ্লুৰাইড', 'PCl₅': 'ফছফৰাছ পেণ্টাক্ল\'ৰাইড', 'NO': 'নাইট্ৰিক অক্সাইড' };
    var st = { m: 0, v: 2 };
    var svg = s('svg', { viewBox: '0 0 420 180', 'class': 'anim-svg', role: 'img', 'aria-label': L('লিউইছ ইলেক্ট্ৰন ফুট গঠন', 'Lewis dot structure') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var m = M[st.m]; svg.innerHTML = '';
      var g = s('g', {}); svg.appendChild(g);
      drawMol(s, g, m, { skeleton: st.v === 0, fc: st.v === 2, cx: 210, cy: 90 });
      var V = m.atoms.map(function (a) { return VAL[a.e]; }), tot = V.reduce(function (a, b) { return a + b; }, 0) - m.ch;
      var bp = m.bonds.reduce(function (a, b) { return a + b[2]; }, 0), lp = m.atoms.reduce(function (a, b) { return a + (b.lp || 0); }, 0), un = m.atoms.reduce(function (a, b) { return a + (b.unp || 0); }, 0);
      var name = L(NAMES[m.f], m.n[1]);
      var h1 = '<b>' + m.f + '</b> (' + name + ')<br>' + L('মুঠ যোজ্যতা ইলেক্ট্ৰন', 'Total valence electrons') + ' = ' + V.join(' + ') + (m.ch ? (m.ch < 0 ? ' + ' + (-m.ch) : ' − ' + m.ch) : '') + ' = <b>' + tot + '</b>';
      if (st.v === 0) h1 += '<br>' + L('প্ৰথমে কংকাল আঁকোঁ: কেন্দ্ৰীয় পৰমাণুৰ চাৰিওফালে আন পৰমাণু; প্ৰতিটো বান্ধনিত এযোৰ ইলেক্ট্ৰন।', 'First draw the skeleton: the other atoms around the central atom, one electron pair for each bond.');
      else {
        h1 += '<br>' + L('বান্ধনি যোৰ', 'Bond pairs') + ' = ' + bp + ' · ' + L('একাকী যোৰ', 'Lone pairs') + ' = ' + lp + (un ? ' · ' + L('অযুগ্ম ইলেক্ট্ৰন', 'Unpaired electrons') + ' = ' + un : '') + ' → 2(' + bp + ' + ' + lp + ')' + (un ? ' + ' + un : '') + ' = ' + (2 * (bp + lp) + un);
        var issues = [];
        m.atoms.forEach(function (a, i) {
          var e = 2 * (a.lp || 0) + (a.unp || 0) + 2 * bondSum(m, i);
          if (a.e === 'H') return;
          if (a.unp) issues.push(a.e + ': ' + L('অযুগ্ম ইলেক্ট্ৰন — অষ্টক অসম্পূৰ্ণ (' + e + ' ইলেক্ট্ৰন)', 'odd electron — octet not complete (' + e + ' electrons)'));
          else if (e < 8) issues.push(a.e + ': ' + L('অসম্পূৰ্ণ অষ্টক (' + e + ' ইলেক্ট্ৰন)', 'incomplete octet (' + e + ' electrons)'));
          else if (e > 8) issues.push(a.e + ': ' + L('সম্প্ৰসাৰিত অষ্টক (' + e + ' ইলেক্ট্ৰন)', 'expanded octet (' + e + ' electrons)'));
        });
        h1 += '<br>' + (issues.length ? L('অষ্টক নিয়মৰ ব্যতিক্ৰম — ', 'Exception to the octet rule — ') + issues.join('; ') : L('সকলো পৰমাণুৰ অষ্টক (H ৰ দ্বিক) পূৰ্ণ।', 'Every atom has a complete octet (duet for H).'));
      }
      if (st.v === 2) {
        var parts = [];
        m.atoms.forEach(function (a, i) {
          var f = fcOf(m, i);
          if (a.e === 'H' && f === 0) return;
          parts.push(a.e + ': ' + VAL[a.e] + ' − ' + (2 * (a.lp || 0) + (a.unp || 0)) + ' − ½×' + (2 * bondSum(m, i)) + ' = ' + (f > 0 ? '+' : (f < 0 ? '−' : '')) + Math.abs(f));
        });
        h1 += '<br>' + L('ফৰ্মেল আধান = V − L − ½B → ', 'Formal charge = V − L − ½B → ') + parts.join('; ') + '<br>' + L('ফৰ্মেল আধানৰ সমষ্টি = ', 'Sum of formal charges = ') + m.ch;
      }
      info.innerHTML = h1;
    }
    var ms = k.select('Species', M.map(function (m, i) { return { value: i, label: m.f }; }), st.m, function (v) { st.m = +v; paint(); });
    var vs = k.select('View', [{ value: 0, label: 'Skeleton' }, { value: 1, label: 'Lewis structure' }, { value: 2, label: '+ Formal charges' }], st.v, function (v) { st.v = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [ms.el, vs.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. ionic bond formation */
  A.register('ionic-bond', function (root, k) {
    var h = k.h, s = k.s;
    var P = {
      nacl: { f: 'NaCl', c: 'Na', a: 'Cl', ec: 1, ea: 7, nc: 1, na: 1, qc: 1, qa: 1,
        cc: '[Ne] 3s¹', cci: '[Ne]', ac: '[Ne] 3s² 3p⁵', aci: '[Ne] 3s² 3p⁶ = [Ar]' },
      mgo: { f: 'MgO', c: 'Mg', a: 'O', ec: 2, ea: 6, nc: 1, na: 1, qc: 2, qa: 2,
        cc: '[Ne] 3s²', cci: '[Ne]', ac: '[He] 2s² 2p⁴', aci: '[He] 2s² 2p⁶ = [Ne]' },
      caf2: { f: 'CaF₂', c: 'Ca', a: 'F', ec: 2, ea: 7, nc: 1, na: 2, qc: 2, qa: 1,
        cc: '[Ar] 4s²', cci: '[Ar]', ac: '[He] 2s² 2p⁵', aci: '[He] 2s² 2p⁶ = [Ne]' },
      k2s: { f: 'K₂S', c: 'K', a: 'S', ec: 1, ea: 6, nc: 2, na: 1, qc: 1, qa: 2,
        cc: '[Ar] 4s¹', cci: '[Ar]', ac: '[Ne] 3s² 3p⁴', aci: '[Ne] 3s² 3p⁶ = [Ar]' }
    };
    var SLOT = [0, 4, 2, 6, 1, 5, 3, 7];
    var st = { p: 'nacl', t: 0, run: false };
    var svg = s('svg', { viewBox: '0 0 420 320', 'class': 'anim-svg', role: 'img', 'aria-label': L('আয়নীয় বান্ধনিৰ গঠন: ইলেক্ট্ৰনৰ স্থানান্তৰ', 'Ionic bond formation: electron transfer') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function slotPos(cx, cy, r, i) { var t = (-90 + i * 45) * Math.PI / 180; return [cx + Math.cos(t) * r, cy + Math.sin(t) * r]; }
    function paint() {
      var d = P[st.p], p = st.t; svg.innerHTML = '';
      var cats = d.nc === 1 ? [[85, 75]] : [[85, 40], [85, 115]];
      var ans = d.na === 1 ? [[335, 75]] : [[335, 40], [335, 115]];
      var rc = 30 - 9 * p, ra = 30 + 4 * p, free = 8 - d.ea, moves = [], ai = 0, fs = 0;
      cats.forEach(function (c, ci) {
        for (var e = 0; e < d.ec; e++) {
          var to = ans[ai], slot = d.ea + fs;
          moves.push({ ci: ci, e: e, from: slotPos(c[0], c[1], rc, SLOT[e]), to: slotPos(to[0], to[1], ra, SLOT[slot]) });
          fs++; if (fs === free) { fs = 0; ai++; }
        }
      });
      var gl = s('g', {}); svg.appendChild(gl);
      [].concat(cats.map(function (c) { return [c, 0]; }), ans.map(function (c) { return [c, 1]; })).forEach(function (cc) {
        var c = cc[0], an = cc[1], r = an ? ra : rc, col = an ? 'var(--neg)' : 'var(--pos)';
        gl.appendChild(s('circle', { cx: c[0], cy: c[1], r: r, style: 'fill:none;stroke:' + (p > .99 ? col : 'var(--border)') + ';stroke-width:' + (p > .99 ? 2 : 1) + ';stroke-dasharray:' + (p > .99 ? 'none' : '3 3') }));
        gl.appendChild(s('circle', { cx: c[0], cy: c[1], r: 12, style: 'fill:var(--brand-soft);stroke:var(--border)' }));
        gl.appendChild(txt(s, c[0], c[1] + 4, 11, 'middle', 'fill:var(--text)', an ? d.a : d.c, 700));
        if (p > .99) gl.appendChild(txt(s, c[0], c[1] - r - 5, 12, 'middle', 'fill:' + col, an ? d.a + (d.qa > 1 ? sup(d.qa) : '') + '⁻' : d.c + (d.qc > 1 ? sup(d.qc) : '') + '⁺', 700));
      });
      /* resident electrons */
      cats.forEach(function (c, ci) {
        for (var e = 0; e < d.ec; e++) {
          var mv = moves.filter(function (m) { return m.ci === ci && m.e === e; })[0], q = slotPos(c[0], c[1], rc, SLOT[e]);
          if (p > 0) q = null;
          if (q) gl.appendChild(s('circle', { cx: q[0], cy: q[1], r: 3.2, style: 'fill:var(--electron)' }));
          else { var x = mv.from[0] + (mv.to[0] - mv.from[0]) * p, y = mv.from[1] + (mv.to[1] - mv.from[1]) * p; gl.appendChild(s('circle', { cx: x, cy: y, r: 3.4, style: 'fill:var(--accent)' })); }
        }
      });
      ans.forEach(function (c) { for (var e = 0; e < d.ea; e++) { var q = slotPos(c[0], c[1], ra, SLOT[e]); gl.appendChild(s('circle', { cx: q[0], cy: q[1], r: 3.2, style: 'fill:var(--electron)' })); } });
      /* ledger */
      if (st.p === 'nacl') {
        var rows = [[L('Na → Na⁺ + e⁻ (আয়নীকৰণ এনথালপি)', 'Na → Na⁺ + e⁻ (ionisation enthalpy)'), 495.8], [L('Cl + e⁻ → Cl⁻ (ইলেক্ট্ৰন গ্ৰহণ এনথালপি)', 'Cl + e⁻ → Cl⁻ (electron gain enthalpy)'), -348.7],
          [L('যোগফল', 'Sum'), 147.1], [L('Na⁺ + Cl⁻ → NaCl(s) (লেটিছ গঠন)', 'Na⁺ + Cl⁻ → NaCl(s) (lattice formation)'), -788], [L('এই তিনিটা পদৰ মুঠ', 'Total of these three steps'), -640.9]];
        var z = 300, sc = 0.2;
        svg.appendChild(s('line', { x1: z, y1: 150, x2: z, y2: 312, style: 'stroke:var(--muted);stroke-width:1' }));
        rows.forEach(function (r, i) {
          var y = 160 + i * 30, w = Math.abs(r[1]) * sc;
          svg.appendChild(txt(s, 6, y + 8, 10, 'start', 'fill:var(--muted)', r[0]));
          svg.appendChild(s('rect', { x: r[1] > 0 ? z : z - w, y: y + 12, width: w * Math.min(1, p * 1.5), height: 10, rx: 2, style: 'fill:' + (r[1] > 0 ? 'var(--proton)' : 'var(--electron)') + ';opacity:.8' }));
          if (p > .99) svg.appendChild(txt(s, r[1] > 0 ? z + w + 4 : z - w - 4, y + 21, 10, r[1] > 0 ? 'start' : 'end', 'fill:var(--text)', (r[1] > 0 ? '+' : '−') + Math.abs(r[1]).toFixed(1), 700));
        });
        svg.appendChild(txt(s, 410, 152, 9, 'end', 'fill:var(--muted)', 'kJ mol⁻¹'));
      } else {
        svg.appendChild(txt(s, 210, 200, 12, 'middle', 'fill:var(--text)', L('প্ৰতিটো ' + d.c + ' ই ' + d.ec + 'টা ইলেক্ট্ৰন এৰি দিয়ে; প্ৰতিটো ' + d.a + ' এ ' + (8 - d.ea) + 'টা ইলেক্ট্ৰন লয়।', 'Each ' + d.c + ' gives up ' + d.ec + ' electron' + (d.ec > 1 ? 's' : '') + '; each ' + d.a + ' takes ' + (8 - d.ea) + '.'), 600));
        svg.appendChild(txt(s, 210, 226, 11, 'middle', 'fill:var(--muted)', L('মুঠ ' + d.nc * d.ec + 'টা ইলেক্ট্ৰনৰ স্থানান্তৰ', 'Total electrons transferred: ' + d.nc * d.ec)));
        svg.appendChild(txt(s, 210, 250, 10, 'middle', 'fill:var(--muted)', L('পাঠ্যপুথিত শক্তিৰ মান NaCl ৰ বাবেহে দিয়া আছে।', 'The book gives the energy values for NaCl only.')));
      }
      var done = p > .99;
      var e1 = d.c + ' (' + d.cc + ') → ' + d.c + (d.qc > 1 ? sup(d.qc) : '') + '⁺ (' + d.cci + ') + ' + (d.qc > 1 ? d.qc : '') + 'e⁻';
      var e2 = d.a + ' (' + d.ac + ') + ' + (d.qa > 1 ? d.qa : '') + 'e⁻ → ' + d.a + (d.qa > 1 ? sup(d.qa) : '') + '⁻ (' + d.aci + ')';
      info.innerHTML = '<b>' + d.f + '</b>: ' + e1 + '<br>' + e2 + '<br>' + (done ?
        L('ইলেক্ট্ৰ\'যোজ্যতা: ' + d.c + ' = +' + d.qc + ', ' + d.a + ' = −' + d.qa + '। বিপৰীত আধানৰ আয়নবোৰ স্থিতিবিদ্যুতিক আকৰ্ষণত বান্ধ খায়; আয়ন-যুগ্মৰ পৰা ক্ৰিষ্টেল লেটিছ গঠন হয়।', 'Electrovalence: ' + d.c + ' = +' + d.qc + ', ' + d.a + ' = −' + d.qa + '. Oppositely charged ions are held by electrostatic attraction and pack into a crystal lattice.') :
        L('"ইলেক্ট্ৰন স্থানান্তৰ কৰক" টিপক — ধনাত্মক আয়ন সৰু আৰু ঋণাত্মক আয়ন ডাঙৰ হয়।', 'Press "Transfer electrons" — the cation shrinks and the anion grows.'));
    }
    var lp = k.loop(root, function (dt) {
      if (!st.run) return;
      st.t = Math.min(1, st.t + dt * .6);
      if (st.t >= 1) st.run = false;
      paint();
    });
    var sel = k.select('Compound', opts(P, function (v) { return v.f; }), st.p, function (v) { st.p = v; st.t = 0; st.run = false; paint(); });
    var go = k.button('Transfer electrons', function () { if (k.reduceMotion) { st.t = 1; paint(); return; } st.t = 0; st.run = true; lp.start(); }, 'primary');
    var rs = k.button('Reset', function () { st.t = 0; st.run = false; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, go, rs]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. bond parameters */
  A.register('bond-params', function (root, k) {
    var h = k.h, s = k.s;
    var R = { H: 37, C: 77, N: 74, O: 66, F: 64, Cl: 99, Br: 114, I: 133, S: 104 };
    /* pairs: [A, B, observed length pm] — Tables 4.2 and 4.3 of the book */
    var PAIRS = [['C', 'C', 154], ['C', 'H', 107], ['O', 'H', 96], ['N', 'H', 103], ['C', 'O', 143], ['C', 'Cl', 177], ['C', 'I', 213], ['H', 'H', 74], ['H', 'F', 92], ['H', 'Cl', 127], ['H', 'Br', 141], ['H', 'I', 160], ['F', 'F', 144], ['Cl', 'Cl', 199], ['Br', 'Br', 228], ['I', 'I', 267]];
    var SER = {
      cc: [L('C–C, C=C, C≡C', 'C–C, C=C, C≡C'), [['C–C', 1, 154], ['C=C', 2, 133], ['C≡C', 3, 120]]],
      cn: [L('C–N, C=N, C≡N', 'C–N, C=N, C≡N'), [['C–N', 1, 143], ['C=N', 2, 138], ['C≡N', 3, 116]]],
      co: [L('C–O, C=O', 'C–O, C=O'), [['C–O', 1, 143], ['C=O', 2, 121]]],
      di: [L('H₂, O₂, N₂ (দৈৰ্ঘ্য + এনথালপি)', 'H₂, O₂, N₂ (length + enthalpy)'), [['H–H', 1, 74, 435.8], ['O=O', 2, 121, 498], ['N≡N', 3, 109, 946.0]]]
    };
    var keys = [];
    var st = { v: 'p0' };
    var svg = s('svg', { viewBox: '0 0 420 190', 'class': 'anim-svg', role: 'img', 'aria-label': L('বান্ধনি দৈৰ্ঘ্য আৰু বান্ধনি মাত্ৰা', 'Bond length and bond order') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      if (st.v.charAt(0) === 'p') {
        var pr = PAIRS[+st.v.slice(1)], ra = R[pr[0]], rb = R[pr[1]], sc = .55, d = pr[2] * sc, cx = 210 - d / 2, cy = 90;
        svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('বৃত্তৰ ব্যাসাৰ্ধ = সহযোজী ব্যাসাৰ্ধ; কেন্দ্ৰ দুটাৰ দূৰত্ব = পৰীক্ষালব্ধ বান্ধনি দৈৰ্ঘ্য', 'Circle radius = covalent radius; centre distance = observed bond length')));
        svg.appendChild(s('circle', { cx: cx, cy: cy, r: ra * sc, style: 'fill:var(--electron);opacity:.35;stroke:var(--electron)' }));
        svg.appendChild(s('circle', { cx: cx + d, cy: cy, r: rb * sc, style: 'fill:var(--proton);opacity:.35;stroke:var(--proton)' }));
        svg.appendChild(s('line', { x1: cx, y1: cy, x2: cx + d, y2: cy, style: 'stroke:var(--text);stroke-width:2' }));
        svg.appendChild(txt(s, cx, cy + 4, 12, 'middle', 'fill:var(--text)', pr[0], 700));
        svg.appendChild(txt(s, cx + d, cy + 4, 12, 'middle', 'fill:var(--text)', pr[1], 700));
        svg.appendChild(txt(s, cx, 168, 10, 'middle', 'fill:var(--muted)', 'r = ' + ra + ' pm'));
        svg.appendChild(txt(s, cx + d, 168, 10, 'middle', 'fill:var(--muted)', 'r = ' + rb + ' pm'));
        svg.appendChild(txt(s, 210, 184, 11, 'middle', 'fill:var(--text)', L('বান্ধনি দৈৰ্ঘ্য = ', 'Bond length = ') + pr[2] + ' pm', 700));
        var sum = ra + rb, df = pr[2] - sum;
        info.innerHTML = '<b>' + pr[0] + '–' + pr[1] + '</b>: r<sub>' + pr[0] + '</sub> + r<sub>' + pr[1] + '</sub> = ' + ra + ' + ' + rb + ' = <b>' + sum + ' pm</b>; ' + L('পৰীক্ষালব্ধ', 'observed') + ' = ' + pr[2] + ' pm (' + (df >= 0 ? '+' : '−') + Math.abs(df) + ' pm)<br>' + L('R = r_A + r_B এক আনুমানিক নিয়ম; ধ্ৰুৱীয় বান্ধনিত প্ৰকৃত দৈৰ্ঘ্য সাধাৰণতে অলপ কম হয়।', 'R = r_A + r_B is only a rule of thumb; polar bonds are usually somewhat shorter than the sum.');
      } else {
        var se = SER[st.v], rows = se[1], hasE = rows[0].length > 3;
        svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('বান্ধনি মাত্ৰা যিমান বেছি, বান্ধনি দৈৰ্ঘ্য সিমান কম', 'The higher the bond order, the shorter the bond') + (hasE ? L(' আৰু বান্ধনি এনথালপি সিমান বেছি', ' and the larger the bond enthalpy') : '')));
        rows.forEach(function (r, i) {
          var y = 28 + i * (hasE ? 50 : 40);
          svg.appendChild(txt(s, 58, y + 14, 13, 'end', 'fill:var(--text)', r[0], 700));
          svg.appendChild(s('rect', { x: 66, y: y, width: r[2] / 160 * 200, height: 16, rx: 3, style: 'fill:var(--electron);opacity:.8' }));
          svg.appendChild(txt(s, 66 + r[2] / 160 * 200 + 5, y + 12, 10, 'start', 'fill:var(--text)', r[2] + ' pm', 700));
          if (hasE) {
            svg.appendChild(s('rect', { x: 66, y: y + 19, width: r[3] / 946 * 200, height: 16, rx: 3, style: 'fill:var(--proton);opacity:.8' }));
            svg.appendChild(txt(s, 66 + r[3] / 946 * 200 + 5, y + 31, 10, 'start', 'fill:var(--text)', r[3].toFixed(1) + ' kJ/mol', 700));
          }
        });
        info.innerHTML = '<b>' + se[0] + '</b><br>' + L('বান্ধনি মাত্ৰা: ', 'Bond order: ') + rows.map(function (r) { return r[0] + ' = ' + r[1]; }).join(', ') + '<br>' + (hasE ?
          L('বান্ধনি মাত্ৰা বঢ়িলে দৈৰ্ঘ্য কমে আৰু ভাঙিবলৈ বেছি শক্তি লাগে — N₂ ৰ 946.0 kJ/mol।', 'Higher order → shorter and harder to break — 946.0 kJ/mol for N₂.') :
          L('একাধিক বান্ধনি থাকিলে দুটা পৰমাণু ওচৰ চাপি আহে।', 'Multiple bonds pull the two atoms closer.'));
      }
    }
    var o = PAIRS.map(function (p, i) { return { value: 'p' + i, label: L('ব্যাসাৰ্ধ: ', 'Radii: ') + p[0] + '–' + p[1] }; });
    Object.keys(SER).forEach(function (key) { o.push({ value: key, label: L('মাত্ৰা: ', 'Order: ') + SER[key][0] }); });
    var sel = k.select('Bond', o, st.v, function (v) { st.v = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. resonance */
  A.register('resonance', function (root, k) {
    var h = k.h, s = k.s;
    function at(e, x, y, lp, lab) { return { e: e, x: x, y: y, lp: lp || 0, lab: lab }; }
    var SP = {
      o3: { f: 'O₃', forms: [
        { atoms: [at('O', 130, 110, 2), at('O', 210, 50, 1), at('O', 290, 110, 3)], bonds: [[0, 1, 2], [1, 2, 1]] },
        { atoms: [at('O', 130, 110, 3), at('O', 210, 50, 1), at('O', 290, 110, 2)], bonds: [[0, 1, 1], [1, 2, 2]] }],
        hyb: { atoms: [at('O', 130, 110, 0, '−½'), at('O', 210, 50, 0, '+1'), at('O', 290, 110, 0, '−½')], bonds: [[0, 1, 1.5], [1, 2, 1.5]] },
        data: [L('O–O একবান্ধনি 148 pm, O=O দ্বিবান্ধনি 121 pm; O₃ ত দুয়োটা বান্ধনিয়ে 128 pm — মাজামাজি, সমান।', 'O–O single bond 148 pm, O=O double bond 121 pm; in O₃ both bonds are 128 pm — intermediate and equal.'), L('বান্ধনি মাত্ৰা = (1 + 2)/2 = 1.5', 'Bond order = (1 + 2)/2 = 1.5')] },
      co3: { f: 'CO₃²⁻', forms: [
        { atoms: [at('C', 210, 90), at('O', 210, 30, 2), at('O', 150, 135, 3), at('O', 270, 135, 3)], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1]] },
        { atoms: [at('C', 210, 90), at('O', 210, 30, 3), at('O', 150, 135, 2), at('O', 270, 135, 3)], bonds: [[0, 1, 1], [0, 2, 2], [0, 3, 1]] },
        { atoms: [at('C', 210, 90), at('O', 210, 30, 3), at('O', 150, 135, 3), at('O', 270, 135, 2)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 2]] }],
        hyb: { atoms: [at('C', 210, 90), at('O', 210, 30, 0, '−⅔'), at('O', 150, 135, 0, '−⅔'), at('O', 270, 135, 0, '−⅔')], bonds: [[0, 1, 4 / 3], [0, 2, 4 / 3], [0, 3, 4 / 3]] },
        data: [L('পৰীক্ষাত তিনিটা C–O বান্ধনি সমান — কোনো একবান্ধনি বা দ্বিবান্ধনি পৃথকে ধৰা নপৰে।', 'Experimentally all three C–O bonds are identical — no separate single or double bond can be found.'), L('বান্ধনি মাত্ৰা = (2 + 1 + 1)/3 = 4/3 ≈ 1.33', 'Bond order = (2 + 1 + 1)/3 = 4/3 ≈ 1.33')] },
      co2: { f: 'CO₂', forms: [
        { atoms: [at('O', 130, 90, 2), at('C', 210, 90), at('O', 290, 90, 2)], bonds: [[0, 1, 2], [1, 2, 2]] },
        { atoms: [at('O', 130, 90, 1), at('C', 210, 90), at('O', 290, 90, 3)], bonds: [[0, 1, 3], [1, 2, 1]] },
        { atoms: [at('O', 130, 90, 3), at('C', 210, 90), at('O', 290, 90, 1)], bonds: [[0, 1, 1], [1, 2, 3]] }],
        hyb: { atoms: [at('O', 130, 90, 0, 'δ−'), at('C', 210, 90, 0, '2δ+'), at('O', 290, 90, 0, 'δ−')], bonds: [[0, 1, 2], [1, 2, 2]] },
        data: [L('C=O দ্বিবান্ধনি 121 pm, C≡O ত্ৰিবান্ধনি 110 pm; CO₂ ত পৰীক্ষালব্ধ C–O দৈৰ্ঘ্য 115 pm।', 'C=O double bond 121 pm, C≡O triple bond 110 pm; in CO₂ the observed C–O length is 115 pm.'), L('গঠন I (O=C=O) সবাতোকৈ সুস্থিৰ; II আৰু III ত O ৰ ফৰ্মেল আধান বিপৰীত — শক্তি বেছি, অৱদান কম।', 'Structure I (O=C=O) is the most stable; in II and III the oxygens carry opposite formal charges — higher energy, smaller contribution.')] }
    };
    var st = { sp: 'o3', i: 0 };
    var svg = s('svg', { viewBox: '0 0 420 270', 'class': 'anim-svg', role: 'img', 'aria-label': L('সংস্পন্দন গঠন আৰু সংস্পন্দন সংকৰ', 'Resonance structures and resonance hybrid') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var d = SP[st.sp], n = d.forms.length; svg.innerHTML = '';
      var wslot = 420 / n;
      d.forms.forEach(function (f, i) {
        var cx = wslot * (i + .5), g = s('g', {}); svg.appendChild(g);
        if (i === st.i) frameBox(s, g, cx - wslot / 2 + 6, 6, wslot - 12, 104);
        drawMol(s, g, f, { sc: .6, r: 8, fs: 9, dot: 1.3, fc: true, cx: cx, cy: 58 });
        if (i < n - 1) svg.appendChild(txt(s, wslot * (i + 1), 62, 16, 'middle', 'fill:var(--muted)', '↔'));
        svg.appendChild(txt(s, cx, 124, 10, 'middle', 'fill:var(--muted)', L('গঠন ', 'Structure ') + ['I', 'II', 'III'][i]));
      });
      svg.appendChild(txt(s, 210, 146, 16, 'middle', 'fill:var(--muted)', '↓'));
      svg.appendChild(txt(s, 210, 160, 11, 'middle', 'fill:var(--text)', L('সংস্পন্দন সংকৰ (বাস্তৱ গঠন)', 'Resonance hybrid (the real structure)'), 700));
      var g2 = s('g', {}); svg.appendChild(g2);
      drawMol(s, g2, d.hyb, { sc: .8, r: 9, fs: 10, dot: 1.5, cx: 210, cy: 210 });
      info.innerHTML = '<b>' + d.f + '</b><br>' + d.data[0] + '<br>' + d.data[1];
    }
    var sel = k.select('Species', opts(SP, function (v) { return v.f; }), st.sp, function (v) { st.sp = v; st.i = 0; paint(); });
    var nx = k.button('Next structure', function () { st.i = (st.i + 1) % SP[st.sp].forms.length; paint(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, nx]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. dipole moment */
  A.register('dipole', function (root, k) {
    var h = k.h, s = k.s;
    var M1 = 1.51;   /* O–H bond moment (D) that reproduces 1.85 D at 104.5° */
    function mk(f, mu, name, cen, ligs, res, note) { return { f: f, mu: mu, name: name, cen: cen, ligs: ligs, res: res, note: note }; }
    /* lig: [sym, x, y, +1 if the bond dipole points centre → ligand, -1 if ligand → centre] */
    var D = {
      HF: mk('HF', 1.78, [L('হাইড্ৰ\'জেন ফ্লুৰাইড', 'hydrogen fluoride'), ''], ['H', 150, 90], [['F', 270, 90, 1]], [0, 1], [L('F (3.98) ৰ বিদ্যুৎঋণাত্মকতা H (2.20) তকৈ বেছি; ΔEN = 1.78।', 'F (3.98) is more electronegative than H (2.20); ΔEN = 1.78.')]),
      HCl: mk('HCl', 1.07, [L('হাইড্ৰ\'জেন ক্ল\'ৰাইড', 'hydrogen chloride'), ''], ['H', 150, 90], [['Cl', 270, 90, 1]], [0, 1], [L('Cl (3.16), H (2.20); ΔEN = 0.96।', 'Cl (3.16), H (2.20); ΔEN = 0.96.')]),
      HBr: mk('HBr', 0.79, [L('হাইড্ৰ\'জেন ব্ৰ\'মাইড', 'hydrogen bromide'), ''], ['H', 150, 90], [['Br', 270, 90, 1]], [0, 1], [L('Br (2.96), H (2.20); ΔEN = 0.76।', 'Br (2.96), H (2.20); ΔEN = 0.76.')]),
      HI: mk('HI', 0.38, [L('হাইড্ৰ\'জেন আইঅ\'ডাইড', 'hydrogen iodide'), ''], ['H', 150, 90], [['I', 270, 90, 1]], [0, 1], [L('I (2.66), H (2.20); ΔEN = 0.46।', 'I (2.66), H (2.20); ΔEN = 0.46.')]),
      H2: mk('H₂', 0, [L('হাইড্ৰ\'জেন', 'hydrogen'), ''], ['H', 170, 90], [['H', 250, 90, 0]], null, [L('একে পৰমাণু — বান্ধনি অধ্ৰুৱীয়।', 'Identical atoms — a non-polar bond.')]),
      CO2: mk('CO₂', 0, [L('কাৰ্বন ডাই-অক্সাইড', 'carbon dioxide'), ''], ['C', 210, 90], [['O', 110, 90, 1], ['O', 310, 90, 1]], null, [L('সৰলবৈখিক: দুটা সমান বান্ধনি দ্বিমেৰু ভ্ৰামক বিপৰীত দিশত — লব্ধি শূন্য।', 'Linear: two equal bond dipoles in opposite directions — the resultant is zero.')]),
      H2O: mk('H₂O', 1.85, [L('পানী (কোণ সলনি কৰি চাওক)', 'water (change the angle)'), ''], ['O', 210, 40], null, [0, -1], [L('দুটা O–H ভ্ৰামকৰ ভেক্টৰ যোগফল: μ = 2 × 1.51 × cos(θ/2)।', 'Vector sum of two O–H bond moments: μ = 2 × 1.51 × cos(θ/2).')]),
      BF3: mk('BF₃', 0, [L('বৰণ ট্ৰাইফ্লুৰাইড', 'boron trifluoride'), ''], ['B', 210, 90], [['F', 210, 25, 1], ['F', 150, 125, 1], ['F', 270, 125, 1]], null, [L('সমতলীয় ত্ৰিভুজাকাৰ: তিনিটা সমান ভ্ৰামকৰ লব্ধি শূন্য।', 'Trigonal planar: three equal bond dipoles add to zero.')]),
      NH3: mk('NH₃', 1.47, [L('এমনিয়া', 'ammonia'), ''], ['N', 210, 50], [['H', 145, 125, -1], ['H', 275, 125, -1], ['H', 210, 140, -1]], [0, -1], [L('N–H ভ্ৰামক আৰু একাকী যুৰৰ ভ্ৰামক একে দিশত যোগ হয় — μ বেছি (1.47 D)।', 'The N–H dipoles and the lone-pair dipole point the same way and add — large μ (1.47 D).')], 'lp-up'),
      NF3: mk('NF₃', 0.23, [L('নাইট্ৰজেন ট্ৰাইফ্লুৰাইড', 'nitrogen trifluoride'), ''], ['N', 210, 50], [['F', 145, 125, 1], ['F', 275, 125, 1], ['F', 210, 140, 1]], null, [L('N–F ভ্ৰামক (তলমুৱা) আৰু একাকী যুৰৰ ভ্ৰামক (ওপৰমুৱা) বিপৰীত দিশত — প্ৰায় নাইকিয়া হয়; μ = 0.23 D।', 'The N–F dipoles (pointing down) and the lone-pair dipole (up) oppose each other and nearly cancel; μ = 0.23 D.')], 'lp-up'),
      CH4: mk('CH₄', 0, [L('মিথেন', 'methane'), ''], ['C', 210, 90], [['H', 210, 30, -1], ['H', 150, 125, -1], ['H', 270, 125, -1], ['H', 210, 145, -1]], null, [L('চতুৰ্ফলকীয়: চাৰিটা সমান ভ্ৰামকৰ লব্ধি শূন্য।', 'Tetrahedral: four equal bond dipoles add to zero.')]),
      CHCl3: mk('CHCl₃', 1.04, [L('ক্ল\'ৰ\'ফৰ্ম', 'chloroform'), ''], ['C', 210, 90], [['H', 210, 30, -1], ['Cl', 150, 125, 1], ['Cl', 270, 125, 1], ['Cl', 210, 145, 1]], [0, 1], [L('বান্ধনিবোৰ সমান নহয় — ভ্ৰামক বাতিল নহয়; μ = 1.04 D।', 'The bonds are unequal, so the dipoles do not cancel; μ = 1.04 D.')]),
      CCl4: mk('CCl₄', 0, [L('কাৰ্বন টেট্ৰাক্ল\'ৰাইড', 'carbon tetrachloride'), ''], ['C', 210, 90], [['Cl', 210, 30, 1], ['Cl', 150, 125, 1], ['Cl', 270, 125, 1], ['Cl', 210, 145, 1]], null, [L('চতুৰ্ফলকীয় আৰু সমান বান্ধনি — μ = 0।', 'Tetrahedral with identical bonds — μ = 0.')])
    };
    var st = { m: 'H2O', th: 104.5 };
    var svg = s('svg', { viewBox: '0 0 420 190', 'class': 'anim-svg', role: 'img', 'aria-label': L('বান্ধনি দ্বিমেৰু ভ্ৰামক আৰু লব্ধি', 'Bond dipoles and their resultant') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var HC = 'var(--proton)', RC = 'var(--text)';
    function atom(g, sym, x, y) {
      g.appendChild(s('circle', { cx: x, cy: y, r: 13, style: 'fill:var(--brand-soft);stroke:var(--border)' }));
      g.appendChild(txt(s, x, y + 4, 11, 'middle', 'fill:var(--text)', sym, 700));
    }
    function bondArrow(g, x1, y1, x2, y2) {   /* dipole drawn alongside the bond, from δ+ (x1,y1) to δ− (x2,y2) */
      var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len, nx = -uy * 10, ny = ux * 10;
      arrow(s, g, x1 + ux * 17 + nx, y1 + uy * 17 + ny, x2 - ux * 17 + nx, y2 - uy * 17 + ny, HC, 2, 7);
    }
    function paint() {
      var d = D[st.m], g = s('g', {}); svg.innerHTML = ''; svg.appendChild(g);
      var mu = d.mu, ligs = d.ligs, res = d.res;
      if (st.m === 'H2O') {
        var half = st.th / 2 * Math.PI / 180, L1 = 85;
        ligs = [['H', 210 - L1 * Math.sin(half), 40 + L1 * Math.cos(half), -1], ['H', 210 + L1 * Math.sin(half), 40 + L1 * Math.cos(half), -1]];
        mu = 2 * M1 * Math.cos(half);
      }
      ligs.forEach(function (l) { g.appendChild(s('line', { x1: d.cen[1], y1: d.cen[2], x2: l[1], y2: l[2], style: 'stroke:var(--text);stroke-width:2' })); });
      atom(g, d.cen[0], d.cen[1], d.cen[2]);
      ligs.forEach(function (l) { atom(g, l[0], l[1], l[2]); });
      if (st.m === 'H2' ) { /* no arrows */ }
      else ligs.forEach(function (l) { if (l[3] > 0) bondArrow(g, d.cen[1], d.cen[2], l[1], l[2]); else if (l[3] < 0) bondArrow(g, l[1], l[2], d.cen[1], d.cen[2]); });
      if (st.m === 'HF' || st.m === 'HCl' || st.m === 'HBr' || st.m === 'HI') { /* H is at d.cen */ }
      if (d.note && d.ligs && d.ligs.length && d.f.length && (st.m === 'NH3' || st.m === 'NF3')) {
        g.appendChild(s('ellipse', { cx: 210, cy: 22, rx: 11, ry: 17, style: 'fill:var(--electron);opacity:.35;stroke:var(--electron)' }));
        arrow(s, g, 238, 40, 238, 8, 'var(--accent)', 2, 7);
        g.appendChild(txt(s, 246, 18, 9, 'start', 'fill:var(--accent)', L('একাকী যুৰ', 'lone pair')));
      }
      if (st.m === 'CH4' || st.m === 'CCl4') g.appendChild(txt(s, 210, 172, 9, 'middle', 'fill:var(--muted)', L('(ছবি: পাৰ্শ্ব দৃশ্য, ত্ৰিমাত্ৰিক গঠন)', '(side view of the 3-D shape)')));
      /* resultant */
      if (mu > 0.005 && res) {
        var ox = 50, oy = res[0] === 0 && res[1] === 1 && ['HF', 'HCl', 'HBr', 'HI'].indexOf(st.m) >= 0 ? 150 : 110, ln = mu * 30;
        if (['HF', 'HCl', 'HBr', 'HI'].indexOf(st.m) >= 0) arrow(s, g, 210 - ln / 2, 150, 210 + ln / 2, 150, RC, 3.5, 10);
        else arrow(s, g, ox, oy, ox + res[0] * ln, oy + res[1] * ln * (res[1] < 0 ? 1 : 1), RC, 3.5, 10);
        g.appendChild(txt(s, ['HF', 'HCl', 'HBr', 'HI'].indexOf(st.m) >= 0 ? 210 : ox + 6, ['HF', 'HCl', 'HBr', 'HI'].indexOf(st.m) >= 0 ? 172 : oy + 14, 10, ['HF', 'HCl', 'HBr', 'HI'].indexOf(st.m) >= 0 ? 'middle' : 'start', 'fill:var(--text)', L('লব্ধি μ', 'resultant μ'), 700));
      } else if (mu <= 0.005) {
        g.appendChild(txt(s, 56, 108, 12, 'middle', 'fill:var(--text)', 'μ = 0', 700));
      } else if (st.m === 'NF3') {
        g.appendChild(txt(s, 56, 108, 11, 'middle', 'fill:var(--text)', L('μ সৰু', 'small μ'), 700));
      }
      if (st.m === 'NF3') { /* NF3 has a small non-zero resultant */ }
      g.appendChild(txt(s, 8, 14, 10, 'start', 'fill:var(--muted)', L('প্ৰতিটো কাঁড় δ+ ৰ পৰা δ− অভিমুখী', 'Each arrow points from the δ+ end to the δ− end')));
      var cm = mu * 3.33564;
      info.innerHTML = '<b>' + d.f + '</b> (' + d.name[0] + (d.name[0] ? '' : d.name[1]) + ')<br>μ = <b>' + (mu < 0.005 ? '0' : mu.toFixed(2)) + ' D</b>' + (mu >= 0.005 ? ' = ' + cm.toFixed(2) + ' × 10⁻³⁰ C m' : '') + (st.m === 'H2O' ? ' (θ = ' + st.th.toFixed(1) + '°)' : '') + '<br>' + d.note[0] + (st.m === 'H2O' ? '<br>' + L('θ = 104.5° ত 1.85 D (6.17 × 10⁻³⁰ C m); θ = 180° ত শূন্য — CO₂ ৰ দৰে।', 'At θ = 104.5° it is 1.85 D (6.17 × 10⁻³⁰ C m); at θ = 180° it would be zero, like CO₂.') : '');
    }
    var sel = k.select('Molecule', opts(D, function (v) { return v.f; }), st.m, function (v) { st.m = v; sl.el.style.display = v === 'H2O' ? '' : 'none'; paint(); });
    var sl = k.slider('H–O–H angle °', 60, 180, 0.5, st.th, function (v) { st.th = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ---- shared 3-D direction sets (principal axis = y) ---- */
  var T = 1 / Math.sqrt(3);
  var DIRS = {
    2: [[0, 1, 0], [0, -1, 0]],
    3: [[1, 0, 0], [-.5, 0, .866], [-.5, 0, -.866]],
    4: [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]],
    5: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-.5, 0, .866], [-.5, 0, -.866]],
    6: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
    sq: [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]]
  };
  function rotate3(v, ay, ax) {
    var c = Math.cos(ay), sn = Math.sin(ay), x1 = v[0] * c + v[2] * sn, z1 = -v[0] * sn + v[2] * c, c2 = Math.cos(ax), s2 = Math.sin(ax);
    return [x1, v[1] * c2 - z1 * s2, v[1] * s2 + z1 * c2];
  }
  function draw3d(s, g, cx, cy, R, geom, lps, ay, o) {
    var items = [{ z: 0, c: true }];
    DIRS[geom].forEach(function (d, i) { var v = rotate3(d, ay, .35); items.push({ z: v[2], v: v, lp: lps.indexOf(i) >= 0 }); });
    items.sort(function (a, b) { return a.z - b.z; });
    items.forEach(function (it) {
      if (it.c) { g.appendChild(s('circle', { cx: cx, cy: cy, r: o.lobes ? 4 : 13, style: o.lobes ? 'fill:var(--text)' : 'fill:var(--brand);stroke:var(--border)' })); if (!o.lobes) g.appendChild(txt(s, cx, cy + 4, 11, 'middle', 'fill:var(--brand-ink)', 'A', 700)); return; }
      var px = it.v[0], py = -it.v[1], pl = Math.sqrt(px * px + py * py), depth = 1 + it.v[2] * .12;
      if (o.lobes) {
        var len = R * 1.05 * o.t, rx = Math.max(len / 2 * pl, len * .24), ry = len * .24, ex = cx + px * len / 2, ey = cy + py * len / 2, rot = Math.atan2(py, px) * 180 / Math.PI;
        if (pl < .05) rot = 0;
        g.appendChild(s('ellipse', { cx: ex, cy: ey, rx: Math.max(rx, 1), ry: Math.max(ry, 1), transform: 'rotate(' + rot + ' ' + ex + ' ' + ey + ')',
          style: 'fill:' + (it.lp ? 'var(--accent)' : 'var(--electron)') + ';opacity:' + (.35 + .25 * (it.v[2] + 1) / 2) + ';stroke:' + (it.lp ? 'var(--accent)' : 'var(--electron)') }));
      } else {
        var ex2 = cx + px * R, ey2 = cy + py * R;
        if (it.lp) {
          var lr = R * .52, rx2 = Math.max(lr * pl * .55 + 8, 8), rot2 = Math.atan2(py, px) * 180 / Math.PI;
          g.appendChild(s('ellipse', { cx: cx + px * R * .5, cy: cy + py * R * .5, rx: Math.max(R * .3 * pl + 8, 8), ry: 11, transform: 'rotate(' + rot2 + ' ' + (cx + px * R * .5) + ' ' + (cy + py * R * .5) + ')', style: 'fill:var(--accent);opacity:.45;stroke:var(--accent)' }));
          g.appendChild(txt(s, cx + px * R * .5, cy + py * R * .5 + 3, 8, 'middle', 'fill:var(--text)', '••', 700));
        } else {
          g.appendChild(s('line', { x1: cx, y1: cy, x2: ex2, y2: ey2, style: 'stroke:var(--text);stroke-width:' + (2 * depth) }));
          g.appendChild(s('circle', { cx: ex2, cy: ey2, r: 9 * depth, style: 'fill:var(--brand-soft);stroke:var(--border)' }));
          g.appendChild(txt(s, ex2, ey2 + 3.5, 10 * depth, 'middle', 'fill:var(--text)', 'B', 700));
        }
      }
    });
  }

  /* ================================================================== 6. VSEPR */
  A.register('vsepr', function (root, k) {
    var h = k.h, s = k.s;
    var G = {
      2: [L('সৰলবৈখিক', 'Linear')], 3: [L('সমতলীয় ত্ৰিভুজাকাৰ', 'Trigonal planar')], 4: [L('চতুৰ্ফলকীয়', 'Tetrahedral')],
      5: [L('ত্ৰিভুজাকাৰ দ্বিপিৰামিডীয়', 'Trigonal bipyramidal')], 6: [L('অষ্টফলকীয়', 'Octahedral')]
    };
    var S = [
      { k: 'AB₂', bp: 2, lp: 0, g: 2, lps: [], sh: L('সৰলবৈখিক', 'Linear'), ang: '180°', ex: 'BeCl₂, HgCl₂' },
      { k: 'AB₃', bp: 3, lp: 0, g: 3, lps: [], sh: L('সমতলীয় ত্ৰিভুজাকাৰ', 'Trigonal planar'), ang: '120°', ex: 'BF₃' },
      { k: 'AB₄', bp: 4, lp: 0, g: 4, lps: [], sh: L('চতুৰ্ফলকীয়', 'Tetrahedral'), ang: '109.5°', ex: 'CH₄, NH₄⁺' },
      { k: 'AB₅', bp: 5, lp: 0, g: 5, lps: [], sh: L('ত্ৰিভুজাকাৰ দ্বিপিৰামিডীয়', 'Trigonal bipyramidal'), ang: '90° / 120°', ex: 'PCl₅' },
      { k: 'AB₆', bp: 6, lp: 0, g: 6, lps: [], sh: L('অষ্টফলকীয়', 'Octahedral'), ang: '90°', ex: 'SF₆' },
      { k: 'AB₂E', bp: 2, lp: 1, g: 3, lps: [2], sh: L('কৌণিক (V আকৃতি)', 'Bent (V-shaped)'), ang: L('≈ 119.5° (120° তকৈ কম)', '≈ 119.5° (less than 120°)'), ex: 'SO₂, O₃',
        why: L('একাকী যুৰে বান্ধনি যোৰক বেছি বিকৰ্ষণ কৰে, সেয়ে কোণ 120° তকৈ কিছু কম।', 'The lone pair repels the bond pairs more strongly, so the angle closes a little below 120°.') },
      { k: 'AB₃E', bp: 3, lp: 1, g: 4, lps: [0], sh: L('ত্ৰিভুজাকাৰ পিৰামিডীয়', 'Trigonal pyramidal'), ang: '107°', ex: 'NH₃',
        why: L('lp–bp বিকৰ্ষণ > bp–bp বিকৰ্ষণ; 109.5° কমি 107° হয়।', 'lp–bp repulsion > bp–bp repulsion; 109.5° shrinks to 107°.') },
      { k: 'AB₂E₂', bp: 2, lp: 2, g: 4, lps: [0, 3], sh: L('কৌণিক (V আকৃতি)', 'Bent (V-shaped)'), ang: '104.5°', ex: 'H₂O',
        why: L('দুটা একাকী যুৰ — lp–lp বিকৰ্ষণ সবাতোকৈ বেছি; কোণ 104.5°।', 'Two lone pairs — lp–lp repulsion is the largest; the angle is 104.5°.') },
      { k: 'AB₄E', bp: 4, lp: 1, g: 5, lps: [4], sh: L('ঢেঁকী আকৃতি (see-saw)', 'See-saw'), ang: L('নিৰক্ষীয় < 120°, অক্ষীয় < 90°', 'equatorial < 120°, axial < 90°'), ex: 'SF₄',
        why: L('একাকী যুৰ নিৰক্ষীয় স্থানত থাকে — তাত 90° ত কম বিকৰ্ষণ (দুটা), অক্ষীয় স্থানত তিনিটা।', 'The lone pair sits in an equatorial position, where it has two 90° neighbours instead of three.') },
      { k: 'AB₃E₂', bp: 3, lp: 2, g: 5, lps: [3, 4], sh: L('T-আকৃতি', 'T-shaped'), ang: '≈ 90°', ex: 'ClF₃',
        why: L('দুয়োটা একাকী যুৰ নিৰক্ষীয় তলত — lp–bp 90° বিকৰ্ষণ ন্যূনতম।', 'Both lone pairs lie in the equatorial plane, which keeps the 90° lp–bp repulsions to a minimum.') },
      { k: 'AB₅E', bp: 5, lp: 1, g: 6, lps: [3], sh: L('বৰ্গক্ষেত্ৰাকাৰ পিৰামিডীয়', 'Square pyramidal'), ang: '< 90°', ex: 'BrF₅',
        why: L('এটা অষ্টফলকীয় স্থান একাকী যুৰে দখল কৰে।', 'One octahedral position is taken by the lone pair.') },
      { k: 'AB₄E₂', bp: 4, lp: 2, g: 6, lps: [2, 3], sh: L('সমতলীয় বৰ্গাকাৰ', 'Square planar'), ang: '90°', ex: 'XeF₄',
        why: L('দুটা একাকী যুৰ পৰস্পৰৰ বিপৰীত (trans) দিশত — বিকৰ্ষণ ন্যূনতম।', 'The two lone pairs sit opposite each other (trans), minimising repulsion.') }
    ];
    var st = { i: 2, a: 0.6, spin: !k.reduceMotion };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('VSEPR অনুসৰি অণুৰ আকৃতি (ঘূৰিব পৰা ত্ৰিমাত্ৰিক ছবি)', 'VSEPR molecular shape (rotating 3-D picture)') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var d = S[st.i]; svg.innerHTML = '';
      var g = s('g', {}); svg.appendChild(g);
      draw3d(s, g, 210, 100, 70, d.g, d.lps, st.a, {});
      svg.appendChild(txt(s, 8, 16, 13, 'start', 'fill:var(--text)', d.k, 700));
      svg.appendChild(txt(s, 8, 32, 10, 'start', 'fill:var(--muted)', L('B = বান্ধনি যোৰ · ••  = একাকী যোৰ (E)', 'B = bond pair · •• = lone pair (E)')));
      info.innerHTML = '<b>' + d.k + '</b> — ' + L('বান্ধনি যোৰ ', 'bond pairs ') + d.bp + ', ' + L('একাকী যোৰ ', 'lone pairs ') + d.lp + ' → ' + L('ইলেক্ট্ৰন-যুগ্মৰ বিন্যাস: ', 'electron-pair arrangement: ') + G[d.g][0] + '<br>' + L('অণুৰ আকৃতি: ', 'Shape of molecule: ') + '<b>' + d.sh + '</b> · ' + L('কোণ: ', 'angle: ') + d.ang + ' · ' + L('উদাহৰণ: ', 'e.g. ') + d.ex + (d.why ? '<br>' + d.why : '<br>' + L('একাকী যোৰ নাই — আদৰ্শ জ্যামিতি।', 'No lone pairs — the ideal geometry.')) + '<br>' + L('বিকৰ্ষণৰ ক্ৰম: lp–lp > lp–bp > bp–bp', 'Order of repulsion: lp–lp > lp–bp > bp–bp');
    }
    var lp = k.loop(root, function (dt) { if (st.spin) { st.a += dt * .9; sl.input.value = ((st.a % 6.2832) / 6.2832 * 360).toFixed(0); sl.out.textContent = sl.input.value; paint(); } });
    var sel = k.select('Type', S.map(function (d, i) { return { value: i, label: d.k + ' — ' + d.ex.split(',')[0] }; }), st.i, function (v) { st.i = +v; paint(); });
    var sl = k.slider('Rotate °', 0, 360, 1, 34, function (v) { st.a = v * Math.PI / 180; st.spin = false; spin.textContent = 'Auto-rotate: OFF'; paint(); });
    var spin = k.button('Auto-rotate: ' + (st.spin ? 'ON' : 'OFF'), function () { st.spin = !st.spin; spin.textContent = 'Auto-rotate: ' + (st.spin ? 'ON' : 'OFF'); if (st.spin) lp.start(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, sl.el, spin]));
    root.appendChild(info);
    paint();
    if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 7. orbital overlap */
  A.register('overlap', function (root, k) {
    var h = k.h, s = k.s;
    var V = {
      ss: [L('s–s অভিলেপন (σ)', 's–s overlap (σ)')],
      sp: [L('s–p অভিলেপন (σ)', 's–p overlap (σ)')],
      ppo: [L('p–p মুখামুখি অভিলেপন (σ)', 'p–p head-on overlap (σ)')],
      ppp: [L('p–p পাৰ্শ্বীয় অভিলেপন (π)', 'p–p sideways overlap (π)')]
    };
    var st = { v: 'ss', d: 180 };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('পাৰমাণৱিক অৰবিটেলৰ অভিলেপন', 'Overlap of atomic orbitals') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var D0 = 100;
    function lobe(g, cx, cy, rx, ry, sign) {
      g.appendChild(s('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry, style: 'fill:' + (sign > 0 ? 'var(--electron)' : 'var(--proton)') + ';opacity:.45;stroke:' + (sign > 0 ? 'var(--electron)' : 'var(--proton)') }));
      g.appendChild(txt(s, cx, cy + 4, 12, 'middle', 'fill:var(--text)', sign > 0 ? '+' : '−', 700));
    }
    function morse(r) { var a = .0194, x = 1 - Math.exp(-a * (r - 74)); return 435.8 * (x * x - 1); }
    function paint() {
      var v = st.v, d = st.d, ax = 100, bx = ax + d, cy = 70; svg.innerHTML = '';
      svg.setAttribute('viewBox', v === 'ss' ? '0 0 420 285' : '0 0 420 150');
      var g = s('g', {}); svg.appendChild(g);
      g.appendChild(s('line', { x1: 20, y1: cy, x2: 400, y2: cy, style: 'stroke:var(--border);stroke-dasharray:4 3' }));
      var over = '';
      if (v === 'ss') { lobe(g, ax, cy, 55, 55, 1); lobe(g, bx, cy, 55, 55, 1); over = d < 110 ? (d < 70 ? 1 : 2) : (d < 140 ? 3 : 0); }
      if (v === 'sp') { lobe(g, ax, cy, 50, 50, 1); lobe(g, bx - 42, cy, 42, 22, 1); lobe(g, bx + 42, cy, 42, 22, -1); }
      if (v === 'ppo') { lobe(g, ax - 42, cy, 42, 22, -1); lobe(g, ax + 42, cy, 42, 22, 1); lobe(g, bx - 42, cy, 42, 22, 1); lobe(g, bx + 42, cy, 42, 22, -1); }
      if (v === 'ppp') { lobe(g, ax, cy - 42, 22, 42, 1); lobe(g, ax, cy + 42, 22, 42, -1); lobe(g, bx, cy - 42, 22, 42, 1); lobe(g, bx, cy + 42, 22, 42, -1); }
      [ax, bx].forEach(function (x, i) { g.appendChild(s('circle', { cx: x, cy: cy, r: 3.5, style: 'fill:var(--text)' })); g.appendChild(txt(s, x, 142, 10, 'middle', 'fill:var(--muted)', i ? 'B' : 'A')); });
      /* overlap quality (distance between lobe centres vs. their size) */
      var gap = v === 'ss' ? d - 110 : (v === 'ppp' ? d - 44 : (v === 'sp' ? d - 42 - 92 : d - 84 - 84));
      var state = v === 'ppp' ? (d > 150 ? 0 : (d > 60 ? 1 : 2)) : (gap > 0 ? 0 : (gap > -50 ? 1 : (gap > -80 ? 2 : 3)));
      var txtS = [L('অভিলেপন নাই', 'No overlap'), L('আংশিক অভিলেপন', 'Partial overlap'), L('ভাল অভিলেপন — বান্ধনি শক্তিশালী', 'Good overlap — a strong bond'), L('অতি বেছি ওচৰ — নিউক্লিয়াছ বিকৰ্ষণ প্ৰবল', 'Too close — nuclear repulsion dominates')][state];
      var res = '<b>' + V[v][0] + '</b><br>' + L('দূৰত্ব: ', 'Separation: ') + d + ' (' + L('একক', 'arbitrary units') + ') — ' + txtS + '<br>';
      res += v === 'ppp' ? L('দুয়ো অৰবিটেল আন্তঃনিউক্লীয় অক্ষৰ সমান্তৰাল; অভিলেপন অক্ষৰ ওপৰ আৰু তলত — π বান্ধনি (σ তকৈ দুৰ্বল)।', 'The orbitals are parallel to each other and perpendicular to the internuclear axis; overlap occurs above and below it — a π bond (weaker than σ).') :
        L('অভিলেপন আন্তঃনিউক্লীয় অক্ষৰ দিশত মুখামুখি — σ বান্ধনি; অক্ষৰ চাৰিওফালে প্ৰতিসম।', 'Overlap lies head-on along the internuclear axis — a σ bond, symmetrical about that axis.');
      info.innerHTML = res;
      if (v === 'ss') {
        var r = Math.max(30, d * 0.74), E = morse(Math.max(r, 20)), px = function (rr) { return 40 + (rr - 20) / 180 * 360; }, py = function (e) { return 155 + (400 - e) / 850 * 110; };
        svg.appendChild(s('line', { x1: 40, y1: py(0), x2: 400, y2: py(0), style: 'stroke:var(--border)' }));
        svg.appendChild(s('line', { x1: 40, y1: 150, x2: 40, y2: 270, style: 'stroke:var(--muted)' }));
        var pts = []; for (var rr = 30; rr <= 200; rr += 2) pts.push(px(rr) + ',' + Math.max(150, Math.min(270, py(morse(rr)))));
        svg.appendChild(s('polyline', { points: pts.join(' '), style: 'fill:none;stroke:var(--brand);stroke-width:2' }));
        svg.appendChild(s('circle', { cx: px(Math.min(200, Math.max(r, 30))), cy: Math.max(150, Math.min(270, py(E))), r: 5, style: 'fill:var(--accent)' }));
        svg.appendChild(txt(s, 44, 160, 9, 'start', 'fill:var(--muted)', L('শক্তি (kJ/mol)', 'Energy (kJ/mol)')));
        svg.appendChild(txt(s, 398, py(0) - 4, 9, 'end', 'fill:var(--muted)', L('পৃথকীকৃত পৰমাণু', 'separated atoms')));
        svg.appendChild(txt(s, px(74), 281, 9, 'middle', 'fill:var(--muted)', '74 pm'));
        svg.appendChild(txt(s, 400, 281, 9, 'end', 'fill:var(--muted)', L('আন্তঃনিউক্লীয় দূৰত্ব →', 'internuclear distance →')));
        info.innerHTML += L('H₂ ৰ আনুমানিক শক্তি (মৰ্ছ আদৰ্শ): r = ' + r.toFixed(0) + ' pm ত E ≈ ' + E.toFixed(0) + ' kJ/mol; সৰ্বনিম্ন −435.8 kJ/mol 74 pm ত।', 'Approximate H₂ energy (Morse model): at r = ' + r.toFixed(0) + ' pm, E ≈ ' + E.toFixed(0) + ' kJ/mol; the minimum is −435.8 kJ/mol at 74 pm.');
      }
    }
    var sel = k.select('Overlap', opts(V, function (v) { return v[0]; }), st.v, function (v) { st.v = v; paint(); });
    var sl = k.slider('Separation', 40, 240, 2, st.d, function (v) { st.d = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 8. hybridisation */
  A.register('hybridisation', function (root, k) {
    var h = k.h, s = k.s;
    var H = {
      sp: { n: 'sp', mix: ['s', 'p'], un: ['p', 'p'], g: 2, lps: [], sh: L('সৰলবৈখিক', 'Linear'), ang: '180°', pct: '50 %', ex: 'BeCl₂' },
      sp2: { n: 'sp²', mix: ['s', 'p', 'p'], un: ['p'], g: 3, lps: [], sh: L('সমতলীয় ত্ৰিভুজাকাৰ', 'Trigonal planar'), ang: '120°', pct: '33.3 %', ex: 'BCl₃' },
      sp3: { n: 'sp³', mix: ['s', 'p', 'p', 'p'], un: [], g: 4, lps: [], sh: L('চতুৰ্ফলকীয়', 'Tetrahedral'), ang: '109.5° (109°28′)', pct: '25 %', ex: 'CH₄' },
      sp3n: { n: 'sp³', mix: ['s', 'p', 'p', 'p'], un: [], g: 4, lps: [0], sh: L('ত্ৰিভুজাকাৰ পিৰামিডীয়', 'Trigonal pyramidal'), ang: '107°', pct: '25 %', ex: 'NH₃', extra: L('এটা sp³ অৰবিটেলত একাকী যোৰ।', 'One sp³ hybrid orbital holds a lone pair.') },
      sp3o: { n: 'sp³', mix: ['s', 'p', 'p', 'p'], un: [], g: 4, lps: [0, 3], sh: L('কৌণিক (V আকৃতি)', 'Bent (V-shaped)'), ang: '104.5°', pct: '25 %', ex: 'H₂O', extra: L('দুটা sp³ অৰবিটেলত একাকী যোৰ।', 'Two sp³ hybrid orbitals hold lone pairs.') },
      sp3d: { n: 'sp³d', mix: ['s', 'p', 'p', 'p', 'd'], un: [], g: 5, lps: [], sh: L('ত্ৰিভুজাকাৰ দ্বিপিৰামিডীয়', 'Trigonal bipyramidal'), ang: '90° / 120°', pct: '', ex: 'PCl₅', extra: L('তিনিটা নিৰক্ষীয় (120°) আৰু দুটা অক্ষীয় (90°) বান্ধনি; অক্ষীয় বান্ধনি দীঘল আৰু দুৰ্বল।', 'Three equatorial bonds (120°) and two axial (90°); the axial bonds are longer and weaker.') },
      sp3d2: { n: 'sp³d²', mix: ['s', 'p', 'p', 'p', 'd', 'd'], un: [], g: 6, lps: [], sh: L('অষ্টফলকীয়', 'Octahedral'), ang: '90°', pct: '', ex: 'SF₆', extra: L('ছটা সমতুল্য S–F σ বান্ধনি।', 'Six equivalent S–F σ bonds.') },
      dsp2: { n: 'dsp²', mix: ['d', 's', 'p', 'p'], un: ['p'], g: 'sq', lps: [], sh: L('সমতলীয় বৰ্গাকাৰ', 'Square planar'), ang: '90°', pct: '', ex: '[Ni(CN)₄]²⁻, [PtCl₄]²⁻' }
    };
    var LV = { s: 125, p: 92, d: 56 }, CL = { s: 'var(--alpha)', p: 'var(--electron)', d: 'var(--proton)' };
    var st = { m: 'sp3', t: 0, ang: .5, run: false };
    var svg = s('svg', { viewBox: '0 0 420 210', 'class': 'anim-svg', role: 'img', 'aria-label': L('সংকৰণ: পাৰমাণৱিক অৰবিটেলৰ মিলন আৰু সংকৰ অৰবিটেলৰ দিশ', 'Hybridisation: mixing of atomic orbitals and the directions of the hybrid orbitals') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var d = H[st.m], p = st.t; svg.innerHTML = '';
      /* energy boxes */
      var all = d.mix.concat(d.un), n = all.length, avg = d.mix.reduce(function (a, b) { return a + LV[b]; }, 0) / d.mix.length, x0 = 12, bw = 24, gap = 28;
      svg.appendChild(s('line', { x1: 8, y1: 190, x2: 8, y2: 36, style: 'stroke:var(--muted)' }));
      svg.appendChild(txt(s, 14, 30, 9, 'start', 'fill:var(--muted)', L('শক্তি ↑', 'Energy ↑')));
      all.forEach(function (o, i) {
        var mixed = i < d.mix.length, y = LV[o] + (mixed ? (avg - LV[o]) * p : 0), col = mixed && p > .5 ? 'var(--brand)' : CL[o];
        svg.appendChild(s('rect', { x: x0 + i * gap + 6, y: y, width: bw, height: 16, rx: 2, style: 'fill:' + col + ';opacity:' + (mixed ? .75 : .35) + ';stroke:' + col }));
        svg.appendChild(txt(s, x0 + i * gap + 6 + bw / 2, y + 12, 10, 'middle', 'fill:var(--text)', mixed && p > .5 ? 'h' : o, 700));
      });
      svg.appendChild(txt(s, 100, 200, 10, 'middle', 'fill:var(--text)', p > .5 ? d.mix.length + ' × ' + d.n : d.mix.map(function (o) { return o; }).join(' + ') + (p > 0 ? ' …' : ''), 700));
      /* lobes */
      var g = s('g', {}); svg.appendChild(g);
      draw3d(s, g, 315, 108, 62, d.g, d.lps, st.ang, { lobes: true, t: Math.max(.08, p) });
      svg.appendChild(txt(s, 315, 16, 12, 'middle', 'fill:var(--text)', L('সংকৰ অৰবিটেল: ', 'Hybrid orbitals: ') + (p > .5 ? d.n : '…'), 700));
      info.innerHTML = '<b>' + d.n + '</b> — ' + L('মিলোৱা অৰবিটেল: ', 'orbitals mixed: ') + d.mix.join(' + ') + ' → ' + d.mix.length + ' ' + L('সমান সংকৰ অৰবিটেল', 'equivalent hybrid orbitals') + '<br>' + L('আকৃতি: ', 'Shape: ') + '<b>' + d.sh + '</b> · ' + L('কোণ: ', 'angle: ') + d.ang + (d.pct ? ' · ' + d.pct + ' s-' + L('ধৰ্ম', 'character') : '') + ' · ' + L('উদাহৰণ: ', 'e.g. ') + d.ex + (d.extra ? '<br>' + d.extra : '') + (d.un.length && d.un[0] === 'p' ? '<br>' + L('অসংকৰিত p অৰবিটেল ' + d.un.length + 'টা π বান্ধনিৰ বাবে থাকে।', d.un.length + ' unhybridised p orbital' + (d.un.length > 1 ? 's' : '') + ' remain, available for π bonding.') : '');
    }
    var lp = k.loop(root, function (dt) { if (st.run) { st.t = Math.min(1, st.t + dt * .8); if (st.t >= 1) st.run = false; } st.ang += dt * .6; paint(); });
    var sel = k.select('Hybridisation', opts(H, function (v) { return v.n + ' — ' + v.ex.split(',')[0]; }), st.m, function (v) { st.m = v; st.t = 0; paint(); });
    var mixb = k.button('Mix orbitals', function () { if (k.reduceMotion) { st.t = 1; paint(); return; } st.t = 0; st.run = true; lp.start(); }, 'primary');
    var rs = k.button('Reset', function () { st.t = 0; st.run = false; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, mixb, rs]));
    root.appendChild(info);
    paint();
    if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 9. MO diagram builder */
  A.register('mo-builder', function (root, k) {
    var h = k.h, s = k.s;
    var ORD_B = [['σ1s', 1, 'b'], ['σ*1s', 1, 'a'], ['σ2s', 1, 'b'], ['σ*2s', 1, 'a'], ['π2p', 2, 'b'], ['σ2pz', 1, 'b'], ['π*2p', 2, 'a'], ['σ*2pz', 1, 'a']];
    var ORD_A = [['σ1s', 1, 'b'], ['σ*1s', 1, 'a'], ['σ2s', 1, 'b'], ['σ*2s', 1, 'a'], ['σ2pz', 1, 'b'], ['π2p', 2, 'b'], ['π*2p', 2, 'a'], ['σ*2pz', 1, 'a']];
    var SP = [
      ['H₂', 2, 'B', 435.8, 74], ['He₂', 4, 'B'], ['Li₂', 6, 'B'], ['Be₂', 8, 'B'], ['B₂', 10, 'B', 290, null], ['C₂', 12, 'B', 620, null], ['N₂', 14, 'B', 946.0, 109],
      ['O₂⁺', 15, 'A'], ['O₂', 16, 'A', 498, 121], ['O₂⁻', 17, 'A'], ['O₂²⁻', 18, 'A'], ['F₂', 18, 'A', 159, 144], ['Ne₂', 20, 'A']
    ];
    var st = { i: 6, ne: 14 };
    var svg = s('svg', { viewBox: '0 0 420 290', 'class': 'anim-svg', role: 'img', 'aria-label': L('আণৱিক অৰবিটেলৰ শক্তি স্তৰ চিত্ৰ', 'Molecular orbital energy-level diagram') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function fill(ord, ne) {
      var left = ne, out = [];
      ord.forEach(function (o) { var cap = 2 * o[1], t = Math.min(cap, left); left -= t; out.push({ o: o, k: t, up: Math.min(t, o[1]), dn: Math.max(0, t - o[1]) }); });
      return out;
    }
    function paint() {
      var sp = SP[st.i], ord = sp[2] === 'A' ? ORD_A : ORD_B, f = fill(ord, st.ne); svg.innerHTML = '';
      svg.appendChild(s('line', { x1: 24, y1: 276, x2: 24, y2: 14, style: 'stroke:var(--muted)' }));
      svg.appendChild(txt(s, 30, 22, 9, 'start', 'fill:var(--muted)', L('শক্তি ↑', 'Energy ↑')));
      f.forEach(function (r, i) {
        var y = 250 - i * 32, o = r.o, col = o[2] === 'b' ? 'var(--electron)' : 'var(--proton)';
        svg.appendChild(txt(s, 150, y + 12, 11, 'end', 'fill:var(--text)', o[0] + (o[1] === 2 ? ' (x, y)' : ''), 700));
        for (var b = 0; b < o[1]; b++) {
          var bx = o[1] === 1 ? 190 : 170 + b * 44;
          svg.appendChild(s('rect', { x: bx, y: y, width: 36, height: 18, rx: 3, style: 'fill:none;stroke:' + col + ';stroke-width:2' }));
          var t = (b < r.up ? '↑' : '') + (b < r.dn ? '↓' : '');
          svg.appendChild(txt(s, bx + 18, y + 14, 14, 'middle', 'fill:var(--text)', t, 700));
        }
        svg.appendChild(txt(s, 330, y + 13, 10, 'start', 'fill:' + col, o[2] === 'b' ? L('বন্ধন', 'bonding') : L('প্ৰতিবন্ধন', 'antibonding')));
      });
      var nb = 0, na = 0, cfg = [];
      f.forEach(function (r) { if (r.o[2] === 'b') nb += r.k; else na += r.k; if (r.k) cfg.push(r.o[0] + sup(r.k)); });
      var bo = (nb - na) / 2, unp = 0; f.forEach(function (r) { unp += r.up - r.dn; });
      var ok = bo > 0;
      var mag = unp > 0 ? L('অনুচুম্বকীয় (' + unp + 'টা অযুগ্ম ইলেক্ট্ৰন)', 'paramagnetic (' + unp + ' unpaired electron' + (unp > 1 ? 's' : '') + ')') : L('অপচুম্বকীয়', 'diamagnetic');
      var cmp = st.ne === sp[1];
      var line = '<b>' + sp[0] + '</b> — ' + L('ইলেক্ট্ৰন ', 'electrons ') + st.ne + (cmp ? '' : ' / ' + sp[1]) + '<br>' + L('বিন্যাস: ', 'Configuration: ') + cfg.join(' ') + '<br>N<sub>b</sub> = ' + nb + ', N<sub>a</sub> = ' + na + ' → ' + L('বান্ধনি মাত্ৰা', 'bond order') + ' = ½(N<sub>b</sub> − N<sub>a</sub>) = <b>' + (Math.round(bo * 10) / 10) + '</b><br>' +
        (cmp ? (ok ? L('অণুটো সুস্থিৰ; ', 'The molecule is stable; ') : L('বান্ধনি মাত্ৰা শূন্য — অণুটোৰ অস্তিত্ব নাই; ', 'Bond order zero — the molecule does not exist; ')) + mag : L('"ইলেক্ট্ৰন যোগ কৰক" টিপি এটা এটাকৈ ভৰাওক (হুণ্ডৰ নিয়ম)।', 'Press "Add electron" to fill the levels one by one (Hund\'s rule).'));
      if (cmp && sp[3]) line += '<br>' + L('পাঠ্যপুথিৰ তথ্য: বান্ধনি এনথালপি ' + (sp[4] ? '' : '≈ ') + sp[3] + ' kJ/mol' + (sp[4] ? ', বান্ধনি দৈৰ্ঘ্য ' + sp[4] + ' pm' : ''), 'From the book: bond enthalpy ' + (sp[4] ? '' : '≈ ') + sp[3] + ' kJ/mol' + (sp[4] ? ', bond length ' + sp[4] + ' pm' : ''));
      if (cmp && sp[2] === 'B' && sp[1] >= 10) line += '<br>' + L('শক্তিৰ ক্ৰম: π2p, σ2pz ৰ তলত (2s–2p মিশ্ৰণ)।', 'Energy order: π2p lies below σ2pz (2s–2p mixing).');
      if (cmp && sp[2] === 'A' && sp[1] >= 15) line += '<br>' + L('শক্তিৰ ক্ৰম: σ2pz, π2p ৰ তলত।', 'Energy order: σ2pz lies below π2p.');
      info.innerHTML = line;
    }
    var sel = k.select('Species', SP.map(function (d, i) { return { value: i, label: d[0] }; }), st.i, function (v) { st.i = +v; st.ne = SP[st.i][1]; paint(); });
    var add = k.button('Add electron', function () { if (st.ne < SP[st.i][1]) st.ne++; paint(); }, 'primary');
    var all = k.button('Fill all', function () { st.ne = SP[st.i][1]; paint(); });
    var rs = k.button('Reset', function () { st.ne = 0; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, add, all, rs]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 10. hydrogen bonding and boiling points */
  A.register('h-bond', function (root, k) {
    var h = k.h, s = k.s;
    var G = {
      g14: [L('গোষ্ঠী 14', 'Group 14'), [['CH₄', 112], ['SiH₄', 161], ['GeH₄', 185], ['SnH₄', 221]], 'var(--neutron)'],
      g15: [L('গোষ্ঠী 15', 'Group 15'), [['NH₃', 240], ['PH₃', 185], ['AsH₃', 211], ['SbH₃', 255]], 'var(--electron)'],
      g16: [L('গোষ্ঠী 16', 'Group 16'), [['H₂O', 373], ['H₂S', 213], ['H₂Se', 232], ['H₂Te', 271]], 'var(--proton)'],
      g17: [L('গোষ্ঠী 17', 'Group 17'), [['HF', 293], ['HCl', 188], ['HBr', 207], ['HI', 238]], 'var(--accent)']
    };
    var st = { g: 'g16' };
    var X = function (i) { return 70 + i * 100; }, Y = function (kk) { return 205 - (kk - 100) / 300 * 175; };
    var svg = s('svg', { viewBox: '0 0 420 250', 'class': 'anim-svg', role: 'img', 'aria-label': L('হাইড্ৰাইডৰ উতলাংক', 'Boiling points of hydrides') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(s('line', { x1: 40, y1: 215, x2: 410, y2: 215, style: 'stroke:var(--muted)' }));
      svg.appendChild(s('line', { x1: 40, y1: 15, x2: 40, y2: 215, style: 'stroke:var(--muted)' }));
      [100, 200, 300, 400].forEach(function (v) { svg.appendChild(s('line', { x1: 40, y1: Y(v), x2: 410, y2: Y(v), style: 'stroke:var(--grid)' })); svg.appendChild(txt(s, 36, Y(v) + 3, 9, 'end', 'fill:var(--muted)', v)); });
      for (var i = 0; i < 4; i++) svg.appendChild(txt(s, X(i), 230, 10, 'middle', 'fill:var(--muted)', L('পৰ্যায় ', 'Period ') + (i + 2)));
      svg.appendChild(txt(s, 44, 12, 9, 'start', 'fill:var(--muted)', L('উতলাংক (K)', 'Boiling point (K)')));
      Object.keys(G).forEach(function (key) {
        var gr = G[key], on = key === st.g, col = gr[2];
        svg.appendChild(s('polyline', { points: gr[1].map(function (p, i) { return X(i) + ',' + Y(p[1]); }).join(' '), style: 'fill:none;stroke:' + col + ';stroke-width:' + (on ? 3 : 1.5) + ';opacity:' + (on ? 1 : .4) }));
        gr[1].forEach(function (p, i) {
          svg.appendChild(s('circle', { cx: X(i), cy: Y(p[1]), r: on ? 5 : 3, style: 'fill:' + col + ';opacity:' + (on ? 1 : .5) }));
          if (on) svg.appendChild(txt(s, X(i) + 8, Y(p[1]) - 6, 10, 'start', 'fill:var(--text)', p[0] + ' ' + p[1], 700));
        });
      });
      var gr = G[st.g], xs = [1, 2, 3], ys = gr[1].slice(1).map(function (p) { return p[1]; });
      var mx = 2, my = (ys[0] + ys[1] + ys[2]) / 3, sl = ((xs[0] - mx) * (ys[0] - my) + (xs[1] - mx) * (ys[1] - my) + (xs[2] - mx) * (ys[2] - my)) / 2, pred = my + sl * (0 - mx);
      svg.appendChild(s('line', { x1: X(0), y1: Y(pred), x2: X(1), y2: Y(my - sl), style: 'stroke:' + gr[2] + ';stroke-width:1.5;stroke-dasharray:4 3' }));
      svg.appendChild(s('circle', { cx: X(0), cy: Y(pred), r: 4, style: 'fill:none;stroke:' + gr[2] }));
      var act = gr[1][0][1];
      info.innerHTML = '<b>' + gr[0] + '</b>: ' + gr[1].map(function (p) { return p[0] + ' ' + p[1] + ' K'; }).join(' · ') + '<br>' +
        (st.g === 'g14' ? L('CH₄ ত হাইড্ৰ\'জেন বান্ধনি নাই — উতলাংক নিয়মীয়াকৈ বাঢ়ে (আণৱিক ভৰ বঢ়াৰ লগে লগে)।', 'CH₄ forms no hydrogen bonds — the boiling point rises smoothly with molar mass.') :
          L('হাইড্ৰ\'জেন বান্ধনি নথকা হ\'লে ' + gr[1][0][0] + ' ৰ উতলাংক ≈ ' + Math.round(pred) + ' K হ\'ব লাগিছিল; প্ৰকৃততে ' + act + ' K — প্ৰায় ' + Math.round(act - pred) + ' K বেছি।', 'Without hydrogen bonding ' + gr[1][0][0] + ' would boil near ' + Math.round(pred) + ' K (dashed trend); it actually boils at ' + act + ' K — about ' + Math.round(act - pred) + ' K higher.')) +
        '<br><span style="color:var(--muted)">' + L('(আনুমানিক মান; গোষ্ঠী 14–17)', '(approximate values; groups 14–17)') + '</span>';
    }
    var sel = k.select('Group', opts(G, function (v) { return v[0]; }), st.g, function (v) { st.g = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });
})();
