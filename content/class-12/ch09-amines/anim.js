/* Animations for Class 12, Chapter 9: Amines (এমাইন).
   Registered: amine-prep, amine-bp, amine-basicity, amine-tests, aniline-sub, diazo-reactions
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  function opts(obj, fn) { return Object.keys(obj).map(function (key) { return { value: key, label: fn(obj[key], key) }; }); }

  /* ================================================================== 1. preparation of amines */
  A.register('amine-prep', function (root, k) {
    var h = k.h, s = k.s;
    var M = {
      nitro: [L('নাইট্ৰ\' যৌগৰ বিজাৰণ', 'Reduction of nitro compounds'), 'C₆H₅NO₂', 'H₂/Pd  or  Sn + HCl  or  Fe + HCl', 'C₆H₅NH₂', L('সমান কাৰ্বন', 'same carbons'), L('এৰ\'মেটিক আৰু এলিফেটিক 1° এমাইন। Fe/HCl উপযোগী — FeCl₂ জল-বিশ্লেষিত হৈ HCl দিয়ে।', 'Aromatic and aliphatic 1° amines. Fe/HCl is preferred — FeCl₂ hydrolyses to give HCl back.')],
      ammon: [L('এমন\'লাইছিছ', 'Ammonolysis'), 'RX', 'NH₃ (ethanol, 373 K)', 'RNH₂ + R₂NH + R₃N + R₄N⁺X⁻', L('সমান কাৰ্বন', 'same carbons'), L('মিশ্ৰণ; অতিৰিক্ত NH₃ ৰে 1° মুখ্য। RI > RBr > RCl।', 'A mixture; excess NH₃ makes 1° the major product. RI > RBr > RCl.')],
      nitrile: [L('নাইট্ৰাইলৰ বিজাৰণ', 'Reduction of nitriles'), 'R–C≡N', 'H₂/Ni  or  LiAlH₄', 'R–CH₂–NH₂', L('শৃংখলত 1 C বেছি (RX ৰ তুলনাত)', '1 C more (than RX)'), L('শৃংখল দীঘল কৰা পদ্ধতি; RX + CN⁻ → RCN → RCH₂NH₂।', 'A chain-lengthening route; RX + CN⁻ → RCN → RCH₂NH₂.')],
      amide: [L('এমাইডৰ বিজাৰণ', 'Reduction of amides'), 'R–CONH₂', 'LiAlH₄, then H₂O', 'R–CH₂–NH₂', L('সমান কাৰ্বন', 'same carbons'), L('C=O ৰ O আতৰি CH₂ হয়।', 'The C=O becomes CH₂.')],
      gabriel: [L('গেব্ৰিয়েল সংশ্লেষণ', 'Gabriel synthesis'), L('খেলিমাইড + KOH, তাৰ পিছত RX', 'phthalimide + KOH, then RX'), 'NaOH(aq)', 'R–NH₂', L('সমান কাৰ্বন (R ৰ)', 'same carbons (as R)'), L('কেৱল বিশুদ্ধ 1° এমাইন; এৰাইল হেলাইডত নহয়।', 'Only pure 1° amines; not with aryl halides.')],
      hoff: [L('হফমেন অৱনমন', 'Hoffmann degradation'), 'R–CONH₂', 'Br₂ + 4NaOH', 'R–NH₂ (+ Na₂CO₃ + 2NaBr + 2H₂O)', L('1 C কম', '1 C fewer'), L('R ৰ প্ৰব্ৰজন (C → N); উৎপাদত এমাইডতকৈ এটা কাৰ্বন কম।', 'R migrates from C to N; the product has one carbon fewer than the amide.')]
    };
    var st = { m: 'nitro' };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('এমাইন প্ৰস্তুতিৰ পদ্ধতি', 'Methods of preparing amines') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var m = M[st.m]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 24, 14, 'middle', 'fill:var(--text)', m[1], 700));
      svg.appendChild(txt(s, 210, 48, 11, 'middle', 'fill:var(--muted)', '↓  ' + m[2]));
      svg.appendChild(txt(s, 210, 76, m[3].length > 22 ? 12 : 14, 'middle', 'fill:var(--text)', m[3], 700));
      svg.appendChild(s('rect', { x: 110, y: 96, width: 200, height: 26, rx: 13, style: 'fill:var(--brand-soft)' }));
      svg.appendChild(txt(s, 210, 113, 11, 'middle', 'fill:var(--text)', L('কাৰ্বন: ', 'Carbon: ') + m[4], 600));
      info.innerHTML = '<b>' + m[0] + '</b><br>' + m[5];
    }
    var ms = k.select('Method', opts(M, function (v) { return v[0]; }), st.m, function (v) { st.m = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [ms.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. boiling points */
  A.register('amine-bp', function (root, k) {
    var h = k.h, s = k.s;
    var C = [
      ['b1', 'n-C₄H₉NH₂', 350.8, L('1° এমাইন', '1° amine'), 2, L('দুটা N–H — আন্তঃআণৱিক হাইড্ৰ\'জেন বান্ধনি বেছি।', 'Two N–H bonds — the most intermolecular hydrogen bonding.')],
      ['b2', '(C₂H₅)₂NH', 329.3, L('2° এমাইন', '2° amine'), 1, L('এটা N–H — কম সংযোজন।', 'One N–H — less association.')],
      ['b3', 'C₂H₅N(CH₃)₂', 310.5, L('3° এমাইন', '3° amine'), 0, L('N–H নাই — হাইড্ৰ\'জেন বান্ধনি নগঠে।', 'No N–H — no hydrogen bonding between its molecules.')],
      ['b4', 'C₂H₅CH(CH₃)₂', 300.8, L('এলকেন', 'alkane'), 0, L('অধ্ৰুৱীয় — কেৱল দুৰ্বল ভেণ্ডাৰ ৱাল্ছ বল।', 'Non-polar — only weak van der Waals forces.')],
      ['b5', 'n-C₄H₉OH', 390.3, L('এলকহল', 'alcohol'), 3, L('O–H···O বন্ধন N–H···N তকৈ প্ৰবল (O অধিক বিদ্যুৎঋণাত্মক)।', 'O–H···O bonds are stronger than N–H···N (O is more electronegative).')]
    ];
    var st = { c: 'b1' };
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L('উতলাংকৰ তুলনা', 'Comparison of boiling points') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('উতলাংক (K) — প্ৰায় একে আণৱিক ভৰ (≈ 72–74 u)', 'Boiling point (K) — nearly equal molar mass (≈ 72–74 u)')));
      C.forEach(function (c, i) {
        var y = 26 + i * 28, on = c[0] === st.c, w = (c[2] - 280) / 120 * 200;
        svg.appendChild(txt(s, 118, y + 15, 11, 'end', 'fill:var(--text)', c[1], on ? 700 : 400));
        svg.appendChild(s('rect', { x: 124, y: y, width: 200, height: 20, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 124, y: y, width: w, height: 20, rx: 3, style: 'fill:' + (on ? 'var(--proton)' : 'var(--electron)') + ';opacity:' + (on ? 1 : .6) }));
        svg.appendChild(txt(s, 330, y + 15, 11, 'start', 'fill:var(--text)', c[2].toFixed(1), on ? 700 : 400));
      });
      var cur = C.filter(function (c) { return c[0] === st.c; })[0];
      info.innerHTML = '<b>' + cur[1] + '</b> (' + cur[3] + '): ' + cur[2].toFixed(1) + ' K<br>' + cur[5] + '<br>' + L('ক্ৰম: 1° > 2° > 3° এমাইন; এমাইনৰ উতলাংক এলকহলতকৈ কম, এলকেনতকৈ বেছি।', 'Order: 1° > 2° > 3° amines; amines boil lower than alcohols and higher than alkanes.');
    }
    var sel = k.select('Compound', C.map(function (c) { return { value: c[0], label: c[1] + ' — ' + c[3] }; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. pKb and basicity */
  A.register('amine-basicity', function (root, k) {
    var h = k.h, s = k.s;
    var C = [
      ['ma', 'CH₃NH₂', 3.38, 'al'], ['dm', '(CH₃)₂NH', 3.27, 'al'], ['tm', '(CH₃)₃N', 4.22, 'al'],
      ['ea', 'C₂H₅NH₂', 3.29, 'al'], ['de', '(C₂H₅)₂NH', 3.00, 'al'], ['te', '(C₂H₅)₃N', 3.25, 'al'],
      ['am', 'NH₃', 4.75, 'ref'],
      ['an', 'C₆H₅NH₂', 9.38, 'ar'], ['mn', 'C₆H₅NHCH₃', 9.30, 'ar'], ['dn', 'C₆H₅N(CH₃)₂', 8.92, 'ar'], ['bz', 'C₆H₅CH₂NH₂', 4.70, 'al']
    ];
    var st = { c: 'an' };
    var svg = s('svg', { viewBox: '0 0 420 300', 'class': 'anim-svg', role: 'img', 'aria-label': L('pKᵦ আৰু ক্ষাৰকীয়তা', 'pKb and basicity') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('pKᵦ — যিমান কম, ক্ষাৰ সিমান প্ৰবল', 'pKb — the smaller, the stronger the base')));
      C.forEach(function (c, i) {
        var y = 24 + i * 24, on = c[0] === st.c, w = c[2] / 10 * 200;
        svg.appendChild(txt(s, 132, y + 13, 11, 'end', 'fill:var(--text)', c[1], on ? 700 : 400));
        svg.appendChild(s('rect', { x: 138, y: y, width: 200, height: 17, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 138, y: y, width: w, height: 17, rx: 3, style: 'fill:' + (on ? 'var(--proton)' : (c[3] === 'ar' ? 'var(--alpha)' : (c[3] === 'ref' ? 'var(--muted)' : 'var(--electron)'))) + ';opacity:' + (on ? 1 : .65) }));
        svg.appendChild(txt(s, 344, y + 13, 11, 'start', 'fill:var(--text)', c[2].toFixed(2), on ? 700 : 400));
      });
      var cur = C.filter(function (c) { return c[0] === st.c; })[0], r = Math.pow(10, 4.75 - cur[2]);
      var cmp = cur[3] === 'ref' ? L('এইটো তুলনাৰ মান (pKᵦ = 4.75)।', 'This is the reference (pKb = 4.75).') :
        (r >= 1 ? L('NH₃ তকৈ ≈ ' + (r >= 100 ? Math.round(r) : r.toFixed(1)) + ' গুণ প্ৰবল ক্ষাৰ।', 'About ' + (r >= 100 ? Math.round(r) : r.toFixed(1)) + ' times stronger a base than NH₃.') :
          L('NH₃ তকৈ ≈ ' + Math.round(1 / r) + ' গুণ দুৰ্বল ক্ষাৰ।', 'About ' + Math.round(1 / r) + ' times weaker a base than NH₃.'));
      var why = cur[3] === 'ar' ? L('অনাবন্ধ যুৰ চক্ৰত সংস্পন্দিত — প্ৰ\'টন গ্ৰহণৰ বাবে কম উপলব্ধ; এনিলিনিয়াম আয়ন কম সুস্থিৰ।', 'The lone pair is delocalised into the ring — less available for protonation; the anilinium ion is less stabilised.') :
        (cur[3] === 'ref' ? '' : L('+I প্ৰভাৱে N ত ইলেক্ট্ৰন ঘনত্ব বঢ়ায়; জলীয় দ্ৰৱণত দ্ৰাৱকযোজন আৰু ষ্টেৰিক বাধাই 3° ক কম প্ৰবল কৰে।', 'The +I effect raises electron density on N; in water, solvation and steric hindrance make 3° amines less basic.'));
      info.innerHTML = '<b>' + cur[1] + '</b>: pK<sub>b</sub> = <b>' + cur[2].toFixed(2) + '</b><br>' + cmp + '<br>' + why;
    }
    var sel = k.select('Amine', C.map(function (c) { return { value: c[0], label: c[1] }; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. tests for 1°, 2°, 3° amines */
  A.register('amine-tests', function (root, k) {
    var h = k.h, s = k.s;
    var CL = { p: L('1° এমাইন (RNH₂)', '1° amine (RNH₂)'), q: L('2° এমাইন (R₂NH)', '2° amine (R₂NH)'), t: L('3° এমাইন (R₃N)', '3° amine (R₃N)') };
    var TS = {
      hno2: L('NaNO₂ + HCl (HNO₂)', 'NaNO₂ + HCl (HNO₂)'),
      hin: L('হিনছবাৰ্গ (C₆H₅SO₂Cl)', 'Hinsberg (C₆H₅SO₂Cl)'),
      carb: L('কাৰ্বিলেমাইন (CHCl₃ + KOH)', 'Carbylamine (CHCl₃ + KOH)'),
      acyl: L('এছাইলেছন (CH₃COCl / (CH₃CO)₂O)', 'Acylation (CH₃COCl / (CH₃CO)₂O)')
    };
    var R = {
      'p-hno2': [L('N₂ গেছ ওলায় (এলিফেটিক) বা ডায়েজ\'নিয়াম লৱণ (এৰ\'মেটিক, 273–278 K)', 'N₂ gas evolves (aliphatic) or a diazonium salt forms (aromatic, 273–278 K)'), 1],
      'q-hno2': [L('হালধীয়া তৈলাক্ত N-নাইট্ৰ\'ছামাইন', 'a yellow oily N-nitrosamine'), 1],
      't-hno2': [L('লৱণ (নাইট্ৰাইট) — গেছ নওলায়', 'a salt (nitrite) — no gas'), 0],
      'p-hin': [L('N-এলকাইলছালফ\'নামাইড — ক্ষাৰত দ্ৰৱণীয় (N–H অম্লীয়)', 'N-alkylsulphonamide — soluble in alkali (acidic N–H)'), 1],
      'q-hin': [L('N,N-ডাইএলকাইলছালফ\'নামাইড — ক্ষাৰত অদ্ৰৱণীয় (N–H নাই)', 'N,N-dialkylsulphonamide — insoluble in alkali (no N–H)'), 1],
      't-hin': [L('বিক্ৰিয়া নহয়', 'no reaction'), 0],
      'p-carb': [L('দুৰ্গন্ধযুক্ত আইছ\'ছায়ানাইড (R–NC)', 'foul-smelling isocyanide (R–NC)'), 1],
      'q-carb': [L('বিক্ৰিয়া নহয়', 'no reaction'), 0],
      't-carb': [L('বিক্ৰিয়া নহয়', 'no reaction'), 0],
      'p-acyl': [L('এমাইড (N-প্ৰতিস্থাপিত)', 'amide (N-substituted)'), 1],
      'q-acyl': [L('এমাইড (N,N-ডাইপ্ৰতিস্থাপিত)', 'amide (N,N-disubstituted)'), 1],
      't-acyl': [L('বিক্ৰিয়া নহয় (N–H নাই)', 'no reaction (no N–H)'), 0]
    };
    var st = { c: 'p', t: 'hin' };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('এমাইনৰ পৰীক্ষা', 'Tests for amines') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var r = R[st.c + '-' + st.t]; svg.innerHTML = '';
      ['p', 'q', 't'].forEach(function (c, i) {
        var x = 30 + i * 120, res = R[c + '-' + st.t], on = c === st.c;
        svg.appendChild(s('rect', { x: x, y: 20, width: 108, height: 90, rx: 10, style: 'fill:' + (res[1] ? 'var(--brand-soft)' : 'var(--surface-2)') + ';stroke:' + (on ? 'var(--proton)' : 'var(--muted)'), 'stroke-width': on ? 3 : 1 }));
        svg.appendChild(txt(s, x + 54, 42, 12, 'middle', 'fill:var(--text)', c === 'p' ? '1°' : (c === 'q' ? '2°' : '3°'), 700));
        svg.appendChild(txt(s, x + 54, 74, 20, 'middle', 'fill:' + (res[1] ? 'var(--ok)' : 'var(--muted)'), res[1] ? '✔' : '✘', 700));
        svg.appendChild(txt(s, x + 54, 98, 10, 'middle', 'fill:var(--muted)', res[1] ? L('বিক্ৰিয়া', 'reacts') : L('নহয়', 'no'), 400));
      });
      svg.appendChild(txt(s, 210, 138, 11, 'middle', 'fill:var(--muted)', TS[st.t]));
      info.innerHTML = '<b>' + CL[st.c] + '</b> + ' + TS[st.t] + '<br>' + r[0];
    }
    var cs = k.select('Amine class', opts(CL, function (v) { return v; }), st.c, function (v) { st.c = v; paint(); });
    var ts = k.select('Test', opts(TS, function (v) { return v; }), st.t, function (v) { st.t = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [cs.el, ts.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. electrophilic substitution of aniline */
  A.register('aniline-sub', function (root, k) {
    var h = k.h, s = k.s;
    var RX = {
      br: [L('ব্ৰ\'মিনেছন (Br₂)', 'Bromination (Br₂)'), [['2,4,6-' + L('ট্ৰাইব্ৰ\'ম\'এনিলিন', 'tribromoaniline'), 100]], [['p-' + L('ব্ৰ\'ম\'এনিলিন (মুখ্য)', 'bromoaniline (major)'), 90], ['o-' + L('ব্ৰ\'ম\'', 'bromo'), 10]],
        L('বিনা সুৰক্ষাত ব্ৰ\'মিন পানীয়ে তিনিটা স্থান প্ৰতিস্থাপন কৰে (বগা অধঃক্ষেপ)।', 'Without protection bromine water substitutes all three positions (white precipitate).')],
      ni: [L('নাইট্ৰেছন (HNO₃/H₂SO₄)', 'Nitration (HNO₃/H₂SO₄)'), [['p- (51%)', 51], ['m- (47%)', 47], ['o- (2%)', 2]], [['p-' + L('নাইট্ৰ\'এনিলিন (মুখ্য)', 'nitroaniline (major)'), 90], ['o-', 10]],
        L('বিনা সুৰক্ষাত জাৰণ (আলকাতৰা) আৰু –NH₃⁺ ৰ বাবে m- ব্যুৎপন্ন।', 'Without protection: oxidation (tar) and the m- derivative because of –NH₃⁺.')],
      su: [L('ছালফনেছন (H₂SO₄, 453–473 K)', 'Sulphonation (H₂SO₄, 453–473 K)'), [['p-' + L('ছালফানিলিক এছিড', 'sulphanilic acid'), 100]], [['p-' + L('ছালফানিলিক এছিড', 'sulphanilic acid'), 100]],
        L('ছালফানিলিক এছিড — উভয়ধৰ্মী আয়ন; সুৰক্ষাৰ প্ৰয়োজন নাই।', 'Sulphanilic acid — a zwitter ion; protection is not needed.')],
      fc: [L('ফ্ৰিডেল-ক্ৰাফ্ট (AlCl₃)', 'Friedel–Crafts (AlCl₃)'), [[L('বিক্ৰিয়া নহয়', 'no reaction'), 0]], [[L('বিক্ৰিয়া নহয়', 'no reaction'), 0]],
        L('AlCl₃ এ N ৰ সৈতে লৱণ গঠন কৰে; N ধনাত্মক হৈ চক্ৰ নিষ্ক্ৰিয় কৰে।', 'AlCl₃ forms a salt with N; the positive N deactivates the ring.')]
    };
    var st = { r: 'br', p: 0 };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('এনিলিনৰ ইলেক্ট্ৰ\'ফীলীয় প্ৰতিস্থাপন', 'Electrophilic substitution of aniline') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var pbtn;
    function paint() {
      var r = RX[st.r], rows = st.p ? r[2] : r[1]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 18, 12, 'middle', 'fill:var(--text)', (st.p ? L('এছিটেনিলাইড (–NHCOCH₃) মাধ্যমেদি', 'Via acetanilide (–NHCOCH₃)') : L('এনিলিন (–NH₂) পোনপটীয়াকৈ', 'Aniline (–NH₂) directly')) + '  →  ' + r[0], 700));
      rows.forEach(function (x, i) {
        var y = 34 + i * 30;
        svg.appendChild(txt(s, 150, y + 15, 11, 'end', 'fill:var(--text)', x[0]));
        svg.appendChild(s('rect', { x: 156, y: y, width: 200, height: 20, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 156, y: y, width: Math.max(1, 2 * x[1]), height: 20, rx: 3, style: 'fill:' + (x[1] ? 'var(--electron)' : 'var(--muted)') + ';opacity:.8' }));
        svg.appendChild(txt(s, 362, y + 15, 11, 'start', 'fill:var(--text)', x[1] + ' %'));
      });
      info.innerHTML = '<b>' + r[0] + '</b>' + (st.p ? ' — ' + L('সুৰক্ষিত (এছাইলেছিত) এনিলিন', 'protected (acylated) aniline') : '') + '<br>' + r[3] +
        (st.p ? '<br>' + L('এছাইলেছনে N ৰ যুৰ O ৰ সৈতে সংস্পন্দনত ব্যস্ত ৰাখি সক্ৰিয়তা কমায়; পিছত OH⁻/H⁺ ৰে জল-বিশ্লেষণ।', 'Acylation ties up the N lone pair in resonance with O, lowering the activation; hydrolysis with OH⁻/H⁺ follows.') : '') +
        '<br><span class="muted">' + L('শতাংশবোৰ প্ৰকৃত নাইট্ৰেছনৰ (পাঠ্যপুথি); আন সংখ্যাবোৰ শিক্ষণীয় আনুমানিক।', 'Percentages for nitration are from the textbook; the others are approximate, for teaching.') + '</span>';
      pbtn.textContent = st.p ? 'Protect –NH₂: ON' : 'Protect –NH₂: OFF';
    }
    var rs = k.select('Reaction', opts(RX, function (v) { return v[0]; }), st.r, function (v) { st.r = v; paint(); });
    pbtn = k.button('Protect –NH₂: OFF', function () { st.p = st.p ? 0 : 1; paint(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [rs.el, pbtn]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. diazonium reactions */
  A.register('diazo-reactions', function (root, k) {
    var h = k.h, s = k.s;
    var R = {
      cucl: ['CuCl / HCl', 'ArCl', L('ছেণ্ডমেয়াৰ', 'Sandmeyer'), 1],
      cubr: ['CuBr / HBr', 'ArBr', L('ছেণ্ডমেয়াৰ', 'Sandmeyer'), 1],
      cucn: ['CuCN / KCN', 'ArCN', L('ছেণ্ডমেয়াৰ', 'Sandmeyer'), 1],
      cu: ['Cu powder / HCl or HBr', 'ArCl / ArBr', L('গেটাৰমেন', 'Gattermann'), 1],
      ki: ['KI', 'ArI', L('আয়\'ডাইড প্ৰতিস্থাপন', 'iodide replacement'), 1],
      bf4: ['HBF₄, then heat', 'ArF', L('বালজ-শ্বিমান', 'Balz–Schiemann'), 1],
      h3po2: ['H₃PO₂ + H₂O  (or CH₃CH₂OH)', 'ArH', L('H ৰে প্ৰতিস্থাপন', 'replacement by H'), 1],
      h2o: ['H₂O, warm (283 K)', 'ArOH', L('ফিনল', 'phenol formation'), 1],
      no2: ['HBF₄, then NaNO₂ / Cu, heat', 'ArNO₂', L('–NO₂ ৰে প্ৰতিস্থাপন', 'replacement by –NO₂'), 1],
      phen: [L('ফিনল (OH⁻)', 'phenol (OH⁻)'), 'Ar–N=N–C₆H₄–OH', L('যুগ্মন — কমলা ৰং', 'coupling — orange dye'), 0],
      anil: [L('এনিলিন (H⁺, pH 4–5)', 'aniline (H⁺, pH 4–5)'), 'Ar–N=N–C₆H₄–NH₂', L('যুগ্মন — হালধীয়া ৰং', 'coupling — yellow dye'), 0]
    };
    var st = { r: 'cucl' };
    var svg = s('svg', { viewBox: '0 0 420 130', 'class': 'anim-svg', role: 'img', 'aria-label': L('ডায়েজ\'নিয়াম লৱণৰ বিক্ৰিয়া', 'Reactions of diazonium salts') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var r = R[st.r]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 26, 15, 'middle', 'fill:var(--text)', 'ArN₂⁺Cl⁻', 700));
      svg.appendChild(txt(s, 210, 50, 12, 'middle', 'fill:var(--muted)', '↓  ' + r[0]));
      svg.appendChild(txt(s, 210, 80, 16, 'middle', 'fill:var(--text)', r[1], 700));
      svg.appendChild(s('rect', { x: 100, y: 96, width: 220, height: 24, rx: 12, style: 'fill:' + (r[3] ? 'var(--brand-soft)' : 'var(--surface-2)') }));
      svg.appendChild(txt(s, 210, 112, 11, 'middle', 'fill:var(--text)', r[3] ? L('N₂ গেছ ওলায় ↑', 'N₂ gas released ↑') : L('–N=N– ৰক্ষিত (এজ\' যৌগ)', '–N=N– retained (azo compound)'), 600));
      info.innerHTML = '<b>' + r[2] + '</b>: ArN₂⁺Cl⁻ + ' + r[0] + ' → <b>' + r[1] + '</b>' + (r[3] ? ' + N₂' : '') + '<br>' +
        (r[3] ? L('ডায়েজ\'নিয়াম মূলক উৎকৃষ্ট বহিৰ্গামী মূলক (N₂)।', 'The diazonium group is an excellent leaving group (N₂).') : L('ডায়েজ\'নিয়াম আয়ন ইলেক্ট্ৰ\'ফাইল; p-স্থানত ইলেক্ট্ৰ\'ফীলীয় প্ৰতিস্থাপন।', 'The diazonium ion is the electrophile; electrophilic substitution at the para position.'));
    }
    var sel = k.select('Reagent', opts(R, function (v) { return v[0]; }), st.r, function (v) { st.r = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });
})();
