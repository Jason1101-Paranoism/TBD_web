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

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = join(ROOT, 'public/assets/templates');
const STRICT = process.argv.includes('--strict');

// ── 讀檔層：CSV 與 xlsx 都要看得懂 ─────────────────────────────────────────
//
// 為什麼：模板交付格式正在從 CSV 轉成活頁簿（YCC 2026-09-12）。本檔原本只掃
// `grad-*.csv`，等最後一批 CSV 撤掉的那一刻，它會變成掃 0 個檔、然後回報「全部符合
// 規格」——安靜地少驗一項，正是本檔開頭那段病史在講的事。所以在 CSV 還在的時候
// 先把讀檔層換掉，規格規則一行都不動。
//
// 作法：把 xlsx 讀成「和 CSV 同一個形狀」的 lines（每列一個字串、欄以逗號相接），
// 下游的欄數、規格比對與「到到」掃描因此完全不必知道來源是哪一種格式。

/** 極簡 zip 讀取：xlsx 就是 zip，只需要取出幾個 XML，不值得為它加一個相依套件。 */
function unzip(buf) {
  const files = new Map();
  // 從 End of Central Directory 往回找中央目錄，再逐筆讀 local header 取資料。
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) return files;
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const lNameLen = buf.readUInt16LE(localOff + 26);
    const lExtraLen = buf.readUInt16LE(localOff + 28);
    const start = localOff + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + size);
    files.set(name, method === 0 ? raw : inflateRawSync(raw));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const unescapeXml = (s) =>
  s.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');

const stripTags = (s) => unescapeXml(s.replace(/<[^>]+>/g, ''));

/**
 * 把 xlsx 讀成 CSV 形狀的 lines。
 * 多個分頁直接接續（說明頁在前、工具本體在後），與規格規則「整份文件裡找得到某個區塊」
 * 的判斷方式一致；`使用說明第 2 行` 因此看到的是第一個分頁的第二列，與 CSV 版同義。
 */
function xlsxLines(file) {
  const z = unzip(readFileSync(file));
  const wb = z.get('xl/workbook.xml')?.toString('utf8') ?? '';
  const rels = z.get('xl/_rels/workbook.xml.rels')?.toString('utf8') ?? '';
  // 屬性順序不能假設：openpyxl 寫的是 Id 在前，這批活頁簿寫的是 Type→Target→Id。
  // 照順序寫死的 regex 會取不到任何分頁，然後整份被讀成 0 列——看起來像規格全缺。
  const relMap = new Map(
    [...rels.matchAll(/<Relationship\b([^>]*)\/?>/g)].map((m) => {
      const id = /\bId="([^"]+)"/.exec(m[1])?.[1];
      const target = /\bTarget="([^"]+)"/.exec(m[1])?.[1];
      return [id, target?.replace(/^\/?xl\//, '')];
    }).filter(([id, t]) => id && t)
  );
  // sharedStrings 與 inlineStr 兩種寫法都要支援：openpyxl 產的是前者，Numbers／
  // 其他工具匯出的常是後者，而這兩種來源在這個專案裡都實際出現過。
  const shared = [...(z.get('xl/sharedStrings.xml')?.toString('utf8') ?? '')
    .matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => stripTags(m[1]));

  const sheetRefs = [...wb.matchAll(/<sheet [^>]*r:id="([^"]+)"/g)].map((m) => m[1]);
  const targets = sheetRefs.length
    ? sheetRefs.map((id) => relMap.get(id)).filter(Boolean)
    : [...z.keys()].filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/.test(k)).sort()
        .map((k) => k.replace(/^xl\//, ''));

  const lines = [];
  for (const t of targets) {
    const xml = z.get(`xl/${t}`)?.toString('utf8');
    if (!xml) continue;
    for (const row of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const cells = [];
      for (const c of row[1].matchAll(/<c\b([^>]*)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1], body = c[2] ?? '';
        if (/t="s"/.test(attrs)) {
          const idx = Number(stripTags(body));
          cells.push(shared[idx] ?? '');
        } else if (/t="(inlineStr|str)"/.test(attrs)) {
          cells.push(stripTags(body));
        } else {
          cells.push(stripTags(body));
        }
      }
      lines.push(cells.join(','));
    }
  }
  return lines;
}

/**
 * 一份模板的內容，不論它以哪種格式交付。
 * CSV 優先：它還在的時候行為與改版前完全一致，轉成活頁簿的那幾份才走 xlsx 這條路。
 */
function readTemplate(slug) {
  const csv = join(DIR, `${slug}.csv`);
  if (existsSync(csv)) {
    const buf = readFileSync(csv);
    const text = buf.toString('utf8').replace(/^\uFEFF/, '');
    return {
      format: 'csv',
      bom: buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf,
      lines: text.split(/\r?\n/),
    };
  }
  const xlsx = join(DIR, `${slug}.xlsx`);
  if (existsSync(xlsx)) {
    // BOM 是 CSV 專屬的問題（Excel 開中文 CSV 會亂碼），活頁簿沒有這回事，
    // 所以標成 null 表示「不適用」，而不是假裝它通過了。
    return { format: 'xlsx', bom: null, lines: xlsxLines(xlsx) };
  }
  return null;
}

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
    // 「今年是否收生」不夠——設計那份把三種不收的原因都列出來，補審點名它比其他份完整，
    // 並建議其他七份跟進（附錄 A2）。2026-08-24 已擴散，這裡把它變成擋得住的規則。
    ['收生欄位含不收的原因', (t) => hasRe(t, /收學生|收生/) && hasRe(t, /名額/) && hasRe(t, /休假|退休|借調/)],
    // 八篇選校文章都講「保留 3-5 所並分層」，但原本只有設計把分層做成欄位（附錄 A1）。
    ['shortlist 定位', (t) => hasRe(t, /shortlist|衝刺/)],
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
  // 同 B2：比對概念不是字串。各學群的段落名稱刻意不同
  //（藝術「判斷：適合主動聯繫」／教育「第一類追問」／商管「不建議的做法」）。
  'B3-email': [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['先判斷該不該寄', (t) => hasRe(t, /該不該寄|先判斷|判斷：|適合主動聯繫/)],
    ['寄信時機', (t) => hasRe(t, /時機|什麼時候寄|黃金期|[0-9]+\s*[-–至]\s*[0-9]+\s*月/)],
    ['信件結構分段', (t) => hasRe(t, /[六七八]段|信件結構|段落結構/)],
    ['好壞寫法對照', (t) => hasRe(t, /寫法|不建議的做法|換成具體/)],
    ['寄信前檢核', (t) => hasRe(t, /寄信前|送出前/)],
  ],
  'B3-portfolio': [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['經歷／素材盤點', (t) => hasRe(t, /盤點|選件/)],
    ['逐段該寫出什麼', (t) => hasRe(t, /該寫|要寫什麼|要回答|應寫出|欄位/)],
    ['常見失分點專區', (t) => hasRe(t, /常見失分|常見錯誤|要避免|不建議|應該壓縮或刪掉/)],
    ['一致性檢查', (t) => hasRe(t, /一致|分工/)],
    ['送出前檢核', (t) => hasRe(t, /送出前|填完後|總檢核|檢核問題/)],
  ],
  'B3-oral': [
    ['使用說明第 2 行', (t, l) => usageLine(l)],
    ['一句話說明', (t) => hasRe(t, /一句話|一分鐘|三分鐘|開場/)],
    ['題庫分類', (t) => hasRe(t, /題庫|追問|題型/)],
    ['答題框架', (t) => hasRe(t, /框架|[五六四]步|步驟/)],
    ['被質疑時的句型', (t) => hasRe(t, /句型|面對不同意見|面對反對|不會的問題|沒準備到/)],
    ['常見失分點專區', (t) => hasRe(t, /常見失分|常見錯誤|不要出現|石沉大海/)],
    ['上場前檢核', (t) => hasRe(t, /上場前|口試前|送出前|行政/)],
  ],
};

