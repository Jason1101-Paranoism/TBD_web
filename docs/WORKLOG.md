# WORKLOG

每次交付前寫一則。最新的在最上面。主檔只留最近 15 則，其餘由 `archive-docs.js` 移到 `docs/archive/`。

**只寫可觀察的行為差異。** 「已優化」「更完善」「重構得更清楚」不是變更描述，是形容詞。

---

## 條目模板（複製這段）

```markdown
## #001｜YYYY-MM-DD｜<一句話摘要>

**Scope**：這一輪要做的
**Non-scope**：明確不做的（空著＝還沒想清楚）
**變更檔案**：
- `path/to/file.py` — 做了什麼

**閘門證據**：
- G1 語法：PASS
- G2 boot：PASS（import 零 DB 連線）
- G3 smoke：NOT RUN（無測試 DB）← 寫原因，不要寫「略過」
- G4 migration：N/A（未動 schema）
- 測試：PASS（42 passed）

**計畫／決策異動**：勾掉 PLAN 的哪幾項；新增了 D-0xx 嗎
**風險與待確認**：
**下一步**：            ← 絕對不能空。下次開場的自動簡報只讀這一欄。
```

---

## #007｜2026-08-03｜還清三項技術債＋知識庫首頁去冗餘

**Scope**：①#006 下一步列的三項技術債全部處理 ②知識庫首頁（`resources.astro`）的冗餘與優化。
**Non-scope**：知識庫首頁的視覺改版、文章內容調整、Week 7。

**變更檔案**：
- `scripts/verify.mjs` — ①新增 `portInUse()`，啟動 preview 前若 4321 已被占用就 `exit 2` 並說明原因（見 D-004）②在啟動 preview 前先跑站內連結檢查，壞掉直接中止
- `scripts/check-links.mjs` — **新增**。掃 `dist/**/*.html` 全部站內連結，比對檔案存在與錨點存在（見 D-005）
- `src/content/articles/pre-college-30-day-checklist.mdx` — 修死錨點：`pre-college-complete-guide.html#departments` 該 id 不存在，改指向各科系建議實際的起點 `#stem`，連結文字同步改為「各科系準備建議」以與目標一致
- `src/layouts/BaseLayout.astro` — `tailwind` 加 `/* global */` 宣告（它是 CDN 注入的執行期全域，規則沒錯、是缺宣告，所以宣告而非關規則）
- `src/config/gradTemplates.ts` — 新增 `gradGuides` / `gradGuideByDept`：「學群 → 完整指南」的唯一資料來源（含設計傳播，故不能用 `gradTemplateGroups` 代替）
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 改讀 `gradGuideByDept`；順手修掉 sort comparator 的未使用參數
- `src/pages/pages/guides/graduate-application.astro` — `GUIDE_BY_TRACK` 由 `gradGuides` 產生
- `src/pages/pages/resources.astro` — ①六筆手寫的分學群指南搜尋資料改由 `gradGuides` 展開 ②主題指南 Tab3 移除與「快速入口」重複的 3 個資源頁連結，標籤由「備審面試與資源」改為「備審與面試」 ③刪除未使用的 `DIM_NAMES` ④工具頁的搜尋描述由「理工研究所五套模板等」更新為五個學群
- `src/pages/pages/faq.astro` — 移除未使用的 `site` import

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁）
- G3 smoke：PASS（`npm run verify` 27/27）
- 站內連結：PASS（159 頁掃描，**首次執行抓到 1 個死錨點**，已修）
- eslint：`npx eslint src scripts` **0 error 0 warning**（本輪之前是 1 error 3 warning，全部清掉）
- 埠守衛：以真實佔用 4321 的 server 實測，verify 如預期 `exit 2` 並印出說明
- 產物抽查：對照表頁與知識庫首頁各含 6 個學群指南連結（單一來源生效）；Tab3 已無資源頁連結

