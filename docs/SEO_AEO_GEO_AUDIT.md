# AEO／SEO／GEO 稽核與優化方案

- 稽核日期：2026-09-06
- 稽核對象：TBD web（`https://tbd-web.vercel.app`），Astro 5 static，176 頁建置產出
- 稽核基準：本機 `npm run build` 產出的 `dist/`；`git diff origin/main` 對 `src/layouts`、`src/config`、`public`、`astro.config.mjs`、`vercel.json` 無差異，故**本報告所述即為正式站現況**
- 方法：對 179 個 HTML 產出做程式化掃描（canonical／title／description／h1／heading 階層／img alt／內部連結／結構化資料／字數）＋ 內部連結圖分析（扣除導覽與頁尾的「內文連結」入站數）＋ 資產與載入路徑檢查

---

## 0. 一句話結論

**內容與結構化資料的底子是好的**（134 篇長文、119 篇有 FAQPage、麵包屑齊全、零死連結、零孤兒頁）；
**真正在扣分的是「送達層」**——一張 11.7 MB 的首頁主圖、production 用 Tailwind Play CDN、CSS 五層 @import 串連。
這三件事同時傷 Core Web Vitals、社群預覽與 AI 抓取，而且都不需要改內容就能修。

---

## 1. 現況盤點（掃描結果）

| 項目 | 數值 |
|---|---|
| 建置頁數 | 176（`dist` 內 HTML 179，含 3 個舊建置殘留） |
| sitemap 收錄 | 171 筆 |
| 知識庫文章 | 134 篇（`src/content/articles/*.mdx`） |
| 有 `seoTitle` | 134／134 |
| 有 FAQ 結構化資料 | 119／134 |
| 有 `updatedDate` | **0／134** |
| 含表格的文章 | 21／134 |
| 死連結（內部） | 0 |
| 孤兒文章（無內文入站連結） | 0 |
| 圖片缺 alt | 0 |
| 結構化資料型別統計 | EducationalOrganization 171／WebSite 171／BreadcrumbList 159／Article 134／FAQPage 120／CollectionPage 21／ItemList 10／Service 4 |

做得好、**不要動**的部分：麵包屑三～四層（含「所屬指南」層）、hub-and-spoke 內部連結、研究所 7 階段 × 學群矩陣導覽、逐篇 `seoTitle`、FAQPage 覆蓋率 89%、`skip-link` 與 `aria` 標註、`utm_*` 一致性。

---

## 2. 發現清單

### P0 — 送達層（同時影響排名、社群、AI 抓取）

**S-01｜首頁 LCP 主圖 11.7 MB**
`public/assets/images/TBD_Landing Page Banner.png` = 11,677,185 bytes，6000×3375 PNG，
在 `src/pages/index.astro:53` 以 `loading="eager" fetchpriority="high"` 載入，且無 `srcset`／無 WebP／AVIF。
它就是首頁的 LCP 元素。行動網路下 LCP 幾乎必然落在 CWV「不良」區（>4s）。
額外傷害：檔名含空白（`TBD_Landing Page Banner.png`）→ 全站以 `%20` 引用，任何未正規化的抓取器都可能取不到。

**S-02｜同一張 11.7 MB 圖是全站唯一 og:image**
`src/config/site.ts:11`。LINE、Facebook、X 與多數 AI 抓取器對 OG 圖有 5–8 MB 上限，超過就**不產生預覽**。
LINE 是站上主要 CTA 通道（`lin.ee/9ciZvbA`），分享連結沒有預覽卡＝點擊率直接被砍。
且 171 頁共用同一張圖，`og:image:width`／`height` 也未標。

**S-03｜production 使用 Tailwind Play CDN**
`src/layouts/BaseLayout.astro` 於 `<head>` 同步載入 `https://cdn.tailwindcss.com` 並在執行期編譯 CSS。
這是 Tailwind 官方明示「不可用於 production」的用法：render-blocking 腳本 + 樣式在 JS 執行後才產生 → FOUC 與 CLS。
首頁大量版面（hero、卡片格線）依賴這些 class，樣式晚到就是版面跳動。

**S-04｜CSS 以五層 `@import` 串連**
`public/css/style.css` 只有 170 bytes，內含 5 個 `@import`（合計 105 KB，`tbd-pages.css` 單檔 74 KB）。
`@import` 不會平行下載，形成序列化的關鍵渲染路徑。

