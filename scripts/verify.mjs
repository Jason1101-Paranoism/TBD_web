// scripts/verify.mjs — 行為煙霧測試閘門（build 之外再驗 runtime）
//
// 為什麼存在：`npm run build` 只證明「能編譯」，不證明「在瀏覽器跑得起來」。
// 例：TOC 目錄展開按鈕曾因一段 querySelector 對非法選擇器丟 SyntaxError，
// build 完全通過卻在載入時整段腳本崩潰，目錄展不開。那種 bug 的共同特徵是
// 「頁面載入時出現 uncaught JS 錯誤」——所以本腳本最便宜也最有效的全站閘門，
// 就是「每個關鍵頁面載入後零 console error」，再加上對目錄／選單的互動測試。
//
// 作法：起 astro preview，對每個目標頁抓 HTML、注入 <base> 與探針後以
// 系統 Chrome/Edge headless（手機寬度）載入，讀回探針結果判定。零額外套件。
//
// 用法：
//   node scripts/verify.mjs            # 先 build 再驗
//   node scripts/verify.mjs --no-build # 直接驗現有 dist
//   CHROME_PATH="C:\\path\\to\\chrome.exe" node scripts/verify.mjs

import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { Socket } from 'node:net';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PORT = 4321;
const ORIGIN = `http://localhost:${PORT}`;
const MOBILE = '400,800';

