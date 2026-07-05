# TBD Studio UX/UI 優化實作計畫

> 依 2026-07-06 稽核(`UX_UI_AUDIT.md`)。工作量:XS≈≤1h、S≈半天、M≈1–2 天、L≈3–5 天。
> 每項完成的通用驗收底線:`npm run build` + `npm run verify` 全綠;涉及互動的項目加進 `scripts/verify.mjs` TARGETS。

---

## Phase 1:Quick Wins(不動架構,合計約 3–5 天)

| # | 工作內容 | 修改檔案 | 依賴 | 量 | 驗收方式 |
|--:|---|---|---|:-:|---|
| 1-1 | 新增 404 頁:BaseLayout+中文文案+四入口(首頁/服務/知識庫/FAQ)+LINE CTA | 新增 `src/pages/404.astro` | 無 | S | 開 `/不存在網址` 見品牌 404;Vercel 部署後實測 |
| 1-2 | 麵包屑手機修復:`white-space:nowrap`+容器 wrap;≤560px 摺疊為「‹ 所屬指南」單層 | `public/css/tbd-pages.css`(.breadcrumb)、`src/layouts/ArticleLayout.astro` | 無 | XS–S | 390 iframe 截圖:任一 4 層文章無豎排;抽 3 篇 |
| 1-3 | 對比修復:`--tbd-mid`→`#6A6D89`;定義 `--tbd-border:var(--tbd-line)`、`--tbd-bg:var(--tbd-soft)`;footer 白字 .3/.4→.6;`.article-status`/`.case-more-status` 去透明 | `public/css/tbd-theme.css`、`tbd-layout.css`、`tbd-pages.css` | 無 | XS | 重算對比 ≥4.5:1;全站目視無色偏 |
| 1-4 | services 錨點修復:方案卡加 `id="plan-a..d"`;6 張狀況卡各指對應錨點;海外卡改 LINE(帶 track);plans redirect 與 4 子頁「查看服務方案」改 `#plans` | `src/pages/pages/services.astro`、`services/*.astro`、`vercel.json` | 無 | S | 點每張狀況卡落在對應方案;舊 `/pages/plans.html` 落在方案區 |
| 1-5 | services「費用怎麼計算」摘要卡(NT$3,500 可折抵+報價邏輯);interview 子頁 FAQ 價格口徑對齊 | `services.astro`、`interview-training.astro` | 1-4 | S | 主服務頁可見價格;三處口徑一致 |
| 1-6 | cases:tab click 後 `scrollIntoView`;延伸卡整卡可點 | `src/pages/pages/cases.astro` | 無 | XS | 切 tab 視窗回到案例頂;verify cases 測項通過 |
| 1-7 | process:track-tab 補 `aria-selected` 同步;`.track-timeline` 右緣漸層遮罩+「往右滑看完整時程 →」+flex-basis 比例化保證露半卡 | `process.astro`、`tbd-pages.css` | 無 | S | 768 截圖第 4 卡半露+提示可見;SR 讀出選中 tab |
| 1-8 | services 管道表格:`.table-wrap` 右緣漸層+「← 左右滑動」小字 | `tbd-pages.css`、`services.astro` | 無 | S | 390/768 截圖有可滑暗示 |
| 1-9 | 導覽 active:`Nav.astro` isActive 支援 `/`;漢堡選單連結套 is-active | `src/components/Nav.astro`、`tbd-layout.css` | 無 | XS | 首頁 nav 粗體;手機選單標記當前頁 |
| 1-10 | 首頁小修:H1 `text-wrap:balance`;「86 篇」改「近百篇」;hero 小字改「NT$3,500,可全額折抵 → 詳情」錨到 #contact;底部 CTA 色與深色卡規則統一 | `src/pages/index.astro` | 無 | S | 390 無孤字;價格首屏可達 |
| 1-11 | a11y 包:BaseLayout skip link+各頁 `<main id="main">`(首頁/resources 補 main);全域 `:focus-visible` 規則+dept-select outline 還原;`#results-count` aria-live;faq/文章手風琴 chevron SVG;reduced-motion 補漏(`animate-pulse` 等) | `BaseLayout.astro`、`index.astro`、`resources.astro`、`tbd-base.css`、`tbd-pages.css` | 無 | S–M | Tab 鍵首個焦點=skip link;篩選後 SR 播報筆數 |
| 1-12 | 工程債清理:刪根目錄 `css/`(git rm);刪或改註 audience/pages-index 原始碼;`faq-list/faq-item` 雙定義改名分離;刪死 CSS `.timeline`;更新 CLAUDE.md 結構表 | `css/`、`src/pages/pages/{audience,index}.astro`、`tbd-pages.css`、`tbd-components.css`、`CLAUDE.md` | 無 | S | build 全綠;grep 無 `.timeline` 引用;文章 FAQ 樣式不變(截圖比對) |

## Phase 2:頁面結構改善(約 2–3 週)