### P1 — 索引與一致性

**S-05｜`/pages/compass.html` 同時 `noindex` 又列在 sitemap**
`dist/pages/compass.html` 有 `<meta name="robots" content="noindex">`，但 `astro.config.mjs` 的 sitemap `filter` 沒排除它。
Search Console 會回報「已提交的網址標示為 noindex」，屬互斥訊號。

**S-06｜sitemap 完全沒有 `lastmod`**
171 筆 `<url>`，`lastmod` 出現 0 次。文章 frontmatter 已有 `publishDate`／`updatedDate`，但沒接到 sitemap。
爬取預算與重抓判斷失去唯一的機器可讀依據。

**S-07｜首頁三種 URL 寫法並存**
sitemap 寫 `https://tbd-web.vercel.app`（無斜線）、canonical 寫 `https://tbd-web.vercel.app/`、
全站導覽（`src/config/site.ts` 的 `nav`）與麵包屑則一律連 `/index.html`。三者指同一頁但字串不同。

**S-08｜134 篇文章 `dateModified` 全等於 `datePublished`**
沒有任何一篇填 `updatedDate`。文章日期集中在 2026-05～08。
對 SEO 是「內容從未維護」的訊號；對 GEO 更關鍵——生成式引擎在挑選引用來源時高度偏好近期更新。

**S-09｜正式站掛在 `tbd-web.vercel.app`**
`vercel.app` 是 public suffix，等同「別人網域下的子網域」：品牌權重無法累積、E-E-A-T 天花板低、
AI 回答引用時沒有可指認的品牌實體。`docs/DECISIONS.md`（D-013，第 128–136 行）已預期換網域，但尚未執行。

### P2 — AEO／GEO（被摘要、被引用的能力）

**A-01｜Organization schema 缺實體錨點**
`EducationalOrganization` 只有 name／url／email／description／areaServed／availableLanguage。
缺 `logo`（無此欄不會有知識面板標誌）、`sameAs`（IG `_tbd_studio`、LINE `@756etimx` 都在 `site.ts` 裡卻沒進 schema）、
`address`／`founder`。AI 引擎靠 `sameAs` 做跨平台實體消歧。

**A-02｜沒有具名作者**
`ArticleLayout` 的 `author` 一律是 `Organization: TBD Studio`，頁面顯示「TBD Studio 編輯團隊」。
升學建議屬 YMYL 邊緣領域，缺具名作者與資歷是 E-E-A-T 上最大的單一缺口。

**A-03｜沒有 `llms.txt`**
`public/` 下無此檔。這是目前生成式引擎讀取「站點自述 + 權威頁面清單」的事實標準入口。

**A-04｜134 篇只有 21 篇含表格**
生成式摘要與精選摘要都偏好可直接抽取的結構：對照表、編號步驟、定義句。
「XX vs YY」「時程規劃」「選校三層判斷」這類題目正是表格的原生形狀，目前多以段落敘述。

**A-05｜步驟／時程型文章沒有 `HowTo` schema**
研究所 7 階段系列、`pre-college-30-day-checklist`、各 `*-timeline` 都是 HowTo 的標準形狀，目前只有 Article + FAQPage。

**A-06｜`lead` 是「誤區鉤子」而非答案先行**
例：`graduate-timeline.mdx` 的 lead 以「最大誤區，是以為準備從大四上開學才開始」起手。
對人類讀者有效，但 AI 摘要抽首段時容易把**反例**當成答案。目前無任何文章有 TL;DR／重點框。

**A-07｜標題超過中文 SERP 截斷長度**
171 個 `<title>` 中，>30 字元 130 個（31–35：83、36–40：34、>40：13，最長 47）。
中文 SERP 約 30 字截斷，代表多數頁面的品牌後綴「｜TBD Studio」看不到。

**A-08｜meta description 過長**
106 頁 >90 字元（最長 123）。中文摘要約 80 字截斷。無過短者。

### P3 — 結構與內部連結

**S-10｜36 頁 heading 跳階（h2 → h4）**
來源是共用頁尾。可及性與大綱解析都受影響，單檔可修。

