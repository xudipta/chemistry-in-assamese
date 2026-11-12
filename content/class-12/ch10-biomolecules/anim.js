/* Animations for Class 12, Chapter 10: Biomolecules (জীৱঅণু).
   Registered: carb-classes, glucose-ring, amino-zwitter, peptide-chain, protein-levels, vitamin-guide, dna-pairing
   Controls are English (app UI); read-outs follow the reader's language: L('assamese', 'english'). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;   /* L(assamese, english): the string for the reader's language */
  function txt(s, x, y, size, anchor, style, text, weight) {
    return s('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start', 'font-weight': weight || 400, style: style || 'fill:var(--text)', text: text });
  }
  function opts(obj, fn) { return Object.keys(obj).map(function (key) { return { value: key, label: fn(obj[key], key) }; }); }

  /* ================================================================== 1. carbohydrate classes */
  A.register('carb-classes', function (root, k) {
    var h = k.h, s = k.s;
    var C = {
      glu: ['C₆H₁₂O₆', L('গ্লুক\'জ', 'glucose'), L('মন\'ছেকাৰাইড (এলড\'হেক্স\'জ)', 'monosaccharide (aldohexose)'), 1, '—', 1, L('পকা আঙুৰ, মৌ', 'ripe grapes, honey')],
      fru: ['C₆H₁₂O₆', L('ফ্ৰুক্ট\'জ', 'fructose'), L('মন\'ছেকাৰাইড (কিট\'হেক্স\'জ)', 'monosaccharide (ketohexose)'), 1, '—', 1, L('ফল, মৌ — আটাইতকৈ মিঠা', 'fruits, honey — the sweetest')],
      suc: ['C₁₂H₂₂O₁₁', L('ছুক্ৰ\'জ', 'sucrose'), L('ডাইছেকাৰাইড', 'disaccharide'), 2, L('α-D-গ্লুক\'জ C1 – β-D-ফ্ৰুক্ট\'জ C2', 'α-D-glucose C1 – β-D-fructose C2'), 0, L('ইক্ষু, বীট (ইক্ষু শৰ্কৰা)', 'sugar cane, beet (cane sugar)')],
      mal: ['C₁₂H₂₂O₁₁', L('মল্ট\'জ', 'maltose'), L('ডাইছেকাৰাইড', 'disaccharide'), 2, L('α-D-গ্লুক\'জ C1 – গ্লুক\'জ C4 (α-1,4)', 'α-D-glucose C1 – glucose C4 (α-1,4)'), 1, L('অংকুৰিত শস্য, ষ্টাৰ্চৰ জল-বিশ্লেষণ', 'germinating grain, hydrolysis of starch')],
      lac: ['C₁₂H₂₂O₁₁', L('লেক্ট\'জ', 'lactose'), L('ডাইছেকাৰাইড', 'disaccharide'), 2, L('β-D-গেলেক্ট\'জ C1 – গ্লুক\'জ C4 (β-1,4)', 'β-D-galactose C1 – glucose C4 (β-1,4)'), 1, L('গাখীৰ (গাখীৰৰ শৰ্কৰা)', 'milk (milk sugar)')],
      sta: ['(C₆H₁₀O₅)ₙ', L('ষ্টাৰ্চ', 'starch'), L('পলিছেকাৰাইড', 'polysaccharide'), 'n', L('α-গ্লুক\'জ: C1–C4 (এমাইল\'জ); C1–C4 + C1–C6 (এমাইল\'পেক্টিন)', 'α-glucose: C1–C4 (amylose); C1–C4 + C1–C6 (amylopectin)'), 0, L('ধান, ঘেহুঁ, আলু', 'rice, wheat, potato')],
      cel: ['(C₆H₁₀O₅)ₙ', L('চেলুল\'জ', 'cellulose'), L('পলিছেকাৰাইড', 'polysaccharide'), 'n', L('β-D-গ্লুক\'জ: C1–C4 (β)', 'β-D-glucose: C1–C4 (β)'), 0, L('উদ্ভিদৰ কোষ-দেৱাল, কপাহ', 'plant cell wall, cotton')],
      gly: ['(C₆H₁₀O₅)ₙ', L('গ্লাইক\'জেন', 'glycogen'), L('পলিছেকাৰাইড', 'polysaccharide'), 'n', L('α-গ্লুক\'জ; এমাইল\'পেক্টিনতকৈ বেছি শাখা', 'α-glucose; more branched than amylopectin'), 0, L('যকৃত, পেশী, মগজু (প্ৰাণীজ ষ্টাৰ্চ)', 'liver, muscle, brain (animal starch)')]
    };
    var st = { c: 'suc' };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('কাৰ্বহাইড্ৰেটৰ শ্ৰেণী', 'Classes of carbohydrates') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = C[st.c]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 22, 14, 'middle', 'fill:var(--text)', c[1] + '  ' + c[0], 700));
      svg.appendChild(txt(s, 210, 42, 12, 'middle', 'fill:var(--muted)', c[2]));
      var n = c[3] === 'n' ? 7 : c[3];
      for (var i = 0; i < n; i++) {
        var x = 210 + (i - (n - 1) / 2) * 44;
        svg.appendChild(s('circle', { cx: x, cy: 82, r: 14, style: 'fill:var(--electron);opacity:.8' }));
        svg.appendChild(txt(s, x, 86, 9, 'middle', 'fill:#fff', 'C₆', 700));
        if (i < n - 1) svg.appendChild(s('line', { x1: x + 14, y1: 82, x2: x + 30, y2: 82, style: 'stroke:var(--text)', 'stroke-width': 2, 'stroke-dasharray': c[3] === 'n' ? '' : '' }));
      }
      if (c[3] === 'n') svg.appendChild(txt(s, 210 + 3 * 44 + 30, 86, 14, 'start', 'fill:var(--text)', '…', 700));
      svg.appendChild(txt(s, 210, 118, 11, 'middle', 'fill:var(--muted)', c[4] === '—' ? L('একক — বান্ধনি নাই', 'single unit — no linkage') : c[4]));
      svg.appendChild(s('rect', { x: 120, y: 128, width: 180, height: 18, rx: 9, style: 'fill:' + (c[5] ? 'var(--brand-soft)' : 'var(--surface-2)') }));
      svg.appendChild(txt(s, 210, 141, 11, 'middle', 'fill:var(--text)', c[5] ? L('বিজাৰক ✔', 'reducing ✔') : L('অবিজাৰক / অ-শৰ্কৰা', 'non-reducing'), 600));
      info.innerHTML = '<b>' + c[1] + '</b> — ' + c[2] + '<br>' + L('উৎস: ', 'Source: ') + c[6] + (c[4] === '—' ? '' : '<br>' + L('বান্ধনি: ', 'Linkage: ') + c[4]) +
        (st.c === 'suc' ? '<br>' + L('দুয়োটা বিজাৰক মূলক বান্ধনিত জড়িত — সেয়ে অবিজাৰক; জল-বিশ্লেষণত প্ৰতীপ শৰ্কৰা।', 'Both reducing groups are in the linkage — hence non-reducing; hydrolysis gives invert sugar.') : '');
    }
    var sel = k.select('Carbohydrate', opts(C, function (v) { return v[1]; }), st.c, function (v) { st.c = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. glucose open chain / ring */
  A.register('glucose-ring', function (root, k) {
    var h = k.h, s = k.s;
    var st = { step: 0, f: 'a' };
    var svg = s('svg', { viewBox: '0 0 420 230', 'class': 'anim-svg', role: 'img', 'aria-label': L('গ্লুক\'জৰ গঠন', 'Structure of glucose') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var fbtn;
    function paint() {
      svg.innerHTML = '';
      if (st.step === 0) {
        var rows = ['CHO', 'H–C–OH', 'HO–C–H', 'H–C–OH', 'H–C–OH', 'CH₂OH'];
        rows.forEach(function (r, i) {
          svg.appendChild(txt(s, 150, 30 + i * 32, 14, 'middle', 'fill:var(--text)', r, i === 0 ? 700 : 400));
          svg.appendChild(txt(s, 205, 30 + i * 32, 11, 'start', 'fill:var(--muted)', 'C-' + (i + 1)));
        });
        svg.appendChild(txt(s, 330, 90, 11, 'middle', 'fill:var(--muted)', L('মুক্ত শৃংখল', 'open chain')));
        svg.appendChild(txt(s, 330, 108, 11, 'middle', 'fill:var(--muted)', L('(ফিছাৰ প্ৰক্ষেপণ)', '(Fischer projection)')));
      } else {
        var pts = [[150, 120], [190, 90], [250, 90], [290, 120], [250, 150], [190, 150]];   /* O, C1(? placed below) */
        /* ring order: O(top-right) C1 C2 C3 C4 C5 */
        var O = [260, 70], C1 = [300, 100], C2 = [280, 148], C3 = [220, 158], C4 = [170, 128], C5 = [190, 80];
        var ring = [O, C1, C2, C3, C4, C5];
        svg.appendChild(s('polygon', { points: ring.map(function (p) { return p.join(','); }).join(' '), style: 'fill:var(--brand-soft);stroke:var(--text)', 'stroke-width': 2 }));
        svg.appendChild(txt(s, O[0], O[1] - 6, 12, 'middle', 'fill:var(--proton)', 'O', 700));
        [[C1, 'C1', 10, 4], [C2, 'C2', 12, 14], [C3, 'C3', -2, 22], [C4, 'C4', -14, 6], [C5, 'C5', -12, -4]].forEach(function (c) { svg.appendChild(txt(s, c[0][0] + c[2], c[0][1] + c[3], 10, 'middle', 'fill:var(--muted)', c[1])); });
        svg.appendChild(txt(s, C5[0] - 14, C5[1] - 24, 11, 'middle', 'fill:var(--text)', 'CH₂OH'));
        var up = st.f === 'b';
        svg.appendChild(s('line', { x1: C1[0], y1: C1[1], x2: C1[0] + 18, y2: up ? C1[1] - 28 : C1[1] + 28, style: 'stroke:var(--proton)', 'stroke-width': 2.5 }));
        svg.appendChild(txt(s, C1[0] + 22, up ? C1[1] - 32 : C1[1] + 40, 12, 'middle', 'fill:var(--proton)', 'OH', 700));
        svg.appendChild(txt(s, 90, 210, 11, 'start', 'fill:var(--muted)', L('C-1: এন\'মাৰিক কাৰ্বন', 'C-1: the anomeric carbon')));
        svg.appendChild(txt(s, 330, 30, 12, 'middle', 'fill:var(--text)', st.f === 'a' ? 'α-D-(+)-glucopyranose' : 'β-D-(+)-glucopyranose', 700));
      }
      var eq = st.step === 0 ? '' : '<br>' + L('দ্ৰৱত সাম্য: α ≈ 36 %, β ≈ 64 %, মুক্ত শৃংখল < 1 % (আনুমানিক মান)।', 'In solution at equilibrium: α ≈ 36 %, β ≈ 64 %, open chain < 1 % (approximate values).');
      info.innerHTML = (st.step === 0 ?
        L('<b>মুক্ত শৃংখল:</b> CHO–(CHOH)₄–CH₂OH। কিন্তু 2,4-DNP, শ্বিফ আৰু NaHSO₃ পৰীক্ষা নিদিয়ে — ই চক্ৰীয়কৰণৰ ইংগিত।', '<b>Open chain:</b> CHO–(CHOH)₄–CH₂OH. Yet it does not give the 2,4-DNP, Schiff and NaHSO₃ tests — a hint of ring formation.') :
        L('<b>চক্ৰীয় হেমিএছিটেল:</b> C-5 ৰ –OH য়ে C-1 ৰ –CHO ক আক্ৰমণ কৰে; ছয়-সদস্যযুক্ত পাইৰান\'জ চক্ৰ। C-1 ৰ –OH ' + (st.f === 'a' ? 'তললৈ (α)' : 'ওপৰলৈ (β)') + '।',
          '<b>Cyclic hemiacetal:</b> the C-5 –OH attacks the C-1 –CHO; a six-membered pyranose ring. The C-1 –OH points ' + (st.f === 'a' ? 'down (α)' : 'up (β)') + '.')) + eq;
      fbtn.textContent = st.f === 'a' ? 'Form: α' : 'Form: β';
    }
    var nx = k.button('Next step', function () { st.step = st.step ? 0 : 1; paint(); }, 'primary');
    fbtn = k.button('Form: α', function () { st.f = st.f === 'a' ? 'b' : 'a'; if (!st.step) st.step = 1; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [nx, fbtn]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. amino acid charge vs pH */
  A.register('amino-zwitter', function (root, k) {
    var h = k.h, s = k.s, PK1 = 2.34, PK2 = 9.60;   /* glycine, standard values */
    var st = { ph: 6 };
    var svg = s('svg', { viewBox: '0 0 420 190', 'class': 'anim-svg', role: 'img', 'aria-label': L('গ্লাইছিনৰ আধান আৰু pH', 'Charge of glycine and pH') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function fr() {
      var a = Math.pow(10, PK1 - st.ph), b = Math.pow(10, st.ph - PK2), tot = 1 + a + b * 1 + a * 0;
      /* species: cation (H3N+-CH2-COOH), zwitterion, anion */
      var cat = a / (1 + a + b * 0), z = 1, an = b;
      var sum = cat + z + an; return [cat / sum, z / sum, an / sum];
    }
    function paint() {
      var f = fr(), forms = [['H₃N⁺–CH₂–COOH', L('ধনাত্মক', 'cation'), '+1', 'var(--proton)'], ['H₃N⁺–CH₂–COO⁻', L('উভয়ধৰ্মী আয়ন', 'zwitter ion'), '0', 'var(--ok)'], ['H₂N–CH₂–COO⁻', L('ঋণাত্মক', 'anion'), '–1', 'var(--electron)']];
      svg.innerHTML = '';
      forms.forEach(function (c, i) {
        var y = 14 + i * 52;
        svg.appendChild(txt(s, 8, y + 14, 12, 'start', 'fill:var(--text)', c[0], f[i] > .5 ? 700 : 400));
        svg.appendChild(txt(s, 8, y + 30, 10, 'start', 'fill:var(--muted)', c[1] + '  (' + c[2] + ')'));
        svg.appendChild(s('rect', { x: 160, y: y + 4, width: 200, height: 22, rx: 4, style: 'fill:var(--surface-2)' }));
        svg.appendChild(s('rect', { x: 160, y: y + 4, width: Math.max(1, 200 * f[i]), height: 22, rx: 4, style: 'fill:' + c[3] + ';opacity:.85' }));
        svg.appendChild(txt(s, 366, y + 20, 11, 'start', 'fill:var(--text)', Math.round(f[i] * 100) + ' %'));
      });
      var net = f[0] - f[2], pI = (PK1 + PK2) / 2;
      svg.appendChild(txt(s, 210, 178, 11, 'middle', 'fill:var(--muted)', 'pH = ' + st.ph.toFixed(1) + '   ·   ' + L('গড় আধান ', 'average charge ') + (net >= 0 ? '+' : '–') + Math.abs(net).toFixed(2)));
      var dom = f[0] > f[1] && f[0] > f[2] ? 0 : (f[2] > f[1] ? 2 : 1);
      info.innerHTML = L('প্ৰধান ৰূপ: ', 'Dominant form: ') + '<b>' + forms[dom][1] + '</b><br>' + L('প্ৰবল এছিডত –COOH আৰু –NH₃⁺ (ধনাত্মক); প্ৰবল ক্ষাৰত –COO⁻ আৰু –NH₂ (ঋণাত্মক); মধ্যমীয়া pH ত উভয়ধৰ্মী আয়ন। সমবিদ্যুৎ বিন্দু pI = ' + pI.toFixed(2) + '।',
        'In strong acid: –COOH and –NH₃⁺ (positive); in strong base: –COO⁻ and –NH₂ (negative); at intermediate pH the zwitter ion. Isoelectric point pI = ' + pI.toFixed(2) + '.') +
        '<br><span class="muted">' + L('pKₐ মান (2.34, 9.60) সাধাৰণ সাহিত্যৰ মান; পাঠ্যপুথিত নাই।', 'The pKₐ values (2.34, 9.60) are standard literature values; they are not in the textbook.') + '</span>';
    }
    var ps = k.slider('pH', 0, 14, 0.5, st.ph, function (v) { st.ph = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [ps.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. peptide bond */
  A.register('peptide-chain', function (root, k) {
    var h = k.h, s = k.s;
    var AA = { G: ['Gly', 'H', L('গ্লাইছিল', 'glycyl'), L('গ্লাইছিন', 'glycine')], A: ['Ala', 'CH₃', L('এলানিল', 'alanyl'), L('এলানিন', 'alanine')], S: ['Ser', 'CH₂OH', L('ছেৰিল', 'seryl'), L('ছেৰিন', 'serine')],
      V: ['Val', 'CH(CH₃)₂', L('ভেলিল', 'valyl'), L('ভেলিন', 'valine')], C: ['Cys', 'CH₂SH', L('চিষ্টেনিল', 'cysteinyl'), L('চিষ্টেইন', 'cysteine')] };
    var st = { a: 'G', b: 'A' };
    var svg = s('svg', { viewBox: '0 0 420 170', 'class': 'anim-svg', role: 'img', 'aria-label': L('ডাইপেপটাইড', 'A dipeptide') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var a = AA[st.a], b = AA[st.b]; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 22, 12, 'middle', 'fill:var(--muted)', 'H₂N–CH(' + a[1] + ')–COOH   +   H₂N–CH(' + b[1] + ')–COOH'));
      svg.appendChild(txt(s, 210, 46, 12, 'middle', 'fill:var(--muted)', '↓  − H₂O'));
      /* chain */
      var x0 = 30, y = 90;
      var parts = [['H₂N', 0], ['CH', 1], ['CO', 2], ['NH', 3], ['CH', 4], ['COOH', 5]];
      var xs = [30, 100, 170, 230, 290, 360];
      parts.forEach(function (p, i) {
        var hl = i === 2 || i === 3;
        if (hl) svg.appendChild(s('rect', { x: xs[i] - 22, y: y - 18, width: 44, height: 30, rx: 8, style: 'fill:var(--brand-soft);stroke:var(--proton)', 'stroke-width': 2 }));
        svg.appendChild(txt(s, xs[i], y + 3, 13, 'middle', 'fill:var(--text)', p[0], hl ? 700 : 500));
        if (i < parts.length - 1) svg.appendChild(s('line', { x1: xs[i] + 22, y1: y - 3, x2: xs[i + 1] - 22, y2: y - 3, style: 'stroke:var(--text)', 'stroke-width': 1.5 }));
      });
      svg.appendChild(txt(s, 100, y + 38, 11, 'middle', 'fill:var(--electron)', a[1]));
      svg.appendChild(txt(s, 290, y + 38, 11, 'middle', 'fill:var(--electron)', b[1]));
      svg.appendChild(txt(s, 200, y - 34, 11, 'middle', 'fill:var(--proton)', L('পেপটাইড বান্ধনি', 'peptide bond'), 700));
      svg.appendChild(txt(s, 30, 150, 10, 'start', 'fill:var(--muted)', L('N-প্ৰান্ত (মুক্ত –NH₂)', 'N-terminal (free –NH₂)')));
      svg.appendChild(txt(s, 390, 150, 10, 'end', 'fill:var(--muted)', L('C-প্ৰান্ত (মুক্ত –COOH)', 'C-terminal (free –COOH)')));
      var rev = st.a !== st.b ? '<br>' + L('ক্ৰম উলটালে ', 'Reversing the order gives ') + '<b>' + b[0] + '–' + a[0] + '</b> (' + b[2] + a[3] + ') — ' + L('বেলেগ যৌগ।', 'a different compound.') : '';
      info.innerHTML = '<b>' + a[0] + '–' + b[0] + '</b> (' + a[2] + b[3] + ')<br>' + L('ডাইপেপটাইড: এটা –CO–NH– বান্ধনি, এটা পানী আতৰে।', 'A dipeptide: one –CO–NH– bond, one molecule of water lost.') + rev;
    }
    var keys = Object.keys(AA);
    var as = k.select('Amino acid 1 (N-terminal)', keys.map(function (c) { return { value: c, label: AA[c][0] }; }), st.a, function (v) { st.a = v; paint(); });
    var bs = k.select('Amino acid 2 (C-terminal)', keys.map(function (c) { return { value: c, label: AA[c][0] }; }), st.b, function (v) { st.b = v; paint(); });
    var sw = k.button('Swap order', function () { var t = st.a; st.a = st.b; st.b = t; as.input && (as.input.value = st.a); bs.input && (bs.input.value = st.b); paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [as.el, bs.el, sw]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 5. protein structure levels */
  A.register('protein-levels', function (root, k) {
    var h = k.h, s = k.s;
    var COL = ['#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c', '#8e6bbf', '#e377c2'];
    var LV = {
      1: [L('প্ৰাইমাৰি (1°)', 'Primary (1°)'), L('এমিন\' এছিডৰ অনুক্ৰম', 'amino acid sequence'), L('পেপটাইড বান্ধনি', 'peptide bonds')],
      2: [L('ছেকেণ্ডাৰি (2°)', 'Secondary (2°)'), L('α-কুণ্ডলী / β-থুৰিয়া পাত', 'α-helix / β-pleated sheet'), L('হাইড্ৰ\'জেন বান্ধনি (C=O···H–N)', 'hydrogen bonds (C=O···H–N)')],
      3: [L('টাৰ্ছিয়েৰি (3°)', 'Tertiary (3°)'), L('সামগ্ৰিক ত্ৰিমাত্ৰিক ভাঁজ', 'overall 3-D folding'), L('H-বান্ধনি, S–S, ভেন ডাৰ ৱালছ, স্থিৰবৈদ্যুতিক', 'H-bonds, S–S, van der Waals, electrostatic')],
      4: [L('কোৱাটাৰনাৰি (4°)', 'Quaternary (4°)'), L('একাধিক উপগোটৰ সজ্জা', 'arrangement of several sub-units'), L('উপগোটৰ মাজত দুৰ্বল বল', 'weak forces between sub-units')]
    };
    var st = { l: 1, d: 0 };
    var svg = s('svg', { viewBox: '0 0 420 150', 'class': 'anim-svg', role: 'img', 'aria-label': L('প্ৰ\'টিনৰ গঠন', 'Protein structure') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var dbtn;
    function pos(shape, i, n, ox) {
      var t = i / (n - 1);
      if (shape === 1) return [ox + 20 + t * 150, 75];
      if (shape === 2) return [ox + 20 + t * 150, 75 + 28 * Math.sin(t * Math.PI * 6)];
      var a = t * Math.PI * 4.2;
      return [ox + 95 + 60 * Math.cos(a) * (0.55 + 0.45 * t), 75 + 45 * Math.sin(a * 1.3)];
    }
    function paint() {
      svg.innerHTML = '';
      var shape = st.d ? 1 : (st.l >= 3 ? 3 : st.l), n = 18;
      var blobs = (!st.d && st.l === 4) ? [10, 190] : [115];
      blobs.forEach(function (ox, bi) {
        var o = (st.l === 4 && !st.d) ? ox : 105 - 20;
        var pts = [], i;
        for (i = 0; i < n; i++) pts.push(pos(shape, i, n, st.l === 4 && !st.d ? ox : 115));
        svg.appendChild(s('polyline', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), style: 'fill:none;stroke:var(--muted);opacity:.6', 'stroke-width': 2 }));
        pts.forEach(function (p, j) { svg.appendChild(s('circle', { cx: p[0], cy: p[1], r: 6, style: 'fill:' + COL[(j + bi * 2) % COL.length] })); });
      });
      var lv = LV[st.l];
      var txtDen = st.d ? L('<b>বিকৃতকৰণ:</b> 2°, 3°, 4° ধ্বংস; কেৱল 1° (পেপটাইড বান্ধনি) অটুট — প্ৰ\'টিনে জৈৱিক সক্ৰিয়তা হেৰুৱায়।', '<b>Denatured:</b> 2°, 3°, 4° destroyed; only the 1° (peptide bonds) survives — the protein loses its biological activity.') : '';
      info.innerHTML = '<b>' + lv[0] + '</b> — ' + lv[1] + '<br>' + L('স্থিৰ কৰা বল: ', 'Held by: ') + lv[2] + (txtDen ? '<br>' + txtDen : '');
      svg.appendChild(txt(s, 210, 142, 11, 'middle', 'fill:var(--muted)', st.d ? L('বিকৃত (heat / pH)', 'denatured (heat / pH)') : lv[0]));
      dbtn.textContent = st.d ? 'Restore' : 'Heat / change pH';
    }
    var ls = k.select('Level', [{ value: '1', label: '1° primary' }, { value: '2', label: '2° secondary' }, { value: '3', label: '3° tertiary' }, { value: '4', label: '4° quaternary' }], '1', function (v) { st.l = +v; st.d = 0; paint(); });
    dbtn = k.button('Heat / change pH', function () { st.d = st.d ? 0 : 1; paint(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [ls.el, dbtn]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. vitamins */
  A.register('vitamin-guide', function (root, k) {
    var h = k.h, s = k.s;
    var V = {
      A: ['A', 'fat', L('মাছৰ যকৃতৰ তেল, গাজৰ, মাখন, গাখীৰ', 'fish-liver oil, carrot, butter, milk'), L('জেৰ\'থেলমিয়া, কুকুৰীকণা', 'xerophthalmia, night blindness')],
      B1: ['B₁ (thiamine)', 'water', L('ঈষ্ট, গাখীৰ, শাক-পাচলি, ধানজাতীয় শস্য', 'yeast, milk, green vegetables, cereals'), L('বেৰি বেৰি', 'beri-beri')],
      B2: ['B₂ (riboflavin)', 'water', L('গাখীৰ, কণীৰ বগা অংশ, যকৃত, বৃক্ক', 'milk, egg white, liver, kidney'), L('কেইল\'ছিছ (মুখৰ চুক ফাটি যোৱা)', 'cheilosis (cracks at the corners of the mouth)')],
      B6: ['B₆ (pyridoxine)', 'water', L('ঈষ্ট, গাখীৰ, কণীৰ কুসুম, শস্য', 'yeast, milk, egg yolk, cereals'), L('মৃগী সদৃশ মূৰ্ছা (convulsions)', 'convulsions')],
      B12: ['B₁₂', 'water', L('মাংস, মাছ, কণী, দৈ', 'meat, fish, egg, curd'), L('পাণ্ডুৰোগ (pernicious anaemia)', 'pernicious anaemia')],
      C: ['C (ascorbic acid)', 'water', L('নেমু জাতীয় ফল, আমলখি, সেউজীয়া পাচলি', 'citrus fruits, amla, green leafy vegetables'), L('স্কাৰ্ভি', 'scurvy')],
      D: ['D', 'fat', L('ৰ\'দ, মাছ, কণীৰ কুসুম', 'sunlight, fish, egg yolk'), L('ৰিকেটছ, অষ্টিঅ\'মেলেছিয়া', 'rickets, osteomalacia')],
      E: ['E', 'fat', L('উদ্ভিজ্জ তেল, গমৰ অংকুৰ', 'vegetable oils, wheat germ'), L('RBC ৰ ভংগুৰতা, পেশীৰ দুৰ্বলতা', 'fragile RBCs, muscular weakness')],
      K: ['K', 'fat', L('সেউজীয়া পাতযুক্ত পাচলি', 'green leafy vegetables'), L('তেজ গোট মৰাত বিলম্ব', 'delayed blood clotting')]
    };
    var st = { v: 'C' };
    var svg = s('svg', { viewBox: '0 0 420 120', 'class': 'anim-svg', role: 'img', 'aria-label': L('ভিটামিন', 'Vitamins') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var v = V[st.v], fat = v[1] === 'fat'; svg.innerHTML = '';
      svg.appendChild(txt(s, 210, 28, 18, 'middle', 'fill:var(--text)', L('ভিটামিন ', 'Vitamin ') + v[0], 700));
      svg.appendChild(s('rect', { x: 100, y: 44, width: 220, height: 28, rx: 14, style: 'fill:' + (fat ? '#f6e27a' : 'var(--brand-soft)') }));
      svg.appendChild(txt(s, 210, 63, 12, 'middle', 'fill:#222', fat ? L('চৰ্বী-দ্ৰৱণীয় — সঞ্চিত হয়', 'fat-soluble — stored in the body') : L('পানী-দ্ৰৱণীয় — নিয়মিত যোগান লাগে', 'water-soluble — regular supply needed'), 600));
      svg.appendChild(txt(s, 210, 100, 12, 'middle', 'fill:var(--muted)', L('অভাৱ: ', 'Deficiency: ') + v[3]));
      info.innerHTML = '<b>' + L('ভিটামিন ', 'Vitamin ') + v[0] + '</b><br>' + L('উৎস: ', 'Source: ') + v[2] + '<br>' + L('অভাৱজনিত ৰোগ: ', 'Deficiency disease: ') + v[3];
    }
    var sel = k.select('Vitamin', opts(V, function (v) { return v[0]; }), st.v, function (x) { st.v = x; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 7. base pairing */
  A.register('dna-pairing', function (root, k) {
    var h = k.h, s = k.s;
    var SEQ = { s1: 'ATGCGTAC', s2: 'GGCATTCA', s3: 'TACGGATC' };
    var st = { q: 's1', rna: 0 };
    var svg = s('svg', { viewBox: '0 0 420 200', 'class': 'anim-svg', role: 'img', 'aria-label': L('ক্ষাৰক যোৰ', 'Base pairing') });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var COLB = { A: '#d9534f', T: '#5bc0de', G: '#5cb85c', C: '#f0ad4e', U: '#8e6bbf' };
    function comp(b) { return { A: st.rna ? 'U' : 'T', T: 'A', G: 'C', C: 'G' }[b]; }
    function paint() {
      var q = SEQ[st.q].split(''), c = q.map(comp), hb = 0; svg.innerHTML = '';
      svg.appendChild(txt(s, 8, 18, 11, 'start', 'fill:var(--muted)', st.rna ? L('DNA ছাঁচ সূত্ৰ (3′→5′)', 'DNA template strand (3′→5′)') : L('সূত্ৰ 1 (5′→3′)', 'Strand 1 (5′→3′)')));
      svg.appendChild(txt(s, 8, 190, 11, 'start', 'fill:var(--muted)', st.rna ? L('m-RNA (এক-সূত্ৰী; U)', 'm-RNA (single strand; U)') : L('পৰিপূৰক সূত্ৰ 2 (3′→5′)', 'Complementary strand 2 (3′→5′)')));
      q.forEach(function (b, i) {
        var x = 30 + i * 48, n = (b === 'G' || b === 'C') ? 3 : 2; hb += n;
        svg.appendChild(s('rect', { x: x - 16, y: 28, width: 32, height: 30, rx: 6, style: 'fill:' + COLB[b] }));
        svg.appendChild(txt(s, x, 49, 16, 'middle', 'fill:#fff', b, 700));
        for (var j = 0; j < n; j++) svg.appendChild(s('line', { x1: x - 8 + j * 8, y1: 62, x2: x - 8 + j * 8, y2: 126, style: 'stroke:var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '3 3' }));
        svg.appendChild(s('rect', { x: x - 16, y: 130, width: 32, height: 30, rx: 6, style: 'fill:' + COLB[c[i]] }));
        svg.appendChild(txt(s, x, 151, 16, 'middle', 'fill:#fff', c[i], 700));
      });
      info.innerHTML = (st.rna ? L('m-RNA — DNA ছাঁচত গঠিত; T ৰ ঠাইত U (A–U)।', 'm-RNA is built on the DNA template; U replaces T (A–U).') : L('DNA দ্বি-সূত্ৰ — পৰিপূৰক যোৰ: A = T (দুটা H-বান্ধনি), G ≡ C (তিনিটা H-বান্ধনি)।', 'DNA double strand — complementary pairs: A = T (two H-bonds), G ≡ C (three H-bonds).')) +
        '<br>' + L('মুঠ H-বান্ধনি: ', 'Total H-bonds: ') + '<b>' + hb + '</b> · ' + L('G–C যোৰ বেছি হ\'লে DNA বেছি স্থিৰ।', 'more G–C pairs make the DNA more stable.');
    }
    var qs = k.select('Strand', [{ value: 's1', label: 'ATGCGTAC' }, { value: 's2', label: 'GGCATTCA' }, { value: 's3', label: 'TACGGATC' }], st.q, function (v) { st.q = v; paint(); });
    var tg = k.button('DNA / RNA', function () { st.rna = st.rna ? 0 : 1; paint(); }, 'primary');
    root.appendChild(h('div', { 'class': 'row' }, [qs.el, tg]));
    root.appendChild(info);
    paint();
  });
})();