// 要煙霧測試的代表頁：首頁、服務頁、知識庫、純文章、帶 series-rail 的系列文章、
// 以及獨立 vanilla JS 的作品集指南。新增關鍵互動頁時往這裡加一筆即可。
const TARGETS = [
  { path: '/index.html', name: '首頁' },
  { path: '/pages/cases.html', name: '成功案例（tab 切換）' },
  { path: '/pages/services.html', name: '服務頁' },
  // 瀏覽動線只留一張匯總卡導到對照表；搜尋資料則六份分學群指南都要在
  { path: '/pages/resources.html', name: '知識庫首頁（主題指南 Tabs）', guideTab: true,
    mustContain: ['graduate-application.html#matrix', '各學群研究所申請指南',
      'graduate-biomed.html', 'graduate-business.html', 'graduate-humanities.html',
      'graduate-arts.html', 'graduate-education.html'] },
  { path: '/pages/faq.html', name: 'FAQ' },
  { path: '/pages/resources/admission-channels-compare.html', name: '文章（無 series-rail）', toc: true },
  { path: '/pages/resources/lulu-preparation-system.html', name: '文章（含原創 CSS 圖示）', toc: true },
  { path: '/pages/resources/design-graduate-choose.html', name: '文章（有 series-rail，回歸案例）', toc: true },
  { path: '/pages/resources/engineering-graduate-timeline.html', name: '文章（理工軌 series-rail + 模板連結）', toc: true,
    mustContain: ['guide-inline-cta'] },
  // v3 review 回歸：推甄文章底部 CTA 不得再出現「回知識庫」，中段要有 inline CTA
  { path: '/pages/resources/graduate-timeline.html', name: '文章（通用時程：inline CTA＋無回知識庫）', toc: true,
    mustContain: ['guide-inline-cta', '閱讀約'], mustNotContain: ['回知識庫'] },
  // v3 review 回歸：理工套磁要點移入通用套磁文（#stem-tips 錨點＋情境化模板下載）
  { path: '/pages/resources/graduate-contact-professor.html', name: '文章（套磁：理工專屬重點＋模板）', toc: true,
    mustContain: ['id="stem-tips"', 'grad-engineering-contact-email.md'] },
  // 階段 1／4 沒有分學群專屬文，series-nav 的橫向軸必須改列六份學群指南，不能是死路
  { path: '/pages/resources/graduate-recommend-vs-exam.html', name: '文章（階段1：橫向出口回退為學群指南）', toc: true,
    mustContain: ['guides/graduate-arts.html', 'guides/graduate-design.html', 'guides/graduate-engineering.html',
      '往下看你的學群'] },
  // 分學群指南已從知識庫外層收起，唯一入口是這張對照表的欄位標題連結
  { path: '/pages/guides/graduate-application.html', name: '研究所推甄完整指南（對照表欄位標題＝分學群入口）',
    mustContain: [
      '<a class="text-link" href="/pages/guides/graduate-humanities.html">人文社科</a>',
      '<a class="text-link" href="/pages/guides/graduate-business.html">商管財經</a>',
      '<a class="text-link" href="/pages/guides/graduate-engineering.html">理工</a>',
      '<a class="text-link" href="/pages/guides/graduate-biomed.html">生醫</a>',
      '<a class="text-link" href="/pages/guides/graduate-design.html">設計傳播</a>',
      '<a class="text-link" href="/pages/guides/graduate-arts.html">藝術</a>',
      '<a class="text-link" href="/pages/guides/graduate-education.html">教育</a>',
    ] },
  { path: '/pages/guides/graduate-engineering.html', name: '理工研究所指南（工具包＋stem-tips 錨點）',
    mustContain: ['理工推甄專屬工具包', 'graduate-contact-professor.html#stem-tips'], mustNotContain: ['id="contact-tips"'] },
  { path: '/pages/guides/graduate-biomed.html', name: '生醫與公衛研究所指南（工具包＋biomed-tips 錨點）',
    mustContain: ['生醫與公衛推甄專屬工具包', 'graduate-contact-professor.html#biomed-tips'] },
  { path: '/pages/resources/biomed-graduate-timeline.html', name: '文章（生醫時程：分軌 relatedArticles）', toc: true,
    mustContain: ['biomed-graduate-choose.html'] },
  { path: '/pages/guides/graduate-business.html', name: '商管與財經研究所指南（工具包＋business-tips 錨點）',
    mustContain: ['商管與財經推甄專屬工具包', 'graduate-contact-professor.html#business-tips'] },
  { path: '/pages/resources/business-graduate-timeline.html', name: '文章（商管時程：分軌 relatedArticles）', toc: true,
    mustContain: ['business-graduate-choose.html'] },
  { path: '/pages/guides/graduate-humanities.html', name: '人文與社會科學研究所指南（工具包＋humanities-tips 錨點）',
    mustContain: ['人文與社會科學推甄專屬工具包', 'graduate-contact-professor.html#humanities-tips'] },
  { path: '/pages/resources/humanities-graduate-timeline.html', name: '文章（人文社科時程：分軌 relatedArticles）', toc: true,
    mustContain: ['humanities-graduate-choose.html'] },
  { path: '/pages/guides/graduate-arts.html', name: '藝術研究所指南（工具包＋arts-tips 錨點）',
    mustContain: ['藝術推甄專屬工具包', 'graduate-contact-professor.html#arts-tips'] },
  { path: '/pages/resources/arts-graduate-timeline.html', name: '文章（藝術時程：分軌 relatedArticles）', toc: true,
    mustContain: ['arts-graduate-choose.html'] },
  { path: '/pages/guides/graduate-education.html', name: '教育研究所指南（工具包＋education-tips 錨點）',
    mustContain: ['教育推甄專屬工具包', 'graduate-contact-professor.html#education-tips'] },
  { path: '/pages/resources/education-graduate-timeline.html', name: '文章（教育時程：分軌 relatedArticles）', toc: true,
    mustContain: ['education-graduate-choose.html'] },
  { path: '/pages/portfolio-guide.html', name: '作品集指南（vanilla JS）', menuToggle: '#pg-guide-menu-toggle' },
  { path: '/pages/grad-path-quiz.html', name: '推甄vs考試測驗（vanilla JS）', gpq: true,
    mustContain: ['id="gpq-card"', 'grad-path-quiz.js'] },
  { path: '/pages/process.html', name: '合作流程（track tabs + 時程軸）' },
  { path: '/404.html', name: '自訂 404 頁' },
  // 落點分析方案頁。價格的正本在 tbd-compass-app 的 entitlement.ts（見 src/config/pricing.ts 的警語），
  // 這裡刻意把數字寫死當獨立事實來源：改價時本項會紅，逼人回頭確認 compass 那側也改了。
  // 兩邊價格不一致＝網站標一個價、結帳頁收另一個價，是 D-003 的同一種形狀。
  { path: '/pages/compass.html', name: '落點分析方案（價格須與 compass entitlement.ts 一致）',
    mustContain: ['NT$', '499', '899', 'tbd-compass-app.vercel.app'] },
  // 回歸：Week 3–6 的 20 份分學群模板曾只登記在指南頁、沒進下載頁，四輪都沒被發現。
  // 事實來源是 scripts/template-manifest.json（見 D-008），且該 manifest 由
  // checkTemplateManifest() 與磁碟互相校驗，任一邊少一份都會失敗。
  { path: '/pages/resources/tools.html', name: '工具與模板下載（所有模板不得漏檔）',
    mustContain: templateLinkFragments() },
];

