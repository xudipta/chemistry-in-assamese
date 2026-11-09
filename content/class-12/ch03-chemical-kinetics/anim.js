/* Animations for Class 12, Chapter 3: Chemical Kinetics (ৰাসায়নিক গতিবিজ্ঞান).
   Registered: rate-curve, rate-stoich, order-finder, integrated, halflife, boltzmann, arrhenius, energy-profile, collision, rds
   Controls are English (app UI); read-outs are Assamese (subject content). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var TAU = Math.PI * 2, R = 8.314;

  function sci(x, d) {
    if (!x) return '0';
    var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e);
    return m.toFixed(d === undefined ? 2 : d) + ' × 10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>';
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function fmt(v) { return Math.abs(v) >= 0.01 && Math.abs(v) < 1000 ? (+v.toPrecision(3)).toString() : sci(v, 2); }

  /* draw axes + grid for a plot; returns scale functions */
  function plot(ctx, k, W, H, xmin, xmax, ymin, ymax, xlab, ylab, o) {
    o = o || {};
    var m = { l: 62, r: 16, t: 16, b: 42 }, mu = k.cssVar('--muted'), gr = k.cssVar('--grid'), bg = k.cssVar('--canvas'), tx = k.cssVar('--text');
    function X(v) { return m.l + (v - xmin) / (xmax - xmin) * (W - m.l - m.r); }
    function Y(v) { return H - m.b - (v - ymin) / (ymax - ymin) * (H - m.t - m.b); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1; ctx.strokeStyle = gr; ctx.fillStyle = mu; ctx.font = '11px sans-serif';
    for (var i = 0; i <= 4; i++) {
      var yv = ymin + (ymax - ymin) * i / 4, xv = xmin + (xmax - xmin) * i / 4;
      ctx.beginPath(); ctx.moveTo(m.l, Y(yv)); ctx.lineTo(W - m.r, Y(yv)); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(o.yf ? o.yf(yv) : fmt(yv), m.l - 6, Y(yv) + 4); ctx.textAlign = 'start';
      ctx.fillText(o.xf ? o.xf(xv) : fmt(xv), X(xv) - 12, H - m.b + 15);
    }
    ctx.strokeStyle = mu; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(m.l, m.t); ctx.lineTo(m.l, H - m.b); ctx.lineTo(W - m.r, H - m.b); ctx.stroke();
    ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
    ctx.fillText(xlab, (W + m.l) / 2 - ctx.measureText(xlab).width / 2, H - 6);
    ctx.save(); ctx.translate(12, (H - m.b) / 2 + 45); ctx.rotate(-Math.PI / 2); ctx.fillText(ylab, 0, 0); ctx.restore();
    return { X: X, Y: Y, m: m };
  }
  function curve(ctx, P, fn, x0, x1, color, w, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = w || 3; ctx.setLineDash(dash || []); ctx.beginPath();
    var started = false;
    for (var i = 0; i <= 160; i++) {
      var x = x0 + (x1 - x0) * i / 160, y = fn(x);
      if (!isFinite(y)) continue;
      if (!started) { ctx.moveTo(P.X(x), P.Y(y)); started = true; } else ctx.lineTo(P.X(x), P.Y(y));
    }
    ctx.stroke(); ctx.setLineDash([]);
  }
  function dot(ctx, x, y, color, r) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r || 5.5, 0, TAU); ctx.fill(); }
  function mkCanvas(root, k, label, W, H) {
    var c = k.h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': label });
    root.appendChild(c);
    return k.hiDpiCanvas(c, W, H);
  }

  /* ================================================================== 1. average vs instantaneous rate */
  A.register('rate-curve', function (root, k) {
    var h = k.h, W = 480, H = 300, ctx = mkCanvas(root, k, 'বিক্ৰিয়কৰ গাঢ়তা সময়ৰ লগত কমে; গড় আৰু তাৎক্ষণিক গতিবেগ', W, H);
    var st = { k: 0.06, t: 20, dt: 15 }, R0 = 1.0, TM = 60;
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function c(t) { return R0 * Math.exp(-st.k * t); }
    function draw() {
      var blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), tx = k.cssVar('--text'), mu = k.cssVar('--muted');
      var P = plot(ctx, k, W, H, 0, TM, 0, 1.05, 'সময় (s) →', 'গাঢ়তা (mol L⁻¹)');
      curve(ctx, P, c, 0, TM, blue, 3.5); curve(ctx, P, function (t) { return R0 - c(t); }, 0, TM, org, 3.5);
      /* tangent at t */
      var t2 = Math.min(TM, st.t + st.dt), slope = -st.k * c(st.t);
      ctx.strokeStyle = tx; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]); ctx.beginPath();
      ctx.moveTo(P.X(Math.max(0, st.t - 12)), P.Y(c(st.t) + slope * (Math.max(0, st.t - 12) - st.t))); ctx.lineTo(P.X(Math.min(TM, st.t + 12)), P.Y(c(st.t) + slope * (Math.min(TM, st.t + 12) - st.t))); ctx.stroke(); ctx.setLineDash([]);
      /* secant */
      ctx.strokeStyle = org; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(P.X(st.t), P.Y(c(st.t))); ctx.lineTo(P.X(t2), P.Y(c(t2))); ctx.stroke();
      ctx.strokeStyle = mu; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath();
      ctx.moveTo(P.X(st.t), P.Y(c(st.t))); ctx.lineTo(P.X(t2), P.Y(c(st.t))); ctx.lineTo(P.X(t2), P.Y(c(t2))); ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, P.X(st.t), P.Y(c(st.t)), tx, 5); dot(ctx, P.X(t2), P.Y(c(t2)), org, 5);
      ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = blue; ctx.fillText('[R] (বিক্ৰিয়ক)', P.X(2), P.Y(0.97)); ctx.fillStyle = org; ctx.fillText('[P] (বিক্ৰিয়াজাত)', P.X(32), P.Y(0.9));
    }
    function paint() {
      var t2 = st.t + st.dt, rav = (c(st.t) - c(t2)) / st.dt, rin = st.k * c(st.t);
      info.innerHTML = 'R → P (প্ৰথম ক্ৰমৰ) · [R] = [R]<sub>0</sub> e<sup>−kt</sup>, [R]<sub>0</sub> = 1.0 mol L<sup>−1</sup><br>' +
        'গড় গতিবেগ (t = ' + st.t + ' ৰ পৰা ' + t2 + ' s): r<sub>av</sub> = −Δ[R]/Δt = <b>' + sci(rav, 3) + ' mol L<sup>−1</sup> s<sup>−1</sup></b><br>' +
        'তাৎক্ষণিক গতিবেগ t = ' + st.t + ' s ত: r<sub>inst</sub> = −d[R]/dt = স্পৰ্শকৰ ঢাল = <b>' + sci(rin, 3) + ' mol L<sup>−1</sup> s<sup>−1</sup></b><br>' +
        '<span class="en">Δt যিমান সৰু কৰিবা, r<sub>av</sub> আৰু r<sub>inst</sub> সিমান ওচৰ চাপিব।</span>';
      draw();
    }
    var ks = k.slider('k (s⁻¹)', 0.01, 0.2, 0.01, st.k, function (v) { st.k = v; paint(); });
    var ts = k.slider('t (s)', 0, 40, 1, st.t, function (v) { st.t = v; paint(); });
    var ds = k.slider('Δt (s)', 1, 20, 1, st.dt, function (v) { st.dt = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [ks.el, ts.el, ds.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. stoichiometry and rate of each species */
  A.register('rate-stoich', function (root, k) {
    var h = k.h;
    var RX = [
      { n: '2HI → H₂ + I₂', sp: [['HI', -2], ['H₂', 1], ['I₂', 1]] },
      { n: '2N₂O₅ → 4NO₂ + O₂', sp: [['N₂O₅', -2], ['NO₂', 4], ['O₂', 1]] },
      { n: '5Br⁻ + BrO₃⁻ + 6H⁺ → 3Br₂ + 3H₂O', sp: [['Br⁻', -5], ['BrO₃⁻', -1], ['H⁺', -6], ['Br₂', 3], ['H₂O', 3]] }
    ];
    var cur = 1, r = 1;
    var bars = h('div', { 'class': 'levels' }), info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var rx = RX[cur], mx = 0; rx.sp.forEach(function (s) { mx = Math.max(mx, Math.abs(s[1])); });
      bars.innerHTML = '';
      rx.sp.forEach(function (s) {
        var v = s[1] * r, w = Math.abs(s[1]) / mx * 100;
        var bar = h('div', { style: 'height:22px;border-radius:6px;width:' + w + '%;background:' + (s[1] < 0 ? 'var(--electron)' : 'var(--alpha)') + ';transition:width .25s' });
        bars.appendChild(h('div', { 'class': 'lv', style: 'grid-template-columns:70px 1fr 120px' }, [
          h('div', { 'class': 'nm', style: 'text-align:left', text: s[0] }), h('div', { style: 'background:var(--surface-2);border-radius:6px' }, [bar]),
          h('div', { 'class': 'cnt', style: 'color:var(--text)', html: (s[1] < 0 ? 'নষ্ট ' : 'উৎপন্ন ') + sci(Math.abs(v), 2) })]));
      });
      var parts = rx.sp.map(function (s) {
        var a = Math.abs(s[1]), sg = s[1] < 0 ? '−' : '';
        return sg + (a > 1 ? '(1/' + a + ') ' : '') + 'Δ[' + s[0] + ']/Δt';
      });
      info.innerHTML = 'গতিবেগ r = ' + parts.join(' = ') + ' = <b>' + sci(r, 2) + ' mol L<sup>−1</sup> s<sup>−1</sup></b><br>' +
        '<span class="en">বিক্ৰিয়ক আৰু বিক্ৰিয়াজাত পদাৰ্থৰ সহগ 1 নহ\'লে প্ৰতিটো পদাৰ্থৰ গাঢ়তাৰ পৰিৱৰ্তনক সেই পদাৰ্থৰ সহগেৰে হৰণ কৰি বিক্ৰিয়াৰ গতিবেগ পোৱা যায়।</span>';
    }
    var sel = k.select('Reaction', RX.map(function (x, i) { return { value: i, label: x.n }; }), cur, function (v) { cur = +v; paint(); });
    var rs = k.slider('r × 10⁻⁵ (mol L⁻¹ s⁻¹)', 0.5, 5, 0.5, r, function (v) { r = v * 1e-5; paint(); });
    r = 1e-5; rs.input.value = 1; rs.out.textContent = 1;
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, rs.el]));
    root.appendChild(bars); root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. finding the order from initial rates */
  A.register('order-finder', function (root, k) {
    var h = k.h;
    var RX = [
      { n: '2NO + O₂ → 2NO₂', a: 'NO', b: 'O₂', x: 2, y: 1, k: 3.556 },
      { n: 'CHCl₃ + Cl₂ → CCl₄ + HCl', a: 'CHCl₃', b: 'Cl₂', x: 1, y: 0.5, k: 0.5 },
      { n: 'CH₃COOC₂H₅ + H₂O → CH₃COOH + C₂H₅OH (পানী বেছি)', a: 'এষ্টাৰ', b: 'H₂O', x: 1, y: 0, k: 0.02 }
    ];
    var cur = 0, A0 = 0.3, B0 = 0.3, rows = [], reveal = false;
    var tbl = h('div', { 'class': 'table-wrap' }), info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function rate(a, b) { var rx = RX[cur]; return rx.k * Math.pow(a, rx.x) * Math.pow(b, rx.y); }
    function paint() {
      var rx = RX[cur], live = rate(A0, B0);
      var head = '<thead><tr><th>পৰীক্ষা</th><th>[' + rx.a + '] (mol L⁻¹)</th><th>[' + rx.b + '] (mol L⁻¹)</th><th>প্ৰাৰম্ভিক গতিবেগ (mol L⁻¹ s⁻¹)</th></tr></thead>';
      var body = '<tbody>' + rows.map(function (r, i) { return '<tr><td>' + (i + 1) + '</td><td>' + r.a.toFixed(2) + '</td><td>' + r.b.toFixed(2) + '</td><td>' + sci(r.r, 3) + '</td></tr>'; }).join('') + '</tbody>';
      tbl.innerHTML = '<table>' + head + body + '</table>';
      var txt = 'এতিয়াৰ মান: [' + rx.a + '] = ' + A0.toFixed(2) + ', [' + rx.b + '] = ' + B0.toFixed(2) + ' → গতিবেগ = <b>' + sci(live, 3) + '</b> mol L<sup>−1</sup> s<sup>−1</sup><br>';
      if (rows.length >= 2) {
        var p = rows[rows.length - 2], q = rows[rows.length - 1], ratio = q.r / p.r;
        if (Math.abs(p.b - q.b) < 1e-9 && Math.abs(p.a - q.a) > 1e-9) txt += 'শেষৰ দুটা পৰীক্ষাত [' + rx.b + '] একে; [' + rx.a + '] ' + (q.a / p.a).toFixed(2) + ' গুণ হ\'লে গতিবেগ <b>' + ratio.toFixed(2) + ' গুণ</b> → ' + rx.a + ' সাপেক্ষে ক্ৰম x = log(' + ratio.toFixed(2) + ') / log(' + (q.a / p.a).toFixed(2) + ') = <b>' + (Math.log(ratio) / Math.log(q.a / p.a)).toFixed(2) + '</b><br>';
        else if (Math.abs(p.a - q.a) < 1e-9 && Math.abs(p.b - q.b) > 1e-9) txt += 'শেষৰ দুটা পৰীক্ষাত [' + rx.a + '] একে; [' + rx.b + '] ' + (q.b / p.b).toFixed(2) + ' গুণ হ\'লে গতিবেগ <b>' + ratio.toFixed(2) + ' গুণ</b> → ' + rx.b + ' সাপেক্ষে ক্ৰম y = <b>' + (Math.log(ratio) / Math.log(q.b / p.b)).toFixed(2) + '</b><br>';
        else txt += '<span class="en">ক্ৰম নিৰ্ণয়ৰ বাবে এবাৰত কেৱল এটা গাঢ়তা সলনি কৰক।</span><br>';
      }
      if (reveal) txt += '<b>গতি সূত্ৰ: গতিবেগ = k [' + rx.a + ']<sup>' + rx.x + '</sup> [' + rx.b + ']<sup>' + rx.y + '</sup></b> · সামগ্ৰিক ক্ৰম = ' + (rx.x + rx.y) + ' (k = ' + rx.k + ')';
      info.innerHTML = txt;
    }
    var sA = k.slider('[A] (mol/L)', 0.1, 1, 0.1, A0, function (v) { A0 = v; paint(); });
    var sB = k.slider('[B] (mol/L)', 0.1, 1, 0.1, B0, function (v) { B0 = v; paint(); });
    var sel = k.select('Reaction', RX.map(function (x, i) { return { value: i, label: x.n }; }), cur, function (v) { cur = +v; rows = []; reveal = false; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(h('div', { 'class': 'row' }, [sA.el, sB.el]));
    root.appendChild(h('div', { 'class': 'row' }, [
      k.button('Record experiment', function () { rows.push({ a: A0, b: B0, r: rate(A0, B0) }); if (rows.length > 6) rows.shift(); paint(); }, 'primary'),
      k.button('Clear table', function () { rows = []; paint(); }),
      k.button('Reveal rate law', function () { reveal = !reveal; paint(); })]));
    root.appendChild(tbl); root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. integrated rate laws (zero and first order) */
  A.register('integrated', function (root, k) {
    var h = k.h, W = 480, H = 300, ctx = mkCanvas(root, k, 'শূন্য আৰু প্ৰথম ক্ৰমৰ বিক্ৰিয়াৰ অনুকলিত গতি সূত্ৰৰ লেখ', W, H);
    var st = { ord: 1, k: 0.05, R0: 1, plot: 'conc' };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function conc(t) { return st.ord === 0 ? Math.max(0, st.R0 - st.k * t) : st.R0 * Math.exp(-st.k * t); }
    function tmax() { return st.ord === 0 ? st.R0 / st.k : 5 * Math.log(2) / st.k; }
    function draw() {
      var tm = tmax(), org = k.cssVar('--alpha'), teal = k.cssVar('--brand'), tx = k.cssVar('--text'), P;
      if (st.plot === 'conc') {
        P = plot(ctx, k, W, H, 0, tm, 0, st.R0 * 1.05, 'সময় t (s) →', '[R] (mol L⁻¹)');
        curve(ctx, P, conc, 0, tm, st.ord === 0 ? teal : org, 3.5);
        ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
        ctx.fillText(st.ord === 0 ? 'সৰলৰেখা: ঢাল = −k' : 'সূচকীয় হ্ৰাস', P.X(tm * 0.45), P.Y(st.R0 * 0.8));
      } else {
        var lo = Math.log(st.R0 * 0.02), hi = Math.log(st.R0) + 0.1;
        P = plot(ctx, k, W, H, 0, tm, lo, hi, 'সময় t (s) →', 'ln [R]', { yf: function (v) { return v.toFixed(1); } });
        curve(ctx, P, function (t) { var c = conc(t); return c > st.R0 * 0.02 ? Math.log(c) : NaN; }, 0, tm, st.ord === 1 ? teal : org, 3.5);
        ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
        ctx.fillText(st.ord === 1 ? 'সৰলৰেখা: ঢাল = −k' : 'সৰলৰেখা নহয়', P.X(tm * 0.45), P.Y(Math.log(st.R0) - 0.4));
      }
    }
    function paint() {
      var t12 = st.ord === 0 ? st.R0 / (2 * st.k) : Math.log(2) / st.k;
      info.innerHTML = (st.ord === 0 ?
        '<b>শূন্য ক্ৰম:</b> [R] = [R]<sub>0</sub> − kt, k = ([R]<sub>0</sub> − [R])/t · k ৰ একক mol L<sup>−1</sup> s<sup>−1</sup><br>[R] বনাম t ৰ লেখ সৰলৰেখা (ঢাল −k)<br>অৰ্ধ-জীৱন কাল t<sub>½</sub> = [R]<sub>0</sub> / 2k = <b>' + t12.toFixed(1) + ' s</b> (প্ৰাৰম্ভিক গাঢ়তাৰ সমানুপাতিক)' :
        '<b>প্ৰথম ক্ৰম:</b> ln[R] = ln[R]<sub>0</sub> − kt, k = (2.303/t) log([R]<sub>0</sub>/[R]) · k ৰ একক s<sup>−1</sup><br>ln[R] বনাম t ৰ লেখ সৰলৰেখা (ঢাল −k)<br>অৰ্ধ-জীৱন কাল t<sub>½</sub> = 0.693 / k = <b>' + t12.toFixed(1) + ' s</b> (প্ৰাৰম্ভিক গাঢ়তাৰ ওপৰত নিৰ্ভৰ নকৰে)') +
        '<br>[R]<sub>0</sub> = ' + st.R0.toFixed(1) + ' mol L<sup>−1</sup>, k = ' + st.k + (st.ord === 0 ? ' mol L<sup>−1</sup> s<sup>−1</sup>' : ' s<sup>−1</sup>');
      draw();
    }
    var b0 = k.button('Zero order', function () { st.ord = 0; st.k = 0.05; ks.input.value = 0.05; ks.out.textContent = 0.05; paintB(); paint(); });
    var b1 = k.button('First order', function () { st.ord = 1; st.k = 0.05; ks.input.value = 0.05; ks.out.textContent = 0.05; paintB(); paint(); });
    var p0 = k.button('Plot [R] vs t', function () { st.plot = 'conc'; paintB(); paint(); });
    var p1 = k.button('Plot ln[R] vs t', function () { st.plot = 'ln'; paintB(); paint(); });
    function paintB() { b0.setAttribute('aria-pressed', String(st.ord === 0)); b1.setAttribute('aria-pressed', String(st.ord === 1)); p0.setAttribute('aria-pressed', String(st.plot === 'conc')); p1.setAttribute('aria-pressed', String(st.plot === 'ln')); }
    var ks = k.slider('k', 0.01, 0.2, 0.01, st.k, function (v) { st.k = v; paint(); });
    var rs = k.slider('[R]₀ (mol/L)', 0.2, 2, 0.1, st.R0, function (v) { st.R0 = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [b0, b1])); root.appendChild(h('div', { 'class': 'row' }, [p0, p1]));
    root.appendChild(h('div', { 'class': 'row' }, [ks.el, rs.el]));
    root.appendChild(info);
    paintB(); paint();
  });

  /* ================================================================== 5. half-life: dots decay */
  A.register('halflife', function (root, k) {
    var h = k.h, W = 480, H = 260, ctx = mkCanvas(root, k, 'অৰ্ধ-জীৱন কালত বিক্ৰিয়কৰ আধা শেষ হোৱা', W, H);
    var st = { ord: 1, k: 0.1, n0: 120 }, t = 0, DOT = 0.01, order = [], marks = [], lastN = 0;
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function build() { order = []; for (var i = 0; i < st.n0; i++) order.push(i); for (i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; } t = 0; marks = []; }
    function N(tt) { return st.ord === 1 ? st.n0 * Math.exp(-st.k * tt) : Math.max(0, st.n0 - st.k / DOT * tt); }
    function tick(dt) {
      t += dt * 2;
      var n = N(t);
      [0.5, 0.25, 0.125].forEach(function (f, i) { if (marks.length === i && n <= st.n0 * f) marks.push(t); });
      if (n < 0.5 && !st.done) { /* finished */ }
      draw(n); paint(n);
    }
    function draw(n) {
      var bg = k.cssVar('--canvas'), blue = k.cssVar('--electron'), br = k.cssVar('--border'), tx = k.cssVar('--text');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var cols = 20, cw = 18, x0 = 12, y0 = 14, alive = Math.round(n);
      for (var i = 0; i < st.n0; i++) {
        var idx = order[i], cx = x0 + (idx % cols) * (cw + 4) + cw / 2, cy = y0 + Math.floor(idx / cols) * (cw + 4) + cw / 2;
        var on = i < alive;
        ctx.fillStyle = on ? blue : br; ctx.globalAlpha = on ? 1 : 0.35; ctx.beginPath(); ctx.arc(cx, cy, on ? 6.5 : 3, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      /* time bar */
      var tm = st.ord === 1 ? 5 * Math.log(2) / st.k : st.n0 * DOT / st.k, bx = 380, bw = 90;
      ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.fillText('t = ' + t.toFixed(1) + ' s', bx, 24);
    }
    function paint(n) {
      var R0 = st.n0 * DOT, t12 = st.ord === 1 ? Math.log(2) / st.k : R0 / (2 * st.k);
      var hl = '';
      if (marks.length) {
        var prev = 0, parts = [];
        marks.forEach(function (m) { parts.push((m - prev).toFixed(1) + ' s'); prev = m; });
        hl = '<br>পৰ্যবেক্ষিত অৰ্ধ-জীৱন কাল (ক্ৰমান্বয়ে): <b>' + parts.join(' → ') + '</b>';
      }
      info.innerHTML = (st.ord === 1 ?
        '<b>প্ৰথম ক্ৰম:</b> t<sub>½</sub> = 0.693/k = ' + t12.toFixed(1) + ' s — প্ৰতিটো অৰ্ধ-জীৱন কাল একে।' :
        '<b>শূন্য ক্ৰম:</b> t<sub>½</sub> = [R]<sub>0</sub>/2k = ' + t12.toFixed(1) + ' s — পৰৱৰ্তী অৰ্ধ-জীৱন কাল ক্ৰমান্বয়ে আধা আধা হয়।') +
        '<br>বৰ্তমান [R] = <b>' + (n * DOT).toFixed(3) + '</b> mol L<sup>−1</sup> (প্ৰাৰম্ভিক ' + R0.toFixed(2) + ')' + hl;
    }
    var b0 = k.button('Zero order', function () { st.ord = 0; st.k = 0.02; ks.input.value = 0.02; ks.out.textContent = 0.02; ks.input.min = 0.01; ks.input.max = 0.1; paintB(); build(); });
    var b1 = k.button('First order', function () { st.ord = 1; st.k = 0.1; ks.input.min = 0.02; ks.input.max = 0.3; ks.input.value = 0.1; ks.out.textContent = 0.1; paintB(); build(); });
    function paintB() { b0.setAttribute('aria-pressed', String(st.ord === 0)); b1.setAttribute('aria-pressed', String(st.ord === 1)); }
    var ks = k.slider('k', 0.02, 0.3, 0.01, st.k, function (v) { st.k = v; build(); });
    var ns = k.slider('Initial dots', 40, 200, 20, st.n0, function (v) { st.n0 = v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [b0, b1, k.button('Restart', build)])); root.appendChild(h('div', { 'class': 'row' }, [ks.el, ns.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [h('span', { text: 'প্ৰতিটো বিন্দু = 0.01 mol L⁻¹ বিক্ৰিয়ক' }), h('span', { text: 'গতি ২× দ্ৰুত কৰি দেখুওৱা হৈছে' })]));
    var lp = k.loop(root, tick);
    paintB(); build(); lp.start();
  });

  /* ================================================================== 6. Maxwell-Boltzmann distribution and Ea */
  A.register('boltzmann', function (root, k) {
    var h = k.h, W = 480, H = 290, ctx = mkCanvas(root, k, 'অণুৰ গতিশক্তিৰ বিতৰণ আৰু সক্ৰিয়ন শক্তিৰ ওপৰৰ অংশ', W, H);
    var st = { T: 300, Ea: 50, log: true };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function f(E, T) { var rt = R * T / 1000; return 2 * Math.sqrt(E / Math.PI) * Math.pow(rt, -1.5) * Math.exp(-E / rt); }
    function frac(Ea, T) { var rt = R * T / 1000, s = 0, n = 800, top = Ea + 40 * rt, d = (top - Ea) / n; for (var i = 0; i < n; i++) s += f(Ea + (i + .5) * d, T) * d; return s; }
    function draw() {
      var blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), pr = k.cssVar('--proton'), rt2 = R * (st.T + 10) / 1000, P, EM, E;
      if (st.log) {
        EM = Math.max(80, st.Ea * 1.4);
        var lo = Math.log10(f(EM, st.T)) - 0.5, hi = Math.max(Math.log10(f(1, st.T + 10)), -1) + 0.3;
        P = plot(ctx, k, W, H, 0, EM, lo, hi, 'গতিশক্তি E (kJ mol⁻¹) →', 'log₁₀ (বিতৰণ)', { yf: function (v) { return v.toFixed(0); } });
        curve(ctx, P, function (e) { return Math.log10(f(e, st.T)); }, 0.3, EM, blue, 3.5); curve(ctx, P, function (e) { return Math.log10(f(e, st.T + 10)); }, 0.3, EM, org, 3);
        var y1 = Math.log10(f(st.Ea, st.T)), y2 = Math.log10(f(st.Ea, st.T + 10));
        dot(ctx, P.X(st.Ea), P.Y(y1), blue, 5); dot(ctx, P.X(st.Ea), P.Y(y2), org, 5);
        ctx.strokeStyle = pr; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(P.X(st.Ea), P.Y(lo)); ctx.lineTo(P.X(st.Ea), P.m.t); ctx.stroke(); ctx.setLineDash([]);
      } else {
        EM = Math.max(st.Ea * 1.6, 14 * rt2);
        var ymax = 0; for (E = 0.2; E < EM; E += 0.2) ymax = Math.max(ymax, f(E, st.T), f(E, st.T + 10));
        P = plot(ctx, k, W, H, 0, EM, 0, ymax * 1.1, 'গতিশক্তি E (kJ mol⁻¹) →', 'অণুৰ ভগ্নাংশ', { yf: function (v) { return v.toFixed(3); } });
        [[st.T + 10, org, 0.32], [st.T, blue, 0.45]].forEach(function (c) {
          ctx.fillStyle = c[1]; ctx.globalAlpha = c[2]; ctx.beginPath(); ctx.moveTo(P.X(st.Ea), P.Y(0));
          for (var e = st.Ea; e <= EM; e += EM / 200) ctx.lineTo(P.X(e), P.Y(f(e, c[0]))); ctx.lineTo(P.X(EM), P.Y(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        });
        curve(ctx, P, function (e) { return f(e, st.T); }, 0.2, EM, blue, 3.5); curve(ctx, P, function (e) { return f(e, st.T + 10); }, 0.2, EM, org, 3);
        ctx.strokeStyle = pr; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(P.X(st.Ea), P.Y(0)); ctx.lineTo(P.X(st.Ea), P.m.t); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.fillStyle = pr; ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.fillText('E_a', P.X(st.Ea) + 4, P.m.t + 12);
      ctx.fillStyle = blue; ctx.fillText('T = ' + st.T + ' K', W - 120, 28); ctx.fillStyle = org; ctx.fillText('T + 10 = ' + (st.T + 10) + ' K', W - 120, 46);
    }
    function paint() {
      var f1 = frac(st.Ea, st.T), f2 = frac(st.Ea, st.T + 10), rt = R * st.T / 1000;
      info.innerHTML = 'E<sub>a</sub> = ' + st.Ea + ' kJ mol<sup>−1</sup> · RT = ' + rt.toFixed(2) + ' kJ mol<sup>−1</sup> (E<sub>a</sub>/RT = ' + (st.Ea / rt).toFixed(1) + ')<br>' +
        'E<sub>a</sub> বা তাতকৈ বেছি শক্তিৰ অণুৰ ভগ্নাংশ — T ত: <b>' + sci(f1, 2) + '</b> · (T+10) ত: <b>' + sci(f2, 2) + '</b><br>' +
        '10 K বঢ়ালে এই ভগ্নাংশ <b>' + (f2 / f1).toFixed(2) + ' গুণ</b> হয়। <span class="en">(সেয়ে প্ৰায়ে বিক্ৰিয়াৰ গতিবেগ প্ৰতি 10 K ত প্ৰায় দুগুণ হয়।)</span>' +
        (st.log ? '<br><span class="en">লগ স্কেলত দুয়োটা বক্ৰৰ E<sub>a</sub> ত থকা উচ্চতাৰ পাৰ্থক্যই এই অনুপাত দেখুৱায়। ৰৈখিক স্কেলত ছাঁযুক্ত অংশ চাবলৈ ‘Linear’ বাছক (E<sub>a</sub> কম কৰি চাওক)।</span>' : '');
      draw();
    }
    var vl = k.button('Log scale', function () { st.log = true; pB(); paint(); }), vn = k.button('Linear (shaded area)', function () { st.log = false; if (st.Ea > 20) { st.Ea = 10; es.input.value = 10; es.out.textContent = 10; } pB(); paint(); });
    function pB() { vl.setAttribute('aria-pressed', String(st.log)); vn.setAttribute('aria-pressed', String(!st.log)); }
    var ts = k.slider('T (K)', 280, 450, 5, st.T, function (v) { st.T = v; paint(); });
    var es = k.slider('Eₐ (kJ/mol)', 5, 120, 5, st.Ea, function (v) { st.Ea = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [vl, vn])); root.appendChild(h('div', { 'class': 'row' }, [ts.el, es.el]));
    root.appendChild(info);
    pB(); paint();
  });

  /* ================================================================== 7. Arrhenius equation */
  A.register('arrhenius', function (root, k) {
    var h = k.h, W = 480, H = 290, ctx = mkCanvas(root, k, 'আৰ্হেনিয়াছ সমীকৰণ: k বনাম T আৰু ln k বনাম 1/T', W, H);
    var st = { Ea: 60, logA: 12, T: 320, view: 'k' };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function kk(T) { return Math.pow(10, st.logA) * Math.exp(-st.Ea * 1000 / (R * T)); }
    function draw() {
      var blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), tx = k.cssVar('--text'), P;
      if (st.view === 'k') {
        P = plot(ctx, k, W, H, 280, 500, 0, kk(500) * 1.05, 'উষ্ণতা T (K) →', 'k', { yf: function (v) { return sci(v, 1).replace(/<\/?sup>/g, function (m) { return m === '<sup>' ? '^' : ''; }); } });
        curve(ctx, P, kk, 280, 500, blue, 3.5); dot(ctx, P.X(st.T), P.Y(kk(st.T)), org, 6);
      } else {
        var lo = Math.log(kk(500)) - 0.5, hi = Math.log(kk(280)) + 0.5;
        P = plot(ctx, k, W, H, 2.0, 3.6, Math.log(kk(500)) - 1, Math.log(kk(280)) + 1, '1000 / T (K⁻¹) →', 'ln k', { yf: function (v) { return v.toFixed(1); }, xf: function (v) { return v.toFixed(2); } });
        curve(ctx, P, function (x) { return Math.log(Math.pow(10, st.logA)) - st.Ea * 1000 / R * (x / 1000); }, 2.0, 3.6, blue, 3.5);
        dot(ctx, P.X(1000 / st.T), P.Y(Math.log(kk(st.T))), org, 6);
        ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.fillText('ঢাল = −E_a/R = ' + (-st.Ea * 1000 / R).toFixed(0) + ' K', P.X(2.2), P.m.t + 14);
      }
    }
    function paint() {
      var k1 = kk(st.T), k2 = kk(st.T + 10), EaCalc = R * Math.log(k2 / k1) / (1 / st.T - 1 / (st.T + 10)) / 1000;
      info.innerHTML = 'k = A e<sup>−E<sub>a</sub>/RT</sup> · ln k = −E<sub>a</sub>/RT + ln A<br>T = ' + st.T + ' K ত k = <b>' + sci(k1, 2) + '</b>, (T+10) = ' + (st.T + 10) + ' K ত k = <b>' + sci(k2, 2) + '</b> → অনুপাত <b>' + (k2 / k1).toFixed(2) + '</b><br>' +
        'দুই উষ্ণতাৰ k ৰ পৰা গণনা: log(k<sub>2</sub>/k<sub>1</sub>) = (E<sub>a</sub>/2.303R)·(T<sub>2</sub>−T<sub>1</sub>)/(T<sub>1</sub>T<sub>2</sub>) ⇒ E<sub>a</sub> = <b>' + EaCalc.toFixed(1) + ' kJ mol<sup>−1</sup></b> ✔';
      draw();
    }
    var vk = k.button('Plot k vs T', function () { st.view = 'k'; pB(); paint(); }), vl = k.button('Plot ln k vs 1/T', function () { st.view = 'ln'; pB(); paint(); });
    function pB() { vk.setAttribute('aria-pressed', String(st.view === 'k')); vl.setAttribute('aria-pressed', String(st.view === 'ln')); }
    var es = k.slider('Eₐ (kJ/mol)', 20, 150, 5, st.Ea, function (v) { st.Ea = v; paint(); });
    var as = k.slider('log₁₀ A', 8, 14, 0.5, st.logA, function (v) { st.logA = v; paint(); });
    var ts = k.slider('T (K)', 290, 480, 5, st.T, function (v) { st.T = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [vk, vl])); root.appendChild(h('div', { 'class': 'row' }, [es.el, as.el, ts.el]));
    root.appendChild(info);
    pB(); paint();
  });

  /* ================================================================== 8. energy profile and catalyst */
  A.register('energy-profile', function (root, k) {
    var h = k.h, W = 480, H = 290, ctx = mkCanvas(root, k, 'বিক্ৰিয়াৰ শক্তি প্ৰোফাইল আৰু অনুঘটকৰ প্ৰভাৱ', W, H);
    var st = { Ea: 80, dH: -40, cat: true, drop: 30, T: 300 }, ball = 0;
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var AMP = {};
    function sm(x) { return x * x * (3 - 2 * x); }
    function bump(x) { return Math.exp(-Math.pow((x - 0.42) / 0.16, 2)); }
    function amp(Ea, dH) {                       /* choose the bump height so the curve's maximum is exactly Ea above the reactants */
      var key = Ea + '|' + dH; if (AMP[key] !== undefined) return AMP[key];
      var lo = 0, hi = 600, i, j;
      for (i = 0; i < 40; i++) {
        var mid = (lo + hi) / 2, mx = -1e9;
        for (j = 0; j <= 200; j++) { var x = j / 200; mx = Math.max(mx, dH * sm(x) + mid * bump(x)); }
        if (mx < Ea) lo = mid; else hi = mid;
      }
      return (AMP[key] = (lo + hi) / 2);
    }
    function prof(x, Ea, dH) { return dH * sm(x) + amp(Ea, dH) * bump(x); }
    function eac() { return Math.max(5, st.Ea - st.drop); }
    function draw() {
      var blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), tx = k.cssVar('--text'), pr = k.cssVar('--proton'), mu = k.cssVar('--muted');
      var ymin = -Math.ceil((-Math.min(st.dH, 0) + 5) / 20) * 20, ymax = ymin + Math.ceil((150 - ymin) / 40) * 40;
      var P = plot(ctx, k, W, H, 0, 1, ymin, ymax, 'বিক্ৰিয়া স্থানাংক →', 'স্থিতি শক্তি (kJ mol⁻¹)', { xf: function () { return ''; }, yf: function (v) { return v.toFixed(0); } });
      curve(ctx, P, function (x) { return prof(x, st.Ea, st.dH); }, 0, 1, blue, 3.5);
      if (st.cat) curve(ctx, P, function (x) { return prof(x, eac(), st.dH); }, 0, 1, org, 3.5, [7, 4]);
      ctx.strokeStyle = mu; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(0)); ctx.lineTo(P.X(1), P.Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(P.X(0.65), P.Y(st.dH)); ctx.lineTo(P.X(1), P.Y(st.dH)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
      ctx.fillText('বিক্ৰিয়ক', P.X(0.02), P.Y(0) - 8); ctx.fillText('বিক্ৰিয়াজাত', P.X(0.8), P.Y(st.dH) - 8);
      ctx.fillStyle = blue; ctx.fillText('E_a = ' + st.Ea, P.X(0.52), P.Y(st.Ea) + 4);
      if (st.cat) { ctx.fillStyle = org; ctx.fillText('E_a (অনুঘটক) = ' + eac(), P.X(0.52), P.Y(eac()) + 16); }
      ctx.fillStyle = pr; ctx.fillText('ΔH = ' + st.dH, P.X(0.8), P.Y(st.dH / 2) + 4);
      var fn = st.cat ? eac() : st.Ea, x = ball; dot(ctx, P.X(x), P.Y(prof(x, fn, st.dH)), tx, 6);
    }
    function paint() {
      var rt = R * st.T / 1000, ratio = Math.exp(st.drop / rt);
      info.innerHTML = 'অগ্ৰগামী বিক্ৰিয়াৰ E<sub>a</sub> = <b>' + st.Ea + '</b> kJ mol<sup>−1</sup> · ΔH = <b>' + st.dH + '</b> kJ mol<sup>−1</sup> (' + (st.dH < 0 ? 'তাপবৰ্জী' : 'তাপগ্ৰাহী') + ') · পশ্চাদগামী বিক্ৰিয়াৰ E<sub>a</sub> = ' + (st.Ea - st.dH) + ' kJ mol<sup>−1</sup>' +
        (st.cat ? '<br>অনুঘটক সহ: E<sub>a</sub> = <b>' + eac() + '</b> kJ mol<sup>−1</sup> → ' + st.T + ' K ত গতি ধ্ৰুৱক প্ৰায় <b>' + sci(ratio, 1) + ' গুণ</b> বাঢ়ে (e<sup>ΔE<sub>a</sub>/RT</sup>)<br>দুয়োটা বক্ৰতে ΔH একে — অনুঘটকে ΔH বা ΔG সলনি নকৰে আৰু সাম্য ধ্ৰুৱক সলনি নকৰে।' : '<br>অনুঘটক নাই।');
    }
    function tick(dt) { ball = (ball + dt * 0.22) % 1; draw(); }
    var es = k.slider('Eₐ (kJ/mol)', 40, 130, 5, st.Ea, function (v) { st.Ea = v; paint(); });
    var hs = k.slider('ΔH (kJ/mol)', -80, 60, 5, st.dH, function (v) { st.dH = v; paint(); });
    var ds = k.slider('Catalyst lowers Eₐ by', 5, 60, 5, st.drop, function (v) { st.drop = v; paint(); });
    var cb = k.button('Catalyst on/off', function () { st.cat = !st.cat; cb.setAttribute('aria-pressed', String(st.cat)); paint(); });
    cb.setAttribute('aria-pressed', 'true');
    root.appendChild(h('div', { 'class': 'row' }, [es.el, hs.el])); root.appendChild(h('div', { 'class': 'row' }, [cb, ds.el]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paint(); draw(); if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 9. collision theory */
  A.register('collision', function (root, k) {
    var h = k.h, W = 480, H = 290, ctx = mkCanvas(root, k, 'সংঘৰ্ষ তত্ত্ব: অণুৰ সংঘৰ্ষ, সক্ৰিয়ন শক্তি আৰু দিকবিন্যাস', W, H);
    var st = { T: 300, Ea: 5, P: 0.5, run: true }, parts = [], cnt, S0 = 55, RAD = 7;
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function reset() {
      parts = []; cnt = { tot: 0, en: 0, eff: 0 };
      for (var i = 0; i < 40; i++) parts.push({ t: i < 20 ? 'A' : 'B', x: rnd(15, W - 15), y: rnd(15, H - 15), vx: gauss() * S0, vy: gauss() * S0, flash: 0, alive: true });
    }
    function gauss() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
    function energy(vr2) { return 0.008314 * 300 * vr2 / (4 * S0 * S0); }
    var scale = 1;
    function setT(T) { var f = Math.sqrt(T / st.T); parts.forEach(function (p) { p.vx *= f; p.vy *= f; }); st.T = T; }
    function tick(dt) {
      dt = Math.min(dt, 0.03) * 2;
      parts.forEach(function (p) {
        p.x += p.vx * dt; p.y += p.vy * dt; if (p.flash > 0) p.flash -= dt;
        if (p.x < RAD || p.x > W - RAD) { p.vx *= -1; p.x = clamp(p.x, RAD, W - RAD); }
        if (p.y < RAD || p.y > H - RAD) { p.vy *= -1; p.y = clamp(p.y, RAD, H - RAD); }
      });
      for (var i = 0; i < parts.length; i++) for (var j = i + 1; j < parts.length; j++) {
        var a = parts[i], b = parts[j];
        if (!a.alive || !b.alive || a.t === 'P' || b.t === 'P' || a.t === b.t) continue;
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (d < 2 * RAD && d > 0) {
          var nx = dx / d, ny = dy / d, rvx = a.vx - b.vx, rvy = a.vy - b.vy, vn = rvx * nx + rvy * ny;
          if (vn <= 0) continue;
          var E = energy(Math.pow(rvx, 2) + Math.pow(rvy, 2));
          cnt.tot++; a.flash = b.flash = 0.2;
          if (E >= st.Ea) {
            cnt.en++;
            if (Math.random() < st.P) { cnt.eff++; a.t = 'P'; a.flash = 0.6; b.alive = false; a.vx = (a.vx + b.vx) / 2; a.vy = (a.vy + b.vy) / 2; continue; }
          }
          a.vx -= vn * nx; a.vy -= vn * ny; b.vx += vn * nx; b.vy += vn * ny;
          var ov = 2 * RAD - d; a.x -= nx * ov / 2; a.y -= ny * ov / 2; b.x += nx * ov / 2; b.y += ny * ov / 2;
        }
      }
      draw(); paint();
    }
    function draw() {
      var bg = k.cssVar('--canvas'), blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), ok = k.cssVar('--ok'), br = k.cssVar('--border');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      parts.forEach(function (p) {
        if (!p.alive) return;
        ctx.fillStyle = p.t === 'A' ? blue : (p.t === 'B' ? org : ok);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.t === 'P' ? RAD * 1.35 : RAD, 0, TAU); ctx.fill();
        if (p.flash > 0) { ctx.strokeStyle = k.cssVar('--proton'); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, RAD + 5, 0, TAU); ctx.stroke(); }
      });
    }
    function paint() {
      var nA = parts.filter(function (p) { return p.alive && p.t === 'A'; }).length, nP = parts.filter(function (p) { return p.t === 'P'; }).length;
      var theory = Math.exp(-st.Ea / (0.008314 * st.T));
      info.innerHTML = 'মুঠ সংঘৰ্ষ: <b>' + cnt.tot + '</b> · শক্তি ≥ E<sub>a</sub> থকা সংঘৰ্ষ: <b>' + cnt.en + '</b> (' + (cnt.tot ? (100 * cnt.en / cnt.tot).toFixed(0) : 0) + '%) · কাৰ্যকৰী সংঘৰ্ষ (শক্তি আৰু উপযুক্ত দিকবিন্যাস): <b>' + cnt.eff + '</b><br>' +
        'E<sub>a</sub> ৰ ওপৰৰ শক্তিৰ অণুৰ ভগ্নাংশ e<sup>−E<sub>a</sub>/RT</sup> = ' + (100 * theory).toFixed(0) + '% (দ্ৰুত অণুৱে বেছি সংঘৰ্ষ কৰে, সেয়ে সংঘৰ্ষৰ মাজত এই ভগ্নাংশ কিছু বেছি) · স্টেৰিক গুণাংক P = ' + st.P + ' · বিক্ৰিয়াৰ গতিবেগ = P · Z<sub>AB</sub> · e<sup>−E<sub>a</sub>/RT</sup><br>' +
        'বিক্ৰিয়াজাত (সেউজীয়া): ' + nP + ' · বাকী A: ' + nA;
    }
    var ts = k.slider('T (K)', 250, 500, 10, st.T, function (v) { setT(v); });
    var es = k.slider('Eₐ (kJ/mol)', 0, 15, 1, st.Ea, function (v) { st.Ea = v; });
    var ps = k.slider('P (orientation)', 0.1, 1, 0.1, st.P, function (v) { st.P = v; });
    root.appendChild(h('div', { 'class': 'row' }, [ts.el, es.el])); root.appendChild(h('div', { 'class': 'row' }, [ps.el, k.button('Restart', reset)]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--electron)' }), 'A']), h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--alpha)' }), 'B']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--ok)' }), 'বিক্ৰিয়াজাত AB']), h('span', { text: 'ৰঙা ৰিং = সংঘৰ্ষ' })]));
    var lp = k.loop(root, tick);
    reset(); draw(); paint(); if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 10. rate-determining step */
  A.register('rds', function (root, k) {
    var h = k.h, W = 480, H = 280, ctx = mkCanvas(root, k, 'দুটা খাপৰ বিক্ৰিয়াত মন্থৰতম খাপে গতি নিৰ্ণয় কৰে', W, H);
    var st = { k1: 0.1, k2: 2 };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function conc(t) {
      var k1 = st.k1, k2 = Math.abs(st.k1 - st.k2) < 1e-6 ? st.k2 + 1e-4 : st.k2;
      var a = Math.exp(-k1 * t), i = k1 / (k2 - k1) * (Math.exp(-k1 * t) - Math.exp(-k2 * t));
      return { a: a, i: i, p: Math.max(0, 1 - a - i) };
    }
    function tm() { return 5 / Math.min(st.k1, st.k2); }
    function draw() {
      var blue = k.cssVar('--electron'), org = k.cssVar('--alpha'), ok = k.cssVar('--ok');
      var P = plot(ctx, k, W, H, 0, tm(), 0, 1.05, 'সময় (s) →', 'আপেক্ষিক গাঢ়তা');
      curve(ctx, P, function (t) { return conc(t).a; }, 0, tm(), blue, 3.2); curve(ctx, P, function (t) { return conc(t).i; }, 0, tm(), org, 3.2); curve(ctx, P, function (t) { return conc(t).p; }, 0, tm(), ok, 3.2);
      ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = blue; ctx.fillText('A (বিক্ৰিয়ক)', W - 130, 28); ctx.fillStyle = org; ctx.fillText('I (মধ্যৱৰ্তী)', W - 130, 46); ctx.fillStyle = ok; ctx.fillText('P (বিক্ৰিয়াজাত)', W - 130, 64);
    }
    function paint() {
      var slow = st.k1 < st.k2 ? 1 : (st.k2 < st.k1 ? 2 : 0), imax = 0, t90 = null, t;
      for (t = 0; t < tm() * 2; t += tm() / 400) { var c = conc(t); imax = Math.max(imax, c.i); if (t90 === null && c.p >= 0.9) t90 = t; }
      info.innerHTML = 'A →<sup>k₁</sup> I →<sup>k₂</sup> P &nbsp; (যেনে H<sub>2</sub>O<sub>2</sub> + I<sup>−</sup> → H<sub>2</sub>O + IO<sup>−</sup> ; H<sub>2</sub>O<sub>2</sub> + IO<sup>−</sup> → H<sub>2</sub>O + O<sub>2</sub> + I<sup>−</sup>)<br>' +
        'k<sub>1</sub> = ' + st.k1 + ' · k<sub>2</sub> = ' + st.k2 + ' — ' + (slow === 1 ? '<b>প্ৰথম খাপ মন্থৰ: ই গতি নিৰ্ধাৰক খাপ</b>; মধ্যৱৰ্তী I সৃষ্টি হোৱাৰ লগে লগে শেষ হয় (I ৰ সৰ্বোচ্চ গাঢ়তা মাত্ৰ ' + imax.toFixed(2) + ')' : (slow === 2 ? '<b>দ্বিতীয় খাপ মন্থৰ: ই গতি নিৰ্ধাৰক খাপ</b>; মধ্যৱৰ্তী I জমা হয় (সৰ্বোচ্চ ' + imax.toFixed(2) + ')' : 'দুয়োটা খাপ সমান গতিৰ')) +
        '<br>90% বিক্ৰিয়াজাত পাবলৈ সময় ≈ <b>' + (t90 ? t90.toFixed(1) : '—') + ' s</b><span class="en"> — মন্থৰ খাপ দ্ৰুত কৰিলে মুঠ বিক্ৰিয়া দ্ৰুত হয়; দ্ৰুত খাপ আৰু দ্ৰুত কৰিলে প্ৰায় কোনো প্ৰভাৱ নপৰে।</span>';
      draw();
    }
    var k1 = k.slider('k₁', 0.05, 2, 0.05, st.k1, function (v) { st.k1 = v; paint(); });
    var k2 = k.slider('k₂', 0.05, 2, 0.05, st.k2, function (v) { st.k2 = v; paint(); });
    function preset(a, b) { return function () { st.k1 = a; st.k2 = b; k1.input.value = a; k1.out.textContent = a; k2.input.value = b; k2.out.textContent = b; paint(); }; }
    root.appendChild(h('div', { 'class': 'row' }, [k.button('Step 1 slow', preset(0.1, 2)), k.button('Step 2 slow', preset(2, 0.1)), k.button('Equal', preset(0.5, 0.5))]));
    root.appendChild(h('div', { 'class': 'row' }, [k1.el, k2.el]));
    root.appendChild(info);
    paint();
  });
})();
