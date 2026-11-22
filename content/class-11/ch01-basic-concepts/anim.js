/* Animations for Class 11, Chapter 1: Some Basic Concepts of Chemistry (ৰসায়নবিজ্ঞানৰ কিছুমান প্ৰাথমিক ধাৰণা).
   Registered: matter-classify, temp-scales, accuracy-precision, sigfig, unit-factor, mole-bridge,
               empirical-formula, limiting-reagent, concentration
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  var SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  function map(str, tbl) { return String(str).split('').map(function (c) { return tbl[c] || c; }).join(''); }
  function sci(x, d) {
    if (x === 0) return '0';
    var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), m = x / Math.pow(10, e);
    if (+m.toFixed(d) >= 10) { m /= 10; e += 1; }
    return m.toFixed(d) + ' × 10' + map(e, SUP);
  }
  function fmt(x) {
    var a = Math.abs(x);
    if (a !== 0 && (a >= 1e5 || a < 1e-2)) return sci(x, 2);
    return String(+x.toPrecision(4));
  }

  /* ================================================================== 1. classifying matter */
  A.register('matter-classify', function (root, k) {
    var h = k.h, s = k.s;
    var ITEMS = [
      ['gold', L('সোণ (Au)', 'Gold (Au)'), 'element', L('এবিধ পৰমাণুৰ বিশুদ্ধ পদাৰ্থ।', 'A pure substance made of one kind of atom.')],
      ['o2', L('অক্সিজেন (O₂)', 'Oxygen (O₂)'), 'element', L('এবিধ মৌলৰ অণু— ৰাসায়নিক পদ্ধতিৰেও সৰল নকৰা যায়।', 'Molecules of a single element — cannot be simplified chemically.')],
      ['water', L('পানী (H₂O)', 'Water (H₂O)'), 'compound', L('H আৰু O নিৰ্দিষ্ট অনুপাতত (1 : 8 ভৰত) ৰাসায়নিকভাৱে সংযুক্ত।', 'H and O chemically combined in a fixed ratio (1 : 8 by mass).')],
      ['salt', L('খাদ্য লৱণ (NaCl)', 'Table salt (NaCl)'), 'compound', L('Na আৰু Cl নিৰ্দিষ্ট অনুপাতত সংযুক্ত।', 'Na and Cl combined in a fixed ratio.')],
      ['co2', L('কাৰ্বন ডাই-অক্সাইড (CO₂)', 'Carbon dioxide (CO₂)'), 'compound', L('C আৰু O ৰ যৌগ।', 'A compound of C and O.')],
      ['air', L('বায়ু', 'Air'), 'homo', L('N₂, O₂, Ar আদিৰ সমজাতীয় মিশ্ৰণ; সৰ্বত্ৰ একে গঠন।', 'A homogeneous mixture of N₂, O₂, Ar … — uniform throughout.')],
      ['sugar', L('চেনিৰ দ্ৰৱণ', 'Sugar solution'), 'homo', L('চেনি আৰু পানীৰ সমজাতীয় মিশ্ৰণ।', 'A homogeneous mixture of sugar and water.')],
      ['brass', L('পিতল (Cu + Zn)', 'Brass (Cu + Zn)'), 'homo', L('কঠিন সমজাতীয় মিশ্ৰণ (সংকৰ ধাতু)।', 'A solid homogeneous mixture (an alloy).')],
      ['sand', L('বালি আৰু পানী', 'Sand and water'), 'hetero', L('দুয়োটা অংশ পৃথকে দেখা যায়— অসমজাতীয় মিশ্ৰণ।', 'Both parts are visible separately — a heterogeneous mixture.')],
      ['soil', L('মাটি', 'Soil'), 'hetero', L('বালি, ক্লে, জৈৱ পদাৰ্থৰ অসমজাতীয় মিশ্ৰণ।', 'A heterogeneous mixture of sand, clay and organic matter.')]
    ];
    var NODES = {
      matter: [210, 20, L('পদাৰ্থ', 'Matter')], pure: [110, 72, L('বিশুদ্ধ পদাৰ্থ', 'Pure substance')], mix: [310, 72, L('মিশ্ৰণ', 'Mixture')],
      element: [50, 130, L('মৌল', 'Element')], compound: [170, 130, L('যৌগ', 'Compound')], homo: [260, 130, L('সমজাতীয়', 'Homogeneous')], hetero: [370, 130, L('অসমজাতীয়', 'Heterogeneous')]
    };
    var EDGES = [['matter', 'pure'], ['matter', 'mix'], ['pure', 'element'], ['pure', 'compound'], ['mix', 'homo'], ['mix', 'hetero']];
    var PATH = { element: ['matter', 'pure', 'element'], compound: ['matter', 'pure', 'compound'], homo: ['matter', 'mix', 'homo'], hetero: ['matter', 'mix', 'hetero'] };
    var st = { i: 0 };
    var svg = s('svg', { viewBox: '0 0 420 160', 'class': 'anim-svg', role: 'img', 'aria-label': L('পদাৰ্থৰ শ্ৰেণীবিভাজন বৃক্ষ', 'Classification tree of matter') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      var it = ITEMS[st.i], on = PATH[it[2]];
      EDGES.forEach(function (e) {
        var a = NODES[e[0]], b = NODES[e[1]], hot = on.indexOf(e[0]) >= 0 && on.indexOf(e[1]) >= 0;
        svg.appendChild(s('line', { x1: a[0], y1: a[1] + 13, x2: b[0], y2: b[1] - 13, style: 'stroke:' + (hot ? 'var(--brand)' : 'var(--border)') + ';stroke-width:' + (hot ? 3 : 1.5) }));
      });
      Object.keys(NODES).forEach(function (key) {
        var n = NODES[key], hot = on.indexOf(key) >= 0;
        svg.appendChild(s('rect', { x: n[0] - 48, y: n[1] - 13, width: 96, height: 26, rx: 6, style: 'fill:' + (hot ? 'var(--brand-soft)' : 'var(--surface-2)') + ';stroke:' + (hot ? 'var(--brand)' : 'var(--border)') }));
        svg.appendChild(txt(s, n[0], n[1] + 4, 10.5, 'middle', 'fill:var(--text)', n[2], hot ? 700 : 400));
      });
      svg.appendChild(txt(s, 8, 156, 10, 'start', 'fill:var(--muted)', L('ভৌতিক পদ্ধতিৰে পৃথক হয় → মিশ্ৰণ; ৰাসায়নিক পদ্ধতিৰে → যৌগ', 'Separated physically → mixture; only chemically → compound')));
      info.innerHTML = '<b>' + it[1] + '</b> → ' + NODES[it[2]][2] + '<br>' + it[3];
    }
    var sel = k.select('Substance', ITEMS.map(function (x, i) { return { value: i, label: x[1] }; }), st.i, function (v) { st.i = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. temperature scales */
  A.register('temp-scales', function (root, k) {
    var h = k.h, s = k.s;
    var st = { c: 25 };
    var svg = s('svg', { viewBox: '0 0 420 210', 'class': 'anim-svg', role: 'img', 'aria-label': L('চেলছিয়াছ, কেলভিন আৰু ফাৰেনহাইট স্কেল', 'Celsius, kelvin and Fahrenheit scales') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var SC = [
      ['°C', function (c) { return c; }, 0, 100, 'var(--electron)'],
      ['K', function (c) { return c + 273.15; }, 273.15, 373.15, 'var(--proton)'],
      ['°F', function (c) { return c * 9 / 5 + 32; }, 32, 212, 'var(--alpha)']
    ];
    function paint() {
      svg.innerHTML = '';
      var top = 20, bot = 170, f = (st.c + 50) / 200, y = bot - f * (bot - top);
      SC.forEach(function (sc, i) {
        var x = 60 + i * 130, v = sc[1](st.c);
        svg.appendChild(s('rect', { x: x - 9, y: top, width: 18, height: bot - top, rx: 9, style: 'fill:var(--surface-2);stroke:var(--border)' }));
        svg.appendChild(s('rect', { x: x - 9, y: y, width: 18, height: bot - y, rx: 9, style: 'fill:' + sc[4] + ';opacity:.85' }));
        [[0, sc[2]], [100, sc[3]]].forEach(function (m) {
          var yy = bot - (m[0] + 50) / 200 * (bot - top);
          svg.appendChild(s('line', { x1: x - 16, y1: yy, x2: x + 16, y2: yy, style: 'stroke:var(--muted);stroke-dasharray:3 3' }));
          svg.appendChild(txt(s, x + 20, yy + 4, 10, 'start', 'fill:var(--muted)', String(+m[1].toFixed(2))));
        });
        svg.appendChild(txt(s, x, 192, 12, 'middle', 'fill:var(--text)', sc[0] + ' = ' + (+v.toFixed(2)), 700));
      });
      svg.appendChild(txt(s, 8, 12, 10, 'start', 'fill:var(--muted)', L('ডাঁৰি ৰেখা: পানীৰ হিমাংক আৰু উতলাংক', 'Dashed lines: freezing and boiling point of water')));
      var c = st.c;
      info.innerHTML = c + ' °C = <b>' + (+(c + 273.15).toFixed(2)) + ' K</b> = <b>' + (+(c * 9 / 5 + 32).toFixed(2)) + ' °F</b><br>' +
        L('K = °C + 273.15 ; °F = (9/5) × °C + 32। কেলভিন স্কেলত ঋণাত্মক মান নাই (0 K = −273.15 °C)।', 'K = °C + 273.15 ; °F = (9/5) × °C + 32. There are no negative values on the kelvin scale (0 K = −273.15 °C).');
    }
    var sl = k.slider('°C', -50, 150, 1, st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. accuracy vs precision */
  A.register('accuracy-precision', function (root, k) {
    var h = k.h, s = k.s;
    var TRUE = 2.00;
    var STU = { A: [1.95, 1.93], B: [1.94, 2.05], C: [2.01, 1.99] };
    var st = { who: 'A' };
    var svg = s('svg', { viewBox: '0 0 420 120', 'class': 'anim-svg', role: 'img', 'aria-label': L('জোখৰ মান সংখ্যাৰেখাত', 'Readings on a number line') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function X(v) { return 30 + (v - 1.90) / 0.20 * 360; }
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(s('line', { x1: 30, y1: 80, x2: 390, y2: 80, style: 'stroke:var(--muted);stroke-width:2' }));
      for (var t = 1.90; t <= 2.1001; t += 0.05) {
        svg.appendChild(s('line', { x1: X(t), y1: 76, x2: X(t), y2: 84, style: 'stroke:var(--muted)' }));
        svg.appendChild(txt(s, X(t), 100, 10, 'middle', 'fill:var(--muted)', t.toFixed(2)));
      }
      svg.appendChild(s('line', { x1: X(TRUE), y1: 20, x2: X(TRUE), y2: 84, style: 'stroke:var(--ok);stroke-width:2;stroke-dasharray:4 3' }));
      svg.appendChild(txt(s, X(TRUE), 14, 10.5, 'middle', 'fill:var(--ok)', L('প্ৰকৃত মান 2.00 g', 'true value 2.00 g'), 700));
      var r = STU[st.who], mean = (r[0] + r[1]) / 2;
      r.forEach(function (v, i) {
        svg.appendChild(s('circle', { cx: X(v), cy: 62 - i * 2, r: 7, style: 'fill:var(--proton);opacity:.9' }));
      });
      svg.appendChild(s('path', { d: 'M' + X(mean) + ',70 l-6,-12 h12 z', style: 'fill:var(--brand)' }));
      svg.appendChild(txt(s, X(mean), 46, 10, 'middle', 'fill:var(--brand)', L('গড় ' + mean.toFixed(3), 'mean ' + mean.toFixed(3)), 700));
      var spread = Math.abs(r[0] - r[1]), err = Math.abs(mean - TRUE);
      var precise = spread < 0.05, accurate = err < 0.03;
      var verdict = precise && accurate ? L('যথাৰ্থ আৰু নিৰ্ভুল দুয়ো', 'both precise and accurate') :
        precise ? L('যথাৰ্থ কিন্তু নিৰ্ভুল নহয়', 'precise but not accurate') :
        accurate ? L('গড় নিৰ্ভুল, কিন্তু মানবোৰ যথাৰ্থ নহয়', 'accurate on average, but not precise') : L('নিৰ্ভুলো নহয়, যথাৰ্থো নহয়', 'neither accurate nor precise');
      info.innerHTML = L('ছাত্ৰ ', 'Student ') + st.who + ': ' + r[0].toFixed(2) + ', ' + r[1].toFixed(2) + ' g<br>' +
        L('মানৰ পাৰ্থক্য = ' + spread.toFixed(2) + ' g; প্ৰকৃত মানৰ পৰা গড়ৰ দূৰত্ব = ' + err.toFixed(3) + ' g', 'Spread = ' + spread.toFixed(2) + ' g; mean is ' + err.toFixed(3) + ' g from the true value') +
        '<br><b>' + verdict + '</b>';
    }
    var sel = k.select('Student', ['A', 'B', 'C'].map(function (x) { return { value: x, label: x }; }), st.who, function (v) { st.who = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. significant figures */
  A.register('sigfig', function (root, k) {
    var h = k.h;
    var PRESETS = ['285', '2.005', '0.00520', '0.200', '200', '200.0', '2.00e2', '4.01e2', '0.0040'];
    var st = { v: '0.00520' };
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite', style: 'font-size:1.6rem;letter-spacing:.08em;font-family:monospace' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function analyse(str) {
      var m = str, ex = '', ei = str.search(/e/i);
      if (ei >= 0) { m = str.slice(0, ei); ex = str.slice(ei); }
      var res = [], i, hasDot = m.indexOf('.') >= 0, first = -1, last = -1;
      for (i = 0; i < m.length; i++) if (/[1-9]/.test(m[i])) { if (first < 0) first = i; last = i; }
      var count = 0, ambiguous = false;
      for (i = 0; i < m.length; i++) {
        var c = m[i], kind = 'plain';
        if (/\d/.test(c)) {
          if (first < 0) kind = 'lead';
          else if (i < first) kind = 'lead';
          else if (hasDot || i <= last) kind = 'sig';
          else { kind = 'amb'; ambiguous = true; }
          if (kind === 'sig') count++;
        }
        res.push([c, kind]);
      }
      for (i = 0; i < ex.length; i++) res.push([ex[i], 'plain']);
      return { chars: res, count: count, ambiguous: ambiguous, valid: /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(str) };
    }
    var STY = { sig: 'color:var(--brand);font-weight:700', lead: 'color:var(--muted);text-decoration:line-through', amb: 'color:var(--accent);font-weight:700', plain: 'color:var(--text)' };
    function paint() {
      var a = analyse(st.v);
      out.innerHTML = '';
      if (!a.valid) {
        out.appendChild(h('span', { text: st.v || ' ', style: STY.plain }));
        info.innerHTML = L('বৈধ সংখ্যা লিখক (যেনে 0.00520 বা 2.00e2)।', 'Enter a valid number (e.g. 0.00520 or 2.00e2).');
        return;
      }
      a.chars.forEach(function (c) { out.appendChild(h('span', { text: c[0], style: STY[c[1]] })); });
      info.innerHTML = '<b>' + a.count + '</b> ' + L('টা তাৎপৰ্যপূৰ্ণ অংক', 'significant figures') +
        '<br><span style="color:var(--brand)">■</span> ' + L('তাৎপৰ্যপূৰ্ণ', 'significant') + ' &nbsp; <span style="color:var(--muted)">■</span> ' + L('আগৰ শূন্য (গণনা নহয়)', 'leading zero (not counted)') +
        (a.ambiguous ? ' &nbsp; <span style="color:var(--accent)">■</span> ' + L('অস্পষ্ট শেষৰ শূন্য', 'ambiguous trailing zero') + '<br>' +
          L('দশমিক নথকা সংখ্যাত শেষৰ শূন্য অস্পষ্ট; বিজ্ঞানসন্মত লিপি (যেনে 2.00e2) ব্যৱহাৰ কৰক।', 'Trailing zeros without a decimal point are ambiguous; use scientific notation (e.g. 2.00e2).') : '');
    }
    var sel = k.select('Example', PRESETS.map(function (x) { return { value: x, label: x }; }), st.v, function (v) { st.v = v; input.value = v; paint(); });
    var input = h('input', { type: 'text', value: st.v, 'aria-label': 'Number', style: 'width:9em;padding:.3em .5em;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text);font:inherit' });
    input.addEventListener('input', function () { st.v = input.value.trim(); paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, h('label', { 'class': 'ctl' }, [h('span', { text: 'Your number' }), input])]));
    root.appendChild(out);
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. unit factors */
  A.register('unit-factor', function (root, k) {
    var h = k.h, s = k.s;
    var CONV = {
      inch: { name: '3 in → cm', start: ['3', 'in'], f: [['2.54', 'cm', '1', 'in']], res: '7.62 cm' },
      day: { name: '2 day → s', start: ['2', 'day'], f: [['24', 'h', '1', 'day'], ['60', 'min', '1', 'h'], ['60', 's', '1', 'min']], res: '1.728 × 10⁵ s' },
      lit: { name: '2 L → m³', start: ['2', 'L'], f: [['1000', 'cm³', '1', 'L'], ['1', 'm³', '10⁶', 'cm³']], res: '2 × 10⁻³ m³' },
      hour: { name: '2.5 h → s', start: ['2.5', 'h'], f: [['60', 'min', '1', 'h'], ['60', 's', '1', 'min']], res: '9000 s' }
    };
    var st = { c: 'inch', n: 0 };
    var svg = s('svg', { viewBox: '0 0 420 110', 'class': 'anim-svg', role: 'img', 'aria-label': L('এককৰ গুণকেৰে ৰূপান্তৰ', 'Unit-factor conversion') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var CW = 7.2;
    function w(str) { return str.length * CW + 6; }
    function paint() {
      svg.innerHTML = '';
      var c = CONV[st.c], x = 12, mid = 52, cancel = 'fill:var(--muted);text-decoration:line-through;text-decoration-thickness:2px';
      var startUnitDone = st.n >= 1;
      var t0 = c.start[0] + ' ';
      svg.appendChild(txt(s, x, mid + 4, 13, 'start', 'fill:var(--text)', t0));
      svg.appendChild(txt(s, x + w(t0) - 2, mid + 4, 13, 'start', startUnitDone ? cancel : 'fill:var(--brand);font-weight:700', c.start[1], startUnitDone ? 400 : 700));
      x += w(t0 + c.start[1]) + 8;
      for (var i = 0; i < st.n; i++) {
        var f = c.f[i], numT = f[0] + ' ' + f[1], denT = f[2] + ' ' + f[3];
        var fw = Math.max(w(numT), w(denT)) + 4, nextDone = st.n > i + 1;
        svg.appendChild(txt(s, x - 2, mid + 4, 14, 'start', 'fill:var(--muted)', '×'));
        x += 14;
        svg.appendChild(txt(s, x + fw / 2, mid - 8, 13, 'middle', nextDone ? cancel : 'fill:var(--brand)', numT));
        svg.appendChild(s('line', { x1: x, y1: mid, x2: x + fw, y2: mid, style: 'stroke:var(--text);stroke-width:1.5' }));
        svg.appendChild(txt(s, x + fw / 2, mid + 17, 13, 'middle', cancel, denT));
        x += fw + 8;
      }
      if (st.n === c.f.length) {
        svg.appendChild(txt(s, x, mid + 4, 14, 'start', 'fill:var(--text)', '= ' + c.res, 700));
      }
      var msg = st.n === 0 ? L('আৰম্ভণি: ' + c.start.join(' ') + '। এটা এককৰ গুণক গুণ কৰক— যাৰ হৰত বৰ্তমানৰ একক আছে।', 'Start: ' + c.start.join(' ') + '. Multiply by a unit factor whose denominator holds the current unit.') :
        st.n < c.f.length ? L('বৰ্তমানৰ একক কাটি গ\'ল; ইয়াৰ পাছত নতুন একক বাকী থাকিল। আৰু গুণক লাগিব।', 'The old unit cancelled; the new unit remains. More factors are needed.') :
        L('সকলো অপ্ৰয়োজনীয় একক কাটি গ\'ল। ফল: ' + c.res + '। প্ৰতিটো গুণক = 1 গতিকে মান সলনি হোৱা নাই— কেৱল একক সলনি হৈছে।', 'All unwanted units cancelled. Result: ' + c.res + '. Each factor equals 1, so the quantity is unchanged — only the unit changes.');
      info.innerHTML = msg;
    }
    var sel = k.select('Conversion', Object.keys(CONV).map(function (key) { return { value: key, label: CONV[key].name }; }), st.c, function (v) { st.c = v; st.n = 0; paint(); });
    var next = k.button('Next step', function () { if (st.n < CONV[st.c].f.length) { st.n++; paint(); } });
    var reset = k.button('Reset', function () { st.n = 0; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, next, reset]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. the mole bridge */
  A.register('mole-bridge', function (root, k) {
    var h = k.h, s = k.s;
    var NA = 6.022e23;
    var SUBS = {
      h2o: ['H₂O', 18.02, false, L('পানী', 'water')], co2: ['CO₂', 44.01, true, L('কাৰ্বন ডাই-অক্সাইড', 'carbon dioxide')], o2: ['O₂', 32.00, true, L('অক্সিজেন', 'oxygen')],
      ch4: ['CH₄', 16.04, true, L('মিথেন', 'methane')], nacl: ['NaCl', 58.44, false, L('খাদ্য লৱণ (সংকেত একক)', 'table salt (formula units)')], glu: ['C₆H₁₂O₆', 180.16, false, L('গ্লুক\'জ', 'glucose')]
    };
    var st = { s: 'h2o', n: 1 };
    var svg = s('svg', { viewBox: '0 0 420 190', 'class': 'anim-svg', role: 'img', 'aria-label': L('ম\'লৰ পৰা ভৰ, কণা আৰু আয়তন', 'From moles to mass, particles and volume') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function box(x, y, w, hh, title, val, hot) {
      svg.appendChild(s('rect', { x: x, y: y, width: w, height: hh, rx: 8, style: 'fill:' + (hot ? 'var(--brand-soft)' : 'var(--surface-2)') + ';stroke:' + (hot ? 'var(--brand)' : 'var(--border)') }));
      svg.appendChild(txt(s, x + w / 2, y + 16, 10.5, 'middle', 'fill:var(--muted)', title));
      svg.appendChild(txt(s, x + w / 2, y + hh - 10, 13, 'middle', 'fill:var(--text)', val, 700));
    }
    function arrow(x1, y1, x2, y2, label) {
      svg.appendChild(s('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:var(--muted);stroke-width:1.6' }));
      svg.appendChild(txt(s, (x1 + x2) / 2, (y1 + y2) / 2 - 4, 10, 'middle', 'fill:var(--muted)', label));
    }
    function paint() {
      svg.innerHTML = '';
      var d = SUBS[st.s], n = st.n, m = n * d[1], N = n * NA, V = n * 22.4;
      box(150, 70, 120, 46, L('ম\'ল (n)', 'moles (n)'), n + ' mol', true);
      box(10, 8, 130, 46, L('ভৰ', 'mass'), fmt(m) + ' g');
      box(280, 8, 130, 46, L('কণাৰ সংখ্যা', 'particles'), sci(N, 2));
      box(145, 138, 130, 46, L('আয়তন (STP)', 'volume (STP)'), d[2] ? fmt(V) + ' L' : '—');
      arrow(150, 82, 118, 56, '× ' + d[1]);
      arrow(270, 82, 302, 56, '× 6.022×10²³');
      if (d[2]) arrow(210, 118, 210, 138, '× 22.4');
      else svg.appendChild(txt(s, 290, 164, 10, 'start', 'fill:var(--muted)', L('STP ত গেছ নহয়', 'not a gas at STP')));
      info.innerHTML = '<b>' + n + ' mol ' + d[0] + '</b> (' + d[3] + ', M = ' + d[1] + ' g mol⁻¹)<br>' + L('ভৰ = n × M = ', 'mass = n × M = ') + fmt(m) + ' g' +
        (d[2] ? '<br>' + L('এই গেছৰ আয়তন STP ত ≈ ', 'volume of this gas at STP ≈ ') + fmt(V) + ' L' : '');
    }
    var sel = k.select('Substance', Object.keys(SUBS).map(function (key) { return { value: key, label: SUBS[key][0] }; }), st.s, function (v) { st.s = v; paint(); });
    var sl = k.slider('mol', 0.1, 5, 0.1, st.n, function (v) { st.n = Math.round(v * 10) / 10; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. empirical and molecular formula */
  A.register('empirical-formula', function (root, k) {
    var h = k.h;
    var CASES = {
      clo: { name: L('C 24.27 %, H 4.07 %, Cl 71.65 % (M = 98.96)', 'C 24.27 %, H 4.07 %, Cl 71.65 % (M = 98.96)'), M: 98.96, el: [['C', 24.27, 12.01], ['H', 4.07, 1.008], ['Cl', 71.65, 35.45]] },
      ace: { name: L('C 40.0 %, H 6.7 %, O 53.3 % (M = 60)', 'C 40.0 %, H 6.7 %, O 53.3 % (M = 60)'), M: 60, el: [['C', 40.0, 12.01], ['H', 6.7, 1.008], ['O', 53.3, 16.00]] },
      glu: { name: L('C 40.0 %, H 6.7 %, O 53.3 % (M = 180)', 'C 40.0 %, H 6.7 %, O 53.3 % (M = 180)'), M: 180, el: [['C', 40.0, 12.01], ['H', 6.7, 1.008], ['O', 53.3, 16.00]] },
      fe: { name: L('Fe 69.9 %, O 30.1 % (M = 159.7)', 'Fe 69.9 %, O 30.1 % (M = 159.7)'), M: 159.7, el: [['Fe', 69.9, 55.85], ['O', 30.1, 16.00]] }
    };
    var st = { c: 'clo', step: 0 };
    var box = h('div', { style: 'overflow-x:auto' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function cell(t, bold, dim) { return h('td', { text: t, style: 'padding:.3em .6em;text-align:right;border-bottom:1px solid var(--border);' + (bold ? 'font-weight:700;color:var(--brand);' : '') + (dim ? 'color:var(--muted);' : '') }); }
    function head(t) { return h('th', { text: t, style: 'padding:.3em .6em;text-align:right;border-bottom:2px solid var(--border);font-size:.85em;color:var(--muted)' }); }
    function formulaStr(el, mult) { return el.map(function (e) { return e.sym + (mult * e.k > 1 ? map(mult * e.k, SUB) : ''); }).join(''); }
    function paint() {
      var c = CASES[st.c], rows = c.el.map(function (e) { return { sym: e[0], pct: e[1], am: e[2], mol: e[1] / e[2] }; });
      var min = Math.min.apply(null, rows.map(function (r) { return r.mol; }));
      rows.forEach(function (r) { r.ratio = r.mol / min; });
      var kk = 1, ok = false;
      for (kk = 1; kk <= 6 && !ok; kk++) { ok = rows.every(function (r) { return Math.abs(r.ratio * kk - Math.round(r.ratio * kk)) < 0.1; }); if (ok) break; }
      if (!ok) kk = 1;
      rows.forEach(function (r) { r.k = Math.round(r.ratio * kk); });
      var empMass = rows.reduce(function (a, r) { return a + r.k * r.am; }, 0), n = Math.max(1, Math.round(c.M / empMass));
      var tbl = h('table', { style: 'border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums' });
      tbl.appendChild(h('tr', {}, [head(L('মৌল', 'Element')), head(L('% = g (100 g ত)', '% = g in 100 g')), head(L('পাৰমাণৱিক ভৰ', 'atomic mass')), head(L('ম\'ল', 'moles')), head(L('÷ সৰুটো', '÷ smallest')), head(L('× ' + kk + ' (পূৰ্ণ সংখ্যা)', '× ' + kk + ' (whole)'))]));
      rows.forEach(function (r) {
        tbl.appendChild(h('tr', {}, [cell(r.sym, true), cell(r.pct.toFixed(2)), cell(String(r.am)), cell(st.step >= 1 ? r.mol.toFixed(3) : '?', false, st.step < 1),
          cell(st.step >= 2 ? r.ratio.toFixed(2) : '?', false, st.step < 2), cell(st.step >= 3 ? String(r.k) : '?', st.step >= 3, st.step < 3)]));
      });
      box.innerHTML = ''; box.appendChild(tbl);
      var msg = [
        L('100 g নমুনা ধৰি প্ৰতিটো % ক গ্ৰাম বুলি লওক।', 'Take a 100 g sample: each % is its mass in grams.'),
        L('ম\'ল = ভৰ ÷ পাৰমাণৱিক ভৰ।', 'moles = mass ÷ atomic mass.'),
        L('আটাইতকৈ সৰু ম\'ল (' + min.toFixed(3) + ') ৰে হৰণ কৰি অনুপাত পোৱা গ\'ল।', 'Divide by the smallest (' + min.toFixed(3) + ') to get the ratio.'),
        kk > 1 ? L('অনুপাত পূৰ্ণ সংখ্যা নহয়, সেয়ে ' + kk + ' ৰে গুণ কৰা হ\'ল।', 'The ratio is not whole, so multiply by ' + kk + '.') : L('অনুপাত ইতিমধ্যে (প্ৰায়) পূৰ্ণ সংখ্যা।', 'The ratio is already (nearly) whole numbers.'),
        L('মূলানুপাতিক সংকেত <b>' + formulaStr(rows, 1) + '</b> (ভৰ ' + empMass.toFixed(2) + '); n = ' + c.M + ' ÷ ' + empMass.toFixed(2) + ' ≈ ' + n + ' ⇒ আণৱিক সংকেত <b>' + formulaStr(rows, n) + '</b>।',
          'Empirical formula <b>' + formulaStr(rows, 1) + '</b> (mass ' + empMass.toFixed(2) + '); n = ' + c.M + ' ÷ ' + empMass.toFixed(2) + ' ≈ ' + n + ' ⇒ molecular formula <b>' + formulaStr(rows, n) + '</b>.')
      ];
      info.innerHTML = (L('পদক্ষেপ ', 'Step ') + st.step + ' / 4: ') + msg[st.step];
    }
    var sel = k.select('Compound', Object.keys(CASES).map(function (key) { return { value: key, label: CASES[key].name }; }), st.c, function (v) { st.c = v; st.step = 0; paint(); });
    var next = k.button('Next step', function () { if (st.step < 4) { st.step++; paint(); } });
    var reset = k.button('Reset', function () { st.step = 0; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, next, reset]));
    root.appendChild(box);
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 8. limiting reagent */
  A.register('limiting-reagent', function (root, k) {
    var h = k.h, s = k.s;
    var st = { h: 5, o: 3 };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('2H₂ + O₂ → 2H₂O ৰ অণু', 'Molecules in 2H₂ + O₂ → 2H₂O') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var STEP = 27;
    function mol(kind, x, y, dim) {
      var g = s('g', { style: dim ? 'opacity:.45' : '' });
      if (kind === 'h2') { g.appendChild(s('circle', { cx: x - 4, cy: y, r: 6, style: 'fill:var(--electron)' })); g.appendChild(s('circle', { cx: x + 4, cy: y, r: 6, style: 'fill:var(--electron)' })); }
      else if (kind === 'o2') { g.appendChild(s('circle', { cx: x - 5, cy: y, r: 8, style: 'fill:var(--proton)' })); g.appendChild(s('circle', { cx: x + 5, cy: y, r: 8, style: 'fill:var(--proton)' })); }
      else { g.appendChild(s('circle', { cx: x, cy: y, r: 8, style: 'fill:var(--proton)' })); g.appendChild(s('circle', { cx: x - 8, cy: y + 7, r: 5, style: 'fill:var(--electron)' })); g.appendChild(s('circle', { cx: x + 8, cy: y + 7, r: 5, style: 'fill:var(--electron)' })); }
      return g;
    }
    function row(list, y) { list.forEach(function (kind, i) { svg.appendChild(mol(kind, 20 + i * STEP, y, false)); }); }
    function rep(kind, n) { var a = []; for (var i = 0; i < n; i++) a.push(kind); return a; }
    function paint() {
      svg.innerHTML = '';
      var H = st.h, O = st.o, e = Math.min(Math.floor(H / 2), O), water = 2 * e, leftH = H - 2 * e, leftO = O - e;
      svg.appendChild(txt(s, 8, 14, 10.5, 'start', 'fill:var(--muted)', L('আগতে', 'Before')));
      row(rep('h2', H).concat(rep('o2', O)), 38);
      svg.appendChild(txt(s, 8, 86, 10.5, 'start', 'fill:var(--muted)', L('বিক্ৰিয়াৰ পাছত', 'After')));
      row(rep('w', water).concat(rep('h2', leftH)).concat(rep('o2', leftO)), 112);
      svg.appendChild(txt(s, 8, 150, 10.5, 'start', 'fill:var(--electron)', '● H₂'));
      svg.appendChild(txt(s, 60, 150, 10.5, 'start', 'fill:var(--proton)', '● O₂'));
      svg.appendChild(txt(s, 112, 150, 10.5, 'start', 'fill:var(--text)', L('H₂O: ●(O) + 2 ●(H)', 'H₂O: ●(O) + 2 ●(H)')));
      var lim = H === 0 || O === 0 ? null : (H / 2 < O ? 'H₂' : (H / 2 > O ? 'O₂' : null));
      var msg;
      if (H === 0 || O === 0) msg = L('এটা বিক্ৰিয়ক নাই— বিক্ৰিয়া নহয়।', 'One reactant is absent — no reaction.');
      else if (lim) msg = L('সীমিতকাৰী বিকাৰক: <b>' + lim + '</b>। ' + (lim === 'H₂' ? 'O₂' : 'H₂') + ' অতিৰিক্ত।', 'Limiting reagent: <b>' + lim + '</b>. ' + (lim === 'H₂' ? 'O₂' : 'H₂') + ' is in excess.');
      else msg = L('ঠিক 2 : 1 অনুপাত— দুয়ো এক লগে শেষ; সীমিতকাৰী নাই।', 'Exactly 2 : 1 — both used up together; no excess.');
      info.innerHTML = H + ' H₂ + ' + O + ' O₂ → <b>' + water + ' H₂O</b>' + (leftH ? ' + ' + leftH + ' H₂' : '') + (leftO ? ' + ' + leftO + ' O₂' : '') + '<br>' + msg;
    }
    var s1 = k.slider('H₂', 0, 12, 1, st.h, function (v) { st.h = v; paint(); });
    var s2 = k.slider('O₂', 0, 8, 1, st.o, function (v) { st.o = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [s1.el, s2.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 9. concentration */
  A.register('concentration', function (root, k) {
    var h = k.h, s = k.s;
    var MS = 58.44, MW = 18.015;
    var st = { m: 10, w: 500 };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('NaCl দ্ৰৱণৰ গাঢ়তা', 'Concentration of an NaCl solution') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      var n = st.m / MS, nw = st.w / MW, pct = st.m / (st.m + st.w) * 100, x = n / (n + nw), molal = n / (st.w / 1000);
      var rho = 1.0 + 0.0071 * pct, V = (st.m + st.w) / rho / 1000, M = n / V;
      var level = 30 + (st.w / 1000) * 90, salt = Math.min(1, pct / 26);
      svg.appendChild(s('path', { d: 'M40,20 L40,130 Q40,140 50,140 L110,140 Q120,140 120,130 L120,20', style: 'fill:none;stroke:var(--muted);stroke-width:2' }));
      svg.appendChild(s('rect', { x: 42, y: 140 - level + 10, width: 76, height: level - 10, style: 'fill:var(--electron);opacity:' + (0.25 + 0.5 * salt) }));
      for (var i = 0; i < Math.min(40, Math.round(st.m / 3)); i++) {
        svg.appendChild(s('circle', { cx: 50 + (i * 37) % 60, cy: 135 - (i * 53) % Math.max(10, level - 14), r: 2.4, style: 'fill:var(--text);opacity:.55' }));
      }
      var rows = [[L('ভৰ %', 'mass %'), pct.toFixed(2) + ' %'], [L('ম\'ল ভগ্নাংশ (NaCl)', 'mole fraction (NaCl)'), x.toFixed(4)], [L('ম\'লালিটি', 'molality'), molal.toFixed(3) + ' mol kg⁻¹'], [L('ম\'লাৰিটি (আনুমানিক)', 'molarity (approx.)'), M.toFixed(3) + ' mol L⁻¹']];
      rows.forEach(function (r, j) {
        svg.appendChild(txt(s, 150, 34 + j * 30, 11, 'start', 'fill:var(--muted)', r[0]));
        svg.appendChild(txt(s, 150, 50 + j * 30, 14, 'start', 'fill:var(--text)', r[1], 700));
      });
      var warn = st.m / st.w * 100 > 36 ? '<br><span style="color:var(--bad)">' + L('সাৱধান: 25 °C ত 100 g পানীত NaCl ৰ দ্ৰৱণীয়তা ≈ 36 g; ইয়াতকৈ বেছি দ্ৰৱীভূত নহয়।', 'Note: NaCl dissolves only about 36 g per 100 g water at 25 °C; more would not dissolve.') + '</span>' : '';
      info.innerHTML = st.m + ' g NaCl (' + n.toFixed(3) + ' mol) + ' + st.w + ' g H₂O (' + nw.toFixed(1) + ' mol)<br>' +
        L('দ্ৰৱণৰ ঘনত্ব ≈ 1.00 + 0.0071 × (ভৰ %) g mL⁻¹ ধৰি ম\'লাৰিটি গণনা কৰা হৈছে (আনুমানিক)।', 'Molarity uses an approximate density ≈ 1.00 + 0.0071 × (mass %) g mL⁻¹.') + warn;
    }
    var s1 = k.slider('NaCl (g)', 1, 120, 1, st.m, function (v) { st.m = v; paint(); });
    var s2 = k.slider('H₂O (g)', 100, 1000, 10, st.w, function (v) { st.w = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [s1.el, s2.el]));
    root.appendChild(info);
    paint();
  });
})();
