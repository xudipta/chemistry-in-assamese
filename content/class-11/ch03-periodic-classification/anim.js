/* Animations for Class 11, Chapter 3: Classification of Elements and Periodicity in Properties
   (মৌলবোৰৰ শ্ৰেণীবিভাজন আৰু পৰ্যায়গত ধৰ্ম).
   Registered: triads, mendeleev-eka, moseley, iupac-name, periodic-table, config-position,
               trends, isoelectronic, successive-ie, valence-oxides
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var EL = window.ChemElements;
  var L = A.t;   /* L(assamese, english) */

  var SUPM = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺' };
  var SUBM = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  function sup(x) { return String(x).split('').map(function (c) { return SUPM[c] || c; }).join(''); }
  function sub(x) { return String(x).split('').map(function (c) { return SUBM[c] || c; }).join(''); }
  function T(s, x, y, size, anchor, text, style, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  function opts(list) { return list.map(function (o) { return { value: o[0], label: o[1] }; }); }

  /* ---------------------------------------------------------------- element data (Z = 1 .. 118) */
  var RAW = 'H Hydrogen,He Helium,Li Lithium,Be Beryllium,B Boron,C Carbon,N Nitrogen,O Oxygen,F Fluorine,Ne Neon,' +
    'Na Sodium,Mg Magnesium,Al Aluminium,Si Silicon,P Phosphorus,S Sulphur,Cl Chlorine,Ar Argon,K Potassium,Ca Calcium,' +
    'Sc Scandium,Ti Titanium,V Vanadium,Cr Chromium,Mn Manganese,Fe Iron,Co Cobalt,Ni Nickel,Cu Copper,Zn Zinc,' +
    'Ga Gallium,Ge Germanium,As Arsenic,Se Selenium,Br Bromine,Kr Krypton,Rb Rubidium,Sr Strontium,Y Yttrium,Zr Zirconium,' +
    'Nb Niobium,Mo Molybdenum,Tc Technetium,Ru Ruthenium,Rh Rhodium,Pd Palladium,Ag Silver,Cd Cadmium,In Indium,Sn Tin,' +
    'Sb Antimony,Te Tellurium,I Iodine,Xe Xenon,Cs Caesium,Ba Barium,La Lanthanum,Ce Cerium,Pr Praseodymium,Nd Neodymium,' +
    'Pm Promethium,Sm Samarium,Eu Europium,Gd Gadolinium,Tb Terbium,Dy Dysprosium,Ho Holmium,Er Erbium,Tm Thulium,Yb Ytterbium,' +
    'Lu Lutetium,Hf Hafnium,Ta Tantalum,W Tungsten,Re Rhenium,Os Osmium,Ir Iridium,Pt Platinum,Au Gold,Hg Mercury,' +
    'Tl Thallium,Pb Lead,Bi Bismuth,Po Polonium,At Astatine,Rn Radon,Fr Francium,Ra Radium,Ac Actinium,Th Thorium,' +
    'Pa Protactinium,U Uranium,Np Neptunium,Pu Plutonium,Am Americium,Cm Curium,Bk Berkelium,Cf Californium,Es Einsteinium,Fm Fermium,' +
    'Md Mendelevium,No Nobelium,Lr Lawrencium,Rf Rutherfordium,Db Dubnium,Sg Seaborgium,Bh Bohrium,Hs Hassium,Mt Meitnerium,Ds Darmstadtium,' +
    'Rg Roentgenium,Cn Copernicium,Nh Nihonium,Fl Flerovium,Mc Moscovium,Lv Livermorium,Ts Tennessine,Og Oganesson';
  var E = [null];
  RAW.split(',').forEach(function (x, i) { var p = x.split(' '); E.push({ z: i + 1, sym: p[0], en: p[1] }); });
  function eName(z) { return (z <= 36 && EL[z]) ? L(EL[z].as, EL[z].en) : E[z].en; }

  /* position in the long-form table (the book's layout: La and Ac sit in group 3, f-block = Ce-Lu and Th-Lr) */
  var STARTS = [1, 3, 11, 19, 37, 55, 87, 119];
  function pos(z) {
    var p, g;
    for (p = 1; p <= 7; p++) if (z < STARTS[p]) break;
    var off = z - STARTS[p - 1];
    if (p === 1) g = (z === 1) ? 1 : 18;
    else if (p <= 3) g = off < 2 ? off + 1 : off + 11;
    else if (p <= 5) g = off + 1;
    else if (off < 2) g = off + 1;
    else if (off === 2) g = 3;
    else if (off <= 16) g = 0;
    else g = off - 13;
    var blk = g === 0 ? 'f' : (g <= 2 && z !== 2) ? 's' : g <= 12 ? 'd' : 'p';
    var row = g === 0 ? (p === 6 ? 8.4 : 9.4) : p;
    var col = g === 0 ? off : g;
    return { p: p, g: g, blk: blk, row: row, col: col };
  }
  var NONMETAL = [1, 2, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36, 53, 54, 85, 86];
  var METALLOID = [14, 32, 33, 51, 52];
  function kind(z) {
    if (METALLOID.indexOf(z) >= 0) return 'metalloid';
    if (NONMETAL.indexOf(z) >= 0) return 'nonmetal';
    if (z >= 109) return 'unknown';
    return 'metal';
  }

  /* ground-state electronic configurations: Aufbau (n+l) order plus the known exceptions */
  var ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
  var CAP = { s: 2, p: 6, d: 10, f: 14 };
  var LORD = { s: 0, p: 1, d: 2, f: 3 };
  var EXC = {
    24: { '3d': 5, '4s': 1 }, 29: { '3d': 10, '4s': 1 }, 41: { '4d': 4, '5s': 1 }, 42: { '4d': 5, '5s': 1 },
    44: { '4d': 7, '5s': 1 }, 45: { '4d': 8, '5s': 1 }, 46: { '4d': 10, '5s': 0 }, 47: { '4d': 10, '5s': 1 },
    57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 }, 78: { '4f': 14, '5d': 9, '6s': 1 },
    79: { '4f': 14, '5d': 10, '6s': 1 }, 89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 },
    92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 }, 103: { '5f': 14, '6d': 0, '7p': 1 }
  };
  var NOBLE = [2, 10, 18, 36, 54, 86];
  function cfg(z) {
    var left = z, c = {};
    ORDER.forEach(function (o) { var n = Math.min(CAP[o.charAt(1)], left); c[o] = n; left -= n; });
    var ex = EXC[z];
    if (ex) Object.keys(ex).forEach(function (o) { c[o] = ex[o]; });
    return c;
  }
  function sortShells(a, b) {
    var na = +a.charAt(0), nb = +b.charAt(0);
    return na !== nb ? na - nb : LORD[a.charAt(1)] - LORD[b.charAt(1)];
  }
  function cfgText(c, skip) {
    return Object.keys(c).filter(function (o) { return c[o] - (skip ? (skip[o] || 0) : 0) > 0; }).sort(sortShells)
      .map(function (o) { return o + sup(c[o] - (skip ? (skip[o] || 0) : 0)); }).join(' ');
  }
  function cfgShort(z) {
    var core = 0;
    NOBLE.forEach(function (g) { if (g < z) core = g; });
    var c = cfg(z);
    if (!core) return cfgText(c);
    return '[' + E[core].sym + '] ' + cfgText(c, cfg(core));
  }
  function cfgFull(z) { return cfgText(cfg(z)); }

  var BLK_COL = { s: '#f76707', p: '#1c7ed6', d: '#2f9e44', f: '#ae3ec9' };
  var KIND_COL = { metal: '#1c7ed6', nonmetal: '#f08c00', metalloid: '#2f9e44', unknown: '#868e96' };

  /* ================================================================== 1. triads / octaves */
  A.register('triads', function (root, k) {
    var h = k.h, s = k.s;
    var TRI = {
      'Li-Na-K': [['Li', 7], ['Na', 23], ['K', 39]],
      'Ca-Sr-Ba': [['Ca', 40], ['Sr', 88], ['Ba', 137]],
      'Cl-Br-I': [['Cl', 35.5], ['Br', 80], ['I', 127]]
    };
    var OCT = [['Li', 7], ['Be', 9], ['B', 11], ['C', 12], ['N', 14], ['O', 16], ['F', 19],
      ['Na', 23], ['Mg', 24], ['Al', 27], ['Si', 29], ['P', 31], ['S', 32], ['Cl', 35.5], ['K', 39], ['Ca', 40]];
    var NOTE = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'];
    var st = { mode: 'triad', tri: 'Li-Na-K', el: 'Li' };
    var svg = s('svg', { viewBox: '0 0 360 200', 'class': 'anim-svg', role: 'img', 'aria-label': L("ডবৰাইনাৰৰ ট্ৰায়াড আৰু নিউলেণ্ডছৰ অষ্টক", "Döbereiner's triads and Newlands' octaves") });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var selMode = k.select('Law', opts([['triad', "Döbereiner's triads"], ['octave', "Newlands' octaves"]]), st.mode, function (v) { st.mode = v; syncCtl(); paint(); });
    var selTri = k.select('Triad', opts(Object.keys(TRI).map(function (x) { return [x, x]; })), st.tri, function (v) { st.tri = v; paint(); });
    var selEl = k.select('Element', opts(OCT.map(function (o) { return [o[0], o[0] + ' (' + o[1] + ')']; })), st.el, function (v) { st.el = v; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [selMode.el, selTri.el, selEl.el]));
    root.appendChild(out);
    function syncCtl() { selTri.el.style.display = st.mode === 'triad' ? '' : 'none'; selEl.el.style.display = st.mode === 'octave' ? '' : 'none'; }
    function paint() {
      svg.innerHTML = '';
      if (st.mode === 'triad') {
        var t = TRI[st.tri], mean = (t[0][1] + t[2][1]) / 2;
        t.forEach(function (e, i) {
          var x = 60 + i * 120;
          svg.appendChild(s('rect', { x: x - 40, y: 50, width: 80, height: 70, rx: 10, fill: i === 1 ? 'var(--brand-soft)' : 'var(--surface-2)', stroke: 'var(--brand)', 'stroke-width': i === 1 ? 3 : 1.5 }));
          svg.appendChild(T(s, x, 82, 26, 'middle', e[0], 'fill:var(--text)', 700));
          svg.appendChild(T(s, x, 108, 14, 'middle', String(e[1]), 'fill:var(--text)'));
        });
        svg.appendChild(T(s, 180, 30, 13, 'middle', L("পাৰমাণৱিক ভাৰৰ ক্ৰমত", 'in order of atomic mass'), 'fill:var(--muted)'));
        svg.appendChild(T(s, 180, 150, 14, 'middle', '(' + t[0][1] + ' + ' + t[2][1] + ') / 2 = ' + mean, 'fill:var(--text)', 600));
        svg.appendChild(T(s, 180, 175, 14, 'middle', L("মাজৰ মৌলৰ ভাৰ = ", 'middle element = ') + t[1][1], 'fill:var(--brand)', 700));
        out.innerHTML = '';
        out.appendChild(h('div', { html: L("<b>ট্ৰায়াড " + st.tri + "</b>: প্ৰথম আৰু তৃতীয় মৌলৰ গড় = ", "<b>Triad " + st.tri + "</b>: the average of the first and third = ") + '<b>' + mean + '</b>' + L("; মাজৰ মৌলৰ প্ৰকৃত ভাৰ = ", "; actual mass of the middle element = ") + '<b>' + t[1][1] + '</b>' + L(" (পাৰ্থক্য ", " (difference ") + Math.abs(mean - t[1][1]).toFixed(2) + ').' }));
        return;
      }
      var idx = 0; OCT.forEach(function (o, i) { if (o[0] === st.el) idx = i; });
      var colI = idx % 7;
      NOTE.forEach(function (n, c) { svg.appendChild(T(s, 40 + c * 45, 22, 12, 'middle', n, 'fill:var(--muted)', 600)); });
      OCT.forEach(function (o, i) {
        var c = i % 7, r = Math.floor(i / 7);
        var same = c === colI, me = i === idx, eighth = i === idx + 7 || i === idx - 7;
        svg.appendChild(s('rect', { x: 40 + c * 45 - 19, y: 32 + r * 52, width: 38, height: 42, rx: 6, fill: me ? 'var(--brand)' : same ? 'var(--brand-soft)' : 'var(--surface-2)', stroke: eighth ? 'var(--accent)' : 'var(--border)', 'stroke-width': eighth ? 3 : 1 }));
        svg.appendChild(T(s, 40 + c * 45, 54 + r * 52, 14, 'middle', o[0], me ? 'fill:var(--brand-ink)' : 'fill:var(--text)', 700));
        svg.appendChild(T(s, 40 + c * 45, 68 + r * 52, 9, 'middle', String(o[1]), me ? 'fill:var(--brand-ink)' : 'fill:var(--muted)'));
      });
      svg.appendChild(T(s, 180, 192, 11, 'middle', L("একে স্তম্ভৰ মৌলৰ ধৰ্ম একে ধৰণৰ", 'elements in one column behave alike'), 'fill:var(--muted)'));
      var nxt = OCT[idx + 7] || OCT[idx - 7];
      var txt = L("<b>" + OCT[idx][0] + "</b> আৰু <b>" + nxt[0] + "</b> ৰ মাজত ঠিক আঠটা স্থানৰ ব্যৱধান (এটা অষ্টক); দুয়োটাৰে ধৰ্ম একে ধৰণৰ, সংগীতৰ একেটা সুৰৰ দৰে।",
        "<b>" + OCT[idx][0] + "</b> and <b>" + nxt[0] + "</b> are exactly eight places apart (one octave) and behave alike, like the same note an octave higher.");
      out.innerHTML = ''; out.appendChild(h('div', { html: txt + ' ' + L("কিন্তু কেলছিয়ামৰ পাছত এই নিয়ম ভাঙি পৰে।", "But the pattern breaks down after calcium.") }));
    }
    syncCtl(); paint();
  });

  /* ================================================================== 2. Mendeleev's eka-elements */
  A.register('mendeleev-eka', function (root, k) {
    var h = k.h, s = k.s;
    var D = {
      al: { eka: 'eka-aluminium', real: 'Gallium (Ga)', rowsOf: [
        [L("পাৰমাণৱিক ভাৰ", 'Atomic mass'), '68', '70'], [L("ঘনত্ব (g/cm³)", 'Density (g/cm³)'), '5.9', '5.94'],
        [L("গলনাংক (K)", 'Melting point (K)'), L("কম", 'low'), '302.93'], [L("অক্সাইড", 'Oxide'), 'E₂O₃', 'Ga₂O₃'], [L("ক্ল'ৰাইড", 'Chloride'), 'ECl₃', 'GaCl₃']] },
      si: { eka: 'eka-silicon', real: 'Germanium (Ge)', rowsOf: [
        [L("পাৰমাণৱিক ভাৰ", 'Atomic mass'), '72', '72.6'], [L("ঘনত্ব (g/cm³)", 'Density (g/cm³)'), '5.5', '5.36'],
        [L("গলনাংক (K)", 'Melting point (K)'), L("বেছি", 'high'), '1231'], [L("অক্সাইড", 'Oxide'), 'EO₂', 'GeO₂'], [L("ক্ল'ৰাইড", 'Chloride'), 'ECl₄', 'GeCl₄']] }
    };
    var st = { w: 'al', found: false };
    var svg = s('svg', { viewBox: '0 0 360 190', 'class': 'anim-svg', role: 'img', 'aria-label': L("মেণ্ডেলিভৰ খালী স্থান আৰু পাছত আৱিষ্কৃত মৌল", "Mendeleev's gaps and the elements found later") });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sel = k.select('Prediction', opts([['al', 'eka-aluminium → gallium'], ['si', 'eka-silicon → germanium']]), st.w, function (v) { st.w = v; st.found = false; paint(); });
    var btn = k.button('Reveal discovery', function () { st.found = !st.found; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, btn]));
    root.appendChild(out);
    function paint() {
      svg.innerHTML = '';
      var d = D[st.w];
      var col = st.w === 'al' ? [['B', '5'], ['Al', '13'], ['?', ''], ['In', '49']] : [['C', '6'], ['Si', '14'], ['?', ''], ['Sn', '50']];
      svg.appendChild(T(s, 90, 20, 12, 'middle', st.w === 'al' ? L("বৰ্গ III", 'Group III') : L("বৰ্গ IV", 'Group IV'), 'fill:var(--muted)', 600));
      col.forEach(function (c, i) {
        var y = 30 + i * 38, gap = c[0] === '?';
        var filled = gap && st.found;
        svg.appendChild(s('rect', { x: 55, y: y, width: 70, height: 32, rx: 6, fill: gap ? (filled ? 'var(--brand-soft)' : 'none') : 'var(--surface-2)', stroke: gap && !filled ? 'var(--accent)' : 'var(--brand)', 'stroke-width': gap ? 2 : 1, 'stroke-dasharray': gap && !filled ? '5 4' : '' }));
        var label = gap ? (filled ? (st.w === 'al' ? 'Ga' : 'Ge') : '?') : c[0];
        svg.appendChild(T(s, 90, y + 21, 16, 'middle', label, 'fill:var(--text)', 700));
      });
      svg.appendChild(T(s, 90, 186, 10, 'middle', L("খালী ঠাই = ", 'gap = ') + d.eka, 'fill:var(--accent)'));
      svg.appendChild(T(s, 255, 20, 12, 'middle', L("ধৰ্ম: ভৱিষ্যদ্বাণী → পৰীক্ষাৰ ফল", 'Property: prediction → measured'), 'fill:var(--muted)', 600));
      d.rowsOf.forEach(function (r, i) {
        var y = 44 + i * 28;
        svg.appendChild(T(s, 160, y, 11, 'start', r[0], 'fill:var(--text)'));
        svg.appendChild(T(s, 270, y, 12, 'middle', r[1], 'fill:var(--accent)', 700));
        svg.appendChild(T(s, 335, y, 12, 'middle', st.found ? r[2] : '·', 'fill:var(--brand)', 700));
      });
      svg.appendChild(T(s, 270, 184, 10, 'middle', d.eka, 'fill:var(--accent)'));
      svg.appendChild(T(s, 335, 184, 10, 'middle', st.found ? d.real.split(' ')[0] : '', 'fill:var(--brand)'));
      var m1 = +d.rowsOf[0][1], m2 = +d.rowsOf[0][2];
      out.innerHTML = '';
      out.appendChild(h('div', { html: st.found ?
        L("<b>" + d.eka + "</b> ৰ ভৱিষ্যদ্বাণী আৰু আৱিষ্কৃত <b>" + d.real + "</b> ৰ ধৰ্ম প্ৰায় মিলি গ'ল। ভাৰৰ পাৰ্থক্য মাত্ৰ " + Math.abs(m2 - m1).toFixed(1) + " একক।",
          "The predicted properties of <b>" + d.eka + "</b> match the later-discovered <b>" + d.real + "</b> closely. The mass differs by only " + Math.abs(m2 - m1).toFixed(1) + " u.") :
        L("মেণ্ডেলিভে এই খালী ঠাইৰ বাবে ধৰ্মবোৰ আগতেই লিখিছিল। 'Reveal discovery' টিপক আৰু মিলাওক।", "Mendeleev wrote down the properties for this gap in advance. Press 'Reveal discovery' to compare.") }));
    }
    paint();
  });

  /* ================================================================== 3. Moseley */
  A.register('moseley', function (root, k) {
    var h = k.h, s = k.s;
    var PAIRS = {
      'Ar-K': [['Ar', 18, 39.95], ['K', 19, 39.10]],
      'Co-Ni': [['Co', 27, 58.93], ['Ni', 28, 58.69]],
      'Te-I': [['Te', 52, 127.60], ['I', 53, 126.90]]
    };
    var R = 1.0974e7, C = 2.998e8;
    var st = { pair: 'Ar-K', by: 'Z', z: 29 };
    var svg = s('svg', { viewBox: '0 0 360 220', 'class': 'anim-svg', role: 'img', 'aria-label': L("মোজলিৰ ৰেখা: √ν বনাম Z", "Moseley plot: √ν against Z") });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sl = k.slider('Z', 11, 50, 1, st.z, function (v) { st.z = v; paint(); });
    var selP = k.select('Pair', opts(Object.keys(PAIRS).map(function (x) { return [x, x]; })), st.pair, function (v) { st.pair = v; paint(); });
    var selB = k.select('Order by', opts([['Z', 'atomic number'], ['M', 'atomic mass']]), st.by, function (v) { st.by = v; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(h('div', { 'class': 'row' }, [selP.el, selB.el]));
    root.appendChild(out);
    function sqrtNu(z) { return Math.sqrt(C * 0.75 * R * (z - 1) * (z - 1)); }   /* Kα: ν = (3/4) R c (Z−1)² */
    function paint() {
      svg.innerHTML = '';
      var X0 = 40, X1 = 340, Y0 = 190, Y1 = 20, zmin = 10, zmax = 52, ymax = 28;   /* √ν in 10⁸ Hz^½ */
      function px(z) { return X0 + (z - zmin) / (zmax - zmin) * (X1 - X0); }
      function py(v) { return Y0 - v / ymax * (Y0 - Y1); }
      svg.appendChild(s('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: 'var(--muted)' }));
      svg.appendChild(s('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: 'var(--muted)' }));
      [10, 20, 30, 40, 50].forEach(function (z) { svg.appendChild(T(s, px(z), Y0 + 14, 10, 'middle', String(z), 'fill:var(--muted)')); });
      [0, 10, 20].forEach(function (v) { svg.appendChild(T(s, X0 - 5, py(v) + 3, 10, 'end', String(v), 'fill:var(--muted)')); });
      svg.appendChild(T(s, (X0 + X1) / 2, 214, 11, 'middle', L("পৰমাণু ক্ৰমাংক Z", 'atomic number Z'), 'fill:var(--muted)'));
      svg.appendChild(T(s, 6, 14, 10, 'start', '√ν (10⁸ Hz½)', 'fill:var(--muted)'));
      svg.appendChild(s('line', { x1: px(zmin), y1: py(sqrtNu(zmin) / 1e8), x2: px(zmax), y2: py(sqrtNu(zmax) / 1e8), stroke: 'var(--brand)', 'stroke-width': 2 }));
      svg.appendChild(s('circle', { cx: px(st.z), cy: py(sqrtNu(st.z) / 1e8), r: 5, fill: 'var(--accent)' }));
      var lam = 4 / (3 * R * (st.z - 1) * (st.z - 1));
      var nu = C / lam;
      var pr = PAIRS[st.pair], a = pr[0], b = pr[1];
      var first = st.by === 'Z' ? a : (a[2] > b[2] ? b : a), second = first === a ? b : a;
      var ok = st.by === 'Z';
      out.innerHTML = '';
      out.appendChild(h('div', { html: L("Z = <b>" + st.z + "</b> (" + E[st.z].sym + ") ৰ K<sub>α</sub> X-ৰশ্মি: λ = <b>" + (lam * 1e9).toFixed(4) + " nm</b>, ν = <b>" + (nu / 1e18).toFixed(3) + " × 10¹⁸ Hz</b>, √ν = <b>" + (Math.sqrt(nu) / 1e8).toFixed(3) + " × 10⁸ Hz½</b>। √ν আৰু Z ৰ লেখ সৰলৰেখা।",
        "K<sub>α</sub> X-ray of Z = <b>" + st.z + "</b> (" + E[st.z].sym + "): λ = <b>" + (lam * 1e9).toFixed(4) + " nm</b>, ν = <b>" + (nu / 1e18).toFixed(3) + " × 10¹⁸ Hz</b>, √ν = <b>" + (Math.sqrt(nu) / 1e8).toFixed(3) + " × 10⁸ Hz½</b>. The plot of √ν against Z is a straight line.") }));
      var ordAs = (st.by === 'Z') ? "পৰমাণু ক্ৰমাংকৰ ক্ৰমত " : "পাৰমাণৱিক ভাৰৰ ক্ৰমত ";
      var ordEn = (st.by === 'Z') ? "By atomic number " : "By atomic mass ";
      var vAs = (st.by === 'Z') ? first[0] + " (" + first[1] + ") → " + second[0] + " (" + second[1] + ")" : first[0] + " (" + first[2] + ") → " + second[0] + " (" + second[2] + ")";
      out.appendChild(h('div', { style: 'margin-top:8px', html: L(
        "<b>" + st.pair + "</b>: " + ordAs + vAs + "। " + (ok ? "মৌলৰ ধৰ্মৰ লগত এই ক্ৰমেই খাপ খায়। (ভাৰৰ ক্ৰমত সজালে যোৰ সলনি হ'ব; সেয়া ভুল।)" : "এই ক্ৰমত মৌল দুটা ভুল বৰ্গত পৰে; ধৰ্ম নিমিলে।"),
        "<b>" + st.pair + "</b>: " + ordEn + "the order is " + vAs + ". " + (ok ? "This order fits the chemical properties. (Ordering by mass would swap the pair, which is wrong.)" : "This puts the pair in the wrong groups, so the properties do not fit.")) }));
    }
    paint();
  });

  /* ================================================================== 4. IUPAC name builder */
  A.register('iupac-name', function (root, k) {
    var h = k.h;
    var ROOT = ['nil', 'un', 'bi', 'tri', 'quad', 'pent', 'hex', 'sept', 'oct', 'enn'];
    var LET = ['n', 'u', 'b', 't', 'q', 'p', 'h', 's', 'o', 'e'];
    var OFFICIAL = { 101: 'Mendelevium (Md)', 102: 'Nobelium (No)', 103: 'Lawrencium (Lr)', 104: 'Rutherfordium (Rf)', 105: 'Dubnium (Db)', 106: 'Seaborgium (Sg)',
      107: 'Bohrium (Bh)', 108: 'Hassium (Hs)', 109: 'Meitnerium (Mt)', 110: 'Darmstadtium (Ds)', 111: 'Roentgenium (Rg)', 112: 'Copernicium (Cn)',
      113: 'Nihonium (Nh)', 114: 'Flerovium (Fl)', 115: 'Moscovium (Mc)', 116: 'Livermorium (Lv)', 117: 'Tennessine (Ts)', 118: 'Oganesson (Og)' };
    var st = { z: 120 };
    var box = h('div', { 'class': 'iupac-box', style: 'text-align:center;padding:14px;border-radius:12px;background:var(--canvas);border:1px solid var(--border)' });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var d = [1, 2, 0];
    function mk(i, label, lo) {
      var o = []; for (var v = lo; v <= 9; v++) o.push([v, String(v)]);
      return k.select(label, opts(o), d[i], function (v) { d[i] = +v; paint(); });
    }
    var s1 = mk(0, 'Hundreds', 1), s2 = mk(1, 'Tens', 0), s3 = mk(2, 'Ones', 0);
    var b1 = k.button('Z = 119', function () { setZ(119); }), b2 = k.button('Z = 104', function () { setZ(104); }), b3 = k.button('Z = 999', function () { setZ(999); });
    function setZ(z) { d = [Math.floor(z / 100), Math.floor(z / 10) % 10, z % 10]; s1.select.value = d[0]; s2.select.value = d[1]; s3.select.value = d[2]; paint(); }
    root.appendChild(box);
    root.appendChild(h('div', { 'class': 'row' }, [s1.el, s2.el, s3.el]));
    root.appendChild(h('div', { 'class': 'row' }, [b1, b2, b3]));
    root.appendChild(out);
    function paint() {
      var z = d[0] * 100 + d[1] * 10 + d[2];
      var roots = d.map(function (x) { return ROOT[x]; });
      var name = roots.join('');
      name = name.charAt(0).toUpperCase() + name.slice(1);
      name += name.charAt(name.length - 1) === 'i' ? 'um' : 'ium';
      var sym = LET[d[0]].toUpperCase() + LET[d[1]] + LET[d[2]];
      box.innerHTML = '';
      box.appendChild(h('div', { style: 'font-size:1.9rem;font-weight:700;color:var(--brand)', text: name }));
      box.appendChild(h('div', { style: 'font-size:1.2rem', text: 'Z = ' + z + '   ·   ' + sym }));
      out.innerHTML = '';
      out.appendChild(h('div', { html: L("অংক " + d.join(', ') + " → <b>" + roots.join(' + ') + "</b> + ium = <b>" + name + "</b>; চিহ্ন = আদ্য আখৰবোৰ = <b>" + sym + "</b>।",
        "Digits " + d.join(', ') + " → <b>" + roots.join(' + ') + "</b> + ium = <b>" + name + "</b>; symbol = the first letters = <b>" + sym + "</b>.") }));
      if (OFFICIAL[z]) out.appendChild(h('div', { html: L("এই মৌলৰ আনুষ্ঠানিক IUPAC নাম এতিয়া: <b>" + OFFICIAL[z] + "</b>।", "The official IUPAC name of this element today: <b>" + OFFICIAL[z] + "</b>.") }));
      else if (z > 118) out.appendChild(h('div', { text: L("এই পৰমাণু ক্ৰমাংকৰ মৌল এতিয়ালৈকে আৱিষ্কাৰ হোৱা নাই; সেয়ে এই অস্থায়ী নামেই ব্যৱহাৰ কৰা হয়।", "No element with this atomic number has been made yet, so this temporary name is the one used.") }));
    }
    paint();
  });

  /* ================================================================== 5. interactive periodic table */
  A.register('periodic-table', function (root, k) {
    var h = k.h, s = k.s;
    var st = { z: 26, mode: 'block' };
    var W = 650, CELL = 34;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' 372', 'class': 'anim-svg', role: 'group', 'aria-label': L("পৰ্যাবৃত্ত তালিকা: ১১৮টা মৌল", 'Periodic table of 118 elements') });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sl = k.slider('Z', 1, 118, 1, st.z, function (v) { st.z = v; paint(); });
    var selM = k.select('Colour by', opts([['block', 'Block (s, p, d, f)'], ['kind', 'Metal / non-metal'], ['group', 'Selected group'], ['period', 'Selected period']]), st.mode, function (v) { st.mode = v; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [sl.el, selM.el]));
    root.appendChild(out);
    var cells = [];
    function X(col) { return 24 + (col - 1) * CELL; }
    function Y(row) { return 26 + (row - 1) * CELL; }
    for (var g = 1; g <= 18; g++) svg.appendChild(T(s, X(g) + CELL / 2 - 1, 17, 10, 'middle', String(g), 'fill:var(--muted)'));
    for (var p = 1; p <= 7; p++) svg.appendChild(T(s, 12, Y(p) + CELL / 2 + 3, 10, 'middle', String(p), 'fill:var(--muted)'));
    svg.appendChild(T(s, 12, Y(8.4) + CELL / 2 + 3, 9, 'middle', '6', 'fill:var(--muted)'));
    svg.appendChild(T(s, 12, Y(9.4) + CELL / 2 + 3, 9, 'middle', '7', 'fill:var(--muted)'));
    for (var z = 1; z <= 118; z++) (function (z) {
      var ps = pos(z);
      var g = s('g', { tabindex: 0, role: 'button', 'aria-label': 'Z ' + z + ' ' + E[z].sym + ' ' + E[z].en, style: 'cursor:pointer' });
      var r = s('rect', { x: X(ps.col), y: Y(ps.row), width: CELL - 2, height: CELL - 2, rx: 4 });
      g.appendChild(r);
      g.appendChild(T(s, X(ps.col) + 3, Y(ps.row) + 9, 7, 'start', String(z), 'fill:var(--muted)'));
      g.appendChild(T(s, X(ps.col) + (CELL - 2) / 2, Y(ps.row) + 24, 13, 'middle', E[z].sym, 'fill:var(--text)', 700));
      g.addEventListener('click', function () { st.z = z; sl.input.value = z; sl.out.textContent = z; paint(); });
      g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); st.z = z; sl.input.value = z; sl.out.textContent = z; paint(); } });
      svg.appendChild(g);
      cells[z] = { g: g, r: r, ps: ps };
    })(z);
    var info = s('g'); svg.appendChild(info);
    svg.appendChild(T(s, X(3), Y(9.4) + CELL + 14, 9, 'start', L("লেন্থেনইড (58–71) আৰু এক্টিনইড (90–103): f-গোষ্ঠী", 'Lanthanoids (58–71) and actinoids (90–103): the f-block'), 'fill:var(--muted)'));
    function paint() {
      var sel = pos(st.z);
      for (var z = 1; z <= 118; z++) {
        var c = cells[z], ps = c.ps, col, op = 0.3, sw = 1;
        if (st.mode === 'block') col = BLK_COL[ps.blk];
        else if (st.mode === 'kind') col = KIND_COL[kind(z)];
        else if (st.mode === 'group') { var on = ps.g === sel.g && sel.g !== 0; col = on ? '#e8590c' : '#868e96'; op = on ? 0.6 : 0.1; }
        else { var onp = (ps.p === sel.p); col = onp ? '#e8590c' : '#868e96'; op = onp ? 0.6 : 0.1; }
        c.r.setAttribute('fill', col); c.r.setAttribute('fill-opacity', op);
        c.r.setAttribute('stroke', z === st.z ? 'var(--text)' : col);
        c.r.setAttribute('stroke-width', z === st.z ? 3 : sw);
      }
      var e = E[st.z], c = cfg(st.z), conf = cfgShort(st.z);
      info.innerHTML = '';
      info.appendChild(T(s, X(3) + 4, Y(1) + 30, 34, 'start', e.sym, 'fill:var(--brand)', 700));
      info.appendChild(T(s, X(3) + 64, Y(1) + 14, 13, 'start', 'Z = ' + st.z, 'fill:var(--text)', 600));
      info.appendChild(T(s, X(3) + 64, Y(1) + 32, 13, 'start', eName(st.z), 'fill:var(--text)'));
      info.appendChild(T(s, X(3) + 4, Y(1) + 56, 12, 'start', conf, 'fill:var(--text)'));
      var leg = [['s', 's'], ['p', 'p'], ['d', 'd'], ['f', 'f']];
      if (st.mode === 'block') leg.forEach(function (l, i) { info.appendChild(s('rect', { x: X(3) + 4 + i * 60, y: Y(3) + 14, width: 12, height: 12, fill: BLK_COL[l[0]], 'fill-opacity': 0.6 })); info.appendChild(T(s, X(3) + 20 + i * 60, Y(3) + 24, 11, 'start', l[1] + '-' + L("গোষ্ঠী", 'block'), 'fill:var(--text)')); });
      if (st.mode === 'kind') [['metal', L("ধাতু", 'metal')], ['nonmetal', L("অধাতু", 'non-metal')], ['metalloid', L("ধাতুকল্প", 'metalloid')], ['unknown', L("অজ্ঞাত", 'unknown')]].forEach(function (l, i) { info.appendChild(s('rect', { x: X(3) + 4 + i * 80, y: Y(3) + 14, width: 12, height: 12, fill: KIND_COL[l[0]], 'fill-opacity': 0.6 })); info.appendChild(T(s, X(3) + 20 + i * 80, Y(3) + 24, 11, 'start', l[1], 'fill:var(--text)')); });
      var ve;
      if (sel.blk === 's' || sel.blk === 'p') { var n = sel.p; var cnt = (c[n + 's'] || 0) + (c[n + 'p'] || 0); ve = String(cnt); }
      else ve = L("(n−1)d + ns ইলেক্ট্ৰন সমূহ", "(n−1)d + ns electrons");
      var kd = { metal: L("ধাতু", 'metal'), nonmetal: L("অধাতু", 'non-metal'), metalloid: L("ধাতুকল্প", 'metalloid'), unknown: L("ধৰ্ম অজ্ঞাত (কৃত্ৰিম)", 'properties not well known (synthetic)') }[kind(st.z)];
      out.innerHTML = '';
      out.appendChild(h('div', { html: L(
        "<b>" + e.sym + "</b> — " + eName(st.z) + ", Z = <b>" + st.z + "</b>। ইলেক্ট্ৰনীয় বিন্যাস: <b>" + conf + "</b>। পৰ্যায় <b>" + sel.p + "</b>, " + (sel.g ? "বৰ্গ <b>" + sel.g + "</b>" : "বৰ্গ নাই (অন্তঃসংক্ৰমণশীল)") + ", <b>" + sel.blk + "</b>-গোষ্ঠী; " + kd + "। বহিঃস্তৰৰ ইলেক্ট্ৰন: " + ve + "।",
        "<b>" + e.sym + "</b> — " + eName(st.z) + ", Z = <b>" + st.z + "</b>. Configuration: <b>" + conf + "</b>. Period <b>" + sel.p + "</b>, " + (sel.g ? "group <b>" + sel.g + "</b>" : "no group number (inner transition)") + ", <b>" + sel.blk + "</b>-block; " + kd + ". Outer-shell electrons: " + ve + ".") }));
    }
    paint();
  });

  /* ================================================================== 6. configuration -> position */
  A.register('config-position', function (root, k) {
    var h = k.h, s = k.s;
    var st = { z: 17 };
    var svg = s('svg', { viewBox: '0 0 360 236', 'class': 'anim-svg', role: 'img', 'aria-label': L("উপস্তৰ পূৰণ আৰু পৰ্যায় ক্ষমতা", 'Sub-shell filling and period capacity') });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sl = k.slider('Z', 1, 118, 1, st.z, function (v) { st.z = v; paint(); });
    var prev = k.button('−1', function () { if (st.z > 1) { st.z--; sl.input.value = st.z; sl.out.textContent = st.z; paint(); } });
    var next = k.button('+1', function () { if (st.z < 118) { st.z++; sl.input.value = st.z; sl.out.textContent = st.z; paint(); } });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [sl.el, prev, next]));
    root.appendChild(out);
    var PERIODS = [[2, ['1s']], [8, ['2s', '2p']], [8, ['3s', '3p']], [18, ['4s', '3d', '4p']], [18, ['5s', '4d', '5p']], [32, ['6s', '4f', '5d', '6p']], [32, ['7s', '5f', '6d', '7p']]];
    function paint() {
      svg.innerHTML = '';
      var z = st.z, c = cfg(z), ps = pos(z);
      var y = 8;
      PERIODS.forEach(function (pp, i) {
        var cur = (i + 1) === ps.p;
        svg.appendChild(T(s, 6, y + 20, 11, 'start', String(i + 1), cur ? 'fill:var(--accent)' : 'fill:var(--muted)', 700));
        var x = 22;
        pp[1].forEach(function (o) {
          var cap = CAP[o.charAt(1)], w = cap * 3.6 + 14, have = c[o];
          svg.appendChild(s('rect', { x: x, y: y, width: w, height: 26, rx: 4, fill: 'var(--surface-2)', stroke: cur ? 'var(--accent)' : 'var(--border)' }));
          svg.appendChild(s('rect', { x: x, y: y, width: Math.max(0, have / cap * w), height: 26, rx: 4, fill: BLK_COL[o.charAt(1)], 'fill-opacity': 0.55 }));
          svg.appendChild(T(s, x + w / 2, y + 17, 10, 'middle', o + (have ? sup(have) : ''), 'fill:var(--text)', 600));
          x += w + 3;
        });
        svg.appendChild(T(s, 352, y + 17, 11, 'end', pp[0] + ' ' + L("মৌল", 'elements'), 'fill:var(--muted)'));
        y += 32;
      });
      var outer = ps.p, ns = c[outer + 's'] || 0, np = c[outer + 'p'] || 0, nd = c[(outer - 1) + 'd'] || 0;
      var rule;
      if (z === 2) rule = L("He ৰ বিন্যাস 1s²; পূৰ্ণ খোলা হোৱাৰ বাবে বৰ্গ 18 ত ৰখা হয়।", "He is 1s²; with its full shell it is placed in group 18.");
      else if (ps.g === 0) rule = L("f-উপস্তৰ পূৰণ হৈছে: অন্তঃসংক্ৰমণশীল মৌল (বৰ্গ নাই)।", "The f sub-shell is filling: an inner-transition element (no group number).");
      else if (ps.blk === 's') rule = L("s-গোষ্ঠী: বৰ্গ = ns ইলেক্ট্ৰনৰ সংখ্যা = " + ns, "s-block: group = number of ns electrons = " + ns);
      else if (ps.blk === 'p') rule = L("p-গোষ্ঠী: বৰ্গ = 10 + ns + np = 10 + " + ns + " + " + np + " = " + (10 + ns + np), "p-block: group = 10 + ns + np = 10 + " + ns + " + " + np + " = " + (10 + ns + np));
      else rule = L("d-গোষ্ঠী: বৰ্গ = (n−1)d + ns = " + nd + " + " + ns + " = " + (nd + ns), "d-block: group = (n−1)d + ns = " + nd + " + " + ns + " = " + (nd + ns));
      out.innerHTML = '';
      out.appendChild(h('div', { html: L("<b>" + E[z].sym + "</b> (Z = " + z + "): " + cfgFull(z) + "<br>সৰ্বোচ্চ মুখ্য কোৱান্টাম সংখ্যা n = " + outer + " ⇒ পৰ্যায় <b>" + ps.p + "</b>। " + rule + "।",
        "<b>" + E[z].sym + "</b> (Z = " + z + "): " + cfgFull(z) + "<br>Highest principal quantum number n = " + outer + " ⇒ period <b>" + ps.p + "</b>. " + rule + ".") }));
      if (z === 71 || z === 103) out.appendChild(h('div', { text: L("টোকা: এই পুস্তকত " + E[z].sym + " ক f-গোষ্ঠীৰ শেষ মৌল হিচাপে লোৱা হৈছে (14 টা মৌল)।", "Note: the book counts " + E[z].sym + " as the last of the 14 f-block elements.") }));
    }
    paint();
  });

  /* ================================================================== 7. trends explorer */
  A.register('trends', function (root, k) {
    var h = k.h, s = k.s;
    var DATA = {
      radius: { unit: 'pm', series: {
        p2: [['Li', 152], ['Be', 111], ['B', 88], ['C', 77], ['N', 74], ['O', 66], ['F', 64]],
        p3: [['Na', 186], ['Mg', 160], ['Al', 143], ['Si', 117], ['P', 110], ['S', 104], ['Cl', 99]],
        g1: [['Li', 152], ['Na', 186], ['K', 231], ['Rb', 244], ['Cs', 262]],
        g17: [['F', 64], ['Cl', 99], ['Br', 114], ['I', 133], ['At', 140]] } },
      ie: { unit: 'kJ mol⁻¹', series: {
        p2: [['Li', 520], ['Be', 899], ['B', 801], ['C', 1086], ['N', 1402], ['O', 1314], ['F', 1681], ['Ne', 2080]],
        p3: [['Na', 496], ['Mg', 737], ['Al', 577], ['Si', 786], ['P', 1012], ['S', 1000], ['Cl', 1251], ['Ar', 1521]],
        g1: [['Li', 520], ['Na', 496], ['K', 419], ['Rb', 403], ['Cs', 374]] } },
      ega: { unit: 'kJ mol⁻¹', series: {
        g1: [['H', -73], ['Li', -60], ['Na', -53], ['K', -48], ['Rb', -47], ['Cs', -46]],
        g16: [['O', -141], ['S', -200], ['Se', -195], ['Te', -190], ['Po', -174]],
        g17: [['F', -328], ['Cl', -349], ['Br', -325], ['I', -295], ['At', -270]],
        g18: [['He', 48], ['Ne', 116], ['Ar', 96], ['Kr', 96], ['Xe', 77], ['Rn', 68]] } },
      en: { unit: '', series: {
        p2: [['Li', 1.0], ['Be', 1.5], ['B', 2.0], ['C', 2.5], ['N', 3.0], ['O', 3.5], ['F', 4.0]],
        p3: [['Na', 0.9], ['Mg', 1.2], ['Al', 1.5], ['Si', 1.8], ['P', 2.1], ['S', 2.5], ['Cl', 3.0]],
        g1: [['Li', 1.0], ['Na', 0.9], ['K', 0.8], ['Rb', 0.8], ['Cs', 0.7]],
        g17: [['F', 4.0], ['Cl', 3.0], ['Br', 2.8], ['I', 2.5], ['At', 2.2]] } }
    };
    var PN = { radius: L("পাৰমাণৱিক ব্যাসাৰ্ধ", 'Atomic radius'), ie: L("প্ৰথম আয়নীকৰণ এনথালপি", 'First ionisation enthalpy'), ega: L("ইলেক্ট্ৰন গ্ৰহণ এনথালপি (Δ_egH)", 'Electron gain enthalpy (Δ_egH)'), en: L("বিদ্যুৎঋণাত্মকতা (পাউলিং)", 'Electronegativity (Pauling)') };
    var SN = { p2: L("পৰ্যায় 2 (Li → F)", 'Period 2 (Li → F/Ne)'), p3: L("পৰ্যায় 3 (Na → Cl/Ar)", 'Period 3 (Na → Cl/Ar)'), g1: L("বৰ্গ 1 (ওপৰৰ পৰা তললৈ)", 'Group 1 (top → bottom)'), g16: L("বৰ্গ 16", 'Group 16'), g17: L("বৰ্গ 17 (ওপৰৰ পৰা তললৈ)", 'Group 17 (top → bottom)'), g18: L("বৰ্গ 18", 'Group 18') };
    var st = { prop: 'radius', ser: 'p2', i: 0 };
    var svg = s('svg', { viewBox: '0 0 360 230', 'class': 'anim-svg', role: 'img', 'aria-label': L("মৌলৰ ধৰ্মৰ পৰ্যায়গত প্ৰৱণতা", 'Periodic trend of an element property') });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var selP = k.select('Property', opts(Object.keys(PN).map(function (x) { return [x, PN[x]]; })), st.prop, function (v) { st.prop = v; fixSeries(); paint(); });
    var selS = k.select('Series', [], st.ser, function (v) { st.ser = v; st.i = 0; paint(); });
    var sl = k.slider('Element no.', 1, 8, 1, 1, function (v) { st.i = v - 1; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [selP.el, selS.el]));
    root.appendChild(h('div', { 'class': 'row' }, [sl.el]));
    root.appendChild(out);
    function fixSeries() {
      var keys = Object.keys(DATA[st.prop].series);
      if (keys.indexOf(st.ser) < 0) st.ser = keys[0];
      selS.select.innerHTML = '';
      keys.forEach(function (key) { var o = h('option', { value: key, text: SN[key] }); if (key === st.ser) o.selected = true; selS.select.appendChild(o); });
      st.i = 0;
    }
    function paint() {
      var d = DATA[st.prop], arr = d.series[st.ser];
      if (st.i >= arr.length) st.i = arr.length - 1;
      sl.input.max = arr.length; sl.input.value = st.i + 1; sl.out.textContent = st.i + 1;
      svg.innerHTML = '';
      var vals = arr.map(function (a) { return a[1]; });
      var vmax = Math.max(0, Math.max.apply(null, vals)), vmin = Math.min(0, Math.min.apply(null, vals));
      var top = 24, bot = 192, base = bot - (0 - vmin) / (vmax - vmin) * (bot - top);
      function yv(v) { return bot - (v - vmin) / (vmax - vmin) * (bot - top); }
      var bw = Math.min(34, 300 / arr.length - 6), gap = (310 - arr.length * bw) / (arr.length + 1);
      svg.appendChild(s('line', { x1: 24, y1: base, x2: 350, y2: base, stroke: 'var(--muted)' }));
      arr.forEach(function (a, i) {
        var x = 30 + gap + i * (bw + gap), y = yv(a[1]), sel = i === st.i;
        svg.appendChild(s('rect', { x: x, y: Math.min(y, base), width: bw, height: Math.max(1, Math.abs(base - y)), rx: 3, fill: sel ? 'var(--accent)' : 'var(--brand)', 'fill-opacity': sel ? 0.95 : 0.55 }));
        svg.appendChild(T(s, x + bw / 2, a[1] >= 0 ? y - 4 : y + 11, 10, 'middle', String(a[1]), 'fill:var(--text)', sel ? 700 : 400));
        svg.appendChild(T(s, x + bw / 2, bot + 18, 12, 'middle', a[0], 'fill:var(--text)', 700));
      });
      svg.appendChild(T(s, 6, 14, 11, 'start', PN[st.prop] + (d.unit ? ' (' + d.unit + ')' : ''), 'fill:var(--muted)'));
      var cur = arr[st.i];
      var isP = st.ser.charAt(0) === 'p';
      var note = '';
      /* direction of the general trend and the exceptions */
      var up = vals[vals.length - 1] > vals[0];
      var exc = [];
      for (var i = 1; i < vals.length; i++) if ((up && vals[i] < vals[i - 1]) || (!up && vals[i] > vals[i - 1])) exc.push(arr[i][0] + ' (' + vals[i] + ') ' + (up ? '<' : '>') + ' ' + arr[i - 1][0] + ' (' + vals[i - 1] + ')');
      var dir = up ? L("বাঢ়ে", 'increases') : L("কমে", 'decreases');
      var where = isP ? L("বাওঁফালৰ পৰা সোঁফাললৈ (পৰ্যায়ত)", 'from left to right across the period') : L("ওপৰৰ পৰা তললৈ (বৰ্গত)", 'down the group');
      var why = '';
      if (st.prop === 'radius') why = isP ? L("খোলা একেই, কিন্তু নিউক্লীয় আধান বাঢ়ে; ইলেক্ট্ৰন ভিতৰলৈ টানি লয়।", "The shell number stays the same but the nuclear charge rises, pulling the electrons in.") : L("প্ৰতি ধাপত নতুন এটা খোলা যোগ হয়।", "Every step down adds one more shell.");
      if (st.prop === 'ie') why = isP ? L("নিউক্লীয় আধান বাঢ়ে আৰু ব্যাসাৰ্ধ কমে; ইলেক্ট্ৰন আতৰোৱা কঠিন হয়। ব্যতিক্ৰম: s→p আৰু p³→p⁴ ত।", "Nuclear charge rises and size falls, so removing an electron gets harder. Exceptions come at s→p and p³→p⁴.") : L("আকাৰ আৰু আৱৰণ প্ৰভাৱ বাঢ়ে; বাহিৰৰ ইলেক্ট্ৰন সহজে ওলায়।", "Size and shielding grow, so the outer electron leaves more easily.");
      if (st.prop === 'ega') why = st.ser === 'g18' ? L("পূৰ্ণ খোলা: ইলেক্ট্ৰন যোগ কৰিবলৈ শক্তি লাগে (ধনাত্মক)।", "Full shells: energy must be supplied to add an electron (positive).") : L("সাধাৰণতে বৰ্গত তললৈ কম ঋণাত্মক; কিন্তু O→S আৰু F→Cl ত ব্যতিক্ৰম (দ্বিতীয় পৰ্যায়ৰ সৰু আকাৰত ইলেক্ট্ৰন বিকৰ্ষণ বেছি)।", "Usually less negative down a group; but O→S and F→Cl are exceptions (electron–electron repulsion in the small second-period atom).");
      if (st.prop === 'en') why = isP ? L("পৰমাণু সৰু আৰু নিউক্লীয় আধান বেছি হ'লে ভাগ-বতৰা ইলেক্ট্ৰনক বেছি টানে।", "A smaller atom with a larger nuclear charge pulls shared electrons harder.") : L("আকাৰ বাঢ়িলে টান কমে।", "As the atom grows, the pull weakens.");
      out.innerHTML = '';
      out.appendChild(h('div', { html: L("<b>" + cur[0] + "</b> ত " + PN[st.prop] + " = <b>" + cur[1] + (d.unit ? ' ' + d.unit : '') + "</b>। সামগ্ৰিকভাৱে " + where + " মান <b>" + dir + "</b>। ",
        "<b>" + cur[0] + "</b>: " + PN[st.prop] + " = <b>" + cur[1] + (d.unit ? ' ' + d.unit : '') + "</b>. Overall, the value <b>" + dir + "</b> " + where + ". ") + why }));
      if (exc.length) out.appendChild(h('div', { html: L("ব্যতিক্ৰম: ", 'Exceptions: ') + exc.join('; ') }));
      if (st.prop === 'radius') out.appendChild(h('div', { text: L("তালিকা 3.6 ৰ মান; দ্বিতীয় আৰু তৃতীয় পৰ্যায়ৰ শেষত অসংযোজী নিষ্ক্ৰিয় গেছ নধৰি সহযোজী ব্যাসাৰ্ধ।", "Table 3.6 values: covalent radii; the noble gas at the end of each period is left out.") }));
    }
    fixSeries(); paint();
  });

  /* ================================================================== 8. isoelectronic ions / ion vs atom */
  A.register('isoelectronic', function (root, k) {
    var h = k.h, s = k.s;
    var SETS = {
      e10: { n: 10, ions: [['N³⁻', 7, 146], ['O²⁻', 8, 140], ['F⁻', 9, 136], ['Na⁺', 11, 102], ['Mg²⁺', 12, 72], ['Al³⁺', 13, 54]] },
      e18: { n: 18, ions: [['S²⁻', 16, 184], ['Cl⁻', 17, 181], ['K⁺', 19, 138], ['Ca²⁺', 20, 100]] }
    };
    var PAIR = [['Li', 152, 'Li⁺', 76], ['Na', 186, 'Na⁺', 102], ['Be', 111, 'Be²⁺', 31], ['Mg', 160, 'Mg²⁺', 72], ['F', 64, 'F⁻', 136], ['Cl', 99, 'Cl⁻', 181]];
    var st = { mode: 'e10', i: 0 };
    var svg = s('svg', { viewBox: '0 0 360 200', 'class': 'anim-svg', role: 'img', 'aria-label': L("আয়নীয় ব্যাসাৰ্ধৰ তুলনা", 'Comparison of ionic radii') });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var selM = k.select('Compare', opts([['e10', 'Isoelectronic: 10 electrons'], ['e18', 'Isoelectronic: 18 electrons'], ['pair', 'Atom vs its ion']]), st.mode, function (v) { st.mode = v; st.i = 0; fix(); paint(); });
    var sl = k.slider('Pick', 1, 6, 1, 1, function (v) { st.i = v - 1; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [selM.el, sl.el]));
    root.appendChild(out);
    function fix() { var n = st.mode === 'pair' ? PAIR.length : SETS[st.mode].ions.length; sl.input.max = n; sl.input.value = st.i + 1; sl.out.textContent = st.i + 1; }
    var SC = 0.3;   /* px per pm */
    function paint() {
      svg.innerHTML = '';
      out.innerHTML = '';
      if (st.mode === 'pair') {
        var p = PAIR[st.i], cx1 = 100, cx2 = 260, cy = 100;
        svg.appendChild(s('circle', { cx: cx1, cy: cy, r: p[1] * SC, fill: 'var(--brand)', 'fill-opacity': 0.25, stroke: 'var(--brand)' }));
        svg.appendChild(s('circle', { cx: cx2, cy: cy, r: p[3] * SC, fill: 'var(--accent)', 'fill-opacity': 0.25, stroke: 'var(--accent)' }));
        svg.appendChild(T(s, cx1, cy + 4, 14, 'middle', p[0], 'fill:var(--text)', 700));
        svg.appendChild(T(s, cx2, cy + 4, 14, 'middle', p[2], 'fill:var(--text)', 700));
        svg.appendChild(T(s, cx1, 190, 12, 'middle', p[1] + ' pm', 'fill:var(--muted)'));
        svg.appendChild(T(s, cx2, 190, 12, 'middle', p[3] + ' pm', 'fill:var(--muted)'));
        var cat = p[3] < p[1];
        out.appendChild(h('div', { html: L(
          "<b>" + p[0] + "</b> (" + p[1] + " pm) → <b>" + p[2] + "</b> (" + p[3] + " pm)। " + (cat ? "ক্যাটায়ন মূল পৰমাণুতকৈ সৰু: ইলেক্ট্ৰন কম, কিন্তু নিউক্লীয় আধান একেই; আনকি খোলাও এটা কমে।" : "এনায়ন মূল পৰমাণুতকৈ ডাঙৰ: ইলেক্ট্ৰন বাঢ়ে, আধান একেই; ইলেক্ট্ৰনৰ মাজৰ বিকৰ্ষণ বাঢ়ে।"),
          "<b>" + p[0] + "</b> (" + p[1] + " pm) → <b>" + p[2] + "</b> (" + p[3] + " pm). " + (cat ? "A cation is smaller than its atom: fewer electrons for the same nuclear charge (and often one shell fewer)." : "An anion is larger than its atom: more electrons share the same nuclear charge, so repulsion grows.")) }));
        return;
      }
      var set = SETS[st.mode], n = set.ions.length, step = 340 / n;
      set.ions.forEach(function (ion, i) {
        var cx = 20 + step * (i + 0.5), sel = i === st.i;
        svg.appendChild(s('circle', { cx: cx, cy: 90, r: ion[2] * SC * (n > 4 ? 0.8 : 1), fill: sel ? 'var(--accent)' : 'var(--brand)', 'fill-opacity': sel ? 0.4 : 0.2, stroke: sel ? 'var(--accent)' : 'var(--brand)', 'stroke-width': sel ? 3 : 1 }));
        svg.appendChild(T(s, cx, 94, 13, 'middle', ion[0], 'fill:var(--text)', 700));
        svg.appendChild(T(s, cx, 170, 11, 'middle', 'Z = ' + ion[1], 'fill:var(--muted)'));
        svg.appendChild(T(s, cx, 186, 11, 'middle', ion[2] + ' pm', 'fill:var(--text)'));
      });
      var cur = set.ions[Math.min(st.i, n - 1)];
      out.appendChild(h('div', { html: L(
        "প্ৰতিটো আয়নতে <b>" + set.n + "</b> টা ইলেক্ট্ৰন আছে। <b>" + cur[0] + "</b>: নিউক্লীয় আধান +" + cur[1] + ", ব্যাসাৰ্ধ ≈ <b>" + cur[2] + " pm</b>। নিউক্লীয় আধান যিমানে বেছি, ইলেক্ট্ৰনবোৰ সিমানে ভিতৰলৈ টানি আনে; গতিকে ব্যাসাৰ্ধ কমে।",
        "Every ion here has <b>" + set.n + "</b> electrons. <b>" + cur[0] + "</b>: nuclear charge +" + cur[1] + ", radius ≈ <b>" + cur[2] + " pm</b>. The larger the nuclear charge, the harder the same electrons are pulled in, so the radius falls.") }));
      out.appendChild(h('div', { text: L("মান আনুমানিক (উৎস অনুসৰি অলপ বেলেগ হ'ব পাৰে)।", "Values are approximate and differ slightly between sources.") }));
    }
    fix(); paint();
  });

  /* ================================================================== 9. successive ionisation enthalpies */
  A.register('successive-ie', function (root, k) {
    var h = k.h, s = k.s;
    var D = { Li: [520, 7300], Na: [496, 4562], Mg: [738, 1451, 7733], Al: [577, 1817, 2745, 11577], Si: [786, 1577, 3232, 4356, 16091] };
    var G = { Li: 1, Na: 1, Mg: 2, Al: 13, Si: 14 };
    var st = { el: 'Mg' };
    var svg = s('svg', { viewBox: '0 0 360 220', 'class': 'anim-svg', role: 'img', 'aria-label': L("ক্ৰমিক আয়নীকৰণ এনথালপি", 'Successive ionisation enthalpies') });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sel = k.select('Element', opts(Object.keys(D).map(function (x) { return [x, x]; })), st.el, function (v) { st.el = v; paint(); });
    root.appendChild(svg);
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(out);
    function paint() {
      svg.innerHTML = '';
      var d = D[st.el], max = Math.max.apply(null, d), n = d.length, bw = 40, gap = (320 - n * bw) / (n + 1);
      svg.appendChild(s('line', { x1: 20, y1: 180, x2: 350, y2: 180, stroke: 'var(--muted)' }));
      var jump = 0, best = 0;
      d.forEach(function (v, i) {
        var x = 20 + gap + i * (bw + gap), hgt = v / max * 140;
        if (i > 0 && v / d[i - 1] > best) { best = v / d[i - 1]; jump = i; }
        svg.appendChild(s('rect', { x: x, y: 180 - hgt, width: bw, height: hgt, rx: 3, fill: 'var(--brand)', 'fill-opacity': 0.6 }));
        svg.appendChild(T(s, x + bw / 2, 176 - hgt, 11, 'middle', String(v), 'fill:var(--text)', 600));
        svg.appendChild(T(s, x + bw / 2, 198, 12, 'middle', 'ΔiH' + sub(i + 1), 'fill:var(--text)', 700));
      });
      svg.appendChild(T(s, 6, 14, 11, 'start', 'kJ mol⁻¹', 'fill:var(--muted)'));
      var x1 = 20 + gap + jump * (bw + gap) - gap / 2;
      svg.appendChild(s('line', { x1: x1, y1: 30, x2: x1, y2: 180, stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '5 4' }));
      out.innerHTML = '';
      out.appendChild(h('div', { html: L(
        "<b>" + st.el + "</b>: সবচেয়ে ডাঙৰ জঁপ ΔiH" + sub(jump) + " → ΔiH" + sub(jump + 1) + " ৰ মাজত (প্ৰায় " + best.toFixed(1) + " গুণ)। অৰ্থাৎ " + jump + " টা বহিঃস্তৰৰ ইলেক্ট্ৰন আতৰোৱাৰ পাছত ভিতৰৰ স্থিৰ খোলাৰ ইলেক্ট্ৰন ওলাবলগীয়া হয়; সেয়ে " + st.el + " ৰ যোজ্যতা ইলেক্ট্ৰন " + jump + " টা (বৰ্গ " + G[st.el] + ")।",
        "<b>" + st.el + "</b>: the biggest jump is between ΔiH" + sub(jump) + " and ΔiH" + sub(jump + 1) + " (about " + best.toFixed(1) + " times). After " + jump + " outer electrons are gone, the next must come from a stable inner shell, so " + st.el + " has " + jump + " valence electron" + (jump > 1 ? 's' : '') + " (group " + G[st.el] + ").") }));
    }
    paint();
  });

  /* ================================================================== 10. valency and oxides */
  A.register('valence-oxides', function (root, k) {
    var h = k.h, s = k.s;
    var GRP = {
      1: { v: '1', hyd: 'LiH, NaH, KH', ox: 'Li₂O, Na₂O, K₂O' },
      2: { v: '2', hyd: 'CaH₂', ox: 'MgO, CaO, SrO, BaO' },
      13: { v: '3', hyd: 'B₂H₆, AlH₃', ox: 'B₂O₃, Al₂O₃, Ga₂O₃, In₂O₃' },
      14: { v: '4', hyd: 'CH₄, SiH₄, GeH₄, SnH₄', ox: 'CO₂, SiO₂, GeO₂, SnO₂, PbO₂' },
      15: { v: '3, 5', hyd: 'NH₃, PH₃, AsH₃, SbH₃', ox: 'N₂O₃, N₂O₅, P₄O₆, P₄O₁₀, As₂O₃, As₂O₅' },
      16: { v: '2, 6', hyd: 'H₂O, H₂S, H₂Se, H₂Te', ox: 'SO₃, SeO₃, TeO₃' },
      17: { v: '1, 7', hyd: 'HF, HCl, HBr, HI', ox: 'Cl₂O₇' }
    };
    var P3 = [
      { f: 'Na₂O', c: 'basic', eq: 'Na₂O + H₂O → 2NaOH' },
      { f: 'MgO', c: 'basic', eq: 'MgO + H₂O → Mg(OH)₂  (sparingly)' },
      { f: 'Al₂O₃', c: 'amph', eq: 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O  and  Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O' },
      { f: 'SiO₂', c: 'acid', eq: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O' },
      { f: 'P₄O₁₀', c: 'acid', eq: 'P₄O₁₀ + 6H₂O → 4H₃PO₄' },
      { f: 'SO₃', c: 'acid', eq: 'SO₃ + H₂O → H₂SO₄' },
      { f: 'Cl₂O₇', c: 'acid', eq: 'Cl₂O₇ + H₂O → 2HClO₄' }
    ];
    var st = { mode: 'group', g: 14, i: 0 };
    var box = h('div', { style: 'padding:14px;border-radius:12px;background:var(--canvas);border:1px solid var(--border);min-height:96px' });
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var selM = k.select('Show', opts([['group', 'Hydrides and oxides by group'], ['period', 'Period 3 oxides: acid–base character']]), st.mode, function (v) { st.mode = v; syncCtl(); paint(); });
    var selG = k.select('Group', opts(Object.keys(GRP).map(function (g) { return [g, String(g)]; })), st.g, function (v) { st.g = +v; paint(); });
    var selO = k.select('Oxide', opts(P3.map(function (o, i) { return [i, o.f]; })), st.i, function (v) { st.i = +v; paint(); });
    root.appendChild(box);
    root.appendChild(h('div', { 'class': 'row' }, [selM.el, selG.el, selO.el]));
    root.appendChild(out);
    function syncCtl() { selG.el.style.display = st.mode === 'group' ? '' : 'none'; selO.el.style.display = st.mode === 'period' ? '' : 'none'; }
    function paint() {
      box.innerHTML = ''; out.innerHTML = '';
      if (st.mode === 'group') {
        var g = GRP[st.g];
        box.appendChild(h('div', { style: 'font-size:1.05rem;margin-bottom:6px', html: L("বৰ্গ <b>" + st.g + "</b>: যোজ্যতা <b>" + g.v + "</b>", "Group <b>" + st.g + "</b>: valency <b>" + g.v + "</b>") }));
        box.appendChild(h('div', { style: 'font-size:1.15rem', html: '<span style="color:var(--muted)">' + L("হাইড্ৰাইড", 'Hydrides') + ':</span> <b>' + g.hyd + '</b>' }));
        box.appendChild(h('div', { style: 'font-size:1.15rem;margin-top:4px', html: '<span style="color:var(--muted)">' + L("অক্সাইড", 'Oxides') + ':</span> <b>' + g.ox + '</b>' }));
        var ve = st.g <= 2 ? st.g : st.g - 10;
        out.appendChild(h('div', { html: L("বৰ্গ " + st.g + " ৰ মৌলৰ বহিঃস্তৰত <b>" + ve + "</b> টা ইলেক্ট্ৰন। যোজ্যতা = ইলেক্ট্ৰনৰ সংখ্যা (বা 8 − সংখ্যা)। কিছুমান বৰ্গত একাধিক যোজ্যতা দেখা যায় (যেনে 3 আৰু 5)।",
          "Group " + st.g + " elements have <b>" + ve + "</b> outer electron" + (ve > 1 ? 's' : '') + ". Valency = that number (or 8 minus it). Some groups show more than one valency (for example 3 and 5).") }));
      } else {
        var o = P3[st.i];
        var cname = { basic: L("ক্ষাৰীয় অক্সাইড", 'basic oxide'), amph: L("উভধৰ্মী অক্সাইড", 'amphoteric oxide'), acid: L("আম্লিক অক্সাইড", 'acidic oxide') }[o.c];
        var colr = { basic: 'var(--electron)', amph: 'var(--ok)', acid: 'var(--accent)' }[o.c];
        box.appendChild(h('div', { style: 'font-size:1.8rem;font-weight:700', text: o.f }));
        box.appendChild(h('div', { style: 'font-size:1.1rem;font-weight:700;color:' + colr, text: cname }));
        box.appendChild(h('div', { style: 'margin-top:6px;font-family:monospace;font-size:.95rem', text: o.eq }));
        out.appendChild(h('div', { text: L("Na₂O → MgO (ক্ষাৰীয়) → Al₂O₃ (উভধৰ্মী) → SiO₂, P₄O₁₀, SO₃, Cl₂O₇ (ক্ৰমে অধিক আম্লিক): পৰ্যায়ত বাওঁৰ পৰা সোঁলৈ ধাতৱ ধৰ্ম কমে আৰু আম্লিক ধৰ্ম বাঢ়ে।", "Na₂O → MgO (basic) → Al₂O₃ (amphoteric) → SiO₂, P₄O₁₀, SO₃, Cl₂O₇ (increasingly acidic): across a period metallic character falls and acidic character rises.") }));
      }
    }
    syncCtl(); paint();
  });
})();
