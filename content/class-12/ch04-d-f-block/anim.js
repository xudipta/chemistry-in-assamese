/* Animations for Class 12, Chapter 4: The d- and f-Block Elements (d- আৰু f- গোষ্ঠীৰ মৌল).
   Registered: periodic-d, tm-ion, ox-states, trend-plot, lanthanoid, chromate-ph, dichromate, kmno4
   Controls are English (app UI); read-outs are Assamese (subject content). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var TAU = Math.PI * 2;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sup(n) { return '<sup>' + n + '</sup>'; }
  function ionLabel(sym, q) { return sym + (q ? '<sup>' + (q > 1 ? q : '') + '+</sup>' : ''); }
  function mkCanvas(root, k, label, W, H) {
    var c = k.h('canvas', { 'class': 'anim-canvas', role: 'img', 'aria-label': label });
    root.appendChild(c); return k.hiDpiCanvas(c, W, H);
  }
  function plot(ctx, k, W, H, xmin, xmax, ymin, ymax, xlab, ylab, o) {
    o = o || {};
    var m = { l: 62, r: 14, t: 16, b: 42 }, mu = k.cssVar('--muted'), gr = k.cssVar('--grid'), bg = k.cssVar('--canvas'), tx = k.cssVar('--text');
    function X(v) { return m.l + (v - xmin) / (xmax - xmin) * (W - m.l - m.r); }
    function Y(v) { return H - m.b - (v - ymin) / (ymax - ymin) * (H - m.t - m.b); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1; ctx.strokeStyle = gr; ctx.fillStyle = mu; ctx.font = '11px sans-serif';
    for (var i = 0; i <= 4; i++) {
      var yv = ymin + (ymax - ymin) * i / 4;
      ctx.beginPath(); ctx.moveTo(m.l, Y(yv)); ctx.lineTo(W - m.r, Y(yv)); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(o.yf ? o.yf(yv) : String(Math.round(yv * 100) / 100), m.l - 6, Y(yv) + 4); ctx.textAlign = 'start';
    }
    ctx.strokeStyle = mu; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(m.l, m.t); ctx.lineTo(m.l, H - m.b); ctx.lineTo(W - m.r, H - m.b); ctx.stroke();
    ctx.fillStyle = tx; ctx.font = '600 12px "Noto Sans Bengali", sans-serif';
    ctx.fillText(xlab, (W + m.l) / 2 - ctx.measureText(xlab).width / 2, H - 6);
    ctx.save(); ctx.translate(12, (H - m.b) / 2 + 45); ctx.rotate(-Math.PI / 2); ctx.fillText(ylab, 0, 0); ctx.restore();
    return { X: X, Y: Y, m: m };
  }
  function dot(ctx, x, y, color, r, hollow) {
    ctx.beginPath(); ctx.arc(x, y, r || 5.5, 0, TAU);
    if (hollow) { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); } else { ctx.fillStyle = color; ctx.fill(); }
  }
  /* a conical flask whose liquid colour fades smoothly */
  var FLASK_ID = 0;
  function flask(s, color) {
    var g = s('g'), id = 'flaskclip' + (++FLASK_ID);
    var shape = 'M130 40 H170 V104 L222 202 Q232 228 200 228 H100 Q68 228 78 202 L130 104 Z';
    var defs = s('defs'), clip = s('clipPath', { id: id });
    clip.appendChild(s('path', { d: shape })); defs.appendChild(clip); g.appendChild(defs);
    var liquid = s('rect', { x: 60, y: 118, width: 180, height: 120, 'clip-path': 'url(#' + id + ')', style: 'fill:' + color + ';transition:fill 1.2s;opacity:.92' });
    g.appendChild(liquid);
    g.appendChild(s('path', { d: shape, fill: 'none', style: 'stroke:var(--muted)', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    g.appendChild(s('rect', { x: 124, y: 34, width: 52, height: 8, rx: 3, style: 'fill:var(--muted)' }));
    return { g: g, liquid: liquid, set: function (c) { liquid.setAttribute('style', 'fill:' + c + ';transition:fill 1.2s;opacity:.92'); } };
  }

  /* ================================================================== 1. d-block map */
  var PD_CORE = ['[Ar]', '[Kr]', '[Xe] 4f¹⁴', '[Rn] 5f¹⁴'], PD_N = [3, 4, 5, 6];
  var PD = [
    { z0: 21, sym: ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'], en: ['Scandium', 'Titanium', 'Vanadium', 'Chromium', 'Manganese', 'Iron', 'Cobalt', 'Nickel', 'Copper', 'Zinc'], s: [2, 2, 2, 1, 2, 2, 2, 2, 1, 2], d: [1, 2, 3, 5, 5, 6, 7, 8, 10, 10] },
    { z0: 39, sym: ['Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd'], en: ['Yttrium', 'Zirconium', 'Niobium', 'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver', 'Cadmium'], s: [2, 2, 1, 1, 2, 1, 1, 0, 1, 2], d: [1, 2, 4, 5, 5, 7, 8, 10, 10, 10] },
    { z0: 72, sym: ['Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg'], en: ['Hafnium', 'Tantalum', 'Tungsten', 'Rhenium', 'Osmium', 'Iridium', 'Platinum', 'Gold', 'Mercury'], s: [2, 2, 2, 2, 2, 2, 1, 1, 2], d: [2, 3, 4, 5, 6, 7, 9, 10, 10] },
    { z0: 104, sym: ['Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn'], en: ['Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium', 'Copernicium'], s: [2, 2, 2, 2, 2, 2, 2, 1, 2], d: [2, 3, 4, 5, 6, 7, 8, 10, 10] }
  ];
  /* La and Ac sit at the start of the 5d and 6d rows (group 3) */
  PD[2].sym.unshift('La'); PD[2].en.unshift('Lanthanum'); PD[2].s.unshift(2); PD[2].d.unshift(1);
  PD[3].sym.unshift('Ac'); PD[3].en.unshift('Actinium'); PD[3].s.unshift(2); PD[3].d.unshift(1);

  A.register('periodic-d', function (root, k) {
    var h = k.h, grid = h('div', { style: 'display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:4px;margin-top:10px' });
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' }), cells = [], cur = [0, 3];
    var NONTR = { Zn: 1, Cd: 1, Hg: 1, Cn: 1 };
    function z(row, col) { var base = PD[row].z0; return row >= 2 ? (row === 2 ? 57 : 89) + (col === 0 ? 0 : 14 + col) : base + col; }
    function cfg(row, col) {
      var r = PD[row], n = PD_N[row], sq = (n === 3 ? 4 : n + 1);
      var core = (col === 0 && row >= 2) ? (row === 2 ? '[Xe]' : '[Rn]') : PD_CORE[row];
      return core + ' ' + n + 'd' + sup(r.d[col]) + ' ' + sq + 's' + sup(r.s[col]);
    }
    function paint() {
      var row = cur[0], col = cur[1], r = PD[row];
      var s = r.sym[col], zz = z(row, col), expected = r.s[col] === 2 || NONTR[s];
      info.innerHTML = '<b>' + s + '</b> (' + r.en[col] + ') · Z = ' + zz + '<br>বিন্যাস: <span class="cfg">' + cfg(row, col) + '</span>' +
        (NONTR[s] ? '<br><b>d¹⁰ — ভূমি অৱস্থা আৰু সচৰাচৰ জাৰণ অৱস্থা (+2) দুয়োটাতে d অৰবিটেল পূৰ্ণ। গতিকে ই সংক্ৰমণশীল মৌল নহয়।</b>' :
          (!expected ? '<br><span class="en">ব্যতিক্ৰম: ns ৰ ইলেক্ট্ৰন (n−1)d লৈ গৈছে — অৰ্ধপূৰ্ণ বা পূৰ্ণ d অৰবিটেলৰ অতিৰিক্ত স্থিৰতাৰ বাবে।</span>' : '<br><span class="en">সাধাৰণ বিন্যাস (n−1)d<sup>1–10</sup> ns<sup>1–2</sup> অনুসৰি।</span>'));
      cells.forEach(function (c) { c.b.setAttribute('aria-pressed', String(c.row === row && c.col === col)); });
    }
    var rowsName = ['3d', '4d', '5d', '6d'];
    PD.forEach(function (r, ri) {
      for (var c = 0; c < 10; c++) {
        if (ri >= 2 && false) continue;
        var idx = c;
        if (ri === 0 || ri === 1) idx = c;
        else idx = c;                       /* rows 3 and 4 have La/Ac plus 9 elements = 10 cells */
        var sym = r.sym[idx], b = k.button(sym, (function (rr, cc) { return function () { cur = [rr, cc]; paint(); }; })(ri, idx));
        var exc = r.s[idx] !== 2 && !NONTR[sym];
        b.style.cssText = 'padding:4px 0;min-height:36px;font-weight:700;' + (NONTR[sym] ? 'opacity:.55;' : '') + (exc ? 'border-color:var(--accent);' : '');
        b.title = r.en[idx];
        cells.push({ b: b, row: ri, col: idx });
        grid.appendChild(b);
      }
    });
    var head = h('div', { 'class': 'legend' }, [
      h('span', { text: 'বাওঁৰ পৰা সোঁলৈ: বৰ্গ 3 → 12 · ওপৰৰ পৰা তললৈ: 3d, 4d, 5d, 6d শ্ৰেণী' }),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--accent)' }), 'কমলা ঘেৰ = ব্যতিক্ৰমী বিন্যাস']),
      h('span', { text: 'ম্লান = Zn, Cd, Hg, Cn (সংক্ৰমণশীল নহয়)' })]);
    root.appendChild(head); root.appendChild(grid); root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. 3d ions: configuration, magnetism, colour */
  A.register('tm-ion', function (root, k) {
    var h = k.h, s = k.s;
    var EL = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'];
    var S0 = [2, 2, 2, 1, 2, 2, 2, 2, 1, 2], D0 = [1, 2, 3, 5, 5, 6, 7, 8, 10, 10];
    var COL = {
      'Sc3+': ['বৰণহীন', '#e9eef0'], 'Ti4+': ['বৰণহীন', '#e9eef0'], 'Ti3+': ['বেঙুনীয়া', '#9b6fc4'], 'V4+': ['নীলা', '#3b82f6'], 'V3+': ['সেউজীয়া', '#3fae5a'], 'V2+': ['বেঙুনীয়া', '#9b6fc4'],
      'Cr3+': ['বেঙুনীয়া', '#7e57a8'], 'Mn3+': ['বেঙুনীয়া', '#9b6fc4'], 'Cr2+': ['নীলা', '#3b82f6'], 'Mn2+': ['গুলপীয়া', '#f4a9c4'], 'Fe3+': ['হালধীয়া', '#e6c445'],
      'Fe2+': ['সেউজীয়া', '#7cc57f'], 'Co2+': ['গুলপীয়া', '#f08fb0'], 'Ni2+': ['সেউজীয়া', '#3fae5a'], 'Cu2+': ['নীলা', '#3b9cf0'], 'Zn2+': ['বৰণহীন', '#e9eef0'], 'Cu+': ['বৰণহীন', '#e9eef0']
    };
    var st = { i: 4, q: 2 };
    var svg = s('svg', { viewBox: '0 0 400 150', 'class': 'anim-svg', role: 'img', 'aria-label': '4s আৰু 3d অৰবিটেলত ইলেক্ট্ৰনৰ বিন্যাস' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function conf() {
      var sE = S0[st.i], dE = D0[st.i], q = st.q;
      while (q > 0) { if (sE > 0) sE--; else dE--; q--; }
      return { s: sE, d: dE };
    }
    function boxes(label, n, count, x, y, cap) {
      var g = s('g');
      g.appendChild(s('text', { x: x - 8, y: y + 26, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 700, style: 'fill:var(--text)', text: label }));
      for (var i = 0; i < n; i++) {
        var up = i < Math.min(count, n), dn = i < Math.max(0, count - n);
        g.appendChild(s('rect', { x: x + i * 50, y: y, width: 42, height: 40, rx: 6, fill: 'none', style: 'stroke:' + (up ? 'var(--brand)' : 'var(--border)'), 'stroke-width': 2.5 }));
        if (up) g.appendChild(s('text', { x: x + i * 50 + 14, y: y + 28, 'font-size': 24, 'font-weight': 800, style: 'fill:var(--electron)', text: '↑' }));
        if (dn) g.appendChild(s('text', { x: x + i * 50 + 26, y: y + 28, 'font-size': 24, 'font-weight': 800, style: 'fill:var(--proton)', text: '↓' }));
      }
      return g;
    }
    function paint() {
      var c = conf(), sym = EL[st.i], key = sym + (st.q ? (st.q > 1 ? st.q : '') + '+' : '');
      svg.innerHTML = '';
      svg.appendChild(boxes('3d', 5, c.d, 70, 14, 10)); svg.appendChild(boxes('4s', 1, c.s, 70, 80, 2));
      var m = c.d <= 5 ? c.d : 10 - c.d, n = m + (c.s === 1 ? 1 : 0), mu = Math.sqrt(n * (n + 2));
      var colour = st.q === 0 ? null : COL[key];
      var cfgTxt = '[Ar] ' + (c.d ? '3d' + sup(c.d) : '') + (c.d && c.s ? ' ' : '') + (c.s ? '4s' + sup(c.s) : '');
      info.innerHTML = '<b>' + ionLabel(sym, st.q) + '</b> · ' + cfgTxt + ' · অযুগ্ম ইলেক্ট্ৰন n = <b>' + n + '</b><br>' +
        'চুম্বকীয় ভ্ৰামক μ = √(n(n+2)) = <b>' + mu.toFixed(2) + ' BM</b> · ' + (n ? '<b>অনুচুম্বকীয়</b> (paramagnetic)' : 'অপচুম্বকীয় (diamagnetic)') + '<br>' +
        (st.q === 0 ? 'ভূমি অৱস্থাৰ পৰমাণু — আয়ন নহয়।' :
          (colour ? 'জলীয় দ্ৰৱত বৰণ: <span class="dot" style="background:' + colour[1] + ';width:16px;height:16px;border:1px solid var(--border)"></span><b>' + colour[0] + '</b>' +
            ((c.d === 0 || c.d === 10) ? ' — d⁰ বা d¹⁰, গতিকে d–d সংক্ৰমণ নহয় আৰু বৰণ নাই।' : ' — অসম্পূৰ্ণ d অৰবিটেল থকা বাবে ইলেক্ট্ৰনে দৃশ্যমান আলো শোষণ কৰে।') :
            '<span class="en">এই আয়নটো সাধাৰণতে জলীয় দ্ৰৱত পোৱা নাযায়।</span>')) +
        ((c.d === 5 && st.q > 0) ? '<br><span class="en">d⁵ — অৰ্ধপূৰ্ণ, অতিৰিক্ত স্থিৰ।</span>' : '') + ((c.d === 10 && st.q > 0) ? '<br><span class="en">d¹⁰ — পূৰ্ণ, অতিৰিক্ত স্থিৰ।</span>' : '');
    }
    var es = k.select('Element', EL.map(function (e, i) { return { value: i, label: e + ' (Z = ' + (21 + i) + ')' }; }), st.i, function (v) { st.i = +v; paint(); });
    var qs = k.select('Charge', [0, 1, 2, 3, 4].map(function (q) { return { value: q, label: q === 0 ? 'neutral atom' : '+' + q }; }), st.q, function (v) { st.q = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [es.el, qs.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [h('span', { text: '4s ইলেক্ট্ৰন প্ৰথমে ওলায়, তাৰ পিছত 3d' }), h('span', { text: '↑ আৰু ↓ = বিপৰীত স্পিন' })]));
    paint();
  });

  /* ================================================================== 3. oxidation states */
  A.register('ox-states', function (root, k) {
    var h = k.h, W = 480, H = 300, ctx = mkCanvas(root, k, '3d শ্ৰেণীৰ মৌলৰ জাৰণ অৱস্থা', W, H);
    var EL = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'];
    var ALL = [[3], [2, 3, 4], [2, 3, 4, 5], [2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 7], [2, 3, 4, 6], [2, 3, 4], [2, 3, 4], [1, 2], [2]];
    var COM = [[3], [4], [5], [3, 6], [2, 7], [2, 3], [2, 3], [2], [2], [2]];
    var SD = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var sel = 4;
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function draw() {
      var br = k.cssVar('--brand'), pr = k.cssVar('--proton'), mu = k.cssVar('--muted'), tx = k.cssVar('--text');
      var P = plot(ctx, k, W, H, -0.5, 9.5, 0, 8, 'মৌল (Sc → Zn) →', 'জাৰণ সংখ্যা', { yf: function (v) { return '+' + Math.round(v); } });
      ctx.fillStyle = tx; ctx.font = '600 12px sans-serif';
      EL.forEach(function (e, i) { ctx.textAlign = 'center'; ctx.fillText(e, P.X(i), H - P.m.b + 16); });
      ctx.textAlign = 'start';
      ctx.fillStyle = k.cssVar('--brand-soft'); ctx.fillRect(P.X(sel - 0.45), P.m.t, P.X(sel + 0.45) - P.X(sel - 0.45), H - P.m.b - P.m.t);
      /* maximum = (n-1)d + ns electrons for Sc..Mn */
      ctx.strokeStyle = pr; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (var i = 0; i <= 4; i++) { var x = P.X(i), y = P.Y(SD[i]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke(); ctx.setLineDash([]);
      EL.forEach(function (e, i) { ALL[i].forEach(function (ox) { var com = COM[i].indexOf(ox) >= 0; dot(ctx, P.X(i), P.Y(ox), com ? br : mu, com ? 7 : 5.5, !com); }); });
      ctx.fillStyle = pr; ctx.font = '600 11px "Noto Sans Bengali", sans-serif'; ctx.fillText('ns + (n−1)d ইলেক্ট্ৰনৰ যোগফল (Mn লৈকে)', P.X(0) , P.Y(7.6));
    }
    function paint() {
      var e = EL[sel], all = ALL[sel], max = all[all.length - 1], com = COM[sel];
      info.innerHTML = '<b>' + e + '</b> — জাৰণ অৱস্থা: ' + all.map(function (o) { return com.indexOf(o) >= 0 ? '<b>+' + o + '</b>' : '+' + o; }).join(', ') + '<br>' +
        'সৰ্বোচ্চ জাৰণ অৱস্থা +' + max + (sel <= 4 ? ' = 4s আৰু 3d ইলেক্ট্ৰনৰ মুঠ সংখ্যা (' + SD[sel] + ') ✔' : ' (ইয়াৰ পিছত 3d ইলেক্ট্ৰনবোৰ নিউক্লিয়াছে বেছিকৈ টানি ৰাখে, গতিকে সৰ্বোচ্চ অৱস্থা কমে)') + '<br>' +
        (sel === 0 ? 'Sc ৰ এটাই সাধাৰণ অৱস্থা +3 — ইয়াৰ পিছত Sc³⁺ আৰ্গনৰ দৰে নিস্তেজ বিন্যাস (d⁰) পায়।' :
          sel === 4 ? 'Mn ৰ জাৰণ অৱস্থা +2 ৰ পৰা +7 লৈ আটাইতকৈ বেছি — শ্ৰেণীৰ মাজভাগত আটাইতকৈ বেছি অযুগ্ম d ইলেক্ট্ৰন।' :
            sel === 9 ? 'Zn ৰ একমাত্ৰ জাৰণ অৱস্থা +2 (d¹⁰ — d ইলেক্ট্ৰন জড়িত নহয়)।' :
              sel === 8 ? 'Cu ৰ +1 আৰু +2; জলীয় দ্ৰৱত Cu⁺ অসমঞ্জস হয়, গতিকে Cu²⁺ অধিক স্থিৰ।' : '<span class="en">গাঢ় বিন্দু = সাধাৰণ অৱস্থা (বইত গাঢ় আখৰেৰে); ফাঁপা বিন্দু = কম সাধাৰণ।</span>');
      draw();
    }
    var sl = k.slider('Element (1 = Sc … 10 = Zn)', 1, 10, 1, sel + 1, function (v) { sel = v - 1; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--brand)' }), 'সাধাৰণ অৱস্থা']), h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--muted)' }), 'কম সাধাৰণ']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--proton)' }), 'ৰঙা ডেশ = s + d ইলেক্ট্ৰন'])]));
    paint();
  });

  /* ================================================================== 4. trends across the 3d series */
  A.register('trend-plot', function (root, k) {
    var h = k.h, W = 480, H = 300, ctx = mkCanvas(root, k, '3d শ্ৰেণীত ধৰ্মৰ পৰিৱৰ্তন', W, H);
    var EL = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'];
    var N = null;
    var PROP = {
      atom: { name: 'পৰমাণুকৰণ এনথালপি (kJ mol⁻¹)', v: [326, 473, 515, 397, 281, 416, 425, 430, 339, 126], note: 'বহু সংখ্যক অযুগ্ম ইলেক্ট্ৰন থকাৰ বাবে V ত সৰ্বোচ্চ (আন্তঃপাৰমাণৱিক আন্তঃক্ৰিয়া বেছি)। Mn ত কম (d⁵ অৰ্ধপূৰ্ণ, আন্তঃক্ৰিয়া দুৰ্বল) আৰু Zn ত সৰ্বনিম্ন (126, d¹⁰ — অযুগ্ম ইলেক্ট্ৰন নাই)।' },
      ie1: { name: 'প্ৰথম আয়নীকৰণ এনথালপি (kJ mol⁻¹)', v: [631, 656, 650, 653, 717, 762, 758, 736, 745, 906], note: 'পৰমাণু ক্ৰমাংকৰ লগে লগে লাহে লাহে বাঢ়ে — ইলেক্ট্ৰন 3d লৈ সোমায় আৰু ইয়াৰ ছিল্ডিং 4s ইলেক্ট্ৰনৰ ওপৰত কাৰ্যকৰী, সেয়ে বৃদ্ধি কম। Zn ত আটাইতকৈ বেছি (4s² পূৰ্ণ)।' },
      ie2: { name: 'দ্বিতীয় আয়নীকৰণ এনথালপি (kJ mol⁻¹)', v: [1235, 1309, 1414, 1592, 1509, 1561, 1644, 1752, 1958, 1734], note: 'সাধাৰণতে বাঢ়ে। Cr আৰু Cu ত অস্বাভাৱিকভাৱে বেছি — M⁺ আয়নৰ ক্ৰমে d⁵ আৰু d¹⁰ বিন্যাস ভাঙিবলৈ বিনিময় শক্তি খৰচ হয়। Mn ত কম (Mn⁺ = 3d⁵4s¹ ৰ পৰা 4s ওলায়)।' },
      ie3: { name: 'তৃতীয় আয়নীকৰণ এনথালপি (kJ mol⁻¹)', v: [2393, 2657, 2833, 2990, 3260, 2962, 3243, 3402, 3556, 3829], note: 'Mn ত (3260) আৰু Zn ত (3829) অতি বেছি — Mn²⁺ (d⁵) আৰু Zn²⁺ (d¹⁰) স্থিৰ বিন্যাস। Fe ত কম (Fe²⁺ → Fe³⁺ ত d⁵ পোৱা যায়)। Cu, Ni, Zn ৰ বাবে +2 তকৈ বেছি অৱস্থা সচৰাচৰ নেদেখি।' },
      rad: { name: 'পৰমাণুৰ ব্যাসাৰ্ধ (pm)', v: [164, 147, 135, 129, 137, 126, 125, 125, 128, 137], note: 'শ্ৰেণীত ব্যাসাৰ্ধ কমে, কিন্তু মাজভাগত প্ৰায় একে হয় — নিউক্লীয় আধান বাঢ়িলেও d ইলেক্ট্ৰনৰ ছিল্ডিং কম নহয়; Cu, Zn ত পুনৰ বাঢ়ে (d¹⁰ ৰ ইলেক্ট্ৰন-বিকৰ্ষণ)।' },
      den: { name: 'ঘনত্ব (g cm⁻³)', v: [3.43, 4.1, 6.07, 7.19, 7.21, 7.8, 8.7, 8.9, 8.9, 7.1], note: 'ব্যাসাৰ্ধ কমে আৰু পৰমাণুৰ ভৰ বাঢ়ে, সেয়ে ঘনত্ব ক্ৰমান্বয়ে বাঢ়ে — Ti (4.1) ৰ পৰা Cu (8.9) লৈ উল্লেখযোগ্য বৃদ্ধি।' },
      e2: { name: 'E° (M²⁺|M) (V)', v: [N, -1.63, -1.18, -0.90, -1.18, -0.44, -0.28, -0.25, 0.34, -0.76], note: 'সাধাৰণতে ঋণাত্মক মান কমে। Mn (−1.18) আৰু Zn (−0.76) ত বেছি ঋণাত্মক — Mn²⁺ (d⁵) আৰু Zn²⁺ (d¹⁰) স্থিৰ। Cu (+0.34) ধনাত্মক — ইয়াৰ পৰমাণুকৰণ এনথালপি বেছি আৰু জলযোজন এনথালপি কম; সেয়ে Cu এ H⁺ ৰ পৰা H₂ মুক্ত নকৰে।' },
      e3: { name: 'E° (M³⁺|M²⁺) (V)', v: [N, -0.37, -0.26, -0.41, 1.57, 0.77, 1.97, N, N, N], note: 'Mn (+1.57) আৰু Co (+1.97) ত বহুত বেছি ধনাত্মক — Mn³⁺ আৰু Co³⁺ অতি তীব্ৰ জাৰক। Mn²⁺ ৰ d⁵ স্থিৰ, গতিকে ইয়াক জাৰিত কৰা কঠিন। Fe³⁺ (d⁵) স্থিৰ, গতিকে Fe ৰ মান (+0.77) তুলনামূলকভাৱে কম। Cr³⁺ (d³, t₂g অৰ্ধপূৰ্ণ) স্থিৰ — মান ঋণাত্মক।' }
    };
    var cur = 'atom', sel = 4;
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function draw() {
      var p = PROP[cur], vals = p.v.filter(function (x) { return x !== null; });
      var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), pad = (hi - lo) * 0.12 || 1;
      var br = k.cssVar('--brand'), org = k.cssVar('--alpha'), tx = k.cssVar('--text');
      var P = plot(ctx, k, W, H, -0.5, 9.5, lo - pad, hi + pad, 'মৌল (Sc → Zn) →', 'মান', { yf: function (v) { return Math.abs(hi) > 50 ? String(Math.round(v)) : v.toFixed(2); } });
      ctx.fillStyle = tx; ctx.font = '600 12px sans-serif';
      EL.forEach(function (e, i) { ctx.textAlign = 'center'; ctx.fillText(e, P.X(i), H - P.m.b + 16); }); ctx.textAlign = 'start';
      ctx.strokeStyle = br; ctx.lineWidth = 2.5; ctx.beginPath(); var go = false;
      p.v.forEach(function (v, i) { if (v === null) { go = false; return; } if (!go) { ctx.moveTo(P.X(i), P.Y(v)); go = true; } else ctx.lineTo(P.X(i), P.Y(v)); });
      ctx.stroke();
      p.v.forEach(function (v, i) { if (v !== null) dot(ctx, P.X(i), P.Y(v), i === sel ? org : br, i === sel ? 8 : 5); });
    }
    function paint() {
      var p = PROP[cur], v = p.v[sel];
      info.innerHTML = '<b>' + p.name + '</b> — ' + ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'][sel] + ': <b>' + (v === null ? 'তথ্য নাই' : v) + '</b><br>' + p.note;
      draw();
    }
    var ps = k.select('Property', Object.keys(PROP).map(function (key) { return { value: key, label: PROP[key].name }; }), cur, function (v) { cur = v; paint(); });
    var sl = k.slider('Element (1 = Sc … 10 = Zn)', 1, 10, 1, sel + 1, function (v) { sel = v - 1; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [ps.el])); root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. lanthanoid contraction */
  A.register('lanthanoid', function (root, k) {
    var h = k.h, s = k.s, W = 480, H = 260, ctx = mkCanvas(root, k, 'লেন্থেনয়ড সংকোচন: Ln³⁺ ৰ ব্যাসাৰ্ধ', W, H);
    var LN = ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu'];
    var R3 = [106, 103, 101, 99, 98, 96, 95, 94, 92, 91, 89, 88, 87, 86, 85];
    var sel = 0, info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var svg = s('svg', { viewBox: '0 0 400 70', 'class': 'anim-svg', role: 'img', 'aria-label': '4f অৰবিটেলত ইলেক্ট্ৰন' });
    function draw() {
      var br = k.cssVar('--brand'), org = k.cssVar('--alpha'), tx = k.cssVar('--text');
      var P = plot(ctx, k, W, H, 56.5, 71.5, 82, 110, 'পৰমাণু ক্ৰমাংক (Z) →', 'Ln³⁺ ব্যাসাৰ্ধ (pm)', { yf: function (v) { return String(Math.round(v)); }, });
      ctx.strokeStyle = br; ctx.lineWidth = 2.5; ctx.beginPath(); R3.forEach(function (r, i) { if (i === 0) ctx.moveTo(P.X(57 + i), P.Y(r)); else ctx.lineTo(P.X(57 + i), P.Y(r)); }); ctx.stroke();
      R3.forEach(function (r, i) { dot(ctx, P.X(57 + i), P.Y(r), i === sel ? org : br, i === sel ? 8 : 4.5); });
      ctx.fillStyle = tx; ctx.font = '600 11px sans-serif'; ctx.fillText('La', P.X(57) + 6, P.Y(106) - 8); ctx.fillText('Lu', P.X(71) - 18, P.Y(85) - 10);
    }
    function boxes(n) {
      svg.innerHTML = '';
      for (var i = 0; i < 7; i++) {
        var up = i < Math.min(n, 7), dn = i < Math.max(0, n - 7);
        svg.appendChild(s('rect', { x: 20 + i * 52, y: 10, width: 44, height: 48, rx: 6, fill: 'none', style: 'stroke:' + (up ? 'var(--brand)' : 'var(--border)'), 'stroke-width': 2.5 }));
        if (up) svg.appendChild(s('text', { x: 20 + i * 52 + 14, y: 42, 'font-size': 26, 'font-weight': 800, style: 'fill:var(--electron)', text: '↑' }));
        if (dn) svg.appendChild(s('text', { x: 20 + i * 52 + 28, y: 42, 'font-size': 26, 'font-weight': 800, style: 'fill:var(--proton)', text: '↓' }));
      }
    }
    function paint() {
      var n = sel, unp = n <= 7 ? n : 14 - n, z = 57 + sel;
      info.innerHTML = '<b>' + LN[sel] + '</b><sup>3+</sup> (Z = ' + z + ') · বিন্যাস 4f<sup>' + n + '</sup> · ব্যাসাৰ্ধ = <b>' + R3[sel] + ' pm</b> · অযুগ্ম ইলেক্ট্ৰন = ' + unp + '<br>' +
        'La<sup>3+</sup> (106 pm) ৰ পৰা Lu<sup>3+</sup> (85 pm) লৈ <b>21 pm</b> কমিছে — ইয়াকেই <b>লেন্থেনয়ড সংকোচন</b> বোলে।<br>' +
        '<span class="en">কাৰণ: 4f ইলেক্ট্ৰনে ইটোৱে সিটোক অসম্পূৰ্ণকৈ ছিল্ড কৰে, গতিকে Z বাঢ়িলে নিউক্লীয় আধানৰ টান বাঢ়ে আৰু আকাৰ কমে। ফলত Zr (160 pm) আৰু Hf (159 pm) ৰ ব্যাসাৰ্ধ প্ৰায় সমান — সিহঁতৰ ৰসায়ন প্ৰায় একে আৰু পৃথক কৰা কঠিন।</span>' +
        (sel === 0 || sel === 14 ? '<br>La³⁺ আৰু Lu³⁺ বৰণহীন (f⁰ আৰু f¹⁴); আন আয়নবোৰ ৰঙীন আৰু বেছিভাগ অনুচুম্বকীয়।' : '');
      boxes(n); draw();
    }
    var sl = k.slider('Ln (1 = La … 15 = Lu)', 1, 15, 1, 1, function (v) { sel = v - 1; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(svg); root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. chromate / dichromate and pH */
  A.register('chromate-ph', function (root, k) {
    var h = k.h, s = k.s, pH = 8;
    var svg = s('svg', { viewBox: '0 0 400 250', 'class': 'anim-svg', role: 'img', 'aria-label': 'pH ৰ লগত ক্ৰ\'মেট আৰু ডাইক্ৰ\'মেটৰ ৰূপান্তৰ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function frac() { return 1 / (1 + Math.pow(10, (pH - 5.5) * 1.6)); }
    function mix(a, b, t) { return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }
    function paint() {
      var f = frac(), c = mix([240, 214, 40], [240, 128, 30], f);
      svg.innerHTML = '';
      var fl = flask(s, 'rgb(' + c.join(',') + ')'); svg.appendChild(fl.g);
      var nPairs = Math.round(f * 6), i;
      for (i = 0; i < 6; i++) {
        var cx = 120 + (i % 3) * 30, cy = 165 + Math.floor(i / 3) * 30;      /* stays inside the liquid */
        if (i < nPairs) { svg.appendChild(s('circle', { cx: cx - 6, cy: cy, r: 8, style: 'fill:#d9480f;stroke:var(--canvas)', 'stroke-width': 1.5 })); svg.appendChild(s('circle', { cx: cx + 6, cy: cy, r: 8, style: 'fill:#d9480f;stroke:var(--canvas)', 'stroke-width': 1.5 })); }
        else svg.appendChild(s('circle', { cx: cx, cy: cy, r: 9, style: 'fill:#b08900;stroke:var(--canvas)', 'stroke-width': 1.5 }));
      }
      svg.appendChild(s('text', { x: 238, y: 60, 'font-size': 13, 'font-weight': 700, style: 'fill:var(--text)', text: 'pH = ' + pH.toFixed(1) }));
      svg.appendChild(s('text', { x: 238, y: 86, 'font-size': 11, style: 'fill:#b08900', text: '● CrO₄²⁻' })); svg.appendChild(s('text', { x: 238, y: 100, 'font-size': 11, style: 'fill:#b08900', text: '(হালধীয়া)' }));
      svg.appendChild(s('text', { x: 238, y: 124, 'font-size': 11, style: 'fill:#d9480f', text: '●● Cr₂O₇²⁻' })); svg.appendChild(s('text', { x: 238, y: 138, 'font-size': 11, style: 'fill:#d9480f', text: '(কমলা)' }));
      info.innerHTML = '2CrO<sub>4</sub><sup>2−</sup> + 2H<sup>+</sup> ⇌ Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> + H<sub>2</sub>O<br>' +
        (f > 0.6 ? '<b>অম্লীয় মাধ্যম:</b> H<sup>+</sup> বেছি, সাম্য সোঁফালে — <b>ডাইক্ৰ\'মেট (কমলা)</b> প্ৰধান।' : (f < 0.4 ? '<b>ক্ষাৰকীয় মাধ্যম:</b> OH<sup>−</sup> য়ে H<sup>+</sup> ক শেষ কৰে, সাম্য বাওঁফালে — <b>ক্ৰ\'মেট (হালধীয়া)</b> প্ৰধান।' : 'মধ্যৱৰ্তী pH — দুয়োটা আয়ন একেলগে।')) +
        '<br>দুয়োটাতে ক্ৰ\'মিয়ামৰ জাৰণ অৱস্থা +6 (একে) — গতিকে এইটো ৰেডক্স নহয়, কেৱল pH অনুসৰি ৰূপান্তৰ।' +
        '<br><span class="en">ক্ৰ\'মেট আয়ন চতুৰ্ফলকীয়; ডাইক্ৰ\'মেটত দুটা চতুৰ্ফলক এটা O ৰে লগ লাগি থাকে (Cr–O–Cr কোণ ≈ 126°)। (সাম্যৰ pH ৰ মান ছবিৰ বাবে আদৰ্শায়িত।)</span>';
      fl.set('rgb(' + c.join(',') + ')');
    }
    var sl = k.slider('pH', 1, 12, 0.5, pH, function (v) { pH = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sl.el, k.button('Add acid (pH 2)', function () { pH = 2; sl.input.value = 2; sl.out.textContent = 2; paint(); }), k.button('Add alkali (pH 10)', function () { pH = 10; sl.input.value = 10; sl.out.textContent = 10; paint(); })]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. dichromate as oxidant */
  A.register('dichromate', function (root, k) {
    var h = k.h, s = k.s;
    var RED = {
      Fe: { n: 'Fe²⁺ (আইৰন(II))', eq: 'Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O', half: '6Fe²⁺ → 6Fe³⁺ + 6e⁻', note: 'এই বিক্ৰিয়াৰ ভিত্তিতে আয়তনসাপেক্ষ অনুমাপনেৰে K₂Cr₂O₇ ৰ সহায়ত আইৰণৰ পৰিমাণ নিৰ্ণয় কৰিব পাৰি।', end: '#4aa56a' },
      I: { n: 'I⁻ (আয়\'ডাইড)', eq: 'Cr₂O₇²⁻ + 14H⁺ + 6I⁻ → 2Cr³⁺ + 3I₂ + 7H₂O', half: '6I⁻ → 3I₂ + 6e⁻', note: 'আয়\'ডিন মুক্ত হ\'ব (ঘন বেঙুনীয়া-বাদামী)।', end: '#7a8a3a' },
      Sn: { n: 'Sn²⁺ (টিন(II))', eq: 'Cr₂O₇²⁻ + 14H⁺ + 3Sn²⁺ → 2Cr³⁺ + 3Sn⁴⁺ + 7H₂O', half: '3Sn²⁺ → 3Sn⁴⁺ + 6e⁻', note: 'Sn(II) ৰ Sn(IV) লৈ জাৰণ।', end: '#4aa56a' },
      H2S: { n: 'H₂S (ছালফাইড)', eq: 'Cr₂O₇²⁻ + 8H⁺ + 3H₂S → 2Cr³⁺ + 3S + 7H₂O', half: '3H₂S → 6H⁺ + 3S + 6e⁻', note: 'ছালফাৰৰ হালধীয়া অধঃক্ষেপ পোৱা যায়।', end: '#6aa04a' }
    };
    var cur = 'Fe', t = -1;
    var svg = s('svg', { viewBox: '0 0 300 240', 'class': 'anim-svg', role: 'img', 'aria-label': 'অম্লীয় K₂Cr₂O₇ ৰ সৈতে বিজাৰকৰ বিক্ৰিয়া' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var fl;
    function build() { svg.innerHTML = ''; fl = flask(s, '#e8821e'); svg.appendChild(fl.g); t = -1; paint(); }
    function paint() {
      var r = RED[cur];
      info.innerHTML = 'অম্লীয় K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> — Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> + 14H<sup>+</sup> + 6e<sup>−</sup> → 2Cr<sup>3+</sup> + 7H<sub>2</sub>O (<b>E° = 1.33 V</b>)<br>' +
        'বিজাৰক ' + r.n + ': ' + r.half + '<br><b>' + r.eq + '</b><br>' +
        '<span class="en">কমলা Cr₂O₇²⁻ ৰ পৰা সেউজীয়া Cr³⁺ — Cr(VI) বিজাৰিত হৈ Cr(III) হয়। ' + r.note + '</span>';
    }
    function run() { fl.set(RED[cur].end); t = 0; }
    var sel = k.select('Reducing agent', Object.keys(RED).map(function (x) { return { value: x, label: RED[x].n }; }), cur, function (v) { cur = v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, k.button('Add reducing agent', run, 'primary'), k.button('Reset', build)]));
    root.appendChild(info);
    build();
  });

  /* ================================================================== 8. permanganate in different media */
  A.register('kmno4', function (root, k) {
    var h = k.h, s = k.s;
    var MED = {
      acid: { n: 'Acidic', prod: 'Mn²⁺ (প্ৰায় বৰণহীন / ম্লান গুলপীয়া)', col: '#f3e6ee', half: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O', E: '+1.52 V', e: 5, desc: 'অম্লীয় মাধ্যমত Mn(VII) ৰ পৰা Mn(II) লৈ 5 টা ইলেক্ট্ৰন লৈ বিজাৰিত হয়; বেঙুনীয়া বৰণ লোপ পায়।' },
      neutral: { n: 'Neutral / weakly alkaline', prod: 'MnO₂ (বাদামী অধঃক্ষেপ)', col: '#8a5a2b', half: 'MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻  (অম্লীয়ত: MnO₄⁻ + 4H⁺ + 3e⁻ → MnO₂ + 2H₂O, E° = +1.69 V)', E: '+1.69 V', e: 3, desc: 'প্ৰশম বা অল্প ক্ষাৰকীয় মাধ্যমত 3 টা ইলেক্ট্ৰন লয়; MnO₂ ৰ বাদামী অধঃক্ষেপ পৰে।' },
      alkaline: { n: 'Strongly alkaline', prod: 'MnO₄²⁻ (সেউজীয়া)', col: '#2f9e44', half: 'MnO₄⁻ + e⁻ → MnO₄²⁻', E: '+0.56 V', e: 1, desc: 'তীব্ৰ ক্ষাৰকীয় মাধ্যমত মাত্ৰ 1 টা ইলেক্ট্ৰন লৈ মেংগানেট (সেউজীয়া) দিয়ে।' }
    };
    var RED = {
      I: { n: 'I⁻', acid: '10I⁻ + 2MnO₄⁻ + 16H⁺ → 2Mn²⁺ + 8H₂O + 5I₂', neutral: '2MnO₄⁻ + H₂O + I⁻ → 2MnO₂ + 2OH⁻ + IO₃⁻' },
      Fe: { n: 'Fe²⁺', acid: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺', neutral: null },
      ox: { n: 'C₂O₄²⁻ (অক্সেলেট, 333 K)', acid: '5C₂O₄²⁻ + 2MnO₄⁻ + 16H⁺ → 2Mn²⁺ + 8H₂O + 10CO₂', neutral: null },
      S: { n: 'H₂S', acid: '5S²⁻ + 2MnO₄⁻ + 16H⁺ → 2Mn²⁺ + 8H₂O + 5S', neutral: null },
      SO3: { n: 'SO₃²⁻', acid: '5SO₃²⁻ + 2MnO₄⁻ + 6H⁺ → 2Mn²⁺ + 3H₂O + 5SO₄²⁻', neutral: null },
      NO2: { n: 'NO₂⁻', acid: '5NO₂⁻ + 2MnO₄⁻ + 6H⁺ → 2Mn²⁺ + 5NO₃⁻ + 3H₂O', neutral: null },
      S2O3: { n: 'S₂O₃²⁻ (থায়\'ছালফেট)', acid: null, neutral: '8MnO₄⁻ + 3S₂O₃²⁻ + H₂O → 8MnO₂ + 6SO₄²⁻ + 2OH⁻' }
    };
    var med = 'acid', red = 'I';
    var svg = s('svg', { viewBox: '0 0 300 240', 'class': 'anim-svg', role: 'img', 'aria-label': 'বিভিন্ন মাধ্যমত KMnO₄ ৰ বিজাৰণ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var fl;
    function build() { svg.innerHTML = ''; fl = flask(s, '#7b2d8e'); svg.appendChild(fl.g); paint(); }
    function paint() {
      var m = MED[med], r = RED[red], eq = med === 'acid' ? r.acid : (med === 'neutral' ? r.neutral : null);
      info.innerHTML = '<b>' + m.n + ' মাধ্যম:</b> ' + m.desc + '<br>' + m.half + ' (E° = ' + m.E + ') · লোৱা ইলেক্ট্ৰন = <b>' + m.e + '</b><br>' +
        'বিক্ৰিয়াজাত: <b>' + m.prod + '</b><br>' + (eq ? 'বিজাৰক ' + r.n + ': <b>' + eq + '</b>' : '<span class="en">এই বিজাৰকৰ বাবে ' + (med === 'alkaline' ? 'তীব্ৰ ক্ষাৰকীয় মাধ্যমৰ সমীকৰণ বইত দিয়া হোৱা নাই।' : 'বইত এই মাধ্যমৰ সমীকৰণ দিয়া হোৱা নাই; আন বিজাৰক বাছনি কৰক।') + '</span>') +
        (med === 'acid' ? '<br><span class="en">টোকা: অম্লীয় মাধ্যম হিচাপে লঘু H₂SO₄ ব্যৱহাৰ কৰা হয়; HCl ত অনুমাপন সন্তোষজনক নহয় কিয়নো MnO₄⁻ য়ে Cl⁻ ক Cl₂ লৈ জাৰিত কৰে।</span>' : '');
    }
    function run() { fl.set(MED[med].col); }
    var ms = k.select('Medium', Object.keys(MED).map(function (x) { return { value: x, label: MED[x].n }; }), med, function (v) { med = v; build(); });
    var rs = k.select('Reducing agent', Object.keys(RED).map(function (x) { return { value: x, label: RED[x].n }; }), red, function (v) { red = v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [ms.el, rs.el]));
    root.appendChild(h('div', { 'class': 'row' }, [k.button('Add reducing agent', run, 'primary'), k.button('Reset', build)]));
    root.appendChild(info);
    build();
  });
})();
