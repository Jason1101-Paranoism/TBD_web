# TBD Studio 共用元件盤點(Component Audit)

> 2026-07-06。範圍:`public/css/` 五模組、`src/components|layouts|pages`、`public/pages/portfolio-guide.html`、`public/js/`。行號以 `public/css/` 現行檔為準。
> **全域結構性事實:**①根目錄 `css/` 是 6/1 的過期副本、仍被 git 追蹤,實際載入的是 `public/css/`(BaseLayout 只引 `/css/style.css`→public)——應刪除。②首頁與 portfolio-guide 走 **Tailwind CDN**,其餘子頁走自訂設計系統——兩套渲染系統並存是最大分裂點。③`var(--tbd-border)`、`var(--tbd-bg)` 被引用但**未定義**(實質 bug)。④`--tbd-radius-sm/md/lg` 定義了但**使用 0 次**,全站圓角 15 種硬編碼。

## 逐元件盤點

### 1. Header / Mobile Navigation
- **變體**:`.site-header`(fixed、blur,`tbd-layout.css:1-10`);桌面連結僅 ≥1240px 顯示(`:87-92`),以下全用漢堡;手機選單=原生 `<details>/<summary>`(`Nav.astro:34-57`)+JS 只管關閉(`main.js:5-19`)——實作乾淨。CTA 兩變體:`--mobile`「策略諮詢」/`--desktop`「預約策略諮詢 →」。
- **不一致**:`.site-nav-cta` 圓角 8px vs 全站按鈕 999px;`.site-menu-cta` 用 `!important`;選單連結無 is-active;首頁 active 判定失效(`/` vs `/index.html`);portfolio-guide 有**私有 nav 副本且多一項「申請時程」**。
- **保留**:details/summary 機制、雙 CTA 尺寸變體。**合併/淘汰**:圓角統一 999px、移除 !important、portfolio-guide nav 同步。

### 2. Hero
- **變體**:子頁通用(`.hero`+`.kicker`+h1+`p.lead`)、指南版(+breadcrumb)、文章版(`.article-hero`)、案例版(`.case-hero` padding 覆寫)、**首頁 Tailwind 版(badge div+h1+`h2` 當副標)**。
- **不一致**:首頁副標用 `h2`(語意+樣式雙分歧)、kicker 造型不同;部分 hero 有 button-row 部分沒有。
- **保留**:子頁四件套為標準。**合併/淘汰**:首頁 hero 重寫為標準件(Phase 2);`h2` 副標寫法淘汰。

### 3. Buttons
- **變體**:`.button`(999px、min-height 48、accent 底,`tbd-components.css:2`)、`.secondary`、`.cta .button`(黃底)、sidebar 全寬、series-nav 縮小版;**不共用的**:`.site-nav-cta`(8px)、`.resources-search-btn`(7px)、`.filter-pill`、首頁 Tailwind 鈕。
- **不一致(重大)**:**全站零 `:focus-visible`、零 `:disabled`、零 `:active`**(僅 hover)。
- **保留**:`.button` 基底+secondary+cta 黃變體。**合併**:search-btn/nav-cta 收斂為尺寸變體。**必補**:`:focus-visible`(用 `--tbd-focus`)、`:disabled`。

### 4. Cards
- **變體**(圓角/內距):`.card` 24/26、`.article-card` 24/28、`.case-step-card` 22/22、`.home-case-trigger` 18/18、`.guide-card` 10/14、`.situation-card` 12/22、`.starter-step` 12/16、`.milestone-card` 12/14 等——圓角 10/12/18/22/24 五種無據。
- **不一致(重大)**:「卡片即連結」兩套做法並存——services 用 inline `text-decoration:none;cursor:pointer`(×6+,手機無 affordance)vs article-card 用 `:has()` 右下 48px 圓鈕(**整卡 hover 觸發箭頭但只有標題可點=可用性陷阱**)。
- **保留**:`.card` 基底、article-card 圓鈕視覺。**新增**:`.card--link`(整卡 `<a>`+chevron+hover/focus)取代全部 inline 寫法;規則:列表型整卡可點、內容型標題可點。圓角收斂至 token。

