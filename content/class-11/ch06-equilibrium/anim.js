/* Animations for Class 11, Chapter 6: Equilibrium (সাম্য).
   Registered: eq-vapour, eq-approach, kc-calc, hetero-caco3, q-vs-k, ice-solver, lechatelier,
               ph-scale, weak-acid, hydrolysis, buffer, ksp-solubility
   Controls are English (app UI); read-outs follow the reader's language: L("assamese", "english"). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  var RG = 0.0831;     /* bar L mol-1 K-1 */
  var KW = 1e-14;      /* 298 K */
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };

  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  function opts(list, fn) { return list.map(function (o, i) { return { value: String(i), label: fn(o, i) }; }); }
  function sup(n) { return String(n).split('').map(function (c) { return SUP[c] || c; }).join(''); }
  function sci(x, d) {
    if (!isFinite(x)) return '∞';
    if (x === 0) return '0';
    d = d === undefined ? 2 : d;
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e), ms = m.toFixed(d);
    if (Math.abs(parseFloat(ms)) >= 10) { e += 1; ms = (m / 10).toFixed(d); }
    return ms + ' × 10' + sup(e);
  }
  function g3(x) {
    if (x === 0) return '0';
    if (!isFinite(x)) return '∞';
    var a = Math.abs(x);
    if (a >= 0.01 && a < 999.5) return String(parseFloat(x.toPrecision(3)));
    return sci(x, 2);
  }
  function lg(x) { return Math.log(Math.max(x, 1e-300)) / Math.LN10; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* Equilibrium extent for a reaction with stoichiometric numbers nu (negative = reactant): solve Q(xi) = K by bisection */
  function lnQ(nu, c) {
    var v = 0;
    for (var i = 0; i < nu.length; i++) v += nu[i] * Math.log(Math.max(c[i], 1e-300));
    return v;
  }
  function solveEq(nu, c0, K) {
    var lo = -Infinity, hi = Infinity, i;
    for (i = 0; i < nu.length; i++) {
      if (nu[i] > 0) lo = Math.max(lo, -c0[i] / nu[i]);
      else hi = Math.min(hi, c0[i] / -nu[i]);
    }
    var lk = Math.log(K), a = lo, b = hi, mid, c;
    for (var it = 0; it < 200; it++) {
      mid = (a + b) / 2;
      c = c0.map(function (v, j) { return v + nu[j] * mid; });
      if (lnQ(nu, c) < lk) a = mid; else b = mid;
    }
    mid = (a + b) / 2;
    return { xi: mid, c: c0.map(function (v, j) { return Math.max(0, v + nu[j] * mid); }) };
  }
  function eqString(names, nu, f) {
    var l = [], r = [];
    names.forEach(function (n, i) {
      var m = Math.abs(nu[i]) * f, ms = m === 1 ? '' : (m % 1 === 0 ? String(m) : (m * 2) + '/2 ');
      (nu[i] < 0 ? l : r).push(ms + n);
    });
    return l.join(' + ') + ' ⇌ ' + r.join(' + ');
  }
  function mathExp(e) { return e === 1 ? '' : '<sup>' + (e % 1 === 0 ? e : (e * 2) + '/2') + '</sup>'; }
  function kExpr(names, nu, f) {
    var num = [], den = [];
    names.forEach(function (n, i) {
      var t = '[' + n + ']' + mathExp(Math.abs(nu[i]) * f);
      (nu[i] > 0 ? num : den).push(t);
    });
    return '(' + num.join('') + ') / (' + den.join('') + ')';
  }
  /* pH of a weak acid (type 'a') or weak base (type 'b') of concentration c with s of its salt added. Charge balance + bisection on log h. */
  function weakH(type, K, c, s) {
    var CT = c + s, Ka = type === 'a' ? K : KW / K, lo = -15, hi = 2, mid, h, f;
    for (var i = 0; i < 120; i++) {
      mid = (lo + hi) / 2; h = Math.pow(10, mid);
      f = type === 'a' ? h + s - KW / h - CT * Ka / (Ka + h) : h - KW / h - s + CT * h / (Ka + h);
      if (f < 0) lo = mid; else hi = mid;
    }
    h = Math.pow(10, (lo + hi) / 2);
    var ionised = type === 'a' ? CT * Ka / (Ka + h) - s : CT * h / (Ka + h) - s;
    return { h: h, alpha: Math.max(0, ionised / c) };
  }
  function strongPH(kind, c) {   /* strong acid / base of concentration c, with water ionisation */
    var h;
    if (kind === 'a') h = (c + Math.sqrt(c * c + 4 * KW)) / 2;
    else { var o = (c + Math.sqrt(c * c + 4 * KW)) / 2; h = KW / o; }
    return -lg(h);
  }
  function row(h, kids) { return h('div', { 'class': 'row' }, kids); }

  /* ================================================================== 1. liquid ⇌ vapour in a closed vessel */
  A.register('eq-vapour', function (root, k) {
    var h = k.h, W = 380, HT = 210, SURF = 150;
    var cv = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': L("বন্ধ পাত্ৰত জুলীয়া ⇌ বাষ্প সাম্য", "Liquid ⇌ vapour equilibrium in a closed vessel") });
    root.appendChild(cv);
    var ctx = k.hiDpiCanvas(cv, W, HT);
    var st = { T: 300, parts: [], evR: 0, cdR: 0, evN: 0, cdN: 0, win: 0, running: false };
    var liq = [], i;
    for (i = 0; i < 90; i++) liq.push({ x: 10 + Math.random() * (W - 20), y: SURF + 8 + Math.random() * (HT - SURF - 14), ph: Math.random() * 6.28 });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function lam() { return 6 * Math.exp((st.T - 300) / 18); }   /* evaporation events per second (zero order: the liquid is a large reservoir) */
    function reset() { st.parts = []; st.evR = 0; st.cdR = 0; st.evN = 0; st.cdN = 0; st.win = 0; draw(); text(); }
    function text() {
      var e = st.evR, c = st.cdR, n = st.parts.length, msg;
      if (n === 0) msg = L("বাষ্প এতিয়াও নাই — কেৱল বাষ্পীভৱন চলিছে।", "No vapour yet — only evaporation is happening.");
      else if (Math.abs(e - c) <= 0.25 * Math.max(e, 1)) msg = L("বাষ্পীভৱনৰ হাৰ ≈ ঘনীভৱনৰ হাৰ — গতিশীল সাম্য।", "Evaporation rate ≈ condensation rate — dynamic equilibrium.");
      else if (e > c) msg = L("বাষ্পীভৱন বেছি — বাষ্প বাঢ়িছে, ঘনীভৱনৰ হাৰো বাঢ়িছে।", "Evaporation is faster — vapour is building up and condensation speeds up.");
      else msg = L("ঘনীভৱন বেছি — বাষ্প কমিছে।", "Condensation is faster — the vapour is decreasing.");
      info.innerHTML = L("বাষ্প অণু: ", "Vapour molecules: ") + '<b>' + n + '</b> · ' + L("বাষ্পীভৱন ≈ ", "evaporation ≈ ") + '<b>' + e.toFixed(1) + '</b>' + L(" /s, ঘনীভৱন ≈ ", " /s, condensation ≈ ") + '<b>' + c.toFixed(1) + '</b> /s<br>' + msg + '<br>' + L("তাপমাত্ৰা ", "Temperature ") + st.T + ' K' + L(" — উচ্চ তাপমাত্ৰাত সাম্যত বাষ্প (বাষ্পীয় চাপ) বেছি।", " — at higher temperature the equilibrium vapour (vapour pressure) is larger.");
    }
    function draw() {
      var bg = k.cssVar('--canvas'), liqc = k.cssVar('--electron'), vap = k.cssVar('--alpha'), bd = k.cssVar('--muted');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, HT);
      ctx.fillStyle = liqc; ctx.globalAlpha = 0.18; ctx.fillRect(0, SURF, W, HT - SURF); ctx.globalAlpha = 1;
      ctx.strokeStyle = bd; ctx.lineWidth = 2; ctx.strokeRect(1, 1, W - 2, HT - 2);
      ctx.strokeStyle = liqc; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(1, SURF); ctx.lineTo(W - 1, SURF); ctx.stroke();
      ctx.fillStyle = liqc;
      var t = performance.now() / 400;
      liq.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x + Math.sin(t + p.ph) * 2, p.y + Math.cos(t * 1.1 + p.ph) * 2, 3.2, 0, 6.283); ctx.fill(); });
      ctx.fillStyle = vap;
      st.parts.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 3.4, 0, 6.283); ctx.fill(); });
      ctx.fillStyle = k.cssVar('--text'); ctx.font = '12px sans-serif';
      ctx.fillText(L("জুলীয়া", "Liquid"), 8, HT - 8);
      ctx.fillText(L("বাষ্প", "Vapour"), 8, 18);
    }
    var lp = k.loop(root, function (dt) {
      var sp = 55 * Math.sqrt(st.T / 300), n, p, born = 0, lost = 0, j;
      st.win += dt;
      var lamb = lam() * dt, cnt = Math.floor(lamb) + (Math.random() < lamb - Math.floor(lamb) ? 1 : 0);
      for (j = 0; j < cnt; j++) {
        var a = Math.random() * Math.PI + Math.PI;   /* upward */
        st.parts.push({ x: 10 + Math.random() * (W - 20), y: SURF - 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.9 - 8 });
        born++;
      }
      for (j = st.parts.length - 1; j >= 0; j--) {
        p = st.parts[j];
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 4 || p.x > W - 4) { p.vx = -p.vx; p.x = clamp(p.x, 4, W - 4); }
        if (p.y < 4) { p.vy = Math.abs(p.vy); p.y = 4; }
        if (p.y >= SURF) { st.parts.splice(j, 1); lost++; }
      }
      var f = Math.min(1, dt / 1.5);
      st.evR += (born / dt - st.evR) * f; st.cdR += (lost / dt - st.cdR) * f;
      draw();
      if (!st.tick || st.win > 0.25) { st.win = 0; text(); }
      st.tick = true;
    });
    var sl = k.slider('Temperature (K)', 280, 320, 5, st.T, function (v) { st.T = v; });
    var btn = k.button(k.reduceMotion ? 'Play' : 'Pause', function () {
      if (lp.running) { lp.stop(); btn.textContent = 'Play'; } else { lp.start(); btn.textContent = 'Pause'; }
    });
    root.appendChild(row(h, [sl.el, btn, k.button('Empty the vapour', function () { reset(); })]));
    root.appendChild(info);
    draw(); text();
    if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 2. approach to equilibrium, H2 + I2 ⇌ 2HI (Table 6.2) */
  A.register('eq-approach', function (root, k) {
    var h = k.h, s = k.s, K = 46.4, kf = 1.0, kr = kf / K, TMAX = 10, DT = 0.05;
    var STARTS = [
      { n: L("পৰীক্ষা 1: H₂ 2.4, I₂ 1.38 (HI নাই)", "Expt 1: H₂ 2.4, I₂ 1.38 (no HI)"), c: [2.4, 1.38, 0] },
      { n: L("পৰীক্ষা 2: H₂ 2.4, I₂ 1.68 (HI নাই)", "Expt 2: H₂ 2.4, I₂ 1.68 (no HI)"), c: [2.4, 1.68, 0] },
      { n: L("পৰীক্ষা 5: কেৱল HI 3.04", "Expt 5: only HI 3.04"), c: [0, 0, 3.04] },
      { n: L("পৰীক্ষা 6: কেৱল HI 7.58", "Expt 6: only HI 7.58"), c: [0, 0, 7.58] }
    ];
    var st = { i: 0, t: 0.4, data: null };
    var svg = s('svg', { viewBox: '0 0 420 260', 'class': 'anim-svg', role: 'img', 'aria-label': L("H₂ + I₂ ⇌ 2HI: গাঢ়তা আৰু বিক্ৰিয়াৰ হাৰ বনাম সময়", "H₂ + I₂ ⇌ 2HI: concentrations and rates against time") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function simulate() {
      var c = STARTS[st.i].c.slice(), d = [], t, n = Math.round(TMAX / DT), sub = 20, j, step;
      for (step = 0; step <= n; step++) {
        d.push({ t: step * DT, c: c.slice(), rf: kf * c[0] * c[1], rr: kr * c[2] * c[2] });
        for (j = 0; j < sub; j++) {
          var dx = (kf * c[0] * c[1] - kr * c[2] * c[2]) * (DT / sub);
          c[0] -= dx; c[1] -= dx; c[2] += 2 * dx;
        }
      }
      st.data = d;
    }
    function paint() {
      var d = st.data, N = d.length, idx = Math.round(st.t / DT), cur = d[idx], j, m;
      svg.innerHTML = '';
      var X0 = 46, X1 = 404, cmax = 0, rmax = 0;
      d.forEach(function (p) { p.c.forEach(function (v) { cmax = Math.max(cmax, v); }); rmax = Math.max(rmax, p.rf, p.rr); });
      cmax *= 1.08; rmax *= 1.08;
      var cx = function (t) { return X0 + t / TMAX * (X1 - X0); };
      var cy = function (v) { return 118 - v / cmax * 96; }, ry = function (v) { return 232 - v / rmax * 80; };
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L("গাঢ়তা (× 10⁻² mol L⁻¹)", "Concentration (× 10⁻² mol L⁻¹)")));
      svg.appendChild(txt(s, 8, 138, 11, 'start', 'fill:var(--muted)', L("বিক্ৰিয়াৰ হাৰ (আপেক্ষিক)", "Rate of reaction (relative)")));
      svg.appendChild(s('line', { x1: X0, y1: 118, x2: X1, y2: 118, style: 'stroke:var(--muted)' }));
      svg.appendChild(s('line', { x1: X0, y1: 232, x2: X1, y2: 232, style: 'stroke:var(--muted)' }));
      svg.appendChild(s('line', { x1: X0, y1: 20, x2: X0, y2: 118, style: 'stroke:var(--muted)' }));
      svg.appendChild(s('line', { x1: X0, y1: 150, x2: X0, y2: 232, style: 'stroke:var(--muted)' }));
      svg.appendChild(txt(s, X1, 250, 11, 'end', 'fill:var(--muted)', L("সময় (আপেক্ষিক একক) →", "time (arbitrary units) →")));
      var cols = ['var(--electron)', 'var(--proton)', 'var(--alpha)'], names = ['H₂', 'I₂', 'HI'];
      function line(vals, yf, col, full) {
        var pts = '', last = full ? N - 1 : idx;
        for (j = 0; j <= last; j++) pts += cx(d[j].t).toFixed(1) + ',' + yf(vals(d[j])).toFixed(1) + ' ';
        svg.appendChild(s('polyline', { points: pts, fill: 'none', style: 'stroke:' + col + ';stroke-width:' + (full ? 1 : 2.4) + ';opacity:' + (full ? 0.3 : 1) }));
      }
      for (m = 0; m < 3; m++) {
        (function (q) {
          line(function (p) { return p.c[q]; }, cy, cols[q], true);
          line(function (p) { return p.c[q]; }, cy, cols[q], false);
          svg.appendChild(txt(s, X1 + 0, cy(d[N - 1].c[q]) - 3 + q * 0, 10, 'end', 'fill:' + cols[q], names[q], 700));
        })(m);
      }
      line(function (p) { return p.rf; }, ry, 'var(--ok)', true); line(function (p) { return p.rf; }, ry, 'var(--ok)', false);
      line(function (p) { return p.rr; }, ry, 'var(--bad)', true); line(function (p) { return p.rr; }, ry, 'var(--bad)', false);
      svg.appendChild(txt(s, X0 + 6, 164, 10, 'start', 'fill:var(--ok)', L("সন্মুখী হাৰ", "forward rate"), 700));
      svg.appendChild(txt(s, X0 + 6, 176, 10, 'start', 'fill:var(--bad)', L("বিপৰীতমুখী হাৰ", "backward rate"), 700));
      svg.appendChild(s('line', { x1: cx(cur.t), y1: 20, x2: cx(cur.t), y2: 232, style: 'stroke:var(--text);stroke-dasharray:3 3;opacity:.6' }));
      var q = (cur.c[0] > 0 && cur.c[1] > 0) ? cur.c[2] * cur.c[2] / (cur.c[0] * cur.c[1]) : null;
      var near = Math.abs(cur.rf - cur.rr) < 0.02 * Math.max(cur.rf, cur.rr, 1e-9);
      info.innerHTML = L("সময় ", "time ") + cur.t.toFixed(1) + ' · [H₂] = <b>' + cur.c[0].toFixed(2) + '</b>, [I₂] = <b>' + cur.c[1].toFixed(2) + '</b>, [HI] = <b>' + cur.c[2].toFixed(2) + '</b> (× 10⁻² M)<br>' +
        L("সন্মুখী হাৰ ", "forward rate ") + cur.rf.toFixed(3) + L(", বিপৰীতমুখী হাৰ ", ", backward rate ") + cur.rr.toFixed(3) + (q === null ? '' : ' · Q<sub>c</sub> = ' + q.toFixed(1) + ' (K<sub>c</sub> = 46.4)') + '<br>' +
        (near ? L("দুয়োটা হাৰ সমান — সাম্য পোৱা গ'ল; গাঢ়তা আৰু সলনি নহয়। দুয়োফালৰ পৰা একেটা সাম্য-গাঢ়তাতে পায়।", "The two rates are equal — equilibrium is reached and the concentrations stop changing. Both starting points end at the same equilibrium concentrations.") : L("হাৰ দুটা সমান হোৱা নাই — গাঢ়তা এতিয়াও সলনি হৈ আছে।", "The rates are not yet equal — the concentrations are still changing."));
    }
    var lp = k.loop(root, function (dt) {
      st.t += dt * 1.2;
      if (st.t >= TMAX) { st.t = TMAX; lp.stop(); btn.textContent = 'Play'; }
      sl.input.value = st.t; sl.out.textContent = st.t.toFixed(1);
      paint();
    });
    var sel = k.select('Start from', opts(STARTS, function (o) { return o.n; }), '0', function (v) { st.i = +v; st.t = 0; simulate(); sl.input.value = 0; sl.out.textContent = '0.0'; paint(); lp.start(); btn.textContent = 'Pause'; });
    var sl = k.slider('Time', 0, TMAX, DT, st.t, function (v) { lp.stop(); btn.textContent = 'Play'; st.t = v; sl.out.textContent = v.toFixed(1); paint(); });
    var btn = k.button('Play', function () {
      if (lp.running) { lp.stop(); btn.textContent = 'Play'; } else { if (st.t >= TMAX) st.t = 0; lp.start(); btn.textContent = 'Pause'; }
    });
    root.appendChild(row(h, [sel.el]));
    root.appendChild(row(h, [sl.el, btn]));
    root.appendChild(info);
    simulate(); paint();
    if (!k.reduceMotion) { st.t = 0; lp.start(); btn.textContent = 'Pause'; }
  });

  /* ================================================================== 3. K_c calculator, reversing / multiplying, K_p */
  A.register('kc-calc', function (root, k) {
    var h = k.h, s = k.s;
    var RX = [
      { n: "N₂ + 3H₂ ⇌ 2NH₃ (500 K)", T: 500, names: ["N₂", "H₂", "NH₃"], nu: [-1, -3, 2], v: [0.015, 0.030, 0.012], mn: 0.001, mx: 0.05, st: 0.001, src: L("উদাহৰণ 6.1 ৰ তথ্য", "data of Example 6.1") },
      { n: "N₂ + O₂ ⇌ 2NO (800 K)", T: 800, names: ["N₂", "O₂", "NO"], nu: [-1, -1, 2], v: [0.0030, 0.0042, 0.0028], mn: 0.0005, mx: 0.01, st: 0.0001, src: L("উদাহৰণ 6.2", "Example 6.2") },
      { n: "H₂ + I₂ ⇌ 2HI (731 K)", T: 731, names: ["H₂", "I₂", "HI"], nu: [-1, -1, 2], v: [0.0114, 0.0012, 0.0252], mn: 0.0005, mx: 0.05, st: 0.0001, src: L("তালিকা 6.2, পৰীক্ষা 1", "Table 6.2, expt 1") },
      { n: "2SO₂ + O₂ ⇌ 2SO₃", T: 1000, names: ["SO₂", "O₂", "SO₃"], nu: [-2, -1, 2], v: [0.60, 0.82, 1.90], mn: 0.05, mx: 2.5, st: 0.01, src: L("অনুশীলনী 6.2", "Exercise 6.2") },
      { n: "N₂O₄ ⇌ 2NO₂ (400 K)", T: 400, names: ["N₂O₄", "NO₂"], nu: [-1, 2], v: [0.0242, 0.2516], mn: 0.005, mx: 0.4, st: 0.001, src: L("উদাহৰণ 6.8 ৰ দৰে", "like Example 6.8") }
    ];
    var FORMS = [
      { n: L("সমীকৰণ যেনেকৈ লিখা হৈছে", "As written"), f: 1, rev: false },
      { n: L("বিপৰীতমুখী বিক্ৰিয়া", "Reversed reaction"), f: 1, rev: true },
      { n: L("সমীকৰণ × 2", "Equation × 2"), f: 2, rev: false },
      { n: L("সমীকৰণ × ½", "Equation × ½"), f: 0.5, rev: false }
    ];
    var st = { r: 0, f: 0, v: RX[0].v.slice(), T: RX[0].T };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L("সাম্য ধ্ৰুৱক গণনা", "Equilibrium constant calculator") });
    root.appendChild(svg);
    var ctl = h('div', { 'class': 'row' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var tsl;
    function kcVal() {
      var r = RX[st.r], K = 1, i;
      for (i = 0; i < r.nu.length; i++) K *= Math.pow(st.v[i], r.nu[i]);
      return K;
    }
    function paint() {
      var r = RX[st.r], F = FORMS[st.f], K0 = kcVal(), K, i, dn = 0, nu = r.nu.slice(), names = r.names;
      if (F.rev) nu = nu.map(function (x) { return -x; });
      K = F.rev ? 1 / K0 : Math.pow(K0, F.f);
      nu.forEach(function (x) { dn += x * F.f; });
      var Kp = K * Math.pow(RG * st.T, dn);
      svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 22, 15, 'middle', 'fill:var(--text)', eqString(names, nu, F.f), 700));
      var mx = r.mx;
      r.names.forEach(function (n, j) {
        var y = 40 + j * 30, w = st.v[j] / mx * 190;
        svg.appendChild(txt(s, 70, y + 15, 12, 'end', 'fill:var(--text)', '[' + n + ']', 600));
        svg.appendChild(s('rect', { x: 76, y: y, width: 190, height: 20, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 76, y: y, width: Math.max(1, w), height: 20, rx: 3, style: 'fill:' + (r.nu[j] < 0 ? 'var(--electron)' : 'var(--alpha)') }));
        svg.appendChild(txt(s, 272, y + 15, 12, 'start', 'fill:var(--text)', g3(st.v[j]) + ' M'));
      });
      info.innerHTML = '<b>K<sub>c</sub></b> = ' + kExpr(names, nu, F.f) + '<br>' +
        'K<sub>c</sub> = <b>' + g3(K) + '</b>' + (st.f === 0 ? '' : L("  (মূল সমীকৰণৰ K<sub>c</sub> = ", "  (K<sub>c</sub> of the original equation = ") + g3(K0) + ')') + ' · ' + r.src + '<br>' +
        L("Δn = ", "Δn = ") + dn + ' · ' + 'K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup> = ' + g3(Kp) + ' ' + L("(T = ", "(at T = ") + st.T + ' K, R = 0.0831 bar L mol⁻¹ K⁻¹)' +
        '<br>' + (dn === 0 ? L("Δn = 0, সেয়ে K<sub>p</sub> = K<sub>c</sub>।", "Δn = 0, so K<sub>p</sub> = K<sub>c</sub>.") : L("Δn ≠ 0, সেয়ে K<sub>p</sub> আৰু K<sub>c</sub> সমান নহয়।", "Δn ≠ 0, so K<sub>p</sub> and K<sub>c</sub> are not equal."));
    }
    function build() {
      var r = RX[st.r];
      ctl.innerHTML = '';
      r.names.forEach(function (n, j) {
        var sl = k.slider('[' + n + '] (M)', r.mn, r.mx, r.st, st.v[j], function (v) { st.v[j] = v; sl.out.textContent = g3(v); paint(); });
        sl.out.textContent = g3(st.v[j]);
        ctl.appendChild(sl.el);
      });
    }
    var rsel = k.select('Reaction', opts(RX, function (o) { return o.n; }), '0', function (v) { st.r = +v; st.v = RX[st.r].v.slice(); st.T = RX[st.r].T; build(); tsl.input.value = st.T; tsl.out.textContent = st.T; paint(); });
    var fsel = k.select('Write the equation', opts(FORMS, function (o) { return o.n; }), '0', function (v) { st.f = +v; paint(); });
    tsl = k.slider('T for K_p (K)', 300, 1100, 10, st.T, function (v) { st.T = v; paint(); });
    root.appendChild(row(h, [rsel.el, fsel.el]));
    root.appendChild(ctl);
    root.appendChild(row(h, [tsl.el]));
    root.appendChild(info);
    build(); paint();
  });

  /* ================================================================== 4. heterogeneous equilibrium: CaCO3 ⇌ CaO + CO2 */
  A.register('hetero-caco3', function (root, k) {
    var h = k.h, s = k.s, T = 1100, KP = 2.0;
    var st = { n0: 0.05, V: 1.0 }, seeds = [], i;
    for (i = 0; i < 80; i++) seeds.push([Math.random(), Math.random()]);
    var svg = s('svg', { viewBox: '0 0 420 230', 'class': 'anim-svg', role: 'img', 'aria-label': L("CaCO₃ ⇌ CaO + CO₂ অসমসত্ত্ব সাম্য", "CaCO₃ ⇌ CaO + CO₂ heterogeneous equilibrium") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var need = KP * st.V / (RG * T), eq = st.n0 >= need, nco2 = eq ? need : st.n0, p = nco2 * RG * T / st.V;
      var left = st.n0 - nco2, cao = nco2, j;
      svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 18, 13, 'middle', 'fill:var(--text)', 'CaCO₃(s) ⇌ CaO(s) + CO₂(g)   (' + T + ' K)', 700));
      svg.appendChild(s('rect', { x: 20, y: 30, width: 380, height: 180, rx: 6, style: 'fill:none;stroke:var(--muted);stroke-width:2' }));
      var sc = 90 / 0.12;
      var hL = Math.min(80, left * sc * 1.0), hC = Math.min(80, cao * sc * 1.0);
      svg.appendChild(s('rect', { x: 40, y: 206 - hL, width: 70, height: Math.max(hL, 0.5), style: 'fill:var(--neutron)' }));
      svg.appendChild(s('rect', { x: 118, y: 206 - hC, width: 70, height: Math.max(hC, 0.5), style: 'fill:var(--accent)' }));
      svg.appendChild(txt(s, 75, 200 - hL, 11, 'middle', 'fill:var(--text)', 'CaCO₃ ' + g3(left) + ' mol', 600));
      svg.appendChild(txt(s, 153, 200 - hC, 11, 'middle', 'fill:var(--text)', 'CaO ' + g3(cao) + ' mol', 600));
      var nd = Math.round(nco2 * 480);
      for (j = 0; j < nd && j < seeds.length; j++) svg.appendChild(s('circle', { cx: 210 + seeds[j][0] * 180, cy: 42 + seeds[j][1] * 130, r: 3.6, style: 'fill:var(--alpha)' }));
      svg.appendChild(txt(s, 392, 52, 11, 'end', 'fill:var(--alpha)', 'CO₂', 700));
      info.innerHTML = '<b>K<sub>p</sub> = p<sub>CO₂</sub> = ' + KP.toFixed(2) + '</b> bar ' + L("(1100 K ত, CaCO₃ আৰু CaO ৰ গাঢ়তা ধ্ৰুৱক — K ত নাথাকে)", "(at 1100 K; the concentrations of solid CaCO₃ and CaO are constant and do not appear in K)") + '<br>' +
        (eq ? L("CaCO₃ পৰ্যাপ্ত — সাম্য স্থাপিত: ", "Enough CaCO₃ — equilibrium is established: ") : L("CaCO₃ ধৰণৰ পৰিমাণ সম্পূৰ্ণ বিয়োজিত হ'ল (সাম্য পোৱা নগ'ল): ", "All the CaCO₃ decomposed (equilibrium not reached): ")) +
        'p<sub>CO₂</sub> = <b>' + p.toFixed(2) + '</b> bar, n(CO₂) = ' + g3(nco2) + ' mol<br>' +
        (eq ? L("কঠিন CaCO₃ কম-বেছি কৰিলেও p<sub>CO₂</sub> একে থাকে; আয়তন সলনি কৰিলে CO₂ ৰ মোল সলনি হয়, চাপ নহয়।", "Changing the amount of solid CaCO₃ does not change p<sub>CO₂</sub>; changing the volume changes the moles of CO₂ but not its pressure.") : L("আয়তন কমাই বা CaCO₃ বঢ়াই চাওক — সাম্যৰ চাপ 2.00 bar।", "Reduce the volume or add CaCO₃ — the equilibrium pressure is 2.00 bar."));
    }
    var a = k.slider('CaCO₃ taken (mol)', 0.005, 0.1, 0.005, st.n0, function (v) { st.n0 = v; a.out.textContent = v.toFixed(3); paint(); });
    a.out.textContent = st.n0.toFixed(3);
    var b = k.slider('Volume (L)', 0.5, 5, 0.5, st.V, function (v) { st.V = v; b.out.textContent = v.toFixed(1); paint(); });
    b.out.textContent = st.V.toFixed(1);
    root.appendChild(row(h, [a.el, b.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. reaction quotient Q vs K */
  A.register('q-vs-k', function (root, k) {
    var h = k.h, s = k.s;
    var RX = [
      { n: "H₂ + I₂ ⇌ 2HI (700 K, K = 57.0)", K: 57.0, names: ["H₂", "I₂", "HI"], nu: [-1, -1, 2], v: [0.10, 0.20, 0.40], mn: 0, mx: 1, st: 0.01, u: "M", div: 1 },
      { n: "2A ⇌ B + C (K = 2 × 10⁻³)", K: 2e-3, names: ["A", "B", "C"], nu: [-2, 1, 1], v: [3, 3, 3], mn: 0, mx: 10, st: 0.5, u: "× 10⁻⁴ M", div: 1e4 },
      { n: "CO + H₂O ⇌ CO₂ + H₂ (800 K, K = 4.24)", K: 4.24, names: ["CO", "H₂O", "CO₂", "H₂"], nu: [-1, -1, 1, 1], v: [0.10, 0.10, 0, 0], mn: 0, mx: 0.3, st: 0.01, u: "M", div: 1 }
    ];
    var st = { r: 0, v: RX[0].v.slice() };
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L("বিক্ৰিয়া ভাগফল Q আৰু K ৰ তুলনা", "Comparing reaction quotient Q with K") });
    root.appendChild(svg);
    var ctl = h('div', { 'class': 'row' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function conc(j) { return st.v[j] / RX[st.r].div; }
    function paint() {
      var r = RX[st.r], c = r.names.map(function (n, j) { return conc(j); }), num = 1, den = 1, Q, dir, j, zeroP = false, zeroR = false;
      r.nu.forEach(function (x, j) { if (x > 0) { num *= Math.pow(c[j], x); if (c[j] === 0) zeroP = true; } else { den *= Math.pow(c[j], -x); if (c[j] === 0) zeroR = true; } });
      if ((zeroP && zeroR)) Q = NaN; else if (zeroR) Q = Infinity; else Q = num / den;
      if (isNaN(Q)) dir = 0; else if (Math.abs(Math.log(Q / r.K)) < 1e-9) dir = 0; else dir = Q < r.K ? 1 : -1;
      svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 18, 12, 'middle', 'fill:var(--muted)', L("log₁₀ স্কেল: Q আৰু K", "log₁₀ scale: Q and K")));
      var X0 = 30, X1 = 390, ax = function (v) { return X0 + (clamp(lg(v), -8, 8) + 8) / 16 * (X1 - X0); };
      svg.appendChild(s('line', { x1: X0, y1: 70, x2: X1, y2: 70, style: 'stroke:var(--muted);stroke-width:2' }));
      for (j = -8; j <= 8; j += 4) { svg.appendChild(s('line', { x1: ax(Math.pow(10, j)), y1: 65, x2: ax(Math.pow(10, j)), y2: 75, style: 'stroke:var(--muted)' })); svg.appendChild(txt(s, ax(Math.pow(10, j)), 90, 10, 'middle', 'fill:var(--muted)', '10' + sup(j))); }
      svg.appendChild(s('rect', { x: ax(r.K) - 3, y: 52, width: 6, height: 36, style: 'fill:var(--brand)' }));
      svg.appendChild(txt(s, ax(r.K), 46, 11, 'middle', 'fill:var(--brand)', 'K = ' + g3(r.K), 700));
      if (isFinite(Q) && Q > 0) { svg.appendChild(s('circle', { cx: ax(Q), cy: 70, r: 7, style: 'fill:var(--proton)' })); svg.appendChild(txt(s, ax(Q), 112, 11, 'middle', 'fill:var(--proton)', 'Q = ' + g3(Q), 700)); }
      else svg.appendChild(txt(s, 210, 112, 12, 'middle', 'fill:var(--proton)', isNaN(Q) ? 'Q = 0/0' : (Q === 0 ? 'Q = 0' : 'Q = ∞'), 700));
      var msg = dir === 0 ? L("Q = K — সাম্য", "Q = K — at equilibrium") : (dir > 0 ? L("Q < K  →  সন্মুখ দিশে (উৎপাদ বাঢ়িব)", "Q < K  →  forward (more products)") : L("Q > K  →  বিপৰীত দিশে (বিক্ৰিয়ক বাঢ়িব)", "Q > K  →  backward (more reactants)"));
      svg.appendChild(txt(s, 210, 148, 14, 'middle', 'fill:var(--text)', msg, 700));
      info.innerHTML = 'Q<sub>c</sub> = ' + kExpr(r.names, r.nu, 1) + ' = <b>' + (isNaN(Q) ? '—' : g3(Q)) + '</b> · K<sub>c</sub> = ' + g3(r.K) + '<br>' + msg + '<br>' +
        (st.r === 2 && conc(2) === 0 && conc(3) === 0 ? L("উৎপাদ নথকা অৱস্থাত Q = 0, সেয়ে বিক্ৰিয়া সন্মুখ দিশে যাব।", "With no products Q = 0, so the reaction must go forward.") : L("Q ক K ৰ সৈতে তুলনা কৰি বিক্ৰিয়াৰ দিশ জনা যায়।", "Comparing Q with K tells the direction of the reaction."));
    }
    function build() {
      var r = RX[st.r];
      ctl.innerHTML = '';
      r.names.forEach(function (n, j) {
        var sl = k.slider('[' + n + '] (' + r.u + ')', r.mn, r.mx, r.st, st.v[j], function (v) { st.v[j] = v; sl.out.textContent = v; paint(); });
        ctl.appendChild(sl.el);
      });
    }
    var rsel = k.select('Reaction', opts(RX, function (o) { return o.n; }), '0', function (v) { st.r = +v; st.v = RX[st.r].v.slice(); build(); paint(); });
    root.appendChild(row(h, [rsel.el]));
    root.appendChild(ctl);
    root.appendChild(info);
    build(); paint();
  });

  /* ================================================================== 6. ICE table solver */
  A.register('ice-solver', function (root, k) {
    var h = k.h, s = k.s;
    var RX = [
      { n: "H₂ + I₂ ⇌ 2HI (K = 57.0)", K: 57.0, names: ["H₂", "I₂", "HI"], nu: [-1, -1, 2], mn: 0.05, mx: 1, st: 0.05, v: 0.50, u: "M" },
      { n: "CO + H₂O ⇌ CO₂ + H₂ (800 K, K = 4.24)", K: 4.24, names: ["CO", "H₂O", "CO₂", "H₂"], nu: [-1, -1, 1, 1], mn: 0.02, mx: 0.5, st: 0.01, v: 0.10, u: "M" },
      { n: "PCl₅ ⇌ PCl₃ + Cl₂ (380 K, K = 1.80)", K: 1.80, names: ["PCl₅", "PCl₃", "Cl₂"], nu: [-1, 1, 1], mn: 0.5, mx: 5, st: 0.05, v: 3.00, u: "M" },
      { n: "N₂O₄ ⇌ 2NO₂ (400 K, K = 2.6)", K: 2.6, names: ["N₂O₄", "NO₂"], nu: [-1, 2], mn: 0.02, mx: 0.5, st: 0.01, v: 0.15, u: "M" }
    ];
    var st = { r: 0, v: RX[0].v };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L("ICE তালিকাৰে সাম্য গাঢ়তা নিৰ্ণয়", "Equilibrium concentrations from an ICE table") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sl;
    function paint() {
      var r = RX[st.r], c0 = r.nu.map(function (x) { return x < 0 ? st.v : 0; }), sol = solveEq(r.nu, c0, r.K), xi = sol.xi, i;
      var vmax = Math.max.apply(null, c0.concat(sol.c)) * 1.1 || 1, n = r.names.length;
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L("গাঢ়তা (mol L⁻¹): পাতল = আৰম্ভণি, গাঢ় = সাম্য", "Concentration (mol L⁻¹): pale = initial, solid = equilibrium")));
      r.names.forEach(function (nm, j) {
        var y = 24 + j * 28, w0 = c0[j] / vmax * 220, w1 = sol.c[j] / vmax * 220;
        svg.appendChild(txt(s, 60, y + 16, 12, 'end', 'fill:var(--text)', nm, 700));
        svg.appendChild(s('rect', { x: 66, y: y, width: Math.max(0.5, w0), height: 10, rx: 2, style: 'fill:' + (r.nu[j] < 0 ? 'var(--electron)' : 'var(--alpha)') + ';opacity:.35' }));
        svg.appendChild(s('rect', { x: 66, y: y + 11, width: Math.max(0.5, w1), height: 10, rx: 2, style: 'fill:' + (r.nu[j] < 0 ? 'var(--electron)' : 'var(--alpha)') }));
        svg.appendChild(txt(s, 66 + Math.max(w0, w1) + 8, y + 16, 11, 'start', 'fill:var(--text)', g3(c0[j]) + ' → ' + g3(sol.c[j])));
      });
      var html = '<table><tr><th></th>' + r.names.map(function (nm) { return '<th>' + nm + '</th>'; }).join('') + '</tr>' +
        '<tr><th>I</th>' + c0.map(function (v) { return '<td>' + g3(v) + '</td>'; }).join('') + '</tr>' +
        '<tr><th>C</th>' + r.nu.map(function (x) { return '<td>' + (x > 0 ? '+' : '−') + (Math.abs(x) === 1 ? '' : Math.abs(x)) + 'x</td>'; }).join('') + '</tr>' +
        '<tr><th>E</th>' + sol.c.map(function (v) { return '<td><b>' + g3(v) + '</b></td>'; }).join('') + '</tr></table>';
      var react = 0; r.nu.forEach(function (x, j) { if (x < 0 && react === 0) react = j; });
      info.innerHTML = html + 'x = <b>' + g3(xi) + '</b> M' + L(" ; Q<sub>c</sub> = K<sub>c</sub> = ", " ; Q<sub>c</sub> = K<sub>c</sub> = ") + g3(r.K) + '<br>' +
        L("প্ৰথম বিক্ৰিয়কৰ কিমান অংশ বিক্ৰিয়া কৰিলে: ", "Fraction of the first reactant that reacted: ") + '<b>' + (xi / c0[react] / Math.abs(r.nu[react]) * 100).toFixed(1) + ' %</b>';
    }
    var rsel = k.select('Reaction', opts(RX, function (o) { return o.n; }), '0', function (v) { st.r = +v; var r = RX[st.r]; st.v = r.v; sl.input.min = r.mn; sl.input.max = r.mx; sl.input.step = r.st; sl.input.value = r.v; sl.out.textContent = g3(r.v); paint(); });
    sl = k.slider('Initial [reactant(s)] (M)', RX[0].mn, RX[0].mx, RX[0].st, RX[0].v, function (v) { st.v = v; sl.out.textContent = g3(v); paint(); });
    sl.out.textContent = g3(RX[0].v);
    root.appendChild(row(h, [rsel.el, sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. Le Chatelier's principle */
  A.register('lechatelier', function (root, k) {
    var h = k.h, s = k.s;
    var SYS = [
      { n: "N₂ + 3H₂ ⇌ 2NH₃  (ΔH = −92.38 kJ/mol)", names: ["N₂", "H₂", "NH₃"], nu: [-1, -3, 2], T0: 500, Kp: { 298: 6.8e5, 400: 41, 500: 3.6e-2 }, feed: [0.10, 0.30, 0] },
      { n: "N₂O₄ ⇌ 2NO₂  (ΔH = +57.2 kJ/mol)", names: ["N₂O₄", "NO₂"], nu: [-1, 2], T0: 400, Kp: { 298: 0.98, 400: 47.9, 500: 1700 }, feed: [0.10, 0] }
    ];
    var st = { s: 0, T: 500, c: [], pre: [], pert: [], post: [], t: 1, vol: 1, msg: '', max: 1, K: 0, Q: 0 };
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L("ল-চেটেলিয়াৰ নীতি", "Le Chatelier's principle") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var dsel, tsel, ssel;
    function Kc(sys, T) { var dn = 0; sys.nu.forEach(function (x) { dn += x; }); return sys.Kp[T] * Math.pow(RG * T, -dn); }
    function dist(sys) {
      var d = [], n = sys.names;
      n.forEach(function (nm, j) { d.push({ id: 'add' + j, n: 'Add ' + nm + ' (+0.05 M)' }); });
      d.push({ id: 'rem', n: 'Remove half of ' + n[n.length - 1] });
      d.push({ id: 'comp', n: 'Compress to half the volume' });
      d.push({ id: 'exp', n: 'Expand to double the volume' });
      d.push({ id: 'inert', n: 'Add inert gas at constant volume' });
      d.push({ id: 'cat', n: 'Add a catalyst' });
      return d;
    }
    function init() {
      var sys = SYS[st.s]; st.T = sys.T0;
      st.c = solveEq(sys.nu, sys.feed, Kc(sys, st.T)).c; st.pre = st.c.slice(); st.pert = st.c.slice(); st.post = st.c.slice();
      st.t = 1; st.vol = 1; st.K = Kc(sys, st.T); st.Q = st.K; st.max = Math.max.apply(null, st.c) * 1.6; st.msg = L("সাম্যত থকা মিশ্ৰণ। এটা পৰিবৰ্তন বাছি Apply টিপক।", "A mixture at equilibrium. Choose a disturbance and press Apply.");
    }
    function perturb(kind, Tnew) {
      var sys = SYS[st.s], c = st.c.slice(), K = Kc(sys, Tnew || st.T), why = '';
      st.pre = st.c.slice();
      if (kind.indexOf('add') === 0) { var j = +kind.slice(3); c[j] += 0.05; why = L("এটা পদাৰ্থৰ গাঢ়তা বঢ়োৱা হ'ল", "The concentration of one substance was increased"); }
      else if (kind === 'rem') { c[c.length - 1] *= 0.5; why = L("উৎপাদৰ কিছু আতৰোৱা হ'ল", "Some product was removed"); }
      else if (kind === 'comp') { c = c.map(function (v) { return v * 2; }); st.vol /= 2; why = L("আয়তন আধা — সকলো গাঢ়তা দুগুণ", "Volume halved — every concentration doubles"); }
      else if (kind === 'exp') { c = c.map(function (v) { return v / 2; }); st.vol *= 2; why = L("আয়তন দুগুণ — সকলো গাঢ়তা আধা", "Volume doubled — every concentration halves"); }
      else if (kind === 'inert') why = L("স্থিৰ আয়তনত নিষ্ক্ৰিয় গেছ — গাঢ়তা অপৰিৱৰ্তিত", "Inert gas at constant volume — concentrations unchanged");
      else if (kind === 'cat') why = L("অনুঘটক — K আৰু গাঢ়তা অপৰিৱৰ্তিত", "A catalyst — K and the concentrations are unchanged");
      else if (kind === 'T') why = L("তাপমাত্ৰা " + st.T + " K ৰ পৰা " + Tnew + " K লৈ সলনি — K সলনি হ'ল", "Temperature changed from " + st.T + " K to " + Tnew + " K — K changes");
      var Q = Math.exp(lnQ(sys.nu, c)), dir = Math.abs(Math.log(Q / K)) < 1e-9 ? 0 : (Q < K ? 1 : -1);
      var post = solveEq(sys.nu, c, K).c;
      st.pert = c; st.post = post; st.c = post; st.t = 0; st.K = K; st.Q = Q;
      if (kind === 'T') st.T = Tnew;
      st.max = Math.max.apply(null, st.pre.concat(c, post)) * 1.15;
      var dirTxt = dir === 0 ? L("Q = K — কোনো সলনি নহয়; সাম্য নিজৰ স্থানতে থাকে।", "Q = K — no shift; the equilibrium stays where it is.") : (dir > 0 ? L("Q < K — সাম্য সন্মুখ দিশে (উৎপাদৰ ফালে) গতি কৰে।", "Q < K — the equilibrium shifts forward (towards the products).") : L("Q > K — সাম্য বিপৰীত দিশে (বিক্ৰিয়কৰ ফালে) গতি কৰে।", "Q > K — the equilibrium shifts backward (towards the reactants)."));
      st.msg = why + '. ' + dirTxt + (kind === 'cat' ? ' ' + L("অনুঘটকে সাম্য শীঘ্ৰে পোৱাত সহায় কৰে, সাম্যৰ অৱস্থান নসলায়।", "It only makes equilibrium arrive sooner; it does not move it.") : '') + (kind === 'inert' ? ' ' + L("মুঠ চাপ বাঢ়িলেও আংশিক চাপ একে।", "The total pressure rises but the partial pressures stay the same.") : '');
    }
    function paint() {
      var sys = SYS[st.s], cur = st.pert.map(function (v, j) { return st.post[j] + (v - st.post[j]) * Math.exp(-4 * st.t); }), i;
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L("গাঢ়তা (mol L⁻¹); ▏ = আগৰ সাম্য", "Concentration (mol L⁻¹); ▏ = previous equilibrium")));
      sys.names.forEach(function (nm, j) {
        var y = 26 + j * 30, w = cur[j] / st.max * 250, wp = st.pre[j] / st.max * 250;
        svg.appendChild(txt(s, 56, y + 17, 12, 'end', 'fill:var(--text)', nm, 700));
        svg.appendChild(s('rect', { x: 62, y: y, width: 250, height: 22, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 62, y: y, width: Math.max(1, Math.min(250, w)), height: 22, rx: 3, style: 'fill:' + (sys.nu[j] < 0 ? 'var(--electron)' : 'var(--alpha)') }));
        svg.appendChild(s('rect', { x: 62 + wp - 1, y: y - 3, width: 2, height: 28, style: 'fill:var(--text)' }));
        svg.appendChild(txt(s, 318, y + 16, 11, 'start', 'fill:var(--text)', g3(cur[j])));
      });
      var yy = 26 + sys.names.length * 30 + 12;
      svg.appendChild(txt(s, 8, yy, 12, 'start', 'fill:var(--text)', 'T = ' + st.T + ' K · Kc = ' + g3(st.K) + ' · Q = ' + g3(st.Q), 600));
      info.innerHTML = '<b>' + st.msg + '</b><br>' + L("নতুন সাম্য গাঢ়তা: ", "New equilibrium concentrations: ") + sys.names.map(function (nm, j) { return '[' + nm + '] = ' + g3(st.post[j]); }).join(', ') + ' M · ' + L("আপেক্ষিক আয়তন = ", "relative volume = ") + st.vol.toFixed(2);
    }
    var lp = k.loop(root, function (dt) { st.t += dt; paint(); if (st.t > 2.2) lp.stop(); });
    function mkDist() {
      var sys = SYS[st.s], d = dist(sys), sel = k.select('Disturbance', d.map(function (o) { return { value: o.id, label: o.n }; }), d[0].id, function () { });
      dsel = sel; return sel;
    }
    function build() {
      var box = row(h, []);
      mkDist();
      var tops = [298, 400, 500].map(function (T) { return { value: String(T), label: T + ' K' }; });
      tsel = k.select('Temperature', tops, String(SYS[st.s].T0), function (v) { var T = +v; if (T === st.T) return; perturb('T', T); lp.start(); paint(); });
      var ap = k.button('Apply', function () { perturb(dsel.select.value); lp.start(); paint(); });
      var rs = k.button('Reset', function () { init(); tsel.select.value = String(SYS[st.s].T0); paint(); });
      holder.innerHTML = '';
      holder.appendChild(dsel.el); holder.appendChild(ap); holder.appendChild(tsel.el); holder.appendChild(rs);
    }
    var holder = h('div', { 'class': 'row' });
    ssel = k.select('System', opts(SYS, function (o) { return o.n; }), '0', function (v) { st.s = +v; init(); build(); paint(); });
    root.appendChild(row(h, [ssel.el]));
    root.appendChild(holder);
    root.appendChild(info);
    init(); build(); paint();
  });

  /* ================================================================== 8. pH scale for strong acid / base */
  A.register('ph-scale', function (root, k) {
    var h = k.h, s = k.s;
    var COL = ['#e03131', '#e8590c', '#f08c00', '#f2b705', '#c0d12a', '#94c43a', '#5cb85c', '#2b9e6a', '#22a099', '#2a8fbd', '#2f6fd0', '#4a55c9', '#6b46c1', '#7d3aa8', '#8a2f8c'];
    var COMMON = [
      { a: "চূণপানী", e: "Lime water", p: 10.5 }, { a: "মিল্ক অৱ মেগ্নেছিয়া", e: "Milk of magnesia", p: 10 }, { a: "সাগৰৰ পানী", e: "Sea water", p: 7.8 },
      { a: "মানুহৰ তেজ", e: "Human blood", p: 7.4 }, { a: "গাখীৰ", e: "Milk", p: 6.8 }, { a: "মানুহৰ লেলাউটি", e: "Human saliva", p: 6.4 },
      { a: "কফি", e: "Coffee", p: 5.0 }, { a: "বিলাহীৰ ৰস", e: "Tomato juice", p: 4.2 }, { a: "ভিনেগাৰ", e: "Vinegar", p: 3.0 }, { a: "নেমুৰ ৰস", e: "Lemon juice", p: 2.2 }, { a: "পাকস্থলীৰ ৰস", e: "Gastric juice", p: 1.2 }
    ];
    var st = { kind: 'a', e: -2, cm: -1 };
    var svg = s('svg', { viewBox: '0 0 420 140', 'class': 'anim-svg', role: 'img', 'aria-label': L("pH মাপ", "The pH scale") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = Math.pow(10, st.e), ph = strongPH(st.kind, c), poh = 14 - ph, i;
      var X0 = 20, W = 380, cw = W / 15, px = function (p) { return X0 + (clamp(p, 0, 14) + 0.5) / 15 * W; };
      svg.innerHTML = '';
      for (i = 0; i < 15; i++) {
        svg.appendChild(s('rect', { x: X0 + i * cw, y: 40, width: cw - 1, height: 26, style: 'fill:' + COL[i] }));
        svg.appendChild(txt(s, X0 + i * cw + cw / 2, 82, 11, 'middle', 'fill:var(--text)', String(i)));
      }
      svg.appendChild(txt(s, X0, 20, 11, 'start', 'fill:var(--muted)', L("← এছিডীয়", "← acidic")));
      svg.appendChild(txt(s, X0 + W, 20, 11, 'end', 'fill:var(--muted)', L("ক্ষাৰকীয় →", "basic →")));
      svg.appendChild(txt(s, X0 + 7.5 * cw, 20, 11, 'middle', 'fill:var(--muted)', L("প্ৰশম 7", "neutral 7")));
      svg.appendChild(s('polygon', { points: (px(ph) - 8) + ',30 ' + (px(ph) + 8) + ',30 ' + px(ph) + ',44', style: 'fill:var(--text)' }));
      svg.appendChild(txt(s, px(ph), 108, 13, 'middle', 'fill:var(--text)', 'pH ' + ph.toFixed(2), 700));
      if (st.cm >= 0) {
        var m = COMMON[st.cm];
        svg.appendChild(s('circle', { cx: px(m.p), cy: 53, r: 5, style: 'fill:none;stroke:var(--text);stroke-width:2' }));
        svg.appendChild(txt(s, px(m.p), 128, 11, 'middle', 'fill:var(--muted)', L(m.a, m.e) + ' ≈ ' + m.p));
      }
      var cls = Math.abs(ph - 7) < 0.005 ? L("প্ৰশম", "neutral") : (ph < 7 ? L("এছিডীয়", "acidic") : L("ক্ষাৰকীয়", "basic"));
      var note = c <= 3e-7 ? L("পাতল দ্ৰৱত পানীৰ আয়নীকৰণো ধৰিব লাগে: 10⁻⁸ M HCl ৰ pH 7 তকৈ কম (6.98), 7 তকৈ বেছি নহয়।", "At very low concentration the ionisation of water must be included: 10⁻⁸ M HCl has pH 6.98 (below 7), not 8.") : '';
      info.innerHTML = (st.kind === 'a' ? 'HCl' : 'NaOH') + ' ' + sci(c, 1) + ' M → [H<sub>3</sub>O<sup>+</sup>] = <b>' + sci(Math.pow(10, -ph), 2) + '</b> M, [OH<sup>−</sup>] = ' + sci(Math.pow(10, -poh), 2) + ' M<br>pH = <b>' + ph.toFixed(2) + '</b>, pOH = <b>' + poh.toFixed(2) + '</b> (pH + pOH = 14, K<sub>w</sub> = 1.0 × 10⁻¹⁴ at 298 K) · ' + cls + (note ? '<br>' + note : '');
    }
    var ksel = k.select('Solute', [{ value: 'a', label: 'HCl (strong acid)' }, { value: 'b', label: 'NaOH (strong base)' }], 'a', function (v) { st.kind = v; paint(); });
    var sl = k.slider('log₁₀ c', -9, 0, 0.5, st.e, function (v) { st.e = v; sl.out.textContent = v.toFixed(1) + '  (c = ' + sci(Math.pow(10, v), 1) + ' M)'; paint(); });
    sl.out.textContent = st.e.toFixed(1) + '  (c = 1.0 × 10⁻² M)';
    var csel = k.select('Compare with', [{ value: '-1', label: '— none —' }].concat(COMMON.map(function (o, i) { return { value: String(i), label: o.e + ' (' + o.p + ')' }; })), '-1', function (v) { st.cm = +v; paint(); });
    root.appendChild(row(h, [ksel.el, sl.el]));
    root.appendChild(row(h, [csel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 9. weak acids / bases: K_a, K_b, degree of ionisation, common-ion effect */
  A.register('weak-acid', function (root, k) {
    var h = k.h, s = k.s;
    var SP = [
      { f: "HF", t: 'a', K: 3.5e-4 }, { f: "HNO₂", t: 'a', K: 4.5e-4 }, { f: "HCOOH", t: 'a', K: 1.8e-4 }, { f: "C₆H₅COOH", t: 'a', K: 6.5e-5 },
      { f: "CH₃COOH", t: 'a', K: 1.74e-5 }, { f: "HClO", t: 'a', K: 3.0e-8 }, { f: "HCN", t: 'a', K: 4.9e-10 }, { f: "C₆H₅OH", t: 'a', K: 1.3e-10 },
      { f: "(CH₃)₂NH", t: 'b', K: 5.4e-4 }, { f: "(C₂H₅)₃N", t: 'b', K: 6.45e-5 }, { f: "NH₃", t: 'b', K: 1.77e-5 }, { f: "C₅H₅N (pyridine)", t: 'b', K: 1.77e-9 }, { f: "C₆H₅NH₂ (aniline)", t: 'b', K: 4.27e-10 }
    ];
    var SALT = [0, 0.001, 0.01, 0.05, 0.1, 0.5];
    var st = { i: 4, e: -1.3, si: 0 };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L("আয়নীকৰণ মাত্ৰা বনাম গাঢ়তা", "Degree of ionisation against concentration") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var sp = SP[st.i], c = Math.pow(10, st.e), salt = SALT[st.si], r = weakH(sp.t, sp.K, c, salt), r0 = weakH(sp.t, sp.K, c, 0), pH = -lg(r.h), j;
      var X0 = 44, X1 = 400, Y0 = 20, Y1 = 160;
      var ax = function (e) { return X0 + (e + 5) / 5 * (X1 - X0); }, ay = function (a) { return Y1 - a * (Y1 - Y0); };
      svg.innerHTML = '';
      svg.appendChild(s('line', { x1: X0, y1: Y1, x2: X1, y2: Y1, style: 'stroke:var(--muted)' }));
      svg.appendChild(s('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, style: 'stroke:var(--muted)' }));
      for (j = 0; j <= 4; j++) svg.appendChild(txt(s, X0 + 0, ay(j / 4) + 3, 9, 'end', 'fill:var(--muted)', (j / 4).toFixed(2)));
      for (j = -5; j <= 0; j++) { svg.appendChild(txt(s, ax(j), Y1 + 13, 9, 'middle', 'fill:var(--muted)', '10' + sup(j))); }
      svg.appendChild(txt(s, X1, 190, 11, 'end', 'fill:var(--muted)', L("গাঢ়তা c (mol L⁻¹, লগ স্কেল) →", "concentration c (mol L⁻¹, log scale) →")));
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L("আয়নীকৰণ মাত্ৰা α", "degree of ionisation α")));
      var pts = '';
      for (j = 0; j <= 80; j++) { var e = -5 + j / 80 * 5; pts += ax(e).toFixed(1) + ',' + ay(weakH(sp.t, sp.K, Math.pow(10, e), 0).alpha).toFixed(1) + ' '; }
      svg.appendChild(s('polyline', { points: pts, fill: 'none', style: 'stroke:var(--electron);stroke-width:2.5' }));
      svg.appendChild(s('circle', { cx: ax(st.e), cy: ay(r0.alpha), r: 5, style: 'fill:var(--electron)' }));
      if (salt > 0) svg.appendChild(s('circle', { cx: ax(st.e), cy: ay(r.alpha), r: 6, style: 'fill:var(--proton);stroke:var(--canvas);stroke-width:1.5' }));
      var cion = sp.t === 'a' ? 'A⁻' : 'BH⁺';
      var rec = sp.t === 'a' ? sp.f + ' ⇌ H⁺ + A⁻' : 'B + H₂O ⇌ BH⁺ + OH⁻';
      info.innerHTML = '<b>' + sp.f + '</b> ' + sci(c, 1) + ' M · ' + (sp.t === 'a' ? 'K<sub>a</sub>' : 'K<sub>b</sub>') + ' = ' + sci(sp.K, 2) + ' (' + (sp.t === 'a' ? 'pK<sub>a</sub> = ' : 'pK<sub>b</sub> = ') + (-lg(sp.K)).toFixed(2) + ')<br>' +
        L("আয়নীকৰণ মাত্ৰা α = ", "degree of ionisation α = ") + '<b>' + (r0.alpha < 0.0005 ? sci(r0.alpha, 1) : r0.alpha.toFixed(3)) + '</b> (' + (r0.alpha * 100 < 0.05 ? '<0.05' : (r0.alpha * 100).toFixed(2)) + ' %) · pH = <b>' + (-lg(r0.h)).toFixed(2) + '</b>' + (salt > 0 ? L(" (লৱণ নোহোৱাকৈ)", " (no added salt)") : '') +
        (salt > 0 ? '<br>' + L("সম আয়ন (", "Common ion (") + cion + L(") ৰ উৎস লৱণ ", ") from added salt ") + salt + ' M: <b>α = ' + (r.alpha < 0.0005 ? sci(r.alpha, 1) : r.alpha.toFixed(4)) + ', pH = ' + pH.toFixed(2) + '</b> — ' + L("সম আয়ন প্ৰভাৱে আয়নীকৰণ হ্ৰাস কৰে।", "the common-ion effect suppresses ionisation.") : '<br>' + L("পাতল কৰিলে α বাঢ়ে, কিন্তু K ধ্ৰুৱক থাকে। তলত লৱণ যোগ কৰি সম আয়ন প্ৰভাৱ চাওক।", "On dilution α increases while K stays constant. Add the salt below to see the common-ion effect."));
    }
    var sel = k.select('Substance', opts(SP, function (o) { return o.f + (o.t === 'a' ? ' — acid' : ' — base'); }), String(st.i), function (v) { st.i = +v; paint(); });
    var sl = k.slider('log₁₀ c', -5, 0, 0.1, st.e, function (v) { st.e = v; sl.out.textContent = g3(Math.pow(10, v)) + ' M'; paint(); });
    sl.out.textContent = g3(Math.pow(10, st.e)) + ' M';
    var ssel = k.select('Add its salt (common ion)', opts(SALT, function (o) { return o === 0 ? 'none' : o + ' M'; }), '0', function (v) { st.si = +v; paint(); });
    root.appendChild(row(h, [sel.el, sl.el]));
    root.appendChild(row(h, [ssel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 10. hydrolysis of salts */
  A.register('hydrolysis', function (root, k) {
    var h = k.h, s = k.s;
    var SALTS = [
      { f: "CH₃COONa", type: 'B', pKa: 4.76, a: "CH₃COOH (মৃদু), NaOH (তীব্ৰ)", e: "CH₃COOH (weak), NaOH (strong)", rx: "CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻" },
      { f: "NaCN", type: 'B', pKa: 9.31, a: "HCN (মৃদু), NaOH (তীব্ৰ)", e: "HCN (weak), NaOH (strong)", rx: "CN⁻ + H₂O ⇌ HCN + OH⁻" },
      { f: "NaF", type: 'B', pKa: 3.46, a: "HF (মৃদু), NaOH (তীব্ৰ)", e: "HF (weak), NaOH (strong)", rx: "F⁻ + H₂O ⇌ HF + OH⁻" },
      { f: "NH₄Cl", type: 'A', pKb: 4.75, a: "HCl (তীব্ৰ), NH₃ (মৃদু)", e: "HCl (strong), NH₃ (weak)", rx: "NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺" },
      { f: "C₆H₅NH₃Cl", type: 'A', pKb: 9.37, a: "HCl (তীব্ৰ), এনিলিন (অতি মৃদু)", e: "HCl (strong), aniline (very weak)", rx: "C₆H₅NH₃⁺ + H₂O ⇌ C₆H₅NH₂ + H₃O⁺" },
      { f: "CH₃COONH₄", type: 'AB', pKa: 4.76, pKb: 4.75, a: "CH₃COOH (মৃদু), NH₃ (মৃদু)", e: "CH₃COOH (weak), NH₃ (weak)", rx: "CH₃COO⁻ + NH₄⁺ ⇌ CH₃COOH + NH₃" },
      { f: "NH₄CN", type: 'AB', pKa: 9.31, pKb: 4.75, a: "HCN (মৃদু), NH₃ (মৃদু)", e: "HCN (weak), NH₃ (weak)", rx: "CN⁻ + NH₄⁺ ⇌ HCN + NH₃" },
      { f: "NaCl", type: 'N', a: "HCl (তীব্ৰ), NaOH (তীব্ৰ)", e: "HCl (strong), NaOH (strong)", rx: L("জল-বিশ্লেষণ নহয়", "no hydrolysis") }
    ];
    var st = { i: 0, e: -1 };
    var svg = s('svg', { viewBox: '0 0 420 110', 'class': 'anim-svg', role: 'img', 'aria-label': L("লৱণৰ জল-বিশ্লেষণ আৰু pH", "Salt hydrolysis and pH") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function calc() {
      var S = SALTS[st.i], c = Math.pow(10, st.e), lc = st.e, pH, hd, kind;
      if (S.type === 'B') { pH = 7 + 0.5 * (S.pKa + lc); hd = Math.sqrt(KW / (Math.pow(10, -S.pKa) * c)); kind = 'b'; }
      else if (S.type === 'A') { pH = 7 - 0.5 * (S.pKb + lc); hd = Math.sqrt(KW / (Math.pow(10, -S.pKb) * c)); kind = 'a'; }
      else if (S.type === 'AB') { pH = 7 + 0.5 * (S.pKa - S.pKb); hd = Math.sqrt(KW / (Math.pow(10, -S.pKa - S.pKb))); kind = pH > 7.05 ? 'b' : (pH < 6.95 ? 'a' : 'n'); }
      else { pH = 7; hd = 0; kind = 'n'; }
      return { pH: pH, h: hd, c: c, S: S, kind: kind };
    }
    function paint() {
      var r = calc(), S = r.S, X0 = 20, W = 380, px = function (p) { return X0 + clamp(p, 0, 14) / 14 * W; }, i;
      svg.innerHTML = '';
      for (i = 0; i < 14; i++) svg.appendChild(s('rect', { x: X0 + i * W / 14, y: 30, width: W / 14 - 1, height: 20, style: 'fill:' + ['#e03131', '#e8590c', '#f08c00', '#f2b705', '#c0d12a', '#94c43a', '#5cb85c', '#2b9e6a', '#22a099', '#2a8fbd', '#2f6fd0', '#4a55c9', '#6b46c1', '#7d3aa8'][i] }));
      svg.appendChild(txt(s, X0, 22, 10, 'start', 'fill:var(--muted)', '0'));
      svg.appendChild(txt(s, X0 + W, 22, 10, 'end', 'fill:var(--muted)', '14'));
      svg.appendChild(txt(s, px(7), 22, 10, 'middle', 'fill:var(--muted)', '7'));
      svg.appendChild(s('polygon', { points: (px(r.pH) - 7) + ',58 ' + (px(r.pH) + 7) + ',58 ' + px(r.pH) + ',46', style: 'fill:var(--text)' }));
      svg.appendChild(txt(s, px(r.pH), 76, 13, 'middle', 'fill:var(--text)', 'pH ' + r.pH.toFixed(2), 700));
      svg.appendChild(txt(s, 210, 100, 13, 'middle', 'fill:var(--text)', S.rx, 600));
      var cls = r.kind === 'b' ? L("ক্ষাৰকীয় দ্ৰৱ (pH > 7)", "basic solution (pH > 7)") : (r.kind === 'a' ? L("এছিডীয় দ্ৰৱ (pH < 7)", "acidic solution (pH < 7)") : L("প্ৰায় প্ৰশম (pH ≈ 7)", "about neutral (pH ≈ 7)"));
      var formula = S.type === 'B' ? 'pH = 7 + ½(pK<sub>a</sub> + log c)' : (S.type === 'A' ? 'pH = 7 − ½(pK<sub>b</sub> + log c)' : (S.type === 'AB' ? 'pH = 7 + ½(pK<sub>a</sub> − pK<sub>b</sub>)' : 'pH = 7'));
      info.innerHTML = '<b>' + S.f + '</b> ' + sci(r.c, 1) + ' M — ' + L("উৎপন্ন হোৱা: ", "formed from: ") + L(S.a, S.e) + '<br>' + formula + ' = <b>' + r.pH.toFixed(2) + '</b> — ' + cls + '<br>' +
        (S.type === 'N' ? L("তীব্ৰ এছিড আৰু তীব্ৰ ক্ষাৰকৰ লৱণৰ আয়নবোৰে জল-বিশ্লেষণ নকৰে।", "The ions of a strong-acid / strong-base salt do not hydrolyse.") : L("জল-বিশ্লেষণৰ মাত্ৰা h ≈ ", "degree of hydrolysis h ≈ ") + (r.h > 1 ? '> 1' : r.h.toFixed(4)) + (r.h > 0.1 ? ' — ' + L("সূত্ৰটো আনুমানিক; পাতল দ্ৰৱত কম নিখুঁত।", "the formula is only approximate here (h is not small).") : '') + (S.type === 'AB' ? ' · ' + L("pH দ্ৰৱৰ গাঢ়তাৰ ওপৰত নিৰ্ভৰ নকৰে।", "pH does not depend on the concentration.") : ''));
    }
    var sel = k.select('Salt', opts(SALTS, function (o) { return o.f; }), '0', function (v) { st.i = +v; paint(); });
    var sl = k.slider('log₁₀ c', -4, 0, 0.5, st.e, function (v) { st.e = v; sl.out.textContent = g3(Math.pow(10, v)) + ' M'; paint(); });
    sl.out.textContent = '0.1 M';
    root.appendChild(row(h, [sel.el, sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 11. buffer solution */
  A.register('buffer', function (root, k) {
    var h = k.h, s = k.s;
    var BUF = [
      { n: "CH₃COOH / CH₃COONa  (pK<sub>a</sub> = 4.76)", pKa: 4.76, HA: "CH₃COOH", A: "CH₃COO⁻" },
      { n: "NH₄⁺ / NH₃  (pK<sub>a</sub> = 9.25, i.e. pK<sub>b</sub> = 4.75)", pKa: 9.25, HA: "NH₄⁺", A: "NH₃" }
    ];
    var st = { b: 0, ha: 0.10, a: 0.10, net: 0 };
    var svg = s('svg', { viewBox: '0 0 420 130', 'class': 'anim-svg', role: 'img', 'aria-label': L("বাফাৰ দ্ৰৱ আৰু বিশুদ্ধ পানীৰ pH", "pH of a buffer solution and of pure water") });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function bufPH() {
      var B = BUF[st.b], ha = st.ha + st.net, a = st.a - st.net, note = '';
      if (a <= 1e-9) { var ex = st.net - st.a; return { pH: -lg(Math.max(ex, 1e-12)), ha: ha, a: 0, off: true }; }
      if (ha <= 1e-9) { var ex2 = -st.net - st.ha; return { pH: 14 + lg(Math.max(ex2, 1e-12)), ha: 0, a: a, off: true }; }
      return { pH: B.pKa + lg(a / ha), ha: ha, a: a, off: false };
    }
    function paint() {
      var B = BUF[st.b], r = bufPH(), w, i, pHw = st.net === 0 ? 7 : (st.net > 0 ? strongPH('a', st.net) : strongPH('b', -st.net));
      var ph0 = B.pKa + lg(st.a / st.ha), X0 = 20, W = 380, px = function (p) { return X0 + clamp(p, 0, 14) / 14 * W; };
      svg.innerHTML = '';
      var cols = ['#e03131', '#e8590c', '#f08c00', '#f2b705', '#c0d12a', '#94c43a', '#5cb85c', '#2b9e6a', '#22a099', '#2a8fbd', '#2f6fd0', '#4a55c9', '#6b46c1', '#7d3aa8'];
      [[28, r.pH, L("বাফাৰ দ্ৰৱ", "Buffer"), 'var(--proton)'], [82, pHw, L("বিশুদ্ধ পানী (একে যোগ)", "Pure water (same addition)"), 'var(--electron)']].forEach(function (row0) {
        svg.appendChild(txt(s, X0, row0[0] - 8, 11, 'start', 'fill:var(--muted)', row0[2]));
        for (i = 0; i < 14; i++) svg.appendChild(s('rect', { x: X0 + i * W / 14, y: row0[0], width: W / 14 - 1, height: 14, style: 'fill:' + cols[i] + ';opacity:.8' }));
        svg.appendChild(s('polygon', { points: (px(row0[1]) - 6) + ',' + (row0[0] + 30) + ' ' + (px(row0[1]) + 6) + ',' + (row0[0] + 30) + ' ' + px(row0[1]) + ',' + (row0[0] + 17), style: 'fill:' + row0[3] }));
        svg.appendChild(txt(s, px(row0[1]) + (row0[1] > 11 ? -10 : 10), row0[0] + 31, 12, row0[1] > 11 ? 'end' : 'start', 'fill:' + row0[3], 'pH ' + row0[1].toFixed(2), 700));
      });
      info.innerHTML = '<b>' + B.HA + ' : ' + B.A + '</b> = ' + g3(st.ha) + ' : ' + g3(st.a) + ' mol (1 L) → pH = pK<sub>a</sub> + log([' + B.A + ']/[' + B.HA + ']) = <b>' + ph0.toFixed(2) + '</b><br>' +
        L("নিট ", "Net added: ") + (st.net >= 0 ? g3(st.net) + L(" mol তীব্ৰ এছিড (HCl) যোগ", " mol strong acid (HCl)") : g3(-st.net) + L(" mol তীব্ৰ ক্ষাৰ (NaOH) যোগ", " mol strong base (NaOH)")) + ' → [' + B.HA + '] = ' + g3(Math.max(0, r.ha)) + ', [' + B.A + '] = ' + g3(Math.max(0, r.a)) + '<br>' +
        L("বাফাৰৰ pH = ", "Buffer pH = ") + '<b>' + r.pH.toFixed(2) + '</b> (ΔpH = ' + (r.pH - ph0).toFixed(2) + ') · ' + L("পানীৰ pH = ", "water pH = ") + '<b>' + pHw.toFixed(2) + '</b> (ΔpH = ' + (pHw - 7).toFixed(2) + ')' +
        (r.off ? '<br>' + L("বাফাৰৰ ক্ষমতা শেষ — এতিয়া তীব্ৰ এছিড/ক্ষাৰৰ আধিক্য।", "Buffer capacity exhausted — there is now an excess of strong acid/base.") : '<br>' + L("বাফাৰে pH প্ৰায় অপৰিৱৰ্তিত ৰাখে; কাৰ্যকৰী পৰিসৰ pH = pK<sub>a</sub> ± 1।", "The buffer holds the pH almost steady; its useful range is pH = pK<sub>a</sub> ± 1."));
    }
    var bsel = k.select('Buffer', opts(BUF, function (o) { return o.n.replace(/<[^>]+>/g, ''); }), '0', function (v) { st.b = +v; st.net = 0; paint(); });
    var s1 = k.slider('Weak acid component (mol)', 0.01, 1, 0.01, st.ha, function (v) { st.ha = v; s1.out.textContent = v.toFixed(2); paint(); });
    s1.out.textContent = '0.10';
    var s2 = k.slider('Conjugate base component (mol)', 0.01, 1, 0.01, st.a, function (v) { st.a = v; s2.out.textContent = v.toFixed(2); paint(); });
    s2.out.textContent = '0.10';
    root.appendChild(row(h, [bsel.el]));
    root.appendChild(row(h, [s1.el, s2.el]));
    root.appendChild(row(h, [k.button('Add 0.01 mol HCl', function () { st.net = Math.round((st.net + 0.01) * 1000) / 1000; paint(); }), k.button('Add 0.01 mol NaOH', function () { st.net = Math.round((st.net - 0.01) * 1000) / 1000; paint(); }), k.button('Reset addition', function () { st.net = 0; paint(); })]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 12. solubility product, K_sp */
  A.register('ksp-solubility', function (root, k) {
    var h = k.h, s = k.s;
    var SALTS = [
      { f: "AgCl", x: 1, y: 1, K: 1.8e-10, M: "Ag⁺", X: "Cl⁻" }, { f: "AgBr", x: 1, y: 1, K: 5.0e-13, M: "Ag⁺", X: "Br⁻" }, { f: "AgI", x: 1, y: 1, K: 8.3e-17, M: "Ag⁺", X: "I⁻" },
      { f: "BaSO₄", x: 1, y: 1, K: 1.1e-10, M: "Ba²⁺", X: "SO₄²⁻" }, { f: "CaCO₃", x: 1, y: 1, K: 2.8e-9, M: "Ca²⁺", X: "CO₃²⁻" },
      { f: "Ag₂CrO₄", x: 2, y: 1, K: 1.1e-12, M: "Ag⁺", X: "CrO₄²⁻" }, { f: "Ag₂SO₄", x: 2, y: 1, K: 1.4e-5, M: "Ag⁺", X: "SO₄²⁻" },
      { f: "CaF₂", x: 1, y: 2, K: 5.3e-9, M: "Ca²⁺", X: "F⁻" }, { f: "PbCl₂", x: 1, y: 2, K: 1.6e-5, M: "Pb²⁺", X: "Cl⁻" }, { f: "Ni(OH)₂", x: 1, y: 2, K: 2.0e-15, M: "Ni²⁺", X: "OH⁻" },
      { f: "Al(OH)₃", x: 1, y: 3, K: 1.3e-33, M: "Al³⁺", X: "OH⁻" }, { f: "A₂X₃ (Ex 6.26)", x: 2, y: 3, K: 1.1e-23, M: "A³⁺", X: "X²⁻" }
    ];
    /* the cation count x and anion count y of the formula are the numbers of ions; charges are in the labels */
    var st = { i: 0, mode: 'sol', ion: 'none', e: -1, ec: -4, ea: -4 };
    var svg = s('svg', { viewBox: '0 0 420 290', 'class': 'anim-svg', role: 'img', 'aria-label': L("দ্ৰাব্যতা গুণফল আৰু মোলাৰ দ্ৰাব্যতা", "Solubility product and molar solubility") });
    root.appendChild(svg);
    var ctl = h('div', { 'class': 'row' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function S0(z) { return Math.pow(z.K / (Math.pow(z.x, z.x) * Math.pow(z.y, z.y)), 1 / (z.x + z.y)); }
    function Scommon(z, cm, ca) {
      var hi = S0(z), lo = 0, mid, j, kl = Math.log(z.K);
      if (cm === 0 && ca === 0) return hi;
      for (j = 0; j < 200; j++) {
        mid = (lo + hi) / 2;
        var v = z.x * Math.log(z.x * mid + cm) + z.y * Math.log(z.y * mid + ca);
        if (v < kl) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    }
    function paint() {
      var z = SALTS[st.i], s0 = S0(z), i, cm = 0, ca = 0, S1 = s0;
      svg.innerHTML = '';
      var all = SALTS.map(S0), lo = -18, hi = 0, X0 = 112, X1 = 396, ax = function (v) { return X0 + (clamp(lg(v), lo, hi) - lo) / (hi - lo) * (X1 - X0); };
      svg.appendChild(txt(s, 8, 12, 11, 'start', 'fill:var(--muted)', L("মোলাৰ দ্ৰাব্যতা S (mol L⁻¹, লগ স্কেল)", "Molar solubility S (mol L⁻¹, log scale)")));
      SALTS.forEach(function (q, j) {
        var y = 20 + j * 19, on = j === st.i;
        svg.appendChild(txt(s, 106, y + 12, 10, 'end', 'fill:var(--text)', q.f, on ? 700 : 400));
        svg.appendChild(s('rect', { x: X0, y: y, width: X1 - X0, height: 14, rx: 2, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: X0, y: y, width: Math.max(1, ax(all[j]) - X0), height: 14, rx: 2, style: 'fill:' + (on ? 'var(--proton)' : 'var(--electron)') + ';opacity:' + (on ? 1 : .55) }));
        if (on) svg.appendChild(txt(s, Math.min(ax(all[j]) + 4, 340), y + 11, 10, 'start', 'fill:var(--text)', sci(all[j], 2), 700));
      });
      for (i = -18; i <= 0; i += 6) svg.appendChild(txt(s, X0 + (i - lo) / (hi - lo) * (X1 - X0), 286, 9, 'middle', 'fill:var(--muted)', '10' + sup(i)));
      if (st.mode === 'sol') {
        if (st.ion === 'cat') cm = Math.pow(10, st.e); if (st.ion === 'an') ca = Math.pow(10, st.e);
        S1 = Scommon(z, cm, ca);
        svg.appendChild(s('circle', { cx: ax(S1), cy: 20 + st.i * 19 + 7, r: 5, style: 'fill:var(--ok);stroke:var(--canvas)' }));
        info.innerHTML = '<b>' + z.f + '</b> ⇌ ' + (z.x > 1 ? z.x : '') + z.M + ' + ' + (z.y > 1 ? z.y : '') + z.X + ' · K<sub>sp</sub> = ' + sci(z.K, 2) + '<br>' +
          'K<sub>sp</sub> = (' + z.x + 'S)<sup>' + z.x + '</sup>(' + z.y + 'S)<sup>' + z.y + '</sup> = ' + (Math.pow(z.x, z.x) * Math.pow(z.y, z.y)) + 'S<sup>' + (z.x + z.y) + '</sup> → <b>S = ' + sci(s0, 2) + '</b> mol L⁻¹ ' + L("(বিশুদ্ধ পানীত)", "(in pure water)") +
          (st.ion === 'none' ? '' : '<br>' + L("সম আয়ন ", "Common ion ") + (st.ion === 'cat' ? z.M : z.X) + ' ' + sci(Math.pow(10, st.e), 1) + L(" M থাকিলে S = ", " M present: S = ") + '<b>' + sci(S1, 2) + '</b> mol L⁻¹ (' + (S1 / s0 * 100 < 0.01 ? '<0.01' : (S1 / s0 * 100).toFixed(2)) + L(" % — দ্ৰাব্যতা হ্ৰাস)", " % of the pure-water value)"));
      } else {
        cm = Math.pow(10, st.ec); ca = Math.pow(10, st.ea);
        var Q = Math.pow(cm, z.x) * Math.pow(ca, z.y), verdict = Math.abs(Math.log(Q / z.K)) < 0.01 ? L("Q ≈ K_sp — সংপৃক্ত দ্ৰৱ", "Q ≈ K<sub>sp</sub> — saturated") : (Q > z.K ? L("Q > K_sp — অধঃক্ষেপ পৰে", "Q > K<sub>sp</sub> — a precipitate forms") : L("Q < K_sp — অসংপৃক্ত, অধঃক্ষেপ নপৰে", "Q < K<sub>sp</sub> — unsaturated, no precipitate"));
        info.innerHTML = 'Q = [' + z.M + ']<sup>' + z.x + '</sup>[' + z.X + ']<sup>' + z.y + '</sup> = ' + sci(Q, 2) + ' · K<sub>sp</sub> = ' + sci(z.K, 2) + '<br><b>' + verdict + '</b>';
        svg.appendChild(s('line', { x1: ax(z.K), y1: 18 + st.i * 19, x2: ax(z.K), y2: 18 + st.i * 19 + 18, style: 'stroke:var(--text)' }));
      }
    }
    function build() {
      ctl.innerHTML = '';
      if (st.mode === 'sol') {
        var isel = k.select('Added common ion', [{ value: 'none', label: 'none' }, { value: 'cat', label: 'cation' }, { value: 'an', label: 'anion' }], st.ion, function (v) { st.ion = v; paint(); });
        var sl = k.slider('log₁₀ [common ion]', -5, 0, 0.5, st.e, function (v) { st.e = v; sl.out.textContent = sci(Math.pow(10, v), 1) + ' M'; paint(); });
        sl.out.textContent = sci(Math.pow(10, st.e), 1) + ' M';
        ctl.appendChild(isel.el); ctl.appendChild(sl.el);
      } else {
        var a = k.slider('log₁₀ [cation]', -8, 0, 0.5, st.ec, function (v) { st.ec = v; a.out.textContent = sci(Math.pow(10, v), 1) + ' M'; paint(); });
        a.out.textContent = sci(Math.pow(10, st.ec), 1) + ' M';
        var b = k.slider('log₁₀ [anion]', -8, 0, 0.5, st.ea, function (v) { st.ea = v; b.out.textContent = sci(Math.pow(10, v), 1) + ' M'; paint(); });
        b.out.textContent = sci(Math.pow(10, st.ea), 1) + ' M';
        ctl.appendChild(a.el); ctl.appendChild(b.el);
      }
    }
    var ssel = k.select('Salt', opts(SALTS, function (o) { return o.f; }), '0', function (v) { st.i = +v; paint(); });
    var msel = k.select('Show', [{ value: 'sol', label: 'Solubility from K_sp' }, { value: 'pre', label: 'Precipitation test (Q vs K_sp)' }], 'sol', function (v) { st.mode = v; build(); paint(); });
    root.appendChild(row(h, [ssel.el, msel.el]));
    root.appendChild(ctl);
    root.appendChild(info);
    build(); paint();
  });
})();
