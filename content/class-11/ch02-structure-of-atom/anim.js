/* Animations for Class 11, Chapter 2: Structure of Atom.
   Registered names: atom-builder, rutherford, bohr, quantum-explorer, orbitals, aufbau */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var EL = window.ChemElements;

  /* ------------------------------------------------------------------ 1. atom-builder */
  A.register('atom-builder', function (root, k) {
    var h = k.h, s = k.s;
    var state = { p: 6, n: 6, e: 6 };
    var LIMIT = { p: [1, 20], n: [0, 24], e: [0, 20] };
    var CAPS = [2, 8, 8, 8];
    var SHELL_R = [52, 80, 108, 136];

    var svg = s('svg', { viewBox: '0 0 300 300', 'class': 'anim-svg', role: 'img', 'aria-label': 'পৰমাণুৰ মডেল: নিউক্লিয়াছ আৰু ইলেক্ট্ৰন' });
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
      /* nucleus: sunflower layout, protons and neutrons mixed evenly */
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

    function tick(dt, t) {
      electrons.forEach(function (el, i) {
        var speed = 1.6 / (1 + el.shell * 0.55);
        if (!k.reduceMotion) el.phase += speed * dt;
        var r = SHELL_R[el.shell];
        el.node.setAttribute('cx', 150 + r * Math.cos(el.phase));
        el.node.setAttribute('cy', 150 + r * Math.sin(el.phase));
      });
    }

    function paintReadout() {
      var z = state.p, a = state.p + state.n, q = state.p - state.e, el = EL[z];
      var kind = q === 0 ? 'নিৰপেক্ষ পৰমাণু' : (q > 0 ? 'ধনাত্মক আয়ন (cation), আধান +' + q : 'ঋণাত্মক আয়ন (anion), আধান −' + (-q));
      var iso = a === el.A ? '' : ' · ইয়াৰ <b>সমস্থানিক (isotope)</b> — সাধাৰণ ' + el.sym + ' ত A = ' + el.A;
      readout.innerHTML =
        '<span class="nuc"><span class="ss"><span>' + a + '</span><span>' + z + '</span></span><span class="sym-big">' + el.sym + (q ? '<sup>' + (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−') + '</sup>' : '') + '</span></span> ' +
        '<b>' + el.as + '</b> <span class="en">(' + el.en + ')</span><br>' +
        'প্ৰ\'টন = ' + state.p + ' · নিউট্ৰন = ' + state.n + ' · ইলেক্ট্ৰন = ' + state.e + '<br>' +
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
    var cP = counter('প্ৰ\'টন', 'p', '--proton'), cN = counter('নিউট্ৰন', 'n', '--neutron'), cE = counter('ইলেক্ট্ৰন', 'e', '--electron');

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
    var W = 480, H = 300;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': 'α-কণিকাৰ বিক্ষেপণ: নিউক্লিয়াছৰ ওচৰেৰে যোৱা কণিকাবোৰ বেঁকা হয়' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);

    var NUC = { x: 335, y: 150 };
    var V0 = 200;                       /* px per second */
    var D0 = 12;                        /* head-on closest approach, px */
    var K = 0.5 * V0 * V0 * D0;         /* Coulomb constant in these units */
    var parts = [];
    var stats = { straight: 0, bent: 0, back: 0 };
    var rate = 6, acc = 0;

    function spawn(b) {
      parts.push({ x: -10, y: NUC.y + b, vx: V0, vy: 0, trail: [], t: 0 });
    }
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
        if (p.x > W + 20 || p.x < -30 || p.y < -30 || p.y > H + 30) { classify(p); parts.splice(i, 1); }
      }
      draw();
    }

    function draw() {
      var bg = k.cssVar('--canvas'), alpha = k.cssVar('--alpha'), pos = k.cssVar('--proton'), grid = k.cssVar('--grid'), txt = k.cssVar('--muted');
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      /* faint repulsion rings */
      ctx.strokeStyle = grid; ctx.lineWidth = 1;
      [28, 56, 96].forEach(function (r) { ctx.beginPath(); ctx.arc(NUC.x, NUC.y, r, 0, 6.2832); ctx.stroke(); });
      /* beam arrow */
      ctx.fillStyle = txt; ctx.font = '600 15px "Noto Sans Bengali", sans-serif';
      ctx.fillText('α-কণিকাৰ বিম →', 10, 24);
      ctx.textAlign = 'center'; ctx.fillText('নিউক্লিয়াছ (+)', NUC.x, NUC.y + 42); ctx.textAlign = 'start';
      /* particles */
      parts.forEach(function (p) {
        ctx.strokeStyle = alpha; ctx.globalAlpha = .35; ctx.lineWidth = 2;
        ctx.beginPath();
        for (var i = 0; i < p.trail.length; i += 2) { if (i === 0) ctx.moveTo(p.trail[i], p.trail[i + 1]); else ctx.lineTo(p.trail[i], p.trail[i + 1]); }
        ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 6.2832); ctx.fill();
      });
      /* nucleus on top */
      ctx.fillStyle = pos; ctx.beginPath(); ctx.arc(NUC.x, NUC.y, 10, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('+', NUC.x, NUC.y + 5); ctx.textAlign = 'start';
    }

    var statEls = {};
    function stat(key, label) {
      var b = h('b', { text: '0' });
      statEls[key] = b;
      return h('div', { 'class': 'stat' }, [b, label]);
    }
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
    root.appendChild(h('div', { 'class': 'stat-row' }, [stat('straight', 'সোজাই পাৰ হ\'ল (< 10°)'), stat('bent', 'বেঁকা হ\'ল (10°–90°)'), stat('back', 'উভতি আহিল (> 90°)')]));
    draw();
    if (k.reduceMotion) { playBtn.textContent = '▶ Play'; } else { lp.start(); }
  });

  /* ------------------------------------------------------------------ 3. bohr */
  A.register('bohr', function (root, k) {
    var h = k.h, s = k.s;
    var CX = 150, CY = 150;
    function orbitR(n) { return 20 + 22 * (n - 1); }
    function energy(n) { return -13.6 / (n * n); }

    var svg = s('svg', { viewBox: '0 0 300 300', 'class': 'anim-svg', role: 'img', 'aria-label': 'বোৰ মডেল: ইলেক্ট্ৰনৰ শক্তিস্তৰ আৰু ফ\'টন' });
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
    function info() {
      var dE = Math.abs(energy(to) - energy(from)), nm = dE ? 1240 / dE : 0;
      return { dE: dE, nm: nm, color: nm ? wavelengthColor(nm) : null, lowN: Math.min(from, to), emit: to < from };
    }
    var SERIES = { 1: 'লাইমেন (Lyman)', 2: 'বাল্মাৰ (Balmer)', 3: 'পাশ্চেন (Paschen)', 4: 'ব্ৰেকেট (Brackett)', 5: 'ফাণ্ড (Pfund)' };

    var readout = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paintReadout() {
      if (from === to) { readout.innerHTML = 'দুটা বেলেগ স্তৰ বাছনি কৰক।'; return; }
      var i = info();
      var region = i.color ? '<span class="dot" style="background:' + i.color + '"></span>দৃশ্যমান আলো' : (i.nm < 380 ? 'অতিবেঙুনীয়া (UV) — অদৃশ্য' : 'অৱলোহিত (IR) — অদৃশ্য');
      readout.innerHTML =
        'E<sub>' + from + '</sub> = ' + energy(from).toFixed(2) + ' eV, E<sub>' + to + '</sub> = ' + energy(to).toFixed(2) + ' eV<br>' +
        '|ΔE| = <b>' + i.dE.toFixed(2) + ' eV</b> · λ = 1240 / ΔE ≈ <b>' + i.nm.toFixed(0) + ' nm</b> · ' + region + '<br>' +
        (i.emit ? 'শক্তি <b>বিকিৰণ</b> (emission)' : 'শক্তি <b>শোষণ</b> (absorption)') + ' · ' + (SERIES[i.lowN] || '') + ' শ্ৰেণী';
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

    function place() {
      electron.setAttribute('cx', CX + eRadius * Math.cos(ePhase));
      electron.setAttribute('cy', CY + eRadius * Math.sin(ePhase));
    }

    function tick(dt) {
      ePhase += (mode === 'jump' ? 6 : 2.2 / Math.sqrt(from)) * dt;
      mt += dt;
      var emit = to < from, ang = ph;
      if (mode === 'photon-in') {              /* absorption: photon comes in, then electron jumps up */
        var r0 = orbitR(from) + 130 - mt * 200;
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
        var r0 = orbitR(from) + mt * 160;
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
      ph = ePhase;                                     /* photon appears along the electron's current direction */
      mt = 0;
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
    else { /* still play the jump when the user presses the button */ }
  });

  /* ------------------------------------------------------------------ 4. quantum-explorer */
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
          h('div', {}, [h('div', { 'class': 'orb-boxes' }, boxes), h('small', { text: (2 * l + 1) + 'টা কক্ষক · সৰ্বাধিক ' + (2 * (2 * l + 1)) + 'টা ইলেক্ট্ৰন' })])
        ]));
      }
      summary.innerHTML = 'n = <b>' + n + '</b>: l ৰ মান 0 ৰ পৰা ' + (n - 1) + ' লৈ → <b>' + n + 'টা উপকক্ষ</b><br>' +
        'মুঠ কক্ষক = n² = <b>' + orbitals + '</b> · সৰ্বাধিক ইলেক্ট্ৰন = 2n² = <b>' + (2 * orbitals) + '</b>';
    }
    var sl = k.slider('n', 1, 4, 1, 3, render);
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(tree); root.appendChild(summary);
    render(3);
  });

  /* ------------------------------------------------------------------ 5. orbitals (3-D point cloud) */
  A.register('orbitals', function (root, k) {
    var h = k.h;
    var SIZE = 320, R = 120, N = 3400;
    var canvas = h('canvas', { 'class': 'anim-canvas drag', role: 'img', 'aria-label': 'কক্ষকৰ ত্ৰিমাত্ৰিক আকৃতি' });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, SIZE, SIZE);

    var DEFS = {
      '1s':  { f: function () { return 1; }, scale: .62, l: 0, ml: '0', shape: 'গোলাকাৰ' },
      '2px': { f: function (x) { return x; }, scale: 1, l: 1, ml: '−1, 0, +1', shape: 'ডাম্বেল (x অক্ষৰ দিশত)' },
      '2py': { f: function (x, y) { return y; }, scale: 1, l: 1, ml: '−1, 0, +1', shape: 'ডাম্বেল (y অক্ষৰ দিশত)' },
      '2pz': { f: function (x, y, z) { return z; }, scale: 1, l: 1, ml: '−1, 0, +1', shape: 'ডাম্বেল (z অক্ষৰ দিশত)' },
      '3dxy':   { f: function (x, y) { return 2 * x * y; }, scale: 1, l: 2, ml: '−2, −1, 0, +1, +2', shape: 'চাৰিপাহিযুক্ত, অক্ষৰ মাজত' },
      '3dyz':   { f: function (x, y, z) { return 2 * y * z; }, scale: 1, l: 2, ml: '−2 … +2', shape: 'চাৰিপাহিযুক্ত, অক্ষৰ মাজত' },
      '3dxz':   { f: function (x, y, z) { return 2 * x * z; }, scale: 1, l: 2, ml: '−2 … +2', shape: 'চাৰিপাহিযুক্ত, অক্ষৰ মাজত' },
      '3dx²−y²': { f: function (x, y) { return x * x - y * y; }, scale: 1, l: 2, ml: '−2 … +2', shape: 'চাৰিপাহিযুক্ত, অক্ষৰ ওপৰত' },
      '3dz²':   { f: function (x, y, z) { return (3 * z * z - 1) / 2; }, scale: 1, l: 2, ml: '−2 … +2', shape: 'z-অক্ষৰ দিশত ডাম্বেল আৰু মাজত এটা আঙঠি' }
    };
    var ORDER = ['1s', '2px', '2py', '2pz', '3dxy', '3dyz', '3dxz', '3dx²−y²', '3dz²'];
    var current = '2pz';

    /* unit directions on a sphere (Fibonacci lattice) */
    var dirs = [];
    var ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var yy = 1 - 2 * (i + .5) / N, rr = Math.sqrt(1 - yy * yy), th = ga * i;
      dirs.push([rr * Math.cos(th), yy, rr * Math.sin(th)]);
    }
    var ax = -0.45, ay = 0.6, dragging = false, lastX = 0, lastY = 0;

    function draw() {
      var bg = k.cssVar('--canvas'), pos = k.cssVar('--pos'), neg = k.cssVar('--neg'), txt = k.cssVar('--muted');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, SIZE, SIZE);
      var cx = SIZE / 2, cy = SIZE / 2, def = DEFS[current];
      var ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      function rot(x, y, z) {                     /* rotate about Y then X */
        var x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        var y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        return [x1, y2, z2];
      }
      /* axes */
      ctx.lineWidth = 1; ctx.strokeStyle = txt; ctx.fillStyle = txt; ctx.font = '12px sans-serif'; ctx.globalAlpha = .55;
      [['x', 1, 0, 0], ['y', 0, 1, 0], ['z', 0, 0, 1]].forEach(function (a) {
        var p = rot(a[1] * 135, a[2] * 135, a[3] * 135), q = rot(-a[1] * 135, -a[2] * 135, -a[3] * 135);
        ctx.beginPath(); ctx.moveTo(cx + q[0], cy - q[1]); ctx.lineTo(cx + p[0], cy - p[1]); ctx.stroke();
        ctx.fillText(a[0], cx + p[0] + 4, cy - p[1] - 4);
      });
      ctx.globalAlpha = 1;
      /* points */
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
      info.innerHTML = '<b>' + name + '</b> কক্ষক · l = <b>' + d.l + '</b> (' + sub + ' উপকক্ষ) · m<sub>l</sub> = ' + d.ml + '<br>আকৃতি: ' + d.shape +
        '<br>' + sub + ' উপকক্ষত <b>' + (2 * d.l + 1) + 'টা</b> কক্ষক, সৰ্বাধিক <b>' + (2 * (2 * d.l + 1)) + 'টা</b> ইলেক্ট্ৰন।';
      if (!lp.running) draw();
    }
    var btnRow = h('div', { 'class': 'row' });
    ORDER.forEach(function (n) { buttons[n] = k.button(n, function () { select(n); }); btnRow.appendChild(buttons[n]); });
    root.appendChild(btnRow);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--pos)' }), 'ধনাত্মক চিহ্ন (+)']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--neg)' }), 'ঋণাত্মক চিহ্ন (−)']),
      h('span', { text: 'Drag to rotate' })]));
    root.appendChild(info);
    select(current);
    draw();
    if (!k.reduceMotion) lp.start();
  });

  /* ------------------------------------------------------------------ 6. aufbau */
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
      /* configuration written by shell: 1s 2s 2p 3s 3p 3d 4s 4p, with a noble-gas core */
      var written = ['1s', '2s', '2p', '3s', '3p', '3d', '4s', '4p'];
      var core = z > 18 ? ['[Ar]', ['1s', '2s', '2p', '3s', '3p']] : (z > 10 ? ['[Ne]', ['1s', '2s', '2p']] : (z > 2 ? ['[He]', ['1s']] : null));
      var parts = [];
      if (core) parts.push(core[0]);
      written.forEach(function (n) {
        if (core && core[1].indexOf(n) >= 0) return;
        if (c[n]) parts.push(n + sup(c[n]));
      });
      var exc = (z === 24 || z === 29) ? '<br><b>ব্যতিক্ৰম:</b> ' + (z === 24 ? 'অৰ্ধপূৰ্ণ 3d⁵ স্থিতিশীল, সেয়ে 4s¹ 3d⁵' : 'পূৰ্ণ 3d¹⁰ স্থিতিশীল, সেয়ে 4s¹ 3d¹⁰') : '';
      readout.innerHTML =
        '<b>Z = ' + z + '</b> · ' + el.sym + ' — ' + el.as + ' <span class="en">(' + el.en + ')</span><br>' +
        '<span class="cfg">' + parts.join(' ') + '</span><br>' +
        'অযুগ্ম ইলেক্ট্ৰন: <b>' + up + '</b> · ' + (up ? '<b>পৰাচুম্বকীয়</b> (paramagnetic)' : 'প্ৰতিচুম্বকীয় (diamagnetic)') + exc;
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
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--electron)' }), '↑ ইলেক্ট্ৰন (স্পিন +½)']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--proton)' }), '↓ ইলেক্ট্ৰন (স্পিন −½)']),
      h('span', { text: 'কমলা ঘেৰ = এই ধাপত সলনি হোৱা উপকক্ষ' })]));
    paint();
  });
})();
