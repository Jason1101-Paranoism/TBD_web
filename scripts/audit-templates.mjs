// 模板規格稽核：把 YC 的批次審閱規格變成可重跑的檢查。
//
// 為什麼存在：規格原本只寫在審閱報告（Google Artifact）裡，而報告是一次性的。
// Batch1（比較表）與 Batch2（計畫書架構）審完之後，優化版停在 Drive、repo 仍是 v1，
// 沒有任何東西會提醒這件事——這支腳本就是那個提醒。
//
// 另外它實作審閱報告第 E 節那條規則：**每次有新學群上線，要回頭檢查已結批的類型有沒有漏網**。
// 設計傳播 2026-08-21 上線時漏了 1 份比較表（8/23 才補審）；農生環境 8/23 上線時，
// 若沒有這支腳本，會一次漏 5 份。
//
// 用法：node scripts/audit-templates.mjs [--strict]
//   預設只報告，exit 0；--strict 時有缺漏就 exit 1（未來要接進 verify 再開）。
//
// 規格來源：
//   B1（比較表 school-compare / lab-compare）＝ Batch1 審閱 + 8/23 設計補審的附錄 B
//   B2（計畫書架構 proposal-framework）＝ Batch2 審閱第 06 節「共同規格」
//   B3（contact-email / portfolio-checklist / oral-checklist）＝ 2026-08-23 補審歸納，
//      這三類從未進過任何一批審閱，規格是從各學群最完整的樣本反推的。

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = join(ROOT, 'public/assets/templates');
const STRICT = process.argv.includes('--strict');

const has = (t, ...xs) => xs.some((x) => t.includes(x));
const hasRe = (t, re) => re.test(t);
const usageLine = (lines) => (lines[1] ?? '').split(',')[0].trim().length > 10;

const SPECS = {
  'school-compare': 'B1',
  'lab-compare': 'B1',
  'proposal-framework': 'B2',
  'contact-email': 'B3-email',
  'portfolio-checklist': 'B3-portfolio',
  'oral-checklist': 'B3-oral',
};

const RULES = {
  B1: [
    ['第一層自我定位區', (t) => has(t, '第一層', '自我定位', '先確定自己')],
    ['比較欄位 A–E 五欄', (t, l) => l.some((x) => x.split(',').length >= 6 && /[A-E]\b|實驗室E|教授E|系所E/.test(x))],
    ['兩個契合度評分', (t) => (t.match(/契合度/g) ?? []).length >= 2],
    ['今年是否收生', (t) => has(t, '收生', '收學生', '是否還收')],
    ['指導方式', (t) => has(t, '指導風格', '指導方式', '教學風格')],
    ['陷阱檢核', (t) => has(t, '陷阱檢核')],
    ['填完後檢核', (t) => has(t, '填完後')],
    ['查證管道區塊', (t) => has(t, '查證管道')],
  ],
  // 06 節的共同規格。注意兩件事，不然會report出一堆假缺漏：
  //   ① 「方法選用對照」與「倫理與資料取得」原文標了「※ 適用的學群才有」，是選配不是必備。
  //   ② 各學群的段落名稱刻意不同（藝術「製作可行性」／人文「範圍與可行性」／生醫「可行性三角度」），
  //      規則要比對概念不是比對字串。
  B2: [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['先盤點／問題收斂', (t) => hasRe(t, /盤點|收斂|拆解|轉換|先分清/)],
    ['節次架構表', (t) => hasRe(t, /節次|四大架構|十節/)],
    ['可行性段落', (t) => hasRe(t, /可行性|做不做得完|時程規劃/)],
    ['常見失分點專區', (t) => hasRe(t, /常見失分|常見錯誤/)],
    ['收尾檢核', (t) => hasRe(t, /送出前|檢核/)],
  ],
  'B3-email': [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['先判斷該不該寄', (t) => has(t, '該不該寄', '先判斷')],
    ['寄信時機', (t) => has(t, '時機', '什麼時候寄')],
    ['信件結構分段', (t) => hasRe(t, /七段|信件結構|段落結構/)],
    ['好壞寫法對照', (t) => has(t, '沒有作用的寫法', '可用的寫法', '寫法對照')],
    ['寄信前檢核', (t) => has(t, '寄信前', '送出前')],
  ],
  'B3-portfolio': [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['經歷／素材盤點', (t) => has(t, '盤點')],
    ['逐段該寫出什麼', (t) => has(t, '該寫', '要寫什麼', '要回答')],
    ['常見失分點專區', (t) => has(t, '常見失分')],
    ['一致性檢查', (t) => has(t, '一致')],
    ['送出前檢核', (t) => has(t, '送出前', '填完後')],
  ],
  'B3-oral': [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['一句話說明', (t) => has(t, '一句話', '一分鐘')],
    ['題庫分類', (t) => has(t, '題庫')],
    ['答題框架', (t) => hasRe(t, /框架|[五六四]步/)],
    ['被質疑時的句型', (t) => has(t, '句型')],
    ['常見失分點專區', (t) => has(t, '常見失分')],
    ['上場前檢核', (t) => has(t, '上場前', '口試前', '送出前')],
  ],
};

const files = readdirSync(DIR).filter((f) => f.startsWith('grad-') && f.endsWith('.csv')).sort();
const results = [];

for (const f of files) {
  const buf = readFileSync(join(DIR, f));
  const bom = buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
  const text = buf.toString('utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  const cols = Math.max(...lines.map((x) => x.split(',').length));
  const base = f.slice(0, -4);
  const parts = base.split('-');
  const group = parts[1];
  const type = parts.slice(2).join('-');
  const specKey = SPECS[type];
  const missing = specKey
    ? RULES[specKey].filter(([, fn]) => !fn(text, lines)).map(([n]) => n)
    : [];
  results.push({ group, type, specKey, lines: lines.length, cols, bom, missing });
}

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 127 ? 2 : 1), 0)));

console.log('\n── 模板規格稽核 ──');
console.log(`${pad('學群', 14)}${pad('類型', 24)}${pad('規格', 16)}行   欄  問題`);
console.log('-'.repeat(110));
let bad = 0;
for (const r of results) {
  const issues = [];
  if (r.cols !== 6) issues.push(`欄數 ${r.cols}`);
  if (!r.bom) issues.push('無 BOM');
  issues.push(...r.missing);
  if (issues.length) bad++;
  console.log(
    `${pad(r.group, 14)}${pad(r.type, 24)}${pad(r.specKey ?? '—', 16)}${pad(r.lines, 5)}${pad(r.cols, 4)}` +
    (issues.length ? issues.join('、') : '✓')
  );
}

console.log(`\n結論：${bad === 0 ? '✅ 全部符合規格' : `❌ ${bad}/${results.length} 份有缺漏`}`);
if (bad && STRICT) process.exit(1);
