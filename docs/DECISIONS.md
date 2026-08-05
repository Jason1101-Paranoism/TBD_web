# DECISIONS

方向性決策的紀錄：技術選型、schema 取捨、命名遷移、依賴引入。

**決策發生的那一輪就要記。事後補記等同沒記** —— 因為當下你記得「為什麼否決了另外兩個選項」，一週後你只記得結論。被否決的選項才是這份文件的價值：它讓下一個人不用把同樣的死路再走一次。

被取代的決策**不刪除**，標記 `已取代（由 D-0xx）`，之後歸檔到 `docs/archive/DECISIONS_archived.md`。

---

## 條目模板（複製這段）

```markdown
## D-001 — <一句話：選了什麼>

**背景**：什麼問題逼我們必須做這個選擇？（不是「我們想讓程式更好」，是具體的壓力）
**選項**：
  - A（採用）— 代價是什麼
  - B（否決）— 為什麼不行
  - C（否決）— 為什麼不行
**決定**：
**後果**：我們因此接受了什麼壞處？未來出現什麼訊號時，該重新考慮這個決策？
```

---

## D-001 — verify 探針改為「不重用連線 + 獨立 Chrome profile + 重試」

**背景**：`npm run verify` 隨機失敗。同一份 dist 連跑三次，失敗集合完全不同（12/22、16/22、13/22），連本輪完全沒動過的 `/404.html` 都中過。錯誤先是 `探針錯誤：fetch failed`，修掉之後換成 `spawnSync chrome.exe ETIMEDOUT`。閘門一旦會隨機說謊，它就同時失去「擋下真問題」和「證明沒問題」兩種價值——本輪交付被它卡住，必須當場處理。

**根因（兩個，第二個被第一個蓋住）**：

1. 每個目標之間夾著一個 blocking 的 headless Chrome（`--virtual-time-budget=5000`，實耗 > 5 秒），而 astro preview 底下 Node HTTP server 的 `keepAliveTimeout` 預設是 5 秒。undici 連線池保留的 socket 在等待期間被伺服器關閉，下一次 `fetch` 撿到死 socket。
2. 探針啟動 Chrome 時沒有指定 `--user-data-dir`，會用使用者的預設設定檔，與已開著的 Chrome 搶 profile lock，並附帶 GCM 註冊、安裝 web app 等背景動作（先前執行 log 中的 `DEPRECATED_ENDPOINT`、`externally_managed_app_manager` 噪音即是），偶發卡死到逾時。

**選項**：
  - A（採用）— 修根因：`fetch` 明示 `connection: close` + 最多 3 次重試；Chrome 加 `--user-data-dir=<tmp>/chrome-profile`、`--no-first-run`、`--no-default-browser-check`、`--disable-extensions`，逾時放寬到 45 秒並重試一次。代價是失敗時最多多花數十秒，且重試會遮蔽「真的很慢」這種問題。
  - B（否決）— 整個 verify 失敗就重跑一次，人工判斷。等於把不可靠的閘門常態化，下次真的壞掉時第一反應會是「再跑一次就好」。
  - C（否決）— 放寬逾時就好，不動連線設定。只處理第二個根因，`fetch failed` 會繼續發生。
  - D（否決）— 改用 puppeteer／playwright。要引入重量級依賴，違反這個腳本「零額外套件」的設計前提。

**決定**：採 A。

**後果**：接受了「重試會掩蓋效能退化」這個壞處——如果之後 verify 整體耗時明顯變長，要回來看是不是重試在補破網，而不是直接再放寬逾時。另外，Chrome 每次跑都建新 profile，執行時間比共用 profile 略長，但換到的是與使用者當下開著的瀏覽器完全隔離。

## D-002 — verify 的三處 `catch {}` 改為帶註解的空 block，而非在 eslint 放行 `no-empty`

**背景**：`scripts/verify.mjs` 有三處刻意留空的 `catch {}`（等 server 就緒的重試、收尾 kill server 的兩處），被 eslint `no-empty` 擋下，上一輪 WORKLOG 記為待決。本輪 hook 再次擋住交付。

**選項**：
  - A（採用）— 在每個 catch block 內寫下「為什麼這裡可以吞掉例外」的註解。`no-empty` 不會回報含註解的 block，規則維持全域啟用。
  - B（否決）— 在 eslint config 對該檔放行 `no-empty`。整個檔案從此不受這條規則保護，未來新增的真·漏接例外不會被抓到。
  - C（否決）— 改寫成具名 no-op 函式。多一層間接，可讀性反而比一行註解差。

**決定**：採 A。

**後果**：往後在這個檔案新增空 catch 時，必須寫出理由才過得了 lint——這正是想要的效果。

---

## D-003 — 分學群模板改為單一資料來源，並讓閘門以「磁碟上的實體檔」為事實來源

