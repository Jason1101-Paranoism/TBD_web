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

---

## D-008 — 模板清單的事實來源改為 `scripts/template-manifest.json`，與磁碟雙向校驗

**背景**：D-003 讓閘門以「磁碟上的實體 `.md`」當事實來源，成功擋住「模板沒登記到下載頁」。
但它只擋得住**一個方向**：多了檔案沒登記會紅，少了檔案不會。

而 `docs/template-format-upgrade.md` 拍板的方向正是把 36 份模板改成 Google Sheets／Docs／Notion——
那些形式**在磁碟上不會有檔案**。第一份轉過去的模板，會讓 `templateFiles()` 掃出來的清單少一項、
`mustContain` 的斷言跟著少一項，**閘門的覆蓋範圍安靜地縮編一格，而且不會有任何訊號**。
D-003 要擋的是「模板從下載頁消失」，縮編後它剛好不再擋得住那件事。

**選項**：
  - A（採用）— 新增 `scripts/template-manifest.json` 當「有哪些模板」的事實來源，每筆宣告 `delivery: "file" | "external"`（external 需填 `url`）。閘門做雙向校驗：manifest 宣告 file 的必須在磁碟上找得到、磁碟上的 `.md` 必須登記在 manifest；tools.html 的斷言則改由 manifest 產生（file 用 `<slug>.md`、external 用 url）。
  - B（否決）— 只加一個「模板總數不得減少」的下限值。抓得到縮編，但抓不到「換掉一份、同時新增一份」這種數量不變的情況，而且下限值本身也是要手動維護的另一份事實。
  - C（否決）— 改成去 HTTP 打那些 Google／Notion 網址確認活著。真正的事實來源，但把閘門變成依賴外部網路與登入狀態；Google 對無登入的自動請求行為不穩，閘門會開始隨機紅——D-004 已經記過「閘門說謊的代價」。
  - D（否決）— 讓 `gradTemplates.ts` 兼任 manifest。它就是渲染下載頁的那份設定，拿它驗自己等於沒驗——D-003 已經明說過這件事。

**決定**：採 A。manifest 是**唯一**宣告「有哪些模板」的地方，磁碟是它的獨立對照。
換句話說，把一份模板改成外部形式，必須是一個**明確的編輯動作**（該筆改成 external 並填 url），
不能靠刪掉檔案默默發生——後者正是原本會無聲吃掉閘門的那條路徑。

**實測**（四個方向都確認會失敗，未實測的守門等於沒有守門）：
1. 磁碟多一份、manifest 沒登記 → 紅
2. manifest 說是 file，但檔案不在磁碟上（模擬轉 Sheets 只刪檔） → 紅
3. 改成 external 但沒填 url → 紅
4. 宣告一致的 external，但下載頁上沒有它的連結 → tools.html 那項紅（29/30）

**後果**：新增模板的順序從兩步變三步——**放檔案 → 登記 `template-manifest.json` → 登記 `gradTemplates.ts`／`tools.astro`**。
中間跑閘門會失敗，是預期行為。`verify.mjs` 的 `checkTemplateManifest()` 與 `checkVercelJson()`
一樣放在 build 之前：manifest 對不起來時，後面那項 tools.html 斷言本身就是用它產生的，先驗它才有意義。

---

## D-009 — 文章內文的 markdown 表格改由 CSS 統一收斂，不靠每篇包 `.table-wrapper`

**背景**：Week 8 落地時，`law-graduate-timeline.html` 在 400px 被 verify 抓到水平溢出 285px。
追下去發現不是這篇的問題：`tbd-components.css` 有一條全域 `table { min-width: 760px }`，
而唯一的手機解法（`table-layout: fixed`）只寫在 `.plan-table` 的 `@media (max-width: 640px)` 裡。

量過文章欄的實寬才看出這條規則錯得多徹底：`1120px` 容器 − `22×2` 內距 − `280px` 側欄 − `32px` gap
＝ **最寬 764px**，單欄時 `min(1120, vw) − 44`。也就是說 760px 的下限**幾乎在每個視窗寬度都會溢出**，
只有 1120px 以上的桌機剛好擦過去。裸的 markdown 表格從 Week 1 起就一直破版，
而它活了八週沒被發現，是因為 verify 清單裡每個學群只放 `*-graduate-timeline`，
**那幾篇剛好都沒有表格**——受影響的 7 篇（arts-choose／arts-cv／biomed-choose／business-choose／
education-choose／education-cv／education-proposal）一篇都沒被測過。

