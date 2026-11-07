/* Chapter page: loads content/<class>/<chapter>/chapter.json (+ quiz.json) and renders it.
   Block types: p, list, table, formula, note, anim.  See docs/ADDING_A_CHAPTER.md. */
(function () {
  'use strict';
  var C = window.Chem;
  C.initTheme(document.getElementById('theme-btn'));
  C.registerServiceWorker();

  var root = document.getElementById('chapter');
  var chapterId = new URLSearchParams(location.search).get('c') || '';
  /* only allow ids like class-11/ch02-structure-of-atom */
  if (!/^class-\d+\/[a-z0-9-]+$/.test(chapterId)) {
    root.innerHTML = '<p class="loading">অধ্যায় পোৱা নগ\'ল। <a href="index.html">মূল পৃষ্ঠালৈ উভতি যাওক</a>।</p>';
    return;
  }
  var base = 'content/' + chapterId + '/';
  var glossary = {};

  /* ---- inline markup: **bold**, ^{sup}, _{sub}, [[glossary-key]] (input is escaped first) ---- */
  function inline(text) {
    var x = C.esc(text).replace(/\n/g, '<br>');
    x = x.replace(/\[\[([\w-]+)\]\]/g, function (m, k) {
      var g = glossary[k];
      if (!g) return m;
      return '<span class="term" tabindex="0" data-def="' + C.esc(g.def) + '">' + C.esc(g.as) +
        ' <span class="en">(' + C.esc(g.en) + ')</span></span>';
    });
    x = x.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    x = x.replace(/\^\{(.+?)\}/g, '<sup>$1</sup>').replace(/_\{(.+?)\}/g, '<sub>$1</sub>');
    return x;
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  var renderers = {
    p: function (b) { return el('p', '', inline(b.text)); },
    list: function (b) {
      var l = el(b.ordered ? 'ol' : 'ul');
      b.items.forEach(function (i) { l.appendChild(el('li', '', inline(i))); });
      return l;
    },
    table: function (b) {
      var wrap = el('div', 'table-wrap');
      var t = el('table');
      var head = '<thead><tr>' + b.head.map(function (h) { return '<th scope="col">' + inline(h) + '</th>'; }).join('') + '</tr></thead>';
      var body = '<tbody>' + b.rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody>';
      t.innerHTML = head + body;
      wrap.appendChild(t);
      return wrap;
    },
    formula: function (b) {
      return el('div', 'formula', (b.label ? '<span class="lbl">' + inline(b.label) + '</span>' : '') + inline(b.text));
    },
    note: function (b) {
      var kind = b.kind === 'try' ? 'try' : 'tip';
      var label = b.label || (kind === 'try' ? 'নিজে কৰি চাওক' : 'মনত ৰাখিব');
      return el('div', 'note ' + kind, '<span class="lbl">' + inline(label) + ':</span>' + inline(b.text));
    },
    anim: function (b) {
      var fig = el('figure', 'anim');
      fig.appendChild(el('div', 'anim-title', inline(b.title || '')));
      var host = el('div');
      fig.appendChild(host);
      if (b.caption) fig.appendChild(el('figcaption', '', inline(b.caption)));
      /* mount once the scripts have loaded */
      scriptsReady.then(function () { window.ChemAnim.mount(b.name, host); });
      return fig;
    }
  };

  var scriptsReady;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function renderQuiz(quiz, container) {
    var answered = 0, correct = 0, total = quiz.questions.length;
    var score = el('p', 'score');
    quiz.questions.forEach(function (q, qi) {
      var card = el('div', 'q');
      card.appendChild(el('p', 'qt', (qi + 1) + '. ' + inline(q.q)));
      var explain = el('div', 'explain'); explain.hidden = true;
      var buttons = q.options.map(function (o, oi) {
        var b = el('button', 'opt', inline(o));
        b.type = 'button';
        b.addEventListener('click', function () {
          buttons.forEach(function (x, xi) {
            x.disabled = true;
            if (xi === q.answer) x.classList.add('right');
          });
          if (oi === q.answer) correct++; else b.classList.add('wrong');
          explain.innerHTML = (oi === q.answer ? '✔ শুদ্ধ। ' : '✘ ভুল। ') + inline(q.explain || '');
          explain.hidden = false;
          answered++;
          if (answered === total) {
            score.textContent = 'আপোনাৰ নম্বৰ: ' + correct + ' / ' + total;
            C.Progress.update(chapterId, { quiz: { score: correct, total: total } });
          }
        });
        card.appendChild(b);
        return b;
      });
      card.appendChild(explain);
      container.appendChild(card);
    });
    container.appendChild(score);
    var again = el('button', 'btn', 'আকৌ চেষ্টা কৰক');
    again.type = 'button';
    again.addEventListener('click', function () { container.innerHTML = ''; renderQuiz(quiz, container); });
    container.appendChild(again);
  }

  function render(ch, quiz, catalog) {
    var title = ch.title;
    document.title = title.as + ' (' + title.en + ') · অসমীয়াত ৰসায়ন';
    root.innerHTML = '';

    var head = el('header', 'chapter-head');
    head.appendChild(el('div', 'crumbs', '<a href="index.html">অসমীয়াত ৰসায়ন</a> › শ্ৰেণী ' + ch.class + ' › অধ্যায় ' + ch.number));
    head.appendChild(el('h1', '', C.esc(title.as)));
    head.appendChild(el('div', 'en', C.esc(title.en)));
    root.appendChild(head);

    var goals = el('div', 'box');
    goals.appendChild(el('h2', '', 'এই অধ্যায়ত আপুনি শিকিব'));
    var gl = el('ul');
    ch.goals.forEach(function (g) { gl.appendChild(el('li', '', inline(g))); });
    goals.appendChild(gl);
    root.appendChild(goals);

    var toc = el('nav', 'box toc'); toc.setAttribute('aria-label', 'অধ্যায়ৰ সূচী');
    toc.appendChild(el('h2', '', 'সূচী'));
    ch.sections.forEach(function (s, i) { toc.appendChild(el('a', '', (i + 1) + '. ' + C.esc(s.title)) ).setAttribute('href', '#' + s.id); });
    toc.appendChild(el('a', '', 'কুইজ')).setAttribute('href', '#quiz');
    root.appendChild(toc);

    ch.sections.forEach(function (s, i) {
      var sec = el('section', 'sec'); sec.id = s.id;
      sec.appendChild(el('h2', '', (i + 1) + '. ' + inline(s.title)));
      s.blocks.forEach(function (b) {
        var r = renderers[b.type];
        if (r) sec.appendChild(r(b));
      });
      root.appendChild(sec);
    });

    if (ch.summary && ch.summary.length) {
      var sum = el('section', 'sec'); sum.id = 'summary';
      sum.appendChild(el('h2', '', 'সাৰাংশ'));
      sum.appendChild(renderers.list({ items: ch.summary }));
      root.appendChild(sum);
    }

    var keys = Object.keys(glossary);
    if (keys.length) {
      var gs = el('section', 'sec'); gs.id = 'terms';
      gs.appendChild(el('h2', '', 'মূল শব্দাৱলী'));
      gs.appendChild(renderers.table({
        head: ['অসমীয়া', 'English', 'অৰ্থ'],
        rows: keys.map(function (k) { var g = glossary[k]; return [g.as, g.en, g.def]; })
      }));
      /* the definition column is long: let it wrap */
      gs.querySelectorAll('td:last-child').forEach(function (td) { td.style.whiteSpace = 'normal'; td.style.minWidth = '240px'; });
      root.appendChild(gs);
    }

    var qs = el('section', 'sec'); qs.id = 'quiz';
    qs.appendChild(el('h2', '', 'কুইজ — নিজকে পৰীক্ষা কৰক'));
    var qbox = el('div');
    qs.appendChild(qbox);
    root.appendChild(qs);
    if (quiz) renderQuiz(quiz, qbox); else qbox.textContent = 'শীঘ্ৰে আহিছে।';

    /* completion + next chapter */
    var nav = el('div', 'chap-nav');
    var done = el('button', 'btn primary');
    done.type = 'button';
    function paintDone() {
      var d = C.Progress.get(chapterId).done;
      done.textContent = d ? '✔ অধ্যায় সম্পূৰ্ণ (আকৌ বাতিল কৰক)' : 'অধ্যায়টো সম্পূৰ্ণ হ\'ল বুলি চিহ্নিত কৰক';
      done.setAttribute('aria-pressed', String(!!d));
    }
    done.addEventListener('click', function () { C.Progress.update(chapterId, { done: !C.Progress.get(chapterId).done }); paintDone(); });
    paintDone();
    nav.appendChild(done);
    var cls = (catalog.classes || []).filter(function (c) { return 'class-' + ch.class === c.id; })[0];
    var next = cls && cls.chapters.filter(function (c) { return c.no === ch.number + 1; })[0];
    if (next && next.status === 'ready') {
      nav.appendChild(el('a', 'btn', 'পৰৱৰ্তী অধ্যায় →')).setAttribute('href', 'chapter.html?c=' + encodeURIComponent(next.id));
    } else {
      nav.appendChild(el('a', 'btn', '← সকলো অধ্যায়')).setAttribute('href', 'index.html');
    }
    root.appendChild(nav);

    C.Progress.update(chapterId, { seen: Date.now() });
  }

  Promise.all([
    C.fetchJSON(base + 'chapter.json'),
    C.fetchJSON(base + 'quiz.json').catch(function () { return null; }),
    C.fetchJSON('content/catalog.json').catch(function () { return { classes: [] }; })
  ]).then(function (res) {
    var ch = res[0];
    glossary = ch.glossary || {};
    var libs = ['assets/js/anim/engine.js', 'assets/js/anim/elements.js'];
    scriptsReady = libs.reduce(function (p, src) { return p.then(function () { return loadScript(src); }); }, Promise.resolve())
      .then(function () {
        return (ch.scripts || []).reduce(function (p, src) { return p.then(function () { return loadScript(base + src); }); }, Promise.resolve());
      });
    render(ch, res[1], res[2]);
  }).catch(function (err) {
    console.error(err);
    root.innerHTML = '<p class="loading">অধ্যায়টো লোড কৰিব পৰা নগ\'ল। <a href="index.html">মূল পৃষ্ঠালৈ উভতি যাওক</a>।</p>';
  });
})();