**背景**：`resources/tools.html` 的下載清單是手寫的，五個分學群指南頁各自又寫死一份自己的模板陣列。Week 3 落地時只更新了指南頁，tools 頁停在 Week 2——**20 份模板在下載頁上消失了四輪（Week 3、4、5、6）都沒被發現**。同一份資料有六個副本，漏掉一個不會有任何訊號。

**選項**：
  - A（採用）— 抽出 `src/config/gradTemplates.ts` 當唯一來源，指南頁改 `templatesFor(dept)`、tools 頁 `gradTemplateGroups`；再加一項 verify：讀 `public/assets/templates/` 底下所有 `grad-*.md`，逐一斷言出現在 tools.html。代價是多一層間接，且新增模板時「先放檔案再登記」會讓閘門先紅一次。
  - B（否決）— 只把缺的 20 筆補進 tools.astro。這一輪會好，但六份副本還在，Week 7 一樣會漏——這正是已經發生過四次的失敗模式。
  - C（否決）— 改成 build 時掃目錄自動產生清單，不需要人工登記。標題與說明文字沒地方放，且任何暫存檔丟進該目錄都會變成公開下載項。
  - D（否決）— 只加閘門、不動資料結構。閘門會抓到漏檔，但每次都要人工在六個地方補，治標。

**決定**：採 A。閘門的事實來源刻意選「磁碟上的實體檔」而不是設定檔——若兩者都由同一份設定推導，漏登記就驗不出來，等於自己驗自己。

**後果**：新增一份模板時，順序固定為「放檔案 → 在 `gradTemplates.ts` 登記」，中間跑閘門會失敗，這是預期行為不是誤報。另外設計傳播（Week 1）目前沒有模板檔，tools 頁以一句話說明並導向其指南頁，不留空欄位。

---

## D-004 — verify 在 4321 埠被占用時直接中止，而不是讓探針去撞

**背景**：2026-08-03 一輪內 verify 連紅四次（19/27、22/27、13/27、21/27），失敗項全是連續尾段的 `探針錯誤：fetch failed`。根因是**當時有兩個 verify 併發**，兩邊都要綁 `PORT 4321`；搶不到埠的那一輪整段連不上。因為症狀像 D-001 的隨機失敗，一度被誤記成「D-001 再現」並如此回報給使用者——閘門說謊的代價不只是浪費時間，是會讓人往錯的方向修。

**選項**：
  - A（採用）— 啟動 preview 前用 `net.Socket` 試連 4321，連得上就 `process.exit(2)` 並明確說明「極可能有另一個 verify 在跑，不要靠重跑或調重試參數繞過」。代價是多一個 1.5 秒的前置檢查，且若使用者刻意在該埠跑別的東西會被擋。
  - B（否決）— 改用隨機空閘口。可行但要同步改 `npm run preview` 的設定與所有寫死 `ORIGIN` 的地方，而且會讓「兩個 verify 同時改同一份 dist」這個更根本的問題繼續隱形。
  - C（否決）— 加大重試次數。埠被別人佔住時重試幾次都一樣，只會把訊號蓋得更死（D-001 的後果欄早已警告過）。

**決定**：採 A。把「假失敗」變成「明確且可讀的中止」，是閘門可信度的前提。

**後果**：接受「同一時間只能跑一輪 verify」這個限制。若之後要平行跑（例如多個 agent 各驗各的），得先解決 dist 目錄共用的問題，不是把這道守衛拿掉。

---

## D-005 — 站內連結檢查獨立成閘門，事實來源是 build 產物

**背景**：知識庫已 118 篇、159 頁。文章的 `relatedArticles`、內文連結、各設定檔的 `href` 全是手寫字串；改檔名或刪文章時沒有任何東西會提醒。`build` 與 `verify` 都不檢查這件事——第一次跑就抓到一個死錨點（`pre-college-30-day-checklist` 指向 `pre-college-complete-guide.html#departments`，該 id 不存在），它已經在線上待了不知道多久。

**選項**：
  - A（採用）— 新增 `scripts/check-links.mjs`，掃 `dist/**/*.html` 的所有站內 `href`／`src`，比對檔案是否存在；帶錨點的再確認目標頁真的有該 id。接進 `npm run verify` 的最前面（純靜態，壞掉時省下整輪瀏覽器測試）。
  - B（否決）— 只檢查 `relatedArticles`。那只涵蓋一種來源，內文手寫連結與設定檔 href 一樣會壞。
  - C（否決）— 用現成的 link checker 套件。這個腳本系列刻意維持零額外依賴，且外部工具預設會去打外部網址，那是另一回事（外部連結的驗證屬於寫入前的人工步驟，見 CLAUDE.md）。

**決定**：採 A。**只檢查站內**——外部網址的存活由寫入前的實測負責，不放進每次都跑的閘門，否則網路一抖閘門就紅。

