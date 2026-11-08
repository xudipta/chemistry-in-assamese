/* Animation engine.
   - ChemAnim.register(name, factory)  : a chapter registers an animation
   - ChemAnim.mount(name, hostElement) : the chapter page mounts it
   A factory is called as factory(stageElement, kit). The kit has tiny DOM helpers (h, s),
   control builders (button, slider, select) and loop(), a requestAnimationFrame loop that
   pauses while the animation is off screen. Nothing here depends on a particular chapter. */
(function (global) {
  'use strict';

  var registry = {};
  var SVGNS = 'http://www.w3.org/2000/svg';
  var reduceMotion = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function el(ns, tag, attrs, kids) {
    var n = ns ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'text') n.textContent = v;
        else if (k === 'html') n.innerHTML = v; /* only ever pass trusted, hard-coded strings */
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      });
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function h(tag, attrs, kids) { return el(false, tag, attrs, kids); }
  function s(tag, attrs, kids) { return el(true, tag, attrs, kids); }

  function button(label, onclick, cls) {
    return h('button', { type: 'button', 'class': 'btn ' + (cls || ''), text: label, onclick: onclick });
  }

  function slider(label, min, max, step, value, oninput) {
    var out = h('output', { text: String(value) });
    var input = h('input', { type: 'range', min: min, max: max, step: step, value: value, 'aria-label': label });
    input.addEventListener('input', function () { out.textContent = input.value; oninput(+input.value); });
    var wrap = h('label', { 'class': 'ctl' }, [h('span', { text: label }), input, out]);
    return { el: wrap, input: input, out: out };
  }

  function select(label, options, value, onchange) {
    var sel = h('select', { 'aria-label': label });
    options.forEach(function (o) {
      var opt = h('option', { value: o.value, text: o.label });
      if (String(o.value) === String(value)) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () { onchange(sel.value); });
    return { el: h('label', { 'class': 'ctl' }, [h('span', { text: label }), sel]), select: sel };
  }

  /* A frame loop that only runs while started AND the host is on screen. */
  function loop(host, tick) {
    var raf = 0, last = 0, running = false, visible = true;
    function frame(t) {
      raf = 0;
      if (!running || !visible) return;
      var dt = Math.max(0, Math.min(0.05, (t - last) / 1000));   /* never negative on the first frame */
      last = t;
      tick(dt, t / 1000);
      raf = requestAnimationFrame(frame);
    }
    function kick() {
      if (running && visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }
    var api = {
      start: function () { running = true; kick(); },
      stop: function () { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } },
      get running() { return running; }
    };
    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; if (visible) kick(); }).observe(host);
    }
    return api;
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* Size a canvas for the device pixel ratio; returns a 2d context drawn in CSS-pixel units. */
  function hiDpiCanvas(canvas, w, hgt) {
    var dpr = Math.min(2, global.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(hgt * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  var kit = {
    h: h, s: s, button: button, slider: slider, select: select, loop: loop,
    cssVar: cssVar, hiDpiCanvas: hiDpiCanvas, reduceMotion: reduceMotion
  };

  global.ChemAnim = {
    register: function (name, factory) { registry[name] = factory; },
    has: function (name) { return Object.prototype.hasOwnProperty.call(registry, name); },
    names: function () { return Object.keys(registry); },
    mount: function (name, host) {
      var factory = registry[name];
      if (!factory) {
        host.appendChild(h('p', { 'class': 'anim-missing', text: 'Animation not found: ' + name }));
        return;
      }
      var stage = h('div', { 'class': 'anim-body' });
      host.appendChild(stage);
      try { factory(stage, kit); }
      catch (err) {
        console.error(err);
        stage.appendChild(h('p', { 'class': 'anim-missing', text: 'This animation could not be loaded.' }));
      }
    }
  };
})(window);