// 掃描對象取自 manifest 而不是磁碟上的 *.csv：格式會變，清單不該跟著格式縮水。
// 一份模板在 manifest 上、磁碟卻兩種格式都沒有，是要紅的事，不是少列一行而已。
const manifestSlugs = JSON.parse(readFileSync(join(ROOT, 'scripts/template-manifest.json'), 'utf8'))
  .templates.filter((t) => t.delivery === 'file').map((t) => t.slug);
const gradSlugs = manifestSlugs.filter((s) => s.startsWith('grad-')).sort();
const results = [];
const unreadable = [];

for (const slug of gradSlugs) {
  const doc = readTemplate(slug);
  if (!doc) { unreadable.push(slug); continue; }
  const { format, bom, lines } = doc;
  const text = lines.join('\n');
  const cols = Math.max(...lines.map((x) => x.split(',').length));
  const parts = slug.split('-');
  const group = parts[1];
  const type = parts.slice(2).join('-');
  const specKey = SPECS[type];
  const missing = specKey
    ? RULES[specKey].filter(([, fn]) => !fn(text, lines)).map(([n]) => n)
    : [];
  results.push({ group, type, specKey, format, lines: lines.length, cols, bom, missing });
}

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 127 ? 2 : 1), 0)));

console.log('\n── 模板規格稽核 ──');
console.log(`${pad('學群', 14)}${pad('類型', 24)}${pad('規格', 16)}${pad('格式', 8)}行   欄  問題`);
console.log('-'.repeat(110));
let bad = 0;
for (const r of results) {
  const issues = [];
  // 規格寫「統一 6 欄」，這裡驗的是下限。法政備審的經歷盤點是 7 欄實體寬表
  // （時間／做了什麼／用到什麼能力／與研究方向的關聯／可查證的產出／放哪份文件），
  // 壓成 6 欄會刪掉一整欄內容——規格的用意是統一下限，不是砍內容。
  // 只驗 CSV：「6 欄」是 CSV 攤平時為了匯入一致而補齊的寬度。活頁簿的欄數就是版面本身，
  // 計畫書 5 欄是完整內容（節次／要回答的問題／常見失分／我的內容…），補一欄空白沒有意義。
  if (r.format === 'csv' && r.cols < 6) issues.push(`欄數 ${r.cols}`);
  // bom 為 null 代表不適用（活頁簿沒有 BOM 這回事），只有 CSV 缺 BOM 才算問題。
  if (r.bom === false) issues.push('無 BOM');
  issues.push(...r.missing);
  if (issues.length) bad++;
  console.log(
    `${pad(r.group, 14)}${pad(r.type, 24)}${pad(r.specKey ?? '—', 16)}${pad(r.format, 8)}${pad(r.lines, 5)}${pad(r.cols, 4)}` +
    (issues.length ? issues.join('、') : '✓')
  );
}