**後果**：改檔名或刪文章時，所有指向它的地方會在 verify 當場亮出來。代價是錨點檢查依賴 build 產物裡的 `id=`／`name=`，若未來出現 JS 動態產生的錨點會誤報——真的發生時再加白名單，不要為了假想的情況先加。

---

## D-006 — 落點方案頁的價格是「跨 repo 鏡像」，用 verify 寫死數字當獨立事實來源

**背景**：`/pages/compass.html` 要標出方案價格（NT$499／NT$899），但價格的正本在另一個 repo：`tbd-compass-app/src/lib/domain/entitlement.ts` 的 `PLANS`——那裡是實際結帳時收的金額。兩個 repo 各自部署，無法 import。這正是 D-003 的形狀：同一個事實兩份手寫，而且沒有東西保證一致。不一致的後果比模板消失更嚴重：**網站標一個價、結帳頁收另一個價**。

**選項**：
  - A（採用）— 官網側收斂成單一檔 `src/config/pricing.ts`（檔頭標明它是鏡像、正本在哪、改價順序），再在 `verify.mjs` 把 `499`／`899` 兩個數字**寫死**成該頁的 `mustContain`。
  - B（否決）— 只寫 `pricing.ts` 加註解。註解不會失敗。這就是 D-003 已經證明無效的那條路。
  - C（否決）— verify 去讀 `../tbd-compass-app/src/lib/domain/entitlement.ts`。相對路徑假設兩個 repo 永遠並排在同一層，CI 或任何人單獨 clone 這個 repo 就會壞；而且閘門不該依賴 repo 外的檔案。
  - D（延後）— compass 開一支公開的方案 JSON 端點，官網 build 時抓取，真正做到單一來源。這是對的長期解，但要動到 compass 的公開 API 與 build 期網路依賴，不在本輪範圍。

**決定**：採 A，並把 D 記為長期方向。verify 裡的數字寫死是**刻意的**——改價時該項會紅，紅的當下就是提醒「compass 那側也改了嗎」。這是把「兩份副本」的成本從「安靜地不一致」換成「吵鬧地擋住你」。

**後果**：調價要動三個地方（compass 的 `PLANS`、官網的 `pricing.ts`、`verify.mjs` 的斷言），順序是 compass 先。看起來麻煩，但它是目前唯一會在不一致時發出聲音的機制。等 D 落地後，這三處收斂回一處。

**連帶**：該頁目前設 `noindex` 且**未掛進 `site.ts` 的 nav**——付費牆尚未上線、定價也尚未拍板，先不讓它被搜尋引擎收錄或從導覽進入。上線時要做的是拿掉 `noindex={true}` 並在 nav 加一項。

---

## D-007 — 模板的 compass 出口走站內轉址；`vercel.json` 一律不得放註解鍵

**背景**：36 份模板是**會被下載的靜態檔**。檔案裡若直接寫 `tbd-compass-app.vercel.app`，
等 compass 換到正式網域，已經被學生下載到本機的副本永遠改不到——那些連結會直接死掉。

**選項**：
  - A（採用）— 模板裡一律寫 `https://tbd-web.vercel.app/pages/placement.html`，由 `vercel.json` 轉到 compass。換網域只改一行。
  - B（否決）— 模板直接寫 compass 網域。省一次跳轉，代價是已下載的副本無法補救。
  - C（否決）— 在官網開一個實體的 `placement.astro` 頁做 JS 跳轉。多一個要維護的頁，且對不執行 JS 的環境無效。

**決定**：採 A。用 `permanent: false`（302）而非 301，因為目的地本身就是暫時網域，
301 會被瀏覽器與搜尋引擎長期快取，換網域時反而更難收拾。查詢字串（`utm_*`）Vercel 自動帶過去。

**後果 —— 這一則真正的重點**：`vercel.json` 是**嚴格 schema 的 JSON**，
`redirects[]` 只接受 `source` / `destination` / `permanent` / `statusCode` / `has` / `missing`。
多放任何一個鍵（例如用 `"_comment"` 假裝成註解）會讓整份設定驗證失敗，
**Vercel 在 build 開始前就中止部署**。

這個坑實際發生過：PR #18 的第一版把上面那段理由寫成 `"_comment"` 放進轉址物件，
CI 的 Vercel check 直接 `failure`，而且 `target_url` 只給一個
`vercel.com/docs/.../project-configuration` 的通用連結、**沒有 build log**——
因為根本還沒 build。辨識方式就是這個：**失敗連到設定文件而非部署 log ＝ 設定檔無效**。

因此 `vercel.json` 的任何理由一律寫在這裡，不寫在檔案裡。JSON 沒有註解，
而 Vercel 也不允許拿多餘的鍵當註解用。
