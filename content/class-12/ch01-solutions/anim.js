/* Animations for Class 12, Chapter 1: Solutions (দ্ৰৱ).
   Registered names: concentration, solubility, henry, raoult, deviations, colligative, osmosis, cell-osmosis, vanthoff
   Controls are in English (app UI); read-outs are in Assamese (subject content). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var TAU = Math.PI * 2;

  function sci(x, d) {
    if (!x) return '0';
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    return m.toFixed(d === undefined ? 2 : d) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ================================================================== 1. concentration */
  A.register('concentration', function (root, k) {
    var h = k.h, s = k.s;
    var SOL = [
      { name: 'Glucose (180 g/mol)', M: 180 }, { name: 'Urea (60 g/mol)', M: 60 },
      { name: 'NaOH (40 g/mol)', M: 40 }, { name: 'Ethylene glycol (62 g/mol)', M: 62 }
    ];
    var st = { i: 0, ws: 36, ww: 400, rho: 1.05, T: 298 };
    var svg = s('svg', { viewBox: '0 0 300 240', 'class': 'anim-svg', role: 'img', 'aria-label': 'দ্ৰৱৰ বীকাৰ: দ্ৰাৱৰ কণা আৰু দ্ৰাৱক' });
    svg.appendChild(s('path', { d: 'M70 24 L70 208 Q70 220 82 220 L218 220 Q230 220 230 208 L230 24', fill: 'none', stroke: 'var(--muted)', 'stroke-width': 3 }));
    var liquid = s('rect', { x: 73, width: 154, rx: 6, style: 'fill:var(--electron);opacity:.18' });
    var dotsG = s('g');
    svg.appendChild(liquid); svg.appendChild(dotsG);
    root.appendChild(svg);
    var dots = [];
    var readout = h('div', { 'class': 'readout', 'aria-live': 'polite' });

    function rhoT() { return st.rho * (1 - 0.00035 * (st.T - 298)); }
    function calc() {
      var M = SOL[st.i].M, ns = st.ws / M, nw = st.ww / 18, mass = st.ws + st.ww;
      var V = mass / rhoT();                         /* mL */
      return { ns: ns, nw: nw, mass: mass, V: V,
        pct: st.ws / mass * 100, xs: ns / (ns + nw), xw: nw / (ns + nw),
        m: ns / (st.ww / 1000), Mol: ns / (V / 1000), ppm: st.ws / mass * 1e6 };
    }
    function rebuild() {
      var c = calc();
      var top = 214 - clamp(c.V / 700, 0.15, 1) * 180;
      liquid.setAttribute('y', top); liquid.setAttribute('height', 214 - top);
      dotsG.innerHTML = ''; dots = [];
      var nS = Math.round(clamp(c.ns * 28, 2, 70)), nW = 45;
      for (var i = 0; i < nS + nW; i++) {
        var isS = i < nS, r = isS ? 5 : 3;
        var d = { x: rnd(80, 220), y: rnd(top + 6, 210), top: top, node: s('circle', { r: r, style: 'fill:' + (isS ? 'var(--alpha)' : 'var(--electron)') + ';opacity:' + (isS ? 1 : .55) }) };
        dotsG.appendChild(d.node); dots.push(d);
      }
      paint(c);
    }
    function paint(c) {
      c = c || calc();
      var hot = Math.abs(st.T - 298) > 0.5 ? ' style="color:var(--accent);font-weight:700"' : '';
      readout.innerHTML =
        '<table style="width:100%;border-collapse:collapse">' +
        '<tr><td>ভৰ শতাংশ (w/w)</td><td><b>' + c.pct.toFixed(2) + ' %</b></td></tr>' +
        '<tr><td>ম\'ল ভগ্নাংশ</td><td>x<sub>দ্ৰাৱ</sub> = <b>' + c.xs.toFixed(4) + '</b>, x<sub>দ্ৰাৱক</sub> = <b>' + c.xw.toFixed(4) + '</b></td></tr>' +
        '<tr><td>ম\'লালিটি (m)</td><td><b>' + c.m.toFixed(3) + ' mol kg<sup>−1</sup></b></td></tr>' +
        '<tr' + hot + '><td>ম\'লাৰিটি (M)</td><td><b>' + c.Mol.toFixed(3) + ' mol L<sup>−1</sup></b></td></tr>' +
        '<tr><td>নিযুতাংশ (ppm)</td><td><b>' + (c.ppm >= 1e5 ? sci(c.ppm, 2) : Math.round(c.ppm)) + '</b></td></tr></table>' +
        '<div style="margin-top:6px">দ্ৰৱৰ আয়তন ≈ ' + c.V.toFixed(0) + ' mL (T = ' + st.T + ' K)' +
        (hot ? '<br><b style="color:var(--accent)">লক্ষ্য কৰক: উষ্ণতা সলনি কৰিলে কেৱল ম\'লাৰিটি সলনি হয়; ম\'লালিটি, ম\'ল ভগ্নাংশ আৰু ভৰ শতাংশ একে থাকে।</b>' : '') + '</div>';
    }
    function tick(dt) {
      dots.forEach(function (d) {
        d.x = clamp(d.x + rnd(-1.6, 1.6), 78, 222); d.y = clamp(d.y + rnd(-1.6, 1.6), d.top + 5, 212);
        d.node.setAttribute('cx', d.x); d.node.setAttribute('cy', d.y);
      });
    }
    var sel = k.select('Solute', SOL.map(function (o, i) { return { value: i, label: o.name }; }), 0, function (v) { st.i = +v; rebuild(); });
    var s1 = k.slider('Solute (g)', 1, 120, 1, st.ws, function (v) { st.ws = v; rebuild(); });
    var s2 = k.slider('Water (g)', 50, 600, 10, st.ww, function (v) { st.ww = v; rebuild(); });
    var s3 = k.slider('Density (g/mL)', 1.0, 1.25, 0.01, st.rho, function (v) { st.rho = v; rebuild(); });
    var s4 = k.slider('Temp (K)', 278, 338, 2, st.T, function (v) { st.T = v; rebuild(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, s1.el, s2.el]));
    root.appendChild(h('div', { 'class': 'row' }, [s3.el, s4.el]));
    root.appendChild(readout);
    var lp = k.loop(root, tick);
    rebuild();
    if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 2. solubility (dynamic equilibrium) */
  A.register('solubility', function (root, k) {
    var h = k.h, W = 480, H = 300;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'কঠিন পদাৰ্থ দ্ৰবীভূত হোৱা আৰু স্ফটিকীকৰণ হোৱাৰ গতিশীল সাম্য' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var LQ = { x: 16, y: 50, w: 300, h: 220 };
    var S = 0, D = [], T = 298, mode = 'endo', KD = 6, KC = 0.3, acc = { d: 0, c: 0 }, rd = 0, rc = 0;
    var COLS = 18, CELL = 16;

    function kd() { return Math.max(0.6, mode === 'endo' ? KD * (1 + 0.05 * (T - 298)) : KD * (1 - 0.04 * (T - 298))); }
    function pileXY(i) { return [LQ.x + 6 + (i % COLS) * CELL + CELL / 2, LQ.y + LQ.h - 4 - Math.floor(i / COLS) * CELL - CELL / 2]; }
    function addDissolved() {
      var p = pileXY(Math.max(0, S)); D.push({ x: p[0], y: p[1] - 14, vx: rnd(-30, 30), vy: rnd(-40, -10) });
    }
    function tick(dt) {
      var Rd = S > 0 ? kd() : 0, Rc = KC * D.length;
      rd += (Rd - rd) * Math.min(1, dt * 4); rc += (Rc - rc) * Math.min(1, dt * 4);
      acc.d += Rd * dt; while (acc.d >= 1 && S > 0) { S--; addDissolved(); acc.d -= 1; } if (S === 0) acc.d = 0;
      acc.c += Rc * dt; while (acc.c >= 1 && D.length) { D.splice(Math.floor(Math.random() * D.length), 1); S++; acc.c -= 1; }
      D.forEach(function (p) {
        p.vx += rnd(-90, 90) * dt; p.vy += rnd(-90, 90) * dt;
        var sp = Math.hypot(p.vx, p.vy); if (sp > 50) { p.vx *= 50 / sp; p.vy *= 50 / sp; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < LQ.x + 6 || p.x > LQ.x + LQ.w - 6) p.vx *= -1;
        if (p.y < LQ.y + 8 || p.y > LQ.y + LQ.h - 8) p.vy *= -1;
        p.x = clamp(p.x, LQ.x + 6, LQ.x + LQ.w - 6); p.y = clamp(p.y, LQ.y + 8, LQ.y + LQ.h - 8);
      });
      draw();
    }
    function status() {
      if (S === 0) return { t: 'অসংপৃক্ত দ্ৰৱ (unsaturated) — আৰু দ্ৰাৱ দ্ৰবীভূত কৰিব পাৰি', c: '--electron' };
      if (Math.abs(rd - rc) < 0.15 * Math.max(rd, 0.1)) return { t: 'সংপৃক্ত দ্ৰৱ (saturated) — গতিশীল সাম্য', c: '--ok' };
      return { t: 'দ্ৰৱণ চলি আছে…', c: '--alpha' };
    }
    function draw() {
      var bg = k.cssVar('--canvas'), br = k.cssVar('--border'), txt = k.cssVar('--text'), mu = k.cssVar('--muted'),
        blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), teal = k.cssVar('--brand');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = blue; ctx.globalAlpha = .12; ctx.fillRect(LQ.x, LQ.y, LQ.w, LQ.h); ctx.globalAlpha = 1;
      ctx.strokeStyle = mu; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LQ.x, LQ.y - 20); ctx.lineTo(LQ.x, LQ.y + LQ.h); ctx.lineTo(LQ.x + LQ.w, LQ.y + LQ.h); ctx.lineTo(LQ.x + LQ.w, LQ.y - 20); ctx.stroke();
      ctx.fillStyle = org; for (var i = 0; i < S; i++) { var p = pileXY(i); ctx.fillRect(p[0] - 7, p[1] - 7, 14, 14); }
      ctx.fillStyle = teal; D.forEach(function (q) { ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, TAU); ctx.fill(); });
      /* rate bars */
      var bx = 330, MAXR = 22;
      ctx.font = '600 13px "Noto Sans Bengali", sans-serif'; ctx.fillStyle = txt;
      ctx.fillText('দ্ৰৱণৰ হাৰ', bx, 70); ctx.fillText('স্ফটিকীকৰণৰ হাৰ', bx, 130);
      ctx.fillStyle = br; ctx.fillRect(bx, 78, 130, 16); ctx.fillRect(bx, 138, 130, 16);
      ctx.fillStyle = org; ctx.fillRect(bx, 78, 130 * clamp(rd / MAXR, 0, 1), 16);
      ctx.fillStyle = teal; ctx.fillRect(bx, 138, 130 * clamp(rc / MAXR, 0, 1), 16);
      ctx.fillStyle = mu; ctx.font = '12px sans-serif';
      ctx.fillText('কঠিন: ' + S + ' · দ্ৰবীভূত: ' + D.length, bx, 190);
      var st = status();
      ctx.fillStyle = k.cssVar(st.c); ctx.font = '700 13px "Noto Sans Bengali", sans-serif';
      var words = st.t.split(' — '); ctx.fillText(words[0], bx, 222); if (words[1]) { ctx.font = '12px "Noto Sans Bengali", sans-serif'; ctx.fillText(words[1], bx, 242); }
      ctx.fillStyle = mu; ctx.font = '600 13px "Noto Sans Bengali", sans-serif';
      ctx.fillText('কঠিন দ্ৰাৱ + দ্ৰাৱক ⇌ দ্ৰৱ', LQ.x, 24);
    }

    var tSlider = k.slider('Temp (K)', 283, 333, 5, T, function (v) { T = v; });
    var endoBtn = k.button('Dissolving absorbs heat', function () { mode = 'endo'; paintModes(); });
    var exoBtn = k.button('Dissolving releases heat', function () { mode = 'exo'; paintModes(); });
    function paintModes() { endoBtn.setAttribute('aria-pressed', String(mode === 'endo')); exoBtn.setAttribute('aria-pressed', String(mode === 'exo')); }
    var addBtn = k.button('Add solute (+10)', function () { S += 10; if (!lp.running) lp.start(); }, 'primary');
    var resetBtn = k.button('Reset', function () { S = 0; D = []; draw(); });
    root.appendChild(h('div', { 'class': 'row' }, [addBtn, resetBtn, tSlider.el]));
    root.appendChild(h('div', { 'class': 'row' }, [h('span', { 'class': 'en', text: 'Solute type:' }), endoBtn, exoBtn]));
    var lp = k.loop(root, tick);
    paintModes(); draw();
    lp.start();
  });

  /* ================================================================== 3. henry */
  A.register('henry', function (root, k) {
    var h = k.h, W = 480, H = 300;
    var KH = { He: { 293: 144.97 }, N2: { 293: 76.48, 303: 88.84 }, O2: { 293: 34.86, 303: 46.82 } };
    var st = { gas: 'N2', T: 293, p: 2 };
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'হেনৰিৰ সূত্ৰ: চাপ বঢ়ালে দ্ৰবীভূত গেছ বাঢ়ে' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var BX = 90, BW = 300, SURF = 180, BOT = 285;
    var gasP = [], dis = [], clock = 0;

    function kh() { return KH[st.gas][st.T]; }
    function yPiston() { return SURF - 130 / (0.4 + 0.6 * st.p); }
    function target() { return Math.min(110, Math.round(6 * (st.p / kh()) * 76.48)); }
    function gasTarget() { return Math.round(6 + 3 * st.p); }
    function tick(dt) {
      clock += dt;
      var yp = yPiston() + 10;
      while (gasP.length < gasTarget()) gasP.push({ x: rnd(BX + 8, BX + BW - 8), y: rnd(yp, SURF - 6), vx: rnd(-80, 80), vy: rnd(-80, 80) });
      while (gasP.length > gasTarget()) gasP.pop();
      gasP.forEach(function (p) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < BX + 6 || p.x > BX + BW - 6) p.vx *= -1;
        if (p.y < yp || p.y > SURF - 6) p.vy *= -1;
        p.x = clamp(p.x, BX + 6, BX + BW - 6); p.y = clamp(p.y, yp, SURF - 6);
      });
      if (clock > 0.07) {
        clock = 0;
        if (dis.length < target()) dis.push({ x: rnd(BX + 10, BX + BW - 10), y: SURF + 6, vx: rnd(-20, 20), vy: rnd(10, 40) });
        else if (dis.length > target()) dis.splice(Math.floor(Math.random() * dis.length), 1);
      }
      dis.forEach(function (p) {
        p.vx += rnd(-60, 60) * dt; p.vy += rnd(-60, 60) * dt;
        var sp = Math.hypot(p.vx, p.vy); if (sp > 35) { p.vx *= 35 / sp; p.vy *= 35 / sp; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < BX + 6 || p.x > BX + BW - 6) p.vx *= -1;
        if (p.y < SURF + 6 || p.y > BOT - 6) p.vy *= -1;
        p.x = clamp(p.x, BX + 6, BX + BW - 6); p.y = clamp(p.y, SURF + 6, BOT - 6);
      });
      draw();
    }
    function draw() {
      var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), txt = k.cssVar('--text');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = blue; ctx.globalAlpha = .14; ctx.fillRect(BX, SURF, BW, BOT - SURF); ctx.globalAlpha = 1;
      ctx.strokeStyle = mu; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(BX, 20); ctx.lineTo(BX, BOT); ctx.lineTo(BX + BW, BOT); ctx.lineTo(BX + BW, 20); ctx.stroke();
      var yp = yPiston();
      ctx.fillStyle = mu; ctx.fillRect(BX, yp, BW, 9);
      ctx.strokeStyle = txt; ctx.fillStyle = txt; ctx.lineWidth = 2;
      var len = 14 + st.p * 3;
      ctx.beginPath(); ctx.moveTo(BX + BW / 2, yp - len - 4); ctx.lineTo(BX + BW / 2, yp - 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(BX + BW / 2 - 6, yp - 9); ctx.lineTo(BX + BW / 2, yp - 1); ctx.lineTo(BX + BW / 2 + 6, yp - 9); ctx.fill();
      ctx.font = '600 14px "Noto Sans Bengali", sans-serif'; ctx.fillText('p = ' + st.p + ' bar', BX + BW / 2 + 12, yp - 10);
      ctx.fillStyle = org; gasP.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, TAU); ctx.fill(); });
      ctx.fillStyle = k.cssVar('--proton'); dis.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, TAU); ctx.fill(); });
      ctx.fillStyle = mu; ctx.font = '13px "Noto Sans Bengali", sans-serif';
      ctx.fillText('গেছ', 14, SURF - 30); ctx.fillText('দ্ৰৱ (পানী)', 14, SURF + 30);
      ctx.fillText('দ্ৰবীভূত গেছ', 14, SURF + 50);
    }
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paintInfo() {
      var K = kh(), x = st.p / (K * 1000), n = x * 55.5;
      info.innerHTML = 'K<sub>H</sub> (' + st.gas + ', ' + st.T + ' K) = <b>' + K + ' kbar</b><br>' +
        'x = p / K<sub>H</sub> = ' + st.p + ' bar / ' + (K * 1000).toFixed(0) + ' bar = <b>' + sci(x, 2) + '</b><br>' +
        '1 L পানীত (≈ 55.5 mol) দ্ৰবীভূত গেছ ≈ x × 55.5 = <b>' + (n * 1000).toFixed(2) + ' mmol</b>' +
        (target() >= 110 ? '<br><span class="en">(ছবিত বিন্দুৰ সংখ্যা সীমিত কৰা হৈছে; প্ৰকৃত মান সমানুপাতিক।)</span>' : '');
    }
    var gasSel = k.select('Gas', [{ value: 'He', label: 'He' }, { value: 'N2', label: 'N₂' }, { value: 'O2', label: 'O₂' }], st.gas, function (v) {
      st.gas = v; if (!KH[v][st.T]) { st.T = 293; paintT(); } paintT(); paintInfo();
    });
    var b293 = k.button('293 K', function () { st.T = 293; paintT(); paintInfo(); });
    var b303 = k.button('303 K', function () { if (KH[st.gas][303]) { st.T = 303; paintT(); paintInfo(); } });
    function paintT() { b293.setAttribute('aria-pressed', String(st.T === 293)); b303.setAttribute('aria-pressed', String(st.T === 303)); b303.disabled = !KH[st.gas][303]; }
    var pSl = k.slider('Pressure (bar)', 1, 10, 0.5, st.p, function (v) { st.p = v; paintInfo(); });
    root.appendChild(h('div', { 'class': 'row' }, [gasSel.el, h('span', { 'class': 'en', text: 'Temperature:' }), b293, b303, pSl.el]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paintT(); paintInfo(); lp.start();
  });

  /* ================================================================== 4 & 5. vapour pressure plots */
  function vapour(mode) {
    return function (root, k) {
      var h = k.h, W = 480, H = 300, PL = 58, PR = 16, PT = 16, PB = 46;
      var st = { x2: 0.4, p1: mode === 'dev' ? 300 : 300, p2: mode === 'dev' ? 250 : 100, A: mode === 'dev' ? 1.5 : 0 };
      var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'বাষ্পীয় চাপ আৰু ম\'ল ভগ্নাংশৰ লেখ' });
      root.appendChild(canvas);
      var ctx = k.hiDpiCanvas(canvas, W, H);

      function pp(x2, A) {
        var x1 = 1 - x2, g1 = Math.exp(A * x2 * x2), g2 = Math.exp(A * x1 * x1);
        var a = x1 * g1 * st.p1, b = x2 * g2 * st.p2; return { p1: a, p2: b, t: a + b };
      }
      function azeo() {
        var N = 200, best = null, imin = 0, imax = 0, vals = [];
        for (var i = 0; i <= N; i++) vals.push(pp(i / N, st.A).t);
        for (i = 1; i <= N; i++) { if (vals[i] < vals[imin]) imin = i; if (vals[i] > vals[imax]) imax = i; }
        var lo = Math.min(vals[0], vals[N]), hi = Math.max(vals[0], vals[N]);
        if (imax > 2 && imax < N - 2 && vals[imax] > hi * 1.005) best = { x: imax / N, type: 'max' };
        else if (imin > 2 && imin < N - 2 && vals[imin] < lo * 0.995) best = { x: imin / N, type: 'min' };
        return best;
      }
      function X(x) { return PL + x * (W - PL - PR); }
      var ymax = 500;
      function Y(p) { return H - PB - p / ymax * (H - PT - PB); }
      function draw() {
        var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), grid = k.cssVar('--grid'), blue = k.cssVar('--electron'),
          org = k.cssVar('--alpha'), teal = k.cssVar('--brand'), txt = k.cssVar('--text');
        var top = 0, i, x;
        for (i = 0; i <= 100; i++) top = Math.max(top, pp(i / 100, st.A).t, st.p1, st.p2);
        ymax = Math.ceil(top * 1.12 / 50) * 50;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.fillStyle = mu; ctx.font = '11px sans-serif';
        for (i = 0; i <= 4; i++) { var py = Y(ymax * i / 4); ctx.beginPath(); ctx.moveTo(PL, py); ctx.lineTo(W - PR, py); ctx.stroke(); ctx.fillText(Math.round(ymax * i / 4), 22, py + 4); }
        ctx.strokeStyle = mu; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, H - PB); ctx.lineTo(W - PR, H - PB); ctx.stroke();
        ctx.fillStyle = txt; ctx.font = '12px sans-serif';
        [0, 0.5, 1].forEach(function (v) { ctx.fillText(v, X(v) - 6, H - PB + 16); });
        ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
        ctx.fillText('x₂ →   (x₁ = 1 − x₂)', W / 2 - 62, H - 8);
        ctx.save(); ctx.translate(12, H / 2 + 30); ctx.rotate(-Math.PI / 2); ctx.fillText('বাষ্পীয় চাপ (mm Hg)', 0, 0); ctx.restore();
        function line(fn, color, w, dash) {
          ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath();
          for (var j = 0; j <= 100; j++) { var v = fn(j / 100); if (j === 0) ctx.moveTo(X(j / 100), Y(v)); else ctx.lineTo(X(j / 100), Y(v)); }
          ctx.stroke(); ctx.setLineDash([]);
        }
        if (st.A !== 0) {
          line(function (x) { return (1 - x) * st.p1; }, blue, 1, [4, 4]);
          line(function (x) { return x * st.p2; }, org, 1, [4, 4]);
          line(function (x) { return st.p1 + (st.p2 - st.p1) * x; }, mu, 1.5, [6, 4]);
        }
        line(function (x) { return pp(x, st.A).p1; }, blue, 2.5);
        line(function (x) { return pp(x, st.A).p2; }, org, 2.5);
        line(function (x) { return pp(x, st.A).t; }, teal, 3.5);
        var az = azeo();
        if (az) {
          ctx.strokeStyle = k.cssVar('--proton'); ctx.setLineDash([3, 4]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(X(az.x), PT); ctx.lineTo(X(az.x), H - PB); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = k.cssVar('--proton'); ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.fillText('এজিঅ\'ট্ৰ\'প', X(az.x) + 5, PT + 14);
        }
        var c = pp(st.x2, st.A);
        ctx.strokeStyle = txt; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(X(st.x2), PT); ctx.lineTo(X(st.x2), H - PB); ctx.stroke(); ctx.setLineDash([]);
        [[c.p1, blue], [c.p2, org], [c.t, teal]].forEach(function (d) { ctx.fillStyle = d[1]; ctx.beginPath(); ctx.arc(X(st.x2), Y(d[0]), 5, 0, TAU); ctx.fill(); });
        ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = blue; ctx.fillText('p₁', W - PR - 70, 28); ctx.fillStyle = org; ctx.fillText('p₂', W - PR - 50, 28); ctx.fillStyle = teal; ctx.fillText('p মুঠ', W - PR - 32 - 0, 28);
      }
      var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
      function paint() {
        var c = pp(st.x2, st.A), y1 = c.p1 / c.t, az = azeo(), extra = '';
        if (mode === 'dev') {
          var kind = st.A > 0.05 ? 'ধনাত্মক বিচ্যুতি: A–B আকৰ্ষণ দুৰ্বল, Δ<sub>mix</sub>H > 0, Δ<sub>mix</sub>V > 0'
            : (st.A < -0.05 ? 'ঋণাত্মক বিচ্যুতি: A–B আকৰ্ষণ প্ৰবল, Δ<sub>mix</sub>H < 0, Δ<sub>mix</sub>V < 0' : 'আদৰ্শ দ্ৰৱ: Δ<sub>mix</sub>H = 0, Δ<sub>mix</sub>V = 0');
          extra = kind + '<br>' + (az ? (az.type === 'max' ? '<b>ন্যূনতম উতলাংকযুক্ত এজিঅ\'ট্ৰ\'প</b> (minimum boiling) — x₂ ≈ ' : '<b>উচ্চতম উতলাংকযুক্ত এজিঅ\'ট্ৰ\'প</b> (maximum boiling) — x₂ ≈ ') + az.x.toFixed(2) + ' ত' : 'এজিঅ\'ট্ৰ\'প গঠন নহয়') + '<br>';
        }
        info.innerHTML = extra +
          'p₁ = <b>' + c.p1.toFixed(1) + '</b> · p₂ = <b>' + c.p2.toFixed(1) + '</b> · p<sub>মুঠ</sub> = <b>' + c.t.toFixed(1) + '</b> mm Hg<br>' +
          'বাষ্পীয় অৱস্থাত সংযুতি: y₁ = <b>' + y1.toFixed(3) + '</b>, y₂ = <b>' + (1 - y1).toFixed(3) + '</b>' +
          (mode === 'ideal' ? '<br>' + (st.p1 > st.p2 ? 'উপাংশ 1 বেছি উদ্বায়ী, গতিকে বাষ্পত ইয়াৰ ভগ্নাংশ (y₁) দ্ৰৱতকৈ (x₁) বেছি।' : 'উপাংশ 2 বেছি উদ্বায়ী, গতিকে বাষ্পত ইয়াৰ ভগ্নাংশ দ্ৰৱতকৈ বেছি।') : '');
        draw();
      }
      var xs = k.slider('x₂', 0, 1, 0.01, st.x2, function (v) { st.x2 = v; paint(); });
      var row = [xs.el];
      if (mode === 'ideal') {
        row.push(k.slider('p°₁ (mm Hg)', 50, 500, 10, st.p1, function (v) { st.p1 = v; paint(); }).el);
        row.push(k.slider('p°₂ (mm Hg)', 50, 500, 10, st.p2, function (v) { st.p2 = v; paint(); }).el);
        root.appendChild(h('div', { 'class': 'row' }, row));
      } else {
        var aSl = k.slider('A–B strength', -2, 2, 0.1, st.A, function (v) { st.A = v; paint(); });
        function set(v) { return function () { st.A = v; aSl.input.value = v; aSl.out.textContent = v; paint(); }; }
        root.appendChild(h('div', { 'class': 'row' }, [k.button('Ideal', set(0)), k.button('Positive deviation', set(1.5)), k.button('Negative deviation', set(-1.5)), aSl.el, xs.el]));
      }
      root.appendChild(info);
      root.appendChild(h('div', { 'class': 'legend' }, [
        h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--electron)' }), 'p₁']),
        h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--alpha)' }), 'p₂']),
        h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--brand)' }), 'p মুঠ = p₁ + p₂']),
        h('span', { text: mode === 'dev' ? 'ডেশ লাইন = ৰাউল্টৰ সূত্ৰ (আদৰ্শ)' : '' })]));
      paint();
    };
  }
  A.register('raoult', vapour('ideal'));
  A.register('deviations', vapour('dev'));

  /* ================================================================== 6. colligative */
  A.register('colligative', function (root, k) {
    var h = k.h, s = k.s;
    var SOLV = {
      Water: { Tb: 373.15, Kb: 0.52, Tf: 273.15, Kf: 1.86, M: 18 },
      Ethanol: { Tb: 351.5, Kb: 1.20, Tf: 155.7, Kf: 1.99, M: 46 },
      Benzene: { Tb: 353.3, Kb: 2.53, Tf: 278.6, Kf: 5.12, M: 78 },
      Chloroform: { Tb: 334.4, Kb: 3.63, Tf: 209.6, Kf: 4.79, M: 119.5 },
      'Acetic acid': { Tb: 391.1, Kb: 2.93, Tf: 290.0, Kf: 3.90, M: 60 }
    };
    var st = { sv: 'Water', m: 0.5, i: 1 };
    var svg = s('svg', { viewBox: '0 0 400 240', 'class': 'anim-svg', role: 'img', 'aria-label': 'উতলাংক আৰু হিমাংকৰ পৰিৱৰ্তন' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });

    function scale(lo, hi, t) { return 50 + (t - lo) / (hi - lo) * 300; }
    function lab(x, y, txt, color, bold) {
      return s('text', { x: clamp(x, 52, 348), y: y, 'font-size': 12, 'text-anchor': 'middle', style: 'fill:' + color + (bold ? ';font-weight:700' : ''), text: txt });
    }
    function line(y, lo, hi, pure, sol, label, up, color) {
      var g = s('g');
      g.appendChild(s('text', { x: 10, y: y - 52, 'font-size': 14, 'font-weight': 700, style: 'fill:var(--text)', text: label }));
      g.appendChild(s('line', { x1: 50, x2: 350, y1: y, y2: y, style: 'stroke:var(--muted)', 'stroke-width': 2 }));
      for (var i = 0; i <= 4; i++) {
        var t = lo + (hi - lo) * i / 4, x = scale(lo, hi, t);
        g.appendChild(s('line', { x1: x, x2: x, y1: y - 4, y2: y + 4, style: 'stroke:var(--muted)' }));
        g.appendChild(s('text', { x: x, y: y + 17, 'font-size': 10, 'text-anchor': 'middle', style: 'fill:var(--muted)', text: t.toFixed(1) }));
      }
      var xp = scale(lo, hi, pure), xs = scale(lo, hi, sol);
      g.appendChild(s('line', { x1: xp, x2: xp, y1: y - 30, y2: y, style: 'stroke:var(--neutron)', 'stroke-width': 3 }));
      g.appendChild(lab(xp, y - 35, 'বিশুদ্ধ ' + pure.toFixed(2), 'var(--muted)', false));
      g.appendChild(s('line', { x1: xs, x2: xs, y1: y - 20, y2: y + 6, style: 'stroke:' + color, 'stroke-width': 3 }));
      g.appendChild(lab(xs, y + 34, 'দ্ৰৱ ' + sol.toFixed(2), color, true));
      g.appendChild(s('line', { x1: xp, x2: xs, y1: y - 12, y2: y - 12, style: 'stroke:' + color, 'stroke-width': 2, 'stroke-dasharray': '3 2' }));
      return g;
    }
    function paint() {
      var p = SOLV[st.sv], dTb = st.i * p.Kb * st.m, dTf = st.i * p.Kf * st.m;
      var maxB = p.Kb * 6 * 1.05, maxF = p.Kf * 6 * 1.05;
      svg.innerHTML = '';
      svg.appendChild(line(78, p.Tb - 0.3 * p.Kb, p.Tb + maxB, p.Tb, p.Tb + dTb, 'উতলাংক (K) →', true, 'var(--alpha)'));
      svg.appendChild(line(190, p.Tf - maxF, p.Tf + 0.3 * p.Kf, p.Tf, p.Tf - dTf, 'হিমাংক (K) →', false, 'var(--electron)'));
      var n2 = st.i * st.m, n1 = 1000 / p.M, rel = n2 / (n1 + n2);
      info.innerHTML = 'ম\'লালিটি m = <b>' + st.m.toFixed(2) + '</b>, ভান্ট হফৰ গুণক i = <b>' + st.i + '</b><br>' +
        'ΔT<sub>b</sub> = i K<sub>b</sub> m = ' + st.i + ' × ' + p.Kb + ' × ' + st.m.toFixed(2) + ' = <b>' + dTb.toFixed(3) + ' K</b> → দ্ৰৱৰ উতলাংক ' + (p.Tb + dTb).toFixed(2) + ' K<br>' +
        'ΔT<sub>f</sub> = i K<sub>f</sub> m = ' + st.i + ' × ' + p.Kf + ' × ' + st.m.toFixed(2) + ' = <b>' + dTf.toFixed(3) + ' K</b> → দ্ৰৱৰ হিমাংক ' + (p.Tf - dTf).toFixed(2) + ' K<br>' +
        'বাষ্পীয় চাপৰ আপেক্ষিক অৱনমন (p°−p)/p° ≈ <b>' + rel.toFixed(4) + '</b> (= দ্ৰাৱৰ ম\'ল ভগ্নাংশ)';
    }
    var sel = k.select('Solvent', Object.keys(SOLV).map(function (n) { return { value: n, label: n }; }), st.sv, function (v) { st.sv = v; paint(); });
    var ms = k.slider('Molality m', 0, 2, 0.05, st.m, function (v) { st.m = v; paint(); });
    var isel = k.select('Solute particles per formula unit (i)', [{ value: 1, label: '1 (e.g. glucose)' }, { value: 2, label: '2 (e.g. NaCl)' }, { value: 3, label: '3 (e.g. CaCl₂)' }], 1, function (v) { st.i = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, ms.el, isel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. osmosis / reverse osmosis */
  A.register('osmosis', function (root, k) {
    var h = k.h, W = 480, H = 300;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'অৰ্ধভেদ্য আৱৰণেৰে ৰসাকৰ্ষণ আৰু উৎক্ৰমন ৰসাকৰ্ষণ' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var R = 0.083, MEM = 240, TOP = 70, BOT = 280, TANK_H = BOT - TOP, XL = 30, XR = 450;
    var st = { c: 0.3, T: 300, P: 0 }, L = 60, Rt = 60, solute = [], cross = [], acc = { lr: 0, rl: 0 }, permeate = 0;

    function pi() { return st.c * R * st.T; }
    function hydro() { return 0.25 * (Rt - L); }
    function net() { return pi() - st.P - hydro(); }
    function lvl(n) { return BOT - n * TANK_H / 130; }
    function syncSolute() {
      var want = Math.round(st.c * 60);
      while (solute.length < want) solute.push({ x: rnd(MEM + 12, XR - 12), y: rnd(lvl(Rt) + 6, BOT - 8), vx: rnd(-30, 30), vy: rnd(-30, 30) });
      while (solute.length > want) solute.pop();
    }
    function tick(dt) {
      var n = net(), base = 2.5, gain = Math.min(22, 1.4 * Math.abs(n));
      var rlr = base + (n > 0 ? gain : 0), rrl = base + (n < 0 ? gain : 0);
      acc.lr += rlr * dt; acc.rl += rrl * dt;
      while (acc.lr >= 1) { acc.lr -= 1; if (L > 6) { L--; cross.push({ dir: 1, t: 0, y: rnd(lvl(Math.min(L, Rt)) + 8, BOT - 8) }); Rt++; } }
      while (acc.rl >= 1) { acc.rl -= 1; if (Rt > 6) { Rt--; cross.push({ dir: -1, t: 0, y: rnd(lvl(Math.min(L, Rt)) + 8, BOT - 8) }); L++; } }
      if (st.P > pi()) {                         /* reverse osmosis: pure water is drawn off, feed is topped up */
        if (L > 60) { permeate += L - 60; L = 60; }
        if (Rt < 60) Rt = 60;
      }
      cross.forEach(function (c) { c.t += dt * 2.2; }); cross = cross.filter(function (c) { return c.t < 1; });
      var top = lvl(Rt);
      solute.forEach(function (p) {
        p.vx += rnd(-80, 80) * dt; p.vy += rnd(-80, 80) * dt;
        var sp = Math.hypot(p.vx, p.vy); if (sp > 40) { p.vx *= 40 / sp; p.vy *= 40 / sp; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < MEM + 10 || p.x > XR - 8) p.vx *= -1; if (p.y < top + 6 || p.y > BOT - 8) p.vy *= -1;
        p.x = clamp(p.x, MEM + 10, XR - 8); p.y = clamp(p.y, top + 6, BOT - 8);
      });
      draw(); paintInfo();
    }
    function draw() {
      var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), txt = k.cssVar('--text');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = blue; ctx.globalAlpha = .2; ctx.fillRect(XL, lvl(L), MEM - XL, BOT - lvl(L)); ctx.fillRect(MEM, lvl(Rt), XR - MEM, BOT - lvl(Rt)); ctx.globalAlpha = 1;
      ctx.strokeStyle = mu; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(XL, TOP - 20); ctx.lineTo(XL, BOT); ctx.lineTo(XR, BOT); ctx.lineTo(XR, TOP - 20); ctx.stroke();
      ctx.strokeStyle = txt; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(MEM, TOP + 20); ctx.lineTo(MEM, BOT); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = org; solute.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 5.5, 0, TAU); ctx.fill(); });
      ctx.fillStyle = blue; cross.forEach(function (c) {
        var x = c.dir > 0 ? MEM - 24 + c.t * 48 : MEM + 24 - c.t * 48; ctx.beginPath(); ctx.arc(x, c.y, 3.5, 0, TAU); ctx.fill();
      });
      /* applied pressure */
      var P = st.P;
      if (P > 0) {
        ctx.fillStyle = mu; ctx.fillRect(MEM + 6, lvl(Rt) - 10, XR - MEM - 12, 8);
        ctx.strokeStyle = txt; ctx.fillStyle = txt; ctx.lineWidth = 2;
        var ln = 10 + Math.min(40, P * 2.2), cx = (MEM + XR) / 2;
        ctx.beginPath(); ctx.moveTo(cx, lvl(Rt) - 12 - ln); ctx.lineTo(cx, lvl(Rt) - 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 6, lvl(Rt) - 20); ctx.lineTo(cx, lvl(Rt) - 11); ctx.lineTo(cx + 6, lvl(Rt) - 20); ctx.fill();
        ctx.font = '600 13px sans-serif'; ctx.fillText('P = ' + P + ' bar', cx + 10, lvl(Rt) - 22 - ln / 2);
      }
      if (st.P > pi()) { ctx.fillStyle = blue; ctx.font = '600 13px "Noto Sans Bengali", sans-serif'; ctx.fillText('বিশুদ্ধ পানী ↓ নিৰ্গমন', XL + 6, 58); }
      ctx.fillStyle = mu; ctx.font = '600 13px "Noto Sans Bengali", sans-serif';
      ctx.fillText('বিশুদ্ধ দ্ৰাৱক', XL + 6, 38); ctx.fillText('দ্ৰৱ', MEM + 8, 38); ctx.fillText('অৰ্ধভেদ্য আৱৰণ', MEM - 44, 56);
    }
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paintInfo() {
      var n = net(), txt;
      if (Math.abs(n) < 0.25) txt = '<b>সাম্য</b> — দুয়োফালে দ্ৰাৱকৰ গতি সমান';
      else if (n > 0) txt = '<b>ৰসাকৰ্ষণ (osmosis)</b> — বিশুদ্ধ দ্ৰাৱকৰ পৰা দ্ৰৱলৈ দ্ৰাৱকৰ গতি';
      else if (st.P > pi()) txt = '<b>উৎক্ৰমন ৰসাকৰ্ষণ (reverse osmosis)</b> — P > Π, গতিকে দ্ৰৱৰ পৰা বিশুদ্ধ দ্ৰাৱক ওলাই আহে (সংগৃহীত: ' + permeate + ' একক)';
      else txt = 'দ্ৰৱৰ ফালৰ স্তম্ভৰ চাপে দ্ৰাৱকক উভতাই পঠাইছে';
      info.innerHTML = 'ৰসাকৰ্ষী চাপ Π = cRT = ' + st.c.toFixed(2) + ' × 0.083 × ' + st.T + ' = <b>' + pi().toFixed(2) + ' bar</b><br>' +
        'প্ৰয়োগ কৰা চাপ P = <b>' + st.P + ' bar</b> · স্তম্ভৰ উচ্চতাৰ চাপ ≈ <b>' + Math.max(0, hydro()).toFixed(2) + ' bar</b><br>' + txt;
    }
    var cS = k.slider('Concentration c (mol/L)', 0, 1, 0.05, st.c, function (v) { st.c = v; syncSolute(); });
    var tS = k.slider('Temp (K)', 280, 330, 5, st.T, function (v) { st.T = v; });
    var pS = k.slider('Applied pressure P (bar)', 0, 30, 0.5, st.P, function (v) { st.P = v; });
    var rst = k.button('Reset levels', function () { L = 60; Rt = 60; cross = []; permeate = 0; });
    root.appendChild(h('div', { 'class': 'row' }, [cS.el, tS.el]));
    root.appendChild(h('div', { 'class': 'row' }, [pS.el, rst]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    syncSolute(); draw(); paintInfo(); lp.start();
  });

  /* ================================================================== 8. red blood cell in NaCl solutions */
  A.register('cell-osmosis', function (root, k) {
    var h = k.h, s = k.s;
    var c = 0.9, r = 50, amp = 0;
    var svg = s('svg', { viewBox: '0 0 300 220', 'class': 'anim-svg', role: 'img', 'aria-label': 'ৰক্তকোষ NaCl দ্ৰৱত ফুলে বা কুঁচ খায়' });
    var path = s('path', { style: 'fill:var(--proton);fill-opacity:.35;stroke:var(--proton)', 'stroke-width': 3 });
    var nuc = s('circle', { cx: 150, cy: 110, r: 9, style: 'fill:var(--proton);opacity:.7' });
    var arrows = s('g');
    svg.appendChild(s('rect', { x: 0, y: 0, width: 300, height: 220, style: 'fill:var(--electron);opacity:.08' }));
    svg.appendChild(path); svg.appendChild(nuc); svg.appendChild(arrows);
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var burst = false;

    function targetR() { return clamp(50 + 30 * (0.9 - c) / 0.9, 30, 78); }
    function shape() {
      var d = '', N = 72;
      for (var i = 0; i <= N; i++) {
        var th = i / N * TAU, rr = r * (1 + amp * Math.sin(th * 11)) * (burst ? 1 + 0.25 * Math.sin(th * 7 + 1) : 1);
        d += (i ? 'L' : 'M') + (150 + rr * Math.cos(th)).toFixed(1) + ' ' + (110 + rr * Math.sin(th)).toFixed(1);
      }
      path.setAttribute('d', d + 'Z');
      path.setAttribute('stroke-dasharray', burst ? '6 6' : '');
      nuc.setAttribute('r', Math.max(5, r * 0.18));
    }
    function paint() {
      burst = c <= 0.2;
      var state = c < 0.85 ? 'হাইপ\'টনিক দ্ৰৱ (hypotonic) — বাহিৰৰ গাঢ়তা কম; পানী কোষৰ ভিতৰলৈ সোমায়, কোষ ফুলি উঠে'
        : (c > 0.95 ? 'হাইপাৰটনিক দ্ৰৱ (hypertonic) — বাহিৰৰ গাঢ়তা বেছি; কোষৰ পৰা পানী ওলাই যায়, কোষ কুঁচ খায়'
          : 'সমৰসাকৰ্ষী দ্ৰৱ (isotonic) — ৰসাকৰ্ষী চাপ সমান; পানীৰ নিগ্ৰ গতি নাই');
      info.innerHTML = 'বাহিৰৰ NaCl = <b>' + c.toFixed(2) + ' % (w/V)</b> · ৰক্তকোষৰ ভিতৰৰ ৰসাকৰ্ষী চাপ 0.9 % NaCl ৰ সমান<br>' + state +
        (burst ? '<br><b style="color:var(--bad)">কোষ ফাটি যোৱাৰ আশংকা (lysis)</b>' : '');
      arrows.innerHTML = '';
      var dirIn = c < 0.85, dirOut = c > 0.95;
      if (dirIn || dirOut) {
        [[40, 40], [260, 40], [40, 180], [260, 180], [150, 20], [150, 200]].forEach(function (p) {
          var vx = 150 - p[0], vy = 110 - p[1], len = Math.hypot(vx, vy), ux = vx / len * (dirIn ? 1 : -1), uy = vy / len * (dirIn ? 1 : -1);
          var x1 = p[0] + (dirIn ? 0 : vx * 0.55), y1 = p[1] + (dirIn ? 0 : vy * 0.55);
          arrows.appendChild(s('line', { x1: x1, y1: y1, x2: x1 + ux * 28, y2: y1 + uy * 28, style: 'stroke:var(--electron)', 'stroke-width': 3 }));
          arrows.appendChild(s('circle', { cx: x1 + ux * 28, cy: y1 + uy * 28, r: 4, style: 'fill:var(--electron)' }));
        });
      }
    }
    function tick(dt) {
      var tr = burst ? 82 : targetR(), ta = c > 0.95 ? clamp((c - 0.9) * 0.09, 0, 0.09) : 0;
      r += (tr - r) * Math.min(1, dt * 3); amp += (ta - amp) * Math.min(1, dt * 3);
      shape();
    }
    var sl = k.slider('NaCl outside (% w/V)', 0, 2, 0.05, c, function (v) { c = v; paint(); });
    function preset(v) { return function () { c = v; sl.input.value = v; sl.out.textContent = v; paint(); }; }
    root.appendChild(h('div', { 'class': 'row' }, [sl.el, k.button('Pure water', preset(0.1)), k.button('Saline 0.9 %', preset(0.9)), k.button('Concentrated', preset(1.8))]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paint(); shape(); lp.start();
  });

  /* ================================================================== 9. van't Hoff factor */
  A.register('vanthoff', function (root, k) {
    var h = k.h, s = k.s;
    var DATA = {
      NaCl: { n: 2, M: 58.5, i: { 0.1: 1.87, 0.01: 1.94, 0.001: 1.97 } },
      KCl: { n: 2, M: 74.5, i: { 0.1: 1.85, 0.01: 1.94, 0.001: 1.98 } },
      MgSO4: { n: 2, M: 120.4, i: { 0.1: 1.21, 0.01: 1.53, 0.001: 1.82 } },
      K2SO4: { n: 3, M: 174.3, i: { 0.1: 2.32, 0.01: 2.70, 0.001: 2.84 } },
      Acid: { n: 0, M: 60, i: { 0.1: 0.5, 0.01: 0.5, 0.001: 0.5 } }
    };
    var st = { sub: 'NaCl', m: 0.1 };
    var svg = s('svg', { viewBox: '0 0 400 210', 'class': 'anim-svg', role: 'img', 'aria-label': 'বিয়োজন আৰু যোজনৰ ফলত দ্ৰৱত কণাৰ সংখ্যা সলনি হয়' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var units = [], t0 = 0;

    function build() {
      svg.innerHTML = ''; units = [];
      var d = DATA[st.sub], iv = d.i[st.m], assoc = d.n === 0, N = 12, kInt;
      var alpha = assoc ? 1 : (iv - 1) / (d.n - 1), nDis = Math.round(alpha * N);
      for (var u = 0; u < N; u++) {
        var cx = 50 + (u % 4) * 100, cy = 38 + Math.floor(u / 4) * 62, g = s('g'), parts = [];
        var split = u < nDis;
        if (assoc) {
          /* pair up neighbours into dimers */
          var inDimer = true;
          if (u % 2 === 0) {
            g.appendChild(s('circle', { cx: -9, cy: 0, r: 11, style: 'fill:var(--alpha)' })); g.appendChild(s('circle', { cx: 9, cy: 0, r: 11, style: 'fill:var(--alpha)' }));
            g.appendChild(s('line', { x1: -9, y1: 0, x2: 9, y2: 0, style: 'stroke:var(--text)', 'stroke-dasharray': '3 2', 'stroke-width': 2 }));
            parts = [g]; g.setAttribute('transform', 'translate(' + (cx + 50) + ',' + cy + ')');
            svg.appendChild(g); units.push({ g: g, cx: cx + 50, cy: cy, ph: u });
          }
          continue;
        }
        var sep = split ? 16 : 0;
        var cat = s('circle', { cx: -sep - 3, cy: 0, r: 8, style: 'fill:var(--electron)' });
        var an = s('circle', { cx: sep + 5, cy: 0, r: 12, style: 'fill:var(--proton)' });
        g.appendChild(an); g.appendChild(cat);
        if (d.n === 3) g.appendChild(s('circle', { cx: -sep - 17, cy: 0, r: 8, style: 'fill:var(--electron)' }));
        g.setAttribute('transform', 'translate(' + cx + ',' + cy + ')');
        svg.appendChild(g); units.push({ g: g, cx: cx, cy: cy, ph: u * 0.7 });
      }
      var m = st.m, iV = iv, normal = d.M, ab = normal / iV;
      var kf = assoc ? 5.12 : 1.86, calcDT = kf * m, obsDT = iV * calcDT;
      info.innerHTML = (assoc ? 'CH<sub>3</sub>COOH বেনজিনত <b>যোজন</b> (association) হৈ দ্বিযোগী (dimer) গঠন কৰে — কণাৰ সংখ্যা আধা হয়।<br>' :
        'বিয়োজিত অংশ α = (i − 1)/(ν − 1) = <b>' + alpha.toFixed(2) + '</b> (ν = ' + d.n + ' টা আয়ন)<br>') +
        'ভান্ট হফৰ গুণক i = <b>' + iV + '</b> (' + (m) + ' m)<br>' +
        'ΔT<sub>f</sub> (গণনা, i = 1) = ' + calcDT.toFixed(3) + ' K · ΔT<sub>f</sub> (পৰীক্ষালব্ধ) = <b>' + obsDT.toFixed(3) + ' K</b><br>' +
        'স্বাভাৱিক ম\'লাৰ ভৰ = ' + normal + ' · অস্বাভাৱিক ম\'লাৰ ভৰ = ' + normal + ' / ' + iV + ' = <b>' + ab.toFixed(1) + ' g mol<sup>−1</sup></b>' +
        (assoc ? '<br><span class="en">(অৰ্থাৎ প্ৰকৃত মানৰ প্ৰায় দুগুণ)</span>' : '<br><span class="en">(লঘু দ্ৰৱত বিয়োজন বেছি, গতিকে i ৰ মান ' + d.n + ' ৰ ওচৰ চাপে)</span>');
    }
    function tick(dt, t) {
      units.forEach(function (u) {
        var dx = Math.sin(t * 1.6 + u.ph) * 3, dy = Math.cos(t * 1.3 + u.ph * 1.7) * 3;
        u.g.setAttribute('transform', 'translate(' + (u.cx + dx).toFixed(1) + ',' + (u.cy + dy).toFixed(1) + ')');
      });
    }
    var sub = k.select('Solute', [{ value: 'NaCl', label: 'NaCl in water' }, { value: 'KCl', label: 'KCl in water' }, { value: 'MgSO4', label: 'MgSO₄ in water' }, { value: 'K2SO4', label: 'K₂SO₄ in water' }, { value: 'Acid', label: 'CH₃COOH in benzene' }], st.sub, function (v) { st.sub = v; build(); });
    var conc = k.select('Molality', [{ value: 0.1, label: '0.1 m' }, { value: 0.01, label: '0.01 m' }, { value: 0.001, label: '0.001 m' }], st.m, function (v) { st.m = +v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [sub.el, conc.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--electron)' }), 'ধনায়ন (cation)']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--proton)' }), 'ঋণায়ন (anion)']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--alpha)' }), 'অবিয়োজিত / যোজিত অণু'])]));
    var lp = k.loop(root, tick);
    build(); if (!k.reduceMotion) lp.start();
  });
})();