/** manifest 的原始內容。讀不到就讓它拋——沒有 manifest 等於沒有這道閘門。 */
function templateManifest() {
  return JSON.parse(readFileSync(join(process.cwd(), 'scripts', 'template-manifest.json'), 'utf8')).templates;
}

/**
 * 每一份模板在 tools.html 上必須出現的字串。
 *
 * `file` 交付的用 `<slug>.md`（下載連結）；`external` 交付的用它的 url——
 * 模板改成 Google Sheets／Notion 之後磁碟上不會有檔案，但它仍必須在下載頁上找得到。
 */
function templateLinkFragments() {
  // TARGETS 在模組載入時就求值，早於 main 的 checkTemplateManifest()。manifest 壞掉時
  // 這裡回空陣列讓載入不中斷，由 checkTemplateManifest() 印出可讀的原因並中止——
  // 不是靜默降級：那條路徑保證會 exit(1)。
  try {
    return templateManifest().map((t) => (t.delivery === 'external' ? t.url : `${t.slug}.md`));
  } catch {
    return [];
  }
}

/**
 * manifest 與磁碟互相校驗。回傳問題清單（空陣列＝通過）。
 *
 * 為什麼不是直接掃磁碟（D-003 原本的作法）：掃磁碟能抓「多了檔案沒登記」，
 * 但抓不到**反方向**——模板改成 Sheets／Notion 後 `.md` 從磁碟消失，
 * 掃出來的清單會安靜地少一份，斷言數跟著少一項，閘門的覆蓋範圍就這樣無聲縮編。
 * D-003 擋的是「模板從下載頁消失」，而那正是它縮編後不再擋得住的東西。
 *
 * 改法：manifest 是「有哪些模板」的事實來源，磁碟是它的獨立對照。
 * 兩邊不一致就失敗，所以把模板換成外部形式必須是一個**明確的編輯動作**
 * （把該筆改成 `delivery: "external"` 並填 url），不能靠刪檔案默默發生。
 */
function checkTemplateManifest() {
  const problems = [];
  let entries;
  try {
    entries = templateManifest();
  } catch (e) {
    return [`讀不到 scripts/template-manifest.json：${e.message}（沒有它就沒有 D-003／D-008 這道閘門）`];
  }

  const onDisk = new Set(
    readdirSync(join(process.cwd(), 'public', 'assets', 'templates'))
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''))
  );
  const declaredAsFile = new Set();

  for (const t of entries) {
    if (!t.slug) { problems.push(`manifest 有一筆缺 slug：${JSON.stringify(t)}`); continue; }
    if (t.delivery === 'file') {
      declaredAsFile.add(t.slug);
      if (!onDisk.has(t.slug)) {
        problems.push(
          `manifest 宣告 \`${t.slug}\` 是 file 交付，但 public/assets/templates/${t.slug}.md 不存在。` +
          `（若它已改成 Sheets／Notion，請把該筆改成 delivery: "external" 並填 url，不要只刪檔案）`
        );
      }
    } else if (t.delivery === 'external') {
      if (!t.url) problems.push(`manifest 的 \`${t.slug}\` 是 external 交付，但沒有 url——下載頁要連到哪裡？`);
    } else {
      problems.push(`manifest 的 \`${t.slug}\` 的 delivery 只能是 "file" 或 "external"，實為 ${JSON.stringify(t.delivery)}`);
    }
  }

  for (const slug of onDisk) {
    if (!declaredAsFile.has(slug)) {
      problems.push(
        `public/assets/templates/${slug}.md 存在，但沒有登記在 scripts/template-manifest.json。` +
        `（新增模板的順序是：放檔案 → 登記 manifest → 登記 gradTemplates.ts／tools.astro）`
      );
    }
  }

  // CSV 必須帶 UTF-8 BOM。
  //
  // 沒有 BOM 的話，Excel 會用系統 ANSI 編碼開啟中文 CSV，整份變亂碼——
  // 而使用者下載模板的第一個動作就是用 Excel 打開它。這不是相容性細節，
  // 是「這份模板能不能用」的分野。2026-08-14 的模板審閱回報 department-compare-prompt
  // 亂碼，一查是 41 份裡有 31 份缺 BOM；審閱者只是剛好開到其中一份。
  //
  // 純文字編輯器與 Google Sheets 都會忽略 BOM，所以補上它沒有任何代價。
  const csvNoBom = readdirSync(join(process.cwd(), 'public', 'assets', 'templates'))
    .filter((f) => f.endsWith('.csv'))
    .filter((f) => {
      const buf = readFileSync(join(process.cwd(), 'public', 'assets', 'templates', f));
      return !(buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf);
    });
  if (csvNoBom.length) {
    problems.push(
      `這些 CSV 缺 UTF-8 BOM，用 Excel 開啟會是亂碼：${csvNoBom.join('、')}。` +
      `（修法：在檔首補上 EF BB BF；純文字編輯器與 Google Sheets 都會忽略它）`
    );
  }
  problems.push(...checkCsvFormulaRefs());
  return problems;
}

