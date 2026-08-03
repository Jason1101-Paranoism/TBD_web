// scripts/check-links.mjs — 站內連結靜態閘門
//
// 為什麼存在：知識庫已達 118 篇文章、156 頁。文章的 relatedArticles、內文連結與
// 各設定檔裡的 href 全是手寫字串，改檔名或刪文章時不會有任何東西提醒你。
// 一條指向不存在頁面的連結，build 與 verify 都不會擋——使用者才會發現。
//
// 作法：掃 dist/ 下所有 .html，取出站內 href（/ 開頭、非 http、非 mailto/tel），
// 逐一比對 dist/ 是否真的有那個檔案；帶 #anchor 的再確認目標頁有該 id。
// 事實來源是 build 產物與磁碟，不是任何設定檔。
//
// 用法：node scripts/check-links.mjs

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

const DIST = 'dist';

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) {
  console.error('找不到 dist/，請先 npm run build。');
  process.exit(2);
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

/** dist 內的實體路徑是否存在（支援 /foo/ → /foo/index.html） */
function resolves(urlPath) {
  const rel = decodeURIComponent(urlPath.replace(/^\//, ''));
  const direct = join(DIST, rel);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  const asIndex = join(DIST, rel, 'index.html');
  if (existsSync(asIndex)) return asIndex;
  // 無副檔名時 Vercel 會補 .html
  if (!posix.basename(rel).includes('.')) {
    const asHtml = join(DIST, rel + '.html');
    if (existsSync(asHtml)) return asHtml;
  }
  return null;
}

const idCache = new Map();
function hasAnchor(file, id) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set();
    for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
    for (const m of html.matchAll(/\sname="([^"]+)"/g)) ids.add(m[1]);
    idCache.set(file, ids);
  }
  return idCache.get(file).has(id);
}

const deadPages = [];
const deadAnchors = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const from = file.replace(/\\/g, '/').replace(/^dist/, '');
  const seen = new Set();

  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const raw = m[1];
    if (seen.has(raw)) continue;
    seen.add(raw);
    if (raw.startsWith('//')) continue;               // protocol-relative → 外部
    const [pathPart, hash] = raw.split('#');
    if (!pathPart) continue;                          // 純 #anchor，同頁，交給瀏覽器
    const clean = pathPart.split('?')[0];
    const target = resolves(clean);
    if (!target) { deadPages.push({ from, href: raw }); continue; }
    if (hash && target.endsWith('.html') && !hasAnchor(target, hash)) {
      deadAnchors.push({ from, href: raw });
    }
  }
}

const total = htmlFiles.length;
console.log(`\n── 站內連結檢查 ──`);
console.log(`掃描頁面：${total}`);

if (deadPages.length) {
  console.log(`\n✗ 指向不存在的頁面（${deadPages.length}）：`);
  for (const d of deadPages) console.log(`   ${d.from}  →  ${d.href}`);
}
if (deadAnchors.length) {
  console.log(`\n✗ 頁面存在但錨點不存在（${deadAnchors.length}）：`);
  for (const d of deadAnchors) console.log(`   ${d.from}  →  ${d.href}`);
}

if (!deadPages.length && !deadAnchors.length) {
  console.log('結論：✅ 無死連結');
  process.exit(0);
}
console.log(`\n結論：❌ 有死連結，禁止部署`);
process.exit(1);
