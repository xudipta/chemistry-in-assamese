/* Animations for Class 12, Chapter 2: Electrochemistry (বিদ্যুৎৰসায়নবিজ্ঞান).
   Registered: external-voltage, galvanic, nernst, conductance, kohlrausch, faraday, electrolysis, corrosion, battery, fuelcell
   Controls are English (app UI); read-outs are Assamese (subject content). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var TAU = Math.PI * 2, F = 96500;

  function sci(x, d) {
    if (!x) return '0';
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    return m.toFixed(d === undefined ? 2 : d) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function lcm(a, b) { return a * b / gcd(a, b); }
  function ion(sym, z) { return sym + '<sup>' + (z > 1 ? z : '') + '+</sup>'; }
  function polyline(pts, d) {       /* point at distance d along a polyline */
    var i, seg, acc = 0, total = 0;
    for (i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    d = ((d % total) + total) % total;
    for (i = 1; i < pts.length; i++) {
      seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (d <= acc + seg) { var t = (d - acc) / seg; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]; }
      acc += seg;
    }
    return pts[pts.length - 1];
  }
  var PATH_LEN = function (pts) { var t = 0; for (var i = 1; i < pts.length; i++) t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return t; };

  /* ================================================================== external voltage on a Daniell cell */
  A.register('external-voltage', function (root, k) {
    var h = k.h, s = k.s, E0 = 1.10, ext = 0.5, phase = 0;
    var svg = s('svg', { viewBox: '0 0 420 240', 'class': 'anim-svg', role: 'img', 'aria-label': 'ডেনিয়েল কোষত বাহ্যিক বিভৱৰ প্ৰভাৱ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var W = [[105, 70], [105, 30], [315, 30], [315, 70]], L = PATH_LEN(W);
    var dots = [], el = [];
    function build() {
      svg.innerHTML = '';
      svg.appendChild(s('rect', { x: 40, y: 120, width: 130, height: 100, rx: 6, style: 'fill:var(--electron);opacity:.15' }));
      svg.appendChild(s('rect', { x: 250, y: 120, width: 130, height: 100, rx: 6, style: 'fill:var(--electron);opacity:.15' }));
      svg.appendChild(s('path', { d: 'M150 150 V105 Q150 95 160 95 H260 Q270 95 270 105 V150', fill: 'none', style: 'stroke:var(--muted)', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: .5 }));
      svg.appendChild(s('rect', { x: 96, y: 70, width: 18, height: 140, style: 'fill:#8a93a0' }));
      svg.appendChild(s('rect', { x: 306, y: 70, width: 18, height: 140, style: 'fill:#c46a2d' }));
      svg.appendChild(s('polyline', { points: W.map(function (p) { return p.join(','); }).join(' '), fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2 }));
      svg.appendChild(s('circle', { cx: 210, cy: 30, r: 22, style: 'fill:var(--canvas);stroke:var(--text)', 'stroke-width': 2 }));
      svg.appendChild(s('text', { x: 210, y: 34, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--text)', text: ext.toFixed(2) + ' V' }));
      svg.appendChild(s('text', { x: 105, y: 236, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:var(--text)', text: 'Zn' }));
      svg.appendChild(s('text', { x: 315, y: 236, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:var(--text)', text: 'Cu' }));
      svg.appendChild(s('text', { x: 210, y: 12, 'text-anchor': 'middle', 'font-size': 11, style: 'fill:var(--muted)', text: 'E বাহ্যিক' }));
      dots = [];
      for (var i = 0; i < 9; i++) { var c = s('circle', { r: 4.5, style: 'fill:var(--electron)' }); svg.appendChild(c); dots.push(c); }
    }
    function mode() { return ext < E0 - 0.02 ? 'g' : (ext > E0 + 0.02 ? 'e' : 'eq'); }
    function paint() {
      var m = mode(), t;
      if (m === 'g') t = '<b>E বাহ্যিক &lt; 1.10 V</b> — কোষটো <b>গেলভেনীয়</b> হিচাপে কাম কৰে। ইলেক্ট্ৰন Zn ৰ পৰা Cu লৈ যায়; Zn দ্ৰবীভূত হয় (এন\'ড) আৰু Cu জমা হয় (কেথ\'ড)।';
      else if (m === 'eq') t = '<b>E বাহ্যিক ≈ 1.10 V</b> — দুয়োফালৰ বিভৱ সমান; <b>বিদ্যুৎ প্ৰবাহ নাই</b> আৰু কোনো বিক্ৰিয়া নঘটে।';
      else t = '<b>E বাহ্যিক &gt; 1.10 V</b> — কোষটো <b>বিদ্যুৎবিশ্লেষণী</b> হৈ পৰে। বিক্ৰিয়া উলোটা দিশত: Cu দ্ৰবীভূত হয় আৰু Zn জমা হয়।';
      info.innerHTML = 'কোষৰ নিজা emf (E°<sub>cell</sub>) = <b>1.10 V</b>; বাহ্যিক বিভৱ = <b>' + ext.toFixed(2) + ' V</b><br>' + t;
      build();
    }
    function tick(dt) {
      var m = mode(), diff = Math.abs(ext - E0), dir = ext < E0 ? 1 : -1;
      var speed = m === 'eq' ? 0 : clamp(diff / 0.8, 0.15, 1) * 90;
      phase += dir * speed * dt;
      dots.forEach(function (d, i) { var p = polyline(W, phase + i * L / dots.length); d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]); d.setAttribute('visibility', m === 'eq' ? 'hidden' : 'visible'); });
    }
    var sl = k.slider('External voltage (V)', 0, 2, 0.02, ext, function (v) { ext = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paint(); lp.start();
  });

  /* ================================================================== galvanic cell builder */
  A.register('galvanic', function (root, k) {
    var h = k.h, s = k.s;
    var MET = {
      Mg: { z: 2, E: -2.36, c: '#9aa5b1' }, Al: { z: 3, E: -1.66, c: '#c3c8cf' }, Zn: { z: 2, E: -0.76, c: '#8a93a0' },
      Fe: { z: 2, E: -0.44, c: '#5d636b' }, Ni: { z: 2, E: -0.25, c: '#9fa8a1' }, Pb: { z: 2, E: -0.13, c: '#4f5560' },
      Cu: { z: 2, E: 0.34, c: '#c46a2d' }, Ag: { z: 1, E: 0.80, c: '#d7dbe0' }
    };
    var st = { m1: 'Zn', c1: 1, m2: 'Cu', c2: 1 };
    var svg = s('svg', { viewBox: '0 0 420 270', 'class': 'anim-svg', role: 'img', 'aria-label': 'গেলভেনীয় কোষ: এন\'ড, কেথ\'ড, লৱণ সেতু আৰু ইলেক্ট্ৰনৰ প্ৰবাহ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var W = [[105, 70], [105, 36], [315, 36], [315, 70]], L = PATH_LEN(W), SB = [[160, 100], [260, 100]];
    var eDots = [], iDots = [], phase = 0, calc = null;

    function compute() {
      var a = { m: st.m1, c: st.c1 }, b = { m: st.m2, c: st.c2 };
      if (a.m === b.m ? a.c > b.c : MET[a.m].E > MET[b.m].E) { var t = a; a = b; b = t; }   /* a = anode */
      a.z = MET[a.m].z; b.z = MET[b.m].z;
      var n = lcm(a.z, b.z), E0 = MET[b.m].E - MET[a.m].E;
      var Q = Math.pow(a.c, n / a.z) / Math.pow(b.c, n / b.z);
      var E = E0 - 0.0591 / n * Math.log10(Q);
      return { a: a, b: b, n: n, E0: E0, Q: Q, E: E };
    }
    function build() {
      calc = compute(); svg.innerHTML = '';
      var a = calc.a, b = calc.b;
      [40, 250].forEach(function (x) { svg.appendChild(s('rect', { x: x, y: 130, width: 130, height: 110, rx: 6, style: 'fill:var(--electron);opacity:.15' })); });
      svg.appendChild(s('path', { d: 'M150 150 V108 Q150 98 160 98 H260 Q270 98 270 108 V150', fill: 'none', style: 'stroke:var(--muted)', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: .45 }));
      svg.appendChild(s('rect', { x: 96, y: 70, width: 18, height: 150, style: 'fill:' + MET[a.m].c }));
      svg.appendChild(s('rect', { x: 306, y: 70, width: 18, height: 150, style: 'fill:' + MET[b.m].c }));
      svg.appendChild(s('polyline', { points: W.map(function (p) { return p.join(','); }).join(' '), fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2 }));
      svg.appendChild(s('circle', { cx: 210, cy: 36, r: 22, style: 'fill:var(--canvas);stroke:var(--text)', 'stroke-width': 2 }));
      svg.appendChild(s('text', { x: 210, y: 40, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, style: 'fill:var(--text)', text: calc.E.toFixed(2) + ' V' }));
      svg.appendChild(s('text', { x: 105, y: 262, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, style: 'fill:var(--text)', text: 'এন\'ড (−) ' + a.m }));
      svg.appendChild(s('text', { x: 315, y: 262, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, style: 'fill:var(--text)', text: 'কেথ\'ড (+) ' + b.m }));
      svg.appendChild(s('text', { x: 105, y: 232, 'text-anchor': 'middle', 'font-size': 11, style: 'fill:var(--muted)', text: a.c + ' M' }));
      svg.appendChild(s('text', { x: 315, y: 232, 'text-anchor': 'middle', 'font-size': 11, style: 'fill:var(--muted)', text: b.c + ' M' }));
      eDots = []; iDots = [];
      for (var i = 0; i < 8; i++) { var c = s('circle', { r: 4.5, style: 'fill:var(--electron)' }); svg.appendChild(c); eDots.push(c); }
      for (i = 0; i < 6; i++) {
        var cat = i % 2 === 0, g = s('g'), cc = s('circle', { r: 6, style: 'fill:' + (cat ? 'var(--alpha)' : 'var(--proton)') }), tx = s('text', { 'text-anchor': 'middle', y: 3.5, 'font-size': 10, 'font-weight': 700, style: 'fill:#fff', text: cat ? '+' : '−' });
        g.appendChild(cc); g.appendChild(tx); svg.appendChild(g); iDots.push({ g: g, cat: cat, u: i / 6 });
      }
      paint();
    }
    function paint() {
      var a = calc.a, b = calc.b, n = calc.n, ca = n / a.z, cb = n / b.z;
      var dG = -n * F * calc.E / 1000, logK = n * calc.E0 / 0.0591;
      var same = a.m === b.m;
      info.innerHTML =
        (same ? '<b>ঘনত্ব কোষ (concentration cell)</b> — দুয়োফালে একে ধাতু; কম গাঢ়তাৰ ফাল এন\'ড হয়।<br>' : '') +
        'এন\'ড (জাৰণ): ' + (ca > 1 ? ca + ' ' : '') + a.m + '(s) → ' + (ca > 1 ? ca + ' ' : '') + ion(a.m, a.z) + ' + ' + n + 'e<sup>−</sup><br>' +
        'কেথ\'ড (বিজাৰণ): ' + (cb > 1 ? cb + ' ' : '') + ion(b.m, b.z) + ' + ' + n + 'e<sup>−</sup> → ' + (cb > 1 ? cb + ' ' : '') + b.m + '(s)<br>' +
        'কোষ: ' + a.m + '(s) | ' + ion(a.m, a.z) + '(' + a.c + ' M) || ' + ion(b.m, b.z) + '(' + b.c + ' M) | ' + b.m + '(s)<br>' +
        'E°<sub>cell</sub> = ' + (same ? 0 : MET[b.m].E.toFixed(2)) + (same ? '' : ' − (' + MET[a.m].E.toFixed(2) + ')') + ' = <b>' + calc.E0.toFixed(2) + ' V</b> · n = ' + n + ' · Q = ' + (calc.Q < 1e-3 || calc.Q > 1e3 ? sci(calc.Q, 2) : calc.Q.toFixed(3)) + '<br>' +
        'E<sub>cell</sub> = E° − (0.0591/n) log Q = <b>' + calc.E.toFixed(3) + ' V</b> · Δ<sub>r</sub>G = −nFE = <b>' + dG.toFixed(1) + ' kJ mol<sup>−1</sup></b>' +
        (same ? '' : '<br>K<sub>c</sub> = 10<sup>nE°/0.0591</sup> ≈ <b>' + sci(Math.pow(10, logK), 1) + '</b>');
    }
    function tick(dt) {
      var v = clamp(calc.E / 1.2, 0, 1), speed = v * 90;
      phase += speed * dt;
      eDots.forEach(function (d, i) { var p = polyline(W, phase + i * L / eDots.length); d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]); d.setAttribute('visibility', calc.E > 0.002 ? 'visible' : 'hidden'); });
      iDots.forEach(function (d) {
        d.u = (d.u + dt * v * 0.35 + 1) % 1;
        var u = d.cat ? d.u : 1 - d.u;
        d.g.setAttribute('transform', 'translate(' + (SB[0][0] + u * (SB[1][0] - SB[0][0])) + ',' + (SB[0][1] + (d.cat ? -2 : 2)) + ')');
        d.g.setAttribute('visibility', calc.E > 0.002 ? 'visible' : 'hidden');
      });
    }
    var names = Object.keys(MET).map(function (m) { return { value: m, label: m + ' (E° = ' + MET[m].E.toFixed(2) + ' V)' }; });
    var s1 = k.select('Electrode 1', names, st.m1, function (v) { st.m1 = v; build(); });
    var s2 = k.select('Electrode 2', names, st.m2, function (v) { st.m2 = v; build(); });
    var c1 = k.slider('c₁ (M)', 0.001, 2, 0.001, st.c1, function (v) { st.c1 = v; build(); });
    var c2 = k.slider('c₂ (M)', 0.001, 2, 0.001, st.c2, function (v) { st.c2 = v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [s1.el, c1.el]));
    root.appendChild(h('div', { 'class': 'row' }, [s2.el, c2.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--electron)' }), 'ইলেক্ট্ৰন (এন\'ডৰ পৰা কেথ\'ডলৈ)']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--alpha)' }), 'ধনায়ন']), h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--proton)' }), 'ঋণায়ন (লৱণ সেতুত)'])]));
    var lp = k.loop(root, tick);
    build(); lp.start();
  });

  /* ================================================================== Nernst equation plot */
  A.register('nernst', function (root, k) {
    var h = k.h, W = 480, H = 280, PL = 56, PR = 16, PT = 18, PB = 40;
    var st = { E0: 1.10, n: 2, logQ: 0 };
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'নাৰ্ন্‌ষ্ট সমীকৰণ: E বনাম log Q' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function E(q) { return st.E0 - 0.0591 / st.n * q; }
    function logK() { return st.n * st.E0 / 0.0591; }
    function draw() {
      var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), gr = k.cssVar('--grid'), teal = k.cssVar('--brand'), org = k.cssVar('--alpha'), txt = k.cssVar('--text'), bad = k.cssVar('--proton');
      var xmin = -10, xmax = Math.max(logK() * 1.15, 12), ymin = Math.min(-0.3, E(xmax)), ymax = st.E0 + 0.6;
      function X(q) { return PL + (q - xmin) / (xmax - xmin) * (W - PL - PR); }
      function Y(e) { return H - PB - (e - ymin) / (ymax - ymin) * (H - PT - PB); }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = gr; ctx.lineWidth = 1; ctx.fillStyle = mu; ctx.font = '11px sans-serif';
      for (var i = 0; i <= 4; i++) { var e = ymin + (ymax - ymin) * i / 4; ctx.beginPath(); ctx.moveTo(PL, Y(e)); ctx.lineTo(W - PR, Y(e)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText((Math.abs(e) < 0.05 ? 0 : e).toFixed(1), PL - 6, Y(e) + 4); ctx.textAlign = 'start'; }
      for (i = 0; i <= 5; i++) { var q = xmin + (xmax - xmin) * i / 5; ctx.fillText(q.toFixed(0), X(q) - 6, H - PB + 16); }
      ctx.strokeStyle = txt; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(PL, Y(0)); ctx.lineTo(W - PR, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), PT); ctx.lineTo(X(0), H - PB); ctx.strokeStyle = mu; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = teal; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(X(xmin), Y(E(xmin))); ctx.lineTo(X(xmax), Y(E(xmax))); ctx.stroke();
      ctx.fillStyle = bad; ctx.beginPath(); ctx.arc(X(logK()), Y(0), 6, 0, TAU); ctx.fill();
      ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.fillText('সাম্য (E = 0, Q = K)', PL + 8, Y(0) + 18);
      ctx.fillStyle = org; ctx.beginPath(); ctx.arc(X(st.logQ), Y(E(st.logQ)), 6, 0, TAU); ctx.fill();
      ctx.fillStyle = txt; ctx.fillText('log Q →', W / 2 - 20, H - 6);
      ctx.save(); ctx.translate(12, H / 2 + 20); ctx.rotate(-Math.PI / 2); ctx.fillText('E কোষ (V)', 0, 0); ctx.restore();
    }
    function paint() {
      var e = E(st.logQ), dG = -st.n * F * e / 1000;
      info.innerHTML = 'E = E° − (0.0591 / n) log Q = ' + st.E0.toFixed(2) + ' − (0.0591 / ' + st.n + ') × ' + st.logQ.toFixed(1) + ' = <b>' + e.toFixed(3) + ' V</b><br>' +
        'Δ<sub>r</sub>G = −nFE = <b>' + dG.toFixed(1) + ' kJ mol<sup>−1</sup></b> · সাম্য ধ্ৰুৱক: log K = nE° / 0.0591 = <b>' + logK().toFixed(1) + '</b> (K = ' + sci(Math.pow(10, logK()), 1) + ')<br>' +
        (e > 0.002 ? 'E &gt; 0 — কোষটোৱে বিদ্যুৎ দিয়ে (বিক্ৰিয়া আগবাঢ়ি আছে)' : (e < -0.002 ? 'E &lt; 0 — বিক্ৰিয়া উলোটা দিশত স্বতঃস্ফূৰ্ত' : '<b>E = 0 — সাম্য; বেটাৰি ‘শেষ’</b>'));
      draw();
    }
    var e0 = k.slider('E° (V)', 0.1, 2.0, 0.05, st.E0, function (v) { st.E0 = v; paint(); });
    var ns = k.select('n (electrons)', [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }], st.n, function (v) { st.n = +v; paint(); });
    var lq = k.slider('log Q', -10, 60, 0.5, st.logQ, function (v) { st.logQ = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [e0.el, ns.el]));
    root.appendChild(h('div', { 'class': 'row' }, [lq.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== conductivity and molar conductivity vs concentration */
  A.register('conductance', function (root, k) {
    var h = k.h, W = 480, H = 280, PL = 56, PR = 16, PT = 18, PB = 40;
    var L0 = 150.0, AK = 87.46, L0W = 390.5, KA = 1.78e-5, logc = -2.5;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'গাঢ়তাৰ লগত ম\'লাৰ পৰিবাহিতাৰ পৰিৱৰ্তন' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var XM = 0.35, YM = 420;
    function X(r) { return PL + r / XM * (W - PL - PR); }
    function Y(v) { return H - PB - v / YM * (H - PT - PB); }
    function strong(c) { return L0 - AK * Math.sqrt(c); }
    function alpha(c) { return (-KA + Math.sqrt(KA * KA + 4 * c * KA)) / (2 * c); }
    function weak(c) { return alpha(c) * L0W; }
    function draw(c) {
      var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), gr = k.cssVar('--grid'), teal = k.cssVar('--brand'), org = k.cssVar('--alpha'), txt = k.cssVar('--text');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = gr; ctx.fillStyle = mu; ctx.font = '11px sans-serif'; ctx.lineWidth = 1;
      for (var i = 0; i <= 4; i++) { var v = YM * i / 4; ctx.beginPath(); ctx.moveTo(PL, Y(v)); ctx.lineTo(W - PR, Y(v)); ctx.stroke(); ctx.fillText(Math.round(v), 24, Y(v) + 4); }
      for (i = 0; i <= 7; i++) { var r = XM * i / 7; ctx.fillText(r.toFixed(2), X(r) - 12, H - PB + 16); }
      function curve(fn, color) {
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath();
        for (var j = 1; j <= 120; j++) { var rr = XM * j / 120, cc = rr * rr, val = fn(cc); if (j === 1) ctx.moveTo(X(rr), Y(val)); else ctx.lineTo(X(rr), Y(val)); }
        ctx.stroke();
      }
      curve(strong, teal); curve(weak, org);
      var rc = Math.sqrt(c);
      ctx.strokeStyle = txt; ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(rc), PT); ctx.lineTo(X(rc), H - PB); ctx.stroke(); ctx.setLineDash([]);
      [[strong(c), teal], [weak(c), org]].forEach(function (p) { ctx.fillStyle = p[1]; ctx.beginPath(); ctx.arc(X(rc), Y(p[0]), 6, 0, TAU); ctx.fill(); });
      ctx.fillStyle = txt; ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
      ctx.fillText('√c (mol L⁻¹)^½ →', W / 2 - 40, H - 6);
      ctx.save(); ctx.translate(12, H / 2 + 50); ctx.rotate(-Math.PI / 2); ctx.fillText('Λm (S cm² mol⁻¹)', 0, 0); ctx.restore();
      ctx.fillStyle = teal; ctx.fillText('তীব্ৰ (KCl)', X(0.2), Y(strong(0.04)) - 10);
      ctx.fillStyle = org; ctx.fillText('মৃদু (CH₃COOH)', X(0.05) + 6, Y(weak(0.0025)) - 8);
    }
    function paint() {
      var c = Math.pow(10, logc), ls = strong(c), lw = weak(c), a = alpha(c);
      var ks = ls * c / 1000 * 100, kw = lw * c / 1000 * 100;     /* S m^-1 */
      info.innerHTML = 'গাঢ়তা c = <b>' + sci(c, 2) + ' mol L<sup>−1</sup></b><br>' +
        'KCl (তীব্ৰ): Λ<sub>m</sub> = Λ°<sub>m</sub> − A√c = <b>' + ls.toFixed(1) + '</b> S cm² mol⁻¹ · পৰিবহনতা κ = Λ<sub>m</sub>c/1000 = <b>' + sci(ks, 2) + '</b> S m<sup>−1</sup><br>' +
        'CH<sub>3</sub>COOH (মৃদু): বিয়োজন মাত্ৰা α = <b>' + a.toFixed(3) + '</b> · Λ<sub>m</sub> = αΛ°<sub>m</sub> = <b>' + lw.toFixed(1) + '</b> S cm² mol⁻¹ · κ = <b>' + sci(kw, 2) + '</b> S m<sup>−1</sup><br>' +
        '<span class="en">লঘু কৰিলে (c কমিলে) κ কমে, কিন্তু Λ<sub>m</sub> বাঢ়ে — মৃদু বিদ্যুৎবিশ্লেষ্যত অতি বেছিকৈ।</span>';
      draw(c);
    }
    var sl = k.slider('log₁₀ c', -4, -1, 0.05, logc, function (v) { logc = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [h('span', { text: 'Λ°ₘ(KCl) = 150.0, A = 87.46 (সূত্ৰ: Λm = Λ°m − A√c)' }), h('span', { text: 'Λ°ₘ(CH₃COOH) = 390.5, Kₐ = 1.78 × 10⁻⁵' })]));
    paint();
  });

  /* ================================================================== Kohlrausch's law */
  A.register('kohlrausch', function (root, k) {
    var h = k.h, s = k.s;
    var CAT = { 'H+': { z: 1, l: 349.6, f: 'H' }, 'Na+': { z: 1, l: 50.1, f: 'Na' }, 'K+': { z: 1, l: 73.5, f: 'K' }, 'Ca2+': { z: 2, l: 119.0, f: 'Ca' }, 'Mg2+': { z: 2, l: 106.0, f: 'Mg' } };
    var ANI = { 'OH-': { z: 1, l: 199.1, f: 'OH', poly: true }, 'Cl-': { z: 1, l: 76.3, f: 'Cl' }, 'Br-': { z: 1, l: 78.1, f: 'Br' }, 'CH3COO-': { z: 1, l: 40.9, f: 'CH₃COO', poly: true }, 'SO4 2-': { z: 2, l: 160.0, f: 'SO₄', poly: true } };
    var st = { c: 'Na+', a: 'Cl-' };
    var svg = s('svg', { viewBox: '0 0 400 150', 'class': 'anim-svg', role: 'img', 'aria-label': 'আয়নৰ চৰম ম\'লাৰ পৰিবাহিতাৰ যোগফল' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = CAT[st.c], a = ANI[st.a], g = gcd(c.z, a.z), nc = a.z / g, na = c.z / g;
      var lam = nc * c.l + na * a.l;
      var formula = c.f + (nc > 1 ? '<sub>' + nc + '</sub>' : '') + (na > 1 ? (a.poly ? '(' + a.f + ')' : a.f) + '<sub>' + na + '</sub>' : a.f);
      if (st.c === 'H+' && st.a === 'CH3COO-') formula = 'CH₃COOH'; else if (st.c === 'H+' && st.a === 'OH-') formula = 'H₂O';
      var maxL = 520, bw = function (v) { return Math.min(340, v / maxL * 340); };
      svg.innerHTML = '';
      svg.appendChild(s('text', { x: 10, y: 22, 'font-size': 13, style: 'fill:var(--text)', text: 'ধনায়ন λ°₊ × ' + nc + ' = ' + (nc * c.l).toFixed(1) }));
      svg.appendChild(s('rect', { x: 10, y: 30, width: bw(nc * c.l), height: 26, rx: 4, style: 'fill:var(--electron)' }));
      svg.appendChild(s('text', { x: 10, y: 80, 'font-size': 13, style: 'fill:var(--text)', text: 'ঋণায়ন λ°₋ × ' + na + ' = ' + (na * a.l).toFixed(1) }));
      svg.appendChild(s('rect', { x: 10, y: 88, width: bw(na * a.l), height: 26, rx: 4, style: 'fill:var(--proton)' }));
      svg.appendChild(s('text', { x: 10, y: 140, 'font-size': 12, style: 'fill:var(--muted)', text: 'সম্পূৰ্ণ দৈৰ্ঘ্য = Λ°ₘ (স্কেল: 520 S cm² mol⁻¹)' }));
      info.innerHTML = 'বিদ্যুৎবিশ্লেষ্য: <b>' + formula + '</b> → ν<sub>+</sub> = ' + nc + ', ν<sub>−</sub> = ' + na + '<br>' +
        'Λ°<sub>m</sub> = ν<sub>+</sub>λ°<sub>+</sub> + ν<sub>−</sub>λ°<sub>−</sub> = ' + nc + ' × ' + c.l + ' + ' + na + ' × ' + a.l + ' = <b>' + lam.toFixed(1) + ' S cm² mol<sup>−1</sup></b>' +
        ((st.c === 'H+' && st.a === 'CH3COO-') ? '<br><span class="en">ইয়াৰ পৰা মৃদু এছিড CH₃COOH ৰ Λ°ₘ = 349.6 + 40.9 = 390.5 পোৱা যায়।</span>' : '');
    }
    var cs = k.select('Cation', Object.keys(CAT).map(function (n) { return { value: n, label: n.replace('2+', '²⁺').replace('+', '⁺') + ' (λ° = ' + CAT[n].l + ')' }; }), st.c, function (v) { st.c = v; paint(); });
    var as = k.select('Anion', Object.keys(ANI).map(function (n) { return { value: n, label: n.replace('2-', '²⁻').replace('-', '⁻') + ' (λ° = ' + ANI[n].l + ')' }; }), st.a, function (v) { st.a = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [cs.el, as.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== Faraday's laws: deposit calculator */
  A.register('faraday', function (root, k) {
    var h = k.h, s = k.s;
    var MET = { Ag: { z: 1, M: 108 }, Cu: { z: 2, M: 63.5 }, Ni: { z: 2, M: 58.7 }, Zn: { z: 2, M: 65.4 }, Al: { z: 3, M: 27 }, Mg: { z: 2, M: 24.3 } };
    var st = { m: 'Cu', I: 2, t: 30 }, sim = 0, playing = false;
    var svg = s('svg', { viewBox: '0 0 400 210', 'class': 'anim-svg', role: 'img', 'aria-label': 'ফেৰাডেৰ সূত্ৰ: বিদ্যুৎবিশ্লেষণত ধাতুৰ জমা' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var bubbles = [], depo = s('rect', { x: 262, width: 20, rx: 3 }), bub = s('g');
    svg.appendChild(s('rect', { x: 70, y: 70, width: 260, height: 125, rx: 8, style: 'fill:var(--electron);opacity:.14' }));
    svg.appendChild(s('rect', { x: 118, y: 40, width: 16, height: 150, style: 'fill:var(--muted)' }));
    svg.appendChild(s('rect', { x: 266, y: 40, width: 16, height: 150, style: 'fill:var(--muted)' }));
    svg.appendChild(depo); svg.appendChild(bub);
    svg.appendChild(s('text', { x: 126, y: 206, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'এন\'ড (+)' }));
    svg.appendChild(s('text', { x: 274, y: 206, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'কেথ\'ড (−)' }));
    svg.appendChild(s('path', { d: 'M126 40 V16 H274 V40', fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2 }));
    svg.appendChild(s('text', { x: 200, y: 12, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--text)', id: 'ftxt', text: '' }));
    var lab = svg.lastChild;

    function mass(tmin) { var m = MET[st.m]; return m.M * st.I * tmin * 60 / (m.z * F); }
    function paint() {
      var m = MET[st.m], t = playing || sim > 0 ? sim : st.t, Q = st.I * t * 60, mol = Q / F, g = mass(t);
      lab.textContent = 'I = ' + st.I + ' A · t = ' + t.toFixed(0) + ' min';
      var hgt = clamp(g * 40, 0, 118);
      depo.setAttribute('x', 262); depo.setAttribute('width', 8); depo.setAttribute('y', 190 - hgt); depo.setAttribute('height', hgt); depo.setAttribute('style', 'fill:var(--alpha)');
      var tm = st.t, Qf = st.I * tm * 60, gf = mass(tm);
      info.innerHTML = '<b>' + st.m + '</b>: ' + ion(st.m, m.z) + ' + ' + m.z + 'e<sup>−</sup> → ' + st.m + ' (ম\'লাৰ ভৰ ' + m.M + ' g mol<sup>−1</sup>)<br>' +
        'আধান Q = I × t = ' + st.I + ' A × ' + (tm * 60) + ' s = <b>' + Qf.toFixed(0) + ' C</b> = ' + (Qf / F).toFixed(3) + ' F<br>' +
        'জমা হোৱা ' + st.m + ' = (M × Q) / (z × F) = (' + m.M + ' × ' + Qf.toFixed(0) + ') / (' + m.z + ' × 96500) = <b>' + gf.toFixed(3) + ' g</b>' +
        (playing ? '<br><span class="en">এতিয়া: ' + t.toFixed(0) + ' মিনিটত ' + g.toFixed(3) + ' g</span>' : '');
    }
    function tick(dt) {
      if (playing) { sim += st.t * dt / 4; if (sim >= st.t) { sim = st.t; playing = false; } }
      /* bubbles at the anode (O2) as decoration */
      if (Math.random() < 0.12) bubbles.push({ x: 126 + rnd(-8, 8), y: 185, c: s('circle', { r: 2.5, style: 'fill:var(--muted);opacity:.7' }) });
      bubbles.forEach(function (b) { b.y -= dt * 40; b.c.setAttribute('cx', b.x); b.c.setAttribute('cy', b.y); if (!b.c.parentNode) bub.appendChild(b.c); });
      bubbles = bubbles.filter(function (b) { if (b.y < 75) { b.c.remove(); return false; } return true; });
      paint();
    }
    var ms = k.select('Metal', Object.keys(MET).map(function (n) { return { value: n, label: n + ' (' + ion(n, MET[n].z).replace(/<\/?sup>/g, '') + ')' }; }), st.m, function (v) { st.m = v; sim = 0; paint(); });
    var is = k.slider('Current (A)', 0.5, 10, 0.5, st.I, function (v) { st.I = v; sim = 0; paint(); });
    var ts = k.slider('Time (min)', 5, 180, 5, st.t, function (v) { st.t = v; sim = 0; paint(); });
    var play = k.button('▶ Run electrolysis', function () { sim = 0.01; playing = true; }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [ms.el, is.el]));
    root.appendChild(h('div', { 'class': 'row' }, [ts.el, play]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paint(); lp.start();
  });

  /* ================================================================== products of electrolysis */
  A.register('electrolysis', function (root, k) {
    var h = k.h, s = k.s;
    var CASES = [
      { n: 'Molten NaCl (inert electrodes)', c: { p: 'Na ধাতু', t: 'metal', col: '#c9ced6' }, a: { p: 'Cl₂ গেছ', t: 'gas', col: '#9be15d' },
        why: 'গলিত অৱস্থাত কেৱল Na⁺ আৰু Cl⁻ থাকে। কেথ\'ডত Na⁺ + e⁻ → Na; এন\'ডত Cl⁻ → ½Cl₂ + e⁻।' },
      { n: 'Aqueous NaCl (inert electrodes)', c: { p: 'H₂ গেছ (দ্ৰৱত OH⁻ বাঢ়ে)', t: 'gas', col: '#8ecae6' }, a: { p: 'Cl₂ গেছ', t: 'gas', col: '#9be15d' },
        why: 'কেথ\'ডত Na⁺ (E° = −2.71 V) ৰ বিজাৰণতকৈ পানীৰ বিজাৰণ (E° = −0.83 V) সহজ, গতিকে H₂ ওলায়। এন\'ডত O₂ ৰ (E° = 1.23 V) পৰিৱৰ্তে অধিবিভৱৰ বাবে Cl₂ (1.36 V) ওলায়। ফলত NaOH, Cl₂, H₂ পোৱা যায়।' },
      { n: 'Aqueous CuSO₄ (Pt electrodes)', c: { p: 'Cu ধাতু জমা', t: 'metal', col: '#c46a2d' }, a: { p: 'O₂ গেছ', t: 'gas', col: '#ffd6a5' },
        why: 'কেথ\'ডত Cu²⁺ (E° = +0.34 V) পানীতকৈ সহজে বিজাৰিত হয়। এন\'ডত SO₄²⁻ জাৰিত নহয়; পানী জাৰিত হৈ O₂ ওলায়।' },
      { n: 'Aqueous CuSO₄ (Cu electrodes)', c: { p: 'Cu ধাতু জমা', t: 'metal', col: '#c46a2d' }, a: { p: 'Cu এন\'ড দ্ৰবীভূত হয় (Cu → Cu²⁺ + 2e⁻)', t: 'dissolve', col: '#c46a2d' },
        why: 'ক্ৰিয়াশীল ইলেক্ট্ৰ\'ড (Cu) নিজেই জাৰিত হয়: ইয়াৰ জাৰণ বিভৱ পানীৰ তকৈ কম। এইটোৱেই অশুদ্ধ কপাৰ বিশুদ্ধকৰণৰ নীতি।' },
      { n: 'Dilute H₂SO₄ (Pt electrodes)', c: { p: 'H₂ গেছ', t: 'gas', col: '#8ecae6' }, a: { p: 'O₂ গেছ', t: 'gas', col: '#ffd6a5' },
        why: 'লঘু H₂SO₄ ত পানীৰ বিদ্যুৎবিশ্লেষণ হয়: কেথ\'ডত 2H⁺ + 2e⁻ → H₂, এন\'ডত 2H₂O → O₂ + 4H⁺ + 4e⁻। (H₂ : O₂ = 2 : 1)' },
      { n: 'Aqueous AgNO₃ (Pt electrodes)', c: { p: 'Ag ধাতু জমা', t: 'metal', col: '#e5e9ee' }, a: { p: 'O₂ গেছ', t: 'gas', col: '#ffd6a5' },
        why: 'Ag⁺ (E° = +0.80 V) সহজে বিজাৰিত হয়। এন\'ডত পানী জাৰিত হৈ O₂ ওলায়।' },
      { n: 'Aqueous AgNO₃ (Ag electrodes)', c: { p: 'Ag ধাতু জমা', t: 'metal', col: '#e5e9ee' }, a: { p: 'Ag এন\'ড দ্ৰবীভূত হয়', t: 'dissolve', col: '#e5e9ee' },
        why: 'Ag ইলেক্ট্ৰ\'ড সক্ৰিয়: এন\'ডত Ag → Ag⁺ + e⁻। এন\'ডৰ Ag দ্ৰবীভূত হয় আৰু কেথ\'ডত সমপৰিমাণ Ag জমা হয় (ইলেক্ট্ৰ\'ডপ্লেটিং)।' }
    ];
    var cur = 0, bubbles = [], growth = 0;
    var svg = s('svg', { viewBox: '0 0 400 220', 'class': 'anim-svg', role: 'img', 'aria-label': 'বিদ্যুৎবিশ্লেষণৰ ফলত এন\'ড আৰু কেথ\'ডত উৎপন্ন পদাৰ্থ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var gB = s('g'), anode, cathode, depo;
    function build() {
      svg.innerHTML = ''; bubbles = []; growth = 0;
      var c = CASES[cur];
      svg.appendChild(s('rect', { x: 50, y: 80, width: 300, height: 125, rx: 8, style: 'fill:var(--electron);opacity:.14' }));
      anode = s('rect', { x: 120, y: 40, width: 18, height: 150, style: 'fill:var(--muted)' });
      cathode = s('rect', { x: 262, y: 40, width: 18, height: 150, style: 'fill:var(--muted)' });
      svg.appendChild(anode); svg.appendChild(cathode);
      depo = s('rect', { x: 280, y: 188, width: 5, height: 0, style: 'fill:' + c.c.col });
      svg.appendChild(depo);
      svg.appendChild(s('path', { d: 'M129 40 V14 H271 V40', fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2 }));
      svg.appendChild(s('text', { x: 200, y: 10, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--text)', text: 'DC উৎস' }));
      svg.appendChild(s('text', { x: 129, y: 216, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'এন\'ড (+)' }));
      svg.appendChild(s('text', { x: 271, y: 216, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'কেথ\'ড (−)' }));
      svg.appendChild(gB);
      gB.innerHTML = '';
      info.innerHTML = '<b>এন\'ড:</b> ' + c.a.p + '<br><b>কেথ\'ড:</b> ' + c.c.p + '<br><span class="en">' + c.why + '</span>';
    }
    function tick(dt) {
      var c = CASES[cur];
      growth += dt;
      if (c.c.t === 'gas' && Math.random() < 0.3) bubbles.push({ x: 271 + rnd(-8, 8), y: 175, col: c.c.col, ax: 1 });
      if (c.a.t === 'gas' && Math.random() < 0.3) bubbles.push({ x: 129 + rnd(-8, 8), y: 175, col: c.a.col, ax: 0 });
      if (c.c.t === 'metal') { var hh = Math.min(100, growth * 14); depo.setAttribute('y', 188 - hh); depo.setAttribute('height', hh); }
      if (c.a.t === 'dissolve') anode.setAttribute('height', Math.max(50, 150 - growth * 12));
      bubbles.forEach(function (b) { b.y -= dt * 45; });
      bubbles = bubbles.filter(function (b) { return b.y > 84; });
      gB.innerHTML = '';
      bubbles.forEach(function (b) { gB.appendChild(s('circle', { cx: b.x, cy: b.y, r: 3, style: 'fill:' + b.col + ';stroke:var(--muted);stroke-width:.5' })); });
    }
    var sel = k.select('Electrolyte', CASES.map(function (c, i) { return { value: i, label: c.n }; }), cur, function (v) { cur = +v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    build(); lp.start();
  });

  /* ================================================================== corrosion and protection */
  A.register('corrosion', function (root, k) {
    var h = k.h, s = k.s;
    var CASES = [
      { n: 'Bare iron + water drop', rust: 1, txt: 'বিন্দুৰ মাজত Fe এন\'ড হিচাপে কাম কৰে: Fe → Fe²⁺ + 2e⁻ (E° = −0.44 V)। ইলেক্ট্ৰন ধাতুৰ মাজেৰে প্ৰান্তলৈ যায়, য\'ত বায়ুৰ O₂ বিজাৰিত হয়: O₂ + 4H⁺ + 4e⁻ → 2H₂O (E° = 1.23 V)। Fe²⁺ ক O₂ য়ে Fe³⁺ লৈ জাৰিত কৰে — ফলত মামৰ (Fe₂O₃·xH₂O) জমা হয়।' },
      { n: 'Painted iron', rust: 0, txt: 'ৰঙৰ স্তৰে আইৰণক পানী আৰু বায়ুৰ সংস্পৰ্শৰ পৰা আঁতৰাই ৰাখে। বিদ্যুৎৰাসায়নিক কোষ গঠন নহয়, গতিকে মামৰ নধৰে।' },
      { n: 'Zinc-coated (galvanised), scratched', rust: 0, txt: 'Zn (E° = −0.76 V) Fe (−0.44 V) তকৈ বেছি সক্ৰিয়। আঁচোৰ লাগিলেও Zn এন\'ড হয় আৰু নিজে ক্ষয় হয়; Fe কেথ\'ড হোৱাৰ বাবে সুৰক্ষিত থাকে। ইয়াক বলিদানকাৰী সুৰক্ষা (sacrificial protection) বোলে।' },
      { n: 'Tin-coated, scratched', rust: 2, txt: 'Sn (E° = −0.14 V) Fe তকৈ কম সক্ৰিয়। আঁচোৰ লাগিলে Fe এন\'ড হয় আৰু Sn কেথ\'ড; ফলত আইৰণ খোলা অৱস্থাতকৈও দ্ৰুতগতিত ক্ষয় হয়।' }
    ];
    var cur = 0, t = 0, phase = 0;
    var svg = s('svg', { viewBox: '0 0 400 220', 'class': 'anim-svg', role: 'img', 'aria-label': 'আইৰণৰ ক্ষয়ীভৱন আৰু সুৰক্ষা' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var rustG = s('rect'), dots = [], PATH = [];
    function build() {
      svg.innerHTML = ''; t = 0; dots = [];
      var c = CASES[cur];
      svg.appendChild(s('rect', { x: 20, y: 140, width: 360, height: 40, rx: 4, style: 'fill:#5d636b' }));
      svg.appendChild(s('text', { x: 30, y: 163, 'font-size': 13, 'font-weight': 700, style: 'fill:#fff', text: 'Fe' }));
      var drop = c.n.indexOf('Painted') < 0;
      if (cur === 1) {
        svg.appendChild(s('rect', { x: 20, y: 130, width: 360, height: 10, style: 'fill:var(--alpha)' }));
        svg.appendChild(s('ellipse', { cx: 200, cy: 118, rx: 70, ry: 14, style: 'fill:var(--electron);opacity:.35' }));
        svg.appendChild(s('text', { x: 200, y: 60, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:var(--text)', text: 'ৰং — পানী আৰু Fe ৰ সংস্পৰ্শ নাই' }));
      } else {
        if (cur === 2 || cur === 3) {
          svg.appendChild(s('rect', { x: 20, y: 128, width: 360, height: 12, style: 'fill:' + (cur === 2 ? '#8a93a0' : '#d7dbe0') }));
          svg.appendChild(s('rect', { x: 188, y: 126, width: 24, height: 16, style: 'fill:var(--canvas)' }));   /* scratch */
          svg.appendChild(s('text', { x: 30, y: 122, 'font-size': 12, style: 'fill:var(--muted)', text: cur === 2 ? 'Zn আৱৰণ' : 'Sn আৱৰণ' }));
        }
        svg.appendChild(s('path', { d: 'M110 140 Q110 70 200 70 Q290 70 290 140 Z', style: 'fill:var(--electron);opacity:.3;stroke:var(--electron)', 'stroke-width': 1.5 }));
        svg.appendChild(s('text', { x: 200, y: 56, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--muted)', text: 'O₂ (বায়ুৰ)' }));
        /* anode / cathode labels */
        var anodeX = cur === 2 ? 130 : 200, cathX = cur === 2 ? 200 : 118;
        if (cur === 0) { anodeX = 200; cathX = 125; }
        if (cur === 3) { anodeX = 200; cathX = 125; }
        if (cur === 2) { anodeX = 125; cathX = 200; }
        svg.appendChild(s('text', { x: anodeX, y: 205, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--proton)', text: cur === 2 ? 'এন\'ড: Zn' : 'এন\'ড: Fe' }));
        svg.appendChild(s('text', { x: cathX, y: 205, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--electron)', text: cur === 2 ? 'কেথ\'ড: Fe' : (cur === 3 ? 'কেথ\'ড: Sn' : 'কেথ\'ড: O₂ বিজাৰণ') }));
        PATH = [[anodeX, 190], [anodeX, 196], [cathX, 196], [cathX, 190]];
        for (var i = 0; i < 6; i++) { var d = s('circle', { r: 3.6, style: 'fill:var(--electron)' }); svg.appendChild(d); dots.push(d); }
      }
      rustG = s('rect', { x: 188, y: 134, width: 24, height: 0, rx: 4, style: 'fill:#9c4a1a' });
      svg.appendChild(rustG);
      info.innerHTML = '<b>' + c.n + '</b><br>' + c.txt;
    }
    function tick(dt) {
      var c = CASES[cur]; t += dt;
      phase += dt * 60;
      if (dots.length) {
        var L = PATH_LEN(PATH);
        dots.forEach(function (d, i) { var p = polyline(PATH, phase + i * L / dots.length); d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1] - 8); });
      }
      var rate = c.rust === 1 ? 5 : (c.rust === 2 ? 11 : 0);
      var hh = Math.min(46, t * rate);
      rustG.setAttribute('y', 134 - hh * 0.5); rustG.setAttribute('height', hh * 0.5 + 6);
      rustG.setAttribute('width', 24 + Math.min(60, hh)); rustG.setAttribute('x', 188 - Math.min(60, hh) / 2);
      rustG.setAttribute('visibility', rate ? 'visible' : 'hidden');
    }
    var sel = k.select('Case', CASES.map(function (c, i) { return { value: i, label: c.n }; }), cur, function (v) { cur = +v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, k.button('Restart', build)]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    build(); lp.start();
  });

  /* ================================================================== lead storage battery */
  A.register('battery', function (root, k) {
    var h = k.h, W = 480, H = 280;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'লেড ষ্ট\'ৰেজ বেটাৰিৰ আধান আৰু নিৰ্গমন' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var soc = 100, mode = 'idle';
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function dens() { return 1.10 + 0.18 * soc / 100; }
    function volt() { return 1.95 + 0.15 * soc / 100; }
    function draw() {
      var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), txt = k.cssVar('--text'), br = k.cssVar('--border');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var f = soc / 100;
      var bars = [['Pb', f, '#4f5560'], ['PbO₂', f, '#7a4a2a'], ['PbSO₄', 1 - f, '#d7dbe0'], ['H₂SO₄', f, '#f4c430']];
      ctx.font = '600 13px sans-serif';
      bars.forEach(function (b, i) {
        var x = 40 + i * 105, hh = 160 * b[1] + 4;
        ctx.fillStyle = br; ctx.fillRect(x, 40, 70, 160);
        ctx.fillStyle = b[2]; ctx.fillRect(x, 200 - hh, 70, hh);
        ctx.fillStyle = txt; ctx.textAlign = 'center'; ctx.fillText(b[0], x + 35, 222); ctx.textAlign = 'start';
      });
      ctx.fillStyle = mu; ctx.font = '12px "Noto Sans Bengali", sans-serif';
      ctx.fillText('পদাৰ্থৰ পৰিমাণ (আপেক্ষিক)', 40, 28);
      ctx.fillStyle = txt; ctx.font = '700 15px "Noto Sans Bengali", sans-serif';
      ctx.fillText('এটা কোষ: ' + volt().toFixed(2) + ' V   ·   6 কোষ: ' + (6 * volt()).toFixed(1) + ' V', 40, 255);
    }
    function paint() {
      var m = mode === 'charge' ? 'আধান (charging) — বাহ্যিক উৎসৰ বিদ্যুৎ প্ৰয়োগ; বিক্ৰিয়া উলোটা' : (mode === 'discharge' ? 'নিৰ্গমন (discharging) — বেটাৰিৰ পৰা বিদ্যুৎ পোৱা যায়' : 'বিশ্ৰাম');
      info.innerHTML = '<b>' + m + '</b><br>আধানৰ মাত্ৰা: <b>' + soc.toFixed(0) + '%</b> · H<sub>2</sub>SO<sub>4</sub> ৰ ঘনত্ব ≈ <b>' + dens().toFixed(2) + ' g mL<sup>−1</sup></b> (ইয়াৰ পৰা বেটাৰিৰ অৱস্থা জনা যায়)<br>' +
        'নিৰ্গমনত: এন\'ড Pb + SO<sub>4</sub><sup>2−</sup> → PbSO<sub>4</sub> + 2e<sup>−</sup>; কেথ\'ড PbO<sub>2</sub> + SO<sub>4</sub><sup>2−</sup> + 4H<sup>+</sup> + 2e<sup>−</sup> → PbSO<sub>4</sub> + 2H<sub>2</sub>O<br>' +
        'সম্পূৰ্ণ: Pb + PbO<sub>2</sub> + 2H<sub>2</sub>SO<sub>4</sub> ⇌ 2PbSO<sub>4</sub> + 2H<sub>2</sub>O (আধান কৰিলে ডেউকালে)';
      draw();
    }
    function tick(dt) {
      if (mode === 'discharge') soc = Math.max(0, soc - dt * 8);
      if (mode === 'charge') soc = Math.min(100, soc + dt * 10);
      paint();
    }
    var lp = k.loop(root, tick);
    var b1 = k.button('Discharge', function () { mode = 'discharge'; if (!lp.running) lp.start(); });
    var b2 = k.button('Charge', function () { mode = 'charge'; if (!lp.running) lp.start(); }, 'primary');
    var b3 = k.button('Pause', function () { mode = 'idle'; });
    root.appendChild(h('div', { 'class': 'row' }, [b1, b2, b3]));
    root.appendChild(info);
    paint(); lp.start();
  });

  /* ================================================================== H2-O2 fuel cell */
  A.register('fuelcell', function (root, k) {
    var h = k.h, s = k.s, run = true, water = 0, phase = 0;
    var svg = s('svg', { viewBox: '0 0 420 240', 'class': 'anim-svg', role: 'img', 'aria-label': 'হাইড্ৰজেন-অক্সিজেন ইন্ধন কোষ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    svg.appendChild(s('rect', { x: 150, y: 60, width: 120, height: 130, style: 'fill:var(--electron);opacity:.2;stroke:var(--electron)' }));
    svg.appendChild(s('rect', { x: 140, y: 60, width: 14, height: 130, style: 'fill:#4f5560' }));
    svg.appendChild(s('rect', { x: 266, y: 60, width: 14, height: 130, style: 'fill:#4f5560' }));
    svg.appendChild(s('text', { x: 210, y: 128, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'জলীয় KOH' }));
    svg.appendChild(s('text', { x: 60, y: 130, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, style: 'fill:var(--electron)', text: 'H₂ →' }));
    svg.appendChild(s('text', { x: 360, y: 130, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, style: 'fill:var(--proton)', text: '← O₂' }));
    svg.appendChild(s('text', { x: 147, y: 208, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'এন\'ড (−)' }));
    svg.appendChild(s('text', { x: 273, y: 208, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--text)', text: 'কেথ\'ড (+)' }));
    svg.appendChild(s('text', { x: 335, y: 58, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--muted)', text: 'H₂O (বাষ্প) ↑' }));
    var W = [[147, 60], [147, 28], [273, 28], [273, 60]], L = PATH_LEN(W), dots = [];
    svg.appendChild(s('polyline', { points: W.map(function (p) { return p.join(','); }).join(' '), fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2 }));
    svg.appendChild(s('circle', { cx: 210, cy: 28, r: 14, style: 'fill:var(--canvas);stroke:var(--text)', 'stroke-width': 2 }));
    svg.appendChild(s('text', { x: 210, y: 32, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, style: 'fill:var(--text)', text: '≈1V' }));
    for (var i = 0; i < 8; i++) { var d = s('circle', { r: 4, style: 'fill:var(--electron)' }); svg.appendChild(d); dots.push(d); }
    var gas = []; var gG = s('g'); svg.appendChild(gG);
    function tick(dt) {
      if (run) { phase += dt * 70; water += dt * 0.6; if (Math.random() < 0.3) gas.push({ x: 20 + rnd(0, 10), y: rnd(80, 170), t: 0, h: true }); if (Math.random() < 0.3) gas.push({ x: 400 - rnd(0, 10), y: rnd(80, 170), t: 0, h: false }); }
      dots.forEach(function (d, i) { var p = polyline(W, phase + i * L / dots.length); d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]); d.setAttribute('visibility', run ? 'visible' : 'hidden'); });
      gas.forEach(function (g) { g.t += dt * 0.5; });
      gas = gas.filter(function (g) { return g.t < 1; });
      gG.innerHTML = '';
      gas.forEach(function (g) {
        var x = g.h ? 20 + g.t * (140 - 20) : 400 - g.t * (400 - 282);
        gG.appendChild(s('circle', { cx: x, cy: g.y, r: 4, style: 'fill:' + (g.h ? 'var(--electron)' : 'var(--proton)') + ';opacity:' + (1 - g.t * 0.6) }));
      });
      info.innerHTML = 'এন\'ড: 2H<sub>2</sub>(g) + 4OH<sup>−</sup> → 4H<sub>2</sub>O(l) + 4e<sup>−</sup><br>কেথ\'ড: O<sub>2</sub>(g) + 2H<sub>2</sub>O(l) + 4e<sup>−</sup> → 4OH<sup>−</sup><br>' +
        'কোষ বিক্ৰিয়া: <b>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O</b> (প্ৰদূষণ নাই) · উৎপন্ন পানী: ' + water.toFixed(1) + ' একক<br>' +
        'দক্ষতা: ইন্ধন কোষ ≈ <b>70 %</b>, তাপবিদ্যুৎ কেন্দ্ৰ ≈ 40 %';
    }
    var lp = k.loop(root, tick);
    root.appendChild(h('div', { 'class': 'row' }, [k.button('Start / Stop', function () { run = !run; })]));
    root.appendChild(info);
    lp.start();
  });
})();
