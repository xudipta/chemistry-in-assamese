/* Animations for Class 11, Chapter 5: Thermodynamics (তাপগতি বিজ্ঞান).
   Registered: thermo-system, thermo-firstlaw, thermo-pvwork, thermo-calorimeter, thermo-enthalpy,
               thermo-hess, thermo-cycle, thermo-entropy, thermo-gibbs, thermo-gibbsk
   Controls are English (app UI); read-outs follow the reader's language: L("assamese", "english"). */
(function () {
  'use strict';
  var A = window.ChemAnim;
  var L = A.t;
  var R = 8.314;            /* J K-1 mol-1 */
  var RLA = 0.08206;        /* L atm K-1 mol-1 */
  var LATM = 101.325;       /* J per L atm */

  function txt(s, x, y, size, anchor, style, text, weight) {
    return s("text", { x: x, y: y, "font-size": size, "text-anchor": anchor || "start", "font-weight": weight || 400, style: style || "fill:var(--text)", text: text });
  }
  function fx(x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace("-", "−"); }
  function sg(x, d) { var v = Math.round(Math.abs(x) * Math.pow(10, d)) / Math.pow(10, d); return (x > 0 && v > 0 ? "+" : (x < 0 && v > 0 ? "−" : "")) + v.toFixed(d); }
  function sci(x) {
    if (x === 0) return "0";
    var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), m = x / Math.pow(10, e);
    if (Math.abs(e) < 3) return String(Math.round(x * 1000) / 1000);
    return m.toFixed(2) + " × 10<sup>" + e + "</sup>";
  }
  function setSlider(sl, v) { sl.input.value = v; sl.out.textContent = sl.input.value; }
  function arrow(s, svg, x1, y1, x2, y2, color, w) {
    var a = Math.atan2(y2 - y1, x2 - x1), hl = 9;
    svg.appendChild(s("line", { x1: x1, y1: y1, x2: x2, y2: y2, style: "stroke:" + color, "stroke-width": w || 3, "stroke-linecap": "round" }));
    svg.appendChild(s("polygon", { points: x2 + "," + y2 + " " + (x2 - hl * Math.cos(a - 0.45)) + "," + (y2 - hl * Math.sin(a - 0.45)) + " " + (x2 - hl * Math.cos(a + 0.45)) + "," + (y2 - hl * Math.sin(a + 0.45)), style: "fill:" + color }));
  }

  /* ================================================================== 1. system, surroundings, boundary */
  A.register('thermo-system', function (root, k) {
    var h = k.h, s = k.s;
    var T = {
      open: { m: 1, e: 1, name: L("মুক্ত তন্ত্ৰ", "Open system"), ex: L("মুখ খোলা বিকাৰত উত্তপ্ত পানী", "hot water in an open beaker"), why: L("পদাৰ্থ আৰু শক্তি দুয়ো আদান-প্ৰদান কৰিব পাৰে (বাষ্প ওলায়, তাপো যায়)।", "Both matter and energy can cross (vapour escapes, heat flows).") },
      closed: { m: 0, e: 1, name: L("আবদ্ধ তন্ত্ৰ", "Closed system"), ex: L("তাপ পৰিবাহী পাত্ৰত বন্ধ কৰি ৰখা উত্তপ্ত পানী", "hot water sealed in a heat-conducting vessel"), why: L("শক্তি (তাপ) যাব পাৰে, কিন্তু পদাৰ্থ নাযায়।", "Energy (heat) can cross, matter cannot.") },
      isolated: { m: 0, e: 0, name: L("অন্তৰিত তন্ত্ৰ", "Isolated system"), ex: L("আদৰ্শ থাৰ্মোফ্লাস্ক (ব্যৱহাৰিকভাৱে প্ৰায়)", "an (ideal) sealed thermos flask"), why: L("পদাৰ্থ আৰু শক্তি কোনোটোৱেই সীমা পাৰ নহয়।", "Neither matter nor energy can cross the boundary.") }
    };
    var st = { t: "open", test: null };
    var svg = s("svg", { viewBox: "0 0 420 190", "class": "anim-svg", role: "img", "aria-label": L("তন্ত্ৰ আৰু পাৰিপাৰ্শ্বিক", "System and surroundings") });
    root.appendChild(svg);
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    function paint() {
      var t = T[st.t], ok = "var(--ok)", bad = "var(--bad)";
      svg.innerHTML = "";
      svg.appendChild(s("rect", { x: 4, y: 4, width: 412, height: 182, rx: 10, style: "fill:var(--surface-2);stroke:var(--border)" }));
      svg.appendChild(txt(s, 14, 22, 11, "start", "fill:var(--muted)", L("পাৰিপাৰ্শ্বিক", "Surroundings"), 600));
      svg.appendChild(s("rect", { x: 140, y: 50, width: 140, height: 100, rx: 8, style: "fill:var(--brand-soft);stroke:var(--text)", "stroke-width": st.t === "isolated" ? 7 : (st.t === "closed" ? 3 : 2), "stroke-dasharray": st.t === "open" ? "7 5" : "none" }));
      if (st.t === "isolated") svg.appendChild(s("rect", { x: 134, y: 44, width: 152, height: 112, rx: 11, style: "fill:none;stroke:var(--muted)", "stroke-width": 2 }));
      svg.appendChild(txt(s, 210, 96, 14, "middle", "fill:var(--text)", L("তন্ত্ৰ", "System"), 700));
      svg.appendChild(txt(s, 210, 116, 10, "middle", "fill:var(--muted)", L("সীমা: ", "boundary: ") + (st.t === "open" ? L("খোলা", "open") : (st.t === "closed" ? L("আবদ্ধ", "sealed") : L("অন্তৰক", "insulated")))));
      svg.appendChild(txt(s, 18, 80, 11, "start", "fill:var(--electron)", L("পদাৰ্থ", "matter"), 600));
      svg.appendChild(txt(s, 402, 130, 11, "end", "fill:var(--alpha)", L("শক্তি (তাপ)", "energy (heat)"), 600));
      if (st.test === "m") {
        if (t.m) { arrow(s, svg, 20, 92, 170, 92, ok, 4); } else { arrow(s, svg, 20, 92, 128, 92, bad, 4); svg.appendChild(txt(s, 134, 100, 22, "middle", "fill:var(--bad)", "✘", 700)); }
      }
      if (st.test === "e") {
        if (t.e) { arrow(s, svg, 400, 142, 250, 142, ok, 4); } else { arrow(s, svg, 400, 142, 292, 142, bad, 4); svg.appendChild(txt(s, 286, 150, 22, "middle", "fill:var(--bad)", "✘", 700)); }
      }
      var res = st.test === "m" ? (t.m ? L("পদাৰ্থ সীমা পাৰ হ’ল।", "Matter crossed the boundary.") : L("পদাৰ্থ আটকাই থ’লে।", "Matter was blocked.")) :
        (st.test === "e" ? (t.e ? L("তাপ সীমা পাৰ হ’ল।", "Heat crossed the boundary.") : L("তাপ আটকাই থ’লে।", "Heat was blocked.")) : "");
      info.innerHTML = "<b>" + t.name + "</b> — " + t.ex + "<br>" + t.why + (res ? "<br><b>" + res + "</b>" : "") +
        "<br>" + L("বিশ্বব্ৰহ্মাণ্ড = তন্ত্ৰ + পাৰিপাৰ্শ্বিক", "Universe = system + surroundings");
    }
    var sel = k.select("System type", [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }, { value: "isolated", label: "Isolated" }], st.t, function (v) { st.t = v; st.test = null; paint(); });
    root.appendChild(h("div", { "class": "row" }, [sel.el, k.button("Try to move matter in", function () { st.test = "m"; paint(); }), k.button("Try to move heat in", function () { st.test = "e"; paint(); })]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 2. first law: dU = q + w */
  A.register('thermo-firstlaw', function (root, k) {
    var h = k.h, s = k.s;
    var P = {
      custom: [701, -394, L("নিজে বাছক", "Your own values")],
      ex57: [701, -394, L("উদাহৰণ 5.7: 701 J শোষণ, 394 J কাৰ্য কৰে", "Example 5.7: absorbs 701 J, does 394 J of work")],
      adi: [0, 300, L("ৰুদ্ধতাপ সংকোচন (q = 0)", "Adiabatic compression (q = 0)")],
      iso: [250, -250, L("আদৰ্শ গেছৰ সমোষ্ণ প্ৰসাৰণ (ΔU = 0)", "Ideal-gas isothermal expansion (ΔU = 0)")],
      vac: [0, 0, L("শূন্যলৈ মুক্ত প্ৰসাৰণ (q = 0, w = 0)", "Free expansion into vacuum (q = 0, w = 0)")],
      heat: [500, 0, L("স্থিৰ আয়তনত গৰম কৰা (w = 0)", "Heating at constant volume (w = 0)")]
    };
    var st = { q: 701, w: -394 };
    var svg = s("svg", { viewBox: "0 0 420 190", "class": "anim-svg", role: "img", "aria-label": L("প্ৰথম সূত্ৰ: ΔU = q + w", "First law: ΔU = q + w") });
    root.appendChild(svg);
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    var sq, sw, sp;
    function paint() {
      var q = st.q, w = st.w, du = q + w, sc = 90 / 800;
      svg.innerHTML = "";
      svg.appendChild(s("rect", { x: 160, y: 30, width: 100, height: 70, rx: 8, style: "fill:var(--brand-soft);stroke:var(--text)", "stroke-width": 2 }));
      svg.appendChild(txt(s, 210, 62, 12, "middle", "fill:var(--text)", L("তন্ত্ৰ", "system"), 700));
      svg.appendChild(txt(s, 210, 80, 11, "middle", "fill:var(--muted)", "U"));
      /* q arrow on the left */
      svg.appendChild(txt(s, 70, 20, 11, "middle", "fill:var(--alpha)", "q = " + sg(q, 0) + " J", 700));
      if (q > 0) arrow(s, svg, 20, 65, 152, 65, "var(--alpha)", 4); else if (q < 0) arrow(s, svg, 152, 65, 20, 65, "var(--alpha)", 4);
      /* w arrow on the right */
      svg.appendChild(txt(s, 350, 20, 11, "middle", "fill:var(--electron)", "w = " + sg(w, 0) + " J", 700));
      if (w > 0) arrow(s, svg, 400, 65, 268, 65, "var(--electron)", 4); else if (w < 0) arrow(s, svg, 268, 65, 400, 65, "var(--electron)", 4);
      svg.appendChild(txt(s, 70, 98, 9, "middle", "fill:var(--muted)", q >= 0 ? L("তাপ ভিতৰলৈ", "heat in") : L("তাপ বাহিৰলৈ", "heat out")));
      svg.appendChild(txt(s, 350, 98, 9, "middle", "fill:var(--muted)", w >= 0 ? L("তন্ত্ৰৰ ওপৰত কাৰ্য", "work done on system") : L("তন্ত্ৰই কাৰ্য কৰে", "work done by system")));
      /* dU bar */
      svg.appendChild(txt(s, 210, 130, 11, "middle", "fill:var(--muted)", L("অন্তৰ্নিহিত শক্তিৰ পৰিৱৰ্তন ΔU", "change in internal energy ΔU")));
      svg.appendChild(s("line", { x1: 210, y1: 138, x2: 210, y2: 176, style: "stroke:var(--muted)", "stroke-width": 1 }));
      var len = Math.max(-200, Math.min(200, du * sc * 2));
      if (Math.abs(len) > 0.5) svg.appendChild(s("rect", { x: len >= 0 ? 210 : 210 + len, y: 146, width: Math.abs(len), height: 22, rx: 3, style: "fill:" + (du >= 0 ? "var(--ok)" : "var(--bad)") }));
      svg.appendChild(txt(s, 210, 186, 11, "middle", "fill:var(--text)", "ΔU = " + sg(du, 0) + " J", 700));
      var what = du > 0 ? L("তন্ত্ৰৰ অন্তৰ্নিহিত শক্তি বাঢ়ে।", "The internal energy of the system rises.") : (du < 0 ? L("তন্ত্ৰৰ অন্তৰ্নিহিত শক্তি কমে।", "The internal energy of the system falls.") : L("অন্তৰ্নিহিত শক্তি অপৰিৱৰ্তিত।", "The internal energy is unchanged."));
      info.innerHTML = "ΔU = q + w = (" + sg(q, 0) + ") + (" + sg(w, 0) + ") = <b>" + sg(du, 0) + " J</b><br>" + what + "<br>" +
        L("চিন বিধি: তন্ত্ৰই তাপ শোষণ কৰিলে q > 0; তন্ত্ৰৰ ওপৰত কাৰ্য কৰিলে w > 0 (IUPAC)।", "Sign rule: q > 0 if the system absorbs heat; w > 0 if work is done on the system (IUPAC).");
    }
    sp = k.select("Situation", Object.keys(P).map(function (key) { return { value: key, label: P[key][2] }; }), "ex57", function (v) {
      setSlider(sq, P[v][0]); setSlider(sw, P[v][1]); st.q = P[v][0]; st.w = P[v][1]; paint();
    });
    sq = k.slider("Heat q (J)", -800, 800, 1, st.q, function (v) { st.q = v; paint(); });
    sw = k.slider("Work w (J)", -800, 800, 1, st.w, function (v) { st.w = v; paint(); });
    root.appendChild(h("div", { "class": "row" }, [sp.el]));
    root.appendChild(h("div", { "class": "row" }, [sq.el, sw.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 3. p-V work */
  A.register('thermo-pvwork', function (root, k) {
    var h = k.h, s = k.s;
    var st = { T: 298, Vf: 10, mode: "rev" }, Vi = 2;
    var svg = s("svg", { viewBox: "0 0 420 190", "class": "anim-svg", role: "img", "aria-label": L("p–V ৰেখাচিত্ৰ আৰু কাৰ্য", "p–V diagram and work") });
    root.appendChild(svg);
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    function paint() {
      var T = st.T, Vf = st.Vf, n = 1, pi = n * RLA * T / Vi, pf = n * RLA * T / Vf, pmax = pi * 1.1;
      var X = function (V) { return 52 + V / 22 * 350; }, Y = function (p) { return 156 - p / pmax * 130; };
      svg.innerHTML = "";
      svg.appendChild(s("line", { x1: 52, y1: 156, x2: 406, y2: 156, style: "stroke:var(--text)" }));
      svg.appendChild(s("line", { x1: 52, y1: 20, x2: 52, y2: 156, style: "stroke:var(--text)" }));
      svg.appendChild(txt(s, 230, 182, 10, "middle", "fill:var(--muted)", L("আয়তন V (L)", "volume V (L)")));
      svg.appendChild(txt(s, 12, 18, 10, "start", "fill:var(--muted)", "p (atm)"));
      [0, 5, 10, 15, 20].forEach(function (v) { svg.appendChild(txt(s, X(v), 168, 9, "middle", "fill:var(--muted)", String(v))); });
      var pts = [], i, V;
      for (i = 0; i <= 60; i++) { V = Vi + (Vf - Vi) * i / 60; pts.push(X(V) + "," + Y(n * RLA * T / V)); }
      var full = [];
      for (i = 0; i <= 60; i++) { V = 1.5 + (21 - 1.5) * i / 60; full.push(X(V) + "," + Y(n * RLA * T / V)); }
      if (st.mode === "rev") svg.appendChild(s("polygon", { points: X(Vi) + ",156 " + pts.join(" ") + " " + X(Vf) + ",156", style: "fill:var(--proton);opacity:.35" }));
      if (st.mode === "irr") svg.appendChild(s("rect", { x: X(Vi), y: Y(pf), width: X(Vf) - X(Vi), height: 156 - Y(pf), style: "fill:var(--electron);opacity:.35" }));
      svg.appendChild(s("polyline", { points: full.join(" "), style: "fill:none;stroke:var(--muted)", "stroke-dasharray": "3 3" }));
      svg.appendChild(s("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--text)", "stroke-width": 2.5 }));
      svg.appendChild(s("circle", { cx: X(Vi), cy: Y(pi), r: 4.5, style: "fill:var(--brand)" }));
      svg.appendChild(s("circle", { cx: X(Vf), cy: Y(pf), r: 4.5, style: "fill:var(--accent)" }));
      svg.appendChild(txt(s, X(Vi) + 7, Y(pi) + 3, 10, "start", "fill:var(--text)", "(" + Vi + " L, " + fx(pi, 1) + " atm)"));
      svg.appendChild(txt(s, X(Vf), Y(pf) - 8, 10, "middle", "fill:var(--text)", "(" + Vf + " L, " + fx(pf, 2) + " atm)"));
      var dV = Vf - Vi, wrev = -n * RLA * T * Math.log(Vf / Vi), wirr = -pf * dV, out;
      var head = "1 mol, T = " + T + " K, V: " + Vi + " L → " + Vf + " L<br>";
      if (st.mode === "rev") out = L("প্ৰত্যাৱৰ্তী সমোষ্ণ: w = −2.303 nRT log(V", "Reversible isothermal: w = −2.303 nRT log(V") + "<sub>f</sub>/V<sub>i</sub>) = <b>" + fx(wrev, 2) + " L atm = " + fx(wrev * LATM / 1000, 2) + " kJ</b>";
      else if (st.mode === "irr") out = L("এক পদক্ষেপত অপ্ৰত্যাৱৰ্তী (p", "One-step irreversible (p") + "<sub>ex</sub> = p<sub>f</sub> = " + fx(pf, 3) + " atm): w = −p<sub>ex</sub>ΔV = <b>" + fx(wirr, 2) + " L atm = " + fx(wirr * LATM / 1000, 2) + " kJ</b>";
      else out = L("শূন্যলৈ মুক্ত প্ৰসাৰণ (p", "Free expansion into vacuum (p") + "<sub>ex</sub> = 0): <b>w = 0</b>";
      var last = st.mode === "free" ? L("ΔU = 0, গতিকে q = 0 ও।", "ΔU = 0 and q = 0 too.") : L("সমোষ্ণ আদৰ্শ গেছত ΔU = 0, গতিকে q = −w।", "For an isothermal ideal gas ΔU = 0, so q = −w.");
      info.innerHTML = head + out + "<br>" + last + "<br>" + L("তুলনা: প্ৰত্যাৱৰ্তী প্ৰসাৰণত তন্ত্ৰই আটাইতকৈ বেছি কাৰ্য কৰে (|w| = " + fx(-wrev, 2) + " L atm; অপ্ৰত্যাৱৰ্তীত " + fx(-wirr, 2) + ")।", "Comparison: the system does the most work when the expansion is reversible (|w| = " + fx(-wrev, 2) + " L atm vs " + fx(-wirr, 2) + " irreversible).");
    }
    var ms = k.select("Process", [{ value: "rev", label: "Reversible isothermal" }, { value: "irr", label: "Irreversible (one step)" }, { value: "free", label: "Free expansion (vacuum)" }], st.mode, function (v) { st.mode = v; paint(); });
    var sT = k.slider("Temperature (K)", 250, 400, 1, st.T, function (v) { st.T = v; paint(); });
    var sV = k.slider("Final volume (L)", 4, 20, 1, st.Vf, function (v) { st.Vf = v; paint(); });
    root.appendChild(h("div", { "class": "row" }, [ms.el]));
    root.appendChild(h("div", { "class": "row" }, [sT.el, sV.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 4. calorimetry and dH vs dU */
  A.register('thermo-calorimeter', function (root, k) {
    var h = k.h, s = k.s;
    var RX = {
      vap: { eq: "H₂O(l) → H₂O(g)", dH: 41.00, dn: 1 },
      hab: { eq: "N₂(g) + 3H₂(g) → 2NH₃(g)", dH: -92.4, dn: -2 },
      co2: { eq: "C(graphite) + O₂(g) → CO₂(g)", dH: -393.5, dn: 0 },
      h2o: { eq: "H₂(g) + ½O₂(g) → H₂O(g)", dH: -241.8, dn: -0.5 }
    };
    var st = { mode: "bomb", C: 20.7, dT: 1.0, rx: "vap", T: 373 };
    var wrapA = h("div"), wrapB = h("div");
    var svgA = s("svg", { viewBox: "0 0 420 170", "class": "anim-svg", role: "img", "aria-label": L("বোমা কেলৰিমিটাৰ", "Bomb calorimeter") });
    var svgB = s("svg", { viewBox: "0 0 420 170", "class": "anim-svg", role: "img", "aria-label": L("ΔH আৰু ΔU ৰ পাৰ্থক্য", "Difference between ΔH and ΔU") });
    var infoA = h("div", { "class": "readout", "aria-live": "polite" }), infoB = h("div", { "class": "readout", "aria-live": "polite" });
    function paintA() {
      var q = st.C * st.dT, dUmol = -q * 12.0 / 1.0;
      svgA.innerHTML = "";
      svgA.appendChild(s("rect", { x: 40, y: 30, width: 190, height: 120, rx: 8, style: "fill:var(--brand-soft);stroke:var(--text)", "stroke-width": 3 }));
      svgA.appendChild(txt(s, 135, 22, 10, "middle", "fill:var(--muted)", L("জলস্নান + অন্তৰক", "water bath + insulation")));
      svgA.appendChild(s("rect", { x: 100, y: 62, width: 70, height: 70, rx: 6, style: "fill:var(--surface-2);stroke:var(--text)", "stroke-width": 4 }));
      svgA.appendChild(txt(s, 135, 94, 11, "middle", "fill:var(--text)", L("বোমা", "bomb"), 700));
      svgA.appendChild(txt(s, 135, 110, 9, "middle", "fill:var(--muted)", "C + O₂, V = const"));
      svgA.appendChild(s("circle", { cx: 135, cy: 124, r: 4, style: "fill:var(--alpha)" }));
      /* thermometer */
      svgA.appendChild(s("rect", { x: 290, y: 24, width: 14, height: 112, rx: 7, style: "fill:var(--surface-2);stroke:var(--text)" }));
      var ht = 8 + st.dT / 3 * 96;
      svgA.appendChild(s("rect", { x: 293, y: 132 - ht, width: 8, height: ht, rx: 4, style: "fill:var(--bad)" }));
      svgA.appendChild(s("circle", { cx: 297, cy: 140, r: 9, style: "fill:var(--bad)" }));
      svgA.appendChild(txt(s, 316, 80, 12, "start", "fill:var(--text)", "ΔT = " + fx(st.dT, 1) + " K", 700));
      svgA.appendChild(txt(s, 316, 98, 10, "start", "fill:var(--muted)", "C = " + fx(st.C, 1) + " kJ/K"));
      infoA.innerHTML = L("তাপ শোষণ q = C × ΔT = " + fx(st.C, 1) + " × " + fx(st.dT, 1) + " = <b>" + fx(q, 1) + " kJ</b> (1 g গ্ৰেফাইটৰ দহনত)।<br>ΔU (1 g) = −" + fx(q, 1) + " kJ; M = 12.0 g mol⁻¹ হ’লে ΔU = <b>" + fx(dUmol, 0) + " kJ mol⁻¹</b>। Δn<sub>g</sub> = 0, গতিকে ΔH = ΔU।", "Heat absorbed q = C × ΔT = " + fx(st.C, 1) + " × " + fx(st.dT, 1) + " = <b>" + fx(q, 1) + " kJ</b> (burning 1 g of graphite).<br>ΔU (1 g) = −" + fx(q, 1) + " kJ; with M = 12.0 g mol⁻¹, ΔU = <b>" + fx(dUmol, 0) + " kJ mol⁻¹</b>. Δn<sub>g</sub> = 0, so ΔH = ΔU.") +
        "<br>" + L("(C = 20.7 kJ/K, ΔT = 1 K ৰে বহীৰ উদাহৰণ 5.6 পোৱা যায়: −2.48 × 10² kJ mol⁻¹)", "(C = 20.7 kJ/K and ΔT = 1 K reproduce the book's Example 5.6: −2.48 × 10² kJ mol⁻¹)");
    }
    function paintB() {
      var r = RX[st.rx], RT = R * st.T / 1000, dU = r.dH - r.dn * RT, mx = Math.max(Math.abs(r.dH), Math.abs(dU), 1), sc = 130 / mx;
      svgB.innerHTML = "";
      svgB.appendChild(txt(s, 210, 16, 12, "middle", "fill:var(--text)", r.eq, 700));
      svgB.appendChild(s("line", { x1: 210, y1: 30, x2: 210, y2: 150, style: "stroke:var(--muted)" }));
      [["ΔH", r.dH, 56, "var(--proton)"], ["ΔU", dU, 100, "var(--electron)"]].forEach(function (b) {
        var len = b[1] * sc;
        svgB.appendChild(txt(s, 36, b[2] + 17, 12, "start", "fill:var(--text)", b[0], 700));
        svgB.appendChild(s("rect", { x: len >= 0 ? 210 : 210 + len, y: b[2], width: Math.max(1, Math.abs(len)), height: 26, rx: 3, style: "fill:" + b[3] + ";opacity:.85" }));
        svgB.appendChild(txt(s, len >= 0 ? 210 + len + 6 : 210 + len - 6, b[2] + 17, 11, len >= 0 ? "start" : "end", "fill:var(--text)", fx(b[1], 2) + " kJ/mol"));
      });
      svgB.appendChild(txt(s, 210, 164, 10, "middle", "fill:var(--muted)", "Δn" + "g = " + sg(r.dn, 1).replace("+", "+") + "   RT = " + fx(RT, 2) + " kJ/mol"));
      infoB.innerHTML = "ΔH = ΔU + Δn<sub>g</sub>RT<br>ΔU = " + fx(r.dH, 2) + " − (" + sg(r.dn, 1) + ")(8.314 J K⁻¹ mol⁻¹)(" + st.T + " K) = <b>" + fx(dU, 2) + " kJ mol⁻¹</b><br>" +
        (r.dn === 0 ? L("Δn<sub>g</sub> = 0 হ’লে ΔH = ΔU।", "When Δn<sub>g</sub> = 0, ΔH = ΔU.") : L("গেছীয় পদাৰ্থৰ মোল সংখ্যা সলনি হ’লেহে ΔH আৰু ΔU ত পাৰ্থক্য হয়।", "ΔH and ΔU differ only because the number of moles of gas changes.")) +
        (st.rx === "vap" && st.T === 373 ? "<br>" + L("বহীৰ উদাহৰণ 5.5: ΔU = 41.00 − 3.096 = 37.904 kJ mol⁻¹।", "Book Example 5.5: ΔU = 41.00 − 3.096 = 37.904 kJ mol⁻¹.") : "");
    }
    var sC = k.slider("Calorimeter heat capacity C (kJ/K)", 5, 30, 0.1, st.C, function (v) { st.C = v; paintA(); });
    var sD = k.slider("Temperature rise ΔT (K)", 0.1, 3, 0.1, st.dT, function (v) { st.dT = v; paintA(); });
    wrapA.appendChild(svgA); wrapA.appendChild(h("div", { "class": "row" }, [sC.el, sD.el])); wrapA.appendChild(infoA);
    var selR = k.select("Reaction", Object.keys(RX).map(function (key) { return { value: key, label: RX[key].eq }; }), st.rx, function (v) { st.rx = v; paintB(); });
    var sT = k.slider("Temperature T (K)", 250, 500, 1, st.T, function (v) { st.T = v; paintB(); });
    wrapB.appendChild(svgB); wrapB.appendChild(h("div", { "class": "row" }, [selR.el, sT.el])); wrapB.appendChild(infoB);
    var ms = k.select("View", [{ value: "bomb", label: "Bomb calorimeter (constant V)" }, { value: "dh", label: "ΔH versus ΔU" }], st.mode, function (v) {
      st.mode = v; wrapA.hidden = v !== "bomb"; wrapB.hidden = v !== "dh";
    });
    root.appendChild(h("div", { "class": "row" }, [ms.el]));
    root.appendChild(wrapA); root.appendChild(wrapB);
    wrapB.hidden = true;
    paintA(); paintB();
  });

  /* ================================================================== 5. enthalpy diagram, dfH bookkeeping */
  A.register('thermo-enthalpy', function (root, k) {
    var h = k.h, s = k.s;
    /* standard enthalpies of formation (kJ/mol, 298 K) as in the book's Table 5.2 */
    var RX = {
      ch4: { eq: "CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)", r: [[1, "CH₄(g)", -74.81], [2, "O₂(g)", 0]], p: [[1, "CO₂(g)", -393.51], [2, "H₂O(l)", -285.83]] },
      fe: { eq: "Fe₂O₃(s) + 3H₂(g) → 2Fe(s) + 3H₂O(l)", r: [[1, "Fe₂O₃(s)", -824.2], [3, "H₂(g)", 0]], p: [[2, "Fe(s)", 0], [3, "H₂O(l)", -285.83]] },
      ca: { eq: "CaCO₃(s) → CaO(s) + CO₂(g)", r: [[1, "CaCO₃(s)", -1206.92]], p: [[1, "CaO(s)", -635.09], [1, "CO₂(g)", -393.51]] },
      nh3: { eq: "N₂(g) + 3H₂(g) → 2NH₃(g)", r: [[1, "N₂(g)", 0], [3, "H₂(g)", 0]], p: [[2, "NH₃(g)", -46.11]] },
      no: { eq: "½N₂(g) + ½O₂(g) → NO(g)", r: [[0.5, "N₂(g)", 0], [0.5, "O₂(g)", 0]], p: [[1, "NO(g)", 90.25]] }
    };
    var st = { rx: "ch4" };
    var svg = s("svg", { viewBox: "0 0 420 210", "class": "anim-svg", role: "img", "aria-label": L("এনথালপি ৰেখাচিত্ৰ", "Enthalpy diagram") });
    root.appendChild(svg);
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    function sum(a) { return a.reduce(function (t, x) { return t + x[0] * x[2]; }, 0); }
    function terms(a) { return a.map(function (x) { return (x[0] === 1 ? "" : x[0] + " × ") + "(" + fx(x[2], 2) + ")"; }).join(" + "); }
    function paint() {
      var r = RX[st.rx], sr = sum(r.r), sp = sum(r.p), d = sp - sr;
      var lo = Math.min(sr, sp, 0), hi = Math.max(sr, sp, 0), span = Math.max(hi - lo, 1);
      var Y = function (v) { return 24 + (hi - v) / span * 140; };
      svg.innerHTML = "";
      svg.appendChild(s("line", { x1: 30, y1: Y(0), x2: 390, y2: Y(0), style: "stroke:var(--muted)", "stroke-dasharray": "4 3" }));
      svg.appendChild(txt(s, 392, Y(0) - 4, 9, "end", "fill:var(--muted)", L("মৌল (ΔfH° = 0)", "elements (ΔfH° = 0)")));
      [[70, sr, L("বিক্ৰিয়ক", "Reactants"), "var(--electron)"], [250, sp, L("বিক্ৰিয়াজাত", "Products"), "var(--proton)"]].forEach(function (b) {
        var y0 = Y(0), y1 = Y(b[1]);
        svg.appendChild(s("rect", { x: b[0], y: Math.min(y0, y1), width: 100, height: Math.max(2, Math.abs(y1 - y0)), style: "fill:" + b[3] + ";opacity:.7" }));
        svg.appendChild(txt(s, b[0] + 50, 188, 11, "middle", "fill:var(--text)", b[2], 700));
        svg.appendChild(txt(s, b[0] + 50, y1 + (b[1] >= 0 ? -5 : 13), 10, "middle", "fill:var(--text)", fx(b[1], 2)));
      });
      arrow(s, svg, 200, Y(sr), 200, Y(sp) + (d < 0 ? -2 : 2), d < 0 ? "var(--ok)" : "var(--bad)", 3);
      svg.appendChild(txt(s, 210, (Y(sr) + Y(sp)) / 2 + 3, 11, "start", d < 0 ? "fill:var(--ok)" : "fill:var(--bad)", "ΔᵣH° = " + sg(d, 2), 700));
      svg.appendChild(txt(s, 210, 204, 10, "middle", "fill:var(--muted)", L("ΣΔfH° ৰ মান kJ mol⁻¹ ত", "ΣΔfH° values in kJ mol⁻¹")));
      info.innerHTML = "<b>" + r.eq + "</b><br>" +
        "Δ<sub>r</sub>H° = Σ Δ<sub>f</sub>H°(products) − Σ Δ<sub>f</sub>H°(reactants)<br>= [" + terms(r.p) + "] − [" + terms(r.r) + "] = <b>" + sg(d, 2) + " kJ mol⁻¹</b><br>" +
        (d < 0 ? L("ΔH ঋণাত্মক — তাপমোচী (exothermic) বিক্ৰিয়া; বিক্ৰিয়াজাতৰ এনথালপি কম।", "ΔH is negative — an exothermic reaction; the products are lower in enthalpy.") : L("ΔH ধনাত্মক — তাপগ্ৰাহী (endothermic) বিক্ৰিয়া; তাপ শোষিত হয়।", "ΔH is positive — an endothermic reaction; heat is absorbed."));
    }
    var sel = k.select("Reaction", Object.keys(RX).map(function (key) { return { value: key, label: RX[key].eq }; }), st.rx, function (v) { st.rx = v; paint(); });
    root.appendChild(h("div", { "class": "row" }, [sel.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 6/7. step-by-step enthalpy builders (Hess's law, cycles) */
  function stepsAnim(mk, ariaAs, ariaEn) {
    return function (root, k) {
      var cases = mk();
      var h = k.h, s = k.s;
      var keys = Object.keys(cases), st = { c: keys[0], n: 0 };
      var svg = s("svg", { viewBox: "0 0 420 210", "class": "anim-svg", role: "img", "aria-label": L(ariaAs, ariaEn) });
      root.appendChild(svg);
      var info = h("div", { "class": "readout", "aria-live": "polite" });
      function paint() {
        var c = cases[st.c], steps = c.steps, N = steps.length, cum = [0], i;
        for (i = 0; i < N; i++) cum.push(cum[i] + steps[i][1]);
        var lo = Math.min.apply(null, cum), hi = Math.max.apply(null, cum);
        var pad = Math.max((hi - lo) * 0.12, 1); lo -= pad; hi += pad;
        var Y = function (v) { return 24 + (hi - v) / (hi - lo) * 130; };
        var bw = Math.min(54, 340 / (N + 1) - 8), x0 = 50;
        svg.innerHTML = "";
        svg.appendChild(s("line", { x1: 40, y1: Y(0), x2: 410, y2: Y(0), style: "stroke:var(--muted)", "stroke-dasharray": "4 3" }));
        for (i = 0; i < N; i++) {
          var x = x0 + i * (bw + 8), a = cum[i], b = cum[i + 1], on = i < st.n;
          svg.appendChild(s("rect", { x: x, y: Math.min(Y(a), Y(b)), width: bw, height: Math.max(2, Math.abs(Y(a) - Y(b))), rx: 2, style: "fill:" + (steps[i][1] >= 0 ? "var(--bad)" : "var(--ok)") + ";opacity:" + (on ? 0.85 : 0.12) }));
          svg.appendChild(txt(s, x + bw / 2, 176, 10, "middle", "fill:var(--text)", String(i + 1), 700));
          if (on) svg.appendChild(txt(s, x + bw / 2, Math.min(Y(a), Y(b)) - 4, 9, "middle", "fill:var(--text)", sg(steps[i][1], 1)));
        }
        var done = st.n === N;
        var xt = x0 + N * (bw + 8);
        svg.appendChild(s("rect", { x: xt, y: Math.min(Y(0), Y(cum[N])), width: bw, height: Math.max(2, Math.abs(Y(0) - Y(cum[N]))), rx: 2, style: "fill:var(--brand);opacity:" + (done ? 0.9 : 0.12) }));
        svg.appendChild(txt(s, xt + bw / 2, 176, 10, "middle", "fill:var(--text)", L("মুঠ", "Σ"), 700));
        if (done) svg.appendChild(txt(s, xt + bw / 2, Math.min(Y(0), Y(cum[N])) - 4, 9, "middle", "fill:var(--text)", sg(cum[N], 1)));
        svg.appendChild(txt(s, 210, 200, 10, "middle", "fill:var(--muted)", L("ৰঙা = তাপ শোষণ (+), সেউজীয়া = তাপ নিৰ্গমন (−); kJ mol⁻¹", "red = heat absorbed (+), green = heat released (−); kJ mol⁻¹")));
        var lines = steps.map(function (sx, j) { return (j < st.n ? "<b>" : "<span style=\"opacity:.45\">") + (j + 1) + ". " + sx[0] + "  →  " + sg(sx[1], 1) + (j < st.n ? "</b>" : "</span>"); }).join("<br>");
        info.innerHTML = "<b>" + c.title + "</b><br>" + lines + "<br>" +
          (done ? c.total : L("পৰৱৰ্তী পদক্ষেপ যোগ কৰক…", "Add the next step…")) + (done && c.extra ? "<br>" + c.extra : "");
      }
      var sel = k.select("Example", keys.map(function (key) { return { value: key, label: cases[key].label }; }), st.c, function (v) { st.c = v; st.n = 0; paint(); });
      root.appendChild(h("div", { "class": "row" }, [sel.el,
        k.button("Add next step", function () { if (st.n < cases[st.c].steps.length) st.n++; paint(); }),
        k.button("Show all", function () { st.n = cases[st.c].steps.length; paint(); }),
        k.button("Reset", function () { st.n = 0; paint(); })]));
      root.appendChild(info);
      paint();
    };
  }
  A.register('thermo-hess', stepsAnim(function () { return {
    co: {
      label: "C + ½O₂ → CO (Hess's law)",
      title: L("C(গ্ৰেফাইট) + ½O₂ → CO ৰ ΔᵣH° — সমীকৰণ (i) আৰু (ii) ৰ পৰা", "ΔᵣH° of C(graphite) + ½O₂ → CO from equations (i) and (ii)"),
      steps: [[L("(i) C + O₂ → CO₂", "(i) C + O₂ → CO₂"), -393.5], [L("(ii) ৰ ওলোটা: CO₂ → CO + ½O₂", "reverse of (ii): CO₂ → CO + ½O₂"), 283.0]],
      total: L("ΔᵣH° = −393.5 + 283.0 = <b>−110.5 kJ mol⁻¹</b> — পোনপটীয়াকৈ জুখিব নোৱাৰি, কিন্তু হেছৰ সূত্ৰই দিয়ে।", "ΔᵣH° = −393.5 + 283.0 = <b>−110.5 kJ mol⁻¹</b> — hard to measure directly, but Hess's law gives it.")
    },
    benz: {
      label: "6C + 3H₂ → C₆H₆(l)",
      title: L("বেঞ্জিনৰ ΔfH° — দহন তথ্যৰ পৰা (উদাহৰণ 5.9)", "ΔfH° of benzene from combustion data (Example 5.9)"),
      steps: [[L("6C + 6O₂ → 6CO₂  (6 × −393.5)", "6C + 6O₂ → 6CO₂  (6 × −393.5)"), -2361.0], [L("3H₂ + 3/2 O₂ → 3H₂O  (3 × −285.83)", "3H₂ + 3/2 O₂ → 3H₂O  (3 × −285.83)"), -857.49], [L("6CO₂ + 3H₂O → C₆H₆ + 15/2 O₂  (দহনৰ ওলোটা)", "6CO₂ + 3H₂O → C₆H₆ + 15/2 O₂  (reverse of combustion)"), 3267.0]],
      total: L("ΔfH°(C₆H₆) = <b>+48.51 kJ mol⁻¹</b> (বহীৰ উত্তৰ: 48.51)।", "ΔfH°(C₆H₆) = <b>+48.51 kJ mol⁻¹</b> (the book's answer: 48.51).")
    }
  }; }, "হেছৰ সূত্ৰ", "Hess's law"));
  A.register('thermo-cycle', stepsAnim(function () { return {
    born: {
      label: "NaCl: Born–Haber cycle",
      title: L("NaCl(s) ৰ গঠন — বৰ্ন-হেবাৰ চক্ৰ", "Formation of NaCl(s) — Born–Haber cycle"),
      steps: [[L("Na(s) → Na(g)  ঊৰ্ধ্বপাতন", "Na(s) → Na(g)  sublimation"), 108.4], [L("Na(g) → Na⁺(g) + e⁻  আয়নীকৰণ", "Na(g) → Na⁺(g) + e⁻  ionisation"), 496], [L("½Cl₂ → Cl(g)  (½ বান্ধনি বিয়োজন)", "½Cl₂ → Cl(g)  (½ bond dissociation)"), 121], [L("Cl(g) + e⁻ → Cl⁻(g)  ইলেক্ট্ৰন গ্ৰহণ", "Cl(g) + e⁻ → Cl⁻(g)  electron gain"), -348.6], [L("Na⁺(g) + Cl⁻(g) → NaCl(s)  লেটিছ গঠন", "Na⁺(g) + Cl⁻(g) → NaCl(s)  lattice formation"), -788.0]],
      total: L("মুঠ = ΔfH°(NaCl) = <b>−411.2 kJ mol⁻¹</b>। সেয়েহে লেটিছ এনথালপি = 411.2 + 108.4 + 121 + 496 − 348.6 = <b>+788 kJ mol⁻¹</b>।", "Total = ΔfH°(NaCl) = <b>−411.2 kJ mol⁻¹</b>. So the lattice enthalpy = 411.2 + 108.4 + 121 + 496 − 348.6 = <b>+788 kJ mol⁻¹</b>.")
    },
    sol: {
      label: "NaCl: enthalpy of solution",
      title: L("NaCl(s) ৰ দ্ৰৱ এনথালপি", "Enthalpy of solution of NaCl(s)"),
      steps: [[L("NaCl(s) → Na⁺(g) + Cl⁻(g)  (লেটিছ এনথালপি)", "NaCl(s) → Na⁺(g) + Cl⁻(g)  (lattice enthalpy)"), 788], [L("Na⁺(g) + Cl⁻(g) → Na⁺(aq) + Cl⁻(aq)  (জলযোজন)", "Na⁺(g) + Cl⁻(g) → Na⁺(aq) + Cl⁻(aq)  (hydration)"), -784]],
      total: L("Δ<sub>sol</sub>H° = 788 − 784 = <b>+4 kJ mol⁻¹</b> — প্ৰায় শূন্য; NaCl ৰ দ্ৰৱণত তাপ-পৰিৱৰ্তন অতি কম।", "Δ<sub>sol</sub>H° = 788 − 784 = <b>+4 kJ mol⁻¹</b> — almost zero; dissolving NaCl hardly changes the temperature.")
    },
    ch4: {
      label: "CH₄ → C + 4H (bond enthalpy)",
      title: L("CH₄ ৰ পৰমাণুকৰণ — পৰ্যায়ক্ৰমে C–H বান্ধনি ভঙা", "Atomisation of CH₄ — breaking the C–H bonds one by one"),
      steps: [["CH₄ → CH₃ + H", 427], ["CH₃ → CH₂ + H", 439], ["CH₂ → CH + H", 452], ["CH → C + H", 347]],
      total: L("Δ<sub>a</sub>H° = <b>1665 kJ mol⁻¹</b>। গড় C–H বান্ধনি এনথালপি = 1665 ÷ 4 ≈ <b>416 kJ mol⁻¹</b> (প্ৰতিটো বান্ধনি সমান ভাঙিবলৈ শক্তি নালাগে)।", "Δ<sub>a</sub>H° = <b>1665 kJ mol⁻¹</b>. Mean C–H bond enthalpy = 1665 ÷ 4 ≈ <b>416 kJ mol⁻¹</b> (each C–H bond needs a different energy to break).")
    }
  }; }, "এনথালপি চক্ৰ", "Enthalpy cycles"));

  /* ================================================================== 8. entropy: spreading of particles */
  A.register('thermo-entropy', function (root, k) {
    var h = k.h, s = k.s;
    var W = 380, H = 130;
    var st = { n: 20, T: 300, open: false, parts: [] };
    var cv = h("canvas", { "class": "anim-svg", role: "img", "aria-label": L("গেছৰ কণাৰ বিস্তাৰ আৰু এনট্ৰপি", "Spreading of gas particles and entropy") });
    var ctx = k.hiDpiCanvas(cv, W, H);
    cv.style.width = "100%"; cv.style.maxWidth = W + "px"; cv.style.height = "auto";
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    function init() {
      st.parts = []; st.open = false;
      for (var i = 0; i < st.n; i++) st.parts.push({ x: 8 + Math.random() * (W / 2 - 16), y: 8 + Math.random() * (H - 16), a: Math.random() * 6.283 });
      draw();
    }
    function count() { var c = 0; st.parts.forEach(function (p) { if (p.x < W / 2) c++; }); return c; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = k.cssVar("--canvas") || "#fff"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = k.cssVar("--text"); ctx.lineWidth = 2; ctx.strokeRect(1, 1, W - 2, H - 2);
      if (!st.open) { ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.lineWidth = 4; ctx.stroke(); }
      ctx.fillStyle = k.cssVar("--electron");
      st.parts.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 6.283); ctx.fill(); });
      var nl = count(), n = st.n, nr = n - nl;
      var lnW = 0, i; for (i = 1; i <= n; i++) lnW += Math.log(i); for (i = 1; i <= nl; i++) lnW -= Math.log(i); for (i = 1; i <= nr; i++) lnW -= Math.log(i);
      var comp = Math.exp(lnW);
      info.innerHTML = L("বাওঁফালে " + nl + " টা, সোঁফালে " + nr + " টা কণা (মুঠ " + n + ")।", "Left: " + nl + " particles, right: " + nr + " (total " + n + ").") + "<br>" +
        L("এই বিন্যাস সম্ভৱ কৰা উপায় (মাইক্ৰ’অৱস্থা) W = " + sci(Math.round(comp)) + "; সকলোবোৰ বাওঁফালে থকাৰ সম্ভাৱনা = 1 / 2<sup>" + n + "</sup> = " + sci(1 / Math.pow(2, n)) + "।", "Ways to make this arrangement (microstates) W = " + sci(Math.round(comp)) + "; chance that all are on the left = 1 / 2<sup>" + n + "</sup> = " + sci(1 / Math.pow(2, n)) + ".") + "<br>" +
        L("পৰ্দা আতৰালে কণাবোৰ নিজে নিজে বিয়পি পৰে — বিশৃংখলতা (এনট্ৰপি) বাঢ়ে। 1 mol গেছৰ আয়তন দুগুণ হ’লে ΔS = R ln 2 = 5.76 J K⁻¹।", "When the partition is removed the particles spread by themselves — disorder (entropy) increases. For 1 mol of gas doubling its volume, ΔS = R ln 2 = 5.76 J K⁻¹.");
    }
    var lp = k.loop(root, function (dt) {
      var sp = 55 * Math.sqrt(st.T / 300);
      st.parts.forEach(function (p) {
        p.a += (Math.random() - 0.5) * 0.9;
        p.x += Math.cos(p.a) * sp * dt; p.y += Math.sin(p.a) * sp * dt;
        if (p.x < 5) { p.x = 5; p.a = Math.PI - p.a; } if (p.x > W - 5) { p.x = W - 5; p.a = Math.PI - p.a; }
        if (p.y < 5) { p.y = 5; p.a = -p.a; } if (p.y > H - 5) { p.y = H - 5; p.a = -p.a; }
        if (!st.open) { if (p.x > W / 2 - 5) { p.x = W / 2 - 5; p.a = Math.PI - p.a; } }
      });
      draw();
    });
    var sN = k.slider("Particles", 4, 40, 1, st.n, function (v) { st.n = v; init(); });
    var sT = k.slider("Temperature (K)", 100, 600, 10, st.T, function (v) { st.T = v; });
    root.insertBefore(cv, root.firstChild);
    root.appendChild(h("div", { "class": "row" }, [
      k.button("Remove partition", function () { st.open = true; draw(); if (!k.reduceMotion) lp.start(); else { for (var i = 0; i < 30; i++) st.parts.forEach(function (p) { p.x = Math.random() * W; }); draw(); } }),
      k.button("Reset", function () { lp.stop(); init(); })]));
    root.appendChild(h("div", { "class": "row" }, [sN.el, sT.el]));
    root.appendChild(info);
    init();
  });

  /* ================================================================== 9. Gibbs energy and spontaneity */
  A.register('thermo-gibbs', function (root, k) {
    var h = k.h, s = k.s;
    var P = {
      custom: [400, 200, 1000, L("নিজে বাছক", "Your own values")],
      ex517: [400, 200, 1500, L("অনুশীলনী 5.17: ΔH = +400 kJ, ΔS = +0.2 kJ K⁻¹", "Exercise 5.17: ΔH = +400 kJ, ΔS = +0.2 kJ K⁻¹")],
      rust: [-1648, -549, 298, L("উদাহৰণ 5.11: 4Fe + 3O₂ → 2Fe₂O₃", "Example 5.11: 4Fe + 3O₂ → 2Fe₂O₃")],
      caco3: [178, 160, 298, L("CaCO₃ → CaO + CO₂ (ΔH = +178 kJ, ΔS ≈ +160 J K⁻¹)", "CaCO₃ → CaO + CO₂ (ΔH = +178 kJ, ΔS ≈ +160 J K⁻¹)")],
      hab: [-92, -199, 298, L("N₂ + 3H₂ → 2NH₃ (ΔH = −92 kJ, ΔS ≈ −199 J K⁻¹)", "N₂ + 3H₂ → 2NH₃ (ΔH = −92 kJ, ΔS ≈ −199 J K⁻¹)")],
      neg: [-100, 100, 298, L("ΔH < 0, ΔS > 0 (সদায় স্বতঃস্ফূৰ্ত)", "ΔH < 0, ΔS > 0 (always spontaneous)")],
      pos: [100, -100, 298, L("ΔH > 0, ΔS < 0 (কেতিয়াও নহয়)", "ΔH > 0, ΔS < 0 (never spontaneous)")]
    };
    var st = { H: 400, S: 200, T: 1500 }, TM = 2500;
    var svg = s("svg", { viewBox: "0 0 420 200", "class": "anim-svg", role: "img", "aria-label": L("ΔG বনাম তাপমাত্ৰা", "ΔG versus temperature") });
    root.appendChild(svg);
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    var sH, sS, sT, sp;
    function paint() {
      var H = st.H, S = st.S, T = st.T;
      var g = function (t) { return H - t * S / 1000; };
      var ymax = Math.max(Math.abs(g(0)), Math.abs(g(TM)), 10) * 1.1;
      var X = function (t) { return 52 + t / TM * 350; }, Y = function (v) { return 86 - v / ymax * 70; };
      svg.innerHTML = "";
      svg.appendChild(s("rect", { x: 52, y: 86, width: 350, height: 70, style: "fill:var(--ok);opacity:.10" }));
      svg.appendChild(s("rect", { x: 52, y: 16, width: 350, height: 70, style: "fill:var(--bad);opacity:.10" }));
      svg.appendChild(s("line", { x1: 52, y1: 86, x2: 402, y2: 86, style: "stroke:var(--text)" }));
      svg.appendChild(s("line", { x1: 52, y1: 16, x2: 52, y2: 156, style: "stroke:var(--text)" }));
      svg.appendChild(txt(s, 56, 28, 10, "start", "fill:var(--bad)", "ΔG > 0"));
      svg.appendChild(txt(s, 56, 150, 10, "start", "fill:var(--ok)", "ΔG < 0"));
      svg.appendChild(txt(s, 8, 12, 9, "start", "fill:var(--muted)", "ΔG (kJ/mol)"));
      svg.appendChild(txt(s, 228, 188, 10, "middle", "fill:var(--muted)", L("তাপমাত্ৰা T (K)", "temperature T (K)")));
      [0, 500, 1000, 1500, 2000, 2500].forEach(function (t) { svg.appendChild(txt(s, X(t), 170, 9, "middle", "fill:var(--muted)", String(t))); });
      svg.appendChild(s("line", { x1: X(0), y1: Y(g(0)), x2: X(TM), y2: Y(g(TM)), style: "stroke:var(--text)", "stroke-width": 2.5 }));
      var tc = (S !== 0 && H / S > 0) ? H / S * 1000 : null;
      if (tc !== null && tc > 0 && tc < TM) {
        svg.appendChild(s("line", { x1: X(tc), y1: 16, x2: X(tc), y2: 156, style: "stroke:var(--accent)", "stroke-dasharray": "4 3" }));
        svg.appendChild(txt(s, X(tc) + 4, 100, 10, "start", "fill:var(--accent)", "T = " + Math.round(tc) + " K", 700));
      }
      var G = g(T);
      svg.appendChild(s("circle", { cx: X(T), cy: Y(G), r: 6, style: "fill:" + (G < 0 ? "var(--ok)" : "var(--bad)") + ";stroke:var(--text)" }));
      var dsSurr = -H * 1000 / T, dsTot = S + dsSurr;
      var kind = H < 0 && S > 0 ? L("ΔH −, ΔS +: সকলো তাপমাত্ৰাত স্বতঃস্ফূৰ্ত", "ΔH −, ΔS +: spontaneous at all temperatures") :
        (H < 0 && S < 0 ? L("ΔH −, ΔS −: নিম্ন তাপমাত্ৰাত স্বতঃস্ফূৰ্ত", "ΔH −, ΔS −: spontaneous at low temperature") :
          (H > 0 && S > 0 ? L("ΔH +, ΔS +: উচ্চ তাপমাত্ৰাত স্বতঃস্ফূৰ্ত", "ΔH +, ΔS +: spontaneous at high temperature") :
            (H > 0 && S < 0 ? L("ΔH +, ΔS −: কোনো তাপমাত্ৰাতে স্বতঃস্ফূৰ্ত নহয়", "ΔH +, ΔS −: not spontaneous at any temperature") : L("ΔH বা ΔS শূন্য", "ΔH or ΔS is zero"))));
      info.innerHTML = "ΔG = ΔH − TΔS = " + sg(H, 0) + " − (" + T + ")(" + sg(S / 1000, 3) + ") = <b>" + sg(G, 1) + " kJ mol⁻¹</b> → " + (G < -1e-9 ? "<b>" + L("স্বতঃস্ফূৰ্ত", "spontaneous") + "</b>" : (G > 1e-9 ? "<b>" + L("স্বতঃস্ফূৰ্ত নহয়", "not spontaneous") + "</b>" : L("সাম্য", "at equilibrium"))) + "<br>" +
        "ΔS<sub>surr</sub> = −ΔH/T = " + sg(dsSurr, 1) + " J K⁻¹;  ΔS<sub>total</sub> = " + sg(dsTot, 1) + " J K⁻¹ (ΔG = −TΔS<sub>total</sub>)<br>" + kind +
        (tc !== null && tc > 0 ? "<br>" + L("সন্ধিক্ষণ তাপমাত্ৰা T = ΔH/ΔS = " + Math.round(tc) + " K", "Crossover temperature T = ΔH/ΔS = " + Math.round(tc) + " K") : "");
    }
    sp = k.select("Reaction", Object.keys(P).map(function (key) { return { value: key, label: P[key][3] }; }), "ex517", function (v) {
      st.H = P[v][0]; st.S = P[v][1]; st.T = P[v][2]; setSlider(sH, st.H); setSlider(sS, st.S); setSlider(sT, st.T); paint();
    });
    sH = k.slider("ΔH (kJ/mol)", -2000, 2000, 1, st.H, function (v) { st.H = v; paint(); });
    sS = k.slider("ΔS (J/K/mol)", -600, 600, 1, st.S, function (v) { st.S = v; paint(); });
    sT = k.slider("T (K)", 1, 2500, 1, st.T, function (v) { st.T = v; paint(); });
    root.appendChild(h("div", { "class": "row" }, [sp.el]));
    root.appendChild(h("div", { "class": "row" }, [sH.el, sS.el, sT.el]));
    root.appendChild(info);
    paint();
  });

  /* ================================================================== 10. dG and K */
  A.register('thermo-gibbsk', function (root, k) {
    var h = k.h, s = k.s;
    var P = {
      custom: [-13.6, 298, L("নিজে বাছক", "Your own values")],
      ex513: [-13.6, 298, L("উদাহৰণ 5.13: NH₂CONH₂ ৰ গঠন (ΔG° = −13.6 kJ)", "Example 5.13: urea formation (ΔG° = −13.6 kJ)")],
      ex512: [163, 298, L("উদাহৰণ 5.12: 3/2 O₂ → O₃ (ΔG° = +163 kJ)", "Example 5.12: 3/2 O₂ → O₃ (ΔG° = +163 kJ)")],
      zero: [0, 298, L("ΔG° = 0 (K = 1)", "ΔG° = 0 (K = 1)")]
    };
    var st = { G: -13.6, T: 298 };
    var svg = s("svg", { viewBox: "0 0 420 120", "class": "anim-svg", role: "img", "aria-label": L("সাম্যাৱস্থাৰ সংযুতি আৰু K", "Equilibrium composition and K") });
    root.appendChild(svg);
    var info = h("div", { "class": "readout", "aria-live": "polite" });
    var sG, sT, sp;
    function paint() {
      var lnK = -st.G * 1000 / (R * st.T), logK = lnK / Math.LN10, K = Math.exp(lnK);
      var fB = lnK > 700 ? 1 : (lnK < -700 ? 0 : K / (1 + K));
      svg.innerHTML = "";
      svg.appendChild(txt(s, 210, 18, 11, "middle", "fill:var(--muted)", L("সাম্যত A ⇌ B ৰ সংযুতি", "Composition of A ⇌ B at equilibrium")));
      svg.appendChild(s("rect", { x: 30, y: 30, width: 360, height: 34, rx: 4, style: "fill:var(--electron);opacity:.85" }));
      svg.appendChild(s("rect", { x: 30, y: 30, width: 360 * fB, height: 34, rx: 4, style: "fill:var(--proton);opacity:.9" }));
      svg.appendChild(txt(s, 36, 52, 12, "start", "fill:#fff", "B " + fx(fB * 100, fB > 0.999 || fB < 0.001 ? 4 : 1) + " %", 700));
      svg.appendChild(txt(s, 384, 52, 12, "end", "fill:#fff", "A " + fx((1 - fB) * 100, fB > 0.999 || fB < 0.001 ? 4 : 1) + " %", 700));
      svg.appendChild(txt(s, 210, 92, 12, "middle", "fill:var(--text)", "log K = " + fx(logK, 2), 700));
      svg.appendChild(txt(s, 210, 110, 10, "middle", "fill:var(--muted)", st.G < 0 ? L("ΔG° ঋণাত্মক → K > 1 → বিক্ৰিয়াজাতৰ দিশত", "ΔG° negative → K > 1 → favours products") : (st.G > 0 ? L("ΔG° ধনাত্মক → K < 1 → বিক্ৰিয়কৰ দিশত", "ΔG° positive → K < 1 → favours reactants") : "K = 1")));
      info.innerHTML = "Δ<sub>r</sub>G° = −RT ln K = −2.303 RT log K<br>" +
        "log K = −(" + fx(st.G, 1) + " × 10³ J) / (2.303 × 8.314 × " + st.T + ") = <b>" + fx(logK, 2) + "</b> → K = <b>" + sci(K) + "</b><br>" +
        L("বহীৰ উদাহৰণ 5.13 ত ΔG° = −13.6 kJ ৰ বাবে K ≈ 2.4 × 10²; উদাহৰণ 5.12 ত ΔG° = +163 kJ ৰ বাবে K ≈ 2.5 × 10⁻²⁹।", "In the book, ΔG° = −13.6 kJ gives K ≈ 2.4 × 10² (Example 5.13) and ΔG° = +163 kJ gives K ≈ 2.5 × 10⁻²⁹ (Example 5.12).");
    }
    sp = k.select("Example", Object.keys(P).map(function (key) { return { value: key, label: P[key][2] }; }), "ex513", function (v) {
      st.G = P[v][0]; st.T = P[v][1]; setSlider(sG, st.G); setSlider(sT, st.T); paint();
    });
    sG = k.slider("ΔG° (kJ/mol)", -200, 200, 0.1, st.G, function (v) { st.G = v; paint(); });
    sT = k.slider("T (K)", 200, 1000, 1, st.T, function (v) { st.T = v; paint(); });
    root.appendChild(h("div", { "class": "row" }, [sp.el]));
    root.appendChild(h("div", { "class": "row" }, [sG.el, sT.el]));
    root.appendChild(info);
    paint();
  });
})();
