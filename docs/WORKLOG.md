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

## #012｜2026-08-04｜tools.astro 分組：三個方向稿完成，三案並存待挑，未實作

**Scope**：依 CLAUDE.md 的 UI 改版三級流程（區塊改版＝先出方向稿），為
`TEMPLATE_INVENTORY.md` 待辦 4 產出可操作的 HTML 方向稿。
**Non-scope**：**不實作進站**。三個方向都保留，等挑定再動 `tools.astro`。

**背景**：通用模板從 4 份長到 11 份後，「可下載模板」變成單一平鋪網格。
這 11 份橫跨高中升學、Side Project、面試、Portfolio 四種情境，平鋪讓人難挑。

**產出**：
- Artifact（可操作）：<https://claude.ai/code/artifact/90e5ea7f-67a3-4ea7-a3de-05e1945f1072>
- 原始檔：`docs/design-drafts/tools-grouping-directions.html` — **新增目錄**。
  收進 repo 的理由：artifact 的來源檔原本只在 session 暫存目錄，那裡會被清掉，
  之後就只能把 artifact 抓回來重建。要改方向稿改這個檔再重新發布即可

**三個方向與各自的代價**：

| 方向 | 分組軸 | 主要代價 |
|---|---|---|
| 1 依準備階段 | 找方向→累積記錄→整理成果→面試→入學前 | 最後一組只有 1 份會空；假設學生分得清自己在哪一步 |
| 2 依對象分頁籤 | 高中生 7／大學生 3／研究所 26 | **沒點的頁籤等於不存在**（SEO 與探索性受損）；高中生組仍 7 份平鋪；六層防護網跨身分被迫二選一 |
| 3 依處境 | 沿用 `src/config/resourceSituations.ts` 既有的六個處境語彙 | 若不與該設定共用資料就是 D-003 的形狀；既有處境中「特選」「家長」無對應模板 |

**當輪結論**：使用者表示三個方向都可接受、三種呈現都保留，決定延後。**未挑定，未實作。**

**閘門證據**：N/A —— 本輪未動任何產品程式碼，只新增 `docs/` 底下的文件與方向稿原始檔。
`tools.astro`、`verify.mjs`、模板檔案一律未動，上一輪的 build 157 頁 / verify 28/28 仍然成立。

**計畫／決策異動**：`TEMPLATE_INVENTORY.md` 待辦 4 由「未開始」改為「方向稿完成，待挑選」。
無新增 D-0xx——分組方式尚未拍板，還不到寫決策的時候。

**風險與待確認**：
1. 三個方向的模擬裡，**推甄時程甘特圖都被移到研究所組**（它目前錯放在通用區，是 #009 放的）。
   這是三案共同的前提，但尚未經使用者確認。實作前要先問一次
2. 若選方向 3，實作範圍會從「改一頁」變成「改 `resourceSituations.ts` 加兩頁」——
   處境清單必須共用一份資料，否則同一份事實會有兩份手寫

**下一步**：本輪停在這裡。下次開場要處理的依序是——
① `git push` 兩個 branch（`feat/templates-and-compass-funnel` / `feat/paywall-scaffold-and-theme`），
push 後**立刻**打 `https://tbd-web.vercel.app/pages/placement.html` 確認回 302，
否則四份模板的 compass 出口是死的；
② 挑定分組方向並確認甘特圖歸屬，然後實作；
③ 拍板 `TEMPLATE_INVENTORY.md` 的結論（等同 D-M2）。

---

## #011｜2026-08-04｜接上斷掉的漏斗：4 份高中端模板加 compass 出口，走站內轉址而非硬寫外站網域

**Scope**：`TEMPLATE_INVENTORY.md` 第五節的待辦 3。順帶補齊 7 份新模板缺的頁尾署名。
**Non-scope**：研究所端 25 份不加出口（compass 目前沒有研究所對應功能，導到用不上的地方比不導更傷）、
`tools.astro` 的資訊架構分組、免費／付費決策本身。

**起因**：`TEMPLATE_INVENTORY.md` 盤點時實測 36 份模板的 `.md`，**零份導向 compass**。
118 篇文章 → 36 份模板 → 斷了。學生填完雷達圖、排完甘特圖，沒有任何東西告訴他
可以去把落點算出來。

**變更檔案**：
- `vercel.json` — 新增 `/pages/placement.html` → compass `/placement` 的 302 轉址
- `public/assets/templates/admission-channel-radar.{md,csv}` — 加 compass 出口（CSV 版加在表尾一列）
- `public/assets/templates/admission-main-thread.md` — 加 compass 出口
- `public/assets/templates/department-compare-prompt.md` — 加 compass 出口
- `public/assets/templates/pre-college-30day-checklist.md` — 加出口，指向 `/pages/seen.html`
  （準大學生用不到落點，對應的是經歷紀錄那條線）