**計畫／決策異動**：新增 D-004（埠占用直接中止）、D-005（站內連結閘門，事實來源是 build 產物、只檢查站內）。

**風險與待確認**：
- 「學群 → 指南」現在單一來源，但**六份指南頁本身的 `title` 仍各自寫死**，與 `gradGuides.label` 沒有機制保證一致。目前兩邊相同，是靠人工對齊。
- 錨點檢查依賴產物裡的靜態 `id=`／`name=`；若日後出現 JS 動態產生的錨點會誤報。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。技術面已無掛帳項目；若要再往前一步，可考慮把「指南頁 title 與 `gradGuides.label` 一致」也納入閘門。

---

## #006｜2026-08-03｜分學群系列補外部權威來源（12 篇）＋把本輪教訓寫進 CLAUDE.md

**Scope**：結清 #004 留下的「其餘 21 篇零外部連結」，重點是當時說找不到來源的商管財經與設計傳播兩軌；並把這幾輪踩到的驗證陷阱固化成規範。
**Non-scope**：新增文章、視覺調整、`BaseLayout.astro` 既有的 `tailwind is not defined` lint error（仍未處理）。

**變更檔案**：
- `src/content/articles/` 共 12 篇補上外部來源（只加在內文已經叫讀者去查的位置）：
  - 商管財經：`business-graduate-choose`（AACSB 認證校院查詢、NDLTD）、`business-graduate-proposal`（公開資訊觀測站、主計總處、政府資料開放平臺）
  - 設計傳播：`design-graduate-choose`（NDLTD、新一代設計展、金點設計獎）、`design-graduate-portfolio`（新一代設計展、金點設計獎）
  - 理工：`engineering-graduate-timeline`（國科會大專生研究計畫）、`engineering-graduate-proposal`（Scholar、NDLTD、學術倫理中心）、`engineering-graduate-cv`（學術倫理中心）
  - 生醫：`biomed-graduate-proposal`／`biomed-graduate-oral`（臺灣學術倫理教育資源中心）、`biomed-graduate-timeline`（政府資料開放平臺）
  - 人文社科：`humanities-graduate-proposal`（華藝、臺灣期刊論文索引、NDLTD、Scholar）
  - 藝術：`arts-graduate-cv`（藝術銀行 `artbank.tfaf.org.tw`）
- `CLAUDE.md` — 新增「驗證時的四個陷阱」（查 dist 不查 src／RWD 寬度別用 `--window-size`／外部網址先實測／PowerShell 中文亂碼）與「新增分學群模板」節（實體檔 → `gradTemplates.ts` 登記 → verify 的固定順序）
- `~/.claude/skills/fullstack-flow/references/gotchas.md` — 同一批教訓的泛用英文版（**不在本 repo 版控內**，換機器要另外帶）

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁）
- G3 smoke：PASS（`npm run verify` 27/27）
- 外部連結：13 個網址逐一實測，全部 200。`www.stat.gov.tw` 首次 DNS 解析失敗、重試 200 且公共 DNS 查得到（104.18.0.120），屬本機解析器抖動；藝術銀行早先用 `artbank.ntmofa.gov.tw` 兩次解不出來，改用可解析的 `artbank.tfaf.org.tw`