/** 極簡 CSV 列解析：處理雙引號欄位（公式裡有逗號）。夠用就好，不是通用 parser。 */
function parseCsvLine(line) {
  const cells = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { cells.push(cur); cur = ''; }
    else cur += ch;
  }
  cells.push(cur);
  return cells;
}

/**
 * CSV 內的試算表公式，列號必須對得上實際內容。
 *
 * 為什麼需要這道：公式寫的是絕對列號（`=AVERAGE(C6:C9)`、`B19`），而 CSV 是純文字——
 * 在檔案開頭插一行說明，底下每一條公式就全部指錯位置，而且**打開檔案不會報錯**，
 * 只會安靜地算出錯的平均分。2026-08-14 補模板說明時當場踩到：多加兩行前言，
 * 三個管道的平均分全部往上位移兩列，個申的平均變成把「特選」的分數也算進去。
 *
 * 檢查兩件事：
 *   1. `=AVERAGE(C<a>:C<b>)` 涵蓋的列，第一欄標籤必須與公式自己那列的標籤相同
 *      （個申的平均只能算個申那幾題）
 *   2. 公式裡的 `B<n>` 必須指向自己那一列（同列參照，插一行就會壞）
 */
function checkCsvFormulaRefs() {
  const dir = join(process.cwd(), 'public', 'assets', 'templates');
  const problems = [];

  for (const f of readdirSync(dir).filter((x) => x.endsWith('.csv'))) {
    const text = readFileSync(join(dir, f), 'utf8').replace(/^\uFEFF/, '');
    const rows = text.split(/\r?\n/).map(parseCsvLine);
    const label = (rowNum) => (rows[rowNum - 1] ?? [])[0] ?? '';

    rows.forEach((cells, idx) => {
      const rowNum = idx + 1;
      const self = cells[0] ?? '';

      for (const cell of cells) {
        if (!cell.startsWith('=') && !cell.includes('=AVERAGE(') && !cell.includes('REPT(')) continue;

        for (const m of cell.matchAll(/AVERAGE\(C(\d+):C(\d+)\)/g)) {
          const [a, b] = [Number(m[1]), Number(m[2])];
          if (b > rows.length) {
            problems.push(`${f} 第 ${rowNum} 列的 ${m[0]} 指到不存在的列（檔案只有 ${rows.length} 列）`);
            continue;
          }
          const bad = [];
          for (let r = a; r <= b; r++) if (label(r) !== self) bad.push(`${r}(${label(r) || '空'})`);
          if (bad.length) {
            problems.push(
              `${f} 第 ${rowNum} 列「${self}」的 ${m[0]} 涵蓋了不屬於它的列：${bad.join('、')}。` +
              `（多半是在上方插了說明行，公式的絕對列號沒跟著移）`
            );
          }
        }

        for (const m of cell.matchAll(/\bB(\d+)\b/g)) {
          if (Number(m[1]) !== rowNum) {
            problems.push(
              `${f} 第 ${rowNum} 列的公式參照 B${m[1]}，但同列參照應該是 B${rowNum}。` +
              `（插入或刪除列之後沒有同步更新）`
            );
          }
        }
      }
    });
  }
  return problems;
}

