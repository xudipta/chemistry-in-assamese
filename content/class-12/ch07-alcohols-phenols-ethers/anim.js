/* Animations for Class 12, Chapter 7: Alcohols, Phenols and Ethers (এলকহল, ফিনল আৰু ইথাৰ).
   Registered: oh-bp, grignard-alcohol, acid-strength, lucas-test, alcohol-oxidation, phenol-reactions, williamson
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
  function opts(obj, fn) { return Object.keys(obj).map(function (key) { return { value: key, label: fn(obj[key], key) }; }); }

  /* ================================================================== 1. hydrogen bonding and boiling point */
  A.register('oh-bp', function (root, k) {
    var h = k.h, s = k.s;
    var SETS = {
      a: { n: L('≈ 45 u', '≈ 45 u'), c: [['C₃H₈', L('প্ৰপেন', 'propane'), 44, 231, 0], ['CH₃OCH₃', L('মিথক্সিমিথেন', 'methoxymethane'), 46, 248, 0], ['C₂H₅OH', L('ইথানল', 'ethanol'), 46, 351, 1]] },
      b: { n: L('≈ 73 u', '≈ 73 u'), c: [['C₅H₁₂', L('n-পেণ্টেন', 'n-pentane'), 72, 309.1, 0], ['C₂H₅OC₂H₅', L('ইথক্সিইথেন', 'ethoxyethane'), 74, 307.6, 0], ['C₄H₉OH', L('বিউটেন-1-অল', 'butan-1-ol'), 74, 390, 1]] }
    };
    var st = { set: 'a' };
    var svg = s('svg', { viewBox: '0 0 420 250', 'class': 'anim-svg', role: 'img', 'aria-label': L('একে ভৰৰ যৌগৰ উতলাংক', 'Boiling points of compounds of similar mass') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var set = SETS[st.set]; svg.innerHTML = '';
      var base = 200, top = 40, maxT = 420;
      svg.appendChild(s('line', { x1: 40, y1: base, x2: 410, y2: base, style: 'stroke:var(--muted)', 'stroke-width': 1.5 }));
      svg.appendChild(txt(s, 6, 16, 11, 'start', 'fill:var(--muted)', L('উতলাংক (K)', 'Boiling point (K)')));
      set.c.forEach(function (c, i) {
        var x = 60 + i * 115, hgt = (c[3] / maxT) * (base - top), hb = c[4];
        svg.appendChild(s('rect', { x: x, y: base - hgt, width: 70, height: hgt, rx: 4, style: 'fill:' + (hb ? 'var(--proton)' : 'var(--electron)') + ';opacity:' + (hb ? 1 : .75) }));
        svg.appendChild(txt(s, x + 35, base - hgt - 5, 12, 'middle', 'fill:var(--text)', c[3] + ' K', 700));
        svg.appendChild(txt(s, x + 35, base + 16, 12, 'middle', 'fill:var(--text)', c[0], 600));
        svg.appendChild(txt(s, x + 35, base + 30, 10, 'middle', 'fill:var(--muted)', c[1] + ' · ' + c[2] + ' u'));
        if (hb) { svg.appendChild(txt(s, x + 35, base + 46, 10, 'middle', 'fill:var(--proton)', L('হাইড্ৰ\'জেন বান্ধনি', 'hydrogen bonds'), 700)); }
      });
      var a = set.c[2][3] - set.c[1][3], b = set.c[2][3] - set.c[0][3];
      info.innerHTML = L('একে আণৱিক ভৰত এলকহলৰ উতলাংক ইথাৰতকৈ <b>' + a.toFixed(0) + ' K</b> আৰু হাইড্ৰ\'কাৰ্বনতকৈ <b>' + b.toFixed(0) + ' K</b> বেছি।', 'At a similar molecular mass the alcohol boils <b>' + a.toFixed(0) + ' K</b> higher than the ether and <b>' + b.toFixed(0) + ' K</b> higher than the hydrocarbon.') +
        '<br>' + L('কাৰণ: –OH ৰ O–H···O হাইড্ৰ\'জেন বান্ধনিয়ে অণুবোৰক একেলগে ধৰি ৰাখে; ইথাৰ আৰু হাইড্ৰ\'কাৰ্বনত এনে বান্ধনি নাই।', 'Reason: the O–H···O hydrogen bonds of –OH hold the molecules together; ethers and hydrocarbons have no such bonds.');
    }
    var sel = k.select('Set', opts(SETS, function (v, key) { return key === 'a' ? 'Propane / methoxymethane / ethanol' : 'Pentane / ethoxyethane / butan-1-ol'; }), st.set, function (v) { st.set = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. Grignard + carbonyl -> alcohol */
  A.register('grignard-alcohol', function (root, k) {
    var h = k.h, s = k.s;
    var CAR = { f: { f: 'HCHO', n: L('ফৰ্মেলডিহাইড', 'formaldehyde'), r: ['H', 'H'] }, a: { f: 'CH₃CHO', n: L('এচিটালডিহাইড', 'acetaldehyde'), r: ['CH₃', 'H'] }, k: { f: 'CH₃COCH₃', n: L('এছিট\'ন', 'acetone'), r: ['CH₃', 'CH₃'] } };
    var GR = { m: { f: 'CH₃MgBr', R: 'CH₃' }, e: { f: 'C₂H₅MgBr', R: 'C₂H₅' } };
    var NAME = {
      'f-m': [L('ইথানল', 'ethanol'), 'CH₃CH₂OH', 1], 'f-e': [L('প্ৰপেন-1-অল', 'propan-1-ol'), 'CH₃CH₂CH₂OH', 1],
      'a-m': [L('প্ৰপেন-2-অল', 'propan-2-ol'), 'CH₃CH(OH)CH₃', 2], 'a-e': [L('বিউটেন-2-অল', 'butan-2-ol'), 'CH₃CH(OH)CH₂CH₃', 2],
      'k-m': [L('2-মিথাইলপ্ৰপেন-2-অল', '2-methylpropan-2-ol'), '(CH₃)₃C–OH', 3], 'k-e': [L('2-মিথাইলবিউটেন-2-অল', '2-methylbutan-2-ol'), '(CH₃)₂C(OH)CH₂CH₃', 3]
    };
    var CLS = { 1: L('প্ৰাইমাৰি (1°)', 'primary (1°)'), 2: L('ছেকেণ্ডাৰি (2°)', 'secondary (2°)'), 3: L('টাৰছিয়েৰি (3°)', 'tertiary (3°)') };
    var st = { c: 'f', g: 'm', step: 0 };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L('গ্ৰিগনাৰ্ড বিকাৰকৰ পৰা এলকহল', 'Alcohols from Grignard reagents') });
    root.appendChild(svg);
    function paint() {
      var c = CAR[st.c], g = GR[st.g], nm = NAME[st.c + '-' + st.g];
      svg.innerHTML = '';
      var adduct = '[' + (c.r[0] === 'H' && c.r[1] === 'H' ? 'RCH₂–OMgBr' : (c.r[1] === 'H' ? 'CH₃CH(R)–OMgBr' : '(CH₃)₂C(R)–OMgBr')).replace('R', g.R) + ']';
      var rows = [[c.f + '  +  ' + g.f, L('বিক্ৰিয়ক', 'reactants')], [adduct, L('যৃত যৌগ (নিউক্লিঅ\'ফীলীয় যোজন)', 'adduct (nucleophilic addition)')], [nm[1] + '  + Mg(OH)Br', L('H₂O ৰে জল-অপঘটন', 'hydrolysis with H₂O')]];
      rows.forEach(function (r, i) {
        var y = 40 + i * 52, on = i <= st.step;
        svg.appendChild(s('rect', { x: 10, y: y - 22, width: 400, height: 40, rx: 8, style: 'fill:' + (on ? 'var(--brand-soft)' : 'var(--surface-2)') + ';opacity:' + (on ? 1 : .55) }));
        svg.appendChild(txt(s, 20, y + 1, 14, 'start', 'fill:var(--text)', r[0], 700));
        svg.appendChild(txt(s, 400, y + 1, 10, 'end', 'fill:var(--muted)', r[1]));
        if (i < 2) svg.appendChild(txt(s, 210, y + 28, 14, 'middle', 'fill:var(--muted)', i === 0 ? '↓' : '↓ H₂O'));
      });
      info.innerHTML = '<b>' + c.n + '</b> + ' + g.f + ' → <b>' + nm[0] + '</b> (' + CLS[nm[2]] + ')<br>' +
        (st.c === 'f' ? L('ফৰ্মেলডিহাইডে সদায় প্ৰাইমাৰি এলকহল দিয়ে।', 'Formaldehyde always gives a primary alcohol.') : (st.c === 'a' ? L('আন এলডিহাইডে ছেকেণ্ডাৰি এলকহল দিয়ে।', 'Other aldehydes give secondary alcohols.') : L('কিট\'নে টাৰছিয়েৰি এলকহল দিয়ে।', 'Ketones give tertiary alcohols.'))) +
        '<br>' + L('ধাপ ', 'Stage ') + (st.step + 1) + ' / 3';
    }
    var cs = k.select('Carbonyl compound', opts(CAR, function (v) { return v.f; }), st.c, function (v) { st.c = v; st.step = 0; paint(); });
    var gs = k.select('Grignard reagent', opts(GR, function (v) { return v.f; }), st.g, function (v) { st.g = v; st.step = 0; paint(); });
    var nx = k.button('Next step', function () { st.step = (st.step + 1) % 3; paint(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [cs.el, gs.el, nx]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. acid strength (pKa) */
  A.register('acid-strength', function (root, k) {
    var h = k.h, s = k.s;
    var CMP = [
      ['tnp', L('2,4,6-ট্ৰাইনাইট্ৰ\'ফিনল', '2,4,6-trinitrophenol'), 0.4], ['pnp', L('p-নাইট্ৰ\'ফিনল', 'p-nitrophenol'), 7.1], ['onp', L('o-নাইট্ৰ\'ফিনল', 'o-nitrophenol'), 7.2],
      ['mnp', L('m-নাইট্ৰ\'ফিনল', 'm-nitrophenol'), 8.3], ['phe', L('ফিনল', 'phenol'), 10.0], ['mcr', L('m-ক্ৰেছল', 'm-cresol'), 10.1], ['pcr', L('p-ক্ৰেছল', 'p-cresol'), 10.2],
      ['wat', L('পানী', 'water'), 15.7], ['eth', L('ইথানল', 'ethanol'), 15.9]
    ];
    var st = { c: 'pnp' };
    var svg = s('svg', { viewBox: '0 0 420 260', 'class': 'anim-svg', role: 'img', 'aria-label': L('ফিনল আৰু এলকহলৰ pKₐ', 'pKₐ of phenols and alcohols') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('এছিড ধৰ্ম বেছি ←→ কম (pKₐ কম ←→ বেছি)', 'stronger acid ←→ weaker acid (low pKₐ ←→ high pKₐ)')));
      CMP.forEach(function (c, i) {
        var y = 28 + i * 24, on = c[0] === st.c, w = (c[2] / 16) * 200;
        svg.appendChild(txt(s, 150, y + 13, 11, 'end', 'fill:var(--text)', c[1], on ? 700 : 400));
        svg.appendChild(s('rect', { x: 156, y: y, width: 200, height: 17, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 156, y: y, width: Math.max(2, w), height: 17, rx: 3, style: 'fill:' + (on ? 'var(--proton)' : 'var(--electron)') + ';opacity:' + (on ? 1 : .6) }));
        svg.appendChild(txt(s, 362, y + 13, 11, 'start', 'fill:var(--text)', c[2].toFixed(1), on ? 700 : 400));
      });
      var cur = CMP.filter(function (c) { return c[0] === st.c; })[0], ratio = Math.pow(10, 15.9 - cur[2]);
      var big = ratio >= 1e4 ? ratio.toExponential(1).replace('e+', ' × 10<sup>') + '</sup>' : String(Math.round(ratio));
      info.innerHTML = '<b>' + cur[1] + '</b>: pK<sub>a</sub> = <b>' + cur[2].toFixed(1) + '</b><br>' +
        L('ইথানলৰ (15.9) তুলনাত এছিড ধৰ্ম ≈ <b>' + big + '</b> গুণ।', 'Compared with ethanol (15.9) it is about <b>' + big + '</b> times more acidic.') +
        '<br>' + L('pKₐ যিমান কম, এছিড সিমান তীব্ৰ। –NO₂ (ইলেক্ট্ৰন আকৰ্ষী) এ pKₐ কমায়; –CH₃ (ইলেক্ট্ৰন ত্যাগী) এ অলপ বঢ়ায়।', 'The lower the pKₐ the stronger the acid. –NO₂ (electron-withdrawing) lowers the pKₐ; –CH₃ (electron-releasing) raises it slightly.') +
        (st.c === 'tnp' || st.c === 'wat' ? '<br><span class="en">' + L('(এই মান পাঠ্যপুথিৰ তালিকাত নাই; সাধাৰণ ৰসায়নৰ তথ্য।)', '(This value is not in the textbook table; it is a standard literature value.)') + '</span>' : '');
    }
    var sel = k.select('Compound', CMP.map(function (c) { return { value: c[0], label: c[1] }; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. Lucas test */
  A.register('lucas-test', function (root, k) {
    var h = k.h, s = k.s, t = 0, running = false;
    var TUBES = [[L('প্ৰাইমাৰি', 'primary'), 'CH₃CH₂CH₂CH₂OH', -1], [L('ছেকেণ্ডাৰি', 'secondary'), 'CH₃CH(OH)CH₂CH₃', 5], [L('টাৰছিয়েৰি', 'tertiary'), '(CH₃)₃C–OH', 0.3]];
    var svg = s('svg', { viewBox: '0 0 420 230', 'class': 'anim-svg', role: 'img', 'aria-label': L('লুকাছ অভীক্ষণ', 'The Lucas test') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      TUBES.forEach(function (tb, i) {
        var x = 40 + i * 125, realMin = t * 20 / 60, cloud;   /* t is seconds on the animation clock; 1 s = 20 s of real time */
        cloud = tb[2] < 0 ? 0 : clamp((realMin - tb[2]) / 0.6 + (tb[2] === 0.3 ? 0.3 : 0), 0, 1);
        svg.appendChild(s('rect', { x: x, y: 30, width: 70, height: 130, rx: 8, style: 'fill:#cfe8ff;opacity:.5;stroke:var(--muted)', 'stroke-width': 2 }));
        svg.appendChild(s('rect', { x: x + 2, y: 80, width: 66, height: 78, rx: 6, style: 'fill:#ffffff;opacity:' + (0.15 + cloud * 0.85) }));
        svg.appendChild(txt(s, x + 35, 182, 12, 'middle', 'fill:var(--text)', tb[0], 700));
        svg.appendChild(txt(s, x + 35, 197, 9, 'middle', 'fill:var(--muted)', tb[1]));
        svg.appendChild(txt(s, x + 35, 215, 10, 'middle', 'fill:' + (cloud > 0.6 ? 'var(--ok)' : 'var(--muted)'), cloud > 0.6 ? L('ঘোলা ✔', 'cloudy ✔') : (tb[2] < 0 && t > 6 ? L('ঘোলা নহয়', 'stays clear') : '…'), 700));
      });
      svg.appendChild(txt(s, 8, 16, 11, 'start', 'fill:var(--muted)', L('বিকাৰক: গাঢ় HCl + ZnCl₂ · সময়: ', 'Reagent: conc. HCl + ZnCl₂ · time: ') + (t * 20 / 60).toFixed(1) + ' min'));
      info.innerHTML = L('<b>টাৰছিয়েৰি</b> — তৎক্ষণাত ঘোলা (SN1: সুস্থিৰ কাৰ্বকেটায়ন); <b>ছেকেণ্ডাৰি</b> — প্ৰায় 5 মিনিটত; <b>প্ৰাইমাৰি</b> — সাধাৰণ উষ্ণতাত ঘোলা নহয়। ঘোলা হোৱাৰ কাৰণ: উৎপন্ন এলকাইল ক্ল\'ৰাইড বিকাৰকত অদ্ৰৱণীয়।', '<b>Tertiary</b> — cloudy at once (SN1: stable carbocation); <b>secondary</b> — in about 5 minutes; <b>primary</b> — stays clear at room temperature. The cloudiness is the alkyl chloride, which is insoluble in the reagent.');
    }
    function tick(dt) { if (running) { t = Math.min(t + dt, 22); if (t >= 22) running = false; paint(); } }
    var go = k.button('Start', function () { t = 0; running = true; }, 'primary'), rs = k.button('Reset', function () { running = false; t = 0; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [go, rs]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paint(); if (k.reduceMotion) { t = 22; paint(); } else lp.start();
  });

  /* ================================================================== 5. oxidation of alcohols */
  A.register('alcohol-oxidation', function (root, k) {
    var h = k.h, s = k.s;
    var ALC = { p: { n: L('প্ৰাইমাৰি — ইথানল', 'primary — ethanol'), f: 'CH₃CH₂OH' }, s: { n: L('ছেকেণ্ডাৰি — প্ৰপেন-2-অল', 'secondary — propan-2-ol'), f: 'CH₃CH(OH)CH₃' }, t: { n: L('টাৰছিয়েৰি — 2-মিথাইলপ্ৰপেন-2-অল', 'tertiary — 2-methylpropan-2-ol'), f: '(CH₃)₃C–OH' } };
    var OX = { m: L('PCC / CrO₃ (মৃদু, অনাৰ্দ্ৰ)', 'PCC / CrO₃ (mild, anhydrous)'), x: L('অম্লীয় KMnO₄ (তীব্ৰ)', 'acidified KMnO₄ (strong)'), c: L('তপত Cu, 573 K', 'hot Cu, 573 K') };
    var RES = {
      'p-m': ['CH₃CHO', L('এলডিহাইড (এচিটালডিহাইড)', 'aldehyde (acetaldehyde)'), L('মৃদু জাৰকে এলডিহাইডত বন্ধ কৰে।', 'The mild agent stops at the aldehyde.')],
      'p-x': ['CH₃COOH', L('কাৰ্বক্সিলিক এছিড (ইথানয়িক এছিড)', 'carboxylic acid (ethanoic acid)'), L('তীব্ৰ জাৰকে এলডিহাইড আৰু জাৰিত কৰি এছিডলৈ নিয়ে।', 'The strong agent oxidises the aldehyde further to the acid.')],
      'p-c': ['CH₃CHO + H₂', L('এলডিহাইড + হাইড্ৰ\'জেন গেছ', 'aldehyde + hydrogen gas'), L('তপত কপাৰত হাইড্ৰ\'জেন-বৰ্জন (dehydrogenation)।', 'Dehydrogenation over hot copper.')],
      's-m': ['CH₃COCH₃', L('কিট\'ন (এছিট\'ন)', 'ketone (acetone)'), L('ছেকেণ্ডাৰি এলকহলে কিট\'ন দিয়ে।', 'A secondary alcohol gives a ketone.')],
      's-x': ['CH₃COCH₃', L('কিট\'ন (এছিট\'ন)', 'ketone (acetone)'), L('কিট\'ন সাধাৰণতে আৰু জাৰিত নহয়।', 'The ketone is not normally oxidised further.')],
      's-c': ['CH₃COCH₃ + H₂', L('কিট\'ন + হাইড্ৰ\'জেন', 'ketone + hydrogen'), L('তপত কপাৰত হাইড্ৰ\'জেন-বৰ্জন।', 'Dehydrogenation over hot copper.')],
      't-m': [L('জাৰণ নহয়', 'no oxidation'), L('টাৰছিয়েৰি এলকহল জাৰিত নহয়', 'a tertiary alcohol resists oxidation'), L('–OH যুক্ত কাৰ্বনত হাইড্ৰ\'জেন নাই।', 'The carbon with –OH has no hydrogen.')],
      't-x': [L('এছিডৰ মিশ্ৰ', 'mixture of acids'), L('C–C বান্ধনি ভাগে', 'C–C bonds break'), L('তীব্ৰ জাৰক আৰু উচ্চ তাপত বিঘটন।', 'Degradation with a strong agent and heat.')],
      't-c': ['(CH₃)₂C=CH₂ + H₂O', L('এলকিন (নিৰ্জলীকৰণ)', 'alkene (dehydration)'), L('টাৰছিয়েৰি এলকহলে তপত কপাৰত পানী বৰ্জন কৰে।', 'A tertiary alcohol loses water over hot copper.')]
    };
    var st = { a: 'p', o: 'm' };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('এলকহলৰ জাৰণ', 'Oxidation of alcohols') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var r = RES[st.a + '-' + st.o], a = ALC[st.a]; svg.innerHTML = '';
      svg.appendChild(s('rect', { x: 10, y: 30, width: 150, height: 56, rx: 10, style: 'fill:var(--surface-2)' }));
      svg.appendChild(txt(s, 85, 62, 15, 'middle', 'fill:var(--text)', a.f, 700));
      svg.appendChild(txt(s, 215, 52, 11, 'middle', 'fill:var(--muted)', '[O]'));
      svg.appendChild(s('line', { x1: 168, y1: 60, x2: 262, y2: 60, style: 'stroke:var(--text)', 'stroke-width': 2.5 }));
      svg.appendChild(s('polygon', { points: '262,53 276,60 262,67', style: 'fill:var(--text)' }));
      svg.appendChild(s('rect', { x: 280, y: 30, width: 130, height: 56, rx: 10, style: 'fill:' + (r[0].indexOf('no ') === 0 || r[0].indexOf('জাৰণ নহয়') === 0 ? 'var(--surface-2)' : 'var(--brand-soft)') }));
      svg.appendChild(txt(s, 345, 62, r[0].length > 14 ? 10.5 : 14, 'middle', 'fill:var(--text)', r[0], 700));
      svg.appendChild(txt(s, 210, 112, 11, 'middle', 'fill:var(--muted)', OX[st.o]));
      info.innerHTML = '<b>' + a.n + '</b> + ' + OX[st.o] + '<br>→ <b>' + r[1] + '</b><br>' + r[2];
    }
    var as = k.select('Alcohol', opts(ALC, function (v) { return v.n; }), st.a, function (v) { st.a = v; paint(); });
    var os = k.select('Oxidising agent', opts(OX, function (v) { return v; }), st.o, function (v) { st.o = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [as.el, os.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. reactions of phenol (ring positions) */
  A.register('phenol-reactions', function (root, k) {
    var h = k.h, s = k.s;
    var RX = {
      dil: { s: 'dil. HNO₃', n: L('লঘু HNO₃, 298 K', 'dilute HNO₃, 298 K'), pos: { 2: ['NO₂', 0.6], 4: ['NO₂', 1] }, p: L('o- + p-নাইট্ৰ\'ফিনল (বাষ্প পাতনেৰে পৃথক)', 'o- + p-nitrophenol (separated by steam distillation)'), why: L('–OH য়ে অৰ্থ\'-পেৰা স্থান সক্ৰিয় কৰে। o- অন্তঃআণৱিক হাইড্ৰ\'জেন বান্ধনিৰ বাবে উদ্বায়ী।', '–OH activates the ortho and para positions. o- is volatile because of intramolecular hydrogen bonding.') },
      conc: { s: 'conc. HNO₃', n: L('গাঢ় HNO₃', 'concentrated HNO₃'), pos: { 2: ['NO₂', 1], 4: ['NO₂', 1], 6: ['NO₂', 1] }, p: L('2,4,6-ট্ৰাইনাইট্ৰ\'ফিনল (পিক্ৰিক এছিড)', '2,4,6-trinitrophenol (picric acid)'), why: L('তিনিওটা অৰ্থ\'-পেৰা স্থান প্ৰতিস্থাপিত।', 'All three ortho/para positions are substituted.') },
      brcs: { s: 'Br₂ / CS₂', n: L('Br₂ in CS₂, 273 K', 'Br₂ in CS₂, 273 K'), pos: { 2: ['Br', 0.5], 4: ['Br', 1] }, p: L('p-ব্ৰ\'ম\'ফিনল (মুখ্য) + o- (গৌণ)', 'p-bromophenol (major) + o- (minor)'), why: L('কম ধ্ৰুৱীয় দ্ৰাৱক আৰু নিম্ন উষ্ণতাত মন\'ব্ৰ\'ম\'ফিনল।', 'In a less polar solvent at low temperature, the monobromophenol forms.') },
      brw: { s: 'Br₂ / H₂O', n: L('ব্ৰ\'মিন পানী', 'bromine water'), pos: { 2: ['Br', 1], 4: ['Br', 1], 6: ['Br', 1] }, p: L('2,4,6-ট্ৰাইব্ৰ\'ম\'ফিনল (বগা অধঃক্ষেপ)', '2,4,6-tribromophenol (white precipitate)'), why: L('লুইছ এছিড নালাগে — –OH য়ে চক্ৰ অতি সক্ৰিয় কৰে।', 'No Lewis acid is needed — –OH makes the ring very reactive.') },
      kol: { s: 'NaOH; CO₂; H⁺', n: L('NaOH; CO₂; H⁺ (ক\'লবৰ বিক্ৰিয়া)', 'NaOH; CO₂; H⁺ (Kolbe)'), pos: { 2: ['COOH', 1] }, p: L('ছেলিছাইলিক এছিড (2-হাইড্ৰক্সিবেনজয়িক এছিড)', 'salicylic acid (2-hydroxybenzoic acid)'), why: L('ফিনক্সাইড আয়নে CO₂ ক অৰ্থ\' স্থানত আক্ৰমণ কৰে।', 'The phenoxide attacks CO₂ at the ortho position.') },
      rt: { s: 'CHCl₃ / NaOH', n: L('CHCl₃ + জলীয় NaOH (ৰাইমাৰ-টাইমেন)', 'CHCl₃ + aq. NaOH (Reimer–Tiemann)'), pos: { 2: ['CHO', 1] }, p: L('ছেলিছাইলেলডিহাইড', 'salicylaldehyde'), why: L('মধ্যৱৰ্তী –CHCl₂ যৌগ জল-অপঘটিত হৈ –CHO।', 'The intermediate –CHCl₂ compound is hydrolysed to –CHO.') },
      zn: { s: 'Zn, heat', n: L('Zn গুড়ি, তাপ', 'Zn dust, heat'), pos: { 1: ['—', 1] }, p: L('বেনজিন + ZnO (–OH আতৰে)', 'benzene + ZnO (–OH is removed)'), why: L('জিংকে ফিনলৰ অক্সিজেন আতৰাই বিজাৰিত কৰে।', 'Zinc removes the oxygen of phenol (reduction).') },
      ox: { s: 'Na₂Cr₂O₇', n: L('Na₂Cr₂O₇ / H₂SO₄', 'Na₂Cr₂O₇ / H₂SO₄'), pos: { 4: ['=O', 1] }, p: L('বেনজ\'কুইন\'ন (1,4-ডাইকিট\'ন)', 'benzoquinone (1,4-diketone)'), why: L('ফিনলৰ জাৰণ — বায়ুতো লাহে লাহে কুইন\'ন হয়।', 'Oxidation of phenol — in air it slowly gives quinones.') }
    };
    var st = { r: 'dil' };
    var svg = s('svg', { viewBox: '0 0 420 230', 'class': 'anim-svg', role: 'img', 'aria-label': L('ফিনলৰ বিক্ৰিয়া আৰু প্ৰতিস্থাপনৰ স্থান', 'Reactions of phenol and positions of substitution') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var rx = RX[st.r]; svg.innerHTML = '';
      var cx = 140, cy = 115, R = 52, pts = [];
      for (var i = 0; i < 6; i++) { var a = -Math.PI / 2 + i * TAU / 6; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a), a]); }
      svg.appendChild(s('polygon', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 2.5 }));
      svg.appendChild(s('circle', { cx: cx, cy: cy, r: R * 0.6, fill: 'none', style: 'stroke:var(--text)', 'stroke-width': 1.5 }));
      function sub(idx, label, color, op) {
        var p = pts[idx], x = cx + (R + 36) * Math.cos(p[2]), y = cy + (R + 36) * Math.sin(p[2]);
        svg.appendChild(s('line', { x1: p[0], y1: p[1], x2: x, y2: y, style: 'stroke:var(--text)', 'stroke-width': 2, opacity: op }));
        svg.appendChild(s('circle', { cx: x, cy: y, r: 17, style: 'fill:' + color, opacity: op }));
        svg.appendChild(txt(s, x, y + 4, label.length > 3 ? 9 : 11, 'middle', 'fill:#fff', label, 700));
      }
      sub(0, 'OH', 'var(--proton)', 1);
      Object.keys(rx.pos).forEach(function (n) {
        var d = rx.pos[n], idx = +n === 1 ? -1 : +n - 1;
        if (idx >= 0) sub(idx, d[0], 'var(--electron)', d[1] === 1 ? 1 : 0.55);
      });
      svg.appendChild(txt(s, 270, 80, 11, 'start', 'fill:var(--muted)', L('বিকাৰক', 'reagent')));
      svg.appendChild(txt(s, 270, 98, 12, 'start', 'fill:var(--text)', rx.s, 700));
      svg.appendChild(txt(s, 270, 130, 11, 'start', 'fill:var(--muted)', L('(ফিকা = গৌণ উৎপাদ)', '(faded = minor product)')));
      info.innerHTML = '<b>' + rx.n + '</b> → <b>' + rx.p + '</b><br>' + rx.why;
    }
    var sel = k.select('Reagent', opts(RX, function (v) { return v.n; }), st.r, function (v) { st.r = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. Williamson synthesis */
  A.register('williamson', function (root, k) {
    var h = k.h, s = k.s;
    var C = {
      a: { al: 'CH₃CH₂ONa', hl: 'CH₃Br', hc: L('মিথাইল', 'methyl'), p: L('ইথাইল মিথাইল ইথাৰ (মিথক্সিইথেন)', 'ethyl methyl ether (methoxyethane)'), eth: 95, why: L('মিথাইল/প্ৰাইমাৰি হেলাইডত SN2 সহজ — ইথাৰ।', 'SN2 is easy on a methyl/primary halide — the ether forms.') },
      b: { al: 'CH₃ONa', hl: '(CH₃)₃C–Br', hc: L('টাৰছিয়েৰি', 'tertiary'), p: L('2-মিথাইলপ্ৰপিন (এলকিন)', '2-methylpropene (alkene)'), eth: 5, why: L('টাৰছিয়েৰিত ষ্টেৰিক বাধা; এলকক্সাইডে ক্ষাৰক হিচাপে অপসাৰণ ঘটায়।', 'Steric hindrance at the tertiary carbon; the alkoxide acts as a base and causes elimination.') },
      c: { al: '(CH₃)₃C–ONa', hl: 'CH₃CH₂Cl', hc: L('প্ৰাইমাৰি', 'primary'), p: L('ইথাইল টাৰছিয়েৰি-বিউটাইল ইথাৰ', 'ethyl tert-butyl ether'), eth: 95, why: L('ডাঙৰ এলকক্সাইড আৰু প্ৰাইমাৰি হেলাইড — ইথাৰ প্ৰস্তুতিৰ সঠিক সংযোগ।', 'Bulky alkoxide with a primary halide — the correct combination for this ether.') },
      d: { al: 'C₆H₅ONa', hl: 'CH₃I', hc: L('মিথাইল', 'methyl'), p: L('এনিছ\'ল (মিথাইল ফিনাইল ইথাৰ)', 'anisole (methyl phenyl ether)'), eth: 95, why: L('ফিনক্সাইডৰ পৰাও ইথাৰ প্ৰস্তুত কৰিব পাৰি।', 'Ethers can be made from a phenoxide as well.') },
      e: { al: 'CH₃CH₂ONa', hl: '(CH₃)₂CH–Br', hc: L('ছেকেণ্ডাৰি', 'secondary'), p: L('প্ৰপিন (মুখ্য) + আইছ\'প্ৰপাইল ইথাইল ইথাৰ', 'propene (major) + isopropyl ethyl ether'), eth: 20, why: L('ছেকেণ্ডাৰি হেলাইডত অপসাৰণ প্ৰতিযোগিতা বেছি।', 'Elimination competes strongly with a secondary halide.') }
    };
    var st = { c: 'a' };
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L('উইলিয়ামছন সংশ্লেষণ', 'Williamson synthesis') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = C[st.c]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 28, 15, 'middle', 'fill:var(--text)', c.al + '  +  ' + c.hl, 700));
      svg.appendChild(txt(s, 210, 46, 11, 'middle', 'fill:var(--muted)', L('এলকাইল হেলাইড: ', 'alkyl halide: ') + c.hc));
      svg.appendChild(txt(s, 210, 72, 13, 'middle', 'fill:var(--muted)', '↓'));
      svg.appendChild(txt(s, 210, 92, 12, 'middle', 'fill:var(--text)', c.p, 700));
      svg.appendChild(s('rect', { x: 30, y: 110, width: 360, height: 18, rx: 4, style: 'fill:var(--electron)' }));
      svg.appendChild(s('rect', { x: 30, y: 110, width: 360 * c.eth / 100, height: 18, rx: 4, style: 'fill:var(--brand)' }));
      svg.appendChild(txt(s, 30, 148, 11, 'start', 'fill:var(--brand)', L('ইথাৰ (SN2) ', 'ether (SN2) ') + c.eth + ' %', 700));
      svg.appendChild(txt(s, 390, 148, 11, 'end', 'fill:var(--electron)', L('এলকিন (E2) ', 'alkene (E2) ') + (100 - c.eth) + ' %', 700));
      info.innerHTML = '<b>' + c.p + '</b><br>' + c.why + '<br><span class="en">' + L('(শতাংশবোৰ গুণগত ধাৰণা দিবলৈ আনুমানিক।)', '(Percentages are approximate, to show the trend.)') + '</span>';
    }
    var sel = k.select('Combination', opts(C, function (v) { return v.al + ' + ' + v.hl; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });
})();