### 5. Tags / Badges
- **變體**:共用基底 `.kicker,.badge,.tag`(`tbd-components.css:5`,好);覆寫版(services/audience 深色小字、case 暗底黃字、guide/plan 高對比)。**未繼承的 chip 家族**:`.article-status`、`.case-result-label`、`.case-more-type`、`.filter-pill`、`.filter-chip`、`.swim-deliverable`(圓角 4px 例外)、`.tbd-tip`。
- **合併**:chip 家族收斂為 `.tag--muted/--dark/--outline` 修飾子;`.swim-deliverable` 圓角統一。`.article-status` 對比 2.74:1 需同步修色。

### 6. Tables
- **三套互相對抗的 RWD 策略**:全域 `table{min-width:760px}`+`.table-wrap`(強制橫捲,20px 圓角)/`.plan-table`+`.table-wrapper`(手機 fixed 換行,`min-width:0` 反制全域)/`.series-matrix`(460px+捲動提示,唯一有提示的)。
- **bug**:`.plan-table` 邊框 `var(--tbd-border)` 未定義→回退 currentColor。
- **保留**:`.plan-table` 手機策略、`.series-matrix-scrollhint` 模式(推廣到 `.table-wrap`)。**合併**:`.table-wrap`/`.table-wrapper` 統一;策略統一為「窄表 fixed 換行、寬表框內橫捲+漸層+提示」(即 memory 的表格慣例,補上提示層)。

### 7. Timeline / 泳道 / Rail
- `.timeline/.timeline-item`(`tbd-components.css:19-22`):**全站 0 使用=死 CSS,淘汰**。
- 實際使用:`.track-timeline`(process 水平捲,**768 藏卡無提示**)、`.swimlane`(手機塌陷後無 lane 標記)、`.guide-rail`(學群指南,**全站唯一有 focus-visible+reduced-motion 的互動元件——品質範本**)。
- **建議**:以 `.guide-rail` 的狀態處理為標準,回填 track/swimlane;track-timeline 加漸層+比例 flex-basis。

### 8. FAQ Accordion
- **兩套同名衝突**:文章版 `.faq-list>.faq-item>summary+p`(`tbd-pages.css:341-353`,全框+12px 圓角、＋/－)vs FAQ 頁 `.faq-summary/.faq-body`(`:596-618`,border-bottom、SVG chevron)——**`.faq-list/.faq-item` 定義兩次同 specificity,後者蓋前者,文章 FAQ 實際渲染是兩套混合的非預期結果**;faq.astro 另有 4 處 inline margin。
- **合併**:改名分離(`.article-faq`/`.page-faq`)或統一單一元件;chevron 語意修復(稽核 High 項)同步做。皆為原生 details/summary(保留,a11y 好)。

### 9. Breadcrumb
- 文章版:動態層級+指南層+BreadcrumbList schema(好);指南頁:手寫 3 層**無 schema**;一級頁 7 頁全無。**手機 4 層豎排破版(P0)**。
- **建議**:抽 `<Breadcrumb crumbs={...}/>` 元件(含 schema+nowrap/摺疊 RWD),指南頁換用;一級頁維持無 breadcrumb(可接受)但修 nav active 補位置感。

### 10. 文章 TOC
- `.article-toc`=`.pg-sidebar` 系統(與 portfolio-guide 共用);手機收合 toggle+scroll-spy+`display:contents` 重排——**品質良好,保留不動**。僅 `.pg-guide-toggle` 觸控 30px 需加高。

