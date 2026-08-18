// scripts/check-markdown-leak.mjs — 「markdown 標記漏到頁面上」靜態閘門
//
// 為什麼存在：2026-08-18 核對發現知識庫 25 頁、80 段的 `**` 直接以字面印在頁面上。
// build 與 check-links 都是綠的，讀者才看得到。兩個根因、兩種形狀：
//
//   A 類（78 段）CommonMark flanking rule 撞中文標點。粗體內容以「。？！」結尾又
//     緊接文字時，收尾 `**` 的前一字是標點、後一字是文字，不成立 right-flanking →
//     無法收尾 → 整組吐字面。修法是把收尾 `**` 移到標點之前（`…有判斷**。`）。
//   B 類（1 處）frontmatter 的 faqItems 是純文字欄位，會原樣輸出到 <p> 與 JSON-LD，
//     完全不經 markdown 渲染。寫在那裡的 `**` 無論怎麼排都不會變粗體。
//
// 這兩類的共同可觀察特徵只有一個：**build 產物裡出現字面 `**`**。所以閘門就守這一條，
// 不去模擬 CommonMark——事實來源是 dist，不是任何對解析規則的理解。
//
// 另外附一條源頭檢查（B 類）：frontmatter 內不得出現 markdown 強調標記。它在 dist
// 檢查之前就能給出更明確的檔案與行號，省下從 HTML 回推來源的工夫。
//
// 例外：`public/assets/templates/*.md` 是提供下載的 markdown 檔，`**` 是它本來就該有的
// 內容，不在掃描範圍內（本檔只掃 dist/**/*.html 與 src/content/articles 的 frontmatter）。
//
// 用法：node scripts/check-markdown-leak.mjs

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const ARTICLES = join('src', 'content', 'articles');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

/** 取出 `**` 前後的上下文，方便直接看出是哪一段 */
function contexts(text, needle = '**') {
  const out = [];
  let i = text.indexOf(needle);
  while (i !== -1) {
    out.push(text.slice(Math.max(0, i - 45), i + needle.length + 25).replace(/\s+/g, ' '));
    i = text.indexOf(needle, i + needle.length);
  }
  return out;
}

console.log('\n── markdown 標記外漏檢查 ──');

// ── 源頭：frontmatter 不得含強調標記 ──────────────────────────────────────
const fmHits = [];
if (existsSync(ARTICLES)) {
  for (const name of readdirSync(ARTICLES).filter((f) => /\.mdx?$/.test(f))) {
    const file = join(ARTICLES, name);
    const lines = readFileSync(file, 'utf8').split('\n');
    if (lines[0]?.trim() !== '---') continue;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') break;
      if (lines[i].includes('**')) fmHits.push({ file, line: i + 1, text: lines[i].trim().slice(0, 90) });
    }
  }
}

// ── 產物：dist 的 HTML 不得含字面 ** ─────────────────────────────────────
if (!existsSync(DIST)) {
  console.error('找不到 dist/，請先 npm run build。');
  process.exit(2);
}
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const distHits = [];
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  if (!html.includes('**')) continue;
  const ctx = contexts(html);
  distHits.push({ file: f, count: ctx.length, samples: ctx.slice(0, 3) });
}

console.log(`掃描頁面：${htmlFiles.length}`);

if (fmHits.length) {
  console.log(`\n✗ frontmatter 含 markdown 強調標記（${fmHits.length}）——該欄位是純文字，不會被渲染：`);
  for (const h of fmHits) console.log(`   ${h.file}:${h.line}  ${h.text}`);
}
if (distHits.length) {
  const total = distHits.reduce((n, h) => n + h.count, 0);
  console.log(`\n✗ build 產物出現字面 \`**\`（${total} 處，${distHits.length} 頁）：`);
  for (const h of distHits) {
    console.log(`   ${h.file}  (${h.count})`);
    for (const s of h.samples) console.log(`      …${s}…`);
    if (h.count > h.samples.length) console.log(`      （其餘 ${h.count - h.samples.length} 處略）`);
  }
  console.log('\n   A 類修法：把收尾 `**` 移到中文標點之前 —— `…有判斷。**多` → `…有判斷**。多`');
  console.log('   B 類修法：frontmatter（faqItems 等純文字欄位）直接移除 `**`');
}

if (!fmHits.length && !distHits.length) {
  console.log('結論：✅ 無 markdown 標記外漏');
  process.exit(0);
}
console.log('\n結論：❌ 有 markdown 標記印在頁面上，禁止部署');
process.exit(1);
