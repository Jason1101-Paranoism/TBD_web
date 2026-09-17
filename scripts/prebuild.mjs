// scripts/prebuild.mjs — build 前的產物生成
//
// 三件事，都是 SEO 報告（progress/build-seo-progress.mjs）點名的：
//
//   1. S-04  把 public/css/ 的五個模組串成 public/css/style.css，消掉 @import。
//            @import 不平行下載，會把關鍵渲染路徑序列化。
//   2. S-06  產生 src/config/lastmod.json（路徑／slug → git 最後提交時間），
//            給 sitemap 的 <lastmod> 與文章 schema 的 dateModified 用。
//   3. A-03  產生 public/llms.txt，生成式引擎讀「站點自述 ＋ 權威頁面清單」的事實標準入口。
//
// 為什麼是 build 前而不是手寫：這三份都是衍生物。手寫的話，內容改了沒有人回頭改它們，
// 它們就開始說謊——那正是 D-003 的形狀。
//
// 產物一律進版控（不 gitignore）：public/pages/*.html 那兩個靜態頁直接連 /css/style.css，
// dev 時沒有人會先跑 build，檔案必須本來就在。

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const p = (...s) => path.join(ROOT, ...s);
const read = (f) => fs.readFileSync(f, 'utf8');

// ── 1. CSS bundle（S-04）────────────────────────────────────────────
// 順序就是原本 style.css 的 @import 順序，改動它會改變層疊結果。
const CSS_ORDER = ['tbd-theme.css', 'tbd-base.css', 'tbd-layout.css', 'tbd-components.css', 'tbd-pages.css'];

function buildCss() {
  const parts = CSS_ORDER.map((name) => {
    const f = p('public/css', name);
    if (!fs.existsSync(f)) throw new Error(`CSS 模組不存在：${name}`);
    return `/* ── ${name} ───────────────────────────────────── */\n${read(f).trim()}\n`;
  });
  const header = `/* 這個檔案由 scripts/prebuild.mjs 產生，不要手動編輯。
   要改樣式請改 public/css/ 底下對應的模組：
   ${CSS_ORDER.join('、')}
   然後跑 npm run build（或直接 node scripts/prebuild.mjs）重新產生。 */\n\n`;
  const out = header + parts.join('\n');
  fs.writeFileSync(p('public/css/style.css'), out, 'utf8');
  return { files: CSS_ORDER.length, kb: Math.round(Buffer.byteLength(out) / 1024) };
}

// ── 2. lastmod（S-06 / S-08）────────────────────────────────────────
// git 拿不到就退回檔案 mtime（新檔、還沒 commit 的情況）。
function gitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return out;
  } catch {
    // 不是 git repo、或該檔從未被提交——兩種都退回 mtime
  }
  return fs.statSync(file).mtime.toISOString();
}

function walk(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, ext, out);
    else if (e.name.endsWith(ext)) out.push(f);
  }
  return out;
}