### 11. CTA 區塊
- **變體**:`.section.cta`(dark/黃鈕/28px)、`.sidebar-cta`(card/24px)、`.guide-inline-cta`(accent .06/12px)、`.inline-cta`(accent .06/16px)、`.case-pending-notice`(10px)。
- **不一致**:圓角 10/12/16/24/28 全異;`.guide-inline-cta` 與 `.inline-cta` 語意重疊。
- **合併**:兩個 inline 併為 `.cta-inline`;圓角統一 `--tbd-radius-lg`;首頁底部 CTA 色規則與深色卡統一。

### 12. Footer
- 單一來源、三欄→單欄 RWD,**一致性最佳**。小修:`.site-footer-pill` `!important` 移除;低透明白字對比(.3/.4→.6);可考慮加深層連結(工具/指南/隱私)。

### 13. 搜尋/篩選(resources)
- `.resources-search-*`(搜尋鈕 7px 圓角)、`.resources-dept-select`(**`:focus{outline:none}`**)、`.filter-pill` vs `.filter-chip` 造型邏輯不同、`mark` 高亮、`.search-empty`。
- **合併**:pill/chip 統一造型語言;搜尋鈕併入 `.button` 尺寸變體;focus outline 還原。

## Inline style 硬編碼(103 筆/13 檔)
最多:`services.astro` 30、`index.astro` 10、`graduate-engineering.astro` 8、`tools/library/interview-bank` 各 7。高頻模式→抽象目標:卡片轉連結(→`.card--link`)、`margin-top:10–24px`(→間距 token/`.section` 節奏)、`color:var(--tbd-mid)` 段落(→`.text-muted`)、`font-size:22px` 方案標題(→`.h2--sm`)、`grid-column:span 2`+`!important`(→`.grid-span-2`)。

## Design Token 建議(依優先序)

1. **立即(bug)**:`--tbd-border: var(--tbd-line)`、`--tbd-bg: var(--tbd-soft)`;`--tbd-mid` 改 `#6A6D89`(對比)。
2. **焦點**:`--tbd-focus: 2px solid var(--tbd-accent)` + 全域 `:focus-visible` 規則。
3. **圓角**:啟用並收斂為 `--tbd-radius-sm:12 / -md:16 / -lg:24 / -pill:999px`(現況 15 種→4 種;10/18/20/22/28 就近併入)。
4. **字級**:`--tbd-fs-xs:12 / -sm:13 / -base:14 / -md:15 / -lg:17 / -xl:20`(現況 15+ 種含 12.5/13.5 半值)。
5. **間距**:`--tbd-space-1:4 / -2:8 / -3:12 / -4:16 / -5:24 / -6:34`。
6. **陰影**:`--tbd-shadow-sm/-md/-lg`(收斂 4+ 種硬編碼)。
7. **z-index**:`--z-header:50 / --z-overlay:60`(backdrop 目前無 z-index)。

## 合併/淘汰總表

| 對象 | 處置 | 優先 |
|---|---|---|
| 根目錄 `css/`(6 檔) | 淘汰(git rm) | 高 |
| `--tbd-border`/`--tbd-bg` 未定義 | 新增定義 | 高 |
| `.faq-list/.faq-item` 雙定義 | 改名分離 | 高 |
| 按鈕 focus/disabled 缺失 | 新增狀態 | 高 |
| `.timeline` 死 CSS | 刪除 | 中 |
| 卡片 inline 連結寫法 ×6+ | 抽 `.card--link` | 中 |
| `.guide-inline-cta`+`.inline-cta` | 併 `.cta-inline` | 中 |
| chip 家族 ×8 | 併 `.tag` 修飾子 | 中 |
| 表格三套 RWD | 統一雙策略+提示層 | 中 |
| 圓角 15 種/字級 15 種 | token 化 | 中(Phase 3) |
| `!important` ×7 | 精確選擇器後移除 | 低 |
| 首頁 Tailwind hero | 重寫為標準件 | 中(Phase 2) |

**品質範本(補齊其他元件時的參考)**:`.guide-rail`(focus-visible+reduced-motion)、`.article-toc/.pg-sidebar`(RWD 收合+ARIA)、`Footer.astro`(單一來源)。