**S-11｜三個 hub guide 內容過薄且入站極弱**
`guides/competitions.html` 744 字、`guides/ai-era.html` 940 字、`guides/github.html` 982 字，
三者的內文入站連結各只有 1。它們是麵包屑的中層節點，薄且無人指向＝hub 沒有起作用。
另 `resources/library.html` 僅 540 字。

**S-12｜4 篇文章只有 1 個內文入站連結**
`agriculture-application`、`education-application`、`law-politics-application`、`interview-bank`。

**S-13｜`dist/` 未清空即建置**
`dist` 有 3 個已不存在於 `src` 的殘留頁（如 `pages/grad-path-quiz.html`）。
本機不影響正式站（Vercel 每次乾淨建置），但會讓本機掃描與人工驗收誤判。

---

## 3. 優化方案（定稿）

排序原則：**先修送達層（不動內容、影響全站）→ 再修訊號一致性 → 再做 AEO 內容工程**。

### 階段 A｜送達層搶救（估 1 個工作天，全站受益）

| # | 動作 | 檔案 | 驗收 |
|---|---|---|---|
| A1 | 主圖轉 WebP + 三段 `srcset`（800／1600／2400），檔名去空白改 `hero-banner`，保留 PNG 作 fallback | `public/assets/images/`、`src/pages/index.astro` | 主圖傳輸量 < 200 KB；Lighthouse LCP < 2.5s（模擬 4G） |
| A2 | 另做 1200×630 的 OG 專用圖（< 300 KB JPG），補 `og:image:width/height`、`og:image:alt` | `src/config/site.ts`、`BaseLayout.astro` | LINE／FB 分享偵錯工具能出預覽卡 |
| A3 | 拔掉 Tailwind Play CDN，改用 `@astrojs/tailwind`（建置期產出、自動 purge） | `astro.config.mjs`、`BaseLayout.astro`、`package.json` | `<head>` 無 `cdn.tailwindcss.com`；CLS < 0.1 |
| A4 | 拆掉 `style.css` 的 `@import` 串連，改由 layout 直接引 5 個檔（或建置期合併） | `public/css/style.css`、`BaseLayout.astro` | 關鍵請求鏈深度由 6 降到 2 |
| A5 | logo PNG（135 KB／220 KB）轉 WebP，頁尾 logo 補 `width/height` 與 `loading="lazy"` | `Nav.astro`、`Footer.astro` | 無 layout shift |

> A1–A5 是唯一會動到 Core Web Vitals 的一組；先做完再談其他，否則後續指標量不出來。

### 階段 B｜索引訊號一致化（估 0.5 天）

| # | 動作 | 檔案 |
|---|---|---|
| B1 | sitemap `filter` 補排除 `/pages/compass`，解掉 noindex 衝突 | `astro.config.mjs` |
| B2 | sitemap 接上 `lastmod`：用 `serialize()` 依 slug 取 `updatedDate ?? publishDate` | `astro.config.mjs` |
| B3 | 首頁 URL 收斂成一種寫法：canonical、sitemap、`nav`、麵包屑全部統一為 `/`（`/index.html` 由 `vercel.json` 301 導向 `/`） | `site.ts`、`astro.config.mjs`、`BaseLayout.astro`、`vercel.json` |
| B4 | `updatedDate` 納入內容維護流程：改稿必填，`scripts/verify.mjs` 加閘門——文章內容有 diff 但 `updatedDate` 未動就擋下 | `src/content/config.ts`、`scripts/verify.mjs` |
| B5 | `seoTitle` 收斂到 30 字內（130 頁待修）；`description` 收斂到 80 字內（106 頁待修）。做法：把「｜TBD Studio」改由 layout 視長度決定是否附加，內容側只寫本體 | `BaseLayout.astro` + 逐篇 frontmatter |
| B6 | 建置前清 `dist`（`rimraf dist && astro build`） | `package.json` |

### 階段 C｜AEO／GEO 內容工程（估 2–3 天，可分批）

