# Adding a chapter

1. **Catalog.** In `content/catalog.json` set the chapter's `"status": "ready"`.
2. **Folder.** Create `content/class-11/chNN-short-name/` (the id in the catalog must match: `class-11/chNN-short-name`) with:
   - `chapter.json` — the text (format below)
   - `quiz.json` — the questions
   - `anim.js` — the animations (optional if the chapter has none)
3. **Offline.** Add the three files to `SHELL` in `sw.js`, then bump `VERSION`.
4. **Check.** `node tools/validate.js` must pass; open `chapter.html?c=class-11/chNN-short-name` locally.
5. Commit and push to `main`; the site redeploys automatically.

## chapter.json

```jsonc
{
  "id": "class-11/ch02-structure-of-atom", "class": 11, "number": 2,
  "title": { "as": "পৰমাণুৰ গঠন", "en": "Structure of Atom" },
  "scripts": ["anim.js"],                       // loaded after the shared engine
  "goals": ["…"],                               // "what you will learn"
  "glossary": { "nucleus": { "as": "নিউক্লিয়াছ", "en": "nucleus", "def": "one-line meaning" } },
  "sections": [ { "id": "subatomic", "title": "…", "blocks": [ /* see below */ ] } ],
  "summary": ["…"]
}
```

### Blocks
| type | fields |
|---|---|
| `p` | `text` |
| `list` | `items[]`, optional `ordered: true` |
| `table` | `head[]`, `rows[][]` (every row as long as `head`) |
| `formula` | `label`, `text` (use `\n` for a line break) |
| `note` | `text`, optional `label`, `kind: "try"` for "try it yourself" |
| `anim` | `name` (registered in `anim.js`), `title`, `caption` |

### Inline markup (inside any text)
`**bold**` · `^{sup}` · `_{sub}` · `[[glossary-key]]` (shows "অসমীয়া (English)" with a tooltip) · `\n` line break.
Everything else is escaped, so plain `<` and `&` are safe.

## quiz.json
```json
{ "questions": [ { "q": "…", "options": ["a", "b", "c", "d"], "answer": 1, "explain": "why" } ] }
```
`answer` is the zero-based index of the right option. Every question needs an explanation.

## Writing an animation (`anim.js`)
```js
ChemAnim.register('my-anim', function (root, k) {
  // root: empty element to fill.  k: { h, s, button, slider, select, loop, cssVar, hiDpiCanvas, reduceMotion }
  var svg = k.s('svg', { viewBox: '0 0 300 300', 'class': 'anim-svg' });
  root.appendChild(svg);
  root.appendChild(k.h('div', { 'class': 'row' }, [ k.button('Go', function () {}) ]));
  var lp = k.loop(root, function (dt) { /* update + draw */ });   // pauses when off-screen
  if (!k.reduceMotion) lp.start();
});
```
Guidelines: use CSS variables for colours (`var(--proton)`, `var(--electron)`, …) so dark mode works; keep a text
read-out (`class="readout"`, `aria-live="polite"`) next to every picture; give SVG/canvas an `aria-label`;
use `k.reduceMotion` to avoid autoplay; use real physics/chemistry values (e.g. E = −13.6/n² eV), not made-up ones.

## Language style
- **App UI is English** (navigation, buttons, badges, messages, animation controls such as Play/Pause/Next). **Subject content is Assamese** (chapter text, captions, read-outs, quiz, glossary).
- Assamese letters ৰ and ৱ (not the Bengali র). English term in brackets on first use.
- Use Western digits for data and formulae (1.602 × 10^{-19} C).
- Have a chemistry teacher review new text before the chapter is marked ready.