- 7 份新模板的 `.md` — 補上既有慣例的頁尾署名（原本 29/36 有，7 份缺）

**為什麼走站內轉址，不直接寫 compass 網域**：
模板是**會被下載的靜態檔**。compass 目前在暫時網域（`tbd-compass-app.vercel.app`，
其首頁註解寫明「搬到 app.tbd… 後再開放索引」）。若把該網域寫進模板，網域一搬，
已經下載到學生電腦裡的副本全部變死連結，而且我們改不到。走 `/pages/placement.html`
轉址則只要改 `vercel.json` 一行。沿用既有 `/pages/seen.html` 的做法，同樣用
`permanent: false`（302）——目的地本來就是暫時的。utm 查詢字串 Vercel 會自動帶過去。

**閘門證據**：
- `npm run build`：PASS（157 頁）
- `npm run verify`：PASS 28/28
- `vercel.json`：JSON 合法性已驗
- CSV 結構：`admission-channel-radar.csv` 加列後仍 22 列 × 4 欄
- 四份模板各自命中一次出口連結（grep 確認）
- **轉址本身 NOT RUN**：`vercel.json` 的 redirects 只在 Vercel 部署後生效，
  本機 `astro preview` 實測 `/pages/placement.html` 回 **404**（預期行為）。
  **部署後必須手動打一次確認回 302 並落在 compass 的落點頁**——在那之前，
  這四份模板裡的連結是死的

**計畫／決策異動**：`TEMPLATE_INVENTORY.md` 待辦 3 完成。無新增 D-0xx。

**風險與待確認**：
1. **轉址未驗證**（見上）。這是本輪唯一沒有證據的一環，且影響四份對外檔案。
2. 這四份模板中有三份**已經在正式站上線**，改動會隨下次 push 一起生效。
3. 發現 compass 的公開鉤子頁（`tbd-compass-app` 的 `src/pages/index.astro`）內嵌了
   **第三份品牌色副本**（`--gc-*`），且其中 `--gc-mid: #767995` 是 `tbd-theme.css`
   註明「已調暗為 #6A6D89 以通過 WCAG AA」之前的舊值。屬 compass 的範圍，本輪未動。

**下一步**：push 之後第一件事是打 `https://tbd-web.vercel.app/pages/placement.html`
確認 302 生效。接著回 `TEMPLATE_INVENTORY.md` 的待辦 4（`tools.astro` 分組，要先出方向稿）
與待辦 5（含公式的 CSV 實際匯入 Google 試算表確認）。

---

## #010｜2026-08-04｜軌 A 收尾：補完剩餘 6 份模板，模板總數 30 → 36

**Scope**：`MONETIZATION_PLAN.md` 軌 A 的產品 1、2、4、5、6、7。
**Non-scope**：既有 29 份的免費／付費決策（D-M2 未拍板）、視覺統一（YY）、UX 檢核（CL）、
`tools.astro` 的資訊架構調整（見下方風險 2）。

**變更檔案**（每份皆 `.md` + `.csv` 兩格式）：
- `side-project-tracker` — 產品 7。15 個任務，CSV 帶公式：填專案開始日自動排目標完成日，
  剩餘天數 `=Cn-TODAY()` 每天更新。前六列都還沒開始寫程式，對應文章 Step 1–2
- `admission-channel-radar` — 產品 1。11 題各評 1–5 分，三管道平均分 `=AVERAGE(C5:C8)` 等自動算
- `interview-answer-material` — 產品 5。三段式自介填空 + 五題型素材表
- `interview-six-layer-prep` — 產品 6。六層逐層填
- `portfolio-reflection-guide` — 產品 2。三種反思結構各兩則
- `readme-portfolio-planner` — 產品 4。區塊檢核表 + 可直接複製的 README 公版
- `src/pages/pages/resources/tools.astro` — `downloads` 陣列 5 → 11 筆

**內容來源**：六份的維度、層序、結構全部取自既有文章，未自創另一套標準——
六層架構逐字對應 `lulu-preparation-system.mdx`、三種反思對應 `reflection-in-portfolio.mdx`、
三管道評估項目對應 `admission-channels-compare.mdx`、README 區塊對應 `readme-guide.mdx`
的「最低可行版本」、Side Project 五階段對應 `side-project-from-zero.mdx`。

**刻意不重複既有資產**：`portfolio-guide.html`（839 行六步驟指南）與 `interview-bank.astro`
（5 題型題庫，每題附「評審想看什麼」）內容已很完整，產品 4、5 只補「可填的工作表」那一層，
不重講一次內容。素材表也導向題庫頁挑題，不在模板裡再抄一份題目。

