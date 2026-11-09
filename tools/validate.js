#!/usr/bin/env node
/* Content validator: run `node tools/validate.js` before pushing (CI runs it too).
   Checks catalog.json, every "ready" chapter's chapter.json + quiz.json, glossary keys used in the text,
   that every animation a chapter mentions is registered in its anim.js, and that sw.js caches the chapter files. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const errors = [];
const err = (m) => errors.push(m);
const readJSON = (p) => {
  try { return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')); }
  catch (e) { err(`${p}: ${e.message}`); return null; }
};

const catalog = readJSON('content/catalog.json');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const BLOCKS = new Set(['p', 'list', 'table', 'formula', 'note', 'anim']);
let ready = 0;

(catalog ? catalog.classes : []).forEach((cls) => {
  const partNos = (cls.parts || []).map((x) => x.n);
  if (cls.parts) cls.chapters.forEach((ch) => { if (!partNos.includes(ch.part)) err(`${ch.id}: part ${ch.part} is not listed in ${cls.id} parts`); });
  cls.chapters.forEach((ch) => {
    if (!ch.title || !ch.title.as || !ch.title.en) err(`${ch.id}: catalog entry needs title.as and title.en`);
    if (ch.status !== 'ready') return;
    ready++;
    const dir = `content/${ch.id}`;
    const chapter = readJSON(`${dir}/chapter.json`);
    const quiz = readJSON(`${dir}/quiz.json`);
    if (!chapter) return;
    if (chapter.id !== ch.id) err(`${dir}/chapter.json: id "${chapter.id}" does not match catalog id "${ch.id}"`);
    if (chapter.number !== ch.no) err(`${dir}/chapter.json: number ${chapter.number} != catalog no ${ch.no}`);
    if (!Array.isArray(chapter.goals) || !chapter.goals.length) err(`${dir}: needs goals[]`);
    if (!Array.isArray(chapter.sections) || !chapter.sections.length) err(`${dir}: needs sections[]`);

    const glossary = chapter.glossary || {};
    Object.keys(glossary).forEach((k) => {
      const g = glossary[k];
      if (!g.as || !g.en || !g.def) err(`${dir}: glossary "${k}" needs as, en, def`);
    });

    /* registered animations */
    const registered = new Set();
    (chapter.scripts || []).forEach((s) => {
      const p = path.join(root, dir, s);
      if (!fs.existsSync(p)) return err(`${dir}: script ${s} not found`);
      const src = fs.readFileSync(p, 'utf8');
      for (const m of src.matchAll(/register\(\s*'([\w-]+)'/g)) registered.add(m[1]);
      if (!sw.includes(`${dir}/${s}`)) err(`sw.js: add ${dir}/${s} to SHELL so it works offline`);
    });
    ['chapter.json', 'quiz.json'].forEach((f) => { if (!sw.includes(`${dir}/${f}`)) err(`sw.js: add ${dir}/${f} to SHELL`); });

    const ids = new Set();
    const checkText = (where, text) => {
      if (typeof text !== 'string') return;
      for (const m of text.matchAll(/\[\[([\w-]+)\]\]/g)) if (!glossary[m[1]]) err(`${where}: unknown glossary key [[${m[1]}]]`);
      if (/\^\{[^}]*$|_\{[^}]*$/.test(text)) err(`${where}: unclosed ^{ or _{`);
    };
    (chapter.goals || []).forEach((g, i) => checkText(`${dir} goals[${i}]`, g));
    (chapter.summary || []).forEach((g, i) => checkText(`${dir} summary[${i}]`, g));
    (chapter.sections || []).forEach((sec) => {
      if (!/^[a-z][\w-]*$/.test(sec.id || '')) err(`${dir}: section needs a simple id`);
      if (ids.has(sec.id)) err(`${dir}: duplicate section id ${sec.id}`);
      ids.add(sec.id);
      (sec.blocks || []).forEach((b, i) => {
        const where = `${dir} ${sec.id}[${i}]`;
        if (!BLOCKS.has(b.type)) return err(`${where}: unknown block type "${b.type}"`);
        if (b.type === 'anim' && !registered.has(b.name)) err(`${where}: animation "${b.name}" is not registered by any script`);
        if (b.type === 'table') {
          if (!b.head || !b.rows) err(`${where}: table needs head and rows`);
          else b.rows.forEach((r, ri) => { if (r.length !== b.head.length) err(`${where}: row ${ri} has ${r.length} cells, head has ${b.head.length}`); r.forEach((c) => checkText(where, c)); });
        }
        if (b.type === 'list') (b.items || []).forEach((t) => checkText(where, t));
        checkText(where, b.text); checkText(where, b.caption); checkText(where, b.title);
      });
    });

    if (!quiz) return;
    (quiz.questions || []).forEach((q, i) => {
      const where = `${dir}/quiz.json q${i + 1}`;
      if (!q.q || !Array.isArray(q.options) || q.options.length < 2) err(`${where}: needs q and 2+ options`);
      else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err(`${where}: answer index out of range`);
      if (!q.explain) err(`${where}: add an explanation`);
    });
  });
});

if (errors.length) {
  console.error(`✘ ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✔ content ok (${ready} ready chapter${ready === 1 ? '' : 's'})`);
