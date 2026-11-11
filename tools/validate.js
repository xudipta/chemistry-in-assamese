#!/usr/bin/env node
/* Content validator: run `node tools/validate.js` before pushing (CI runs it too).
   Checks catalog.json and every "ready" chapter: chapter.json + quiz.json (Assamese, the default) and, for every other
   language listed in the catalog's "langs", chapter.<code>.json + quiz.<code>.json.
   Per file: glossary keys used in the text, section ids, block types, tables, quiz answers, that every animation
   a chapter mentions is registered in its anim.js, and that sw.js caches the files.
   Per translation: the file must have exactly the same structure as the Assamese one (same sections, blocks, list and
   table sizes, glossary keys, quiz answers) and must not contain Bengali script, except in the Assamese glossary terms
   and title.as, which are copied from the Assamese file. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const errors = [];
const err = (m) => errors.push(m);
const readJSON = (p) => {
  try { return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')); }
  catch (e) { err(`${p}: ${e.message}`); return null; }
};

const KNOWN_LANGS = ['as', 'en'];
const BENGALI = /[ঀ-৿]/;
const catalog = readJSON('content/catalog.json');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const BLOCKS = new Set(['p', 'list', 'table', 'formula', 'note', 'anim']);
/* string values that must be identical in every language (they are identifiers, not prose) */
const IDENTICAL_KEYS = new Set(['id', 'type', 'name', 'kind']);
/* ids the chapter page generates itself */
const RESERVED_IDS = new Set(['summary', 'key-terms', 'quiz', 'chapter']);
let ready = 0;

const suffix = (lang) => (lang === 'as' ? '' : `.${lang}`);

/* ---- structure parity between the Assamese file and a translation ---- */
function sameShape(a, b, where, out) {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) { out(`${where}: different kind of value`); return; }
  if (Array.isArray(a)) {
    if (a.length !== b.length) { out(`${where}: ${b.length} item(s), the Assamese file has ${a.length}`); return; }
    a.forEach((x, i) => sameShape(x, b[i], `${where}[${i}]`, out));
  } else if (a && typeof a === 'object') {
    const ka = Object.keys(a).sort().join(','), kb = Object.keys(b).sort().join(',');
    if (ka !== kb) { out(`${where}: keys differ (Assamese: ${ka}; this file: ${kb})`); return; }
    Object.keys(a).forEach((k) => {
      if (typeof a[k] === 'string' && IDENTICAL_KEYS.has(k) && a[k] !== b[k]) out(`${where}.${k}: must be "${a[k]}", found "${b[k]}"`);
      sameShape(a[k], b[k], `${where}.${k}`, out);
    });
  } else if (typeof a !== 'string' && a !== b) out(`${where}: must be ${JSON.stringify(a)}, found ${JSON.stringify(b)}`);
}
function walkStrings(o, p, fn) {
  if (typeof o === 'string') fn(o, p);
  else if (Array.isArray(o)) o.forEach((x, i) => walkStrings(x, `${p}[${i}]`, fn));
  else if (o && typeof o === 'object') Object.keys(o).forEach((k) => walkStrings(o[k], p ? `${p}.${k}` : k, fn));
}