**風險與待確認**：
- **~~verify 隨機失敗再現~~ → 根因已查明，不是 D-001**（本欄原先寫成「D-001 首次再現」，是錯的，更正於此）。本輪 verify 連續三次紅：19/27、22/27、13/27，加上另一路的 21/27。四次的共同特徵是**失敗項全是 `探針錯誤：fetch failed`，而且是從某一點開始的連續尾段**，不是 D-001 那種「失敗集合每次都不同、連沒動過的 404 頁都中」的隨機分布。
  實際原因：**當時有兩個 `npm run verify` 併發**（主線與一個背景 agent 各跑各的），兩邊都要綁 `PORT 4321` 起 astro preview，後啟動的那個搶不到／先啟動的被擠掉，於是從某個目標開始整段 fetch 不到。等背景工作結束後單獨重跑，**27/27，一次就過**。
  另外查過：磁碟上沒有我自己腳本殘留的 Chrome（`--user-data-dir` 指向 scratchpad 的進程數為 0），當時的 29 個 chrome 進程是使用者自己的瀏覽器，與此無關。
  **處置原則：整批尾段失敗先確認有沒有第二個 verify／preview 在跑，而不是去調重試參數。** D-001 的重試機制在這個情境下幫不上忙——埠被佔住時重試幾次都一樣。真正該做的是讓 verify 在 4321 已被佔用時**明確報錯而不是靜默失敗**，這一項列入下一步。
- 藝術類群仍有 4 篇（timeline／choose 以外）沒有外部來源；藝術的展覽與駐村資訊分散在各館所，沒有單一權威入口可引。
- 這兩個 commit 當下沒寫 WORKLOG，是事後補記（違反「當輪沒記＝違規」）。補記時是靠 `git show` 逐檔取回實際新增的網址，不是憑印象。

**下一步**：Week 7 素材到位後同一套結構落地（`docs/content-plans/` 目前最新為 Week 6）。技術面三項：①**`scripts/verify.mjs` 應在 4321 埠已被占用時明確中止並說明原因**（本輪四次紅字全出於此，卻表現成「隨機失敗」，差點被誤記成 D-001 再現）②`BaseLayout.astro` 的 lint error 已掛帳多輪 ③篇數已達 118，值得評估加一道「站內連結全掃、404 即失敗」的閘門——`relatedArticles` 指向的 slug 目前無人把關。

---

## #005｜2026-08-03｜人工目視 1280／375（結清連續三輪的掛帳）＋修掉一處重複文字

**Scope**：把連續三輪掛帳的人工目視補做完：Week 5／6 兩個指南頁、Week 6 五篇文章、本輪新增的 tools 頁分學群區塊與階段 1 的 series-nav。
**Non-scope**：目視發現的排版偏好調整（卡片 3+2 換行留白、學群標題字級）——不是缺陷，未動。

**變更檔案**：
- `src/layouts/ArticleLayout.astro` — series-nav 的學群指南按鈕移除 `{track}：` 前綴。label 本身已含學群名，原本會渲染成「理工：理工研究所申請指南」「藝術：藝術研究所申請指南」

**閘門證據**：
- G3 smoke：PASS（`npm run verify` 27/27）
- 人工目視：**已執行**，1280 與 375 兩個寬度，量測 + 截圖：
  - 橫向溢出：tools／graduate-recommend-vs-exam／graduate-arts／arts-graduate-oral 四頁在 375 皆為 `scrollWidth == clientWidth`，過寬元素 0 個
  - 目視：tools 頁五組學群卡片分組清楚；375 下 6 顆學群指南按鈕垂直堆疊、無截斷

**工具方法（下次要用）**：Claude in Chrome 擴充功能未連線，改用本機 Chrome。**但 `--window-size` 在這台機器上量不到窄寬度**——Windows 有視窗最小寬度，指定 375 實際會得到 485，加上顯示縮放一度量到 497，早期截圖「內容被切掉」全部是這個造成的假象，不是版面 bug。正確作法是走 DevTools Protocol 的 `Emulation.setDeviceMetricsOverride`，才拿得到真正的 375。腳本留在 scratchpad（`shoot.mjs` 全頁截圖＋溢出量測、`shoot-at.mjs` 捲到選擇器截視窗）。

**風險與待確認**：
- 目視只覆蓋 5 頁的關鍵區塊，不是全站逐頁。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。另掛帳：分學群系列其餘 21 篇的外部來源（商管財經與設計傳播兩軌尚未找到合適的權威來源）。

---

