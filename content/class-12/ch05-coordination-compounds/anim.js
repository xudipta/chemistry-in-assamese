/* Animations for Class 12, Chapter 5: Coordination Compounds (সমন্বয়ী যৌগ).
   Registered: werner, geometry, naming, isomers, vbt, cft, colour, synergic
   Controls are English (app UI); read-outs are Assamese (subject content). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var TAU = Math.PI * 2;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sub(n) { return n > 1 ? '<sub>' + n + '</sub>' : ''; }
  function chargeTxt(q) { return q === 0 ? '' : '<sup>' + (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−') + '</sup>'; }
  function roman(n) { return ['0', 'I', 'II', 'III', 'IV', 'V', 'VI'][n] || String(n); }

  /* ---------------------------------------------------------------- 3-D viewer shared by geometry + isomers */
  function viewer(root, k, label, size) {
    var h = k.h, W = size || 330, H = size || 300;
    var canvas = h('canvas', { 'class': 'anim-canvas drag', role: 'img', 'aria-label': label });
    root.appendChild(canvas);
    var ctx = k.hiDpiCanvas(canvas, W, H);
    var st = { ax: -0.5, ay: 0.7, drag: false, lx: 0, ly: 0, scene: null };
    function rot(p) {
      var ca = Math.cos(st.ay), sa = Math.sin(st.ay), cb = Math.cos(st.ax), sb = Math.sin(st.ax);
      var x1 = p[0] * ca + p[2] * sa, z1 = -p[0] * sa + p[2] * ca, y2 = p[1] * cb - z1 * sb, z2 = p[1] * sb + z1 * cb;
      return [x1, y2, z2];
    }
    function draw() {
      var bg = k.cssVar('--canvas'), br = k.cssVar('--border'), tx = k.cssVar('--text');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var sc = st.scene; if (!sc) return;
      var S = Math.min(W, H) * 0.30, cx = W / 2, cy = H / 2;
      var pts = sc.atoms.map(function (a) { var r = rot(a.p); return { x: cx + r[0] * S, y: cy - r[1] * S, z: r[2], a: a }; });
      var items = [];
      (sc.bonds || []).forEach(function (b) { var p = pts[b[0]], q = pts[b[1]]; items.push({ z: (p.z + q.z) / 2 - 0.01, t: 'b', p: p, q: q, dash: b[2] }); });
      (sc.arcs || []).forEach(function (b) { var p = pts[b[0]], q = pts[b[1]]; items.push({ z: (p.z + q.z) / 2 - 0.02, t: 'arc', p: p, q: q, col: b[2] }); });
      pts.forEach(function (p) { items.push({ z: p.z, t: 'a', p: p }); });
      items.sort(function (u, v) { return u.z - v.z; });
      items.forEach(function (it) {
        if (it.t === 'b') {
          ctx.strokeStyle = tx; ctx.globalAlpha = 0.7; ctx.lineWidth = 2.5; ctx.setLineDash(it.dash ? [4, 4] : []);
          ctx.beginPath(); ctx.moveTo(it.p.x, it.p.y); ctx.lineTo(it.q.x, it.q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
        } else if (it.t === 'arc') {
          var mx = (it.p.x + it.q.x) / 2, my = (it.p.y + it.q.y) / 2, dx = it.q.x - it.p.x, dy = it.q.y - it.p.y, nrm = Math.hypot(dx, dy) || 1;
          var ox = mx + (cx - mx) * 0.0 - dy / nrm * 0, oy = my;
          ctx.strokeStyle = it.col || k.cssVar('--alpha'); ctx.lineWidth = 3.5; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(it.p.x, it.p.y);
          ctx.quadraticCurveTo(mx + (mx - cx) * 0.5, my + (my - cy) * 0.5, it.q.x, it.q.y); ctx.stroke(); ctx.globalAlpha = 1;
        } else {
          var a = it.p.a, depth = (it.p.z + 1.6) / 3.2, r = (a.r || 12) * (0.85 + 0.3 * clamp(depth, 0, 1));
          ctx.fillStyle = a.c; ctx.globalAlpha = 0.55 + 0.45 * clamp(depth, 0, 1);
          ctx.beginPath(); ctx.arc(it.p.x, it.p.y, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
          ctx.strokeStyle = br; ctx.lineWidth = 1; ctx.stroke();
          if (a.l) { ctx.fillStyle = a.tc || '#fff'; ctx.font = '700 ' + Math.round(r * 0.9) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(a.l, it.p.x, it.p.y + r * 0.32); ctx.textAlign = 'start'; }
        }
      });
    }
    var lp = k.loop(root, function (dt) { if (!st.drag && !k.reduceMotion) st.ay += 0.5 * dt; draw(); });
    canvas.addEventListener('pointerdown', function (e) { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) { if (!st.drag) return; st.ay += (e.clientX - st.lx) * 0.012; st.ax = clamp(st.ax + (e.clientY - st.ly) * 0.012, -1.5, 1.5); st.lx = e.clientX; st.ly = e.clientY; if (!lp.running) draw(); });
    ['pointerup', 'pointercancel'].forEach(function (n) { canvas.addEventListener(n, function () { st.drag = false; }); });
    return { set: function (sc) { st.scene = sc; if (!lp.running) draw(); }, start: function () { if (!k.reduceMotion) lp.start(); draw(); } };
  }

  var OCT = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

  /* ================================================================== 1. Werner's experiments */
  A.register('werner', function (root, k) {
    var h = k.h, s = k.s;
    var CPD = [
      { n: 'CoCl₃·6NH₃ (হালধীয়া)', col: '#e8c93a', nh: 6, cl_in: 0, free: 3, f: '[Co(NH₃)₆]Cl₃', ratio: '1 : 3' },
      { n: 'CoCl₃·5NH₃ (পূৰৈয়া)', col: '#a2487a', nh: 5, cl_in: 1, free: 2, f: '[CoCl(NH₃)₅]Cl₂', ratio: '1 : 2' },
      { n: 'CoCl₃·4NH₃ (সেউজীয়া)', col: '#3aa655', nh: 4, cl_in: 2, free: 1, f: '[CoCl₂(NH₃)₄]Cl', ratio: '1 : 1' },
      { n: 'CoCl₃·4NH₃ (বেঙুনীয়া)', col: '#7a4bb0', nh: 4, cl_in: 2, free: 1, f: '[CoCl₂(NH₃)₄]Cl', ratio: '1 : 1' }
    ];
    var cur = 0, added = false, t = 0;
    var svg = s('svg', { viewBox: '0 0 400 250', 'class': 'anim-svg', role: 'img', 'aria-label': 'ৱাৰ্নাৰৰ সমন্বয়ী যৌগ: সমন্বয়ী বলয়ৰ ভিতৰত আৰু বাহিৰত থকা ক্ল\'ৰাইড' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var POS = [[0, -62], [0, 62], [-62, 0], [62, 0], [-44, -44], [44, 44]];
    var counters = [];
    function build() {
      var c = CPD[cur]; svg.innerHTML = ''; counters = [];
      svg.appendChild(s('circle', { cx: 130, cy: 125, r: 88, fill: 'none', style: 'stroke:' + c.col + ';stroke-width:3', 'stroke-dasharray': '7 5' }));
      svg.appendChild(s('text', { x: 130, y: 232, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--muted)', text: 'সমন্বয়ী বলয় (coordination sphere)' }));
      svg.appendChild(s('circle', { cx: 130, cy: 125, r: 17, style: 'fill:' + c.col }));
      svg.appendChild(s('text', { x: 130, y: 130, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, style: 'fill:#222', text: 'Co' }));
      for (var i = 0; i < 6; i++) {
        var isN = i < c.nh, p = POS[i], g = s('g');
        svg.appendChild(s('line', { x1: 130, y1: 125, x2: 130 + p[0], y2: 125 + p[1], style: 'stroke:var(--text);opacity:.5', 'stroke-width': 2 }));
        g.appendChild(s('circle', { cx: 130 + p[0], cy: 125 + p[1], r: 14, style: 'fill:' + (isN ? 'var(--electron)' : 'var(--ok)') }));
        g.appendChild(s('text', { x: 130 + p[0], y: 125 + p[1] + 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, style: 'fill:#fff', text: isN ? 'NH₃' : 'Cl' }));
        svg.appendChild(g);
        if (i >= c.nh && i >= c.nh && i < c.nh + c.cl_in) { /* Cl inside */ }
      }
      /* fix: chloride ligands count */
      for (i = 0; i < 6; i++) { if (i >= c.nh + c.cl_in) { /* any leftover position stays chloride-free: none expected */ } }
      /* counter ions outside */
      for (i = 0; i < c.free; i++) {
        var cx = 290 + (i % 2) * 52, cy = 80 + Math.floor(i / 2) * 56, node = s('g');
        node.appendChild(s('circle', { r: 15, cx: 0, cy: 0, style: 'fill:var(--ok)' }));
        node.appendChild(s('text', { x: 0, y: 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, style: 'fill:#fff', text: 'Cl⁻' }));
        node.setAttribute('transform', 'translate(' + cx + ',' + cy + ')'); svg.appendChild(node); counters.push({ g: node, x: cx, y: cy, ph: i });
      }
      svg.appendChild(s('text', { x: 316, y: 232, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--muted)', text: 'প্ৰতি-আয়ন (বাহিৰত)' }));
      added = false; t = 0; paint();
    }
    function paint() {
      var c = CPD[cur], pct = added ? c.free : 0;
      info.innerHTML = 'সংকেত: <b>' + c.f + '</b> · মুখ্য যোজ্যতা (আয়নীকৰণীয়) = ' + c.free + ' (বাহিৰৰ Cl<sup>−</sup>) · গৌণ যোজ্যতা = সমন্বয়ী সংখ্যা = <b>6</b><br>' +
        'অতিৰিক্ত AgNO<sub>3</sub> দ্ৰৱ যোগ কৰিলে AgCl অধঃক্ষেপ = <b>' + (added ? c.free : '?') + ' mol</b> · ম\'লাৰ পৰিবাহিতাৰ অনুপাত = ' + c.ratio + ' বিদ্যুৎবিশ্লেষ্য' +
        (cur >= 2 ? '<br><span class="en">দুয়োটা CoCl₃·4NH₃ ৰ সংকেত একে কিন্তু বৰণ বেলেগ — সিহঁত সমযোগী (isomers)।</span>' : '');
    }
    function tick(dt) {
      t += dt;
      counters.forEach(function (c) {
        var dx = Math.sin(t * 1.4 + c.ph) * 4, dy = Math.cos(t * 1.1 + c.ph * 2) * 4, pos = added ? 1 : 0;
        c.g.setAttribute('transform', 'translate(' + (c.x + dx) + ',' + (c.y + dy) + ')');
        if (added && !c.done) { c.g.firstChild.setAttribute('style', 'fill:#d9d9d9'); c.g.lastChild.setAttribute('style', 'fill:#555'); c.g.lastChild.textContent = 'AgCl'; c.done = true; }
      });
    }
    var sel = k.select('Compound', CPD.map(function (x, i) { return { value: i, label: x.n }; }), cur, function (v) { cur = +v; build(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, k.button('Add AgNO₃', function () { added = true; counters.forEach(function (c) { c.done = false; }); paint(); }, 'primary'), k.button('Reset', build)]));
    root.appendChild(svg); root.appendChild(info);
    var lp = k.loop(root, tick);
    build(); if (!k.reduceMotion) lp.start();
  });

  /* ================================================================== 2. coordination polyhedra */
  A.register('geometry', function (root, k) {
    var h = k.h;
    var S = 1.0, T = 0.577;
    var SHAPES = {
      oct: { n: 'Octahedral (CN 6)', pos: OCT, ex: '[Co(NH₃)₆]³⁺, [Cr(CO)₆]', hyb: 'sp³d² / d²sp³', note: 'ছয়টা লিগাণ্ড অষ্টফলকৰ কোণত।' },
      tet: { n: 'Tetrahedral (CN 4)', pos: [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]], ex: '[Ni(CO)₄], [NiCl₄]²⁻', hyb: 'sp³', note: 'চাৰিটা লিগাণ্ড চতুৰ্ফলকৰ কোণত।' },
      sqp: { n: 'Square planar (CN 4)', pos: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]], ex: '[PtCl₄]²⁻, [Ni(CN)₄]²⁻', hyb: 'dsp²', note: 'চাৰিটা লিগাণ্ড একে সমতলত বৰ্গৰ চাৰিকোণত।' },
      tbp: { n: 'Trigonal bipyramidal (CN 5)', pos: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-0.5, 0.866, 0], [-0.5, -0.866, 0]], ex: '[Fe(CO)₅]', hyb: 'sp³d', note: 'দুটা অক্ষীয় আৰু তিনিটা বিষুৱীয় লিগাণ্ড।' },
      sqpy: { n: 'Square pyramidal (CN 5)', pos: [[1, 0, -0.25], [-1, 0, -0.25], [0, 1, -0.25], [0, -1, -0.25], [0, 0, 0.85]], ex: '[Mn(CO)₅] (Mn₂(CO)₁₀ ৰ প্ৰতিটো অংশ)', hyb: '—', note: 'চাৰিটা ভিত্তি আৰু এটা শীৰ্ষ লিগাণ্ড।' }
    };
    var cur = 'oct', v = viewer(root, k, 'সমন্বয়ী বহুফলকৰ ঘূৰণীয়া ত্ৰিমাত্ৰিক দৃশ্য', 320);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var sh = SHAPES[cur], atoms = [{ p: [0, 0, 0], r: 20, c: '#7a4bb0', l: 'M' }], bonds = [];
      sh.pos.forEach(function (p, i) { atoms.push({ p: p, r: 12, c: '#1c7ed6', l: 'L' }); bonds.push([0, i + 1]); });
      if (cur === 'oct' || cur === 'sqp' || cur === 'sqpy') { /* outline edges of the polyhedron */
        var P = sh.pos;
        for (var i = 0; i < P.length; i++) for (var j = i + 1; j < P.length; j++) {
          var d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1], P[i][2] - P[j][2]);
          if (d < 1.5 && cur === 'oct') bonds.push([i + 1, j + 1, true]); else if (cur !== 'oct' && d < 1.5) bonds.push([i + 1, j + 1, true]);
        }
      }
      if (cur === 'tet' || cur === 'tbp') { var P2 = sh.pos; for (var a = 0; a < P2.length; a++) for (var b = a + 1; b < P2.length; b++) bonds.push([a + 1, b + 1, true]); }
      v.set({ atoms: atoms, bonds: bonds });
      info.innerHTML = '<b>' + sh.n + '</b> · ' + sh.note + '<br>উদাহৰণ: ' + sh.ex + ' · সংকৰণ: <b>' + sh.hyb + '</b>';
    }
    var sel = k.select('Shape', Object.keys(SHAPES).map(function (x) { return { value: x, label: SHAPES[x].n }; }), cur, function (val) { cur = val; paint(); });
    root.insertBefore(h('div', { 'class': 'row' }, [sel.el]), root.firstChild);
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [h('span', {}, [h('span', { 'class': 'dot', style: 'background:#7a4bb0' }), 'M কেন্দ্ৰীয় পৰমাণু / আয়ন']), h('span', {}, [h('span', { 'class': 'dot', style: 'background:#1c7ed6' }), 'L লিগাণ্ড']), h('span', { text: 'ঘূৰাবলৈ টানক' })]));
    paint(); v.start();
  });

  /* ================================================================== 3. IUPAC naming builder */
  A.register('naming', function (root, k) {
    var h = k.h;
    var LIG = {
      NH3: { en: 'ammine', as: 'এমাইন', q: 0, d: 1, f: 'NH<sub>3</sub>', key: 'NH3', poly: true, big: false },
      H2O: { en: 'aqua', as: 'একুৱা', q: 0, d: 1, f: 'H<sub>2</sub>O', key: 'H2O', poly: true, big: false },
      Cl: { en: 'chlorido', as: 'ক্ল\'ৰিড', q: -1, d: 1, f: 'Cl', key: 'Cl', poly: false, big: false },
      CN: { en: 'cyanido', as: 'ছায়েনিড', q: -1, d: 1, f: 'CN', key: 'CN', poly: true, big: false },
      OH: { en: 'hydroxido', as: 'হাইড্ৰক্সিড', q: -1, d: 1, f: 'OH', key: 'OH', poly: true, big: false },
      CO: { en: 'carbonyl', as: 'কাৰ্বনিল', q: 0, d: 1, f: 'CO', key: 'CO', poly: true, big: false },
      NO2: { en: 'nitrito-N', as: 'নাইট্ৰিট\'-N', q: -1, d: 1, f: 'NO<sub>2</sub>', key: 'NO2', poly: true, big: false },
      en: { en: 'ethane-1,2-diamine', as: 'ইথেন-1,2-ডাইএমাইন', q: 0, d: 2, f: 'en', key: 'en', poly: true, big: true },
      ox: { en: 'oxalato', as: 'অক্জেলেট', q: -2, d: 2, f: 'ox', key: 'ox', poly: true, big: false }
    };
    var MET = {
      Co: { en: 'cobalt', ate: 'cobaltate', as: 'ক\'বাল্ট', asAte: 'ক\'বাল্টেট' },
      Cr: { en: 'chromium', ate: 'chromate', as: 'ক্ৰ\'মিয়াম', asAte: 'ক্ৰ\'মেট' },
      Fe: { en: 'iron', ate: 'ferrate', as: 'আইৰণ', asAte: 'ফেৰেট' },
      Pt: { en: 'platinum', ate: 'platinate', as: 'প্লেটিনাম', asAte: 'প্লেটিনেট' },
      Ni: { en: 'nickel', ate: 'nickelate', as: 'নিকেল', asAte: 'নিকেলেট' },
      Cu: { en: 'copper', ate: 'cuprate', as: 'কপাৰ', asAte: 'কিউপ্ৰেট' },
      Zn: { en: 'zinc', ate: 'zincate', as: 'জিংক', asAte: 'জিংকেট' },
      Al: { en: 'aluminium', ate: 'aluminate', as: 'এলুমিনিয়াম', asAte: 'এলুমিনেট' }
    };
    var PRE = { 2: ['di', 'ডাই'], 3: ['tri', 'ট্ৰাই'], 4: ['tetra', 'টেট্ৰা'], 5: ['penta', 'পেণ্টা'], 6: ['hexa', 'হেক্সা'] };
    var PREB = { 2: ['bis', 'বিছ'], 3: ['tris', 'ট্ৰিছ'], 4: ['tetrakis', 'টেট্ৰাকিছ'] };
    var st = { m: 'Co', ox: 3, n: {} };
    Object.keys(LIG).forEach(function (x) { st.n[x] = 0; });
    st.n.NH3 = 6;
    var out = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var box = h('div', { 'class': 'row' }), cvals = {};

    function compute() {
      var used = Object.keys(LIG).filter(function (x) { return st.n[x] > 0; });
      var qLig = 0, cn = 0; used.forEach(function (x) { qLig += LIG[x].q * st.n[x]; cn += LIG[x].d * st.n[x]; });
      var q = st.ox + qLig;
      var byName = used.slice().sort(function (a, b) { return LIG[a].en.localeCompare(LIG[b].en); });
      var byForm = used.slice().sort(function (a, b) { return LIG[a].key.toLowerCase().localeCompare(LIG[b].key.toLowerCase()); });
      function pref(x, i) {
        var n = st.n[x], L = LIG[x];
        if (n === 1) return L[i === 0 ? 'en' : 'as'] .replace(/^(.*)$/, function (m) { return (L.big || /-/.test(L.en)) && n === 1 ? (i === 0 ? '(' + m + ')' : '(' + m + ')') : m; });
        var useBis = L.big || /-/.test(L.en);
        var p = useBis ? PREB[n] : PRE[n];
        return p[i] + (useBis ? '(' + L[i === 0 ? 'en' : 'as'] + ')' : L[i === 0 ? 'en' : 'as']);
      }
      var enL = byName.map(function (x) { return pref(x, 0); }).join(''), asL = byName.map(function (x) { return pref(x, 1); }).join('');
      var M = MET[st.m], anion = q < 0, ox = '(' + roman(st.ox) + ')';
      var enM = (anion ? M.ate : M.en) + ox, asM = (anion ? M.asAte : M.as) + ox;
      var nameEn, nameAs, formula;
      var inner = '[' + st.m + byForm.map(function (x) { var L = LIG[x], n = st.n[x]; var f = L.poly ? (n > 1 || /^(en|ox)$/.test(L.key) ? '(' + L.f + ')' : '(' + L.f + ')') : L.f; return f + sub(n); }).join('') + ']' + chargeTxt(q);
      if (q > 0) { nameEn = enL + enM + ' chloride'; nameAs = asL + asM + ' ক্ল\'ৰাইড'; formula = inner + 'Cl' + sub(q); }
      else if (q < 0) { nameEn = 'potassium ' + enL + enM; nameAs = 'পটাছিয়াম ' + asL + asM; formula = 'K' + sub(-q) + inner; }
      else { nameEn = enL + (M.en + ox); nameAs = asL + (M.as + ox); formula = inner; }
      return { q: q, cn: cn, formula: formula, en: nameEn, as: nameAs, anion: anion };
    }
    function paint() {
      var r = compute(), tot = Object.keys(st.n).reduce(function (a, x) { return a + st.n[x]; }, 0);
      out.innerHTML = tot === 0 ? 'অন্ততঃ এটা লিগাণ্ড যোগ কৰক।' :
        'সংকেত: <span class="cfg">' + r.formula + '</span><br>' +
        'জটিল সত্তাৰ আধান = ' + st.ox + ' + (লিগাণ্ডৰ আধান) = <b>' + (r.q > 0 ? '+' + r.q : (r.q < 0 ? '−' + (-r.q) : '0')) + '</b> · সমন্বয়ী সংখ্যা = <b>' + r.cn + '</b>' + (r.cn !== 2 && r.cn !== 4 && r.cn !== 6 ? ' <span class="en">(অস্বাভাৱিক সংখ্যা)</span>' : '') + '<br>' +
        'IUPAC নাম: <b>' + r.as + '</b><br><span class="en">' + r.en + '</span><br>' +
        '<span class="en">নিয়ম: লিগাণ্ডবোৰ বৰ্ণানুক্ৰমে (নামত) → ধাতু → জাৰণ সংখ্যা (ৰোমান); এনায়নীয় সত্তাত ধাতুৰ নামৰ শেষত -ate; কেটায়নৰ নাম প্ৰথমে।</span>';
      Object.keys(cvals).forEach(function (x) { cvals[x].textContent = st.n[x]; });
    }
    function counter(x) {
      var L = LIG[x], val = h('output', { text: '0', style: 'min-width:1.5ch;text-align:center;font-weight:800' });
      cvals[x] = val;
      return h('div', { 'class': 'ctl' }, [h('span', { html: L.f, style: 'min-width:2.6em;font-weight:700' }), k.button('−', function () { st.n[x] = Math.max(0, st.n[x] - 1); paint(); }), val, k.button('+', function () { st.n[x] = Math.min(6, st.n[x] + 1); paint(); })]);
    }
    var msel = k.select('Metal', Object.keys(MET).map(function (x) { return { value: x, label: x }; }), st.m, function (v) { st.m = v; paint(); });
    var oxs = k.select('Oxidation state', [0, 1, 2, 3, 4].map(function (x) { return { value: x, label: '+' + x }; }), st.ox, function (v) { st.ox = +v; paint(); });
    function preset(label, m, ox, ligs) { return k.button(label, function () { st.m = m; st.ox = ox; Object.keys(st.n).forEach(function (x) { st.n[x] = 0; }); Object.keys(ligs).forEach(function (x) { st.n[x] = ligs[x]; }); msel.select.value = m; oxs.select.value = ox; paint(); }); }
    root.appendChild(h('div', { 'class': 'row' }, [msel.el, oxs.el]));
    var grid = h('div', { 'class': 'row' }); Object.keys(LIG).forEach(function (x) { grid.appendChild(counter(x)); });
    root.appendChild(grid);
    root.appendChild(h('div', { 'class': 'row' }, [h('span', { 'class': 'en', text: 'Examples:' }), preset('[Co(NH₃)₆]Cl₃', 'Co', 3, { NH3: 6 }), preset('K₃[Fe(CN)₆]', 'Fe', 3, { CN: 6 }), preset('[Co(NH₃)₄(H₂O)Cl]Cl₂', 'Co', 3, { NH3: 4, H2O: 1, Cl: 1 }), preset('[Co(en)₃]Cl₃', 'Co', 3, { en: 3 }), preset('K₃[Al(ox)₃]', 'Al', 3, { ox: 3 }), preset('[Ni(CO)₄]', 'Ni', 0, { CO: 4 })]));
    root.appendChild(out);
    paint();
  });

  /* ================================================================== 4. isomers */
  A.register('isomers', function (root, k) {
    var h = k.h;
    var TYPES = {
      cistrans: { n: 'Geometrical: [MA₄B₂] cis / trans' },
      facmer: { n: 'Geometrical: [MA₃B₃] fac / mer' },
      optical: { n: 'Optical: [M(AA)₃] d / l' },
      square: { n: 'Geometrical: square planar [MA₂B₂] cis / trans' }
    };
    var cur = 'cistrans', form = 0;
    var v = viewer(root, k, 'সমযোগীৰ ত্ৰিমাত্ৰিক গঠন', 320);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var A_ = '#1c7ed6', B_ = '#e8590c';
    function scene() {
      var atoms = [{ p: [0, 0, 0], r: 20, c: '#7a4bb0', l: 'M' }], bonds = [], arcs = [], i;
      if (cur === 'cistrans') {
        var Bidx = form === 0 ? [4, 5] : [0, 1];            /* cis: B on +z and +x?  trans: B on opposite vertices */
        var Bs = form === 0 ? [0, 2] : [4, 5];
        OCT.forEach(function (p, j) { var isB = Bs.indexOf(j) >= 0; atoms.push({ p: p, r: 12, c: isB ? B_ : A_, l: isB ? 'B' : 'A' }); bonds.push([0, j + 1]); });
        return { sc: { atoms: atoms, bonds: bonds }, txt: form === 0 ? '<b>cis-[MA₄B₂]</b> — দুটা B লিগাণ্ড ওচৰা-ওচৰিকৈ (90°)।' : '<b>trans-[MA₄B₂]</b> — দুটা B লিগাণ্ড বিপৰীত দিশত (180°)। উদাহৰণ: [Co(NH₃)₄Cl₂]⁺ ৰ ছিছ (বেঙুনীয়া) আৰু ট্ৰেন্স (সেউজীয়া)।' };
      }
      if (cur === 'facmer') {
        var Bs2 = form === 0 ? [0, 2, 4] : [0, 1, 2];     /* fac: three at one face; mer: a meridian (+x,-x,+y) */
        OCT.forEach(function (p, j) { var isB = Bs2.indexOf(j) >= 0; atoms.push({ p: p, r: 12, c: isB ? B_ : A_, l: isB ? 'B' : 'A' }); bonds.push([0, j + 1]); });
        return { sc: { atoms: atoms, bonds: bonds }, txt: form === 0 ? '<b>fac-[MA₃B₃]</b> (facial) — তিনিটা B এটা ফলকৰ তিনিটা কোণত (পৰস্পৰ 90°)।' : '<b>mer-[MA₃B₃]</b> (meridional) — তিনিটা B অষ্টফলকৰ মধ্যৰেখাত (ইয়াৰ দুটা বিপৰীত)। উদাহৰণ: [Co(NH₃)₃(NO₂)₃]।' };
      }
      if (cur === 'optical') {
        var sg = form === 0 ? 1 : -1;
        OCT.forEach(function (p, j) { atoms.push({ p: [p[0] * sg, p[1], p[2]], r: 11, c: A_, l: 'A' }); bonds.push([0, j + 1]); });
        /* chelates (+x,+y), (-x,+z), (-y,-z) → indices of OCT: +x=0,-x=1,+y=2,-y=3,+z=4,-z=5 */
        [[0, 2], [1, 4], [3, 5]].forEach(function (pr) { arcs.push([pr[0] + 1, pr[1] + 1, B_]); });
        return { sc: { atoms: atoms, bonds: bonds, arcs: arcs }, txt: form === 0 ? '<b>d (দক্ষিণাবৰ্তী) [M(AA)₃]</b> — তিনিটা দ্বিদন্তী লিগাণ্ড (কমলা চাপ) এটা সুঁতিৰ দৰে পাক খাই আছে।' : '<b>l (বামাবৰ্তী) [M(AA)₃]</b> — ইয়াৰ দাপোণ প্ৰতিবিম্ব; ওপৰৰটোৰ ওপৰত সমাৰোপণ কৰিব নোৱাৰি। ইহঁতক <b>এনানছিঅ\'মাৰ</b> বোলে আৰু ইহঁতে সমতল ধ্ৰুৱিত পোহৰ বিপৰীত দিশত ঘূৰায়। উদাহৰণ: [Co(en)₃]³⁺।' };
      }
      var Bsq = form === 0 ? [0, 2] : [0, 1];            /* cis: +x,+y  trans: +x,-x */
      [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]].forEach(function (p, j) { var isB = Bsq.indexOf(j) >= 0; atoms.push({ p: p, r: 12, c: isB ? B_ : A_, l: isB ? 'B' : 'A' }); bonds.push([0, j + 1]); });
      return { sc: { atoms: atoms, bonds: bonds }, txt: form === 0 ? '<b>cis-[Pt(NH₃)₂Cl₂]</b> — একে লিগাণ্ড ওচৰা-ওচৰি। (এই ছিছ-সমযোগীটোৱেই cisplatin, টিউমাৰ-ৰোধী।)' : '<b>trans-[Pt(NH₃)₂Cl₂]</b> — একে লিগাণ্ড বিপৰীত দিশত। চতুৰ্ফলকীয় [MA₂B₂] ত জ্যামিতীয় সমযোগিতা নাই।' };
    }
    function paint() { var r = scene(); v.set(r.sc); info.innerHTML = r.txt; }
    var sel = k.select('Type', Object.keys(TYPES).map(function (x) { return { value: x, label: TYPES[x].n }; }), cur, function (val) { cur = val; form = 0; paintB(); paint(); });
    var b0 = k.button('Isomer 1', function () { form = 0; paintB(); paint(); }), b1 = k.button('Isomer 2', function () { form = 1; paintB(); paint(); });
    function paintB() { b0.setAttribute('aria-pressed', String(form === 0)); b1.setAttribute('aria-pressed', String(form === 1)); b0.textContent = cur === 'optical' ? 'd form' : (cur === 'facmer' ? 'fac' : 'cis'); b1.textContent = cur === 'optical' ? 'l form' : (cur === 'facmer' ? 'mer' : 'trans'); }
    root.insertBefore(h('div', { 'class': 'row' }, [sel.el, b0, b1]), root.firstChild);
    root.appendChild(info);
    paintB(); paint(); v.start();
  });

  /* ================================================================== 5. valence bond theory orbital boxes */
  A.register('vbt', function (root, k) {
    var h = k.h, s = k.s;
    var CX = [
      { n: '[Co(NH₃)₆]³⁺', d: 6, hy: 'd2sp3', l: 'NH₃', spin: 'low', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[CoF₆]³⁻', d: 6, hy: 'sp3d2', l: 'F⁻', spin: 'high', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[Fe(CN)₆]³⁻', d: 5, hy: 'd2sp3', l: 'CN⁻', spin: 'low', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[FeF₆]³⁻', d: 5, hy: 'sp3d2', l: 'F⁻', spin: 'high', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[Fe(CN)₆]⁴⁻', d: 6, hy: 'd2sp3', l: 'CN⁻', spin: 'low', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[Mn(CN)₆]³⁻', d: 4, hy: 'd2sp3', l: 'CN⁻', spin: 'low', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[MnCl₆]³⁻', d: 4, hy: 'sp3d2', l: 'Cl⁻', spin: 'high', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[Ni(NH₃)₆]²⁺', d: 8, hy: 'sp3d2', l: 'NH₃', spin: 'high', cn: 6, g: 'অষ্টফলকীয়' },
      { n: '[Ni(CN)₄]²⁻', d: 8, hy: 'dsp2', l: 'CN⁻', spin: 'low', cn: 4, g: 'বৰ্গসমতলীয়' },
      { n: '[NiCl₄]²⁻', d: 8, hy: 'sp3', l: 'Cl⁻', spin: 'high', cn: 4, g: 'চতুৰ্ফলকীয়' },
      { n: '[Ni(CO)₄]', d: 10, hy: 'sp3', l: 'CO', spin: 'high', cn: 4, g: 'চতুৰ্ফলকীয়' }
    ];
    var cur = 0;
    var svg = s('svg', { viewBox: '0 0 450 100', 'class': 'anim-svg', role: 'img', 'aria-label': 'সংকৰণ আৰু অৰবিটেলৰ বাকচ চিত্ৰ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });

    function occupancy(c) {
      /* returns electrons per 3d box: array of 5 numbers (0-2) */
      var e = c.d, b = [0, 0, 0, 0, 0], i;
      if (e >= 10) return [2, 2, 2, 2, 2];
      if (c.hy === 'd2sp3') { /* two d boxes must stay empty: pair into three */ for (i = 0; i < 3 && e > 0; i++) { b[i] = 1; e--; } for (i = 0; i < 3 && e > 0; i++) { b[i] = 2; e--; } return b; }
      if (c.hy === 'dsp2') { for (i = 0; i < 4 && e > 0; i++) { b[i] = 1; e--; } for (i = 0; i < 4 && e > 0; i++) { b[i] = 2; e--; } return b; }
      for (i = 0; i < 5 && e > 0; i++) { b[i] = 1; e--; } for (i = 0; i < 5 && e > 0; i++) { b[i] = 2; e--; } return b;   /* Hund */
    }
    function hybIdx(c) {
      /* which of: d(0-4) s(5) p(6-8) d4(9-13) are hybridised */
      if (c.hy === 'd2sp3') return [3, 4, 5, 6, 7, 8];
      if (c.hy === 'sp3d2') return [5, 6, 7, 8, 9, 10];
      if (c.hy === 'sp3') return [5, 6, 7, 8];
      return [4, 5, 6, 7];                  /* dsp2: one 3d, 4s, two 4p */
    }
    function paint() {
      var c = CX[cur], occ = occupancy(c), hy = hybIdx(c), x0 = 10, w = 26, gap = 3, y = 56;
      svg.innerHTML = '';
      var labels = [['3d', 0, 4], ['4s', 5, 5], ['4p', 6, 8], ['4d', 9, 13]];
      labels.forEach(function (L) { var xa = x0 + L[1] * (w + gap) + (L[1] >= 5 ? 8 : 0) + (L[1] >= 6 ? 8 : 0) + (L[1] >= 9 ? 8 : 0); svg.appendChild(s('text', { x: xa, y: 40, 'font-size': 12, 'font-weight': 700, style: 'fill:var(--text)', text: L[0] })); });
      var unp = 0;
      for (var i = 0; i < 14; i++) {
        var x = x0 + i * (w + gap) + (i >= 5 ? 8 : 0) + (i >= 6 ? 8 : 0) + (i >= 9 ? 8 : 0), isHy = hy.indexOf(i) >= 0;
        svg.appendChild(s('rect', { x: x, y: y, width: w, height: 30, rx: 4, fill: 'none', style: 'stroke:' + (isHy ? 'var(--accent)' : 'var(--border)') + ';stroke-width:' + (isHy ? 3 : 1.5) }));
        if (i < 5) {
          var e = occ[i];
          if (e >= 1) svg.appendChild(s('text', { x: x + 5, y: y + 22, 'font-size': 18, 'font-weight': 800, style: 'fill:var(--electron)', text: '↑' }));
          if (e === 2) svg.appendChild(s('text', { x: x + 14, y: y + 22, 'font-size': 18, 'font-weight': 800, style: 'fill:var(--proton)', text: '↓' }));
          if (e === 1) unp++;
        } else if (isHy) {
          svg.appendChild(s('text', { x: x + 3, y: y + 22, 'font-size': 18, 'font-weight': 800, style: 'fill:var(--brand)', text: '↑↓' }));
        }
      }
      var mu = Math.sqrt(unp * (unp + 2)), inner = c.hy === 'd2sp3' || c.hy === 'dsp2';
      info.innerHTML = '<b>' + c.n + '</b> · ধাতুৰ d-ইলেক্ট্ৰন = d<sup>' + c.d + '</sup> · লিগাণ্ড: ' + c.l + ' · সমন্বয়ী সংখ্যা ' + c.cn + '<br>' +
        'সংকৰণ: <b>' + c.hy.replace('d2sp3', 'd²sp³').replace('sp3d2', 'sp³d²').replace('dsp2', 'dsp²').replace('sp3', 'sp³') + '</b> → ' + c.g + ' · ' +
        (c.hy === 'sp3' ? '' : (inner ? '<b>অন্তঃ অৰবিটেল</b> (inner) জটিল — নিম্ন স্পিন' : '<b>বহিঃ অৰবিটেল</b> (outer, 4d ব্যৱহাৰ) জটিল — উচ্চ স্পিন')) + '<br>' +
        'অযুগ্ম ইলেক্ট্ৰন n = <b>' + unp + '</b> · μ = √(n(n+2)) = <b>' + mu.toFixed(2) + ' BM</b> · ' + (unp ? '<b>অনুচুম্বকীয়</b>' : '<b>অপচুম্বকীয়</b>');
    }
    var sel = k.select('Complex', CX.map(function (x, i) { return { value: i, label: x.n }; }), cur, function (v) { cur = +v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el, k.button('◀', function () { cur = (cur + CX.length - 1) % CX.length; sel.select.value = cur; paint(); }), k.button('▶', function () { cur = (cur + 1) % CX.length; sel.select.value = cur; paint(); })]));
    root.appendChild(h('div', { 'class': 'legend' }, [
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--accent)' }), 'কমলা ঘেৰ = সংকৰিত অৰবিটেল']),
      h('span', {}, [h('span', { 'class': 'dot', style: 'background:var(--brand)' }), '↑↓ = লিগাণ্ডৰ ইলেক্ট্ৰন যোৰ']),
      h('span', { text: 'নীলা / ৰঙা তীৰ = ধাতুৰ ইলেক্ট্ৰন' })]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6. crystal field splitting */
  A.register('cft', function (root, k) {
    var h = k.h, s = k.s;
    var ION = ['', 'Ti³⁺', 'V³⁺', 'Cr³⁺', 'Cr²⁺ / Mn³⁺', 'Mn²⁺ / Fe³⁺', 'Fe²⁺ / Co³⁺', 'Co²⁺', 'Ni²⁺', 'Cu²⁺'];
    var SERIES = [['I⁻', 8], ['Br⁻', 9], ['SCN⁻', 10], ['Cl⁻', 11], ['F⁻', 13], ['OH⁻', 14], ['C₂O₄²⁻', 15], ['H₂O', 16], ['EDTA⁴⁻', 17], ['NH₃', 20], ['en', 22], ['CN⁻', 28], ['CO', 32]];
    var P = 18, st = { n: 6, lig: 7, geo: 'oct' };
    var svg = s('svg', { viewBox: '0 0 400 230', 'class': 'anim-svg', role: 'img', 'aria-label': 'ক্ৰিষ্টেল ক্ষেত্ৰ বিভাজন আৰু d-ইলেক্ট্ৰনৰ বিন্যাস' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function fillOct(n, low) {
      if (!low) { var t = Math.min(n, 3), e = Math.min(Math.max(n - 3, 0), 2), r = Math.max(n - 5, 0); return [t + Math.min(r, 3), e + Math.max(r - 3, 0)]; }
      var t2 = Math.min(n, 6); return [t2, n - t2];
    }
    function fillTet(n) {
      var e = Math.min(n, 2), t = Math.min(Math.max(n - 2, 0), 3), r = Math.max(n - 5, 0); return [e + Math.min(r, 2), t + Math.max(r - 2, 0)];
    }
    function arrows(g, x, y, e, boxes) {
      /* e electrons across `boxes` boxes, Hund then pairing */
      var up = Math.min(e, boxes), dn = Math.max(0, e - boxes);
      for (var i = 0; i < boxes; i++) {
        if (i < up) g.appendChild(s('text', { x: x + i * 40 + 3, y: y - 4, 'font-size': 20, 'font-weight': 800, style: 'fill:var(--electron)', text: '↑' }));
        if (i < dn) g.appendChild(s('text', { x: x + i * 40 + 17, y: y - 4, 'font-size': 20, 'font-weight': 800, style: 'fill:var(--proton)', text: '↓' }));
      }
    }
    function unpaired(e, b) { return e <= b ? e : 2 * b - e; }
    function paint() {
      var n = st.n, do_ = SERIES[st.lig][1], low = do_ > P, oct = st.geo === 'oct', dt = do_ * 4 / 9;
      var lo, hi, lowN, hiN, dlt, cfse;
      svg.innerHTML = '';
      var D = oct ? do_ : dt, sep = 50 + Math.min(D, 32) * 2.2, yBase = 190, yLow = yBase - (oct ? 0 : 0), yHi = yLow - sep;
      var g = s('g');
      if (oct) {
        var f = fillOct(n, low); lowN = f[0]; hiN = f[1];                     /* t2g , eg */
        for (var i = 0; i < 3; i++) g.appendChild(s('line', { x1: 40 + i * 40, x2: 70 + i * 40, y1: yLow, y2: yLow, style: 'stroke:var(--text)', 'stroke-width': 3 }));
        for (i = 0; i < 2; i++) g.appendChild(s('line', { x1: 60 + i * 40, x2: 90 + i * 40, y1: yHi, y2: yHi, style: 'stroke:var(--text)', 'stroke-width': 3 }));
        arrows(g, 40, yLow, lowN, 3); arrows(g, 60, yHi, hiN, 2);
        g.appendChild(s('text', { x: 162, y: yLow + 4, 'font-size': 14, style: 'fill:var(--text)', text: 't₂g' })); g.appendChild(s('text', { x: 162, y: yHi + 4, 'font-size': 14, style: 'fill:var(--text)', text: 'e_g' }));
        cfse = -0.4 * lowN + 0.6 * hiN;
      } else {
        var f2 = fillTet(n); lowN = f2[0]; hiN = f2[1];                       /* e , t2 */
        for (i = 0; i < 2; i++) g.appendChild(s('line', { x1: 60 + i * 40, x2: 90 + i * 40, y1: yLow, y2: yLow, style: 'stroke:var(--text)', 'stroke-width': 3 }));
        for (i = 0; i < 3; i++) g.appendChild(s('line', { x1: 40 + i * 40, x2: 70 + i * 40, y1: yHi, y2: yHi, style: 'stroke:var(--text)', 'stroke-width': 3 }));
        arrows(g, 60, yLow, lowN, 2); arrows(g, 40, yHi, hiN, 3);
        g.appendChild(s('text', { x: 162, y: yLow + 4, 'font-size': 14, style: 'fill:var(--text)', text: 'e' })); g.appendChild(s('text', { x: 162, y: yHi + 4, 'font-size': 14, style: 'fill:var(--text)', text: 't₂' }));
        cfse = -0.6 * lowN + 0.4 * hiN;
      }
      svg.appendChild(g);
      svg.appendChild(s('line', { x1: 200, x2: 200, y1: yLow, y2: yHi, style: 'stroke:var(--proton)', 'stroke-width': 2 }));
      svg.appendChild(s('text', { x: 210, y: (yLow + yHi) / 2 + 4, 'font-size': 14, 'font-weight': 700, style: 'fill:var(--proton)', text: oct ? 'Δ₀' : 'Δₜ = (4/9)Δ₀' }));
      svg.appendChild(s('text', { x: 10, y: 20, 'font-size': 13, 'font-weight': 700, style: 'fill:var(--text)', text: (oct ? 'অষ্টফলকীয়' : 'চতুৰ্ফলকীয়') + ' ক্ষেত্ৰ — d' + n + ' (' + ION[n] + ')' }));
      var un = oct ? unpaired(lowN, 3) + unpaired(hiN, 2) : unpaired(lowN, 2) + unpaired(hiN, 3), mu = Math.sqrt(un * (un + 2));
      var spinTxt = oct ? (n >= 4 && n <= 7 ? (low ? '<b>নিম্ন স্পিন</b> (Δ₀ > P, তীব্ৰ ক্ষেত্ৰ লিগাণ্ড)' : '<b>উচ্চ স্পিন</b> (Δ₀ < P, মৃদু ক্ষেত্ৰ লিগাণ্ড)') : 'd' + n + ' ত উচ্চ/নিম্ন স্পিনৰ পাৰ্থক্য নাই') : 'চতুৰ্ফলকীয়ত Δₜ সৰু (< P), গতিকে সদায় <b>উচ্চ স্পিন</b>';
      info.innerHTML = (oct ? 'লিগাণ্ড <b>' + SERIES[st.lig][0] + '</b> · Δ₀ ≈ ' + do_ + ' একক (P = ' + P + ' একক) — ' : 'Δₜ ≈ ' + dt.toFixed(1) + ' একক — ') + spinTxt + '<br>' +
        (oct ? 't<sub>2g</sub><sup>' + lowN + '</sup> e<sub>g</sub><sup>' + hiN + '</sup>' : 'e<sup>' + lowN + '</sup> t<sub>2</sub><sup>' + hiN + '</sup>') + ' · অযুগ্ম ইলেক্ট্ৰন = <b>' + un + '</b> · μ ≈ <b>' + mu.toFixed(2) + ' BM</b> · CFSE = <b>' + cfse.toFixed(1) + (oct ? ' Δ₀' : ' Δ₀ × 4/9 ' ) + '</b>' +
        '<br><span class="en">(একক দৃষ্টান্তমূলক — প্ৰকৃত Δ₀ আৰু P ধাতুৰ আয়ন অনুসৰি সলনি হয়।)</span>';
    }
    var ns = k.slider('d electrons', 1, 9, 1, st.n, function (v) { st.n = v; paint(); });
    var ls = k.select('Ligand', SERIES.map(function (x, i) { return { value: i, label: x[0] + (i === 0 ? ' (weak field)' : (i === SERIES.length - 1 ? ' (strong field)' : '')) }; }), st.lig, function (v) { st.lig = +v; paint(); });
    var go = k.button('Octahedral', function () { st.geo = 'oct'; gB(); paint(); }), gt = k.button('Tetrahedral', function () { st.geo = 'tet'; gB(); paint(); });
    function gB() { go.setAttribute('aria-pressed', String(st.geo === 'oct')); gt.setAttribute('aria-pressed', String(st.geo === 'tet')); }
    root.appendChild(h('div', { 'class': 'row' }, [go, gt])); root.appendChild(h('div', { 'class': 'row' }, [ns.el, ls.el]));
    root.appendChild(info);
    root.appendChild(h('div', { 'class': 'legend' }, [h('span', { text: 'স্পেক্ট্ৰ\'ৰাসায়নিক শ্ৰেণী: I⁻ < Br⁻ < SCN⁻ < Cl⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < EDTA⁴⁻ < NH₃ < en < CN⁻ < CO' })]));
    gB(); paint();
  });

  /* ================================================================== 7. colour of complexes */
  function wl(nm) {
    var r = 0, g = 0, b = 0;
    if (nm < 380) return null;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else if (nm <= 750) { r = 1; } else return null;
    return 'rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')';
  }
  A.register('colour', function (root, k) {
    var h = k.h, s = k.s;
    var CX = [
      { n: '[CoCl(NH₃)₅]²⁺', nm: 535, abs: 'হালধীয়া-সেউজীয়া', obs: 'বেঙুনীয়া', c: '#c86bb4' },
      { n: '[Co(NH₃)₅(H₂O)]³⁺', nm: 500, abs: 'নীলা-সেউজীয়া', obs: 'ৰঙা', c: '#e0212b' },
      { n: '[Co(NH₃)₆]³⁺', nm: 475, abs: 'নীলা', obs: 'হালধীয়া-কমলা', c: '#f2a900' },
      { n: '[Co(CN)₆]³⁻', nm: 310, abs: 'অতিবেঙুনীয়া (অদৃশ্য)', obs: 'শেঁতা হালধীয়া', c: '#f6f1a8' },
      { n: '[Cu(H₂O)₄]²⁺', nm: 600, abs: 'কমলা-ৰঙা', obs: 'নীলা', c: '#2f5fd0' },
      { n: '[Ti(H₂O)₆]³⁺', nm: 498, abs: 'নীলা-সেউজীয়া', obs: 'বেঙুনীয়া / পূৰৈয়া', c: '#a0399a' }
    ];
    var EN = [
      { n: 0, f: '[Ni(H₂O)₆]²⁺', c: '#4cae5a', t: 'সেউজীয়া' }, { n: 1, f: '[Ni(H₂O)₄(en)]²⁺', c: '#b5dcf0', t: 'শেঁতা নীলা' },
      { n: 2, f: '[Ni(H₂O)₂(en)₂]²⁺', c: '#7b8cd6', t: 'নীলা / পূৰৈয়া' }, { n: 3, f: '[Ni(en)₃]²⁺', c: '#a455c9', t: 'বেঙুনীয়া' }
    ];
    var cur = 2, en = 0;
    var svg = s('svg', { viewBox: '0 0 400 190', 'class': 'anim-svg', role: 'img', 'aria-label': 'শোষিত তৰংগদৈৰ্ঘ্য আৰু জটিল যৌগৰ বৰণ' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    function paint() {
      var c = CX[cur], abs = wl(c.nm), e = EN[en]; svg.innerHTML = '';
      /* spectrum bar */
      for (var nm = 400; nm <= 700; nm += 4) svg.appendChild(s('rect', { x: 20 + (nm - 400) / 300 * 360, y: 28, width: 5, height: 26, fill: wl(nm) }));
      svg.appendChild(s('text', { x: 20, y: 20, 'font-size': 11, style: 'fill:var(--muted)', text: '400 nm' })); svg.appendChild(s('text', { x: 380, y: 20, 'text-anchor': 'end', 'font-size': 11, style: 'fill:var(--muted)', text: '700 nm' }));
      var px = 20 + clamp((c.nm - 400) / 300, 0, 1) * 360;
      svg.appendChild(s('line', { x1: px, x2: px, y1: 22, y2: 62, style: 'stroke:var(--text)', 'stroke-width': 3 }));
      svg.appendChild(s('text', { x: clamp(px, 40, 360), y: 76, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--text)', text: c.nm + ' nm' + (c.nm < 380 ? ' (UV)' : '') }));
      svg.appendChild(s('rect', { x: 20, y: 90, width: 70, height: 36, rx: 6, fill: abs || '#8a8a8a', style: 'stroke:var(--border)' })); svg.appendChild(s('text', { x: 100, y: 112, 'font-size': 12, style: 'fill:var(--text)', text: '← শোষিত বৰণ' }));
      svg.appendChild(s('rect', { x: 210, y: 90, width: 70, height: 36, rx: 6, fill: c.c, style: 'stroke:var(--border)' })); svg.appendChild(s('text', { x: 290, y: 112, 'font-size': 12, style: 'fill:var(--text)', text: '← দেখা বৰণ' }));
      for (var i = 0; i < 4; i++) {
        var x = 30 + i * 56, on = i === en;
        svg.appendChild(s('rect', { x: x, y: 142, width: 30, height: 38, rx: 6, fill: EN[i].c, style: 'stroke:' + (on ? 'var(--accent)' : 'var(--border)') + ';stroke-width:' + (on ? 3.5 : 1.5) }));
        svg.appendChild(s('text', { x: x + 15, y: 138, 'text-anchor': 'middle', 'font-size': 10, style: 'fill:var(--muted)', text: i + ':1' }));
      }
      svg.appendChild(s('text', { x: 262, y: 166, 'font-size': 11, style: 'fill:var(--muted)', text: 'en : Ni ক্ৰম বঢ়ালে' }));
      var eV = 1240 / c.nm;
      info.innerHTML = '<b>' + c.n + '</b> — শোষিত পোহৰ ≈ <b>' + c.nm + ' nm</b> (' + c.abs + ') → ΔE = hc/λ ≈ ' + eV.toFixed(2) + ' eV (d–d সংক্ৰমণ t<sub>2g</sub> → e<sub>g</sub>)<br>দৃশ্য বৰণ = শোষিত বৰণৰ <b>পৰিপূৰক</b>: <b>' + c.obs + '</b><br>' +
        'Ni(II) ত en ৰ লগত: <b>' + e.f + '</b> — ' + e.t + ' (লিগাণ্ড সলনি কৰিলে Δ₀ সলনি হয়, গতিকে বৰণ সলনি হয়)<br><span class="en">লিগাণ্ড নথকা পদাৰ্থত d অৰবিটেলৰ বিভাজন নঘটে — সেয়ে অনাৰ্দ্ৰ CuSO₄ বগা আৰু CuSO₄·5H₂O নীলা।</span>';
    }
    var sel = k.select('Complex', CX.map(function (x, i) { return { value: i, label: x.n }; }), cur, function (v) { cur = +v; paint(); });
    var es = k.slider('en : Ni ratio', 0, 3, 1, en, function (v) { en = v; paint(); });
    root.appendChild(h('div', { 'class': 'row' }, [sel.el])); root.appendChild(h('div', { 'class': 'row' }, [es.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 8. synergic bonding in carbonyls */
  A.register('synergic', function (root, k) {
    var h = k.h, s = k.s, t = 0, mode = 'both';
    var svg = s('svg', { viewBox: '0 0 400 200', 'class': 'anim-svg', role: 'img', 'aria-label': 'ধাতু কাৰ্বনিলত σ-দান আৰু π-প্ৰতিদান' });
    root.appendChild(svg);
    var info = h('div', { 'class': 'readout', 'aria-live': 'polite' });
    var sig, pi, mC;
    function build() {
      svg.innerHTML = '';
      svg.appendChild(s('ellipse', { cx: 90, cy: 100, rx: 52, ry: 52, style: 'fill:#7a4bb0;opacity:.2;stroke:#7a4bb0' }));
      svg.appendChild(s('text', { x: 90, y: 106, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, style: 'fill:#7a4bb0', text: 'M' }));
      svg.appendChild(s('text', { x: 90, y: 168, 'text-anchor': 'middle', 'font-size': 11, style: 'fill:var(--muted)', text: 'ধাতুৰ পূৰ্ণ d অৰবিটেল' }));
      svg.appendChild(s('circle', { cx: 230, cy: 100, r: 20, style: 'fill:var(--proton)' })); svg.appendChild(s('text', { x: 230, y: 106, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, style: 'fill:#fff', text: 'C' }));
      svg.appendChild(s('circle', { cx: 330, cy: 100, r: 20, style: 'fill:var(--electron)' })); svg.appendChild(s('text', { x: 330, y: 106, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, style: 'fill:#fff', text: 'O' }));
      svg.appendChild(s('line', { x1: 250, x2: 310, y1: 94, y2: 94, style: 'stroke:var(--text)', 'stroke-width': 3 })); svg.appendChild(s('line', { x1: 250, x2: 310, y1: 106, y2: 106, style: 'stroke:var(--text)', 'stroke-width': 3 }));
      svg.appendChild(s('text', { x: 280, y: 148, 'text-anchor': 'middle', 'font-size': 11, style: 'fill:var(--muted)', text: 'CO ৰ খালী π* অৰবিটেল' }));
      sig = s('path', { d: 'M205 78 Q150 48 142 78', fill: 'none', style: 'stroke:var(--brand);stroke-width:4', 'stroke-dasharray': '10 7', 'marker-end': 'url(#ah)' });
      pi = s('path', { d: 'M140 124 Q190 160 222 126', fill: 'none', style: 'stroke:var(--alpha);stroke-width:4', 'stroke-dasharray': '10 7' });
      svg.appendChild(sig); svg.appendChild(pi);
      svg.appendChild(s('text', { x: 172, y: 44, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--brand)', text: 'σ: C → M' }));
      svg.appendChild(s('text', { x: 180, y: 182, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, style: 'fill:var(--alpha)', text: 'π: M → C (π* লৈ)' }));
      paint();
    }
    function paint() {
      sig.setAttribute('visibility', mode === 'pi' ? 'hidden' : 'visible'); pi.setAttribute('visibility', mode === 'sigma' ? 'hidden' : 'visible');
      info.innerHTML = (mode === 'sigma' ? '<b>σ-বান্ধনি:</b> কাৰ্বনিলৰ কাৰ্বন পৰমাণুৰ এযোৰ অনাবদ্ধ ইলেক্ট্ৰন ধাতুৰ খালী অৰবিটেললৈ দান হয় (M ← C)।' :
        (mode === 'pi' ? '<b>π-বান্ধনি:</b> ধাতুৰ পূৰ্ণ d অৰবিটেলৰ এযোৰ ইলেক্ট্ৰন CO ৰ খালী এন্টিবণ্ডিং π* অৰবিটেললৈ দান হয় (M → C)। ইয়াক <b>ঘূৰি দান</b> (back-donation) বোলে।' :
          '<b>সম্মিলিত ক্ৰিয়া (synergic effect):</b> σ-দানে ধাতুত ইলেক্ট্ৰন ঘনত্ব বঢ়ায় আৰু π-প্ৰতিদানে তাক কমায়; দুয়োটা প্ৰক্ৰিয়াই ইটোৱে সিটোক শক্তিশালী কৰে। ফলত M–C বান্ধনি শক্তিশালী আৰু C–O বান্ধনি অলপ দুৰ্বল হয়।')) +
        '<br><span class="en">উদাহৰণ: [Ni(CO)₄] (চতুৰ্ফলকীয়), [Fe(CO)₅] (ত্ৰিভুজীয় দ্বিপিৰামিডীয়), [Cr(CO)₆] (অষ্টফলকীয়) — এই তিনিটাতে ধাতুৰ জাৰণ অৱস্থা 0।</span>';
    }
    function tick(dt) { t += dt * 40; var d = -t; sig.setAttribute('stroke-dashoffset', d); pi.setAttribute('stroke-dashoffset', -d); }
    var lp = k.loop(root, tick);
    function btn(label, m) { var b = k.button(label, function () { mode = m; [bs, bp, bb].forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); paint(); }); return b; }
    var bs = btn('σ donation', 'sigma'), bp = btn('π back-donation', 'pi'), bb = btn('Both (synergic)', 'both'); bb.setAttribute('aria-pressed', 'true');
    root.appendChild(h('div', { 'class': 'row' }, [bs, bp, bb]));
    root.appendChild(info);
    build(); if (!k.reduceMotion) lp.start();
  });
})();
