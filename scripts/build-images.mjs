// scripts/build-images.mjs — 由原圖產生站上實際要用的衍生圖
//
// 為什麼存在：原本 public/assets/images/ 直接放 6000×3375、11.7 MB 的 PNG，
// 而它同時是首頁的 LCP 元素與全站唯一的 og:image。後果有兩個，都不是理論上的：
//   1. 行動網路上 LCP 直接進 Core Web Vitals 的「不良」區。
//   2. 超過 LINE／FB 的 OG 圖上限（5–8 MB），分享連結根本不出預覽卡——
//      而 LINE 正是這個站主要的 CTA 通道。
//
// 作法：原圖移到 assets-src/（不在 public 底下，永遠不會被部署），
// 這支腳本用 astro already 依賴的 sharp 產生衍生圖進 public/assets/images/。
// 衍生圖要進版控（Vercel 建置時不跑這支，避免部署時間受 sharp 影響）。
//
// 什麼時候要重跑：換主視覺或換 logo 時。
//   node scripts/build-images.mjs
//
// 檔名一律不含空白。原本的 `TBD_Landing Page Banner.png` 讓全站以 %20 引用，
// 任何未正規化的抓取器都可能取不到。

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'assets-src');
const OUT = path.join(ROOT, 'public/assets/images');

const kb = (n) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB');
const report = [];

async function emit(label, pipeline, file) {
  const p = path.join(OUT, file);
  await pipeline.toFile(p);
  const meta = await sharp(p).metadata();
  report.push([label, file, `${meta.width}×${meta.height}`, kb(fs.statSync(p).size)]);
}

const hero = path.join(SRC, 'hero-banner.png');
const logoLight = path.join(SRC, 'tbd-logo-light.png');
const logoDark = path.join(SRC, 'tbd-logo-dark.png');

for (const f of [hero, logoLight, logoDark]) {
  if (!fs.existsSync(f)) {
    console.error(`缺原圖：${path.relative(ROOT, f)}`);
    process.exit(1);
  }
}

// ── 首頁主視覺：三段 srcset ＋ 一張 JPEG 保底 ──
// 版面上最寬佔到 lg:w-1/2 的 6xl 容器，約 576 CSS px；2400 已涵蓋 4x DPR。
for (const w of [800, 1600, 2400]) {
  await emit('hero', sharp(hero).resize({ width: w }).webp({ quality: 78 }), `hero-banner-${w}.webp`);
}
await emit('hero fallback', sharp(hero).resize({ width: 1600 }).jpeg({ quality: 82, mozjpeg: true }), 'hero-banner-1600.jpg');

// ── OG 專用圖：1200×630 是 FB／LINE／X 的標準版位 ──
// 不共用主視覺：主視覺是 16:9，塞進 1.905:1 的版位會被平台自己裁掉重點。
await emit('og', sharp(hero).resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true }), 'og-default.jpg');

// ── Logo：導覽列宣告 168px 寬、頁尾 CSS 給 64px 高，各出 2x ──
await emit('nav logo', sharp(logoLight).resize({ width: 336 }).webp({ quality: 88 }), 'tbd-logo-light.webp');
await emit('nav logo fallback', sharp(logoLight).resize({ width: 336 }).png({ compressionLevel: 9, palette: true }), 'tbd-logo-light.png');
await emit('footer logo', sharp(logoDark).resize({ height: 128 }).webp({ quality: 88 }), 'tbd-logo-dark.webp');
await emit('footer logo fallback', sharp(logoDark).resize({ height: 128 }).png({ compressionLevel: 9, palette: true }), 'tbd-logo-dark.png');

const total = report.reduce((a, [, f]) => a + fs.statSync(path.join(OUT, f)).size, 0);
for (const r of report) console.log(`  ${r[0].padEnd(18)} ${r[1].padEnd(26)} ${r[2].padEnd(12)} ${r[3]}`);
console.log(`  ── 衍生圖合計 ${kb(total)}`);