## #004｜2026-08-03｜補內外部連結：找回下載頁上消失四輪的 20 份模板、階段1／4 的死路、分學群系列的第一批外部來源

**Scope**：使用者驗收 Week 6 後要求盤點「哪些地方需要優化、需要增加內外部連結」，授權動到 Week 1–5 的既有檔案。三件事：①模板下載頁漏檔 ②研究所系列的斷點 ③分學群系列補外部權威來源。
**Non-scope**：既有頁面的視覺改版、新增文章、社群素材、`BaseLayout.astro` 既有的 `tailwind is not defined` lint error（不在本輪範圍，只回報）。

**變更檔案**：
- `src/config/gradTemplates.ts` — **新增**。五學群 × 五份模板的唯一資料來源（見 D-003）
- `src/pages/pages/guides/graduate-{engineering,biomed,business,humanities,arts}.astro` — 五頁的本地 `templates` 陣列改為 `templatesFor('<學群>')`，渲染結果不變
- `src/pages/pages/resources/tools.astro` — 新增「研究所推甄：分學群工具包」區塊（依學群分組、各附指南連結）；原本混在通用清單裡的 5 筆理工模板移入該區塊；meta description 補上五學群
- `public/css/tbd-pages.css` — 新增 `.grad-toolkit-group/.grad-toolkit-title/.grad-toolkit-guide`（25 張卡需要分組標題，否則連成一片）
- `src/layouts/ArticleLayout.astro` — `seriesNav` 新增 `guides` 欄位：當 `others` 為空（階段 1 推甄vs考試、階段 4 聯繫教授沒有分學群專屬文）時，橫向軸改列六份學群指南，不再是死路
- `src/content/articles/{arts,humanities,engineering,biomed}-graduate-choose.mdx` — 在「內文已經叫讀者去查論文／計畫」的位置補上查詢入口：臺灣博碩士論文知識加值系統、GRB 政府研究資訊系統、Google 學術搜尋、華藝線上圖書館
- `src/content/articles/arts-graduate-proposal.mdx` — 常見錯誤節補上國藝會補助（對應「忽略製作成本」那一項）
- `src/content/articles/arts-graduate-oral.mdx` — 補兩處內文連結（→ cv、→ proposal、→ choose）；原本內文站內連結只有 1 個，五篇中最少
- `src/content/articles/{arts,design,humanities,stem,cs-ai,business,medical}-application.mdx` — relatedArticles 各補一筆，從大學端各科系文向前導流到對應學群的研究所指南
- `scripts/verify.mjs` — 新增 2 項：①tools.html 必須包含磁碟上每一份 `grad-*.md`（事實來源是檔案系統，不是設定檔）②階段 1 文章的橫向出口必須是六份學群指南

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁，與上輪相同——本輪未新增頁面）
- G2 boot：N/A（靜態站）
- G3 smoke：PASS（`npm run verify` **27/27**，含新增的 2 項）
- G4 migration：N/A
- eslint：`npx eslint src scripts` → 1 error 3 warnings，**全部為既有問題且都不在本輪改動的行上**：`BaseLayout.astro:68 'tailwind' is not defined`（Tailwind CDN 的 inline config）、`faq.astro:3 site 未使用`、`resources.astro:433 DIM_NAMES 未使用`、`ArticleLayout.astro:124 b 未使用`
- 產物抽查：`dist/pages/resources/tools.html` 含 29 個模板 `.md` 連結（4 通用 + 25 分學群，與磁碟一致）；四篇 choose 文與 proposal 文的外部連結都進了 build

**修正**：向使用者回報的第二項發現「通用研究所文完全沒有向下連到學群版（0 處）」**是錯的**。我只 grep 了 `.mdx` 原始碼，沒看 layout 渲染結果——`ArticleLayout` 的 `series-nav` 早就自動產生了同階段各學群連結，藝術版也已自動長出。實際查 build 產物，六篇通用文中五篇各有 5 個學群連結，只有階段 1 的 `graduate-recommend-vs-exam` 是 0（因為沒有任何學群有階段 1 專屬文）。本輪修的是這個真正的洞，不是原先誤判的那個。**教訓：判斷「頁面上有沒有這個連結」要查 `dist/`，查 `src/` 只能證明「不是手寫的」。**