**選項**：
  - A（採用）— 在 `tbd-pages.css` 加 `.article-section table:not([class])`，設 `table-layout: fixed; min-width: 0; width: 100%`＋儲存格 `word-break`。一條規則同時修好已寫的與未來寫的所有文章。
  - B（否決）— 逐篇在 `.mdx` 裡把表格包進 `.table-wrapper`。Week 8 當下就是這樣先過閘門的，但它是每篇都要記得做的儀式——D-003 的 20 份模板消失，就是「靠人記得」的同一類失敗。而且結果是手機上橫向捲動，不如直接換行。
  - C（否決）— 直接把全域 `table { min-width: 760px }` 拿掉。影響範圍包含指南頁等所有頁面級表格，超出本輪需要，而那些表格目前是綠的。
  - D（否決）— 改用 `@media` 斷點處理。從上面的算式看，會溢出的區間是「幾乎全部」，斷點只是把補丁換個地方貼。

**決定**：採 A。`:not([class])` 只挑 markdown 產生的表格，手寫的 `.plan-table`、`.series-matrix`
維持原樣（它們各自已有處理）。欄數多的表格在窄螢幕會變高但完整可讀、不需橫捲，
與 `.plan-table` 既有的處理方式一致。

**實測**：修正前 `law-graduate-timeline` 溢出 285px（紅）；修正後連同兩篇從未被測過的舊文
（`education-graduate-choose`、`arts-graduate-cv`）一併加進 verify 清單，35/35 全綠。

**後果**：`.mdx` 裡的表格直接寫 markdown 即可，不需要也不應該再手動包 `.table-wrapper`。
verify 清單從此不只放每個學群的 timeline——**有表格的文章要有人守著**，否則同一類破版
會再一次靠「沒人測到」活下去。

---

## D-010 — 「markdown 標記漏印在頁面上」交給 dist 掃描閘門守，不靠寫作紀律

**背景**：2026-08-18 核對（#020）發現知識庫 25 頁、80 段的 `**` 直接以字面印在讀者眼前。
build 綠、check-links 綠、verify 35/35 全綠——沒有任何一道閘門碰得到它。
追下去發現不是一個 bug，是兩個根因、兩種形狀：

- **A 類（78 段／25 頁）**：CommonMark flanking rule 撞中文標點。粗體內容以「。？！」結尾又緊接
  文字時，收尾 `**` 的前一字是標點、後一字是文字，不成立 right-flanking → 無法收尾 → 整組吐字面。
  例：`…關鍵在第四步。**主動指出限制，反而顯示你對作品有判斷。**多數學生…`
- **B 類（1 處）**：`arts-graduate-cv.mdx` 的 `faqItems` 是**純文字欄位**，會原樣輸出到 `<p>` 與
  JSON-LD 兩處，完全不經 markdown 渲染。寫在那裡的 `**` 無論怎麼排都不會變粗體。
  #020 只歸因到 A 類，是把 dist 的 160 個 `**` 全當成同一種——實際上 A 類佔 156 個，
  剩下 4 個是 B 類同一段輸出兩次。

**選項**：
  - A（採用）— 加 `scripts/check-markdown-leak.mjs`：**build 產物裡不得出現字面 `**`**，
    再附一條源頭檢查（frontmatter 不得含 `**`，讓 B 類直接報出檔名行號）。接進 `verify.mjs`，
    與 `check-links` 同層——純靜態、不需要瀏覽器，放在起 preview 之前。
  - B（否決）— 在腳本裡模擬 CommonMark 的 flanking rule 判斷「哪些會壞」。修正時確實寫了一支
    這樣的偵測器（跑出 156 runs／25 檔），但它只抓得到 A 類，B 類完全在它的視野外——
    當閘門就是把「我對解析規則的理解」當事實來源。偵測器留在 scratchpad 當一次性工具，不進 repo。
  - C（否決）— 寫進 CLAUDE.md 的寫作規範，靠下次記得。`gradTemplates.ts:20` 的註解早就寫了
    「設計傳播有指南但沒有模板」，寫下來但沒有閘門盯——D-003／D-008 的同一種失敗形狀，這是第三次。

**決定**：採 A。事實來源是 dist，不是任何對解析規則的理解：
**只要讀者看得到 `**`，閘門就紅**，不管它是哪一種根因、也不管是不是新出現的第三種。
修正手法是把收尾 `**` 移到標點之前（`…有判斷**。`），語意不動、可腳本化，78 段一次改完。
`public/assets/templates/*.md` 是提供下載的 markdown，`**` 是它本來就該有的內容，不在掃描範圍。

**實測**：修正前 dist 160 個字面 `**`／25 頁；修正後 0。兩個分支各做一次注入測試——
往 `dist/index.html` 插一段壞粗體、往 frontmatter 插一組 `**`，閘門都 exit 1，還原後 exit 0。
`npm run verify` 35/35 全綠。

**後果**：文章寫作不需要記得任何 flanking 規則——寫壞了 verify 會擋。
代價是這條閘門對「字面 `**`」零容忍：日後若真要在頁面上顯示 `**` 字元（例如講解 markdown 語法的
文章），必須改用 HTML 實體或程式碼區塊，不能直接寫，否則得替它開例外——**開例外時要在這裡補記**。