// 注入頁面的探針：捕捉 uncaught error，並（若存在）測目錄/選單 toggle 行為。
// 結果以 base64 包在 @@VERIFY@@...@@END@@ 之間，避免 HTML 轉義干擾解析。
/**
 * vercel.json 的 schema 檢查。回傳問題清單（空陣列＝通過）。
 *
 * 為什麼需要這一項：`npm run build` 與本檔其餘所有檢查**都不會碰 vercel.json**，
 * 只有 Vercel 會。2026-08-05 因此連續三個 commit 的 preview 部署全紅而沒人發現——
 * 一筆轉址裡多放了 `"_comment"` 想當註解用，Vercel 回
 * 「`redirects[1]` should NOT have additional property `_comment`」並在 build 開始前中止。
 * 本機一路全綠，因為本機從來沒有人驗過這個檔。
 *
 * 這裡刻意用**白名單**而非黑名單：Vercel 的 schema 本身就是 additionalProperties: false，
 * 用黑名單只能擋掉已經出過事的那一個鍵，下次換個鍵名又會重演。
 */
function checkVercelJson() {
  const problems = [];
  if (!existsSync('vercel.json')) return problems;
  let cfg;
  try {
    cfg = JSON.parse(readFileSync('vercel.json', 'utf8'));
  } catch (e) {
    return [`vercel.json 不是合法 JSON：${e.message}`];
  }
  // 僅涵蓋本專案實際用到的區段。用到新區段時一起把它的合法鍵加進來，
  // 不要因為「這裡沒列到」就以為 Vercel 會接受。
  const ALLOWED = {
    redirects: ['source', 'destination', 'permanent', 'statusCode', 'has', 'missing'],
    rewrites: ['source', 'destination', 'has', 'missing'],
    headers: ['source', 'headers', 'has', 'missing'],
  };
  for (const [section, allowed] of Object.entries(ALLOWED)) {
    const arr = cfg[section];
    if (!Array.isArray(arr)) continue;
    arr.forEach((entry, i) => {
      for (const key of Object.keys(entry)) {
        if (!allowed.includes(key)) {
          problems.push(
            `${section}[${i}] 有 Vercel 不接受的鍵 \`${key}\`——整份設定會驗證失敗、部署在 build 前中止。` +
            `（JSON 沒有註解；理由請寫在 docs/DECISIONS.md，不要塞進設定檔）`
          );
        }
      }
    });
  }
  return problems;
}