**計畫／決策異動**：新增 D-003（分學群模板單一資料來源＋閘門以磁碟為事實來源）。

**風險與待確認**：
- 五個分學群指南頁改吃共用資料後，渲染結果靠 verify 的既有工具包測試把關（五頁都有一項），但那些測試只斷言「工具包標題＋一個錨點」，不逐張比對卡片內容。若日後有人改動 `gradTemplates.ts` 的文案，指南頁會跟著變而閘門不會擋——這是單一來源的預期代價。
- 外部連結目前只補在四篇 choose 文與一篇 proposal 文。分學群系列其餘 21 篇仍為零外部連結，商管財經與設計傳播兩軌尚未找到合適的權威來源。
- 藝術銀行（`artbank.ntmofa.gov.tw`）DNS 解析失敗，未採用；需要時要另外找正確網域。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。另兩件掛帳：①人工目視 1280／375 已連續兩輪掛帳，本輪又動了 tools 頁的新版型（25 張卡分五組），**這一頁的目視優先度最高** ②分學群系列其餘 21 篇的外部來源尚未補。

---

## #003｜2026-08-03｜Week 6 藝術類群落地：5 篇文章＋指南頁＋5 份模板

**Scope**：把 `docs/content-plans/Week6_…藝術類群…md` 轉成知識庫資產，沿用 Week 2–5 的一週一包結構（5 篇分科文＋1 個 Guide 頁＋5 份雙格式模板＋註冊）。
**Non-scope**：既有頁面的視覺調整、新增 IG／Threads 社群素材、Day 1／Day 4 不另寫專屬文（沿用通用文）、規劃文件第十節列的 12 份工具只落地其中 5 份（沿用前四週的五件式工具包，未擴充）。

**變更檔案**：
- `src/content/articles/arts-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇，`departmentGroup: 藝術`、`gradStage` 2／3／5／6／7、`order` 6.1–6.5，各帶 3 則 faqItems
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#arts-tips` 區塊與對應 tocItem（Day 4 沿用通用文，同 stem-／biomed-／business-／humanities-tips）
- `src/pages/pages/guides/graduate-arts.astro` — 新增指南頁：路線快篩三卡（改以「作品脈絡／現場表現／創作契合」三問切入，而非人文社科的文字代表作）、七階段 rail、工具包、CTA
- `public/assets/templates/grad-arts-{school-compare,contact-email,proposal-framework,portfolio-checklist,oral-checklist}.{md,csv}` — 新增 5 份模板 × 2 格式
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 補上 `藝術`
- `src/pages/pages/guides/graduate-application.astro` — `GUIDE_BY_TRACK` 補上 `藝術`（對照表的藝術欄本身是資料驅動，自動長出）
- `src/pages/pages/resources.astro` — 搜尋資料補上藝術指南一筆，註解「五份」改「六份」
- `src/config/resourceCategories.ts` — 匯總卡 desc 補上藝術（五個學群→六個）
- `scripts/verify.mjs` — 新增 2 個測試項（藝術指南頁工具包＋arts-tips 錨點、藝術時程文的分軌 relatedArticles），並在既有兩項的 mustContain 補上 `graduate-arts.html` 與對照表的藝術欄位標題連結

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁；上輪 150，+6 = 5 篇文章 + 1 指南頁）
- G2 boot：N/A（靜態站，無 server 端初始化）
- G3 smoke：PASS（`npm run verify` **25/25**，含新增的 2 項）
- G4 migration：N/A（未動 schema，沿用既有 frontmatter 欄位）
- eslint：手動跑過 5 個改動檔，0 error；2 個既有 warning（`ArticleLayout` 的 `b`、`resources.astro` 的 `DIM_NAMES`）與本輪無關，未動。PostToolUse 的 eslint hook 曾回報一次 `spawnSync ETIMEDOUT`，是 spawn 逾時不是 lint 失敗，改用手動執行確認。