// 轉檔殘留：MD 轉 CSV 時破折號 —— 被吃成「到到」。只出現在標題與清單列
//（剝掉 `## ` 與 `- [ ] ` 的那段程式碼），內文段落不受影響，所以人工翻檔很容易漏。
// 轉檔器不在本 repo，這裡修不掉根因，只能擋住它的產物：任何一份 CSV 出現「到到」就紅。
// 為什麼不併進上面那張表：規格表只涵蓋 grad-* 45 份，但同一條轉檔管線還產出另外 11 份
//（高中生找方向那批），漏掃等於留半個洞。
// 病史：8/23 審 Batch 2 只修掉 proposal-framework 一份就收工，另三份 8/29 才被掃出來，
// 9/4 複查發現修正指令根本沒生效、仍在站上。「修得掉但只修一個檔」要靠閘門，不是靠記得。
const leaks = [];
let scanned = 0;
for (const slug of manifestSlugs) {
  const doc = readTemplate(slug);
  if (!doc) continue;
  scanned++;
  const hits = doc.lines.map((x, i) => (x.includes('到到') ? i + 1 : 0)).filter(Boolean);
  if (hits.length) leaks.push(`${slug}.${doc.format}：行 ${hits.join('、')}`);
}
console.log(`\n── 轉檔殘留掃描（${scanned} 份，CSV 與 xlsx 都掃）──`);
if (leaks.length) {
  console.log('❌ 破折號被轉成「到到」，應為 ——：');
  for (const l of leaks) console.log(`   ✗ ${l}`);
} else {
  console.log('✅ 零命中');
}

// 活頁簿的作者欄位：從 Drive 下載的檔案會帶審閱者本人的帳號名（docProps/core.xml 的
// creator／lastModifiedBy），這個 repo 是公開的、檔案也直接給使用者下載。
// 9/24 上架前發現 56 份裡 50 份帶著成員姓名；每次從 Drive 換檔都會再帶進來，所以擋在閘門。
// openpyxl 是存檔工具的名字，不是人。
const AUTHOR_OK = new Set(['', 'TBD Studio', 'openpyxl']);
const authorLeaks = [];
for (const slug of manifestSlugs) {
  const file = join(DIR, `${slug}.xlsx`);
  if (!existsSync(file)) continue;
  const core = unzip(readFileSync(file)).get('docProps/core.xml')?.toString('utf8') ?? '';
  for (const tag of ['dc:creator', 'cp:lastModifiedBy']) {
    // 標籤可能帶 xmlns 屬性（<dc:creator xmlns:dc="…">），不能寫死成 <tag>。
    const v = new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`).exec(core)?.[1] ?? '';
    if (!AUTHOR_OK.has(v)) authorLeaks.push(`${slug}.xlsx：${tag}＝${v}`);
  }
}
console.log('\n── 活頁簿作者欄位掃描 ──');
if (authorLeaks.length) {
  console.log('❌ 作者欄位帶著個人名稱，請改成「TBD Studio」或清空：');
  for (const l of authorLeaks) console.log(`   ✗ ${l}`);
} else {
  console.log('✅ 零命中');
}

// 在 manifest 上、磁碟卻兩種格式都沒有：這份模板等於不存在，但頁面仍會連向它。
// 舊版是掃磁碟，這種情況只會讓表格少一列——正是本檔要擋的「安靜地少驗一項」。
if (unreadable.length) {
  console.log(`\n❌ 這幾份在 manifest 上，磁碟卻沒有 .csv 也沒有 .xlsx：${unreadable.join('、')}`);
}

const verdict = [
  bad ? `❌ 規格 ${bad}/${results.length} 份有缺漏` : null,
  unreadable.length ? `❌ ${unreadable.length} 份讀不到` : null,
  leaks.length ? `❌ 轉檔殘留 ${leaks.length} 份` : null,
  authorLeaks.length ? `❌ 作者欄位帶個人名稱 ${authorLeaks.length} 處` : null,
].filter(Boolean).join('；') || '✅ 全部符合規格';
console.log(`\n結論：${verdict}`);
if ((bad || leaks.length || unreadable.length || authorLeaks.length) && STRICT) process.exit(1);
