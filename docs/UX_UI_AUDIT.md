# TBD Studio 全站 UX／UI 稽核報告

> 稽核日期:2026-07-06 · 對象:https://tbd-web.vercel.app(正式站,commit `76dff9d`)
> 方法:6 組平行審查——3 組跨裝置實機截圖(1440/768/390/360,手機以 iframe 法繞過 headless 500px clamp)+ 元件系統盤點 + 資訊架構與轉換路徑盤點 + WCAG 2.1 AA 靜態稽核;關鍵指控由主稽核員親自複核截圖證實。
> 截圖證據:session scratchpad `audit\v1|v2|v3\`(近百張,含全頁分段)。

---

## 1. Executive Summary

**整體體質:中上。** 品牌調性(理性、可信、專業、透明)在視覺與文案上是達標的:hero 版式、深色收尾 CTA、footer 全站統一;文章頁的 TOC、系列導覽、FAQ 是示範級;案例頁有真 tab、去識別化聲明、SARI 方法與具體交付物。**問題不在「不像樣」,而在三個系統性缺口:**

1. **轉換路徑有壞掉的承諾與看不見的價格。** 服務頁「你的狀況」6 張分流卡全部只跳到方案區頂端,和卡上寫的「→ 方案 C」對不上;NT$3,500 只在首頁第 10 屏與兩個子頁 FAQ 出現,主服務頁隻字未提;手機文章頁只剩最底部一個轉換點。
2. **手機端有三個真實破版/迷航點。** 96 篇文章的麵包屑在 390px 逐字豎排(已截圖證實);知識庫首頁 31 屏、搜尋框埋在第 5.3 屏;768 時程軸把「備審上傳/二階面試」兩張關鍵卡藏在畫面外且無任何可滑提示。
3. **信任面有低級傷害。** 404 是 Vercel 預設英文工程頁;同一句家長引言逐字出現在 3 頁;首頁寫「86 篇」實際 96 篇;四套方法論模型(首頁 4 步/流程頁 6 Phase/About T·B·D/案例 4 Phase)互不對齊。

**好消息:** Top 10 問題裡有 7 個是 XS–S 成本,一個 Sprint 內可以把 Critical 與 High 全部清掉,不需要動資訊架構;真正需要重構的只有知識庫首頁的區塊順序與服務頁的分流機制。

### 驗收標準 11 問的答案

| # | 問題 | 答案 |
|---|------|------|
| 1 | 全站頁面與模板數 | 內容頁約 130(96 文章+17 指南+7 一級頁+4 服務子頁+4 資源頁+首頁+portfolio-guide),**10 種模板**:首頁(Tailwind)、一級頁、服務子頁五段式、指南 hub、學群指南(rail+模板)、ArticleLayout、知識庫 hub、資源頁、portfolio-guide(獨立)、轉址頁;**缺第 11 種:404** |
| 2 | 最需優化的五頁 | ①services ②resources ③文章模板(ArticleLayout) ④首頁 ⑤cases(+全站件:404)——詳見 `UX_UI_PAGE_PRIORITY.md` |
| 3 | 每頁核心任務清楚嗎 | 一級頁 hero 全數通過 5 秒測試(services 勉強);任務清楚,但「完成任務的機制」(分流錨點、搜尋位置)壞掉或錯位 |
| 4 | 首次進站 5 秒懂 TBD? | **通過**——首頁 kicker+H1+副標明確;弱點在下一步(管道卡無可點暗示、無家長入口) |
| 5 | 三種身分能找到入口? | 高中生 ✓;研究所 ✓(服務子頁+知識庫指南);**家長 ✗**——付費決策者只有知識庫第 5 張卡與 services 第 5 情境卡(還直接外丟 LINE) |
| 6 | 知識庫→下一篇/服務? | 下一篇 ✓(系列導覽/延伸閱讀佳);**→服務 ✗**(無就地連結,要繞主導覽 2 次點擊) |
| 7 | 案例易瀏覽/比較/信任? | 瀏覽 ✓(真 tab+hash 深連結);比較 △(切 tab 不捲動、手機 tabs 不 sticky→只有第 1 案被看完);信任 △(去識別化聲明 ✓,但同句引言×3) |
| 8 | 手機阻礙 | 麵包屑豎排(96 篇)、resources 31 屏、services 表格裁切無提示、文章唯一轉換點在頁底、部分觸控目標 30–40px |
| 9 | 一天內可完成 | 見 Quick Wins(§10):404 頁、麵包屑修復、`--tbd-mid` 對比、狀況卡錨點、價格摘要卡、86→96、redirect 帶 #plans 等 12 項 |
| 10 | 需要重新設計 IA 的 | 知識庫首頁區塊順序(搜尋前置+列表收合)、服務頁三套分類收斂、方法論模型統一——僅此三項,主導覽 7 項不需動 |
| 11 | 下個 Sprint 該做什麼 | `UX_UI_IMPLEMENTATION_PLAN.md` Phase 1 全部(12 項,約 3–5 天)+ Phase 2 的 resources 重排 |

---

## 2. 完整頁面清單

URL 慣例:`format:'file'`,全部 `.html` 結尾。轉換 CTA 除特別標註外均為「預約策略諮詢」→ LINE。

### 內容頁

| 頁面(H1) | URL | 頁面目的 | 主要使用者 | 主要 CTA | 密度 | UX 風險 | 優先級 |
|---|---|---|---|---|---|---|---|
| 把零散經歷,整理成教授看得懂的申請策略 | `/` | 品牌 Landing/總入口 | 混合 | 預約(hero+pricing) | 高(11 屏) | 中 | P1 |
| 讓學生的故事,成為被錄取的理由 | `/pages/cases.html` | 7 案例信任建立 | 混合 | 預約 | 高(單案 9 屏) | 中 | P1 |
| 先判斷管道,再選方案,然後逐步備齊 | `/pages/services.html` | 分流:狀況→服務→方案(已併入 plans/audience) | 混合 | 預約 | 高(10.7 屏) | **高** | **P0** |
| 知道該做什麼、知道什麼時候做 | `/pages/process.html` | 申請時程+合作 SOP | 混合 | 預約 | 高(5.2 屏) | 中 | P1 |
| 升學路上,你需要知道的事 | `/pages/resources.html` | 知識庫總入口(搜尋/篩選/指南) | 學生 | 文章卡+中段 inline CTA | 極高(31 屏) | **高** | **P0** |
| 你可能想先問的事 | `/pages/faq.html` | 售前疑慮排除(10 題) | 混合 | 預約 | 低中(3.6 屏) | 低 | P2 |
| 我們相信,申請策略是一種思維訓練 | `/pages/about.html` | 品牌信念+邊界 | 家長偏重 | 預約 | 中(5.5 屏) | 低 | P2 |
| 服務子頁 ×4(個申/特選/研究所/面試) | `/pages/services/*.html` | 單一管道詳情(五段式) | 依管道 | 預約(客製文案) | 中(5.2 屏) | 低 | P2 |
| 主題指南 ×12 | `/pages/guides/*.html` | 主題 hub | 依主題 | 預約(guide-*) | 高 | 低 | P2 |
| 學群指南 ×2(設計/理工) | `/pages/guides/graduate-{design,engineering}.html` | 學群 hub(七階段 rail+模板) | 研究所 | 預約 | 高(8 屏) | 中(半孤立) | P2 |
| 知識文章 ×96 | `/pages/resources/{slug}.html` | SEO 內容/社群落地 | 學生/家長 | 側欄+底部預約 | 高(7 屏) | **高(麵包屑)** | **P0** |
| 工具與模板下載 | `/pages/resources/tools.html` | 8 組模板下載 | 學生 | 下載鈕 | 中(7 屏) | 中(孤立) | P2 |
| 社群資源庫 | `/pages/resources/library.html` | IG 懶人包(外部 Sheet) | 學生 | 開啟/下載 | 高(12+ 屏) | 中(失敗態) | P2 |
| 大學面試題庫 | `/pages/resources/interview-bank.html` | 20 題+科系追問 | 高中生 | 預約 | 高(11 屏) | 低 | P3 |
| 高中生 Portfolio 建置指南 | `/pages/portfolio-guide.html` | 獨立長頁指南 | 高中生 | 預約 | 高(7.5 屏) | 中(nav 漂移) | P2 |

### 轉址頁與缺頁

| URL | 現況 | 問題 |
|---|---|---|
| `/pages/plans.html`、`/pages/audience.html`、`/pages.html` | Vercel 308 → services | plans 落點在頁**頂**,離方案區 8–10 屏(應帶 `#plans`);原始碼與 CLAUDE.md 未同步清理 |
| `/pages/search.html`、`/pages/timeline.html`、`/pages/index.html` | meta-refresh 轉址 | search/pages-index 未列入 sitemap 排除清單(僅靠 noindex) |
| **404** | **不存在自訂頁** | Vercel 預設英文工程頁(Critical,見 §5-G1) |

---

## 3. 使用者旅程分析

### Journey A:焦慮型家長(高二、方向未明)——**體驗最差的一條**
- 找服務:首頁「依管道找服務」4 卡**沒有家長入口**;唯二入口是知識庫第 5 張「給家長」卡與 services 第 5 情境卡——後者點下去**直接外開 LINE**,對還在觀望的家長是驚嚇不是轉換。
- 懂差異:「不代筆」在首頁一句帶過,完整版在 about(nav 最後一項)+ FAQ;能找到,但要主動挖。
- 第一次諮詢得到什麼:首頁 pricing 卡寫得好(60 分鐘/特質盤點/策略報告/可折抵),**但在手機第 10 屏**;hero 小字「付費諮詢可全額折抵」提到付費卻不講金額,製造懸念與摩擦。
- **結論:可完成但摩擦最高。修法集中在:管道區加「我是家長」卡、hero 價格錨點、services 家長卡改站內落點。**

### Journey B:高三生(一階通過、兩週後面試)——**最順的一條**
- Nav 服務內容 → interview-training 子頁:五段式(適合對象→步驟→案例→FAQ→客製 CTA「一階通過了,面試準備從哪裡開始?」)是全站最佳模板;麵包屑齊全;知識庫另有面試指南+題庫支撐。
- 缺口:「現在來得及嗎」——子頁 FAQ 未直答時效問題;interview 子頁是四個子頁中**唯一不提價格**的(「依次數計費,初談時說明」)。
- **結論:通過。補一題「兩週前才開始準備來得及嗎」FAQ + 價格口徑對齊即近滿分。**

### Journey C:研究所申請者(推甄)
- 入口清楚:首頁管道卡/服務子頁 graduate/知識庫「研究所推甄」分類+完整指南;學群指南(設計/理工)內容紮實。
- 缺口:**學群指南不在主題指南 Tabs、不在站內搜尋索引**(半孤立,只靠分類區卡片與文章麵包屑);graduate 子頁 FAQ 有價格 ✓;語氣對大學生成立 ✓。
- **結論:通過,把學群指南納入 guideTabs 與搜尋索引即補完。**

### Journey D:從 IG/Threads 進文章的使用者
- 落地第一眼:**麵包屑豎排破版**(96 篇全中)——社群讀者的第一印象就是壞的;品牌線索只剩左上 logo。
- 閱讀:行寬略寬(桌機 45–50 字/行)之外,TOC 收合、系列導覽、FAQ、延伸閱讀都是示範級。
- 下一步:下一篇 ✓;**到服務頁無就地連結**(要繞 Nav,2 次點擊,全站最弱轉換路徑);手機側欄 CTA 被隱藏,唯一轉換點在文末。
- **結論:部分通過。修麵包屑+文章底部加「相關服務」一行連結,這條旅程立刻及格。**

### Journey E:比較型使用者(挑顧問)
- 信任資產:7 案例真 tab+hash 可分享、去識別化聲明、SARI/交付物/KPI 具體、about 的邊界聲明(不代筆/不保證/不套模板/不捏造)誠實有力。
- 信任破口:**同一句家長引言逐字出現 3 頁**(cases/college/special)——「真實案例」讀起來像模板;**價格要挖到子頁 FAQ**;顧問背景/團隊資訊過度抽象(about 無人物);四套方法論名詞不對齊(比較型使用者會截圖比對)。
- **結論:勉強通過。引言去重+價格前置+方法論統一是信任面前三刀。**

### Journey F:回訪找舊文章
- 搜尋框在手機**第 5.3 屏**,前面隔著新手起步、主題指南 Tabs、6 組情境區;91 張卡全載(31 屏);學群指南搜不到。
- 記得分類的人可用 chips;記得指南的人要知道去第幾個 tab。
- **結論:不通過。搜尋前置是 P0。**

---

## 4. 全站共通問題(跨頁系統件)

依加權分排序(權重:使用者影響 40%/轉換 25%/頻率 15%/信任 10%/成本反向 10%,各維 1–5 分)。

### G1|404 頁不存在(Critical)
| 欄位 | 內容 |
|---|---|
| 頁面 | 任何失效網址(本站剛做過大量轉址,死鏈機率不低) |
| 區塊/元件 | 無 `src/pages/404.astro` |
| 問題 | Vercel 預設英文工程頁:「404: NOT_FOUND / ID: sfo1::…」+外連文件,無 logo、無中文、無返回路徑,還暴露內部 ID |
| 使用者影響 | 全部;家長從 IG/LINE 點到失效連結會判定「網站壞掉」 |
| 嚴重度 | Critical |
| 建議 | 新增 `404.astro` 套 BaseLayout:「找不到這個頁面」+首頁/服務/知識庫/FAQ 四入口+LINE CTA;Astro 輸出 404.html 後 Vercel 自動採用 |
| 修改範例 | H1「這個頁面搬家了或不存在」;lead「網站近期改版過,你要找的內容可能換了位置——從下面四個入口重新出發,或直接問我們。」 |
| 開發成本 | S |
| 共用元件影響 | 無(新頁) |
| 優先級/加權分 | **P0 / 3.65** |

### G2|文章麵包屑手機逐字豎排(已截圖證實)
| 欄位 | 內容 |
|---|---|
| 頁面 | 全部 96 篇文章(390px) |
| 區塊/元件 | `ArticleLayout.astro` breadcrumb + `tbd-pages.css:97` `.breadcrumb` |
| 問題 | 4 層路徑時「首/頁」「知/識/庫」被壓成一行一字直排,正文第一眼就是破版 |
| 使用者影響 | 社群導流的主受眾(Journey D 的第一印象) |
| 嚴重度 | High |
| 建議 | `.breadcrumb a,.breadcrumb span{white-space:nowrap}` + 容器 `flex-wrap:wrap`;或 ≤560px 摺疊成「‹ 所屬指南」單層 |
| 修改範例 | 手機顯示:`‹ 理工研究所申請指南`(單層可點) |
| 開發成本 | XS–S |
| 共用元件影響 | 是(ArticleLayout 全文章) |
| 優先級/加權分 | **P0 / 3.85** |

### G3|卡片可點暗示系統性缺失(手機零 affordance)
| 欄位 | 內容 |
|---|---|
| 頁面 | 首頁管道卡/知識庫指南卡/新手卡、services 情境卡、cases 延伸卡、resources guide-card |
| 區塊/元件 | 兩種並存做法:services 用 inline `cursor:pointer`(手機無效),article-card 用 `:has()` 右下圓鈕但整卡 hover 只有標題可點 |
| 問題 | 手機使用者無法分辨「資訊卡」與「連結卡」;article-card 視覺暗示整卡可點、實際只有標題可點(可用性陷阱) |
| 使用者影響 | 全站瀏覽者;直接壓低頁間流動率 |
| 嚴重度 | Medium(量大) |
| 建議 | 新增 `.card--link`(整卡 `<a>`+右上 chevron+hover/focus 抬升),統一規則:列表型整卡可點、內容型標題可點;逐頁替換 inline 寫法 |
| 修改範例 | 卡右下加「了解服務 →」microcopy(首頁管道卡)、「→」箭頭(指南卡) |
| 開發成本 | S–M(元件 S+替換 M) |
| 共用元件影響 | 是(cards 家族) |
| 優先級/加權分 | **P1 / 3.80** |

### G4|正文對比 4.25:1 未達標(一行修全站)
`--tbd-mid #767995` 用於全部文章內文/card-desc/lead/表格(WCAG 1.4.3 需 4.5:1)。**修法:`tbd-theme.css:3` 改 `#6A6D89`(≈4.9:1),視覺幾乎無感。** P0/XS/加權 3.55。連帶修:`.article-status` 徽章 2.74:1、footer 低透明白字(.3/.4→.6)、`.case-more-status` 2.54:1。

### G5|手機轉換點斷層
文章側欄 CTA 在 ≤1023px 隱藏(僅剩文末)、首頁/cases/process 中段 7–9 屏無任何 CTA、無 sticky 機制(唯一常駐是頂欄小「策略諮詢」)。**建議:先做內容型中段 inline CTA(cases 回饋區後、首頁案例區後、process 泳道後各一行文字連結),Phase 3 再評估底部 sticky bar。** P1/S/加權 3.55。

### G6|方法論四套模型不對齊
首頁「Mapping→Positioning→Strategy→Asset Delivery」4 步 vs process「6 Phase SOP」vs about「T·B·D 三字」vs 案例「策略定位/素材工程/文件系統/應答強化」4 Phase——比較型使用者與回訪者要記四套名詞。**建議:選 6 Phase 當唯一骨架,首頁 4 步映射為 Phase 分組別名,案例 Phase 名對齊,about 的 T·B·D 保留為品牌敘事但註明對應。** P1/M(文案為主)/加權 3.40。

### G7|CTA 文案單一+價格揭露不均
全站 30+ 顆 LINE CTA 幾乎全是「預約策略諮詢」;唯一情境化文案在知識庫中段。NT$3,500 只出現在首頁 pricing/faq/college/graduate,**services 主頁與 special/interview 子頁零價格**。低承諾階梯(模板下載/題庫)已存在但未被當 CTA 用。P1/S/加權 3.3(併入各頁修法)。

### G8|工程與文件債(信任的地基)
`css/` 目錄 6 檔過期副本仍被 git 追蹤(CLAUDE.md 卻寫「已不存在」);audience/pages-index 原始碼未清;首頁「86 篇」實際 96;`--tbd-border`/`--tbd-bg` 引用未定義(plan-table 邊框色錯誤);`.faq-list/.faq-item` 雙定義互蓋;死 CSS `.timeline`;utm 一級頁 hero/bottom 共用無法區分。P1/S(打包一次清)/加權 2.6–3.0。

### G9|可及性四高項(詳見 §7)
skip link 全站缺、portfolio-guide 9 個 h1、process tabs 有 `role="tab"` 無 `aria-selected`、按鈕族零 `:focus-visible`/`:disabled`。

---

## 5. 各頁面問題(依頁彙整)

> 完整逐條(含視窗/證據截圖檔名)見各代理原始報告;此處收斂為可執行清單。格式:`[嚴重度/成本] 問題 → 修法`。

### 5.1 services(P0)
- **[High/S] 狀況卡錨點壞承諾**:6 卡全部 `href="#plans"`,卡上卻寫「→ 方案 C」;海外卡承諾「預約初談」卻同樣落在方案區 → 方案卡加 `id="plan-a..d"`,狀況卡指向對應錨點;海外卡直連 LINE。
- **[High/S] 主頁零價格** → 03 方案區尾加「費用怎麼計算」摘要卡(NT$3,500 可折抵+正式方案依範圍報價),與子頁 FAQ 口徑一致。
- **[Med/S] 管道表格 390/768 裁切無提示**(第 3 欄只露「主」字)→ `.table-wrap` 右緣漸層遮罩+「← 左右滑動」;或改掛 `.plan-table`。
- **[Med/S] 10.7 屏無頁內錨點** → hero 下加錨點膠囊(你的狀況/適合誰/服務項目/方案)。
- **[Med/XS] 家長情境卡直接外開 LINE** → 改站內落點+卡內明確「用 LINE 問 →」鈕。
- **[Med/M] 三套分類系統疊加**(狀況/管道表/方案)→ Phase 2:02 服務清單改手風琴、方案卡產品化(含交付物+價格線索)。
- [Low] 海外/大陸管道斷頭路、02 區與表格第 4 欄重複、群組標題列視覺。

### 5.2 resources(P0)
- **[High/S] 搜尋埋 5.3 屏** → 搜尋框+分類 chips 上移到 hero 正下方(或 hero 內嵌)。
- **[High/M] 91 卡全載 31 屏** → 每分類預設 3–6 張+「展開全部 N 篇」。
- **[High/S] tools/library/interview-bank 孤立**(僅第三 tab 一張卡)→ hero 下加「模板下載/懶人包/面試題庫」快速鏈或固定入口卡。
- [Med/S] 學群指南納入 guideTabs 與搜尋索引;[Low] 新手卡加箭頭、指南卡加一句副標、hero 帶「96 篇」數字。

### 5.3 文章模板 ArticleLayout(P0,96 篇)
- **[High/XS] 麵包屑豎排**(G2)。
- **[Med/S] 文章→服務無就地連結** → 底部 CTA 區加一行「這篇對應的服務:研究所推甄輔導 →」(依 category 自動對應服務子頁,資料驅動一次做全站)。
- [Low/XS] 桌機行寬收 5–10%;[Low] 手機品牌線索(kicker 前加「TBD 知識庫」小字或保留 logo 即可)。

### 5.4 首頁(P1)
- [Med/S] 管道區加第 5 張「我是家長」卡;[Med/S] hero 小字改「NT$3,500,可全額折抵 → 詳情」錨點;[Med/S] 案例列 4 筆不可點 → 每筆加連結至 cases 對應 tab;[Med/M] 11 屏加 3 顆錨點 chip(服務/案例/費用);[Low/XS] nav 首頁 active 判定(`/` vs `/index.html`)、H1 孤字「略」加 `text-wrap:balance`、「86 篇」改 96(或改「近百篇」免維護);[Low/XS] 底部主 CTA 藍/黃兩套色統一。

### 5.5 cases(P1)
- **[Med/XS] 切 tab 不捲動** → tab click 後 `scrollIntoView`。
- **[Med/S] 手機 tabs 不 sticky、7 案只有第 1 案被看到** → tabs sticky 化或每案底部加「看下一個案例 →」。
- **[Med/S] 同句引言×3**(G 信任)→ 每頁換不同真實引言。
- [Med/S] 中段 7–9 屏無 CTA → 回饋卡後加一行 inline CTA;[Low] 延伸卡整卡可點、輪廓卡對齊。

### 5.6 process(P1)
- **[High/S] 768 時程軸第 4 卡貼齊右緣,「備審上傳/二階面試」被藏** → 右緣漸層遮罩+flex-basis 改比例值保證露半卡+「往右滑 →」。
- [Med/S] 手機泳道塌成單欄後無 lane 標記 → 每塊加「學生/TBD」badge;[Low/XS] track-tab 補 `aria-selected`;[Low-Med/M] 科大甄選軌缺席。

### 5.7 其他頁
- **faq**:手風琴圖示語意不明(換 chevron SVG+open 旋轉,XS);補「家長可以參與嗎」等 2–3 題;費用分類旁直接露 NT$3,500 摘要。
- **about**:品質最好;手機 hero 下 250px 空白(XS)、X 圖示廉價(XS)、底部雙鈕手機全寬(XS)。
- **服務子頁**:hero「查看服務方案」改帶 `#plans`(XS);interview 價格口徑(XS);桌機適合對象卡 3 欄(S)。
- **tools/library/interview-bank**:library **Sheet 失敗無空狀態(實測抓到全空白)** → loading skeleton+失敗 fallback(M);下載鈕加「下載」動詞/↓(XS);模板卡 badge 分「高中/研究所」(S)。
- **portfolio-guide**:私有 nav 多「申請時程」項與主站漂移(S);9 個 h1(S);步驟鈕零 ARIA(S)。
- **plans redirect**:目標改 `/pages/services.html#plans`(XS)。
- **學群指南**:hero lead 9 行砍到 3–4 行(S)。

---

## 6. Mobile 專項彙總

| 問題 | 頁面範圍 | 嚴重度 |
|---|---|---|
| 麵包屑逐字豎排 | 96 篇文章 | High |
| resources 31 屏+搜尋 5.3 屏 | 知識庫首頁 | High |
| services 表格裁切無滑動提示 | services(390/768) | Medium |
| process 時程軸 768 藏卡 | process | High(768) |
| 卡片零可點暗示 | 全站 | Medium |
| 文章唯一轉換點在頁底 | 96 篇 | Medium |
| cases tabs 不 sticky+切換不捲動 | cases | Medium |
| 泳道單欄無 lane 標記 | process | Medium |
| 觸控目標 30–40px(選單開關 40/32、filter-pill 34、搜尋鈕 34、TOC 展開 30) | 多頁 | Low(2.5.8 24px 有過) |
| 漢堡選單無 active 標記 | 全站 | Medium |
| 手機 hero 下大段空白 | about | Low |

**確認無恙**:全部 8 個服務信任層頁面 scrollWidth==clientWidth(無頁面級水平溢出);文章 TOC 收合、series rail、FAQ 版面手機全部成立。

---

## 7. Accessibility 問題(WCAG 2.1 AA)

實測計算對比值與逐項結論(完整證據見可及性代理報告):

| # | 問題 | WCAG | 嚴重度/成本 |
|---|---|---|---|
| 1 | `--tbd-mid` #767995 正文 4.25:1(需 4.5)——全站量體最大 | 1.4.3 | High/XS(改 #6A6D89) |
| 2 | 全站無 skip link(固定 header+7 項 nav) | 2.4.1 | High/S |
| 3 | portfolio-guide 9 個 `<h1>` | 1.3.1/2.4.6 | High/S |
| 4 | process track-tab 有 `role="tab"` 無 `aria-selected`(cases 有,同站不一致) | 4.1.2 | High/XS |
| 5 | 首頁與 resources 無 `<main>` landmark | 1.3.1 | Med/S |
| 6 | `#results-count` 無 `aria-live`(篩選結果不播報) | 4.1.3 | Med/XS |
| 7 | `.resources-dept-select:focus{outline:none}`;全站僅 2 條自訂 focus 規則 | 2.4.7 | Med/XS(全域 `:focus-visible` 規則) |
| 8 | 低透明小字(footer .3/.4 白、case-more-status .7)2.5–3.5:1 | 1.4.3 | Med/XS |
| 9 | cases-tab/track-tab active 態近乎僅靠顏色;portfolio-guide 步驟鈕零 ARIA | 1.4.1/4.1.2 | Med/S |
| 10 | reduced-motion 漏網:`animate-pulse`(無限循環)、guidePanelFade、hover 位移、chevron 旋轉 | 2.3.3 | Low-Med/XS |

**做得好**:原生 details/summary 手風琴、TOC toggle ARIA 完整、img alt 全覆蓋、`target=_blank` rel 全有、`aria-current="page"`、rail 節點有圖例(非僅靠顏色)、搜尋框有 aria-label。

---

## 8. 優先級矩陣(加權分排序)

評分:使用者影響 40%+轉換 25%+頻率 15%+信任 10%+成本反向 10%,各維 1–5。

| # | 問題 | 使 | 轉 | 頻 | 信 | 本 | 總分 | 級 |
|--:|---|--:|--:|--:|--:|--:|--:|---|
| 1 | services 狀況卡錨點壞承諾 | 5 | 5 | 3 | 3 | 5 | **4.50** | P0 |
| 2 | services 主頁零價格 | 4 | 5 | 3 | 4 | 5 | **4.20** | P0 |
| 3 | 文章麵包屑豎排(96 篇) | 4 | 2 | 5 | 5 | 5 | **3.85** | P0 |
| 4 | resources 搜尋埋 5.3 屏/31 屏 | 5 | 3 | 4 | 2 | 3 | **3.85** | P0 |
| 5 | 卡片可點暗示系統缺失 | 4 | 4 | 4 | 2 | 4 | **3.80** | P1 |
| 6 | 404 預設頁 | 4 | 3 | 2 | 5 | 5 | **3.65** | P0 |
| 7 | 正文對比 4.25:1 | 4 | 2 | 5 | 2 | 5 | **3.55** | P0 |
| 8 | 手機轉換點斷層(文章/長頁中段) | 3 | 5 | 4 | 1 | 4 | **3.55** | P1 |
| 9 | cases tab 捲動/sticky/單案可見 | 4 | 3 | 3 | 2 | 5 | **3.45** | P1 |
| 10 | process 768 藏卡 | 4 | 3 | 2 | 3 | 5 | **3.45** | P1 |
| 11 | 方法論四套不對齊 | 4 | 3 | 3 | 4 | 2 | **3.40** | P1 |
| 12 | 家長分眾入口缺失 | 3 | 4 | 3 | 2 | 4 | **3.25** | P1 |
| 13 | services 表格裁切無提示 | 4 | 2 | 3 | 2 | 4 | **3.20** | P1 |
| 14 | tools/library/題庫孤立 | 3 | 3 | 3 | 2 | 5 | **3.10** | P1 |
| 15 | CTA 單一/低承諾階梯缺 | 3 | 4 | 3 | 1 | 3 | **3.00** | P1 |
| 16 | 漢堡選單/nav active 缺 | 3 | 2 | 4 | 2 | 5 | **2.95** | P2 |
| 17 | focus-visible/disabled 全缺 | 3 | 1 | 4 | 2 | 5 | **2.85** | P2 |
| 18 | a11y 四高項包(skip link/h1/aria-selected/main) | 3 | 1 | 3 | 3 | 4 | **2.75** | P2 |
| 19 | 同句引言×3 | 2 | 3 | 2 | 5 | 4 | **2.75** | P2 |
| 20 | 學群指南半孤立 | 3 | 2 | 2 | 2 | 5 | **2.65** | P2 |
| 21 | 工程債包(css/殘留/86 篇/undefined token/faq 雙定義) | 2 | 1 | 3 | 4 | 4 | **2.45** | P2 |
| 22 | library 失敗態 | 3 | 1 | 1 | 4 | 3 | **2.30** | P2 |
| 23 | portfolio-guide nav 漂移 | 2 | 1 | 2 | 3 | 4 | **2.15** | P3 |
| 24 | 觸控目標/reduced-motion 漏網 | 2 | 1 | 3 | 1 | 4 | **2.10** | P3 |
| 25 | utm hero/bottom 共用 | 1 | 2 | 3 | 1 | 5 | **1.90** | P3 |

---

## 9. 改版建議(結構層)

只有三件事需要「重新設計」,其餘都是修繕:

1. **resources 區塊重排**(Phase 2):hero → 搜尋+chips+快速鏈(工具/懶人包/題庫)→ 新手起步 → 主題指南 Tabs → 情境區 → 分類列表(每類收合)。原則:工具型使用者(搜尋)前置,導購型內容居中。
2. **services 分流機制重做**(Phase 2):狀況卡→帶錨點直達方案;方案卡產品化(名稱+適合誰+含什麼+價格線索);02 服務清單收成手風琴;三套分類收斂為「狀況→方案」一條主線+「深入了解」支線。
3. **方法論統一**(Phase 2,文案工程):6 Phase 為唯一骨架,其餘映射。

**明確不建議做的**:拆 process 頁(5.2 屏不長,「制度節點↔TBD 介入」對照是價值);拆 cases 為列表+詳情(7 案 tab 制是合理折衷,>10 案再拆);動主導覽 7 項(心智模型成立);把網站改造成促銷風(現有調性是資產)。

---

## 10. Quick Wins(一天內可完成清單)

1. `404.astro`(S)
2. 麵包屑 nowrap/摺疊(XS)
3. `--tbd-mid` → `#6A6D89` + 定義 `--tbd-border`/`--tbd-bg`(XS)
4. services 方案錨點 `#plan-a..d` + 狀況卡對位 + plans redirect/子頁 CTA 帶 `#plans`(S)
5. services「費用怎麼計算」摘要卡(S)
6. cases tab click `scrollIntoView`(XS)
7. process track-tab `aria-selected`(XS)
8. 首頁 nav active 修 `/`、漢堡選單 active、86→96(XS)
9. faq 手風琴 chevron(XS)
10. 全域 `:focus-visible` 規則 + dept-select outline 還原(XS)
11. footer 低透明白字 .6(XS)
12. `.table-wrap`/`.track-timeline` 右緣漸層+滑動提示(S)

## 11. 中期重構建議(2–6 週節奏)

- **Phase 2**(結構):resources 重排、services 分流重做、方法論統一、`.card--link` 元件化+全站替換、家長入口(首頁第 5 卡+parents-guide 動線)、文章→服務就地連結(category 對應,資料驅動)。
- **Phase 3**(功能/轉換):cases sticky tabs+「下一個案例」、手機 sticky CTA 實驗(A/B 或先看 GA 捲動數據)、低承諾階梯 CTA(模板下載當第一轉換)、library 失敗態+skeleton、學群指南進搜尋索引、utm 規範化(hero/bottom 分開)、Design Token 第二波(字級/間距/陰影,見 COMPONENT_AUDIT)。
- 詳細工作分解見 `UX_UI_IMPLEMENTATION_PLAN.md`。
