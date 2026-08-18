// scripts/check-grad-departments.mjs — 研究所學群體系一致性閘門
//
// 為什麼存在：2026-08-18 核對發現「學群有幾個」在三個地方各有答案——
// `gradTemplateGroups` 7（缺設計傳播）、`gradGuides` 8（缺農生環境）、
// 出貨清單 9。三份都是手寫，沒有任何東西保證它們一致，所以誰都不知道哪個才對。
// 同日定案 9（含農生環境，內容之後補），`scripts/grad-departments.json` 成為正本。
//
// 定案不是把數字寫進待辦就算數：農生環境目前研究所內容一份都沒有，
// 直接加進 `gradGuides` 會在前台開出通往不存在頁面的入口。所以正本帶三態：
//
//   shipped     指南頁 + 五份模板都在
//   guide-only  指南頁在、模板未補（設計傳播）——已知缺口，不是漏記
//   planned     研究所內容未產出（農生環境）——前台不得有入口
//
// 本閘門校驗四件事，兩兩獨立、事實來源各不相同：
//   1. 正本自身：總數等於 decidedCount、狀態值合法、planned 不得帶 guide 路徑
//   2. vs `src/config/gradTemplates.ts`：gradGuides ＝ 非 planned 的集合；
//      gradTemplateGroups ＝ shipped 的集合
//   3. vs `scripts/template-manifest.json`：shipped 每群至少五份 slugPrefix 模板；
//      非 shipped 的群一份都不該有（有的話代表狀態該升級了，不是模板該刪）
//   4. vs `dist/`：非 planned 的指南頁必須真的 build 出來；planned 的不得存在
//
// 用法：node scripts/check-grad-departments.mjs

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = join('scripts', 'grad-departments.json');
const CONFIG = join('src', 'config', 'gradTemplates.ts');
const MANIFEST = join('scripts', 'template-manifest.json');
const DIST = 'dist';
const VALID = ['shipped', 'guide-only', 'planned'];

const problems = [];

let source;
try {
  source = JSON.parse(readFileSync(SOURCE, 'utf8'));
} catch (e) {
  console.error(`讀不到 ${SOURCE}：${e.message}（沒有它就沒有這道閘門）`);
  process.exit(2);
}
const depts = source.departments ?? [];

// ── 1. 正本自身 ────────────────────────────────────────────────────────────
if (depts.length !== source.decidedCount) {
  problems.push(
    `正本宣告 decidedCount = ${source.decidedCount}，但 departments 實際有 ${depts.length} 筆。` +
    `\n      學群數要改是決策，不是筆誤——改了要同步更新 decidedCount 並在 DECISIONS.md 補記。`
  );
}
for (const d of depts) {
  if (!VALID.includes(d.status)) {
    problems.push(`\`${d.dept}\` 的 status 是 ${JSON.stringify(d.status)}，只能是 ${VALID.join(' / ')}`);
  }
  if (d.status === 'planned' && d.guide) {
    problems.push(`\`${d.dept}\` 是 planned（內容未產出）卻填了 guide 路徑 ${d.guide}——前台不該有入口`);
  }
  if (d.status !== 'planned' && !d.guide) {
    problems.push(`\`${d.dept}\` 是 ${d.status} 卻沒有 guide 路徑`);
  }
}

const expectGuides = depts.filter((d) => d.status !== 'planned').map((d) => d.dept);
const expectGroups = depts.filter((d) => d.status === 'shipped').map((d) => d.dept);

// ── 2. vs gradTemplates.ts ────────────────────────────────────────────────
/** 從 TS 原始碼裡抓某個 export 陣列區塊內的所有 dept: '…' */
function deptsInArray(src, exportName) {
  const start = src.indexOf(`export const ${exportName}`);
  if (start === -1) return null;
  const rest = src.slice(start);
  const end = rest.indexOf('\n];');
  const block = end === -1 ? rest : rest.slice(0, end);
  return [...block.matchAll(/\bdept:\s*'([^']+)'/g)].map((m) => m[1]);
}

if (!existsSync(CONFIG)) {
  problems.push(`找不到 ${CONFIG}`);
} else {
  const src = readFileSync(CONFIG, 'utf8');
  const pairs = [
    ['gradGuides', expectGuides, '有指南的學群（shipped + guide-only）'],
    ['gradTemplateGroups', expectGroups, '有模板的學群（shipped）'],
  ];
  for (const [name, expected, what] of pairs) {
    const actual = deptsInArray(src, name);
    if (actual === null) { problems.push(`${CONFIG} 裡找不到 export const ${name}`); continue; }
    const missing = expected.filter((d) => !actual.includes(d));
    const extra = actual.filter((d) => !expected.includes(d));
    for (const d of missing) problems.push(`${name} 少了 \`${d}\`——正本說它屬於${what}`);
    for (const d of extra) problems.push(`${name} 多了 \`${d}\`——正本沒有把它列為${what}`);
  }
}

// ── 3. vs template-manifest.json ──────────────────────────────────────────
let slugs = [];
try {
  slugs = JSON.parse(readFileSync(MANIFEST, 'utf8')).templates.map((t) => t.slug);
} catch (e) {
  problems.push(`讀不到 ${MANIFEST}：${e.message}`);
}
for (const d of depts) {
  if (!d.slugPrefix) { problems.push(`\`${d.dept}\` 沒有 slugPrefix，無法對照模板`); continue; }
  const owned = slugs.filter((s) => s.startsWith(`${d.slugPrefix}-`));
  if (d.status === 'shipped' && owned.length < 5) {
    problems.push(
      `\`${d.dept}\` 是 shipped，但 manifest 只有 ${owned.length} 份 \`${d.slugPrefix}-*\` 模板（應 ≥5）`
    );
  }
  if (d.status !== 'shipped' && owned.length > 0) {
    problems.push(
      `\`${d.dept}\` 是 ${d.status}，但 manifest 已經有 ${owned.length} 份 \`${d.slugPrefix}-*\` 模板。` +
      `\n      模板做出來了就把 status 升成 shipped，不要讓正本落後於實際產出。`
    );
  }
}

// ── 4. vs dist ────────────────────────────────────────────────────────────
if (!existsSync(DIST)) {
  problems.push('找不到 dist/，請先 npm run build');
} else {
  for (const d of depts) {
    if (d.status === 'planned') {
      const stray = join(DIST, `pages/guides/graduate-${d.slugPrefix.replace(/^grad-/, '')}.html`);
      if (existsSync(stray)) {
        problems.push(`\`${d.dept}\` 是 planned，但 ${stray} 已經 build 出來了——正本或頁面有一個要改`);
      }
      continue;
    }
    const page = join(DIST, d.guide.replace(/^\//, ''));
    if (!existsSync(page)) problems.push(`\`${d.dept}\` 的指南頁沒有 build 出來：${page}`);
  }
}

// ── 報告 ──────────────────────────────────────────────────────────────────
console.log('\n── 研究所學群體系一致性檢查 ──');
const counts = VALID.map((s) => `${s} ${depts.filter((d) => d.status === s).length}`).join('／');
console.log(`正本：${SOURCE}（${depts.length} 群：${counts}）`);

if (!problems.length) {
  console.log('結論：✅ 正本、設定檔、模板清單與 build 產物四方一致');
  process.exit(0);
}
console.log(`\n✗ 不一致（${problems.length}）：`);
for (const p of problems) console.log(`   ${p}`);
console.log('\n結論：❌ 學群體系四方對不起來，禁止部署');
process.exit(1);
