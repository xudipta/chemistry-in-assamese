#!/usr/bin/env node
/* Generates PNG icons + social preview from assets/favicon.svg.  Needs `playwright` (npm i -D playwright). */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(root, 'assets/favicon.svg'), 'utf8');
const out = path.join(root, 'assets/icons');
fs.mkdirSync(out, { recursive: true });

const tile = (size, pad, rounded) => `<html><body style="margin:0;background:${rounded ? 'transparent' : '#0b7a6f'}">
  <div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:#0b7a6f;${rounded ? '' : ''}">
    <div style="width:${size - pad * 2}px;height:${size - pad * 2}px">${svg}</div></div></body></html>`;
const og = `<html><body style="margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#0b7a6f,#0a3d38);display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box;font-family:'Noto Sans Bengali',sans-serif;color:#fff">
  <div style="width:280px;height:280px;flex:none">${svg}</div>
  <div><div style="font-size:84px;font-weight:800;line-height:1.2">অসমীয়াত ৰসায়ন</div>
  <div style="font-size:40px;opacity:.85;margin-top:12px">Chemistry in Assamese · animated, chapter by chapter</div></div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const jobs = [
    ['icon-192.png', 192, tile(192, 0), 192, 192], ['icon-512.png', 512, tile(512, 0), 512, 512],
    ['apple-touch-icon.png', 180, tile(180, 0), 180, 180],
    ['icon-maskable-512.png', 512, tile(512, 96), 512, 512], ['og-image.png', 0, og, 1200, 630]
  ];
  for (const [name, , html, w, h] of jobs) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(html);
    await page.screenshot({ path: path.join(out, name) });
    await page.close();
    console.log('wrote', name);
  }
  await browser.close();
})();