function harness() {
  return `<script>(function(){
    window.__errs=[];
    window.addEventListener('error',function(e){window.__errs.push(String(e.message||e.error))});
    window.addEventListener('unhandledrejection',function(e){window.__errs.push('promise:'+String(e.reason))});
    function disp(sel){var el=document.querySelector(sel);return el?getComputedStyle(el).display:null;}
    window.addEventListener('load',function(){setTimeout(function(){
      var r={errors:window.__errs.slice()};
      var de=document.documentElement;
      r.docOverflow=de.scrollWidth-de.clientWidth; // >0 代表頁面水平溢出（RWD 破版）
      // 文章對照表：手機下不得寬過容器（否則右欄被切、要在框內橫向捲動）。
      // 這種內部捲動不會反映在 docOverflow，需單獨量：全域 table{min-width:760px} 曾是元凶。
      var pt=document.querySelector('.plan-table');
      if(pt){var wrap=pt.closest('.table-wrapper');r.tableOverflow=wrap?(pt.scrollWidth-wrap.clientWidth):0;}
      var tocBtn=document.getElementById('article-toc-toggle');
      if(tocBtn){
        var navSel='.article-toc .pg-sidebar-nav';
        r.tocNavBefore=disp(navSel);
        try{tocBtn.click();}catch(e){r.errors.push('click:'+e.message);}
        var toc=document.querySelector('.article-toc');
        r.tocOpened=!!(toc&&toc.classList.contains('open'));
        r.tocNavAfter=disp(navSel);
      }
      // 手機目錄 FAB（文章頁）：點擊後面板應開啟
      var fab=document.getElementById('toc-fab');
      if(fab){
        try{fab.click();}catch(e){r.errors.push('fabclick:'+e.message);}
        var fp=document.getElementById('toc-fab-panel');
        r.fabOpened=!!(fp&&!fp.hidden);
      }
      var gtabs=document.querySelectorAll('.guide-tab');
      if(gtabs.length>1){
        var second=gtabs[1];
        var panel=document.getElementById('guide-panel-'+second.getAttribute('data-guide-tab'));
        r.guideTabBefore=panel?panel.hidden:null;
        try{second.click();}catch(e){r.errors.push('guidetab:'+e.message);}
        r.guideTabAfter=panel?panel.hidden:null;
        r.guideTabActive=second.classList.contains('active');
      }
      var mt=${JSON.stringify('')};
      var mtBtn=document.getElementById('pg-guide-menu-toggle');
      if(mtBtn){
        var msel='#pg-guide-menu-toggle';
        var side=mtBtn.closest('.pg-sidebar');
        try{mtBtn.click();}catch(e){r.errors.push('menuclick:'+e.message);}
        r.menuOpened=!!(side&&side.classList.contains('open'));
      }
      // 推甄vs考試測驗：點「開始測驗」後，測驗卡 data-screen 應從 intro 進到題目（q0…）
      var gpq=document.getElementById('gpq-card');
      if(gpq){
        r.gpqStart=gpq.getAttribute('data-screen');
        var gpqStartBtn=document.getElementById('gpq-start');
        if(gpqStartBtn){try{gpqStartBtn.click();}catch(e){r.errors.push('gpqstart:'+e.message);}}
        r.gpqAfterStart=gpq.getAttribute('data-screen');
      }
      // 標記用拼接組出，避免本 <script> 原始碼（會被 dump-dom 一併序列化）
      // 自身含有完整 token，導致解析時誤抓到腳本內文而非輸出結果。
      var A='@@VER'+'IFY@@',B='@@E'+'ND@@';
      var div=document.createElement('div');div.id='__VERIFY__';
      div.textContent=A+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+B;
      document.body.appendChild(div);
    },250);});
  })();</script>`;
}

function findBrowser() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates = platform() === 'win32' ? [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ] : [
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return candidates.find(existsSync) || null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 啟動 preview 之前先問：這個埠現在有人嗎？用 net 直接試連，不發 HTTP——
// 對面可能是別人的 preview，也可能是任何佔住埠的東西，能連上就算被占。
function portInUse(port = PORT) {
  return new Promise((resolve) => {
    const socket = new Socket();
    const done = (v) => { socket.destroy(); resolve(v); };
    socket.setTimeout(1500);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
    socket.connect(port, '127.0.0.1');
  });
}

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(ORIGIN + '/index.html');
      if (res.ok) return true;
    } catch { /* server 還沒起來，等下一輪重試；逾時由 while 條件負責 */ }
    await sleep(300);
  }
  return false;
}

