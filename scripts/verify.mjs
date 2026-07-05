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
  { path: '/pages/resources/engineering-graduate-timeline.html', name: '文章（理工軌 series-rail + 模板連結）', toc: true },
  { path: '/pages/guides/graduate-engineering.html', name: '理工研究所指南（模板下載區）' },
  { path: '/pages/portfolio-guide.html', name: '作品集指南（vanilla JS）', menuToggle: '#pg-guide-menu-toggle' },
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
    } catch {}
    await sleep(300);
  }
  return false;
}

async function probe(browser, tmp, target) {
  const res = await fetch(ORIGIN + target.path);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${target.path}`);
  let html = await res.text();
  html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${ORIGIN}/">`);
  html = html.replace(/<\/body>/i, harness() + '</body>');
  const file = join(tmp, target.path.replace(/[\\/]/g, '_') + '.html');
  writeFileSync(file, html, 'utf8');
  const out = execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
    `--window-size=${MOBILE}`, '--virtual-time-budget=5000', '--dump-dom',
    pathToFileURL(file).href,
  ], { encoding: 'utf8', timeout: 30000, maxBuffer: 64 * 1024 * 1024 });
  const m = out.match(/@@VERIFY@@(.*?)@@END@@/);
  if (!m) throw new Error('探針未回傳結果（頁面可能在載入早期就崩潰）');
  return JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
}

function evaluate(target, r) {
  const fails = [];
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
  }
  if (target.menuToggle && r.menuOpened === false) fails.push('點擊指南選單按鈕後未展開');
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
    try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {}
  } else {
    try { server.kill('SIGTERM'); } catch {}
  }
}
process.exit(exitCode);