**閘門證據**：
- `npm run build`：PASS（157 頁）
- `npm run verify`：PASS **28/28**，模板不得漏檔項現在斷言 36 個檔名
- CSV 結構檢查（腳本）：7 份全部 BOM 存在、欄數一致、自我參照公式（`=Dn-`／`=Cn-`）的列號
  等於所在列、雷達圖三個 `AVERAGE` 範圍與實際資料列吻合（C5:C8／C9:C12／C13:C15）
- 人工目視：CDP 量測 `tools.html`，桌面 1280 `1265===1265`、手機 375 `375===375`，
  溢出元素清單皆空。截圖確認 11 張卡片在三欄網格正常排列

**計畫／決策異動**：軌 A 的 7 份模板全部完成（#009 一份 + 本輪六份）。無新增 D-0xx。

**風險與待確認**：
1. **公式版本只有結構驗證，沒有真的匯入 Google 試算表跑過。** 我驗的是欄數、列號參照、
   範圍對齊，這些擋得住最常見的錯位；但「Sheets 匯入後公式是否被正確識別為公式而非文字」
   要實際匯入一次才知道。建議上架前每份 CSV 各匯入一次確認。
2. **`tools.astro` 的資訊架構該重看了。** 「可下載模板」現在是 11 張卡的平鋪網格，
   而底下研究所推甄區是依學群分組的。這 11 份橫跨高中升學、Side Project、面試、Portfolio
   四種情境，平鋪讓人難挑。依 CLAUDE.md 的 UI 改版三級流程，這屬「區塊改版」，
   要先出方向稿再實作，本輪刻意不動。
3. 尚未 push。

**下一步**：兩件事二選一——(a) 處理風險 2 的 `tools.astro` 分組（要先出 2–3 個方向稿）；
(b) 進軌 A 的 W1 盤點：36 份模板逐份決定免費／付費，那同時就是在回答 D-M2。
建議先 (b)，因為 (a) 的分組方式會被 (b) 的結果影響（付費項要不要跟免費項混排是同一個問題）。

---

## #009｜2026-08-04｜新增推甄時程甘特圖模板（CSV 帶公式，首份），並把模板閘門從 25 份擴到 30 份

**Scope**：`MONETIZATION_PLAN.md` 軌 A 的產品 10。順帶修正閘門只保護 `grad-*` 的涵蓋缺口。
**Non-scope**：其餘 6 份待做模板、既有 29 份的免費／付費決策、視覺統一（YY）、UX 檢核（CL）。

**變更檔案**：
- `public/assets/templates/graduate-timeline-gantt.{md,csv}` — **新增**。17 個任務，CSV 的日期欄是公式（`=$B$2±n`），改 B2 一格全部重算
- `src/pages/pages/resources/tools.astro` — `downloads` 陣列新增第 5 筆
- `scripts/verify.mjs` — `templateFiles()` 由 `grad-` 前綴篩選改為所有 `.md`，閘門涵蓋 25 → **30 份**

**閘門證據**：
- `npm run build`：PASS（157 頁）
- `npm run verify`：PASS **28/28**，模板不得漏檔那一項現在斷言 30 個檔名
- CSV 結構：BOM 存在、每行皆 7 欄（腳本檢查）
- **公式求值模擬**：解析 CSV、以 `B2=2026/10/15` 代入求值，確認 17 列的 `=$B$2±n` 可解析、
  `=Dn-$B$2` 的列號與所在列一致、起訖未顛倒。**這一步抓到一個真的錯**——見下

**抓到並修掉的錯**：末段三列的偏移量與 `graduate-timeline.mdx` 不符。原本錄取結果落在
+90 天（送件 10/15 → 隔年 1/12），但文章寫的是「十一月底到十二月」。已改為
口試準備 +14→+40、口試 +30→+50、錄取 +45→+75，重算後為 11/14–12/04 口試、11/29–12/29 錄取，
與文章一致。**只看檔案長得對是抓不到這個的**，要把公式真的算一次。

**計畫／決策異動**：無新增 D-0xx。閘門涵蓋範圍的擴大屬 D-003 的既有原則延伸，不另立決策。

**風險與待確認**：
1. **CSV 帶公式是本站首例**，既有 29 份都沒有。代價是欄位位置變成契約——使用者在表格中間插入一列，
   該列以下的 `=Dn-$B$2` 會被試算表自動調整（沒問題），但若刪掉 B2 所在列則全表壞掉。MD 版已註明
   「CSV 才是完整工具，MD 是紙本版」。