**計畫／決策異動**：無新增 D-0xx。`departmentGroup` 採 `藝術`（與 Week 1 的 `設計傳播` 分開，對照表因此有六欄）；命名前綴採 `arts-`，與大學端既有的 `arts-application.mdx`、`pre-college-arts.mdx` 同前綴但不衝突。

**風險與待確認**：
- 人工目視尚未執行（本輪為內容與腳本改動，未動共用樣式；新指南頁沿用 `guide-page` 既有版型與 Week 5 相同的元件）。
- 規劃文件第十節列了 12 份工具資產，本輪只做了對應五階段的 5 份。其餘 7 份（作品盤點與淘汰表、母題發展圖、作品拍攝檢核表、一分鐘創作主張等）多數已內含在這 5 份模板的分節裡，若要獨立成檔需另開一輪。
- 尚未 push；Vercel 正式部署需另行確認。

**下一步**：Week 7 素材到位後同一套結構落地（`docs/content-plans/` 目前最新為 Week 6，需先向使用者確認素材與類群）。另可考慮把「人工目視 1280／375」補做在 Week 5、Week 6 新增的兩個指南頁與 10 篇文章上——已連續兩輪掛帳。

---

## #002｜2026-07-28｜Week 5 人文社科類群落地＋修好會隨機說謊的 verify 閘門

**Scope**：把 `docs/content-plans/Week5_…人文與社會科學類群…md` 轉成知識庫資產，沿用 Week 2–4 的一週一包結構（5 篇分科文＋1 個 Guide 頁＋5 份雙格式模板＋註冊）。過程中 verify 閘門被發現會隨機失敗，一併修掉。
**Non-scope**：Week 6（下一輪）、既有頁面的視覺調整、新增 IG／Threads 社群素材、Day 1／Day 4 不另寫專屬文（沿用通用文）。

**變更檔案**：
- `src/content/articles/humanities-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇，`departmentGroup: 人文社科`、`gradStage` 2／3／5／6／7、`order` 5.1–5.5
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#humanities-tips` 區塊與對應 tocItem（Day 4 沿用通用文，同 stem-tips／biomed-tips／business-tips）
- `src/pages/pages/guides/graduate-humanities.astro` — 新增指南頁：路線快篩三卡（改以「文字代表作／限時申論／學術傳統」三問切入，而非商管的系排級距）、七階段 rail、工具包、CTA
- `public/assets/templates/grad-humanities-{school-compare,contact-email,proposal-framework,portfolio-checklist,oral-checklist}.{md,csv}` — 新增 5 份模板 × 2 格式
- `src/config/resourceCategories.ts` — 研究所推甄區新增分學群指南卡（order 8.4）
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 補上 `人文社科`
- `scripts/verify.mjs` — ①新增 2 個測試項（人文社科指南頁工具包＋humanities-tips 錨點、人文社科時程文的分軌 relatedArticles）；②`fetch` 改走 `fetchHtml()`：明示 `connection: close` + 最多 3 次重試；③Chrome 改走 `runBrowser()`：獨立 `--user-data-dir`、`--no-first-run`、`--no-default-browser-check`、`--disable-extensions`，逾時 30s→45s 並重試一次；④三處 `catch {}` 補上說明註解

**閘門證據**：
- G1 語法：PASS（`npm run build` 150 頁；上輪 144，+6 = 5 篇文章 + 1 指南頁）
- G2 boot：N/A（靜態站，無 server 端初始化）
- G3 smoke：PASS（`npm run verify` **22/22，連續兩次**；修 verify 之前同一份 dist 連跑三次是 12/22、16/22、13/22，失敗集合每次都不同）
- G4 migration：N/A（未動 schema，沿用既有 frontmatter 欄位）