| # | 動作 | 檔案 |
|---|---|---|
| C1 | Organization schema 補 `logo`、`sameAs`（IG／LINE）、`address`、`founder` | `BaseLayout.astro`、`site.ts` |
| C2 | 導入具名作者：新增 `src/config/authors.ts`（姓名、職稱、資歷、`sameAs`），frontmatter 加 `author` 欄，Article schema 的 `author` 改 `Person`，文章 hero 顯示作者列，另建 `/pages/authors/[slug]` 作者頁 | 多檔 |
| C3 | 新增 `public/llms.txt`：站點自述 + 依主題分組的權威頁面清單（21 個 guide + 各系列首篇），由建置腳本自 content collection 產生以免走鐘 | `scripts/`、`public/llms.txt` |
| C4 | 每篇文章加「重點速覽」框（3–5 條，答案先行），置於 `lead` 之後、第一個 section 之前；由 frontmatter 新欄 `keyTakeaways` 驅動，`ArticleLayout` 統一渲染 | `config.ts`、`ArticleLayout.astro`、134 篇 frontmatter |
| C5 | 對照型與時程型文章補表格（優先 40 篇：`*-timeline`、`*-choose`、`*-compare`、`admission-channels-compare`、`graduate-recommend-vs-exam`） | 文章本體 |
| C6 | 步驟／時程型文章加 `HowTo` schema：frontmatter 新增 `howToSteps`，有填才輸出 | `config.ts`、`ArticleLayout.astro` |

### 階段 D｜結構與連結補強（估 0.5 天）

| # | 動作 |
|---|---|
| D1 | 頁尾標題由 `h4` 改 `h2`（或改非標題元素），消除 36 頁跳階 |
| D2 | `guides/competitions`、`guides/ai-era`、`guides/github` 各補到 2000 字以上，並從相關文章各補 3–5 個內文連結進去 |
| D3 | `resources/library.html` 補足或併入 `resources.html` |
| D4 | 4 篇單一入站文章各補 3 個內文入站連結（從同 category 的高入站文章指入） |

---

## 4. 需要拍板的兩件事

**D-A｜自有網域**（對應 S-09，也是 `docs/DECISIONS.md` D-013 的未竟事項）
建議買 `tbdstudio.tw` 或 `.com`，Vercel 綁定後把 `tbd-web.vercel.app` 全站 301 導過去，
`site.ts` 的 `siteUrl`／`ogImage` 一併換掉，Search Console 走「變更網址」工具。
成本：網域年費 + 約 3 個月的排名重新穩定期。
**越晚做代價越高**——現在只有 171 頁要搬，內容再長就更痛。若這一題不動，階段 C 的 E-E-A-T 投資效益會被壓在天花板下。

**D-B｜作者具名程度**（對應 A-02）
三個選項：(a) 真名 + 學經歷（E-E-A-T 效益最高，但涉及個人資訊揭露）、
(b) 固定筆名 + 可查證的資歷描述（折衷）、(c) 維持「編輯團隊」（不做 C2）。
建議 (a) 或 (b)；選 (c) 的話 C2 從方案中移除，其餘不受影響。

---

## 5. 建議執行順序與量測

1. **先建立基準**：對 `/`、`/pages/resources/graduate-timeline.html`、`/pages/services.html` 三頁跑一次 PageSpeed Insights（行動版），記錄 LCP／CLS／INP。
2. 執行階段 A → 重跑同三頁，確認 LCP 進到綠燈。**A 沒過就不要往下做**。
3. 執行階段 B → Search Console 重新提交 sitemap，確認「已提交的網址標示為 noindex」歸零。
4. 階段 C、D 分批推進，每批走既有的 G1–G4 閘門與 `npm run verify`。
5. 四週後回看：Search Console 曝光／點擊、平均排名、CWV 報告；GEO 側以「在 ChatGPT／Perplexity／Google AI Overview 問 10 題目標關鍵字，記錄是否被引用」作為人工基準線。

---

## 6. 附錄：本次掃描方法

掃描以一次性 Node 腳本在 `dist/` 上執行（canonical／meta／heading／連結圖）。
若要固定成回歸檢查，建議把其中「canonical 一致性、h1 數量、死連結、noindex×sitemap 衝突」四項併入 `scripts/verify.mjs`，
其餘（字數、標題長度、入站連結分布）維持人工季度盤點即可。

---

## 7. 執行紀錄（2026-09-06 同日完成）

四個階段全數執行，唯二未做的是兩件待拍板的事（D-A 自有網域、D-B 具名作者，因此 C2 未執行）。
進度以 `progress/build-seo-progress.mjs` 追蹤（與模板進度是不同系列，版號各自獨立），
狀態由 probe 現掃 `dist/` 與 `src/` 判定，不手寫。

