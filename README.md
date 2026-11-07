# 🧪 অসমীয়াত ৰসায়ন — Chemistry in Assamese

An animated, chapter-by-chapter guide to higher-secondary chemistry (AHSEC Class 11–12), written in Assamese with the
English term in brackets. Installable as a web app and works offline.

**Live site:** https://xudipta.github.io/chemistry-in-assamese/

*Language: the app (navigation, buttons, labels) is in English; the subject content is in Assamese.*

## Status
| Class | Chapter | Status |
|---|---|---|
| 11 | 2 · পৰমাণুৰ গঠন (Structure of Atom) | ✅ proof of concept: 5 sections, 6 animations, quiz |
| 11 | other chapters | listed on the home page as "শীঘ্ৰে আহিছে" (coming soon) |
| 12 | all | not started |

The chapter list in `content/catalog.json` is a draft: check it against the AHSEC textbook.
The Assamese text and element names are a first draft and need review by a chemistry teacher.

## Features
- Chapter pages built from JSON: goals, sections, tables, formula boxes, tips, glossary tooltips, summary, quiz
- Interactive animations (plain SVG/canvas): atom builder, α-scattering, Bohr jumps and photons, quantum-number explorer,
  rotatable 3-D orbitals, step-by-step electron filling (Aufbau, Pauli, Hund, Cr/Cu exceptions)
- Progress (chapters done, quiz scores) saved in the browser
- Light/dark theme, mobile first, respects "reduce motion"
- Installable and offline (manifest + service worker, network-first)
- Self-hosted Noto Sans Bengali font (SIL OFL), so Assamese renders the same everywhere

## Run locally
No build step:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
node tools/validate.js        # check all content before pushing
```

## Deployment
`.github/workflows/pages.yml` validates the content and deploys to GitHub Pages on every push to **`main`**.
One-time setup: **Settings → Pages → Source: GitHub Actions**.

## Structure
```
index.html, chapter.html     home (class tabs + chapter grid) and the single chapter template
manifest.webmanifest, sw.js  installable + offline (bump VERSION in sw.js after big changes)
assets/css/base.css          styles (light/dark)
assets/js/core/              app.js (theme, progress), home.js, chapter.js (renderer)
assets/js/anim/              engine.js (animation kit), elements.js (elements 1–36)
assets/fonts/                Noto Sans Bengali (woff2) + licence
content/catalog.json         all classes and chapters, and which are ready
content/class-11/ch02-…/     chapter.json, quiz.json, anim.js (this chapter's animations)
tools/                       validate.js (content checks), make-icons.js (PNG icons, needs playwright)
docs/ADDING_A_CHAPTER.md     step-by-step guide for new chapters
```

## Content and copyright
Explanations are written from scratch for this project; the textbooks are used only as the syllabus reference.
Do not paste textbook text or figures into the content files. This is an unofficial educational project and is not
affiliated with AHSEC or SCERT Assam.