// 每個目標之間夾著一個 blocking 的 headless Chrome（實際耗時 > 5 秒），而 preview server
// 的 keepAliveTimeout 預設 5 秒——單次 fetch 會撿到已被伺服器關閉的 pooled socket，
// 隨機在任意頁面丟 "fetch failed"（連 404.html 都中過）。故：明示不重用連線 + 重試。
async function fetchHtml(path, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(ORIGIN + path, { headers: { connection: 'close' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      await sleep(300 * (i + 1));
    }
  }
  throw lastErr;
}

// Chrome 冷啟動偶爾會超過逾時；重試一次即可，仍失敗才視為真的有問題。
function runBrowser(browser, args, attempts = 2) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return execFileSync(browser, args, { encoding: 'utf8', timeout: 45000, maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function probe(browser, tmp, target) {
  let html = await fetchHtml(target.path);
  // 靜態內容斷言：驗證關鍵區塊存在／已移除（不需進瀏覽器，直接對 build 產物檢查）
  const staticFails = [];
  for (const s of target.mustContain ?? []) if (!html.includes(s)) staticFails.push(`缺少必要內容片段：${s}`);
  for (const s of target.mustNotContain ?? []) if (html.includes(s)) staticFails.push(`仍含應移除的內容片段：${s}`);
  html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${ORIGIN}/">`);
  html = html.replace(/<\/body>/i, harness() + '</body>');
  const file = join(tmp, target.path.replace(/[\\/]/g, '_') + '.html');
  writeFileSync(file, html, 'utf8');
  // --user-data-dir 指向本次執行的暫存目錄：不指定時 Chrome 會用使用者的預設設定檔，
  // 與已開著的 Chrome 搶 profile lock（並附帶 GCM 註冊、安裝 web app 等背景動作），
  // 偶發卡死到 ETIMEDOUT。獨立 profile + 一次重試把這條路徑穩住。
  const out = runBrowser(browser, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
    `--user-data-dir=${join(tmp, 'chrome-profile')}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    `--window-size=${MOBILE}`, '--virtual-time-budget=5000', '--dump-dom',
    pathToFileURL(file).href,
  ]);
  const m = out.match(/@@VERIFY@@(.*?)@@END@@/);
  if (!m) throw new Error('探針未回傳結果（頁面可能在載入早期就崩潰）');
  const r = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
  r.staticFails = staticFails;
  return r;
}

function evaluate(target, r) {
  const fails = [];
  if (r.staticFails && r.staticFails.length) fails.push(...r.staticFails);
  if (r.errors && r.errors.length) fails.push(`載入時 JS 錯誤：${r.errors.join(' | ')}`);
  // 手機寬度下不得有頁面級水平溢出（寬表格應在 .table-wrapper 內部捲動，而非撐寬整頁）。
  // 容忍 1px 量測誤差；容器級（overflow:auto）的內部捲動不計入 documentElement。
  if (typeof r.docOverflow === 'number' && r.docOverflow > 1) {
    fails.push(`頁面水平溢出 ${r.docOverflow}px（RWD 破版；檢查是否有元素撐寬 .article-body 等 grid/flex 子項，需 min-width:0 或 overflow 容器）`);
  }
  if (typeof r.tableOverflow === 'number' && r.tableOverflow > 1) {
    fails.push(`對照表寬過容器 ${r.tableOverflow}px（手機會橫向捲動、右欄被切；檢查 .plan-table 是否被全域 table{min-width:760px} 壓住，手機需 min-width:0 + table-layout:fixed）`);
  }
  if (target.toc) {
    if (r.tocNavBefore !== 'none') fails.push(`目錄 nav 初始 display 應為 none，實為 ${r.tocNavBefore}`);
    if (!r.tocOpened) fails.push('點擊目錄按鈕後未加上 .open（toggle 失效）');
    if (r.tocNavAfter !== 'flex') fails.push(`點擊後目錄 nav display 應為 flex，實為 ${r.tocNavAfter}`);
    if (r.fabOpened !== true) fails.push('手機目錄 FAB 點擊後面板未開啟');
  }
  if (target.menuToggle && r.menuOpened === false) fails.push('點擊指南選單按鈕後未展開');
  if (target.gpq) {
    if (r.gpqStart !== 'intro') fails.push(`測驗卡初始 data-screen 應為 intro，實為 ${r.gpqStart}`);
    if (!(typeof r.gpqAfterStart === 'string' && r.gpqAfterStart.charAt(0) === 'q')) {
      fails.push(`點「開始測驗」後應進入題目畫面（data-screen=q0…），實為 ${r.gpqAfterStart}`);
    }
  }
  if (target.guideTab) {
    if (r.guideTabBefore !== true) fails.push(`主題指南第二個 Tab 面板初始應為 hidden，實為 ${r.guideTabBefore}`);
    if (r.guideTabAfter !== false) fails.push('點擊第二個主題指南 Tab 後面板未顯示（切換失效）');
    if (!r.guideTabActive) fails.push('點擊後該 Tab 未取得 .active 狀態');
  }
  return fails;
}

// ── main ──
const noBuild = process.argv.includes('--no-build');
const browser = findBrowser();
if (!browser) {
  console.error('找不到 Chrome/Edge。請設定環境變數 CHROME_PATH 指向瀏覽器執行檔。');
  process.exit(2);
}

// 放在 build 之前：設定檔錯誤不需要等跑完一輪才知道，而且它壞掉時 build 綠也沒有意義。
const vercelProblems = checkVercelJson();
if (vercelProblems.length) {
  console.error('\n✋ vercel.json 檢查未通過（Vercel 會在 build 開始前中止部署）：');
  for (const p of vercelProblems) console.error(`   ✗ ${p}`);
  process.exit(1);
}

// 同樣放在 build 之前：manifest 與磁碟對不起來時，後面那項 tools.html 斷言
// 本身就是用 manifest 產生的，先驗它才有意義。
const manifestProblems = checkTemplateManifest();
if (manifestProblems.length) {
  console.error('\n✋ 模板清單檢查未通過（scripts/template-manifest.json 與磁碟不一致）：');
  for (const p of manifestProblems) console.error(`   ✗ ${p}`);
  process.exit(1);
}

if (!noBuild) {
  console.log('▶ build…');
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit', shell: platform() === 'win32' });
}
if (!existsSync('dist/index.html')) {
  console.error('找不到 dist/，請先 build（或移除 --no-build）。');
  process.exit(2);
}

// 4321 已被占用 = 另一個 verify／preview 正在跑。若放著不管，這一輪的 astro preview
// 綁不到埠，探針會從某個目標開始整段 "fetch failed"，看起來像閘門隨機失敗——
// 2026-08-03 因此連紅四次，還一度被誤記成 D-001 再現。寧可在這裡直接停，講清楚原因。
if (await portInUse()) {
  console.error(
    `\n✋ 埠 ${PORT} 已被占用——極可能有另一個 npm run verify／astro preview 正在跑。\n` +
    `   兩個 preview 搶同一個埠時，測試會從某一項開始整段 "fetch failed"，那是假失敗。\n` +
    `   請等另一輪跑完（或關掉它）再執行，不要靠重跑或調重試參數繞過。`
  );
  process.exit(2);
}

// 站內死連結是純靜態問題，不需要瀏覽器——放在起 preview 之前，壞掉時省下整輪跑。
console.log('▶ 站內連結檢查…');
try {
  execFileSync('node', ['scripts/check-links.mjs'], { stdio: 'inherit' });
} catch {
  console.error('\n站內連結檢查未通過，中止（詳見上方清單）。');
  process.exit(1);
}

console.log('▶ 啟動 preview…');
const server = spawn('npm', ['run', 'preview'], { stdio: 'ignore', shell: platform() === 'win32' });
let exitCode = 0;
try {
  if (!await waitForServer()) throw new Error('preview server 未在時限內就緒');
  const tmp = mkdtempSync(join(tmpdir(), 'tbd-verify-'));
  console.log(`▶ headless 行為驗證（${browser.split(/[\\/]/).pop()}, 寬度 ${MOBILE.split(',')[0]}px）\n`);

  const rows = [];
  for (const t of TARGETS) {
    let fails;
    try {
      const r = await probe(browser, tmp, t);
      fails = evaluate(t, r);
    } catch (e) {
      fails = ['探針錯誤：' + e.message];
    }
    const ok = fails.length === 0;
    if (!ok) exitCode = 1;
    rows.push({ ok, name: t.name, path: t.path, fails });
    console.log(`  ${ok ? '✓' : '✗'} ${t.name}  ${t.path}`);
    for (const f of fails) console.log(`      └─ ${f}`);
  }

  const pass = rows.filter((r) => r.ok).length;
  console.log(`\n── 驗證報告 ──`);
  console.log(`通過：${pass}/${rows.length}`);
  console.log(`結論：${exitCode === 0 ? '✅ 全部通過，可進入部署' : '❌ 有失敗項，禁止部署'}`);
} catch (e) {
  console.error('驗證流程錯誤：', e.message);
  exitCode = 2;
} finally {
  if (platform() === 'win32') {
    try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' }); } catch { /* server 已自行結束；收尾失敗不應覆蓋驗證結果 */ }
  } else {
    try { server.kill('SIGTERM'); } catch { /* 同上：process 可能已不存在 */ }
  }
}
process.exit(exitCode);