**計畫／決策異動**：新增 D-001（verify 探針改為不重用連線＋獨立 Chrome profile＋重試）、D-002（三處 `catch {}` 改帶註解而非在 eslint 放行 `no-empty`）。後者結清上一輪 WORKLOG 留下的待決事項。

**風險與待確認**：
- verify 的重試會掩蓋「真的變慢」這類問題。之後若 verify 整體耗時明顯拉長，要回頭查是不是重試在補破網，而不是再放寬逾時（見 D-001 後果）。
- 人工目視尚未執行（本輪為內容與腳本改動，未動共用樣式；新指南頁沿用 `guide-page` 既有版型與 Week 4 相同的元件）。
- 尚未 push；Vercel 正式部署需另行確認。

**下一步**：Week 6 同一套結構落地（依 `docs/content-plans/` 是否已有 Week 6 規劃文件而定；目前該目錄最新為 Week 5，需先向使用者確認素材）。另可考慮把「人工目視 1280／375」補做在本輪新增的指南頁與 5 篇文章上。

---

## #001｜2026-07-28｜Week 4 商管與財經類群落地：5 篇文章＋指南頁＋5 份模板

**Scope**：把 `docs/content-plans/Week4_…商管與財經類群…md` 轉成知識庫資產，沿用 Week 2／Week 3 的一週一包結構（5 篇分科文＋1 個 Guide 頁＋5 份雙格式模板＋註冊）。
**Non-scope**：Week 5 人文社科（下一輪）、既有頁面的視覺調整、新增 IG／Threads 社群素材。

**變更檔案**：
- `src/content/articles/business-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇，`departmentGroup: 商管財經`、`gradStage` 2／3／5／6／7、`order` 4.1–4.5
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#business-tips` 區塊與對應 tocItem（Day 4 沿用通用文的做法，同 stem-tips／biomed-tips）
- `src/pages/pages/guides/graduate-business.astro` — 新增指南頁：路線快篩三卡、七階段 rail、工具包、CTA
- `public/assets/templates/grad-business-{school-compare,contact-email,proposal-framework,portfolio-checklist,oral-checklist}.{md,csv}` — 新增 5 份模板 × 2 格式
- `src/config/resourceCategories.ts` — 研究所推甄區新增分學群指南卡（order 8.3）
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 補上 `商管財經`，並補回漏掉的 `生醫`（Week 3 遺漏，導致生醫文的麵包屑指南層回退到通用指南）
- `scripts/verify.mjs` — 新增 2 個測試項（商管指南頁工具包＋business-tips 錨點、商管時程文的分軌 relatedArticles）

**閘門證據**：
- G1 語法：PASS（`npm run build` 144 頁）
- G2 boot：N/A（靜態站，無 server 端初始化）
- G3 smoke：PASS（`npm run verify` 20/20，含新增的 2 項）
- G4 migration：N/A（未動 schema，沿用既有 frontmatter 欄位）

**計畫／決策異動**：無新增 D-0xx。命名前綴沿用學群慣例採 `business-`（與大學端的 `business-application.mdx` 同前綴但不衝突）。

**風險與待確認**：
- `scripts/verify.mjs` 有 3 處既有的 `catch {}` 被 eslint `no-empty` 擋下（行 152／265／267），是刻意的 best-effort 清理，與本輪改動無關，未動。要嘛在 eslint config 對該檔放行 `no-empty`，要嘛改寫成具名 no-op，待決定。
- 尚未 push；Vercel 正式部署需另行確認。

**下一步**：Week 5 人文社科同一套結構落地（`humanities-graduate-*` 5 篇＋`graduate-humanities.astro`＋5 份模板＋`#humanities-tips`＋註冊 order 8.4）。
