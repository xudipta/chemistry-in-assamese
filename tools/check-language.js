#!/usr/bin/env node
/* Language check: run `node tools/check-language.js` (needs `playwright`, like tools/make-icons.js).
   For every chapter that lists a translation in content/catalog.json, it opens the chapter in that language, exercises every
   animation (each dropdown option, each slider at its ends, each button) and fails if Bengali-script text is visible
   anywhere that is not marked lang="as". Intentional Assamese (glossary terms in brackets, the Assamese subtitle, the
   Assamese form of a name) is marked lang="as" by the page, so anything else is an untranslated string.
   It also fails on JavaScript errors and on sideways scrolling at phone width. */
const http = require('http');
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { console.error('This check needs playwright: npm i -D playwright'); process.exit(2); }

const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'content/catalog.json'), 'utf8'));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(root, u);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

/* Bengali text whose nearest [lang] ancestor is not "as" (also checks aria-label / title attributes) */
function scan() {
  const BN = /[ঀ-৿]/, out = [], host = document.getElementById('chapter');
  const ok = (n) => { const e = n.nodeType === 1 ? n : n.parentElement; const l = e && e.closest('[lang]'); return !!l && l.getAttribute('lang') === 'as'; };
  const w = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const n = w.currentNode; if (BN.test(n.nodeValue) && !ok(n)) out.push(n.nodeValue.trim().slice(0, 70)); }
  host.querySelectorAll('[aria-label],[title]').forEach((e) => {
    ['aria-label', 'title'].forEach((a) => { const v = e.getAttribute(a); if (v && BN.test(v) && !ok(e)) out.push(`[${a}] ${v.slice(0, 60)}`); });
  });
  return out;
}

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch();
  const problems = [];
  let checked = 0;

  for (const cls of catalog.classes) for (const ch of cls.chapters) {
    if (ch.status !== 'ready') continue;
    for (const lang of (ch.langs || ['as']).filter((l) => l !== 'as')) {
      const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
      await page.goto(`${base}/chapter.html?c=${ch.id}&lang=${lang}`);
      await page.waitForSelector('.sec');
      await page.waitForTimeout(800);
      const label = `${ch.id} [${lang}]`;
      const seen = new Set();
      const record = async (where) => { (await page.evaluate(scan)).forEach((t) => { const key = where + '|' + t; if (!seen.has(key)) { seen.add(key); problems.push(`${label} ${where}: "${t}"`); } }); };

      await record('page');
      const figs = page.locator('figure.anim');
      const n = await figs.count();
      for (let i = 0; i < n; i++) {
        const fig = figs.nth(i);
        const name = (await fig.locator('.anim-title').innerText()).slice(0, 30);
        await fig.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await record(`animation ${i + 1} (${name})`);
        for (let s = 0, ns = await fig.locator('select').count(); s < ns; s++) {
          const opts = await fig.locator('select').nth(s).locator('option').evaluateAll((o) => o.map((x) => x.value));
          for (const v of opts) { await fig.locator('select').nth(s).selectOption(v); await page.waitForTimeout(80); await record(`animation ${i + 1} dropdown ${s + 1}=${v}`); }
        }
        for (let r = 0, nr = await fig.locator('input[type=range]').count(); r < nr; r++) {
          for (const end of ['min', 'max']) {
            await fig.locator('input[type=range]').nth(r).evaluate((el, e) => { el.value = el[e]; el.dispatchEvent(new Event('input')); }, end);
            await page.waitForTimeout(80); await record(`animation ${i + 1} slider ${r + 1} ${end}`);
          }
        }
        for (let b = 0, nb = await fig.locator('button').count(); b < nb; b++) {
          await fig.locator('button').nth(b).click({ timeout: 2000 }).catch(() => {});
          await page.waitForTimeout(80); await record(`animation ${i + 1} button ${b + 1}`);
        }
      }
      const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (widths[0] > widths[1]) problems.push(`${label}: page scrolls sideways (${widths[0]} > ${widths[1]})`);
      errs.forEach((e) => problems.push(`${label}: script error: ${e}`));
      console.log(`${problems.some((p) => p.startsWith(label)) ? '✘' : '✔'} ${label}: ${n} animation(s) checked`);
      checked++;
      await page.context().close();
    }
  }
  await browser.close();
  server.close();
  if (problems.length) { console.error(`\n${problems.length} problem(s):\n` + problems.slice(0, 60).map((p) => '  - ' + p).join('\n')); process.exit(1); }
  console.log(`✔ language check ok (${checked} translated chapter${checked === 1 ? '' : 's'})`);
})();