function buildLastmod() {
  const byPath = {};
  const bySlug = {};

  // 首頁
  byPath['/'] = gitDate(p('src/pages/index.astro'));

  // src/pages/pages/**.astro → /pages/**.html
  for (const f of walk(p('src/pages/pages'), '.astro')) {
    const rel = path.relative(p('src/pages'), f).split(path.sep).join('/');
    if (rel.includes('[')) continue; // 動態路由由 content 那邊處理
    byPath['/' + rel.replace(/\.astro$/, '.html')] = gitDate(f);
  }

  // public/pages/*.html（直接靜態服務的兩頁）
  for (const f of walk(p('public/pages'), '.html')) {
    const rel = path.relative(p('public'), f).split(path.sep).join('/');
    byPath['/' + rel] = gitDate(f);
  }

  // 文章：src/content/articles/<slug>.mdx → /pages/resources/<slug>.html
  for (const f of walk(p('src/content/articles'), '.mdx')) {
    const slug = path.basename(f, '.mdx');
    const d = gitDate(f);
    bySlug[slug] = d;
    byPath[`/pages/resources/${slug}.html`] = d;
  }

  const out = { _generatedBy: 'scripts/prebuild.mjs', byPath, bySlug };
  fs.writeFileSync(p('src/config/lastmod.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
  return { paths: Object.keys(byPath).length, slugs: Object.keys(bySlug).length };
}

// ── 3. llms.txt（A-03）──────────────────────────────────────────────
// 只列真的存在的頁；標題與說明取自文章 frontmatter，不另外編寫。
function frontmatter(file) {
  const s = read(file);
  const m = s.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
    fm[kv[1]] = v;
  }
  return fm;
}

const SITE = 'https://tbd-edu.com';

const CORE_PAGES = [
  ['/pages/services.html', '服務內容：四種方案與各升學管道的服務說明'],
  ['/pages/process.html', '合作流程與各升學管道的申請時程'],
  ['/pages/cases.html', '成功案例'],
  ['/pages/resources.html', '知識庫首頁：升學準備的主題指南與文章'],
  ['/pages/resources/tools.html', '可下載的模板與工具（研究所推甄工具包等）'],
  ['/pages/faq.html', '常見問題'],
  ['/pages/about.html', '關於 TBD Studio'],
];

function buildLlms(articles) {
  const lines = [];
  lines.push('# TBD Studio');
  lines.push('');
  lines.push('> 台灣的升學申請策略顧問。協助高中生與研究所申請者完成方向判斷、備審重構、');
  lines.push('> 學習歷程整理與面試訓練。核心原則是共創而非代筆：把學生既有的經歷整理成');
  lines.push('> 可被教授理解、可被面試答辯的申請系統，每一步準備都可追蹤、可驗收。');
  lines.push('');
  lines.push('服務對象為台灣的高中生、大學生與家長，內容以繁體中文撰寫。');
  lines.push('');
  lines.push('## 主要頁面');
  lines.push('');
  for (const [href, desc] of CORE_PAGES) {
    if (!fs.existsSync(p('src/pages' + href.replace(/\.html$/, '.astro')))) continue;
    lines.push(`- [${desc}](${SITE}${href})`);
  }
  lines.push('');
  lines.push('## 知識庫文章');
  lines.push('');
  for (const a of articles) {
    lines.push(`- [${a.title}](${SITE}/pages/resources/${a.slug}.html): ${a.description}`);
  }
  lines.push('');
  const out = lines.join('\n');
  fs.writeFileSync(p('public/llms.txt'), out, 'utf8');
  return { pages: CORE_PAGES.length, articles: articles.length };
}

// ── 4. 社群資源庫快照（S-14）────────────────────────────────────────
// library 頁的清單原本是前端 fetch Google Sheet 的 CSV 產生的，爬蟲與生成式引擎
// 只拿得到一個空殼。改成建置期抓一次、存成快照，頁面直接靜態渲染。
//
// 抓不到就沿用上一份快照（檔案已進版控）。這是刻意的：把外部網路變成 build 的硬相依，
// 等於讓別人的分享設定可以弄爆我們的部署。抓不到只是內容舊一點，不該讓 build 失敗。
const LIB_CSV = 'https://docs.google.com/spreadsheets/d/1wwhuwgx8bWd2qkUzEfyMCkLJaNM_fP-F7E8L7OEBP4M/gviz/tq?tqx=out:csv';
const LIB_SNAP = p('src/config/library-snapshot.json');

function parseCsv(text) {
  const rows = [];
  let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

// 欄位：0 分類, 1 貼文標題, 2 貼文連結, 3 懶人包標題, 4 懶人包連結, 5 站上完整文章
const toItems = (rows) => rows
  .filter((r) => /^https?:\/\//i.test((r[2] || '').trim()))
  .map((r) => ({
    category: (r[0] || '').trim() || '其他',
    title: (r[1] || '').trim(),
    postUrl: (r[2] || '').trim(),
    lpTitle: (r[3] || '').trim(),
    lpUrl: (r[4] || '').trim(),
    article: (r[5] || '').trim(),
  }));

async function buildLibrary() {
  const prev = fs.existsSync(LIB_SNAP) ? JSON.parse(read(LIB_SNAP)) : { items: [] };
  try {
    const res = await fetch(LIB_CSV, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const items = toItems(parseCsv(await res.text()));
    if (!items.length) throw new Error('解析後 0 筆，不覆蓋既有快照');
    fs.writeFileSync(LIB_SNAP, JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2) + '\n', 'utf8');
    return { n: items.length, fresh: true };
  } catch (e) {
    return { n: prev.items.length, fresh: false, why: e.message };
  }
}

// ── 執行 ────────────────────────────────────────────────────────────
const css = buildCss();
const lm = buildLastmod();

const articles = walk(p('src/content/articles'), '.mdx')
  .map((f) => ({ slug: path.basename(f, '.mdx'), ...frontmatter(f) }))
  .filter((a) => a.title && a.description)
  .sort((a, b) => a.slug.localeCompare(b.slug));
const llms = buildLlms(articles);

const lib = await buildLibrary();

console.log(`prebuild ✓`);
console.log(`  style.css   ${css.files} 個模組串成 1 檔，${css.kb} KB，0 個 @import`);
console.log(`  lastmod     ${lm.paths} 個路徑、${lm.slugs} 篇文章`);
console.log(`  llms.txt    ${llms.pages} 個主要頁面、${llms.articles} 篇文章`);
console.log(`  資源庫快照  ${lib.n} 筆${lib.fresh ? '（本次重新抓取）' : `（沿用上次快照；抓取失敗：${lib.why}）`}`);