### 22 項發現的收尾狀態

已修 20、待拍板 2、未修 0。（原 21 項 + 執行中新發現的 S-14。）

### 三處與原方案不同的做法，理由如下

**B4：`updatedDate` 改成由 git 推導，而不是「改稿必填 + verify 閘門」。**
原方案要靠人記得填欄位、再用閘門逼他填。實際做法改成 `src/lib/contentDates.ts`
取該 `.mdx` 的最後 commit 日推導 `dateModified`，`updatedDate` 退為手動覆寫。
理由：134 篇一篇都沒填，說明這種欄位本來就會被忘記——一個不需要記得的機制，
比一個會一直提醒你的閘門可靠。副作用是 probe 也跟著改成量產出（dist 的 `dateModified`
是否晚於 `datePublished`）而不是量欄位，目前 131／134。

**B6：撤回。** 見下方 S-13。原方案要加 `rimraf` 清 dist，但前提本身不成立，
加一個沒有必要的相依不划算。

**A-07 的目標從「品牌後綴一定要塞得進去」放寬成「總長 ≤30 字」。**
若堅持讓「｜TBD Studio」（11 字）留在標題裡，等於要求標題本體壓到 19 字，
那會把 134 個標題砍到失去辨識度。實際做法是內容側只寫本體，
由 BaseLayout 在總長 ≤30 時才補品牌。這一改動讓超長標題從 130 頁降到 7 頁，
剩下 7 篇再逐一改寫。

### 一項誤判，如實撤回

**S-13「dist 未清空即建置」不成立。** 稽核當天用「dist 有 HTML 但 src 沒有同名 .astro」
判定殘留，漏掉兩種合法來源：知識庫文章來自 `[slug].astro` 動態路由，
`grad-path-quiz` 與 `portfolio-guide` 是 `public/pages/` 的靜態檔。
實際殘留頁是 0。這一項保留在清單裡並標示為誤判，不刪除。

### 一項執行中才發現的新問題

**S-14：`/pages/resources/library` 的懶人包清單是前端 fetch Google Sheet 產生的，
爬蟲與生成式引擎拿到的只有一個空殼。** 原稿把它歸類成「薄頁」，但根因不是內容少，
是內容根本不在 HTML 裡。已補上靜態的說明與長文對照連結讓這頁本身可被索引；
**清單本身仍看不到**。要讓清單也進索引得改成建置期抓取，那會讓 Vercel 建置
多一個外部網路相依（Sheet 掛掉就 build 失敗）——屬於要拍板的取捨，未擅自更動。

### 主要新增與變更的檔案

| 檔案 | 作用 |
|---|---|
| `assets-src/` | 原圖存放處，不在 public 底下，不會被部署 |
| `scripts/build-images.mjs` | 由原圖產生 WebP／JPEG 衍生圖（11.7 MB → 衍生圖合計 434 KB） |
| `tailwind.config.mjs`、`src/styles/tailwind.css` | 取代 Play CDN 的建置期 Tailwind |
| `src/lib/contentDates.ts` | 由 git 推導文章的 `dateModified` |
| `src/pages/llms.txt.ts` | 由 content collection 產生 `/llms.txt` |
| `astro.config.mjs` | sitemap 排除 noindex 頁、接上 lastmod、首頁 URL 收斂 |
| `src/content/config.ts` | 新增 `keyTakeaways`／`howToSteps`／`howToTotalTime`／`guide` 四個欄位 |
| `progress/build-seo-progress.mjs`、`progress/seo-overlay.json` | SEO 進度報告產生器 |

### 兩道閘門

`npm run build` 通過（176 頁）；`npm run verify` 40/40 通過；`npx eslint .` 無輸出。
人工目視：首頁、作品集指南、一篇長文（桌面 1280）截圖確認版面無破。

### 尚未做、需要人去點的四件事

`progress/seo-overlay.json` 的 `manualChecks` 有記：PageSpeed 前後對照、
Search Console 重新提交 sitemap、LINE／FB 分享偵錯、GEO 人工基準線。
這些都必須等**部署到正式站之後**才能做——本輪所有改動都還在工作區，未 commit、未 push。