/* ---- checks for one language file of one chapter ---- */
function checkChapterFile(dir, file, chapter, ch, registered) {
  const where0 = `${dir}/${file}`;
  if (chapter.id !== ch.id) err(`${where0}: id "${chapter.id}" does not match catalog id "${ch.id}"`);
  if (chapter.number !== ch.no) err(`${where0}: number ${chapter.number} != catalog no ${ch.no}`);
  if (!Array.isArray(chapter.goals) || !chapter.goals.length) err(`${where0}: needs goals[]`);
  if (!Array.isArray(chapter.sections) || !chapter.sections.length) err(`${where0}: needs sections[]`);

  const glossary = chapter.glossary || {};
  Object.keys(glossary).forEach((k) => {
    const g = glossary[k];
    if (!g.as || !g.en || !g.def) err(`${where0}: glossary "${k}" needs as, en, def`);
  });

  const ids = new Set();
  const checkText = (where, text) => {
    if (typeof text !== 'string') return;
    for (const m of text.matchAll(/\[\[([\w-]+)\]\]/g)) if (!glossary[m[1]]) err(`${where}: unknown glossary key [[${m[1]}]]`);
    if (/\^\{[^}]*$|_\{[^}]*$/.test(text)) err(`${where}: unclosed ^{ or _{`);
  };
  (chapter.goals || []).forEach((g, i) => checkText(`${where0} goals[${i}]`, g));
  (chapter.summary || []).forEach((g, i) => checkText(`${where0} summary[${i}]`, g));
  (chapter.sections || []).forEach((sec) => {
    if (!/^[a-z][\w-]*$/.test(sec.id || '')) err(`${where0}: section needs a simple id`);
    if (RESERVED_IDS.has(sec.id)) err(`${where0}: section id "${sec.id}" is used by the page itself (summary, key-terms, quiz); pick another`);
    if (ids.has(sec.id)) err(`${where0}: duplicate section id ${sec.id}`);
    ids.add(sec.id);
    (sec.blocks || []).forEach((b, i) => {
      const where = `${where0} ${sec.id}[${i}]`;
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
}
function checkQuizFile(dir, file, quiz) {
  (quiz.questions || []).forEach((q, i) => {
    const where = `${dir}/${file} q${i + 1}`;
    if (!q.q || !Array.isArray(q.options) || q.options.length < 2) err(`${where}: needs q and 2+ options`);
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err(`${where}: answer index out of range`);
    if (!q.explain) err(`${where}: add an explanation`);
  });
}

(catalog ? catalog.classes : []).forEach((cls) => {
  const partNos = (cls.parts || []).map((x) => x.n);
  if (cls.parts) cls.chapters.forEach((ch) => { if (!partNos.includes(ch.part)) err(`${ch.id}: part ${ch.part} is not listed in ${cls.id} parts`); });
  cls.chapters.forEach((ch) => {
    if (!ch.title || !ch.title.as || !ch.title.en) err(`${ch.id}: catalog entry needs title.as and title.en`);
    if (ch.status !== 'ready') return;
    ready++;
    const dir = `content/${ch.id}`;
    const langs = ch.langs || ['as'];
    if (!langs.includes('as')) err(`${ch.id}: "langs" must include "as" (the default)`);
    langs.forEach((l) => { if (!KNOWN_LANGS.includes(l)) err(`${ch.id}: unknown language "${l}" (add it to KNOWN_LANGS here and in assets/js/core/i18n.js)`); });

    const base = readJSON(`${dir}/chapter.json`);
    const baseQuiz = readJSON(`${dir}/quiz.json`);
    if (!base) return;

    /* animations registered by the chapter's scripts (shared by every language) */
    const registered = new Set();
    (base.scripts || []).forEach((s) => {
      const p = path.join(root, dir, s);
      if (!fs.existsSync(p)) return err(`${dir}: script ${s} not found`);
      const src = fs.readFileSync(p, 'utf8');
      for (const m of src.matchAll(/register\(\s*'([\w-]+)'/g)) registered.add(m[1]);
      if (!sw.includes(`${dir}/${s}`)) err(`sw.js: add ${dir}/${s} to SHELL so it works offline`);
    });

    langs.forEach((lang) => {
      const cf = `chapter${suffix(lang)}.json`, qf = `quiz${suffix(lang)}.json`;
      [cf, qf].forEach((f) => { if (!sw.includes(`${dir}/${f}`)) err(`sw.js: add ${dir}/${f} to SHELL`); });
      const chapter = lang === 'as' ? base : readJSON(`${dir}/${cf}`);
      const quiz = lang === 'as' ? baseQuiz : readJSON(`${dir}/${qf}`);
      if (!chapter) return;
      checkChapterFile(dir, cf, chapter, ch, registered);
      if (quiz) checkQuizFile(dir, qf, quiz); else if (lang !== 'as') err(`${dir}/${qf}: missing (the catalog lists "${lang}" for this chapter)`);

      if (lang === 'as') return;
      /* translation: same structure as the Assamese files, and no Bengali script in the prose */
      sameShape(base, chapter, cf, err);
      if (quiz && baseQuiz) sameShape(baseQuiz, quiz, qf, err);
      if (chapter.title && base.title && chapter.title.as !== base.title.as) err(`${cf}: title.as must equal the Assamese file's`);
      Object.keys(base.glossary || {}).forEach((k) => {
        const g = (chapter.glossary || {})[k];
        if (g && g.as !== base.glossary[k].as) err(`${cf}: glossary "${k}".as must equal the Assamese file's ("${base.glossary[k].as}")`);
      });
      const noBengali = (obj, file) => walkStrings(obj, '', (s, p) => {
        if (/^title\.as$/.test(p) || /^glossary\.[\w-]+\.as$/.test(p)) return;
        if (BENGALI.test(s)) err(`${dir}/${file} ${p}: contains Assamese text; translate it`);
      });
      noBengali(chapter, cf);
      if (quiz) noBengali(quiz, qf);
    });
  });
});

if (errors.length) {
  console.error(`✘ ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✔ content ok (${ready} ready chapter${ready === 1 ? '' : 's'})`);