| # | 工作內容 | 修改檔案 | 依賴 | 量 | 驗收方式 |
|--:|---|---|---|:-:|---|
| 2-1 | **resources 重排**:搜尋+chips+快速鏈(工具/懶人包/題庫)上移至 hero 下;每分類預設 3–6 卡+「展開全部 N 篇」;學群指南納入 guideTabs 與搜尋索引 | `resources.astro`、`resourceCategories.ts`、`tbd-pages.css` | 1-11 | L | 手機搜尋 ≤1.5 屏可達;全頁 ≤12 屏;搜「理工研究所」出指南;verify guideTab 測項 |
| 2-2 | **services 分流重做**:02 服務清單改手風琴;方案卡產品化(適合誰/含什麼/價格線索);hero 下錨點膠囊;三套分類收斂為「狀況→方案」主線 | `services.astro`、`tbd-pages.css` | 1-4、1-5 | L | 手機 ≤7 屏;狀況→方案→LINE 3 步內;5 秒測試複測 |
| 2-3 | **方法論統一**:以 6 Phase 為唯一骨架,首頁 4 步/案例 Phase 名對齊,about T·B·D 註明對應 | `index.astro`、`cases.astro`、`about.astro`、`process.astro`(文案) | 無 | M | 全站方法論名詞 grep 一致;比較型旅程複測 |
| 2-4 | **`.card--link` 元件化**:整卡連結+chevron+hover/focus 抬升;替換首頁管道卡/知識庫卡/services 情境卡 inline 寫法/cases 延伸卡 | `tbd-components.css`、各頁 astro | 無 | M | 手機截圖有可點暗示;inline `cursor:pointer` grep=0 |
| 2-5 | **家長動線**:首頁管道區第 5 張「我是家長」卡→parents-guide/服務家長段;services 家長卡改站內落點+卡內 LINE 鈕 | `index.astro`、`services.astro` | 2-2 | S | Journey A 複測:家長 3 步內到達「第一次諮詢會得到什麼」 |
| 2-6 | **文章→服務就地連結**:ArticleLayout 底部 CTA 區依 category 自動對應服務子頁(資料驅動 map) | `ArticleLayout.astro` | 無 | S | 抽研究所/面試/備審文章各 1,對應連結正確;96 篇自動生效 |
| 2-7 | cases:手機 tabs sticky 或每案底部「看下一個案例 →」;回饋區後 inline CTA;引言去重(每頁不同真實引言,**需向站主取得素材**) | `cases.astro`、`services/*.astro`、`tbd-pages.css` | 1-6;引言素材 | M | 第 2 案例曝光率(GA scroll+tab 事件)上升;同句 grep=1 處 |
| 2-8 | process 泳道手機 lane 標記(每塊「學生/TBD」badge) | `process.astro`、`tbd-pages.css` | 無 | S | 390 截圖每塊可辨歸屬 |
| 2-9 | portfolio-guide 對齊:nav 同步 7 項、h1→1+8×h2、步驟鈕 ARIA | `public/pages/portfolio-guide.html`、`portfolio-guide.js` | 無 | M | 與主站 nav 一致;axe 無 heading 錯誤 |

## Phase 3:功能與轉換優化(第 4 週起,依數據排序)

| # | 工作內容 | 修改檔案 | 依賴 | 量 | 驗收方式 |
|--:|---|---|---|:-:|---|
| 3-1 | 低承諾階梯 CTA:文章/服務頁把「下載對應模板」作為第一 CTA、諮詢為第二;utm 規範化(hero/bottom 分開,`-hero`/`-bottom` 後綴) | `ArticleLayout.astro`、各頁 | 2-6 | M | GA download_resource↑;utm 可區分位置 |
| 3-2 | 手機 sticky CTA 實驗:先看 GA scroll_75/轉換數據,再決定底部 sticky bar(僅長頁:首頁/cases/長文章);尊重 reduced-motion、可關閉 | `main.js`、`tbd-layout.css` | GA 數據 | M | A/B 或前後對照 click_consultation_cta 率 |
| 3-3 | library 失敗態:loading skeleton+「載入失敗→開雲端資料夾」fallback;考慮 build 時預渲染快照 | `library.astro` | 無 | M | 斷網模擬有 fallback;verify 加測項 |
| 3-4 | 站內搜尋強化:索引納入指南/工具/題庫(staticPages 擴充);熱門搜尋 chips | `resources.astro` | 2-1 | M | 搜「模板」「面試題」有結果 |
| 3-5 | 情境式服務推薦:狀況卡答 2 題(身分/階段)→推薦方案+對應文章(輕量 JS,無框架) | `services.astro`、`main.js` | 2-2 | L | 5 秒內得到個人化下一步;GA situation 事件 |
| 3-6 | 相關案例推薦:文章/服務頁依 category 掛「相似案例」卡(連 cases #tab) | `ArticleLayout.astro`、`services/*.astro` | 2-6 | S | 案例頁 referrer 多樣化 |
| 3-7 | Design Token 第二波:字級/間距/陰影 token 化+圓角收斂 4 檔(依 `UX_UI_COMPONENT_AUDIT.md` 清單) | `tbd-theme.css` 起 | Phase 2 完 | L | 硬編碼字級數 15→6;視覺回歸截圖比對 |
| 3-8 | 觸控目標達 44px:選單開關/filter-pill/搜尋鈕/TOC 展開鈕 | `tbd-layout.css`、`tbd-pages.css` | 無 | S | CSS 推算+實截 ≥44px |

### 建議 Sprint 切法
- **Sprint 1(本週)**:Phase 1 全部——P0 清空。
- **Sprint 2–3**:2-1、2-2、2-4、2-6(結構主菜)+ 2-5、2-8。
- **Sprint 4**:2-3、2-7、2-9 + Phase 3 依 GA 數據挑 2–3 項。
- 每個 Sprint 結束:跑六條旅程複測(A–F)+ 五視窗截圖抽查,對照本稽核基線。
