/* Animations for Class 11, Chapter 2: Structure of Atom (পৰমাণুৰ গঠন).
   Registered: atom-builder, rutherford, em-spectrum, photoelectric, bohr, de-broglie, uncertainty,
               quantum-explorer, orbitals, nodes, nl-rule, aufbau
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var EL = window.ChemElements;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺' };
  function sciStr(x, d) {
    if (x === 0) return '0';
    var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), m = x / Math.pow(10, e);
    if (+m.toFixed(d) >= 10) { m /= 10; e += 1; }
    return m.toFixed(d) + ' × 10' + String(e).split('').map(function (c) { return SUP[c] || c; }).join('');
  }
  function wavelengthColor(nm) {
    var r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else if (nm <= 750) { r = 1; }
    else return null;
    return 'rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')';
  }
  var H = 6.626e-34, C = 3.0e8, EV = 1.602e-19;

  /* ------------------------------------------------------------------ 1. atom-builder */
  A.register('atom-builder', function (root, k) {
    var h = k.h, s = k.s;
    var state = { p: 6, n: 6, e: 6 };
    var LIMIT = { p: [1, 20], n: [0, 24], e: [0, 20] };
    var CAPS = [2, 8, 8, 8];
    var SHELL_R = [52, 80, 108, 136];

    var svg = s('svg', { viewBox: '0 0 300 300', 'class': 'anim-svg', role: 'img', 'aria-label': L("পৰমাণুৰ মডেল: নিউক্লিয়াছ আৰু ইলেক্ট্ৰন", 'Model of an atom: nucleus and electrons') });
    var shellG = s('g'), nucG = s('g'), eG = s('g');
    svg.appendChild(shellG); svg.appendChild(nucG); svg.appendChild(eG);
    root.appendChild(svg);

    var readout = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var electrons = [];

    function shellCounts(e) {
      var out = [], left = e;
      CAPS.forEach(function (c) { var t = Math.min(c, left); out.push(t); left -= t; });
      return out;
    }

    function build() {
      shellG.innerHTML = ''; nucG.innerHTML = ''; eG.innerHTML = '';
      electrons = [];
      var counts = shellCounts(state.e);
      counts.forEach(function (n, i) {
        if (n > 0) shellG.appendChild(s('circle', { cx: 150, cy: 150, r: SHELL_R[i], fill: 'none', stroke: 'var(--border)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }));
        for (var j = 0; j < n; j++) {
          var c = s('circle', { r: 5.5, style: 'fill:var(--electron)' });
          eG.appendChild(c);
          electrons.push({ node: c, shell: i, phase: (j / n) * Math.PI * 2 + i });
        }
      });
      var total = state.p + state.n;
      var rr = Math.min(8, 38 / (1.9 * Math.sqrt(Math.max(total, 1)) + 1));
      var pLeft = state.p, nLeft = state.n;
      for (var i = 0; i < total; i++) {
        var isP = pLeft > 0 && (nLeft === 0 || (state.p - pLeft) <= (state.p / total) * i);
        if (isP) pLeft--; else nLeft--;
        var d = rr * 1.9 * Math.sqrt(i + 0.5), a = i * 2.39996;
        nucG.appendChild(s('circle', { cx: 150 + d * Math.cos(a), cy: 150 + d * Math.sin(a), r: rr, style: 'fill:' + (isP ? 'var(--proton)' : 'var(--neutron)') + ';stroke:var(--canvas);stroke-width:.8' }));
      }
      paintReadout();
      tick(0, 0);
    }

    function tick(dt) {
      electrons.forEach(function (el) {
        var speed = 1.6 / (1 + el.shell * 0.55);
        if (!k.reduceMotion) el.phase += speed * dt;
        var r = SHELL_R[el.shell];
        el.node.setAttribute('cx', 150 + r * Math.cos(el.phase));
        el.node.setAttribute('cy', 150 + r * Math.sin(el.phase));
      });
    }

    function paintReadout() {
      var z = state.p, a = state.p + state.n, q = state.p - state.e, el = EL[z];
      var kind = q === 0 ? L('নিৰপেক্ষ পৰমাণু', 'neutral atom') : (q > 0 ? L('ধনাত্মক আয়ন (cation), আধান +' + q, 'positive ion (cation), charge +' + q) : L('ঋণাত্মক আয়ন (anion), আধান −' + (-q), 'negative ion (anion), charge −' + (-q)));
      var iso = a === el.A ? '' : ' · ' + L('ইয়াৰ <b>সমস্থানিক (isotope)</b> — সাধাৰণ ' + el.sym + ' ত A = ' + el.A, 'an <b>isotope</b> — ordinary ' + el.sym + ' has A = ' + el.A);
      readout.innerHTML =
        '<span class="nuc"><span class="ss"><span>' + a + '</span><span>' + z + '</span></span><span class="sym-big">' + el.sym + (q ? '<sup>' + (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−') + '</sup>' : '') + '</span></span> ' +
        '<b>' + L(el.as, el.en) + '</b>' + L(' <span class="en">(' + el.en + ')</span>', '') + '<br>' +
        L("প্ৰ'টন = " + state.p + ' · নিউট্ৰন = ' + state.n + ' · ইলেক্ট্ৰন = ' + state.e, 'protons = ' + state.p + ' · neutrons = ' + state.n + ' · electrons = ' + state.e) + '<br>' +
        'Z = ' + z + ' · A = ' + a + ' · ' + kind + iso;
    }

    function counter(label, key, colorVar) {
      var val = h('output', { text: String(state[key]), style: 'min-width:2ch;text-align:center;font-weight:800' });
      function set(v) {
        v = Math.max(LIMIT[key][0], Math.min(LIMIT[key][1], v));
        if (v === state[key]) return;
        state[key] = v; val.textContent = v; build();
      }
      var node = h('div', { 'class': 'ctl' }, [
        h('span', { 'class': 'dot', style: 'background:var(' + colorVar + ')' }), h('span', { text: label }),
        k.button('−', function () { set(state[key] - 1); }), val, k.button('+', function () { set(state[key] + 1); })
      ]);
      node.set = set; node.val = val;
      return node;
    }
    var cP = counter(L("প্ৰ'টন", 'Protons'), 'p', '--proton'), cN = counter(L('নিউট্ৰন', 'Neutrons'), 'n', '--neutron'), cE = counter(L('ইলেক্ট্ৰন', 'Electrons'), 'e', '--electron');

    function preset(label, p, n, e) {
      return k.button(label, function () {
        state.p = p; state.n = n; state.e = e;
        cP.val.textContent = p; cN.val.textContent = n; cE.val.textContent = e; build();
      });
    }
    var controls = h('div', { 'class': 'row' }, [cP, cN, cE]);
    var presets = h('div', { 'class': 'row' }, [h('span', { 'class': 'en', text: 'Examples:' }),
      preset('H', 1, 0, 1), preset('¹²C', 6, 6, 6), preset('¹⁴C', 6, 8, 6), preset('O', 8, 8, 8), preset('Na⁺', 11, 12, 10), preset('Cl⁻', 17, 18, 18)]);
    root.appendChild(controls); root.appendChild(presets); root.appendChild(readout);

    var lp = k.loop(root, tick);
    build();
    if (!k.reduceMotion) lp.start();
  });

  /* ------------------------------------------------------------------ 2. rutherford */
  A.register('rutherford', function (root, k) {
    var h = k.h;
    var W = 480, HT = 300;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': L('α-কণাৰ বিক্ষেপণ: নিউক্লিয়াছৰ ওচৰেৰে যোৱা কণাবোৰ বেঁকা হয়', 'α-particle scattering: particles passing near the nucleus are deflected') });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, HT);

    var NUC = { x: 335, y: 150 };
    var V0 = 200;
    var D0 = 12;
    var K = 0.5 * V0 * V0 * D0;
    var parts = [];
    var stats = { straight: 0, bent: 0, back: 0 };
    var rate = 6, acc = 0;

    function spawn(b) { parts.push({ x: -10, y: NUC.y + b, vx: V0, vy: 0, trail: [], t: 0 }); }
    function randomB() { return (Math.random() * 2 - 1) * 135; }

    function step(p, dt) {
      var dx = p.x - NUC.x, dy = p.y - NUC.y;
      var r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
      var a = K / (r2 * Math.max(r, 1));
      p.vx += a * dx * dt; p.vy += a * dy * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    function classify(p) {
      var ang = Math.abs(Math.atan2(p.vy, p.vx)) * 180 / Math.PI;
      if (ang < 10) stats.straight++; else if (ang < 90) stats.bent++; else stats.back++;
      paintStats();
    }
    function tick(dt) {
      acc += rate * dt;
      while (acc >= 1) { spawn(randomB()); acc -= 1; }
      var SUB = 20, sdt = dt / SUB;
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        for (var s2 = 0; s2 < SUB; s2++) step(p, sdt);
        p.t += dt;
        if (p.t > 0.016) { p.trail.push(p.x, p.y); if (p.trail.length > 120) p.trail.splice(0, 2); p.t = 0; }
        if (p.x > W + 20 || p.x < -30 || p.y < -30 || p.y > HT + 30) { classify(p); parts.splice(i, 1); }
      }
      draw();
    }
    function draw() {
      var bg = k.cssVar('--canvas'), alpha = k.cssVar('--alpha'), pos = k.cssVar('--proton'), grid = k.cssVar('--grid'), tx = k.cssVar('--muted');
      ctx.clearRect(0, 0, W, HT);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, HT);
      ctx.strokeStyle = grid; ctx.lineWidth = 1;
      [28, 56, 96].forEach(function (r) { ctx.beginPath(); ctx.arc(NUC.x, NUC.y, r, 0, 6.2832); ctx.stroke(); });
      ctx.fillStyle = tx; ctx.font = '600 15px "Noto Sans Bengali", sans-serif';
      ctx.fillText(L('α-কণাৰ বিম →', 'α-particle beam →'), 10, 24);
      ctx.textAlign = 'center'; ctx.fillText(L('নিউক্লিয়াছ (+)', 'nucleus (+)'), NUC.x, NUC.y + 42); ctx.textAlign = 'start';
      parts.forEach(function (p) {
        ctx.strokeStyle = alpha; ctx.globalAlpha = .35; ctx.lineWidth = 2;
        ctx.beginPath();
        for (var i = 0; i < p.trail.length; i += 2) { if (i === 0) ctx.moveTo(p.trail[i], p.trail[i + 1]); else ctx.lineTo(p.trail[i], p.trail[i + 1]); }
        ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 6.2832); ctx.fill();
      });
      ctx.fillStyle = pos; ctx.beginPath(); ctx.arc(NUC.x, NUC.y, 10, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('+', NUC.x, NUC.y + 5); ctx.textAlign = 'start';
    }

    var statEls = {};
    function stat(key, label) { var b = h('b', { text: '0' }); statEls[key] = b; return h('div', { 'class': 'stat' }, [b, label]); }
    function paintStats() { statEls.straight.textContent = stats.straight; statEls.bent.textContent = stats.bent; statEls.back.textContent = stats.back; }

    var lp = k.loop(root, tick);
    var playBtn = k.button('⏸ Pause', function () {
      if (lp.running) { lp.stop(); playBtn.textContent = '▶ Play'; } else { lp.start(); playBtn.textContent = '⏸ Pause'; }
    });
    var rateCtl = k.slider('Particles/sec', 1, 20, 1, rate, function (v) { rate = v; });
    var closeBtn = k.button('Fire close-up particles', function () {
      [3, 10, 25].forEach(function (b, i) { setTimeout(function () { spawn(-b); }, i * 450); });
      if (!lp.running) { lp.start(); playBtn.textContent = '⏸ Pause'; }
    });
    var resetBtn = k.button('Clear counts', function () { stats.straight = stats.bent = stats.back = 0; parts.length = 0; paintStats(); draw(); });

    root.appendChild(h('div', { 'class': 'row' }, [playBtn, rateCtl.el, closeBtn, resetBtn]));
    root.appendChild(h('div', { 'class': 'stat-row' }, [stat('straight', L("সোজাই পাৰ হ'ল (< 10°)", 'passed straight (< 10°)')), stat('bent', L("বেঁকা হ'ল (10°–90°)", 'deflected (10°–90°)')), stat('back', L('উভতি আহিল (> 90°)', 'rebounded (> 90°)'))]));
    draw();
    if (k.reduceMotion) { playBtn.textContent = '▶ Play'; } else { lp.start(); }
  });

  /* ------------------------------------------------------------------ 3. em-spectrum */
  A.register('em-spectrum', function (root, k) {
    var h = k.h, s = k.s;
    var BANDS = [   /* [upper limit of wavelength in nm, name, fill] */
      [0.01, L('γ-ৰশ্মি', 'γ-rays'), '#9c36b5'], [15, L('এক্স-ৰশ্মি', 'X-rays'), '#5f3dc4'], [400, L('অতিবেঙুনীয়া', 'Ultraviolet'), '#4263eb'],
      [750, L('দৃশ্যমান', 'Visible'), null], [6e5, L('অৱলোহিত', 'Infrared'), '#e8590c'], [3e9, L("মাইক্ৰ'ৱেভ", 'Microwave'), '#c92a2a'], [1e12, L("ৰেডিঅ'ৰেভ", 'Radio'), '#868e96']
    ];
    var st = { lg: 2.7 };
    var svg = s('svg', { viewBox: '0 0 420 100', 'class': 'anim-svg', role: 'img', 'aria-label': L('বিদ্যুৎচুম্বকীয় বৰ্ণালী', 'Electromagnetic spectrum') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function X(lg) { return 15 + (lg + 3) / 12 * 390; }
    function band(nm) { for (var i = 0; i < BANDS.length; i++) if (nm <= BANDS[i][0]) return BANDS[i]; return BANDS[BANDS.length - 1]; }
    function paint() {
      svg.innerHTML = '';
      var prev = -3;
      BANDS.forEach(function (b, i) {
        var hi = Math.min(9, Math.log(b[0]) / Math.LN10);
        if (hi <= prev) return;
        if (b[2]) svg.appendChild(s('rect', { x: X(prev), y: 30, width: X(hi) - X(prev), height: 26, style: 'fill:' + b[2] + ';opacity:.75' }));
        else for (var nm = 400; nm < 750; nm += 5) svg.appendChild(s('rect', { x: X(Math.log(nm) / Math.LN10), y: 30, width: 3.2, height: 26, style: 'fill:' + wavelengthColor(nm) }));
        svg.appendChild(txt(s, (X(prev) + X(hi)) / 2, i % 2 ? 72 : 22, 8.5, 'middle', 'fill:var(--muted)', b[1]));
        prev = hi;
      });
      var nm = Math.pow(10, st.lg), x = X(st.lg);
      svg.appendChild(s('path', { d: 'M' + x + ',58 l-6,10 h12 z', style: 'fill:var(--text)' }));
      svg.appendChild(txt(s, 15, 96, 9, 'start', 'fill:var(--muted)', '10⁻³ nm'));
      svg.appendChild(txt(s, 405, 96, 9, 'end', 'fill:var(--muted)', '10⁹ nm'));
      var lam = nm * 1e-9, nu = C / lam, E = H * nu;
      var b = band(nm);
      info.innerHTML = '<b>' + b[1] + '</b> · λ = ' + sciStr(nm, 2) + ' nm = ' + sciStr(lam, 2) + ' m<br>' +
        'ν = c / λ = <b>' + sciStr(nu, 2) + ' Hz</b> · ν̄ = 1 / λ = ' + sciStr(1 / lam, 2) + ' m⁻¹<br>' +
        L('ফ\'টনৰ শক্তি E = hν = ', 'Photon energy E = hν = ') + '<b>' + sciStr(E, 2) + ' J</b> = ' + sciStr(E / EV, 2) + ' eV · ' + L('1 mol ফ\'টন = ', '1 mol of photons = ') + sciStr(E * 6.022e23 / 1000, 2) + ' kJ';
    }
    var sl = k.slider('log₁₀ λ(nm)', -3, 9, 0.1, st.lg, function (v) { st.lg = Math.round(v * 10) / 10; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el, k.button('500 nm', function () { st.lg = 2.7; sl.input.value = 2.7; sl.out.textContent = 2.7; paint(); })]));
    root.appendChild(info);
    paint();
  });

  /* ------------------------------------------------------------------ 4. photoelectric effect */
  A.register('photoelectric', function (root, k) {
    var h = k.h, s = k.s;
    var METALS = { Li: 2.42, Na: 2.3, K: 2.25, Mg: 3.7, Cu: 4.8, Ag: 4.3 };
    var st = { m: 'K', nu: 5, I: 3 };
    var svg = s('svg', { viewBox: '0 0 420 190', 'class': 'anim-svg', role: 'img', 'aria-label': L('আলোকবিদ্যুৎ প্ৰভাৱ', 'The photoelectric effect') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      var W0 = METALS[st.m], nu = st.nu * 1e14, E = H * nu / EV, nu0 = W0 * EV / H, go = E > W0, KE = Math.max(0, E - W0);
      var col = wavelengthColor(C / nu * 1e9) || 'var(--muted)';
      svg.appendChild(s('rect', { x: 60, y: 140, width: 300, height: 30, rx: 4, style: 'fill:var(--neutron);opacity:.8' }));
      svg.appendChild(txt(s, 210, 160, 13, 'middle', 'fill:var(--canvas)', st.m + '  (W₀ = ' + W0 + ' eV, ν₀ = ' + sciStr(nu0, 2) + ' Hz)', 700));
      for (var i = 0; i < st.I; i++) {
        var x = 90 + i * 60 + (st.I < 3 ? 40 : 0), pts = [];
        for (var d = 0; d <= 70; d += 2) pts.push((x + 5 * Math.sin(d / (4 + 14 * Math.min(1, 700e-9 / (C / nu)) * 0.3) * 1.2)).toFixed(1) + ',' + (20 + d).toFixed(1));
        svg.appendChild(s('polyline', { points: pts.join(' '), fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round', style: 'stroke:' + col }));
        if (go) {
          var len = 10 + KE * 12;
          svg.appendChild(s('circle', { cx: x + 14, cy: 132 - len, r: 5.5, style: 'fill:var(--electron)' }));
          svg.appendChild(s('line', { x1: x + 14, y1: 132, x2: x + 14, y2: 132 - len + 7, style: 'stroke:var(--electron);stroke-width:1.8;stroke-dasharray:3 2' }));
        }
      }
      svg.appendChild(txt(s, 8, 14, 10, 'start', 'fill:var(--muted)', L('ফ\'টনৰ ধাৰা ↓   ইলেক্ট্ৰন ↑ (তীৰৰ দীঘ ∝ গতিশক্তি)', 'photons ↓   electrons ↑ (arrow length ∝ kinetic energy)')));
      info.innerHTML = L('ফ\'টনৰ শক্তি hν = ', 'photon energy hν = ') + '<b>' + E.toFixed(2) + ' eV</b> · W₀ = ' + W0 + ' eV<br>' +
        (go ? L('hν > W₀ ⇒ ইলেক্ট্ৰন নিৰ্গত। KE = hν − W₀ = <b>' + KE.toFixed(2) + ' eV</b>; ইলেক্ট্ৰনৰ সংখ্যা প্ৰাবল্যৰ সমানুপাতিক (' + st.I + ' ফ\'টন → ' + st.I + ' ইলেক্ট্ৰন)।', 'hν > W₀ ⇒ electrons are emitted. KE = hν − W₀ = <b>' + KE.toFixed(2) + ' eV</b>; the number of electrons is proportional to intensity (' + st.I + ' photons → ' + st.I + ' electrons).') :
          L('hν < W₀ ⇒ <b>কোনো ইলেক্ট্ৰন নিৰ্গত নহয়</b>— প্ৰাবল্য যিমানেই বঢ়াওক।', 'hν < W₀ ⇒ <b>no electrons are emitted</b> — however much you raise the intensity.'));
    }
    var sel = k.select('Metal', Object.keys(METALS).map(function (m) { return { value: m, label: m }; }), st.m, function (v) { st.m = v; paint(); });
    var s1 = k.slider('ν (×10¹⁴ Hz)', 1, 15, 0.5, st.nu, function (v) { st.nu = v; paint(); });
    var s2 = k.slider('Intensity', 1, 5, 1, st.I, function (v) { st.I = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, s1.el, s2.el]));
    root.appendChild(info);
    paint();
  });

  /* ------------------------------------------------------------------ 5. bohr */
  A.register('bohr', function (root, k) {
    var h = k.h, s = k.s;
    var CX = 150, CY = 150;
    function orbitR(n) { return 20 + 22 * (n - 1); }
    function energy(n) { return -13.6 / (n * n); }

    var svg = s('svg', { viewBox: '0 0 300 300', 'class': 'anim-svg', role: 'img', 'aria-label': L("ব'ৰৰ আৰ্হি: ইলেক্ট্ৰনৰ শক্তিস্তৰ আৰু ফ'টন", "Bohr's model: electron energy levels and photons") });
    var orbitG = s('g'); svg.appendChild(orbitG);
    for (var n = 1; n <= 6; n++) {
      orbitG.appendChild(s('circle', { cx: CX, cy: CY, r: orbitR(n), fill: 'none', stroke: 'var(--border)', 'stroke-width': 1.5 }));
      orbitG.appendChild(s('text', { x: CX + orbitR(n) * 0.707 + 2, y: CY - orbitR(n) * 0.707 - 2, 'font-size': 9, style: 'fill:var(--muted)', text: 'n=' + n }));
    }
    svg.appendChild(s('circle', { cx: CX, cy: CY, r: 7, style: 'fill:var(--proton)' }));
    var photon = s('polyline', { fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', visibility: 'hidden' });
    var electron = s('circle', { r: 6, style: 'fill:var(--electron)' });
    svg.appendChild(photon); svg.appendChild(electron);
    root.appendChild(svg);

    var from = 3, to = 2;
    var ePhase = 0, eRadius = orbitR(from), mode = 'idle', mt = 0, ph = null, jumpFrom = 0, jumpTo = 0;

    function info() {
      var dE = Math.abs(energy(to) - energy(from)), nm = dE ? 1240 / dE : 0;
      return { dE: dE, nm: nm, color: nm ? wavelengthColor(nm) : null, lowN: Math.min(from, to), emit: to < from };
    }
    var SERIES = { 1: L('লাইমেন (Lyman)', 'Lyman'), 2: L('বামাৰ (Balmer)', 'Balmer'), 3: L('পাশ্চেন (Paschen)', 'Paschen'), 4: L('ব্ৰেকেট (Brackett)', 'Brackett'), 5: L('ফাণ্ড (Pfund)', 'Pfund') };

    var readout = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paintReadout() {
      if (from === to) { readout.innerHTML = L('দুটা বেলেগ স্তৰ বাছনি কৰক।', 'Pick two different levels.'); return; }
      var i = info();
      var region = i.color ? '<span class="dot" style="background:' + i.color + '"></span>' + L('দৃশ্যমান আলো', 'visible light') : (i.nm < 380 ? L('অতিবেঙুনীয়া (UV) — অদৃশ্য', 'ultraviolet (UV) — invisible') : L('অৱলোহিত (IR) — অদৃশ্য', 'infrared (IR) — invisible'));
      readout.innerHTML =
        'E<sub>' + from + '</sub> = ' + energy(from).toFixed(2) + ' eV, E<sub>' + to + '</sub> = ' + energy(to).toFixed(2) + ' eV<br>' +
        '|ΔE| = <b>' + i.dE.toFixed(2) + ' eV</b> · λ = 1240 / ΔE ≈ <b>' + i.nm.toFixed(0) + ' nm</b> · ' + region + '<br>' +
        (i.emit ? L('শক্তি <b>নিৰ্গত</b> (emission)', 'energy <b>emitted</b>') : L('শক্তি <b>শোষণ</b> (absorption)', 'energy <b>absorbed</b>')) + ' · ' + L((SERIES[i.lowN] || '') + ' শ্ৰেণী', (SERIES[i.lowN] || '') + ' series');
    }

    function setPhoton(r, angle, len) {
      var i = info(), amp = 4.5, wl = 6 + 24 * Math.min(1, i.nm / 700), pts = [];
      var ux = Math.cos(angle), uy = Math.sin(angle), nx = -uy, ny = ux;
      for (var d = 0; d <= len; d += 2) {
        var off = amp * Math.sin((d / wl) * 6.2832);
        pts.push((CX + (r + d) * ux + off * nx).toFixed(1) + ',' + (CY + (r + d) * uy + off * ny).toFixed(1));
      }
      photon.setAttribute('points', pts.join(' '));
      photon.setAttribute('stroke', i.color || 'var(--muted)');
      photon.setAttribute('stroke-dasharray', i.color ? '' : '4 3');
      photon.setAttribute('visibility', 'visible');
    }
    function place() { electron.setAttribute('cx', CX + eRadius * Math.cos(ePhase)); electron.setAttribute('cy', CY + eRadius * Math.sin(ePhase)); }

    function tick(dt) {
      ePhase += (mode === 'jump' ? 6 : 2.2 / Math.sqrt(from)) * dt;
      mt += dt;
      var emit = to < from, ang = ph, r0;
      if (mode === 'photon-in') {
        r0 = orbitR(from) + 130 - mt * 200;
        if (r0 <= orbitR(from)) { photon.setAttribute('visibility', 'hidden'); mode = 'jump'; mt = 0; jumpFrom = orbitR(from); jumpTo = orbitR(to); }
        else setPhoton(r0, ang, 40);
      } else if (mode === 'jump') {
        var f = Math.min(1, mt / 0.9), e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        eRadius = jumpFrom + (jumpTo - jumpFrom) * e;
        if (f >= 1) {
          var prev = from;
          eRadius = jumpTo; from = to; to = prev; syncSelects();
          if (emit) { mode = 'photon-out'; mt = 0; } else { mode = 'idle'; }
        }
      } else if (mode === 'photon-out') {
        r0 = orbitR(from) + mt * 160;
        if (r0 > 175) { photon.setAttribute('visibility', 'hidden'); mode = 'idle'; }
        else setPhoton(r0, ang, 40);
      }
      place();
    }

    var selFrom, selTo;
    function opts() { var o = []; for (var i = 1; i <= 6; i++) o.push({ value: i, label: 'n = ' + i }); return o; }
    function syncSelects() { selFrom.select.value = from; selTo.select.value = to; }
    selFrom = k.select('From', opts(), from, function (v) { if (mode !== 'idle') return; from = +v; eRadius = orbitR(from); place(); paintReadout(); });
    selTo = k.select('To', opts(), to, function (v) { if (mode !== 'idle') return; to = +v; paintReadout(); });

    function run() {
      if (mode !== 'idle' || from === to) return;
      ph = ePhase; mt = 0;
      if (to < from) { mode = 'jump'; jumpFrom = orbitR(from); jumpTo = orbitR(to); }
      else { mode = 'photon-in'; }
      if (!lp.running) lp.start();
    }
    function quick(f, t) { return function () { if (mode !== 'idle') return; from = f; to = t; eRadius = orbitR(f); syncSelects(); paintReadout(); run(); }; }

    var lp = k.loop(root, tick);
    root.appendChild(h('div', { 'class': 'row' }, [selFrom.el, selTo.el, k.button('Run ▶', run, 'primary')]));
    root.appendChild(h('div', { 'class': 'row' }, [h('span', { 'class': 'en', text: 'Quick picks:' }),
      k.button('3 → 2 (Balmer, red)', quick(3, 2)), k.button('4 → 2 (Balmer)', quick(4, 2)), k.button('2 → 1 (Lyman)', quick(2, 1)), k.button('1 → 3 (absorption)', quick(1, 3))]));
    root.appendChild(readout);
    place(); paintReadout();
    if (!k.reduceMotion) lp.start();
  });

  /* ------------------------------------------------------------------ 6. de Broglie wavelength */
  A.register('de-broglie', function (root, k) {
    var h = k.h, s = k.s;
    var OBJ = {
      e: [L('হাইড্ৰ\'জেনৰ ইলেক্ট্ৰন', 'Electron in hydrogen'), 9.109e-31, 2.19e6],
      n: [L('তাপীয় নিউট্ৰন', 'Thermal neutron'), 1.675e-27, 2200],
      d: [L('1 mg ধূলিকণা (1 m/s)', '1 mg dust grain (1 m/s)'), 1e-6, 1],
      b: [L('0.1 kg বল (10 m/s)', '0.1 kg ball (10 m/s)'), 0.1, 10],
      c: [L('1000 kg গাড়ী (20 m/s)', '1000 kg car (20 m/s)'), 1000, 20]
    };
    var st = { o: 'e' };
    var svg = s('svg', { viewBox: '0 0 420 90', 'class': 'anim-svg', role: 'img', 'aria-label': L('দ্য ব্ৰয়লি তৰংগদৈৰ্ঘ্যৰ স্কেল', 'Scale of de Broglie wavelengths') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function X(lg) { return 20 + (lg + 40) / 34 * 380; }
    function paint() {
      svg.innerHTML = '';
      var o = OBJ[st.o], lam = H / (o[1] * o[2]), lg = Math.log(lam) / Math.LN10;
      svg.appendChild(s('line', { x1: 20, y1: 50, x2: 400, y2: 50, style: 'stroke:var(--muted);stroke-width:2' }));
      [[-15, L('নিউক্লিয়াছ', 'nucleus')], [-10, L('পৰমাণু', 'atom')]].forEach(function (m) {
        svg.appendChild(s('line', { x1: X(m[0]), y1: 40, x2: X(m[0]), y2: 60, style: 'stroke:var(--ok);stroke-width:2' }));
        svg.appendChild(txt(s, X(m[0]), 76, 9.5, 'middle', 'fill:var(--ok)', m[1] + ' (10' + String(m[0]).split('').map(function (c) { return SUP[c]; }).join('') + ' m)'));
      });
      svg.appendChild(s('circle', { cx: X(lg), cy: 50, r: 7, style: 'fill:var(--proton)' }));
      svg.appendChild(txt(s, X(lg), 34, 10, 'middle', 'fill:var(--proton)', 'λ', 700));
      svg.appendChild(txt(s, 20, 14, 9.5, 'start', 'fill:var(--muted)', L('লগ স্কেল: 10⁻⁴⁰ m → 10⁻⁶ m', 'log scale: 10⁻⁴⁰ m → 10⁻⁶ m')));
      info.innerHTML = '<b>' + o[0] + '</b>: m = ' + sciStr(o[1], 3) + ' kg, v = ' + sciStr(o[2], 2) + ' m s⁻¹<br>λ = h / mv = <b>' + sciStr(lam, 2) + ' m</b> (' + sciStr(lam * 1e9, 2) + ' nm)<br>' +
        (lam > 1e-12 ? L('পৰমাণুৰ আকাৰৰ সৈতে তুলনীয়— তৰংগধৰ্ম পৰীক্ষাত দেখা যায় (অপবৰ্তন)।', 'Comparable to atomic dimensions — the wave nature shows up in experiments (diffraction).') :
          L('পৰমাণুতকৈ বহু সৰু— তৰংগধৰ্ম অনুভৱ কৰিব নোৱাৰি।', 'Far smaller than an atom — the wave nature is undetectable.'));
    }
    var sel = k.select('Object', Object.keys(OBJ).map(function (key) { return { value: key, label: OBJ[key][0] }; }), st.o, function (v) { st.o = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ------------------------------------------------------------------ 7. uncertainty principle */
  A.register('uncertainty', function (root, k) {
    var h = k.h, s = k.s;
    var PART = { e: [L('ইলেক্ট্ৰন', 'Electron'), 9.109e-31], d: [L('1 mg ধূলিকণা', '1 mg dust grain'), 1e-6], b: [L('40 g বল', '40 g ball'), 0.04] };
    var st = { p: 'e', lg: -10 };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('Δv ব্যস্তানুপাতিক Δx', 'Δv is inversely proportional to Δx') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      var m = PART[st.p][1], c0 = Math.log(H / (4 * Math.PI * m)) / Math.LN10;
      var ymin = -40, ymax = 15;
      function X(lg) { return 40 + (lg + 12) / 10 * 360; }
      function Y(lv) { return 170 - (lv - ymin) / (ymax - ymin) * 150; }
      svg.appendChild(s('rect', { x: 40, y: 20, width: 360, height: 150, style: 'fill:none;stroke:var(--border)' }));
      svg.appendChild(s('line', { x1: X(-12), y1: Y(c0 + 12), x2: X(-2), y2: Y(c0 + 2), style: 'stroke:var(--brand);stroke-width:2.5' }));
      var lv = c0 - st.lg;
      svg.appendChild(s('circle', { cx: X(st.lg), cy: Math.max(20, Math.min(170, Y(lv))), r: 6.5, style: 'fill:var(--proton)' }));
      svg.appendChild(txt(s, 220, 192, 10, 'middle', 'fill:var(--muted)', 'log₁₀ Δx (m)  →'));
      svg.appendChild(txt(s, 8, 14, 10, 'start', 'fill:var(--muted)', 'log₁₀ Δv (m s⁻¹) ↑'));
      var dv = Math.pow(10, lv);
      info.innerHTML = '<b>' + PART[st.p][0] + '</b>: Δx = ' + sciStr(Math.pow(10, st.lg), 1) + ' m ⇒ Δv ≥ h / 4πmΔx = <b>' + sciStr(dv, 2) + ' m s⁻¹</b><br>' +
        (dv > 1e5 ? L('বিশাল অনিশ্চয়তা— কণাৰ বেগ প্ৰায় অজ্ঞাত; নিৰ্দিষ্ট কক্ষপথৰ ধাৰণা অসম্ভৱ।', 'Huge uncertainty — the speed is essentially unknown; a definite orbit is impossible.') :
          dv > 1e-3 ? L('অনিশ্চয়তা উল্লেখযোগ্য।', 'The uncertainty is significant.') : L('অগণ্য— স্থূল বস্তুৰ বাবে অনিশ্চয়তা সূত্ৰৰ প্ৰভাৱ নাই।', 'Negligible — the principle has no visible effect for everyday objects.'));
    }
    var sel = k.select('Particle', Object.keys(PART).map(function (key) { return { value: key, label: PART[key][0] }; }), st.p, function (v) { st.p = v; paint(); });
    var sl = k.slider('log₁₀ Δx', -12, -2, 0.5, st.lg, function (v) { st.lg = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ------------------------------------------------------------------ 8. quantum-explorer */
  A.register('quantum-explorer', function (root, k) {
    var h = k.h;
    var NAMES = 'spdf';
    var tree = h('div', { 'class': 'qn-tree', 'aria-live': 'polite' });
    var summary = h('div', { 'class': 'readout' });
    function sign(m) { return m > 0 ? '+' + m : (m < 0 ? '−' + (-m) : '0'); }
    function render(n) {
      tree.innerHTML = '';
      var orbitals = 0;
      for (var l = 0; l < n; l++) {
        var boxes = [];
        for (var m = -l; m <= l; m++) boxes.push(h('div', { 'class': 'orb-box' }, [h('b', { text: n + NAMES[l] }), 'm', h('sub', { text: 'l' }), ' = ' + sign(m)]));
        orbitals += 2 * l + 1;
        tree.appendChild(h('div', { 'class': 'qn-row', style: 'animation-delay:' + (l * 80) + 'ms' }, [
          h('div', {}, [h('div', { 'class': 'sub-name', text: n + NAMES[l] }), h('small', { text: 'l = ' + l })]),
          h('div', {}, [h('div', { 'class': 'orb-boxes' }, boxes), h('small', { text: L((2 * l + 1) + 'টা অৰবিটেল · সৰ্বাধিক ' + (2 * (2 * l + 1)) + 'টা ইলেক্ট্ৰন', (2 * l + 1) + ' orbital' + (l ? 's' : '') + ' · at most ' + (2 * (2 * l + 1)) + ' electrons') })])
        ]));
      }
      summary.innerHTML = L('n = <b>' + n + '</b>: l ৰ মান 0 ৰ পৰা ' + (n - 1) + ' লৈ → <b>' + n + 'টা উপখোলা</b><br>মুঠ অৰবিটেল = n² = <b>' + orbitals + '</b> · সৰ্বাধিক ইলেক্ট্ৰন = 2n² = <b>' + (2 * orbitals) + '</b>',
        'n = <b>' + n + '</b>: l runs from 0 to ' + (n - 1) + ' → <b>' + n + ' subshell' + (n > 1 ? 's' : '') + '</b><br>total orbitals = n² = <b>' + orbitals + '</b> · at most 2n² = <b>' + (2 * orbitals) + '</b> electrons');
    }
    var sl = k.slider('n', 1, 4, 1, 3, render);
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(tree); root.appendChild(summary);
    render(3);
  });

  /* ------------------------------------------------------------------ 9. orbitals (3-D point cloud) */
  A.register('orbitals', function (root, k) {
    var h = k.h;
    var SIZE = 320, R = 120, N = 3400;
    var canvas = h('canvas', { 'class': 'anim-canvas drag', role: 'img', 'aria-label': L('অৰবিটেলৰ ত্ৰিমাত্ৰিক আকৃতি', '3-D shape of an orbital') });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, SIZE, SIZE);

    var DEFS = {
      '1s':  { f: function () { return 1; }, scale: .62, l: 0, ml: '0', shape: L('গোলাকাৰ', 'spherical') },
      '2px': { f: function (x) { return x; }, scale: 1, l: 1, ml: '−1, 0, +1', shape: L('ডাম্বেল (x অক্ষৰ দিশত)', 'dumbbell along the x axis') },
      '2py': { f: function (x, y) { return y; }, scale: 1, l: 1, ml: '−1, 0, +1', shape: L('ডাম্বেল (y অক্ষৰ দিশত)', 'dumbbell along the y axis') },
      '2pz': { f: function (x, y, z) { return z; }, scale: 1, l: 1, ml: '−1, 0, +1', shape: L('ডাম্বেল (z অক্ষৰ দিশত)', 'dumbbell along the z axis') },
      '3dxy':   { f: function (x, y) { return 2 * x * y; }, scale: 1, l: 2, ml: '−2, −1, 0, +1, +2', shape: L('চাৰিপাহিযুক্ত, অক্ষৰ মাজত', 'four lobes between the axes') },
      '3dyz':   { f: function (x, y, z) { return 2 * y * z; }, scale: 1, l: 2, ml: '−2 … +2', shape: L('চাৰিপাহিযুক্ত, অক্ষৰ মাজত', 'four lobes between the axes') },
      '3dxz':   { f: function (x, y, z) { return 2 * x * z; }, scale: 1, l: 2, ml: '−2 … +2', shape: L('চাৰিপাহিযুক্ত, অক্ষৰ মাজত', 'four lobes between the axes') },
      '3dx²−y²': { f: function (x, y) { return x * x - y * y; }, scale: 1, l: 2, ml: '−2 … +2', shape: L('চাৰিপাহিযুক্ত, অক্ষৰ ওপৰত', 'four lobes along the axes') },
      '3dz²':   { f: function (x, y, z) { return (3 * z * z - 1) / 2; }, scale: 1, l: 2, ml: '−2 … +2', shape: L('z-অক্ষৰ দিশত ডাম্বেল আৰু মাজত এটা আঙঠি', 'dumbbell along z with a ring in the middle') }
    };
    var ORDER = ['1s', '2px', '2py', '2pz', '3dxy', '3dyz', '3dxz', '3dx²−y²', '3dz²'];
    var current = '2pz';

    var dirs = [];
    var ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var yy = 1 - 2 * (i + .5) / N, rr = Math.sqrt(1 - yy * yy), th = ga * i;
      dirs.push([rr * Math.cos(th), yy, rr * Math.sin(th)]);
    }
    var ax = -0.45, ay = 0.6, dragging = false, lastX = 0, lastY = 0;

    function draw() {
      var bg = k.cssVar('--canvas'), pos = k.cssVar('--pos'), neg = k.cssVar('--neg'), tx = k.cssVar('--muted');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, SIZE, SIZE);
      var cx = SIZE / 2, cy = SIZE / 2, def = DEFS[current];
      var ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      function rot(x, y, z) {
        var x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        var y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        return [x1, y2, z2];
      }
      ctx.lineWidth = 1; ctx.strokeStyle = tx; ctx.fillStyle = tx; ctx.font = '12px sans-serif'; ctx.globalAlpha = .55;
      [['x', 1, 0, 0], ['y', 0, 1, 0], ['z', 0, 0, 1]].forEach(function (a) {
        var p = rot(a[1] * 135, a[2] * 135, a[3] * 135), q = rot(-a[1] * 135, -a[2] * 135, -a[3] * 135);
        ctx.beginPath(); ctx.moveTo(cx + q[0], cy - q[1]); ctx.lineTo(cx + p[0], cy - p[1]); ctx.stroke();
        ctx.fillText(a[0], cx + p[0] + 4, cy - p[1] - 4);
      });
      ctx.globalAlpha = 1;
      var pts = [];
      for (var i = 0; i < N; i++) {
        var d = dirs[i], v = def.f(d[0], d[1], d[2]), mag = Math.abs(v) * R * def.scale;
        if (mag < 1.2) continue;
        var p = rot(d[0] * mag, d[1] * mag, d[2] * mag);
        pts.push([p[0], p[1], p[2], v > 0]);
      }
      pts.sort(function (a, b) { return a[2] - b[2]; });
      for (var j = 0; j < pts.length; j++) {
        var q = pts[j], depth = (q[2] + R) / (2 * R);
        ctx.globalAlpha = 0.35 + 0.65 * Math.max(0, Math.min(1, depth));
        ctx.fillStyle = q[3] ? pos : neg;
        var sz = 1.6 + depth * 1.4;
        ctx.fillRect(cx + q[0] - sz / 2, cy - q[1] - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
    }

    var lp = k.loop(root, function (dt) { if (!dragging) ay += 0.6 * dt; draw(); });
    canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      ay += (e.clientX - lastX) * 0.012; ax += (e.clientY - lastY) * 0.012;
      ax = Math.max(-1.5, Math.min(1.5, ax)); lastX = e.clientX; lastY = e.clientY;
      if (!lp.running) draw();
    });
    function endDrag() { dragging = false; }
    canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);

    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var buttons = {};
    function select(name) {
      current = name;
      Object.keys(buttons).forEach(function (n) { buttons[n].setAttribute('aria-pressed', String(n === name)); });
      var d = DEFS[name], sub = ['s', 'p', 'd'][d.l];
      info.innerHTML = L('<b>' + name + '</b> অৰবিটেল · l = <b>' + d.l + '</b> (' + sub + ' উপখোলা) · m<sub>l</sub> = ' + d.ml + '<br>আকৃতি: ' + d.shape + '<br>' + sub + ' উপখোলাত <b>' + (2 * d.l + 1) + 'টা</b> অৰবিটেল, সৰ্বাধিক <b>' + (2 * (2 * d.l + 1)) + 'টা</b> ইলেক্ট্ৰন।',
        '<b>' + name + '</b> orbital · l = <b>' + d.l + '</b> (' + sub + ' subshell) · m<sub>l</sub> = ' + d.ml + '<br>shape: ' + d.shape + '<br>the ' + sub + ' subshell has <b>' + (2 * d.l + 1) + '</b> orbital' + (d.l ? 's' : '') + ', holding at most <b>' + (2 * (2 * d.l + 1)) + '</b> electrons.');
      if (!lp.running) draw();
    }
    var btnRow = h('div', { 'class': 'row' });
    ORDER.forEach(function (n) { buttons[n] = k.button(n, function () { select(n); }); btnRow.appendChild(buttons[n]); });
    root.appendChild(btnRow);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--pos)' }), L('ধনাত্মক চিহ্ন (+)', 'positive sign (+)')]),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--neg)' }), L('ঋণাত্মক চিহ্ন (−)', 'negative sign (−)')]),
      h('span', { text: 'Drag to rotate' })]));
    root.appendChild(info);
    select(current);
    draw();
    if (!k.reduceMotion) lp.start();
  });

  /* ------------------------------------------------------------------ 10. nodes */
  A.register('nodes', function (root, k) {
    var h = k.h, s = k.s;
    var LIST = ['1s', '2s', '3s', '4s', '2p', '3p', '4p', '3d', '4d', '4f'];
    var st = { o: '3s' };
    var svg = s('svg', { viewBox: '0 0 300 220', 'class': 'anim-svg', role: 'img', 'aria-label': L("অৰবিটেলৰ ন'ড", 'Nodes of an orbital') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      var n = +st.o[0], l = 'spdf'.indexOf(st.o[1]), rad = n - l - 1, CX = 150, CY = 110, R = 95;
      svg.appendChild(s('circle', { cx: CX, cy: CY, r: R, style: 'fill:var(--brand-soft);stroke:var(--brand);stroke-width:2' }));
      for (var i = 1; i <= rad; i++) svg.appendChild(s('circle', { cx: CX, cy: CY, r: R * i / (rad + 1), style: 'fill:none;stroke:var(--bad);stroke-width:2;stroke-dasharray:5 3' }));
      for (var j = 0; j < l; j++) {
        var a = Math.PI * j / l + (l === 2 ? Math.PI / 4 : 0), dx = R * Math.cos(a), dy = R * Math.sin(a);
        svg.appendChild(s('line', { x1: CX - dx, y1: CY - dy, x2: CX + dx, y2: CY + dy, style: 'stroke:var(--accent);stroke-width:2.5' }));
      }
      svg.appendChild(s('circle', { cx: CX, cy: CY, r: 4, style: 'fill:var(--proton)' }));
      svg.appendChild(txt(s, 8, 14, 10, 'start', 'fill:var(--bad)', L('- - -  ৰেডিয়েল ন\'ড (গোলক)', '- - -  radial node (sphere)')));
      svg.appendChild(txt(s, 8, 28, 10, 'start', 'fill:var(--accent)', L('——  কৌণিক ন\'ড (সমতল)', '——  angular node (plane)')));
      svg.appendChild(txt(s, 292, 214, 9, 'end', 'fill:var(--muted)', L('চিত্ৰ কেৱল যোজনামূলক (cross-section)', 'schematic cross-section')));
      info.innerHTML = '<b>' + st.o + '</b>: ' + L('ৰেডিয়েল ন\'ড = n − l − 1 = <b>' + rad + '</b> · কৌণিক ন\'ড = l = <b>' + l + '</b> · মুঠ = n − 1 = <b>' + (n - 1) + '</b>',
        'radial nodes = n − l − 1 = <b>' + rad + '</b> · angular nodes = l = <b>' + l + '</b> · total = n − 1 = <b>' + (n - 1) + '</b>');
    }
    var sel = k.select('Orbital', LIST.map(function (o) { return { value: o, label: o }; }), st.o, function (v) { st.o = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ------------------------------------------------------------------ 11. (n + l) rule */
  A.register('nl-rule', function (root, k) {
    var h = k.h;
    var SUBS = [];
    for (var n = 1; n <= 7; n++) for (var l = 0; l < Math.min(n, 4); l++) SUBS.push({ n: n, l: l, name: n + 'spdf'[l] });
    SUBS = SUBS.filter(function (x) { return x.n + x.l <= 8; });
    function key(x) { return x.n + x.l + x.n / 100; }
    var ORDER = SUBS.slice().sort(function (a, b) { return key(a) - key(b); });
    var st = { a: '4s', b: '3d' };
    var ladder = h('div', { 'class': 'row', style: 'flex-wrap:wrap;gap:.3em' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function find(name) { return SUBS.filter(function (x) { return x.name === name; })[0]; }
    function paint() {
      var a = find(st.a), b = find(st.b), sa = a.n + a.l, sb = b.n + b.l;
      ladder.innerHTML = '';
      ORDER.forEach(function (x, i) {
        var on = x.name === a.name || x.name === b.name;
        ladder.appendChild(h('span', { style: 'padding:.15em .5em;border-radius:6px;border:1px solid var(--border);background:' + (on ? 'var(--brand-soft)' : 'var(--surface-2)') + ';font-weight:' + (on ? 800 : 400), title: 'n + l = ' + (x.n + x.l), text: (i ? '< ' : '') + x.name }));
      });
      var lower = a.name === b.name ? null : (key(a) < key(b) ? a : b);
      var why = sa !== sb ? L('(n + l) কম ⇒ শক্তি কম', 'lower (n + l) ⇒ lower energy') : L('(n + l) সমান, গতিকে n কম হোৱাটোৰ শক্তি কম', '(n + l) equal, so the one with lower n is lower');
      info.innerHTML = '<b>' + a.name + '</b>: n + l = ' + a.n + ' + ' + a.l + ' = ' + sa + ' · <b>' + b.name + '</b>: n + l = ' + b.n + ' + ' + b.l + ' = ' + sb + '<br>' +
        (lower ? L('<b>' + lower.name + '</b> ৰ শক্তি কম— ' + why + '।', '<b>' + lower.name + '</b> has the lower energy — ' + why + '.') : L('একেটা উপখোলা বাছনি কৰা হৈছে।', 'The same subshell is chosen twice.')) + '<br><small>' + L('ওপৰৰ শাৰীটোৱেই আউফবাউ ক্ৰম (সৰুৰ পৰা ডাঙৰ শক্তি)।', 'The row above is the Aufbau order (lowest to highest energy).') + '</small>';
    }
    var opts = SUBS.map(function (x) { return { value: x.name, label: x.name }; });
    var selA = k.select('Subshell 1', opts, st.a, function (v) { st.a = v; paint(); });
    var selB = k.select('Subshell 2', opts, st.b, function (v) { st.b = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [selA.el, selB.el]));
    root.appendChild(ladder);
    root.appendChild(info);
    paint();
  });

  /* ------------------------------------------------------------------ 12. aufbau */
  A.register('aufbau', function (root, k) {
    var h = k.h;
    var ORDER = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]];
    function config(z) {
      var left = z, c = {};
      ORDER.forEach(function (o) { var t = Math.min(left, o[1]); c[o[0]] = t; left -= t; });
      if (z === 24) { c['4s'] = 1; c['3d'] = 5; }
      if (z === 29) { c['4s'] = 1; c['3d'] = 10; }
      return c;
    }
    var z = 8, timer = null;

    var levels = h('div', { 'class': 'levels' });
    var rows = {};
    ORDER.slice().reverse().forEach(function (o) {
      var name = o[0], nb = o[1] / 2, boxes = [];
      var bx = h('div', { 'class': 'bx' });
      for (var i = 0; i < nb; i++) { var b = h('div', { 'class': 'ebox' }); boxes.push(b); bx.appendChild(b); }
      var cnt = h('div', { 'class': 'cnt' });
      var row = h('div', { 'class': 'lv' }, [h('div', { 'class': 'nm', text: name }), bx, cnt]);
      rows[name] = { row: row, boxes: boxes, cnt: cnt, cap: o[1] };
      levels.appendChild(row);
    });
    var readout = h('div', { 'class': 'readout', 'aria-live': 'polite' });

    function unpaired(e, cap) { var m = cap / 2; return e <= m ? e : 2 * m - e; }
    function sup(n) { return n ? '<sup>' + n + '</sup>' : ''; }

    function paint() {
      var c = config(z), prev = z > 1 ? config(z - 1) : {}, up = 0;
      ORDER.forEach(function (o) {
        var r = rows[o[0]], e = c[o[0]], m = o[1] / 2;
        r.boxes.forEach(function (b, i) {
          var ups = Math.min(e, m), downs = Math.max(0, e - m);
          var hasUp = i < ups, hasDn = i < downs;
          b.className = 'ebox' + (hasUp ? ' has' : '');
          b.innerHTML = (hasUp ? '<span class="up">↑</span>' : '') + (hasDn ? '<span class="dn">↓</span>' : '');
        });
        r.cnt.textContent = e + '/' + o[1];
        r.row.className = 'lv' + (e !== (prev[o[0]] || 0) ? ' hot' : '');
        up += unpaired(e, o[1]);
      });
      var el = EL[z];
      var written = ['1s', '2s', '2p', '3s', '3p', '3d', '4s', '4p'];
      var core = z > 18 ? ['[Ar]', ['1s', '2s', '2p', '3s', '3p']] : (z > 10 ? ['[Ne]', ['1s', '2s', '2p']] : (z > 2 ? ['[He]', ['1s']] : null));
      var parts = [];
      if (core) parts.push(core[0]);
      written.forEach(function (n) {
        if (core && core[1].indexOf(n) >= 0) return;
        if (c[n]) parts.push(n + sup(c[n]));
      });
      var exc = (z === 24 || z === 29) ? '<br><b>' + L('ব্যতিক্ৰম:', 'Exception:') + '</b> ' + (z === 24 ? L('অৰ্ধপূৰ্ণ 3d⁵ স্থিতিশীল, সেয়ে 4s¹ 3d⁵', 'half-filled 3d⁵ is extra stable, so 4s¹ 3d⁵') : L('পূৰ্ণ 3d¹⁰ স্থিতিশীল, সেয়ে 4s¹ 3d¹⁰', 'filled 3d¹⁰ is extra stable, so 4s¹ 3d¹⁰')) : '';
      readout.innerHTML =
        '<b>Z = ' + z + '</b> · ' + el.sym + ' — ' + L(el.as + ' <span class="en">(' + el.en + ')</span>', el.en) + '<br>' +
        '<span class="cfg">' + parts.join(' ') + '</span><br>' +
        L('অযুগ্ম ইলেক্ট্ৰন: <b>' + up + '</b> · ' + (up ? '<b>পৰাচুম্বকীয়</b> (paramagnetic)' : 'প্ৰতিচুম্বকীয় (diamagnetic)'),
          'unpaired electrons: <b>' + up + '</b> · ' + (up ? '<b>paramagnetic</b>' : 'diamagnetic')) + exc;
      slider.input.value = z; slider.out.textContent = z;
      prevBtn.disabled = z <= 1; nextBtn.disabled = z >= 36;
    }

    var slider = k.slider('Z', 1, 36, 1, z, function (v) { stop(); z = v; paint(); });
    var prevBtn = k.button('◀ Previous', function () { stop(); z = Math.max(1, z - 1); paint(); });
    var nextBtn = k.button('Next electron ▶', function () { stop(); z = Math.min(36, z + 1); paint(); }, 'primary');
    var playBtn = k.button('▶ Auto-play', function () {
      if (timer) { stop(); return; }
      if (z >= 36) z = 1;
      paint(); playBtn.textContent = '⏸ Pause';
      timer = setInterval(function () { if (z >= 36) { stop(); return; } z++; paint(); }, 750);
    });
    function stop() { if (timer) { clearInterval(timer); timer = null; } playBtn.textContent = '▶ Auto-play'; }

    root.appendChild(h('div', { 'class': 'row' }, [slider.el, prevBtn, nextBtn, playBtn]));
    root.appendChild(levels);
    root.appendChild(readout);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--electron)' }), L('↑ ইলেক্ট্ৰন (স্পিন +½)', '↑ electron (spin +½)')]),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--proton)' }), L('↓ ইলেক্ট্ৰন (স্পিন −½)', '↓ electron (spin −½)')]),
      h('span', { text: L('কমলা ঘেৰ = এই ধাপত সলনি হোৱা উপখোলা', 'orange outline = subshell that changed in this step') })]));
    paint();
  });
})();