2. 甘特圖的**色條沒有自動產生**——CSV 帶不了條件式格式。MD 裡給了四步驟自己加，並明講不加也完全可用。
   沒有在頁面上宣稱「自動產生甘特圖」。
3. 尚未 push。

**下一步**：軌 A 剩 6 份。建議順序：Side Project 追蹤板、升學管道雷達圖（這兩份同樣需要公式，
可沿用本輪的作法）→ 面試答題素材工作表、六層防護網、反思引導、README／Portfolio 規劃表（純結構）。

---

## #008｜2026-08-04｜新增落點分析方案頁（noindex、未掛 nav），價格以 verify 寫死數字防跨 repo 走鐘

**Scope**：`MONETIZATION_PLAN.md` §5.4——官網側的方案說明頁與導流。
**Non-scope**：不改 `site.ts` 的 nav（付費牆未上線，先不開入口）、不動既有頁面、不動 29 份免費模板、不碰金流（在 compass 那側）、不 push。

**變更檔案**：
- `src/pages/pages/compass.astro` — **新增**。落點分析方案頁：先講免費的三件事（落點基本結果、29 份模板、知識庫）→ 免費與付費的一句話差別 → 兩張方案卡 → CTA。設 `noindex={true}`
- `src/config/pricing.ts` — **新增**。官網側的方案資料單一來源，檔頭標明它是 compass `entitlement.ts` 的鏡像與改價順序（見 D-006）
- `public/css/tbd-pages.css` — 附加 `.pricing-*` 區塊（8 個 class）。全部走 `--tbd-*` token，未寫死色值
- `scripts/verify.mjs` — 新增 1 個測試項，`mustContain` 寫死 `NT$`／`499`／`899`／`tbd-compass-app.vercel.app`

**閘門證據**：
- `npm run build`：PASS（157 頁，較上輪 +1）
- `npm run verify`：PASS **28/28**（含新增的 1 項）
- 人工目視：改用 CDP `Emulation.setDeviceMetricsOverride` 量測（依 CLAUDE.md 陷阱 #2，不用 `--window-size`）。桌面 1280 → `scrollWidth 1265 === clientWidth 1265`；手機 375 → `375 === 375`；兩者 `overflowing` 元素清單皆為空。截圖確認：桌面三欄卡片、手機單欄堆疊、兩個 CTA 皆可見，價格 NT$499／NT$899 正確渲染
- 外部連結實測（CLAUDE.md 陷阱 #3）：`tbd-compass-app.vercel.app` 的 `/`、`/placement`、`/login` 皆回 200，才寫進頁面

**計畫／決策異動**：新增 D-006（跨 repo 價格鏡像與 verify 寫死數字）。

**風險與待確認**：
1. **頁面內容描述的付費／免費界線尚未成真。** compass 的付費牆還沒套到落點頁，`MONETIZATION_PLAN.md` §2 的 D-M2／D-M3 也未拍板。這正是設 `noindex` 且不掛 nav 的原因——目前它是給團隊對稿用的，不是對外頁。**拍板並且 compass 的 gating 實際上線之前，不要拿掉 noindex。**
2. 價格是跨 repo 鏡像，三處要同步（見 D-006）。
3. `src/config/pricing.ts` 不在 eslint config 的涵蓋範圍內（跑 eslint 得到 "File ignored because no matching configuration was supplied"）。`src/config/` 底下的其他檔案應該也一樣，本輪未動 eslint 設定。
4. 尚未 push；Vercel 正式部署需另行確認。

**下一步**：等 D-M2／D-M3 拍板。拍板後這一頁要做三件事：拿掉 `noindex={true}`、在 `src/config/site.ts` 的 nav 加入口、把文案裡「免費 vs 付費」的描述對回 compass 實際 gating 的行為。

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
- ~~六份指南頁的 `title` 仍各自寫死，與 `gradGuides.label` 沒有機制保證一致。目前兩邊相同~~ → **本輪一併解決，且原描述有誤**：兩邊本來就**不同**（頁面是「…申請**完整**指南」，label 是「…申請指南」），不是「目前相同」。這不是 bug——短版供麵包屑與搜尋結果用、全稱供頁面標題用，是兩個用途。處置：在 `GradGuide` 增加 `pageTitle` 欄位承接全稱，六個指南頁改讀 `gradGuideByDept['<學群>'].pageTitle`，兩種形式收進同一份來源並各自命名。build 產物比對，六頁的 `<title>` 與 `<h1>` 與改動前完全一致。
- 錨點檢查依賴產物裡的靜態 `id=`／`name=`；若日後出現 JS 動態產生的錨點會誤報。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。技術面已無掛帳項目——`gradGuides` 現在同時是 href、短名、頁標題與搜尋說明的唯一來源，新增學群只要加一筆。

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
