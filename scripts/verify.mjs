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
import { writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
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
  { path: '/pages/resources.html', name: '知識庫首頁（主題指南 Tabs）', guideTab: true },
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
  { path: '/pages/portfolio-guide.html', name: '作品集指南（vanilla JS）', menuToggle: '#pg-guide-menu-toggle' },
  { path: '/pages/grad-path-quiz.html', name: '推甄vs考試測驗（vanilla JS）', gpq: true,
    mustContain: ['id="gpq-card"', 'grad-path-quiz.js'] },
  { path: '/pages/process.html', name: '合作流程（track tabs + 時程軸）' },
  { path: '/404.html', name: '自訂 404 頁' },
];

// 注入頁面的探針：捕捉 uncaught error，並（若存在）測目錄/選單 toggle 行為。
// 結果以 base64 包在 @@VERIFY@@...@@END@@ 之間，避免 HTML 轉義干擾解析。
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

if (!noBuild) {
  console.log('▶ build…');
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit', shell: platform() === 'win32' });
}
if (!existsSync('dist/index.html')) {
  console.error('找不到 dist/，請先 build（或移除 --no-build）。');
  process.exit(2);
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
