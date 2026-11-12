/* Animations for Class 12, Chapter 8: Aldehydes, Ketones and Carboxylic Acids (এলডিহাইড, কিট\'ন আৰু কাৰ্বক্সিলিক এছিড).
   Registered: nu-addition, carbonyl-reactivity, carbonyl-derivs, carbonyl-tests, aldol-cannizzaro, acid-pka, esterification
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  function opts(obj, fn) { return Object.keys(obj).map(function (key) { return { value: key, label: fn(obj[key], key) }; }); }

  /* ================================================================== 1. mechanism of nucleophilic addition */
  A.register('nu-addition', function (root, k) {
    var h = k.h, s = k.s;
    var CAR = { f: { f: 'HCHO', n: L('ফৰ্মেলডিহাইড', 'formaldehyde'), r: ['H', 'H'] }, a: { f: 'CH₃CHO', n: L('এচিটালডিহাইড', 'acetaldehyde'), r: ['CH₃', 'H'] }, k: { f: 'CH₃COCH₃', n: L('এছিট\'ন', 'acetone'), r: ['CH₃', 'CH₃'] } };
    var NU = { cn: { f: 'CN⁻', l: 'CN' }, h: { f: 'H⁻ (NaBH₄)', l: 'H' }, m: { f: 'CH₃⁻ (CH₃MgBr)', l: 'CH₃' } };
    var NAMES = {
      'f-cn': ['HOCH₂CN', L('ছায়েন\'হাইড্ৰিন', 'cyanohydrin')], 'a-cn': ['CH₃CH(OH)CN', L('ছায়েন\'হাইড্ৰিন', 'cyanohydrin')], 'k-cn': ['(CH₃)₂C(OH)CN', L('ছায়েন\'হাইড্ৰিন', 'cyanohydrin')],
      'f-h': ['CH₃OH', L('প্ৰাইমাৰি এলকহল (মিথানল)', 'primary alcohol (methanol)')], 'a-h': ['CH₃CH₂OH', L('প্ৰাইমাৰি এলকহল (ইথানল)', 'primary alcohol (ethanol)')], 'k-h': ['CH₃CH(OH)CH₃', L('ছেকেণ্ডাৰি এলকহল (প্ৰপেন-2-অল)', 'secondary alcohol (propan-2-ol)')],
      'f-m': ['CH₃CH₂OH', L('প্ৰাইমাৰি এলকহল (ইথানল)', 'primary alcohol (ethanol)')], 'a-m': ['CH₃CH(OH)CH₃', L('ছেকেণ্ডাৰি এলকহল (প্ৰপেন-2-অল)', 'secondary alcohol (propan-2-ol)')], 'k-m': ['(CH₃)₃C–OH', L('টাৰছিয়েৰি এলকহল (2-মিথাইলপ্ৰপেন-2-অল)', 'tertiary alcohol (2-methylpropan-2-ol)')]
    };
    var st = { c: 'a', n: 'cn', step: 0 };
    var svg = s('svg', { viewBox: '0 0 420 220', 'class': 'anim-svg', role: 'img', 'aria-label': L('নিউক্লিঅ\'ফীলীয় যোজনৰ ক্ৰিয়াবিধি', 'Mechanism of nucleophilic addition') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function atom(x, y, r, color, label, tcol) { svg.appendChild(s('circle', { cx: x, cy: y, r: r, style: 'fill:' + color })); svg.appendChild(txt(s, x, y + 4, label.length > 2 ? 9 : 11, 'middle', 'fill:' + (tcol || '#fff'), label, 700)); }
    function bond(x1, y1, x2, y2, dash, w) { svg.appendChild(s('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:var(--text)', 'stroke-width': w || 2, 'stroke-dasharray': dash || '' })); }
    function paint() {
      var c = CAR[st.c], n = NU[st.n]; svg.innerHTML = '';
      var cx = 200, cy = 120;
      if (st.step === 0) {
        bond(cx, cy, cx - 52, cy - 30); bond(cx, cy, cx - 52, cy + 30); bond(cx, cy, cx + 52, cy, '', 2); bond(cx, cy - 4, cx + 52, cy - 4, '', 2);
        atom(cx - 52, cy - 30, 14, '#7a8795', c.r[0]); atom(cx - 52, cy + 30, 14, '#7a8795', c.r[1]); atom(cx + 56, cy - 2, 14, 'var(--proton)', 'O');
        svg.appendChild(s('line', { x1: cx, y1: 28, x2: cx, y2: cy - 18, style: 'stroke:var(--electron)', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }));
        atom(cx, 22, 16, 'var(--electron)', n.l);
        svg.appendChild(txt(s, cx + 24, 24, 10, 'start', 'fill:var(--muted)', 'Nu⁻ ' + L('(সমতলৰ লম্বভাৱে)', '(⊥ to the plane)')));
        svg.appendChild(txt(s, cx - 8, cy + 8, 11, 'end', 'fill:var(--text)', 'δ⁺', 700)); svg.appendChild(txt(s, cx + 76, cy - 14, 11, 'start', 'fill:var(--text)', 'δ⁻', 700));
      } else {
        var withH = st.step === 2;
        bond(cx, cy, cx - 46, cy + 20); bond(cx, cy, cx + 46, cy + 20); bond(cx, cy, cx, cy - 46); bond(cx, cy, cx + 8, cy + 60);
        atom(cx - 50, cy + 22, 14, '#7a8795', c.r[0]); atom(cx + 50, cy + 22, 14, '#7a8795', c.r[1]); atom(cx, cy - 52, 16, 'var(--electron)', n.l);
        atom(cx + 10, cy + 66, 15, 'var(--proton)', withH ? 'OH' : 'O⁻');
        if (withH) { svg.appendChild(txt(s, cx + 40, cy + 98, 11, 'start', 'fill:var(--muted)', '+ H⁺ (' + L('মাধ্যমৰ পৰা', 'from the medium') + ')')); }
      }
      atom(cx, cy, 11, 'var(--text)', 'C', 'var(--canvas)');
      var hyb = st.step === 0 ? L('sp² (সমতলীয়, 120°)', 'sp² (planar, 120°)') : L('sp³ (চতুৰ্ফলকীয়, ≈ 109.5°)', 'sp³ (tetrahedral, ≈ 109.5°)');
      var what = st.step === 0 ? L('<b>বিক্ৰিয়ক:</b> নিউক্লিঅ\'ফাইলে ইলেক্ট্ৰ\'ফীলীয় কাৰ্বনক আক্ৰমণ কৰিবলৈ ওচৰ চাপিছে।', '<b>Reactants:</b> the nucleophile approaches the electrophilic carbon.') :
        (st.step === 1 ? L('<b>খাপ ১ (লেহেমীয়া):</b> C=O ৰ π বান্ধনি ভাঙি চতুৰ্ফলকীয় এলকক্সাইড মধ্যৱৰ্তী।', '<b>Step 1 (slow):</b> the C=O π bond breaks to give a tetrahedral alkoxide intermediate.') :
          L('<b>খাপ ২ (দ্ৰুত):</b> এলকক্সাইডে H⁺ লয় — প্ৰশম যোজিত উৎপাদ।', '<b>Step 2 (fast):</b> the alkoxide takes H⁺ — the neutral addition product.'));
      info.innerHTML = what + '<br>' + L('কাৰ্বনৰ সংকৰণ: ', 'Carbon: ') + '<b>' + hyb + '</b><br>' + c.f + ' + ' + n.f + ' → <b>' + NAMES[st.c + '-' + st.n][0] + '</b> (' + NAMES[st.c + '-' + st.n][1] + ')';
    }
    var cs = k.select('Carbonyl compound', opts(CAR, function (v) { return v.f + ' — ' + v.n; }), st.c, function (v) { st.c = v; st.step = 0; paint(); });
    var ns = k.select('Nucleophile', opts(NU, function (v) { return v.f; }), st.n, function (v) { st.n = v; st.step = 0; paint(); });
    var nx = k.button('Next step', function () { st.step = (st.step + 1) % 3; paint(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [cs.el, ns.el, nx]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. relative reactivity of carbonyl compounds */
  A.register('carbonyl-reactivity', function (root, k) {
    var h = k.h, s = k.s;
    var CMP = [
      ['f', 'HCHO', L('ফৰ্মেলডিহাইড', 'formaldehyde'), 100, L('দুয়োটা H — ষ্টেৰিক বাধা নাই, ইলেক্ট্ৰ\'ফীলিছিটি সৰ্বাধিক।', 'Two H — no steric hindrance, highest electrophilicity.')],
      ['a', 'CH₃CHO', L('এচিটালডিহাইড', 'acetaldehyde'), 70, L('এটা CH₃ আৰু এটা H।', 'One CH₃ and one H.')],
      ['p', 'CH₃CH₂CHO', L('প্ৰপানেল', 'propanal'), 60, L('অলপ বেছি আকাৰৰ থূপ।', 'A slightly larger group.')],
      ['b', 'C₆H₅CHO', L('বেনজেলডিহাইড', 'benzaldehyde'), 30, L('ফিনাইল মূলকৰ সৈতে সংস্পন্দনে কাৰ্বনিলৰ ধ্ৰুৱীয়তা কমায় — প্ৰপানেলতকৈ কম সক্ৰিয়।', 'Resonance with the phenyl ring reduces the polarity of the carbonyl group — less reactive than propanal.')],
      ['k', 'CH₃COCH₃', L('এছিট\'ন', 'acetone'), 25, L('দুটা CH₃ — ষ্টেৰিক বাধা আৰু ইলেক্ট্ৰন ত্যাগ।', 'Two CH₃ — steric hindrance and electron release.')],
      ['m', 'CH₃COC₂H₅', L('বিউটান\'ন', 'butanone'), 18, L('বেছি ডাঙৰ এলকাইল থূপ।', 'A larger alkyl group.')],
      ['ap', 'C₆H₅COCH₃', L('এচিট\'ফিনন', 'acetophenone'), 8, L('ফিনাইল আৰু মিথাইল — বাধা আৰু সংস্পন্দন দুয়ো।', 'Phenyl and methyl — hindrance and resonance both.')],
      ['bp', 'C₆H₅COC₆H₅', L('বেনজ\'ফিনন', 'benzophenone'), 3, L('দুটা ফিনাইল — আটাইতকৈ কম সক্ৰিয়।', 'Two phenyl groups — the least reactive.')]
    ];
    var st = { c: 'k' };
    var svg = s('svg', { viewBox: '0 0 420 250', 'class': 'anim-svg', role: 'img', 'aria-label': L('কাৰ্বনিল যৌগৰ আপেক্ষিক সক্ৰিয়তা', 'Relative reactivity of carbonyl compounds') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('নিউক্লিঅ\'ফীলীয় যোজনত আপেক্ষিক সক্ৰিয়তা (শিক্ষণীয় মান)', 'Relative reactivity in nucleophilic addition (illustrative values)')));
      CMP.forEach(function (c, i) {
        var y = 26 + i * 27, on = c[0] === st.c;
        svg.appendChild(txt(s, 118, y + 14, 11, 'end', 'fill:var(--text)', c[1], on ? 700 : 400));
        svg.appendChild(s('rect', { x: 124, y: y, width: 250, height: 19, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 124, y: y, width: Math.max(2, 250 * c[3] / 100), height: 19, rx: 3, style: 'fill:' + (on ? 'var(--proton)' : (c[1].indexOf('CHO') >= 0 ? 'var(--electron)' : 'var(--alpha)')) + ';opacity:' + (on ? 1 : .7) }));
        svg.appendChild(txt(s, 380, y + 14, 11, 'start', 'fill:var(--text)', String(c[3]), on ? 700 : 400));
      });
      var cur = CMP.filter(function (c) { return c[0] === st.c; })[0];
      info.innerHTML = '<b>' + cur[1] + '</b> (' + cur[2] + ')<br>' + cur[4] + '<br>' + L('ক্ৰম: HCHO > এলডিহাইড > কিট\'ন; এৰ\'মেটিক যৌগ কম সক্ৰিয় (সংস্পন্দন)। শতাংশবোৰ ধাৰা দেখুৱাবলৈ আনুমানিক।', 'Order: HCHO > aldehydes > ketones; aromatic compounds are less reactive (resonance). The numbers are approximate, only to show the trend.');
    }
    var sel = k.select('Compound', CMP.map(function (c) { return { value: c[0], label: c[1] + ' — ' + c[2] }; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. reaction with H2N-Z */
  A.register('carbonyl-derivs', function (root, k) {
    var h = k.h, s = k.s;
    var CAR = { a: ['CH₃CHO', L('ইথানেল', 'ethanal'), 'CH₃CH'], k: ['CH₃COCH₃', L('প্ৰপান\'ন', 'propanone'), '(CH₃)₂C'], b: ['C₆H₅CHO', L('বেনজেলডিহাইড', 'benzaldehyde'), 'C₆H₅CH'] };
    var RG = {
      n: ['NH₃', 'H', L('ইমাইন', 'imine'), L('বৰ্ণহীন', 'colourless'), '#e9eef0'],
      r: ['RNH₂', 'R', L('প্ৰতিস্থাপিত ইমাইন (শ্বিফ ক্ষাৰক)', 'substituted imine (Schiff base)'), L('বৰ্ণহীন', 'colourless'), '#e9eef0'],
      o: ['NH₂OH', 'OH', L('অক্সাইম', 'oxime'), L('বগা কঠিন', 'white solid'), '#ffffff'],
      h: ['NH₂NH₂', 'NH₂', L('হাইড্ৰাজ\'ন', 'hydrazone'), L('বৰ্ণহীন', 'colourless'), '#e9eef0'],
      p: ['C₆H₅NHNH₂', 'NHC₆H₅', L('ফিনাইলহাইড্ৰাজ\'ন', 'phenylhydrazone'), L('হালধীয়া কঠিন', 'yellow solid'), '#f6e27a'],
      d: [L('2,4-DNP (2,4-ডাইনাইট্ৰ\'ফিনাইলহাইড্ৰাজিন)', '2,4-DNP (2,4-dinitrophenylhydrazine)'), 'NHC₆H₃(NO₂)₂', L('2,4-DNP ব্যুৎপন্ন', '2,4-DNP derivative'), L('কমলা-ৰঙা কঠিন', 'orange-red solid'), '#ee7a2a'],
      s: ['NH₂CONHNH₂', 'NHCONH₂', L('ছেমিকাৰ্বাজ\'ন', 'semicarbazone'), L('বগা কঠিন', 'white solid'), '#ffffff']
    };
    var st = { c: 'a', r: 'd' };
    var svg = s('svg', { viewBox: '0 0 420 130', 'class': 'anim-svg', role: 'img', 'aria-label': L('কাৰ্বনিল যৌগ আৰু H₂N–Z', 'Carbonyl compounds and H₂N–Z') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = CAR[st.c], r = RG[st.r]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 34, 15, 'middle', 'fill:var(--text)', c[0] + '  +  H₂N–Z', 700));
      svg.appendChild(txt(s, 210, 58, 13, 'middle', 'fill:var(--muted)', '↓  H⁺, −H₂O'));
      svg.appendChild(txt(s, 210, 86, 15, 'middle', 'fill:var(--text)', c[2] + '=N–' + r[1], 700));
      svg.appendChild(s('circle', { cx: 50, cy: 90, r: 20, style: 'fill:' + r[4] + ';stroke:var(--muted)', 'stroke-width': 1.5 }));
      svg.appendChild(txt(s, 50, 124, 10, 'middle', 'fill:var(--muted)', r[3]));
      info.innerHTML = '<b>' + c[1] + '</b> + ' + r[0] + ' → <b>' + c[1] + ' ' + r[2] + '</b> (' + r[3] + ')<br>' + L('>C=O + H₂N–Z ⇌ >C=N–Z + H₂O। এছিড অনুঘটক; মধ্যৱৰ্তী C(OH)NHZ দ্ৰুত নিৰ্জলীকৃত হয়।', '>C=O + H₂N–Z ⇌ >C=N–Z + H₂O. Acid-catalysed; the intermediate C(OH)NHZ dehydrates quickly.') +
        (st.r === 'd' ? '<br>' + L('2,4-DNP ব্যুৎপন্ন ৰঙীন, কঠিন — কাৰ্বনিল মূলক চিনাক্তকৰণত উপযোগী।', 'The 2,4-DNP derivative is a coloured solid — useful for identifying a carbonyl group.') : '');
    }
    var cs = k.select('Carbonyl compound', opts(CAR, function (v) { return v[0] + ' — ' + v[1]; }), st.c, function (v) { st.c = v; paint(); });
    var rs = k.select('Reagent H₂N–Z', opts(RG, function (v) { return v[0]; }), st.r, function (v) { st.r = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [cs.el, rs.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. Tollens / Fehling / iodoform */
  A.register('carbonyl-tests', function (root, k) {
    var h = k.h, s = k.s, prog = 0, running = false;
    var CMP = {
      f: { n: 'HCHO', t: 1, f: 1, i: 0 }, a: { n: 'CH₃CHO', t: 1, f: 1, i: 1 }, p: { n: 'CH₃CH₂CHO', t: 1, f: 1, i: 0 },
      b: { n: 'C₆H₅CHO', t: 1, f: 0, i: 0 }, k: { n: 'CH₃COCH₃', t: 0, f: 0, i: 1 }, ap: { n: 'C₆H₅COCH₃', t: 0, f: 0, i: 1 }, bp: { n: 'C₆H₅COC₆H₅', t: 0, f: 0, i: 0 }
    };
    var TEST = {
      t: { n: L('টলেনছৰ বিকাৰক [Ag(NH₃)₂]⁺', "Tollens' reagent [Ag(NH₃)₂]⁺"), key: 't', pos: L('ছিলভাৰ দাপোণ', 'silver mirror'), neg: L('পৰিবৰ্তন নাই', 'no change'), why: L('এলডিহাইড (এৰ\'মেটিকো) জাৰিত হৈ Ag⁺ ক Ag লৈ বিজাৰিত কৰে; কিট\'নে নকৰে।', 'Aldehydes (aromatic too) are oxidised and reduce Ag⁺ to Ag; ketones do not.') },
      f: { n: L('ফেলিঙৰ বিকাৰক (Cu²⁺, ক্ষাৰীয়)', "Fehling's reagent (Cu²⁺, alkaline)"), key: 'f', pos: L('ৰঙা-মুগা Cu₂O অধঃক্ষেপ', 'red-brown Cu₂O precipitate'), neg: L('নীলা দ্ৰৱ অপৰিৱৰ্তিত', 'blue solution unchanged'), why: L('কেৱল অ্যালিফেটিক এলডিহাইডে; বেনজেলডিহাইড আৰু কিট\'নে নিদিয়ে।', 'Only aliphatic aldehydes; benzaldehyde and ketones do not respond.') },
      i: { n: L('NaOI (I₂ + NaOH) — আয়\'ডফৰ্ম', 'NaOI (I₂ + NaOH) — iodoform'), key: 'i', pos: L('হালধীয়া CHI₃ অধঃক্ষেপ', 'yellow CHI₃ precipitate'), neg: L('অধঃক্ষেপ নাই', 'no precipitate'), why: L('CH₃CO– (বা CH₃CH(OH)–) মূলকযুক্ত যৌগে — ইথানেল, কিট\'ন (মিথাইল কিট\'ন)।', 'Compounds with a CH₃CO– (or CH₃CH(OH)–) group — ethanal and methyl ketones.') }
    };
    var st = { c: 'a', t: 't' };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('এলডিহাইড আৰু কিট\'নৰ পৰীক্ষা', 'Tests for aldehydes and ketones') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = CMP[st.c], t = TEST[st.t], pos = !!c[t.key]; svg.innerHTML = '';
      var x = 150, y = 24, w = 120, hh = 130;
      var liquid = st.t === 'f' ? '#5aa9e6' : (st.t === 't' ? '#e8eef2' : '#c98a3c');
      svg.appendChild(s('rect', { x: x, y: y, width: w, height: hh, rx: 14, style: 'fill:#cfe8ff;opacity:.35;stroke:var(--muted)', 'stroke-width': 2 }));
      svg.appendChild(s('rect', { x: x + 3, y: y + 40, width: w - 6, height: hh - 43, rx: 11, style: 'fill:' + liquid + ';opacity:.75' }));
      if (pos) {
        var a = clamp(prog, 0, 1);
        if (st.t === 't') {
          svg.appendChild(s('rect', { x: x + 3, y: y + 40, width: 8, height: (hh - 43) * a, rx: 3, style: 'fill:#c9ced6;opacity:.95' }));
          svg.appendChild(s('rect', { x: x + w - 11, y: y + 40, width: 8, height: (hh - 43) * a, rx: 3, style: 'fill:#c9ced6;opacity:.95' }));
        } else {
          svg.appendChild(s('rect', { x: x + 12, y: y + hh - 3 - 46 * a, width: w - 24, height: 46 * a, rx: 8, style: 'fill:' + (st.t === 'f' ? '#a23b17' : '#f2d21b') + ';opacity:.95' }));
        }
      }
      svg.appendChild(txt(s, 210, 18, 13, 'middle', 'fill:var(--text)', c.n + ' + ' + (st.t === 't' ? 'Tollens' : (st.t === 'f' ? 'Fehling' : 'NaOI')), 700));
      svg.appendChild(txt(s, 210, 176, 13, 'middle', 'fill:' + (pos && prog >= 1 ? 'var(--ok)' : 'var(--muted)'), prog < 1 && running ? '…' : (prog >= 1 ? (pos ? '✔ ' + t.pos : '✘ ' + t.neg) : L('‘Heat’ টিপক', 'press ‘Heat’')), 700));
      info.innerHTML = '<b>' + t.n + '</b><br>' + t.why + '<br>' + (prog >= 1 ? '<b>' + c.n + ':</b> ' + (pos ? t.pos : t.neg) : '');
    }
    function tick(dt) { if (running) { prog = Math.min(1, prog + dt * 0.7); if (prog >= 1) running = false; paint(); } }
    var cs = k.select('Compound', opts(CMP, function (v) { return v.n; }), st.c, function (v) { st.c = v; prog = 0; running = false; paint(); });
    var ts = k.select('Test', opts(TEST, function (v) { return v.n; }), st.t, function (v) { st.t = v; prog = 0; running = false; paint(); });
    var go = k.button('Heat', function () { prog = 0; running = true; }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [cs.el, ts.el, go]));
    root.appendChild(info);
    var lp = k.loop(root, tick);
    paint(); if (k.reduceMotion) { prog = 1; paint(); } else lp.start();
  });

  /* ================================================================== 5. aldol / Cannizzaro */
  A.register('aldol-cannizzaro', function (root, k) {
    var h = k.h, s = k.s;
    var C = {
      f: { n: 'HCHO', al: 0, nm: L('ফৰ্মেলডিহাইড', 'formaldehyde') }, a: { n: 'CH₃CHO', al: 1, nm: L('ইথানেল', 'ethanal') }, p: { n: 'CH₃CH₂CHO', al: 1, nm: L('প্ৰপানেল', 'propanal') },
      k: { n: 'CH₃COCH₃', al: 1, nm: L('প্ৰপান\'ন', 'propanone') }, b: { n: 'C₆H₅CHO', al: 0, nm: L('বেনজেলডিহাইড', 'benzaldehyde') }, t: { n: '(CH₃)₃CCHO', al: 0, nm: L('2,2-ডাইমিথাইলপ্ৰপানেল', '2,2-dimethylpropanal') }
    };
    var ALDOL = { a: ['CH₃CH(OH)CH₂CHO', L('3-হাইড্ৰক্সিবিউটানেল (এলডল)', '3-hydroxybutanal (aldol)'), 'CH₃CH=CHCHO', L('বিউট-2-ইনেল', 'but-2-enal')],
      p: ['CH₃CH₂CH(OH)CH(CH₃)CHO', L('3-হাইড্ৰক্সি-2-মিথাইলপেণ্টানেল', '3-hydroxy-2-methylpentanal'), 'CH₃CH₂CH=C(CH₃)CHO', L('2-মিথাইলপেণ্ট-2-ইনেল', '2-methylpent-2-enal')],
      k: ['(CH₃)₂C(OH)CH₂COCH₃', L('4-হাইড্ৰক্সি-4-মিথাইলপেণ্টান-2-অ\'ন (কিটল)', '4-hydroxy-4-methylpentan-2-one (ketol)'), '(CH₃)₂C=CHCOCH₃', L('4-মিথাইলপেণ্ট-3-ইন-2-অ\'ন', '4-methylpent-3-en-2-one')] };
    var CAN = { f: ['CH₃OH', 'HCOOK', 'KOH'], b: ['C₆H₅CH₂OH', 'C₆H₅COONa', 'NaOH'], t: ['(CH₃)₃CCH₂OH', '(CH₃)₃CCOONa', 'NaOH'] };
    var st = { x: 'a', y: 'a' };
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L('এলডল ঘনীভৱন আৰু কানিজাৰ\' বিক্ৰিয়া', 'Aldol condensation and Cannizzaro reaction') });
    root.appendChild(svg);
    function result() {
      var x = C[st.x], y = C[st.y], same = st.x === st.y;
      if (x.al && y.al) {
        if (same) { var d = ALDOL[st.x]; return { type: L('এলডল ঘনীভৱন', 'Aldol condensation'), cond: L('লঘু NaOH (বা Ba(OH)₂), তাৰ পিছত তাপ', 'dilute NaOH (or Ba(OH)₂), then heat'), prod: d[0] + ' → ' + d[2], names: d[1] + ' → ' + d[3], note: L('দুয়োটা অণুৰে α-হাইড্ৰ\'জেন আছে — এটাই এনোলেট, আনটোৱে কাৰ্বনিল।', 'Both molecules have α-hydrogens — one gives the enolate, the other the carbonyl.') }; }
        var four = (st.x + st.y === 'ap' || st.x + st.y === 'pa');
        return { type: L('ক্ৰছ এলডল ঘনীভৱন', 'Cross aldol condensation'), cond: L('লঘু NaOH, তাপ', 'dilute NaOH, heat'), prod: four ? L('চাৰিটা উৎপাদ: বিউট-2-ইনেল, 2-মিথাইলপেণ্ট-2-ইনেল, 2-মিথাইলবিউট-2-ইনেল, পেণ্ট-2-ইনেল', 'four products: but-2-enal, 2-methylpent-2-enal, 2-methylbut-2-enal, pent-2-enal') : L('মিশ্ৰ উৎপাদ (প্ৰতিটো যৌগৰ এনোলেট আন যৌগত আক্ৰমণ)', 'a mixture of products (each enolate can attack either compound)'), names: '', note: L('দুয়োটাতে α-হাইড্ৰ\'জেন — উৎপাদৰ মিশ্ৰ পোৱা যায়।', 'Both have α-hydrogens — a mixture of products forms.') };
      }
      if (x.al !== y.al) {
        var ar = x.al ? y : x, al = x.al ? x : y, sp = (ar.n === 'C₆H₅CHO');
        var prod = sp && al.n === 'CH₃CHO' ? 'C₆H₅CH=CHCHO' : (sp && al.n === 'CH₃COCH₃' ? 'C₆H₅CH=CHCOCH₃' : L('এটাই মুখ্য উৎপাদ', 'one main product'));
        var nm = sp && al.n === 'CH₃CHO' ? L('ছিনামেলডিহাইড (3-ফিনাইলপ্ৰপ-2-ইনেল)', 'cinnamaldehyde (3-phenylprop-2-enal)') : (sp && al.n === 'CH₃COCH₃' ? L('বেনজেলএছিট\'ন (4-ফিনাইলবিউট-3-ইন-2-অ\'ন)', 'benzalacetone (4-phenylbut-3-en-2-one)') : '');
        return { type: L('ক্ৰছ এলডল ঘনীভৱন', 'Cross aldol condensation'), cond: L('লঘু NaOH', 'dilute NaOH'), prod: prod, names: nm, note: L('α-H নথকা যৌগে কেৱল কাৰ্বনিলৰ ভূমিকা লয়; সেয়ে এটা মুখ্য উৎপাদ।', 'The compound without α-H can act only as the carbonyl component; hence one main product.') };
      }
      if (same) { var c = CAN[st.x]; return { type: L('কানিজাৰ\' বিক্ৰিয়া', 'Cannizzaro reaction'), cond: L('গাঢ় ক্ষাৰ (' + c[2] + ')', 'concentrated alkali (' + c[2] + ')'), prod: c[0] + '  +  ' + c[1], names: L('এলকহল + কাৰ্বক্সিলেট', 'alcohol + carboxylate'), note: L('α-হাইড্ৰ\'জেন নাই — এটা অণু জাৰিত, আনটো বিজাৰিত (অসমঞ্জস বিক্ৰিয়া)।', 'No α-hydrogen — one molecule is oxidised and the other reduced (disproportionation).') }; }
      return { type: L('ক্ৰছ কানিজাৰ\' বিক্ৰিয়া', 'Crossed Cannizzaro reaction'), cond: L('গাঢ় ক্ষাৰ', 'concentrated alkali'), prod: L('HCHO জাৰিত হয় (ফৰ্মেট), আনটো বিজাৰিত হৈ এলকহল', 'HCHO is oxidised (formate) and the other is reduced to the alcohol'), names: '', note: L('দুয়োটাতে α-H নাই।', 'Neither has an α-hydrogen.') };
    }
    function paint() {
      var x = C[st.x], y = C[st.y], r = result(); svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 28, 15, 'middle', 'fill:var(--text)', x.n + '  +  ' + y.n, 700));
      svg.appendChild(txt(s, 210, 48, 11, 'middle', 'fill:var(--muted)', (x.al ? 'α-H ✔' : 'α-H ✘') + '  ·  ' + (y.al ? 'α-H ✔' : 'α-H ✘')));
      svg.appendChild(s('rect', { x: 20, y: 62, width: 380, height: 28, rx: 8, style: 'fill:var(--brand-soft)' }));
      svg.appendChild(txt(s, 210, 81, 14, 'middle', 'fill:var(--text)', r.type, 700));
      svg.appendChild(txt(s, 210, 112, 11, 'middle', 'fill:var(--muted)', r.cond));
      svg.appendChild(txt(s, 210, 136, r.prod.length > 48 ? 9.5 : 12, 'middle', 'fill:var(--text)', r.prod.length > 80 ? r.prod.slice(0, 80) + '…' : r.prod, 600));
      info.innerHTML = '<b>' + r.type + '</b> — ' + r.cond + '<br>' + r.prod + (r.names ? '<br>' + r.names : '') + '<br>' + r.note;
    }
    var xs = k.select('Compound 1', opts(C, function (v) { return v.n + ' — ' + v.nm; }), st.x, function (v) { st.x = v; paint(); });
    var ys = k.select('Compound 2', opts(C, function (v) { return v.n + ' — ' + v.nm; }), st.y, function (v) { st.y = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [xs.el, ys.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. pKa of carboxylic acids */
  A.register('acid-pka', function (root, k) {
    var h = k.h, s = k.s;
    var CMP = [
      ['tfa', 'CF₃COOH', 0.23, 1], ['tca', 'Cl₃CCOOH', 0.65, 0], ['dca', 'Cl₂CHCOOH', 1.29, 0], ['nac', 'O₂NCH₂COOH', 1.68, 0], ['fac', 'FCH₂COOH', 2.66, 0], ['cac', 'ClCH₂COOH', 2.86, 0],
      ['bac', 'BrCH₂COOH', 2.90, 0], ['for', 'HCOOH', 3.75, 0], ['pnb', L('p-নাইট্ৰ\'বেনজয়িক এছিড', 'p-nitrobenzoic acid'), 3.41, 1], ['ben', L('বেনজয়িক এছিড', 'benzoic acid'), 4.19, 1],
      ['pmb', L('p-মিথক্সিবেনজয়িক এছিড', 'p-methoxybenzoic acid'), 4.46, 1], ['ace', 'CH₃COOH', 4.76, 1], ['pro', 'CH₃CH₂COOH', 4.87, 0]
    ];
    var st = { c: 'cac' };
    var svg = s('svg', { viewBox: '0 0 420 340', 'class': 'anim-svg', role: 'img', 'aria-label': L('কাৰ্বক্সিলিক এছিডৰ pKₐ', 'pKₐ of carboxylic acids') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 14, 11, 'start', 'fill:var(--muted)', L('তীব্ৰ এছিড ←→ মৃদু এছিড (pKₐ কম ←→ বেছি)', 'stronger acid ←→ weaker acid (low pKₐ ←→ high pKₐ)')));
      CMP.forEach(function (c, i) {
        var y = 24 + i * 24, on = c[0] === st.c, w = (c[2] / 5.2) * 190;
        svg.appendChild(txt(s, 165, y + 13, 11, 'end', 'fill:var(--text)', c[1], on ? 700 : 400));
        svg.appendChild(s('rect', { x: 171, y: y, width: 190, height: 17, rx: 3, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 171, y: y, width: Math.max(2, w), height: 17, rx: 3, style: 'fill:' + (on ? 'var(--proton)' : 'var(--electron)') + ';opacity:' + (on ? 1 : .6) }));
        svg.appendChild(txt(s, 367, y + 13, 11, 'start', 'fill:var(--text)', c[2].toFixed(2), on ? 700 : 400));
      });
      var cur = CMP.filter(function (c) { return c[0] === st.c; })[0], ratio = Math.pow(10, 4.76 - cur[2]);
      var big = ratio >= 1000 ? ratio.toExponential(1).replace('e+', ' × 10<sup>') + '</sup>' : String(+ratio.toPrecision(2));
      info.innerHTML = '<b>' + cur[1] + '</b>: pK<sub>a</sub> = <b>' + cur[2].toFixed(2) + '</b><br>' + L('এছেটিক এছিডৰ (4.76) তুলনাত ≈ <b>' + big + '</b> গুণ তীব্ৰ।', 'About <b>' + big + '</b> times as strong as acetic acid (4.76).') +
        '<br>' + L('ইলেক্ট্ৰন আকৰ্ষী মূলকে (F, Cl, NO₂, CF₃) কাৰ্বক্সিলেট আয়ন সুস্থিৰ কৰি pKₐ কমায়; মূলক যিমান ওচৰত আৰু যিমান বেছি, প্ৰভাৱ সিমান বেছি। ইলেক্ট্ৰন ত্যাগী মূলকে (CH₃, OCH₃) অলপ বঢ়ায়।', 'Electron-withdrawing groups (F, Cl, NO₂, CF₃) stabilise the carboxylate ion and lower the pKₐ; the nearer and the more numerous, the stronger the effect. Electron-releasing groups (CH₃, OCH₃) raise it slightly.') +
        (cur[3] ? '' : '<br><span class="en">' + L('(এই মান পাঠ্যপুথিত নাই; সাধাৰণ তথ্য।)', '(This value is not in the textbook; it is a standard literature value.)') + '</span>');
    }
    var sel = k.select('Acid', CMP.map(function (c) { return { value: c[0], label: c[1] }; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. esterification equilibrium */
  A.register('esterification', function (root, k) {
    var h = k.h, s = k.s, K = 4;
    var st = { r: 1, w: 0 };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('এষ্টাৰীকৰণৰ সাম্য', 'The esterification equilibrium') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function solve() {
      /* RCOOH (1 mol) + R'OH (r mol) <=> ester + water; K = x * x(1-f) / ((1-x)(r-x)) */
      var lo = 0, hi = Math.min(1, st.r) - 1e-9, i;
      function g(x) { return x * x * (1 - st.w) - K * (1 - x) * (st.r - x); }
      if (g(hi) < 0) return hi;
      for (i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (g(mid) > 0) hi = mid; else lo = mid; }
      return (lo + hi) / 2;
    }
    function paint() {
      var x = solve(), rows = [[L('এছিড RCOOH', 'acid RCOOH'), 1 - x, 'var(--electron)'], [L('এলকহল R′OH', 'alcohol R′OH'), st.r - x, 'var(--alpha)'], [L('এষ্টাৰ', 'ester'), x, 'var(--brand)'], [L('পানী (বৰ্তমান)', 'water (present)'), x * (1 - st.w), 'var(--muted)']];
      svg.innerHTML = '';
      var maxv = Math.max(1, st.r);
      rows.forEach(function (r, i) {
        var y = 20 + i * 40;
        svg.appendChild(txt(s, 118, y + 14, 12, 'end', 'fill:var(--text)', r[0]));
        svg.appendChild(s('rect', { x: 124, y: y, width: 240, height: 22, rx: 4, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 124, y: y, width: Math.max(1, 240 * r[1] / maxv), height: 22, rx: 4, style: 'fill:' + r[2] }));
        svg.appendChild(txt(s, 370, y + 15, 11, 'start', 'fill:var(--text)', r[1].toFixed(2) + ' mol'));
      });
      info.innerHTML = 'RCOOH + R′OH ⇌ RCOOR′ + H₂O · K<sub>c</sub> ≈ ' + K + '<br>' + L('এষ্টাৰৰ উৎপাদ: ', 'Yield of ester: ') + '<b>' + (x * 100).toFixed(0) + ' %</b> (' + L('1 mol এছিডৰ পৰা', 'from 1 mol of acid') + ')<br>' +
        L('সাম্য উভমুখী। এলকহল বেছি লোৱা বা পানী আতৰোৱাই (লা চেটেলিয়াৰ নীতি) সাম্য সোঁফালে নিয়ে আৰু এষ্টাৰ বঢ়ায়।', 'The equilibrium is reversible. Using excess alcohol or removing water (Le Chatelier) shifts it to the right and raises the ester yield.');
    }
    var rs = k.slider('Alcohol : acid ratio', 0.5, 10, 0.5, st.r, function (v) { st.r = v; paint(); });
    var ws = k.slider('Water removed (%)', 0, 95, 5, 0, function (v) { st.w = v / 100; paint(); });
    var rm = k.button('Remove water', function () { st.w = 0.9; ws.input.value = 90; ws.out.textContent = 90; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [rs.el, ws.el, rm]));
    root.appendChild(info);
    paint();
  });
})();
