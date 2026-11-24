#!/usr/bin/env node
/* Validate every gallery/demos/*.js against docs/KONTRAK-DEMO.md and
   regenerate the <script> list in gallery/index.html.
   Usage: node gallery/check.js            (validate + rebuild index)
          node gallery/check.js file.js    (validate one file only) */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = path.join(__dirname, 'demos');
const CATS = ['Menu & Navigasi', 'Tombol & Toggle', 'Input & Form', 'List & Gesture', 'Kartu & Konten',
  'Modal, Sheet & Tooltip', 'Loading & Skeleton', 'Feedback & Notifikasi', 'Teks & Angka', 'Transisi Halaman', 'Prinsip Gerak', 'Latar & Efek'];
const REQ = ['id', 'cat', 'name', 'source', 'trigger', 'motion', 'timing', 'use', 'html'];

const only = process.argv[2] ? [path.resolve(process.argv[2])] : null;
const files = (only || fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().map(f => path.join(dir, f)));
const seen = new Map();
let errors = 0;
const err = (f, m) => { errors++; console.error('✗ ' + path.basename(f) + ': ' + m); };

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const got = [];
  const ctx = { LUZ: { add: e => got.push(e) }, console };
  try { vm.runInNewContext(src, ctx, { filename: f, timeout: 1000 }); }
  catch (e) { err(f, 'script error: ' + e.message); continue; }
  if (!got.length) err(f, 'no LUZ.add() calls');
  for (const e of got) {
    const where = (e && e.id) || '?';
    for (const k of REQ) if (!e[k] || typeof e[k] !== 'string') err(f, where + ' missing ' + k);
    if (e.id && !/^[a-z0-9]+(-[a-z0-9]+)+$/.test(e.id)) err(f, where + ' id must be kebab-case with a set prefix');
    if (e.id && seen.has(e.id)) err(f, where + ' duplicate id (also in ' + seen.get(e.id) + ')');
    if (e.id) seen.set(e.id, path.basename(f));
    if (e.cat && !CATS.includes(e.cat)) err(f, where + ' unknown cat "' + e.cat + '"');
    if (e.js && typeof e.js !== 'function') err(f, where + ' js must be a function');
    if (e.css) {
      // every selector list must start with & (ignore @keyframes bodies and @media wrappers)
      const stripped = e.css.replace(/@keyframes[^{]+\{([^{}]*\{[^}]*\})*\s*\}/g, '');
      const sels = stripped.replace(/@media[^{]+\{/g, '').replace(/\{[^}]*\}/g, '\n').split('\n').map(s => s.trim()).filter(s => s && s !== '}');
      for (const s of sels) for (const part of s.split(',')) {
        if (!part.trim().startsWith('&')) err(f, where + ' css selector not scoped with &: "' + part.trim().slice(0, 60) + '"');
      }
      if (/#[0-9a-fA-F]{3,8}\b/.test(e.css) && !e.allowColor) console.warn('! ' + where + ' uses a literal hex colour (ok only if intentional; set allowColor:true)');
    }
    if (/\sid="/.test(e.html || '')) err(f, where + ' html must not use id attributes');
  }
}

if (!only) {
  const idx = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(idx, 'utf8');
  const tags = files.map(f => '<script src="demos/' + path.basename(f) + '"></script>').join('\n');
  html = html.replace(/<!--DEMOS-->[\s\S]*?(<!--\/DEMOS-->|$)/, '<!--DEMOS-->\n' + tags + '\n<!--/DEMOS-->\n');
  fs.writeFileSync(idx, html);
  // catalog for the skill
  const all = [];
  for (const f of files) { const ctx = { LUZ: { add: e => all.push(e) } }; try { vm.runInNewContext(fs.readFileSync(f, 'utf8'), ctx); } catch (e) {} }
  const byCat = {};
  all.forEach(e => (byCat[e.cat] = byCat[e.cat] || []).push(e));
  let md = '# Katalog Luz Motion\n\n' + all.length + ' animasi. Sebut ID-nya di prompt, mis. "pakai `menu-circle-reveal` untuk menu di header".\n\n';
  for (const c of CATS) if (byCat[c]) {
    md += '## ' + c + '\n\n';
    for (const e of byCat[c]) md += '### `' + e.id + '` — ' + e.name + '\n- Sumber: ' + e.source + '\n- Pemicu: ' + e.trigger + '\n- Gerak: ' + e.motion + '\n- Durasi & easing: ' + e.timing + '\n- Cocok untuk: ' + e.use + '\n- Kode: `gallery/demos/' + seen.get(e.id) + '`\n\n';
  }
  fs.writeFileSync(path.join(__dirname, '..', 'skill', 'luz-motion', 'references', 'katalog.md'), md);
  console.log('index.html + skill katalog rebuilt: ' + all.length + ' animations in ' + files.length + ' files');
}
console.log(errors ? errors + ' error(s)' : 'OK ' + seen.size + ' animations');
process.exit(errors ? 1 : 0);
