/* Animations for Class 12, Chapter 6: Haloalkanes and Haloarenes (হেল\'এলকেন আৰু হেল\'এৰিন).
   Registered: halide-bp, sn-mech, sn-reactivity, chiral, zaitsev, aryl-nitro
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }

  /* ================================================================== 1. boiling points of alkyl halides */
  A.register('halide-bp', function (root, k) {
    var h = k.h, W = 480, H = 290, PL = 56, PR = 14, PT = 16, PB = 46;
    var canvas = h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': L('এলকাইল হেলাইডৰ উতলাংক', 'Boiling points of alkyl halides') });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var BP = { 'CH₃': [249, 277, 316], 'C₂H₅': [285, 311, 345], 'C₃H₇': [320, 344, 375] };
    var BR = [['n-C₄H₉Br', 375, L('শাখাহীন', 'no branch')], ['sec-C₄H₉Br', 364, L('এটা শাখা', 'one branch')], ['tert-C₄H₉Br', 346, L('দুটা শাখা', 'two branches')]];
    var st = { mode: 'halides', g: 'C₂H₅' };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function Y(v) { return H - PB - v / 400 * (H - PT - PB); }
    function draw() {
      var bg = k.cssVar('--canvas'), mu = k.cssVar('--muted'), gr = k.cssVar('--grid'), tx = k.cssVar('--text');
      var cols = [k.cssVar('--proton'), k.cssVar('--electron'), k.cssVar('--alpha')], halX = ['Cl', 'Br', 'I'];
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = gr; ctx.lineWidth = 1; ctx.fillStyle = mu; ctx.font = '11px sans-serif';
      for (var i = 0; i <= 4; i++) { var v = i * 100; ctx.beginPath(); ctx.moveTo(PL, Y(v)); ctx.lineTo(W - PR, Y(v)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(v, PL - 6, Y(v) + 4); ctx.textAlign = 'start'; }
      ctx.strokeStyle = mu; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, H - PB); ctx.lineTo(W - PR, H - PB); ctx.stroke();
      ctx.save(); ctx.translate(14, H / 2 + 30); ctx.rotate(-Math.PI / 2); ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.fillText(L('উতলাংক (K)', 'Boiling point (K)'), 0, 0); ctx.restore();
      ctx.font = '600 12px "Noto Sans Bengali", sans-serif'; ctx.textAlign = 'center';
      if (st.mode === 'halides') {
        var gs = Object.keys(BP), gw = (W - PL - PR) / gs.length;
        gs.forEach(function (g, gi) {
          var on = g === st.g;
          BP[g].forEach(function (b, j) {
            var bw = gw / 5, x = PL + gi * gw + gw / 2 + (j - 1) * (bw + 4) - bw / 2;
            ctx.globalAlpha = on ? 1 : 0.4; ctx.fillStyle = cols[j]; ctx.fillRect(x, Y(b), bw, H - PB - Y(b));
            ctx.globalAlpha = 1; ctx.fillStyle = tx; ctx.font = '11px sans-serif'; ctx.fillText(b, x + bw / 2, Y(b) - 4);
          });
          ctx.font = (on ? '700 ' : '500 ') + '13px sans-serif'; ctx.fillStyle = tx; ctx.fillText(g + '–X', PL + gi * gw + gw / 2, H - PB + 18);
        });
        halX.forEach(function (x, j) { ctx.fillStyle = cols[j]; ctx.fillRect(W - PR - 200 + j * 66, H - 14, 10, 10); ctx.fillStyle = tx; ctx.font = '11px sans-serif'; ctx.textAlign = 'start'; ctx.fillText('X = ' + x, W - PR - 186 + j * 66, H - 5); ctx.textAlign = 'center'; });
      } else {
        var bw2 = 70, gw2 = (W - PL - PR) / 3;
        BR.forEach(function (b, j) {
          var x = PL + j * gw2 + gw2 / 2 - bw2 / 2;
          ctx.fillStyle = cols[1]; ctx.globalAlpha = 1 - j * 0.18; ctx.fillRect(x, Y(b[1]), bw2, H - PB - Y(b[1])); ctx.globalAlpha = 1;
          ctx.fillStyle = tx; ctx.font = '12px sans-serif'; ctx.fillText(b[1] + ' K', x + bw2 / 2, Y(b[1]) - 5);
          ctx.fillText(b[0], x + bw2 / 2, H - PB + 16); ctx.fillStyle = mu; ctx.font = '11px "Noto Sans Bengali", sans-serif'; ctx.fillText(b[2], x + bw2 / 2, H - PB + 31);
        });
      }
      ctx.textAlign = 'start';
    }
    function paint() {
      if (st.mode === 'halides') {
        var b = BP[st.g];
        info.innerHTML = '<b>' + st.g + '–X</b>: ' + 'Cl <b>' + b[0] + ' K</b> · Br <b>' + b[1] + ' K</b> · I <b>' + b[2] + ' K</b><br>' +
          L('উতলাংকৰ ক্ৰম: R–I > R–Br > R–Cl (> R–F)। হেল\'জেনৰ আকাৰ বাঢ়িলে ভেন ডাৰ ৱালছ বল বাঢ়ে। থূপৰ আকাৰ বাঢ়িলেও উতলাংক বাঢ়ে।', 'Order of boiling points: R–I > R–Br > R–Cl (> R–F). The larger the halogen, the stronger the van der Waals forces. A larger alkyl group also raises the boiling point.');
      } else {
        info.innerHTML = L('বিউটাইল ব্ৰ\'মাইডৰ সমযোগী: শাখা বঢ়িলে অণু গোলাকাৰ হয়, পৃষ্ঠকালি কমে আৰু ভেন ডাৰ ৱালছ বল কমে — গতিকে উতলাংক 375 K → 364 K → 346 K।',
          'Isomers of butyl bromide: more branching makes the molecule more spherical, reduces the surface area and the van der Waals forces — so the boiling point falls 375 K → 364 K → 346 K.');
      }
      draw();
    }
    var gs = k.select('Alkyl group', Object.keys(BP).map(function (g) { return { value: g, label: g + '–X' }; }), st.g, function (v) { st.g = v; st.mode = 'halides'; mb(); paint(); });
    var b1 = k.button('Halides', function () { st.mode = 'halides'; mb(); paint(); }), b2 = k.button('Branching', function () { st.mode = 'branch'; mb(); paint(); });
    function mb() { b1.setAttribute('aria-pressed', String(st.mode === 'halides')); b2.setAttribute('aria-pressed', String(st.mode === 'branch')); }
    root.appendChild(h('div', { 'class': 'row' }, [b1, b2, gs.el]));
    root.appendChild(info);
    mb(); paint();
  });

  /* ================================================================== 2. SN2 / SN1 mechanisms */
  A.register('sn-mech', function (root, k) {
    var h = k.h, s = k.s, mode = 'sn2', stage = 0, prog = 0, tgt = 0;
    var svg = s('svg', { viewBox: '0 0 400 230', 'class': 'anim-svg', role: 'img', 'aria-label': L('SN2 আৰু SN1 ক্ৰিয়াবিধি', 'SN2 and SN1 mechanisms') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var COL = { a: '#e67e22', b: '#2e9e5b', c: '#3b82f6' };
    function mol(g, cx, cy, dx, nuX, nuSolid, xX, xSolid, alpha, charge, nuLabel) {
      var C = [cx, cy], subs = [['a', cx + dx, cy - 38], ['b', cx + dx - 16, cy + 30], ['c', cx + dx + 16, cy + 30]];
      var grp = s('g', { opacity: alpha });
      subs.forEach(function (p) {
        grp.appendChild(s('line', { x1: C[0], y1: C[1], x2: p[1], y2: p[2], style: 'stroke:var(--text)', 'stroke-width': 2 }));
        grp.appendChild(s('circle', { cx: p[1], cy: p[2], r: 9, style: 'fill:' + COL[p[0]] }));
        grp.appendChild(txt(s, p[1], p[2] + 3.5, 10, 'middle', 'fill:#fff', p[0], 700));
      });
      if (nuX !== null) {
        grp.appendChild(s('line', { x1: C[0], y1: C[1], x2: nuX, y2: C[1], style: 'stroke:var(--text)', 'stroke-width': 2, 'stroke-dasharray': nuSolid ? '' : '4 3' }));
        grp.appendChild(s('circle', { cx: nuX, cy: C[1], r: 12, style: 'fill:var(--proton)' }));
        grp.appendChild(txt(s, nuX, C[1] + 4, 11, 'middle', 'fill:#fff', nuLabel || 'Nu', 700));
      }
      if (xX !== null) {
        grp.appendChild(s('line', { x1: C[0], y1: C[1], x2: xX, y2: C[1], style: 'stroke:var(--text)', 'stroke-width': 2, 'stroke-dasharray': xSolid ? '' : '4 3' }));
        grp.appendChild(s('circle', { cx: xX, cy: C[1], r: 12, style: 'fill:var(--alpha)' }));
        grp.appendChild(txt(s, xX, C[1] + 4, 11, 'middle', 'fill:#fff', 'X', 700));
      }
      grp.appendChild(s('circle', { cx: C[0], cy: C[1], r: 10, style: 'fill:var(--text)' }));
      grp.appendChild(txt(s, C[0], C[1] + 4, 11, 'middle', 'fill:var(--canvas)', 'C', 700));
      if (charge) grp.appendChild(txt(s, C[0] + 6, C[1] - 14, 13, 'start', 'fill:var(--proton)', '+', 700));
      g.appendChild(grp);
    }
    function build() {
      svg.innerHTML = '';
      var g = s('g'); svg.appendChild(g);
      var cap = function (t, y) { svg.appendChild(txt(s, 200, y || 200, 12, 'middle', 'fill:var(--muted)', t, 600)); };
      if (mode === 'sn2') {
        var u = prog;   /* 0..2 : reactants -> transition state -> product */
        var dx = (u <= 1 ? -22 + 22 * u : 22 * (u - 1)) * 1.2;
        var nuPos = u <= 1 ? 24 + u * 80 : 104 + (u - 1) * 6;
        var xPos = u <= 1 ? 260 : 260 + (u - 1) * 110;
        mol(g, 200, 100, dx, nuPos, u >= 1.6, xPos, u < 1, 1, false);
        if (u > 1.5) svg.appendChild(txt(s, 350, 145, 11, 'middle', 'fill:var(--muted)', 'X⁻'));
        cap(stage === 0 ? L('বিক্ৰিয়ক: নিউক্লিঅ\'ফাইল পিছফালৰ পৰা আহিছে', 'Reactants: the nucleophile approaches from the back') :
          (stage === 1 ? L('সংক্ৰমণ অৱস্থা: পাঁচডাল বান্ধনি, a·b·c একেখন সমতলত', 'Transition state: five bonds, a·b·c in one plane') :
            L('উৎপাদ: a·b·c ওলোটা দিশত — দিকবিন্যাসৰ প্ৰতীপণ', 'Product: a·b·c now point the other way — inversion')));
      } else if (stage === 0) {
        mol(g, 200, 100, -22, null, false, 270, true, 1, false);
        cap(L('প্ৰথম খাপৰ আগতে: sp³ কাৰ্বনত X', 'Before step 1: X on an sp³ carbon'));
      } else if (stage === 1) {
        mol(g, 200, 100, 0, null, false, 300, false, 1, true);
        svg.appendChild(txt(s, 330, 78, 11, 'middle', 'fill:var(--muted)', 'X⁻'));
        cap(L('প্ৰথম খাপ (লেহেমীয়া): সমতলীয় sp² কাৰ্বকেটায়ন', 'Step 1 (slow): planar sp² carbocation'));
      } else {
        mol(g, 190, 55, 22, 90, true, null, false, 1, false);
        mol(g, 190, 150, -22, 290, true, null, false, 1, false);
        svg.appendChild(txt(s, 8, 14, 10, 'start', 'fill:var(--muted)', L('বাওঁফালৰ আক্ৰমণ (50 %)', 'attack from the left (50 %)')));
        svg.appendChild(txt(s, 392, 206, 10, 'end', 'fill:var(--muted)', L('সোঁফালৰ আক্ৰমণ (50 %)', 'attack from the right (50 %)')));
        cap(L('দ্বিতীয় খাপ (দ্ৰুত): দুয়োফালৰ পৰা সমান সম্ভাৱনা → ৰেছিমীয় মিশ্ৰ', 'Step 2 (fast): equal chance from both sides → racemic mixture'), 224);
      }
    }
    function paint() {
      var steps = 3;
      info.innerHTML = (mode === 'sn2' ?
        L('<b>SN2</b> — এটা খাপ; গতিবেগ = k [R–X][Nu⁻] (দ্বিতীয় ক্ৰম); দিকবিন্যাসৰ <b>প্ৰতীপণ</b>; CH₃X > 1° > 2° > 3°।', '<b>SN2</b> — one step; rate = k [R–X][Nu⁻] (second order); <b>inversion</b> of configuration; CH₃X > 1° > 2° > 3°.') :
        L('<b>SN1</b> — দুটা খাপ; গতিবেগ = k [R–X] (প্ৰথম ক্ৰম); কাৰ্বকেটায়ন মধ্যৱৰ্তী; <b>ৰেছিমীয়কৰণ</b>; 3° > 2° > 1° > CH₃X।', '<b>SN1</b> — two steps; rate = k [R–X] (first order); carbocation intermediate; <b>racemisation</b>; 3° > 2° > 1° > CH₃X.')) +
        '<br>' + L('ধাপ ', 'Stage ') + (stage + 1) + ' / ' + steps;
    }
    function tick(dt) {
      if (Math.abs(prog - tgt) > 0.005) { prog += clamp(tgt - prog, -dt * 1.6, dt * 1.6); build(); }
    }
    function go(m) { mode = m; stage = 0; prog = tgt = 0; mb(); build(); paint(); }
    var bA = k.button('SN2', function () { go('sn2'); }), bB = k.button('SN1', function () { go('sn1'); });
    function mb() { bA.setAttribute('aria-pressed', String(mode === 'sn2')); bB.setAttribute('aria-pressed', String(mode === 'sn1')); }
    var nx = k.button('Next step', function () { stage = (stage + 1) % 3; tgt = stage; if (k.reduceMotion) prog = tgt; build(); paint(); }, 'primary');
    var rs = k.button('Reset', function () { stage = 0; prog = tgt = 0; build(); paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [bA, bB, nx, rs]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [h('span', { text: L('a, b, c = কেন্দ্ৰীয় কাৰ্বনৰ তিনিটা থূপ', 'a, b, c = the three other groups on the central carbon') })]));
    var lp = k.loop(root, tick);
    mb(); build(); paint(); lp.start();
  });

  /* ================================================================== 3. relative reactivity in SN2 / SN1 */
  A.register('sn-reactivity', function (root, k) {
    var h = k.h, s = k.s;
    var SUB = [['CH₃–X', L('মিথাইল', 'methyl')], ['CH₃CH₂–X', L('প্ৰাইমাৰি', 'primary')], ['(CH₃)₂CH–X', L('ছেকেণ্ডাৰি', 'secondary')], ['(CH₃)₃C–X', L('টাৰছিয়েৰি', 'tertiary')]];
    var RATE = { sn2: [30, 1, 0.02, 0.0005], sn1: [0.5, 1, 45, 1.4e8] };
    var LG = { I: ['I', 3, '—'], Br: ['Br', 1, '—'], Cl: ['Cl', 0.03, '—'], F: ['F', 1e-5, '—'] };
    var st = { m: 'sn2', lg: 'Br' };
    var svg = s('svg', { viewBox: '0 0 420 230', 'class': 'anim-svg', role: 'img', 'aria-label': L('এলকাইল হেলাইডৰ আপেক্ষিক সক্ৰিয়তা', 'Relative reactivity of alkyl halides') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function fmt(v) { return v >= 1000 || v < 0.001 ? v.toExponential(1).replace('e+', ' × 10^').replace('e-', ' × 10^-') : String(+v.toPrecision(2)); }
    function paint() {
      svg.innerHTML = '';
      var vals = RATE[st.m].map(function (v) { return v * LG[st.lg][1]; });
      var lo = -7, hi = 9;
      svg.appendChild(txt(s, 10, 16, 11, 'start', 'fill:var(--muted)', L('আপেক্ষিক গতিবেগ (লগ স্কেল)', 'Relative rate (log scale)')));
      SUB.forEach(function (sb, i) {
        var y = 34 + i * 46, v = vals[i], w = clamp((Math.log10(v) - lo) / (hi - lo), 0.01, 1) * 230;
        svg.appendChild(s('rect', { x: 130, y: y, width: 230, height: 26, rx: 4, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 130, y: y, width: w, height: 26, rx: 4, style: 'fill:' + (st.m === 'sn2' ? 'var(--electron)' : 'var(--alpha)') }));
        svg.appendChild(txt(s, 124, y + 12, 12, 'end', 'fill:var(--text)', sb[0], 600));
        svg.appendChild(txt(s, 124, y + 24, 10, 'end', 'fill:var(--muted)', sb[1]));
        svg.appendChild(txt(s, 366, y + 17, 11, 'start', 'fill:var(--text)', fmt(v)));
      });
      info.innerHTML = (st.m === 'sn2' ?
        L('<b>SN2:</b> ষ্টেৰিক বাধা যিমান বেছি সিমান লেহেমীয়া — CH₃X (30) > 1° (1) > 2° (0.02) > 3° (≈ 0)। নিউক্লিঅ\'ফাইলে পিছফালৰ পৰা আক্ৰমণ কৰাত বাধা পায়।', '<b>SN2:</b> the more steric hindrance, the slower — CH₃X (30) > 1° (1) > 2° (0.02) > 3° (≈ 0). The nucleophile is blocked from attacking from the back.') :
        L('<b>SN1:</b> কাৰ্বকেটায়ন যিমান সুস্থিৰ সিমান দ্ৰুত — 3° > 2° > 1° > CH₃X। (মানবোৰ আনুমানিক, শিক্ষণীয় উদ্দেশ্যে।)', '<b>SN1:</b> the more stable the carbocation, the faster — 3° > 2° > 1° > CH₃X. (Values are approximate, for illustration.)')) +
        '<br>' + L('স্থানত্যাগী মূলক: ', 'Leaving group: ') + '<b>' + st.lg + '</b> ' + L('(R–I > R–Br > R–Cl > R–F সকলো ক্ষেত্ৰতে)', '(R–I > R–Br > R–Cl > R–F in both mechanisms)');
    }
    var mb = k.button('SN2', function () { st.m = 'sn2'; pb(); paint(); }), mc = k.button('SN1', function () { st.m = 'sn1'; pb(); paint(); });
    function pb() { mb.setAttribute('aria-pressed', String(st.m === 'sn2')); mc.setAttribute('aria-pressed', String(st.m === 'sn1')); }
    var ls = k.select('Leaving group', Object.keys(LG).map(function (x) { return { value: x, label: x + (x === 'I' ? ' (best)' : '') }; }), st.lg, function (v) { st.lg = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [mb, mc, ls.el]));
    root.appendChild(info);
    pb(); paint();
  });

  /* ================================================================== 4. chirality and optical rotation */
  A.register('chiral', function (root, k) {
    var h = k.h, s = k.s;
    var MOL = [
      { n: L('বিউটেন-2-অল', 'Butan-2-ol'), g: ['H', 'OH', 'CH₃', 'C₂H₅'] },
      { n: L('2-ক্ল\'ৰ\'বিউটেন', '2-Chlorobutane'), g: ['H', 'Cl', 'CH₃', 'C₂H₅'] },
      { n: L('2-ব্ৰ\'ম\'প্ৰ\'পানয়িক এছিড', '2-Bromopropanoic acid'), g: ['H', 'Br', 'CH₃', 'COOH'] },
      { n: 'CHBrClI', g: ['H', 'Br', 'Cl', 'I'] },
      { n: L('প্ৰ\'পেন-2-অল', 'Propan-2-ol'), g: ['H', 'OH', 'CH₃', 'CH₃'] },
      { n: L('2-ক্ল\'ৰ\'প্ৰ\'পেন', '2-Chloropropane'), g: ['H', 'Cl', 'CH₃', 'CH₃'] },
      { n: L('ইথানল', 'Ethanol'), g: ['H', 'H', 'CH₃', 'OH'] }
    ];
    var st = { i: 0, f: 100 }, ALPHA = 20;
    var svg = s('svg', { viewBox: '0 0 420 240', 'class': 'anim-svg', role: 'img', 'aria-label': L('কিৰেল অণু, দাপোণ প্ৰতিবিম্ব আৰু আলোক ঘূৰ্ণন', 'A chiral molecule, its mirror image and optical rotation') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var POS = [[0, -46], [-44, 22], [44, 22], [0, 50]];   /* top, left, right, bottom */
    function drawMol(cx, cy, g, mirror, dup) {
      var grp = s('g');
      for (var i = 0; i < 4; i++) {
        var p = POS[i], x = cx + (mirror && (i === 1 || i === 2) ? -p[0] : p[0]);
        if (mirror && i === 1) x = cx + POS[2][0]; if (mirror && i === 2) x = cx + POS[1][0];
        var y = cy + p[1], same = dup && g[i] === dup;
        grp.appendChild(s('line', { x1: cx, y1: cy, x2: x, y2: y, style: 'stroke:var(--text)', 'stroke-width': 2 }));
        grp.appendChild(s('circle', { cx: x, cy: y, r: 15, style: 'fill:' + (same ? 'var(--muted)' : 'var(--electron)') + ';opacity:' + (same ? .6 : .9) }));
        grp.appendChild(txt(s, x, y + 4, g[i].length > 3 ? 9 : 11, 'middle', 'fill:#fff', g[i], 700));
      }
      grp.appendChild(s('circle', { cx: cx, cy: cy, r: 9, style: 'fill:var(--text)' }));
      grp.appendChild(txt(s, cx, cy + 4, 10, 'middle', 'fill:var(--canvas)', 'C', 700));
      svg.appendChild(grp);
    }
    function paint() {
      var m = MOL[st.i], g = m.g, dup = null;
      for (var a = 0; a < 4; a++) for (var b = a + 1; b < 4; b++) if (g[a] === g[b]) dup = g[a];
      var chiral = dup === null;
      svg.innerHTML = '';
      drawMol(90, 100, g, false, dup);
      svg.appendChild(s('line', { x1: 175, y1: 28, x2: 175, y2: 180, style: 'stroke:var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '5 4' }));
      svg.appendChild(txt(s, 175, 20, 10, 'middle', 'fill:var(--muted)', L('দাপোণ', 'mirror')));
      drawMol(260, 100, g, true, dup);
      svg.appendChild(txt(s, 90, 176, 11, 'middle', 'fill:var(--text)', m.n, 600));
      svg.appendChild(txt(s, 260, 176, 11, 'middle', 'fill:var(--muted)', L('দাপোণ প্ৰতিবিম্ব', 'mirror image')));
      /* polarimeter dial */
      var obs = chiral ? ALPHA * (2 * st.f / 100 - 1) : 0, cx = 360, cy = 105;
      svg.appendChild(s('circle', { cx: cx, cy: cy, r: 42, fill: 'none', style: 'stroke:var(--muted)', 'stroke-width': 2 }));
      svg.appendChild(s('line', { x1: cx, y1: cy, x2: cx + 38 * Math.sin(obs * 2 * TAU / 360), y2: cy - 38 * Math.cos(obs * 2 * TAU / 360), style: 'stroke:var(--proton)', 'stroke-width': 3 }));
      svg.appendChild(txt(s, cx, cy + 62, 12, 'middle', 'fill:var(--text)', L('ঘূৰ্ণন', 'rotation') + ' ' + (obs > 0 ? '+' : '') + obs.toFixed(1) + '°', 700));
      var verdict = chiral ? L('এই অণুটো <b>কিৰেল</b> — C-2 অপ্ৰতিসম (চাৰিটা বেলেগ থূপ); দাপোণ প্ৰতিবিম্ব সমাৰোপণযোগ্য নহয় (ইনানছিঅ\'মাৰ)।', 'This molecule is <b>chiral</b> — C-2 is asymmetric (four different groups); the mirror image cannot be superimposed (enantiomers).')
        : L('এই অণুটো <b>অকিৰেল</b> — দুটা থূপ একে (' + dup + '); দাপোণ প্ৰতিবিম্ব সমাৰোপণযোগ্য, গতিকে আলোক নিষ্ক্ৰিয়।', 'This molecule is <b>achiral</b> — two groups are the same (' + dup + '); the mirror image is superimposable, so it is optically inactive.');
      var extra = '';
      if (chiral) {
        extra = '<br>' + L('(+) ইনানছিঅ\'মাৰ ', '(+) enantiomer ') + '<b>' + st.f + ' %</b> · (−) <b>' + (100 - st.f) + ' %</b> → ' +
          (st.f === 50 ? L('<b>ৰেছিমীয় মিশ্ৰ — ঘূৰ্ণন শূন্য</b>', '<b>racemic mixture — rotation zero</b>') :
            L('শুদ্ধ ইনানছিঅ\'মাৰৰ ঘূৰ্ণন ±' + ALPHA + '° (উদাহৰণ)', 'a pure enantiomer rotates ±' + ALPHA + '° (example)'));
      }
      info.innerHTML = verdict + extra;
    }
    var ms = k.select('Molecule', MOL.map(function (m, i) { return { value: i, label: m.n }; }), st.i, function (v) { st.i = +v; paint(); });
    var fs = k.slider('(+) enantiomer %', 0, 100, 5, st.f, function (v) { st.f = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [ms.el, fs.el]));
    root.appendChild(h('div', { 'class': 'row' }, [k.button('Make racemic (50 : 50)', function () { st.f = 50; fs.input.value = 50; fs.out.textContent = 50; paint(); })]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. Zaitsev's rule */
  A.register('zaitsev', function (root, k) {
    var h = k.h, s = k.s;
    var RX = {
      pent: { n: L('2-ব্ৰ\'ম\'পেণ্টেন', '2-bromopentane'), p: [['CH₃CH=CHCH₂CH₃', L('পেণ্ট-2-ইন', 'pent-2-ene'), 2, 81, 40], ['CH₂=CHCH₂CH₂CH₃', L('পেণ্ট-1-ইন', 'pent-1-ene'), 1, 19, 55]] },
      but: { n: L('2-ব্ৰ\'ম\'বিউটেন', '2-bromobutane'), p: [['CH₃CH=CHCH₃', L('বিউট-2-ইন', 'but-2-ene'), 2, 81, 47], ['CH₂=CHCH₂CH₃', L('বিউট-1-ইন', 'but-1-ene'), 1, 19, 53]] },
      mbut: { n: L('2-ব্ৰ\'ম\'-2-মিথাইলবিউটেন', '2-bromo-2-methylbutane'), p: [['(CH₃)₂C=CHCH₃', L('2-মিথাইলবিউট-2-ইন', '2-methylbut-2-ene'), 3, 70, 28], ['CH₂=C(CH₃)CH₂CH₃', L('2-মিথাইলবিউট-1-ইন', '2-methylbut-1-ene'), 1, 30, 72]] },
      pent3: { n: L('3-ব্ৰ\'ম\'পেণ্টেন', '3-bromopentane'), p: [['CH₃CH=CHCH₂CH₃', L('পেণ্ট-2-ইন (কেৱল এটা)', 'pent-2-ene (only one)'), 2, 100, 100]] }
    };
    var st = { r: 'pent', base: 'koh' };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('অপসাৰণ বিক্ৰিয়াত উৎপাদৰ অনুপাত', 'Product ratio in an elimination reaction') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var rx = RX[st.r], bulky = st.base === 'bulky';
      svg.innerHTML = '';
      svg.appendChild(txt(s, 10, 18, 13, 'start', 'fill:var(--text)', rx.n + '  →  ' + (bulky ? 'tert-BuOK' : 'KOH (alc.)') + ', Δ', 700));
      rx.p.forEach(function (p, i) {
        var pct = bulky ? p[4] : p[3], y = 40 + i * 70;
        svg.appendChild(txt(s, 10, y + 10, 13, 'start', 'fill:var(--text)', p[0], 600));
        svg.appendChild(txt(s, 10, y + 28, 11, 'start', 'fill:var(--muted)', p[1] + ' · ' + L('C=C ত ' + p[2] + ' টা এলকাইল থূপ', p[2] + ' alkyl group(s) on C=C')));
        svg.appendChild(s('rect', { x: 10, y: y + 36, width: 380, height: 16, rx: 4, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 10, y: y + 36, width: 380 * pct / 100, height: 16, rx: 4, style: 'fill:' + (p[2] >= 2 ? 'var(--brand)' : 'var(--alpha)') }));
        svg.appendChild(txt(s, 10 + 380 * pct / 100 + (pct > 90 ? -6 : 6), y + 49, 11, pct > 90 ? 'end' : 'start', pct > 90 ? 'fill:#fff' : 'fill:var(--text)', pct + ' %', 700));
      });
      info.innerHTML = (rx.p.length === 1 ? L('দুয়োফালৰ β-হাইড্ৰ\'জেন একে, গতিকে মাথোন এটা এলকিন।', 'The β-hydrogens on both sides are equivalent, so only one alkene forms.') :
        (bulky ? L('ডাঙৰ আকাৰৰ ক্ষাৰকে (tert-BuOK) কম বাধাৰ β-হাইড্ৰ\'জেন টানে, সেয়ে কম প্ৰতিস্থাপিত এলকিনৰ ভাগ বাঢ়ে (জেইটচেভৰ ব্যতিক্ৰম)।', 'A bulky base (tert-BuOK) pulls off the less hindered β-hydrogen, so the share of the less substituted alkene rises (an exception to Zaitsev).') :
          L('জেইটচেভৰ সূত্ৰ: অধিক এলকাইল থূপযুক্ত (অধিক সুস্থিৰ) এলকিনেই মুখ্য উৎপাদ।', "Zaitsev's rule: the alkene with more alkyl groups on C=C (more stable) is the major product."))) +
        '<br><span class="en">' + L('(শতাংশবোৰ আনুমানিক; পেণ্টেনৰ ক্ষেত্ৰত পাঠ্যপুথিৰ মান।)', '(Percentages are approximate; the pentane values are those of the textbook.)') + '</span>';
    }
    var rs = k.select('Halide', Object.keys(RX).map(function (x) { return { value: x, label: RX[x].n }; }), st.r, function (v) { st.r = v; paint(); });
    var bs = k.select('Base', [{ value: 'koh', label: 'KOH (alcoholic)' }, { value: 'bulky', label: 'tert-BuOK (bulky)' }], st.base, function (v) { st.base = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [rs.el, bs.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. –NO2 and nucleophilic substitution of aryl halides */
  A.register('aryl-nitro', function (root, k) {
    var h = k.h, s = k.s;
    var CASES = [
      { n: L('ক্ল\'ৰ\'বেনজিন', 'Chlorobenzene'), no2: [], T: '623 K, 300 atm', t: 623 },
      { n: L('m-নাইট্ৰ\'ক্ল\'ৰ\'বেনজিন', 'm-nitrochlorobenzene'), no2: [3], T: '≈ 623 K', t: 623 },
      { n: L('p-নাইট্ৰ\'ক্ল\'ৰ\'বেনজিন', 'p-nitrochlorobenzene'), no2: [4], T: '443 K', t: 443 },
      { n: L('2,4-ডাইনাইট্ৰ\'ক্ল\'ৰ\'বেনজিন', '2,4-dinitrochlorobenzene'), no2: [2, 4], T: '368 K', t: 368 },
      { n: L('2,4,6-ট্ৰাইনাইট্ৰ\'ক্ল\'ৰ\'বেনজিন', '2,4,6-trinitrochlorobenzene'), no2: [2, 4, 6], T: L('গৰম পানী (≈ 330 K)', 'warm water (≈ 330 K)'), t: 330 }
    ];
    var st = { i: 0 };
    var svg = s('svg', { viewBox: '0 0 420 230', 'class': 'anim-svg', role: 'img', 'aria-label': L('–NO₂ মূলকে হেল\'এৰিনৰ সক্ৰিয়তা বঢ়ায়', 'An –NO₂ group increases the reactivity of a haloarene') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = CASES[st.i]; svg.innerHTML = '';
      var cx = 100, cy = 112, R = 52, pts = [];
      for (var i = 0; i < 6; i++) { var a = -Math.PI / 2 + i * TAU / 6; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a), a]); }
      svg.appendChild(s('polygon', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2.5 }));
      svg.appendChild(s('circle', { cx: cx, cy: cy, r: R * 0.6, fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 1.5 }));
      function sub(i, label, color) {
        var p = pts[i], x = cx + (R + 34) * Math.cos(p[2]), y = cy + (R + 34) * Math.sin(p[2]);
        svg.appendChild(s('line', { x1: p[0], y1: p[1], x2: x, y2: y, style: 'stroke:var(--text)', 'stroke-width': 2 }));
        svg.appendChild(s('circle', { cx: x, cy: y, r: 15, style: 'fill:' + color }));
        svg.appendChild(txt(s, x, y + 4, label.length > 3 ? 9 : 11, 'middle', 'fill:#fff', label, 700));
      }
      sub(0, 'Cl', 'var(--proton)');
      c.no2.forEach(function (pos) { sub(pos - 1 === 0 ? 0 : pos - 1, 'NO₂', 'var(--electron)'); });
      var activ = c.no2.filter(function (p) { return p === 2 || p === 4 || p === 6; }).length;
      /* ortho (2,6) and para (4) positions carry the negative charge in the intermediate */
      [1, 3, 5].forEach(function (i) {
        var p = pts[i], on = c.no2.indexOf(i + 1) >= 0, x = p[0] + 12 * Math.cos(p[2] - 0.5), y = p[1] + 12 * Math.sin(p[2] - 0.5);
        svg.appendChild(txt(s, p[0] + 9 * Math.cos(p[2] + Math.PI), p[1] + 9 * Math.sin(p[2] + Math.PI) + 3, 11, 'middle', 'fill:' + (on ? 'var(--ok)' : 'var(--muted)'), on ? 'δ⁻ ✔' : 'δ⁻', 700));
      });
      /* thermometer */
      var tx = 232, ty0 = 40, th = 150, frac = (c.t - 300) / (650 - 300);
      svg.appendChild(s('rect', { x: tx, y: ty0, width: 22, height: th, rx: 11, style: 'fill:var(--surface-2);stroke:var(--muted)' }));
      svg.appendChild(s('rect', { x: tx + 4, y: ty0 + th - 8 - frac * (th - 16), width: 14, height: 8 + frac * (th - 16), rx: 7, style: 'fill:' + (frac > 0.6 ? 'var(--proton)' : (frac > 0.3 ? 'var(--alpha)' : 'var(--electron)')) }));
      svg.appendChild(txt(s, tx + 11, 28, 11, 'middle', 'fill:var(--muted)', L('বিক্ৰিয়াৰ উষ্ণতা', 'reaction temperature')));
      svg.appendChild(txt(s, tx + 34, ty0 + th - frac * (th - 16) - 2, 12, 'start', 'fill:var(--text)', c.T, 700));
      svg.appendChild(txt(s, 100, 218, 12, 'middle', 'fill:var(--text)', c.n, 600));
      var why = c.no2.length === 0 ? L('কোনো ইলেক্ট্ৰন আকৰ্ষী মূলক নাই — চৰ্ত অতি কঠোৰ।', 'No electron-withdrawing group — very severe conditions are needed.') :
        (activ === 0 ? L('<b>মেটা</b> স্থানৰ –NO₂ য়ে সংস্পন্দনত ঋণাত্মক আধান বহন কৰিব নোৱাৰে — সক্ৰিয়তা নাবাঢ়ে।', 'An <b>meta</b> –NO₂ cannot carry the negative charge by resonance — reactivity does not increase.') :
          L('<b>অৰ্থ\'/পেৰা</b> –NO₂ য়ে কাৰ্বানায়নৰ ঋণাত্মক আধান সংস্পন্দনেৰে সুস্থিৰ কৰে — সংখ্যা যিমান বেছি, বিক্ৰিয়া সিমান সহজ।', 'An <b>ortho/para</b> –NO₂ stabilises the negative charge of the carbanion by resonance — the more groups, the easier the reaction.'));
      info.innerHTML = '<b>' + c.n + '</b> + NaOH → ' + L('ফিনল (প্ৰতিস্থাপন)', 'phenol (substitution)') + '<br>' + L('প্ৰয়োজনীয় চৰ্ত: ', 'Conditions needed: ') + '<b>' + c.T + '</b><br>' + why;
    }
    var cs = k.select('Compound', CASES.map(function (c, i) { return { value: i, label: c.n }; }), st.i, function (v) { st.i = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [cs.el]));
    root.appendChild(info);
    paint();
  });
})();
